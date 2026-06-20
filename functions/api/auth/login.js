import {
  checkRateLimit,
  createSessionToken,
  hashPassword,
  json,
  normalizeEmail,
  PASSWORD_ITERATIONS,
  publicUser,
  resolveRole,
  userKey,
  verifyPassword,
} from '../../_lib/auth.js';

export async function onRequestPost(context) {
  try {
    const limited = await checkRateLimit(context, 'login', 15, 900);
    if (limited) return limited;
    const body = await context.request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const user = await context.env.MORYTORY_ORDERS.get(userKey(email), 'json');

    const passwordIterations = Number(user?.passwordIterations || 120000);
    if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash, passwordIterations))) {
      return json({ error: 'Email hoặc mật khẩu không đúng.' }, 401);
    }

    if (passwordIterations < PASSWORD_ITERATIONS) {
      const upgraded = await hashPassword(password);
      user.passwordSalt = upgraded.salt;
      user.passwordHash = upgraded.hash;
      user.passwordIterations = PASSWORD_ITERATIONS;
      user.updatedAt = new Date().toISOString();
    }

    const resolvedRole = resolveRole(user.email, context.env, user.role);
    const roleChanged = resolvedRole !== user.role;
    if (roleChanged) {
      user.role = resolvedRole;
      user.updatedAt = new Date().toISOString();
    }
    if (passwordIterations < PASSWORD_ITERATIONS || roleChanged) {
      await context.env.MORYTORY_ORDERS.put(userKey(user.email), JSON.stringify(user));
    }

    const token = await createSessionToken(user, context.env);
    return json({ token, user: publicUser(user) });
  } catch (error) {
    return json({ error: error.message || 'Không thể đăng nhập.' }, 500);
  }
}
