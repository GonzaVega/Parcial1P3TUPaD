import type { Product } from "../../types/product";
import type { CartItem } from "../../types/cart";

const CART_KEY = "cart";

function readCartItems(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CartItem[];
  } catch {
    console.error("Error parseando carrito desde localStorage:", raw);
    return [];
  }
}

function saveCartItems(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartItems(): CartItem[] {
  return readCartItems();
}

export function addProductToCart(product: Product): CartItem[] {
  const cartItems = readCartItems();
  const existingItem = cartItems.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ product, quantity: 1 });
  }

  saveCartItems(cartItems);
  return cartItems;
}

export function getCartItemsCount(): number {
  return readCartItems().reduce((total, item) => total + item.quantity, 0);
}