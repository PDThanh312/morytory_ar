import { json, requireAuth } from '../../_lib/auth.js';

const ORDER_STATUSES = new Set(['pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled']);
const PAYMENT_STATUSES = new Set(['unpaid', 'pending', 'paid', 'refunded']);

export async function onRequestPatch(context) {
  const auth = await requireAuth(context, ['admin']);
  if (auth.response) return auth.response;

  try {
    const body = await context.request.json();
    const purchaseId = String(body.purchaseId || '').trim();
    if (!purchaseId) return json({ error: 'Thiếu mã đơn hàng.' }, 400);
    const key = `purchase_${purchaseId}`;
    const purchase = await context.env.MORYTORY_ORDERS.get(key, 'json');
    if (!purchase) return json({ error: 'Không tìm thấy đơn hàng.' }, 404);

    if (body.status && ORDER_STATUSES.has(body.status)) purchase.status = body.status;
    if (body.paymentStatus && PAYMENT_STATUSES.has(body.paymentStatus)) {
      purchase.payment = { ...purchase.payment, status: body.paymentStatus, paidAt: body.paymentStatus === 'paid' ? (purchase.payment?.paidAt || new Date().toISOString()) : purchase.payment?.paidAt };
    }
    purchase.updatedAt = new Date().toISOString();
    await context.env.MORYTORY_ORDERS.put(key, JSON.stringify(purchase));
    return json({ purchase });
  } catch (error) {
    return json({ error: error.message || 'Không thể cập nhật đơn hàng.' }, 500);
  }
}
