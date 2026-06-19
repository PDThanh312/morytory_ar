import {
  createSessionToken,
  hashPassword,
  isValidEmail,
  json,
  normalizeEmail,
  publicUser,
  resolveRole,
  userKey,
  validatePassword,
} from '../../_lib/auth.js';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const password = body.password;

    if (name.length < 2 || name.length > 80) {
      return json({ error: 'Họ tên phải có từ 2 đến 80 ký tự.' }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: 'Email không hợp lệ.' }, 400);
    }
    const passwordError = validatePassword(password);
    if (passwordError) return json({ error: passwordError }, 400);

    const key = userKey(email);
    const existingUser = await context.env.MORYTORY_ORDERS.get(key, 'json');
    if (existingUser) {
      return json({ error: 'Email này đã được sử dụng.' }, 409);
    }

    const passwordData = await hashPassword(password);
    const now = new Date().toISOString();
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      role: resolveRole(email, context.env, 'user'),
      passwordSalt: passwordData.salt,
      passwordHash: passwordData.hash,
      createdAt: now,
      updatedAt: now,
    };

    await context.env.MORYTORY_ORDERS.put(key, JSON.stringify(user));
    const token = await createSessionToken(user, context.env);
    return json({ token, user: publicUser(user) }, 201);
  } catch (error) {
    return json({ error: error.message || 'Không thể tạo tài khoản.' }, 500);
  }
}
