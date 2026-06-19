import {
  isConfiguredAdminEmail,
  json,
  normalizeEmail,
  publicUser,
  requireAuth,
  userKey,
} from '../../_lib/auth.js';

export async function onRequestPatch(context) {
  const auth = await requireAuth(context, ['admin']);
  if (auth.response) return auth.response;

  try {
    const body = await context.request.json();
    const email = normalizeEmail(body.email);
    const role = body.role;

    if (!email || !['user', 'admin'].includes(role)) {
      return json({ error: 'Email hoặc vai trò không hợp lệ.' }, 400);
    }

    const key = userKey(email);
    const target = await context.env.MORYTORY_ORDERS.get(key, 'json');
    if (!target) return json({ error: 'Không tìm thấy tài khoản.' }, 404);
    if (target.id === auth.user.id) {
      return json({ error: 'Bạn không thể tự thay đổi quyền của chính mình.' }, 400);
    }
    if (role === 'user' && isConfiguredAdminEmail(target.email, context.env)) {
      return json({ error: 'Tài khoản admin được cấu hình từ server nên không thể hạ quyền tại đây.' }, 400);
    }

    if (target.role === 'admin' && role === 'user') {
      const userKeys = await context.env.MORYTORY_ORDERS.list({ prefix: 'user_', limit: 500 });
      const users = await Promise.all(userKeys.keys.map((item) => context.env.MORYTORY_ORDERS.get(item.name, 'json')));
      const adminCount = users.filter((user) => user?.role === 'admin').length;
      if (adminCount <= 1) return json({ error: 'Hệ thống phải còn ít nhất một quản trị viên.' }, 400);
    }

    target.role = role;
    target.updatedAt = new Date().toISOString();
    await context.env.MORYTORY_ORDERS.put(key, JSON.stringify(target));
    return json({ user: publicUser(target) });
  } catch (error) {
    return json({ error: error.message || 'Không thể cập nhật quyền.' }, 500);
  }
}
