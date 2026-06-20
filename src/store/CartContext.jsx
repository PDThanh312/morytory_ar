import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);
const STORAGE_KEY = 'morytory_cart_v2';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((item) => item?.type === 'catalog') : [];
  } catch {
    return [];
  }
}

const initialState = { items: [], isOpen: false };

function initState() {
  return { items: loadCart(), isOpen: false };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM': {
      const incoming = { quantity: 1, ...action.payload };
      if (incoming.type === 'catalog') {
        const existing = state.items.find((item) => item.type === 'catalog' && item.productId === incoming.productId && item.color === incoming.color);
        if (existing) {
          return { ...state, items: state.items.map((item) => item.id === existing.id ? { ...item, quantity: Math.min(10, Number(item.quantity || 1) + Number(incoming.quantity || 1)) } : item) };
        }
      }
      return { ...state, items: [...state.items, incoming] };
    }
    case 'UPDATE_QUANTITY':
      return { ...state, items: state.items.map((item) => item.id === action.payload.id ? { ...item, quantity: Math.max(1, Math.min(10, Number(action.payload.quantity || 1))) } : item) };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, initState);

  useEffect(() => {
    const safeItems = state.items.filter((item) => item.type === 'catalog');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeItems));
  }, [state.items]);

  return <CartContext.Provider value={state}><CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider></CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === null) throw new Error('useCartDispatch must be used within a CartProvider');
  return context;
}
