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

export const addToCart = (product: Mango, quantity: number = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  let newCart;
  if (existingItem) {
    newCart = cart.map(item => 
      item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
    );
  } else {
    newCart = [...cart, { ...product, quantity }];
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const updateCartQuantity = (id: string, delta: number) => {
  const cart = getCart();
  const newCart = cart.map(item => {
    if (item.id === id) {
      const newQty = Math.max(1, item.quantity + delta);
      return { ...item, quantity: newQty };
    }
    return item;
  });
  localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  window.dispatchEvent(new Event('cart-updated'));
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
