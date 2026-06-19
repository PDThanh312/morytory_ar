import { json, publicUser, requireAuth } from '../../_lib/auth.js';

async function readValues(namespace, keys) {
  return Promise.all(keys.map((key) => namespace.get(key.name, 'json')));
}

export async function onRequestGet(context) {
  const auth = await requireAuth(context, ['admin']);
  if (auth.response) return auth.response;

  try {
    const [userKeys, orderKeys] = await Promise.all([
      context.env.MORYTORY_ORDERS.list({ prefix: 'user_', limit: 500 }),
      context.env.MORYTORY_ORDERS.list({ prefix: 'order_', limit: 200 }),
    ]);

    const [rawUsers, rawOrders] = await Promise.all([
      readValues(context.env.MORYTORY_ORDERS, userKeys.keys),
      readValues(context.env.MORYTORY_ORDERS, orderKeys.keys),
    ]);

    const users = rawUsers
      .filter(Boolean)
      .map(publicUser)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const orders = rawOrders
      .filter(Boolean)
      .map(({ targetImage, ...order }) => order)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return json({
      summary: {
        totalUsers: users.length,
        totalAdmins: users.filter((user) => user.role === 'admin').length,
        totalOrders: orders.length,
      },
      users,
      orders,
    });
  } catch (error) {
    return json({ error: error.message || 'Không thể tải dữ liệu quản trị.' }, 500);
  }
}
