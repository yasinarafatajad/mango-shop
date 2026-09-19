import { Mango } from "./type";

export interface CartItem extends Mango {
  quantity: number;
}

const CART_KEY = 'mango_shop_cart';
const WISHLIST_KEY = 'mango_shop_wishlist';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Mango, quantity: number = 1): { success: boolean; message?: string } => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  const maxStock = product.stock !== undefined ? product.stock : 9999;
  
  if (maxStock <= 0) {
    return { success: false, message: 'পণ্যটি আউট অব স্টক (Out of Stock)' };
  }

  const currentQty = existingItem ? existingItem.quantity : 0;
  const targetQty = currentQty + quantity;

  if (targetQty > maxStock) {
    const allowedAdd = maxStock - currentQty;
    if (allowedAdd <= 0) {
      return { success: false, message: `স্টকে মাত্র ${maxStock} টি পণ্য এভেলেবল আছে` };
    }
    // Cap at maxStock
    let newCart;
    if (existingItem) {
      newCart = cart.map(item => 
        item.id === product.id ? { ...item, ...product, quantity: maxStock } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: maxStock }];
    }
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
    return { success: false, message: `স্টকে মাত্র ${maxStock} টি পণ্য এভেলেবল আছে` };
  }
  
  let newCart;
  if (existingItem) {
    newCart = cart.map(item => 
      item.id === product.id ? { ...item, ...product, quantity: targetQty } : item
    );
  } else {
    newCart = [...cart, { ...product, quantity }];
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cart-updated'));
  return { success: true };
};

export const updateCartQuantity = (id: string, delta: number): { success: boolean; message?: string } => {
  const cart = getCart();
  let warningMessage: string | undefined;

  const newCart = cart.map(item => {
    if (item.id === id) {
      const maxStock = item.stock !== undefined ? item.stock : 9999;
      const targetQty = item.quantity + delta;
      
      if (targetQty > maxStock) {
        warningMessage = `স্টকে মাত্র ${maxStock} টি পণ্য এভেলেবল আছে`;
        return { ...item, quantity: maxStock };
      }
      
      const newQty = Math.max(1, targetQty);
      return { ...item, quantity: newQty };
    }
    return item;
  });
  
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cart-updated'));
  return { success: !warningMessage, message: warningMessage };
};

export const removeFromCart = (id: string) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const getWishlist = (): Mango[] => {
  if (typeof window === 'undefined') return [];
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

export const toggleWishlist = (product: Mango) => {
  const wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.id === product.id);
  
  let newWishlist;
  if (index > -1) {
    newWishlist = wishlist.filter(item => item.id !== product.id);
  } else {
    newWishlist = [...wishlist, product];
  }
  
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
  window.dispatchEvent(new Event('wishlist-updated'));
  return index === -1; // returns true if added, false if removed
};

export const isInWishlist = (id: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === id);
};
