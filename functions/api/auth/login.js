import {
  createSessionToken,
  json,
  normalizeEmail,
  publicUser,
  resolveRole,
  userKey,
  verifyPassword,
} from '../../_lib/auth.js';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const user = await context.env.MORYTORY_ORDERS.get(userKey(email), 'json');

    if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash))) {
      return json({ error: 'Email hoặc mật khẩu không đúng.' }, 401);
    }

    const resolvedRole = resolveRole(user.email, context.env, user.role);
    if (resolvedRole !== user.role) {
      user.role = resolvedRole;
      user.updatedAt = new Date().toISOString();
      await context.env.MORYTORY_ORDERS.put(userKey(user.email), JSON.stringify(user));
    }

    const token = await createSessionToken(user, context.env);
    return json({ token, user: publicUser(user) });
  } catch (error) {
    return json({ error: error.message || 'Không thể đăng nhập.' }, 500);
  }
}
