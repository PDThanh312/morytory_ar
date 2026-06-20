import { checkRateLimit, json } from '../_lib/auth.js';

const PRODUCT_CONTEXT = `MoryTory bán khung ảnh gỗ cá nhân hóa tại Việt Nam. Sản phẩm: Classic Oak 10x15 giá 79.000đ; Walnut Memory 13x18 giá 109.000đ; Gallery Pine 15x21 giá 139.000đ; AR Story Premium giá 169.000đ. Hiệu ứng AR gồm tuyết, bụi phép thuật và hoa anh đào. Miễn phí vận chuyển cho đơn từ 300.000đ, đơn thấp hơn phí 30.000đ. Thời gian giao dự kiến 2-5 ngày. Có thanh toán COD, chuyển khoản và cổng thanh toán demo. Khách có thể thiết kế tại /design, xem sản phẩm tại /products và xem đơn tại /orders.`;

function fallbackAnswer(message) {
  const text = message.toLowerCase();
  if (/giao|ship|vận chuyển|phí ship/.test(text)) return 'MoryTory dự kiến giao trong 2–5 ngày. Đơn từ 300.000đ được miễn phí vận chuyển; đơn thấp hơn có phí 30.000đ.';
  if (/giá|bao nhiêu|price/.test(text)) return 'Khung MoryTory hiện có giá từ 79.000đ đến 169.000đ. Mẫu AR Story Premium giá 169.000đ và có thể cá nhân hóa hiệu ứng, lời nhắn.';
  if (/ar|hiệu ứng|quét/.test(text)) return 'Bạn có thể chọn hiệu ứng tuyết, bụi phép thuật hoặc hoa anh đào. Sau khi nhận khung, quét QR bằng camera điện thoại để mở trải nghiệm AR.';
  if (/thanh toán|cod|chuyển khoản/.test(text)) return 'Bản demo hỗ trợ COD, chuyển khoản ngân hàng và cổng thanh toán mô phỏng. Khi triển khai thật cần kết nối MoMo/VNPay hoặc nhà cung cấp thanh toán chính thức.';
  if (/quà|sinh nhật|kỷ niệm/.test(text)) return 'Quà sinh nhật phù hợp với Walnut Memory 13×18; quà kỷ niệm nổi bật nhất là AR Story Premium vì có QR AR và lời nhắn riêng.';
  if (/đổi|trả|bảo hành/.test(text)) return 'Khung được bảo hành 6 tháng và hỗ trợ đổi trả trong 7 ngày nếu có lỗi sản xuất. Với sản phẩm cá nhân hóa, vui lòng giữ ảnh/video mở hộp để được hỗ trợ nhanh.';
  return 'Mình có thể giúp bạn chọn mẫu khung, kích thước, hiệu ứng AR, phương thức thanh toán hoặc hướng dẫn đặt hàng. Bạn đang làm quà cho dịp nào?';
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string') return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && content.text) return content.text;
    }
  }
  return '';
}

export async function onRequestPost(context) {
  try {
    const limited = await checkRateLimit(context, 'chat', 40, 3600);
    if (limited) return limited;
    const body = await context.request.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const lastMessage = String(messages.at(-1)?.content || '').trim().slice(0, 1200);
    if (!lastMessage) return json({ error: 'Vui lòng nhập câu hỏi.' }, 400);

    if (!context.env.OPENAI_API_KEY) return json({ answer: fallbackAnswer(lastMessage), mode: 'demo' });

    const input = [
      { role: 'developer', content: `Bạn là Mory, trợ lý tư vấn bán hàng của MoryTory. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn, không bịa chính sách. Chỉ tư vấn dựa trên thông tin sau: ${PRODUCT_CONTEXT}. Khi phù hợp, hướng khách đến đúng đường dẫn trong website. Không yêu cầu thông tin nhạy cảm.` },
      ...messages.map((message) => ({ role: message.role === 'assistant' ? 'assistant' : 'user', content: String(message.content || '').slice(0, 1200) })),
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${context.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: context.env.OPENAI_MODEL || 'gpt-5-mini', input, max_output_tokens: 350 }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || 'Dịch vụ AI đang bận.');
    return json({ answer: extractOutputText(payload) || fallbackAnswer(lastMessage), mode: 'ai' });
  } catch (error) {
    return json({ answer: fallbackAnswer(''), mode: 'demo', warning: error.message }, 200);
  }
}
