import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';

const STARTER_MESSAGES = [
  { role: 'assistant', content: 'Xin chào, mình là Mory 🌿 Mình có thể giúp bạn chọn khung, tư vấn quà tặng, AR và thanh toán.' },
];

const QUICK_QUESTIONS = ['Mẫu nào hợp làm quà sinh nhật?', 'AR hoạt động như thế nào?', 'Phí giao hàng bao nhiêu?'];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(STARTER_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('demo');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages.slice(-10) }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Không thể kết nối trợ lý.');
      setMode(payload.mode || 'demo');
      setMessages((current) => [...current, { role: 'assistant', content: payload.answer }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'Mình đang mất kết nối. Bạn có thể xem sản phẩm tại mục Bộ sưu tập hoặc thử lại sau nhé.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={`fixed bottom-5 right-5 z-[65] flex items-center gap-2 rounded-full bg-brand-wood px-4 py-3 font-semibold text-white shadow-2xl transition hover:-translate-y-0.5 ${open ? 'pointer-events-none scale-90 opacity-0' : ''}`} aria-label="Mở trợ lý AI"><MessageCircle className="h-5 w-5" /><span className="hidden sm:inline">Hỏi Mory AI</span><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" /></button>
      {open && (
        <section className="fixed bottom-4 right-4 z-[80] flex h-[min(640px,calc(100vh-32px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-brand-wood/10 bg-white shadow-2xl">
          <header className="flex items-center gap-3 bg-brand-wood p-4 text-white"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><Bot className="h-6 w-6" /></span><div className="flex-1"><h2 className="font-serif text-lg font-bold">Mory AI</h2><p className="text-xs text-white/65">{mode === 'ai' ? 'AI đang hoạt động' : 'Trợ lý demo thông minh'}</p></div><button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><X className="h-5 w-5" /></button></header>
          <div className="flex-1 overflow-y-auto bg-[#faf7f2] p-4">
            <div className="space-y-3">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-brand-wood text-white' : 'rounded-bl-md bg-white text-gray-700 shadow-sm'}`}>{message.content}</div></div>)}{loading && <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-gray-500 shadow-sm"><Loader2 className="h-4 w-4 animate-spin" /> Mory đang suy nghĩ...</div></div>}<div ref={bottomRef} /></div>
          </div>
          {messages.length <= 2 && <div className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-white px-4 py-3">{QUICK_QUESTIONS.map((question) => <button key={question} onClick={() => sendMessage(question)} className="whitespace-nowrap rounded-full border border-brand-wood/15 px-3 py-2 text-xs text-brand-wood hover:bg-brand-accent-beige">{question}</button>)}</div>}
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex items-end gap-2 border-t border-gray-100 bg-white p-3"><label className="flex min-h-11 flex-1 items-center rounded-2xl bg-gray-100 px-4"><Sparkles className="mr-2 h-4 w-4 shrink-0 text-brand-accent-green" /><textarea rows="1" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Hỏi về sản phẩm..." className="max-h-24 flex-1 resize-none bg-transparent py-3 text-sm outline-none" /></label><button disabled={!input.trim() || loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-accent-green text-white disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
        </section>
      )}
    </>
  );
}
