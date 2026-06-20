import { json, requireAuth } from '../_lib/auth.js';

const PAYMENT_METHODS = new Set(['cod', 'bank_transfer', 'demo_gateway']);

function cleanText(value, maxLength = 200) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeItem(item, index) {
  const quantity = Math.max(1, Math.min(10, Number(item?.quantity || 1)));
  const unitPrice = Math.max(0, Math.min(5000000, Number(item?.unitPrice ?? item?.price ?? 0)));
  const type = item?.type === 'custom' ? 'custom' : 'catalog';
  return {
    id: cleanText(item?.id || `item-${index + 1}`, 80),
    type,
    productId: cleanText(item?.productId, 100),
    name: cleanText(item?.name || (type === 'custom' ? 'Khung ảnh cá nhân hóa' : 'Khung ảnh MoryTory'), 140),
    image: type === 'custom' ? '/products/ar-story.svg' : cleanText(item?.image, 500),
    frameSize: cleanText(item?.frameSize, 30),
    color: cleanText(item?.color, 60),
    quantity,
    unitPrice,
    lineTotal: unitPrice * quantity,
    effect: cleanText(item?.effect || item?.selectedAREffect, 30) || null,
    overlayText: cleanText(item?.overlayText ?? item?.overlay?.text, 300),
    overlayFont: cleanText(item?.overlayFont ?? item?.overlay?.fontStyle, 30) || 'serif',
    overlayFontSize: Math.max(10, Math.min(48, Number(item?.overlayFontSize ?? item?.overlay?.fontSize ?? 16))),
    targetImage: typeof item?.targetImage === 'string' && item.targetImage.startsWith('data:image/') ? item.targetImage : null,
  };
}

export async function onRequestPost(context) {
  const auth = await requireAuth(context);
  if (auth.response) return auth.response;

  try {
    const body = await context.request.json();
    const customer = {
      name: cleanText(body.customer?.name, 100),
      phone: cleanText(body.customer?.phone, 30),
      email: cleanText(body.customer?.email || auth.user.email, 120),
      address: cleanText(body.customer?.address, 400),
      note: cleanText(body.customer?.note, 500),
    };
    const paymentMethod = PAYMENT_METHODS.has(body.paymentMethod) ? body.paymentMethod : 'cod';
    const sourceItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];

    if (!customer.name || !customer.phone || !customer.address) return json({ error: 'Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.' }, 400);
    if (!/^0\d{8,10}$/.test(customer.phone.replace(/\s/g, ''))) return json({ error: 'Số điện thoại chưa đúng định dạng.' }, 400);
    if (!sourceItems.length) return json({ error: 'Giỏ hàng đang trống.' }, 400);

    const items = sourceItems.map(normalizeItem);
    if (items.some((item) => item.unitPrice <= 0)) return json({ error: 'Giá sản phẩm không hợp lệ.' }, 400);
    if (items.some((item) => item.type === 'custom' && !item.targetImage)) return json({ error: 'Thiết kế cá nhân hóa đang thiếu ảnh.' }, 400);

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = subtotal >= 300000 ? 0 : 30000;
    const total = subtotal + shippingFee;
    const purchaseId = `MT${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const now = new Date().toISOString();

    const payment = {
      method: paymentMethod,
      status: paymentMethod === 'demo_gateway' ? 'paid' : paymentMethod === 'cod' ? 'unpaid' : 'pending',
      transactionId: paymentMethod === 'demo_gateway' ? `DEMO-${crypto.randomUUID().slice(0, 12).toUpperCase()}` : null,
      paidAt: paymentMethod === 'demo_gateway' ? now : null,
      transferCode: paymentMethod === 'bank_transfer' ? purchaseId : null,
      bankName: paymentMethod === 'bank_transfer' ? (context.env.BANK_NAME || 'MB Bank') : null,
      bankAccount: paymentMethod === 'bank_transfer' ? (context.env.BANK_ACCOUNT || '0000000000') : null,
      bankOwner: paymentMethod === 'bank_transfer' ? (context.env.BANK_OWNER || 'MORYTORY DEMO') : null,
    };

    const arOrders = [];
    const publicItems = [];
    for (const item of items) {
      let arOrderId = null;
      if (item.type === 'custom' && item.targetImage) {
        arOrderId = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
        const arData = {
          orderId: arOrderId,
          purchaseId,
          userId: auth.user.id,
          userEmail: auth.user.email,
          customer,
          targetImage: item.targetImage,
          effect: item.effect,
          overlayText: item.overlayText,
          overlayFont: item.overlayFont,
          overlayFontSize: item.overlayFontSize,
          frameSize: item.frameSize,
          price: item.lineTotal,
          status: 'active',
          createdAt: now,
        };
        await context.env.MORYTORY_ORDERS.put(`order_${arOrderId}`, JSON.stringify(arData));
        arOrders.push({ orderId: arOrderId, name: item.name, frameSize: item.frameSize });
      }
      const { targetImage, ...safeItem } = item;
      publicItems.push({ ...safeItem, arOrderId });
    }

    const purchase = {
      purchaseId,
      userId: auth.user.id,
      userEmail: auth.user.email,
      customer,
      items: publicItems,
      subtotal,
      shippingFee,
      total,
      payment,
      status: payment.status === 'paid' ? 'confirmed' : 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await context.env.MORYTORY_ORDERS.put(`purchase_${purchaseId}`, JSON.stringify(purchase));
    return json({ success: true, purchaseId, status: purchase.status, totals: { subtotal, shippingFee, total }, payment, arOrders }, 201);
  } catch (error) {
    return json({ error: error.message || 'Không thể tạo đơn hàng.' }, 500);
  }
}
