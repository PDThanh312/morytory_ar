import { useDesign, useDesignDispatch } from '../store/DesignContext';

const SIZES = [
  { id: '10x15', label: '10x15 cm', desc: 'Để bàn / Kệ sách', price: 79000 },
  { id: '13x18', label: '13x18 cm', desc: 'Làm quà tặng', price: 109000 },
  { id: '15x21', label: '15x21 cm', desc: 'Treo tường', price: 139000 },
];

export default function Step2FrameSize() {
  const { frameSize } = useDesign();
  const dispatch = useDesignDispatch();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-text">2. Chọn kích thước</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SIZES.map((size) => {
          const isSelected = frameSize === size.id;
          return (
            <button
              key={size.id}
              onClick={() => dispatch({ type: 'SET_FRAME_SIZE', payload: size.id })}
              className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out ${
                isSelected 
                  ? 'bg-brand-wood text-white scale-[1.02] shadow-md border-transparent' 
                  : 'bg-white border border-brand-wood/20 text-brand-text hover:border-brand-wood/50'
              }`}
            >
              <div className="font-semibold flex justify-between items-center">
                <span>{size.label}</span>
                <span className={`text-sm ${isSelected ? 'text-white' : 'text-brand-wood'}`}>
                  {size.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className={`text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {size.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
