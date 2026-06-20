import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import LeftColumnPreview from './LeftColumnPreview';
import Step1Upload from './Step1Upload';
import Step2FrameSize from './Step2FrameSize';
import Step3ARSelection from './Step3ARSelection';
import Step4AREditor from './Step4AREditor';
import Step5Summary from './Step5Summary';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { useCartDispatch } from '../store/CartContext';
import AuthActions from './auth/AuthActions';

export default function DesignPage() {
  const navigate = useNavigate();
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const { selectedAREffect, photoPreviewUrl, overlay, frameSize, pricing, photo } = useDesign();
  const designDispatch = useDesignDispatch();
  const cartDispatch = useCartDispatch();

  const handleAddToCart = () => {
    if (!photoPreviewUrl) {
      alert("Vui lòng tải ảnh lên trước!");
      return;
    }
    const newItem = {
      id: crypto.randomUUID(),
      type: 'custom',
      name: `Khung ảnh AR cá nhân hóa ${frameSize}`,
      quantity: 1,
      unitPrice: pricing.total,
      image: photoPreviewUrl,
      photoPreviewUrl,
      photo,
      frameSize,
      selectedAREffect,
      overlay,
      pricing
    };
    cartDispatch({ type: 'ADD_ITEM', payload: newItem });
    designDispatch({ type: 'RESET_DESIGN' });
    cartDispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col md:flex-row">
      {/* Mobile Header with Back Button */}
      <div className="md:hidden flex items-center p-4 bg-white border-b border-brand-wood/20 sticky top-0 z-40">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-brand-text" />
        </button>
        <span className="ml-2 font-serif font-bold text-brand-wood text-lg flex-1">Studio MoryTory</span>
        <AuthActions compact />
      </div>

      {/* Left Column (Preview) */}
      <div 
        className={`md:w-1/2 md:sticky md:top-0 md:h-screen flex flex-col bg-brand-bg transition-all duration-300 ease-in-out ${
          isPreviewCollapsed ? 'h-24 overflow-hidden' : 'h-[40vh] md:h-auto'
        }`}
      >
        <div className="relative flex-1 p-4 flex items-center justify-center">
          {/* Desktop Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="hidden md:flex absolute top-6 left-6 items-center gap-2 text-gray-500 hover:text-brand-text transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Trang chủ</span>
          </button>
          
          <LeftColumnPreview />
        </div>
        
        {/* Mobile Collapse Toggle */}
        <button 
          className="md:hidden flex items-center justify-center py-2 bg-white border-t border-brand-wood/10 text-gray-500 hover:text-brand-wood shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20"
          onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
        >
          {isPreviewCollapsed ? (
            <><ChevronDown className="w-4 h-4 mr-1" /> Hiện thị xem trước</>
          ) : (
            <><ChevronUp className="w-4 h-4 mr-1" /> Thu gọn xem trước</>
          )}
        </button>
      </div>

      {/* Right Column (Control Panel) */}
      <div className="md:w-1/2 flex-1 overflow-y-auto bg-white shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] pb-32 md:pb-0">
        <div className="max-w-xl mx-auto p-6 md:p-12 space-y-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-text mb-2">Thiết Kế Khung Ảnh</h2>
              <p className="text-gray-500">Tùy chỉnh khung ảnh gỗ và lưu giữ kỷ niệm của bạn.</p>
            </div>
            <div className="hidden md:block"><AuthActions compact /></div>
          </div>
          
          <Step1Upload />
          <Step2FrameSize />
          <Step3ARSelection />
          <Step4AREditor />
        </div>
      </div>

      {/* Summary Bar */}
      <Step5Summary onOrder={handleAddToCart} buttonText="Thêm vào giỏ hàng" />
    </div>
  );
}
