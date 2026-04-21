import type { Product } from "../../types/product";
import type { CartItem } from "../../types/cart";
import { getCurrentUser } from "../localStorage";

const CART_KEY_PREFIX = "cart:user:";

function getActiveCartKey(): string | null {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  return `${CART_KEY_PREFIX}${user.id}`;
}

function readCartItems(): CartItem[] {
  const cartKey = getActiveCartKey();
  if (!cartKey) {
    return [];
  }

  const raw = localStorage.getItem(cartKey);

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
  const cartKey = getActiveCartKey();
  if (!cartKey) {
    return;
  }

  localStorage.setItem(cartKey, JSON.stringify(items));
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

export function incrementCartItemQuantity(productId: number): CartItem[] {
  const cartItems = readCartItems();
  const item = cartItems.find((cartItem) => cartItem.product.id === productId);

  if (!item) {
    return cartItems;
  }

  item.quantity += 1;
  saveCartItems(cartItems);
  return cartItems;
}

export function decrementCartItemQuantity(productId: number): CartItem[] {
  const cartItems = readCartItems();
  const item = cartItems.find((cartItem) => cartItem.product.id === productId);

  if (!item) {
    return cartItems;
  }

  item.quantity -= 1;

  const filteredItems = cartItems.filter((cartItem) => cartItem.quantity > 0);
  saveCartItems(filteredItems);
  return filteredItems;
}

export function removeItemFromCart(productId: number): CartItem[] {
  const cartItems = readCartItems();
  const filteredItems = cartItems.filter(
    (item) => item.product.id !== productId,
  );
  saveCartItems(filteredItems);
  return filteredItems;
}

export function clearCart(): void {
  const cartKey = getActiveCartKey();
  if (!cartKey) {
    return;
  }

  localStorage.removeItem(cartKey);
}

export function getCartSubtotal(): number {
  return readCartItems().reduce(
    (subtotal, item) => subtotal + item.product.precio * item.quantity,
    0,
  );
}
