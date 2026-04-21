import { getCurrentUser } from "../../../utils/localStorage";
import {
  clearCart,
  decrementCartItemQuantity,
  getCartItems,
  getCartItemsCount,
  getCartSubtotal,
  incrementCartItemQuantity,
  removeItemFromCart,
} from "../../../utils/cart/cartStorage";
import { CART_ICON } from "../../../utils/cart/cartIcon";
import type { IUser } from "../../../types/IUser";

const SHIPPING_COST: number = 500;

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

const loadLinks: () => void = () => {
  const linksList: HTMLElement | null = document.querySelector(".navbar-menu");
  if (!linksList) return;

  linksList.innerHTML = "";

  const homeLi: HTMLElement = document.createElement("li");
  homeLi.innerHTML = '<a href="/src/pages/store/home/home.html">Inicio</a>';
  linksList.appendChild(homeLi);

  const ordersLi: HTMLElement = document.createElement("li");
  ordersLi.innerHTML = '<a href="#">Mis Pedidos</a>';
  linksList.appendChild(ordersLi);

  const cartLi: HTMLElement = document.createElement("li");
  cartLi.className = "navbar-cart-item";
  cartLi.innerHTML = `
    <a href="/src/pages/store/cart/cart.html" class="navbar-cart-link" aria-label="Carrito de supermercado">
      <span class="navbar-cart-icon">${CART_ICON}</span>
      <span class="navbar-cart-badge" data-cart-badge aria-live="polite"></span>
    </a>
  `;
  linksList.appendChild(cartLi);

  const adminLink: HTMLElement = document.createElement("li");
  const user: IUser | null = getCurrentUser();
  if (user?.role === "admin") {
    adminLink.innerHTML =
      '<a href="/src/pages/admin/home/home.html"><strong>Panel Admin</strong></a>';
    linksList.appendChild(adminLink);
  }

  const logoutLi: HTMLElement = document.createElement("li");
  logoutLi.innerHTML = '<a href="#" id="logout-link">Cerrar Sesión</a>';
  linksList.appendChild(logoutLi);
};

const syncCartBadge: () => void = () => {
  const badge: HTMLElement | null =
    document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge) return;

  const count: number = getCartItemsCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
};

const renderSummary: () => void = () => {
  const subtotalEl: HTMLElement | null = document.querySelector<HTMLElement>(
    "[data-summary-subtotal]",
  );
  const shippingEl: HTMLElement | null = document.querySelector<HTMLElement>(
    "[data-summary-shipping]",
  );
  const totalEl: HTMLElement | null = document.querySelector<HTMLElement>(
    "[data-summary-total]",
  );
  const checkoutBtn: HTMLButtonElement | null = document.getElementById(
    "checkout-btn",
  ) as HTMLButtonElement | null;
  const clearCartBtn: HTMLButtonElement | null = document.getElementById(
    "clear-cart-btn",
  ) as HTMLButtonElement | null;

  if (!subtotalEl || !shippingEl || !totalEl) return;

  const subtotal: number = getCartSubtotal();
  const shipping: number = subtotal > 0 ? SHIPPING_COST : 0;
  const total: number = subtotal + shipping;

  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(shipping);
  totalEl.textContent = formatCurrency(total);

  if (checkoutBtn) {
    checkoutBtn.disabled = subtotal <= 0;
  }

  if (clearCartBtn) {
    clearCartBtn.disabled = subtotal <= 0;
  }
};

const renderEmptyState: (container: HTMLElement) => void = (
  container: HTMLElement,
) => {
  const empty: HTMLParagraphElement = document.createElement("p");
  empty.className = "cart-empty";
  empty.textContent = "Tu carrito está vacío.";
  container.appendChild(empty);
};

const renderCartItems: () => void = () => {
  const itemsContainer: HTMLElement | null =
    document.querySelector<HTMLElement>("[data-cart-items]");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";

  const items = getCartItems();
  if (items.length === 0) {
    renderEmptyState(itemsContainer);
    return;
  }

  items.forEach((item) => {
    const card: HTMLElement = document.createElement("article");
    card.className = "cart-item";

    card.innerHTML = `
      <img src="${item.product.imagen}" alt="${item.product.nombre}" />
      <div class="cart-item-details">
        <h4>${item.product.nombre}</h4>
        <p>${item.product.descripcion}</p>
        <strong>${formatCurrency(item.product.precio)} c/u</strong>
      </div>
      <div class="cart-item-actions">
        <button type="button" data-action="decrement">-</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increment">+</button>
      </div>
      <strong class="cart-item-subtotal">${formatCurrency(item.product.precio * item.quantity)}</strong>
      <button type="button" class="danger small" data-action="remove">Eliminar</button>
    `;

    const decrementBtn: HTMLButtonElement | null =
      card.querySelector<HTMLButtonElement>('[data-action="decrement"]');
    const incrementBtn: HTMLButtonElement | null =
      card.querySelector<HTMLButtonElement>('[data-action="increment"]');
    const removeBtn: HTMLButtonElement | null =
      card.querySelector<HTMLButtonElement>('[data-action="remove"]');

    decrementBtn?.addEventListener("click", () => {
      decrementCartItemQuantity(item.product.id);
      renderAll();
    });

    incrementBtn?.addEventListener("click", () => {
      incrementCartItemQuantity(item.product.id);
      renderAll();
    });

    removeBtn?.addEventListener("click", () => {
      removeItemFromCart(item.product.id);
      renderAll();
    });

    itemsContainer.appendChild(card);
  });
};

const setupActions: () => void = () => {
  const checkoutBtn: HTMLElement | null =
    document.getElementById("checkout-btn");
  const clearCartBtn: HTMLElement | null =
    document.getElementById("clear-cart-btn");

  checkoutBtn?.addEventListener("click", () => {
    alert("Checkout no disponible en esta etapa.");
  });

  clearCartBtn?.addEventListener("click", () => {
    clearCart();
    renderAll();
  });
};

const renderAll: () => void = () => {
  renderCartItems();
  renderSummary();
  syncCartBadge();
};

loadLinks();
setupActions();
renderAll();
