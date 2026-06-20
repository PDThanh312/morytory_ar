import { json, publicUser, requireAuth } from '../../_lib/auth.js';

async function readValues(namespace, keys) {
  return Promise.all(keys.map((key) => namespace.get(key.name, 'json')));
}

export async function onRequestGet(context) {
  const auth = await requireAuth(context, ['admin']);
  if (auth.response) return auth.response;

  try {
    const [userKeys, purchaseKeys, arKeys] = await Promise.all([
      context.env.MORYTORY_ORDERS.list({ prefix: 'user_', limit: 500 }),
      context.env.MORYTORY_ORDERS.list({ prefix: 'purchase_', limit: 500 }),
      context.env.MORYTORY_ORDERS.list({ prefix: 'order_', limit: 500 }),
    ]);

    const [rawUsers, rawPurchases] = await Promise.all([
      readValues(context.env.MORYTORY_ORDERS, userKeys.keys),
      readValues(context.env.MORYTORY_ORDERS, purchaseKeys.keys),
    ]);

    const users = rawUsers.filter(Boolean).map(publicUser).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const purchases = rawPurchases.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const paidRevenue = purchases.filter((order) => order.payment?.status === 'paid' && order.status !== 'cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0);

    return json({
      summary: {
        totalUsers: users.length,
        totalAdmins: users.filter((user) => user.role === 'admin').length,
        totalOrders: purchases.length,
        paidRevenue,
        activeAR: arKeys.keys.length,
      },
      users,
      purchases,
    });
  } catch (error) {
    return json({ error: error.message || 'Không thể tải dữ liệu quản trị.' }, 500);
  }
}
