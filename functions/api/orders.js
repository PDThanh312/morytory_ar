import { json, requireAuth } from '../_lib/auth.js';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) return json({ error: 'Missing order ID' }, 400);

  try {
    const order = await context.env.MORYTORY_ORDERS.get(`order_${id}`, 'json');
    if (!order) return json({ error: 'Order not found' }, 404);

    // Endpoint này phục vụ QR AR công khai, vì vậy không trả thông tin người mua.
    return json({
      orderId: order.orderId,
      targetImage: order.targetImage,
      effect: order.effect,
      overlayText: order.overlayText,
      overlayFont: order.overlayFont,
      overlayFontSize: order.overlayFontSize,
      createdAt: order.createdAt,
    });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function onRequestPost(context) {
  const auth = await requireAuth(context);
  if (auth.response) return auth.response;

  try {
    const data = await context.request.json();
    const {
      targetImage,
      effect,
      overlayText,
      overlayFont,
      overlayFontSize,
      frameSize,
      price,
      customer,
    } = data;

    if (!targetImage) return json({ error: 'Missing targetImage' }, 400);
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return json({ error: 'Thiếu thông tin giao hàng.' }, 400);
    }

    const orderId = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
    const orderData = {
      orderId,
      userId: auth.user.id,
      userEmail: auth.user.email,
      customer: {
        name: String(customer.name).trim().slice(0, 100),
        phone: String(customer.phone).trim().slice(0, 30),
        address: String(customer.address).trim().slice(0, 500),
      },
      targetImage,
      effect: effect || null,
      overlayText: overlayText || '',
      overlayFont: overlayFont || 'serif',
      overlayFontSize: Number(overlayFontSize) || 16,
      frameSize: frameSize || '',
      price: Number(price) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Không đặt expiration để QR in trên khung tiếp tục hoạt động lâu dài.
    await context.env.MORYTORY_ORDERS.put(`order_${orderId}`, JSON.stringify(orderData));
    return json({ success: true, orderId }, 201);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
