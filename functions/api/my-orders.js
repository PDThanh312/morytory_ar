import { json, requireAuth } from '../_lib/auth.js';

export async function onRequestGet(context) {
  const auth = await requireAuth(context);
  if (auth.response) return auth.response;

  try {
    const keys = await context.env.MORYTORY_ORDERS.list({ prefix: 'purchase_', limit: 300 });
    const records = await Promise.all(keys.keys.map((key) => context.env.MORYTORY_ORDERS.get(key.name, 'json')));
    const orders = records.filter((order) => order?.userId === auth.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return json({ orders });
  } catch (error) {
    return json({ error: error.message || 'Không thể tải đơn hàng.' }, 500);
  }
}
