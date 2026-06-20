import { useState } from 'react';
import { ImagePlus, UploadCloud } from 'lucide-react';
import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { validateImage, revokePreviewUrl } from '../utils/fileUtils';

export default function Step1Upload() {
  const { photoPreviewUrl } = useDesign();
  const dispatch = useDesignDispatch();
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) { setError(validation.error); return; }
    setError('');
    if (photoPreviewUrl) revokePreviewUrl(photoPreviewUrl);
    dispatch({ type: 'SET_PRINTING_PHOTO', payload: true });
    dispatch({ type: 'SET_PHOTO', payload: { file, url: URL.createObjectURL(file) } });
  };

  return (
    <div className="space-y-4">
      <div><h3 className="text-xl font-semibold text-brand-text">1. Tải ảnh kỷ niệm</h3><p className="mt-1 text-sm text-gray-500">Ảnh này sẽ được in và dùng làm mục tiêu nhận diện cho trải nghiệm AR.</p></div>
      <div className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-brand-wood/30 bg-brand-bg p-8 text-center transition hover:border-brand-wood hover:bg-brand-accent-beige/30">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
        <div className="pointer-events-none flex flex-col items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-wood shadow-sm">{photoPreviewUrl ? <ImagePlus className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}</span>
          <p className="text-sm"><strong className="text-brand-wood">{photoPreviewUrl ? 'Thay ảnh khác' : 'Nhấp để tải ảnh lên'}</strong> hoặc kéo thả vào đây</p>
          <p className="text-xs text-gray-400">JPG, PNG, WebP · tối đa 10MB · nên dùng ảnh rõ và đủ sáng</p>
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
