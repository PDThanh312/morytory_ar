export const initialState = {
  isPrintingPhoto: true,
  photo: null,           // File object
  photoPreviewUrl: null, // URL.createObjectURL result
  frameSize: '10x15',    // Default
  selectedAREffect: null, // 'snow' | 'sparkle' | 'petals' | null
  overlay: { text: '', fontStyle: 'serif', fontSize: 16 },
  pricing: { base: 79000, arAddon: 20000, total: 79000 },
};

const getBasePrice = (size) => {
  if (size === '15x21') return 139000;
  if (size === '13x18') return 109000;
  return 79000;
};

const calculateTotal = (size, arEffect) => {
  const base = getBasePrice(size);
  return arEffect ? base + 20000 : base;
};

export function designReducer(state, action) {
  switch (action.type) {
    case 'SET_PRINTING_PHOTO': {
      const isPrintingPhoto = action.payload;
      return { 
        ...state, 
        isPrintingPhoto,
        photo: isPrintingPhoto ? state.photo : null,
        photoPreviewUrl: isPrintingPhoto ? state.photoPreviewUrl : null
      };
    }
    case 'SET_PHOTO':
      return { ...state, photo: action.payload.file, photoPreviewUrl: action.payload.url };
    case 'SET_FRAME_SIZE': {
      const size = action.payload;
      const base = getBasePrice(size);
      const total = calculateTotal(size, state.selectedAREffect);
      return { 
        ...state, 
        frameSize: size,
        pricing: { ...state.pricing, base, total }
      };
    }
    case 'SET_AR_EFFECT': {
      const selectedAREffect = action.payload;
      const total = calculateTotal(state.frameSize, selectedAREffect);
      return { 
        ...state, 
        selectedAREffect, 
        pricing: { ...state.pricing, total }
      };
    }
    case 'SET_OVERLAY_TEXT':
      return { ...state, overlay: { ...state.overlay, text: action.payload } };
    case 'SET_OVERLAY_FONT_STYLE':
      return { ...state, overlay: { ...state.overlay, fontStyle: action.payload } };
    case 'SET_OVERLAY_FONT_SIZE':
      return { ...state, overlay: { ...state.overlay, fontSize: action.payload } };
    case 'RESET_DESIGN':
      return initialState;
    default:
      return state;
  }
}
