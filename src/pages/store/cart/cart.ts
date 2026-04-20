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

const SHIPPING_COST = 500;
const CART_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 10 21h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.79-1.11L22 8H7.42L7 4zm0 0a1 1 0 0 0-1-1H3v2h2l1 0zM10 22a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
`;

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

const loadLinks = () => {
  const linksList = document.querySelector(".navbar-menu");
  if (!linksList) return;

  linksList.innerHTML = "";

  const homeLi = document.createElement("li");
  homeLi.innerHTML = '<a href="/src/pages/store/home/home.html">Inicio</a>';
  linksList.appendChild(homeLi);

  const ordersLi = document.createElement("li");
  ordersLi.innerHTML = '<a href="#">Mis Pedidos</a>';
  linksList.appendChild(ordersLi);

  const cartLi = document.createElement("li");
  cartLi.className = "navbar-cart-item";
  cartLi.innerHTML = `
    <a href="/src/pages/store/cart/cart.html" class="navbar-cart-link" aria-label="Carrito de supermercado">
      <span class="navbar-cart-icon">${CART_ICON}</span>
      <span class="navbar-cart-badge" data-cart-badge aria-live="polite"></span>
    </a>
  `;
  linksList.appendChild(cartLi);

  const adminLink = document.createElement("li");
  const user = getCurrentUser();
  if (user?.role === "admin") {
    adminLink.innerHTML =
      '<a href="/src/pages/admin/home/home.html"><strong>Panel Admin</strong></a>';
    linksList.appendChild(adminLink);
  }

  const logoutLi = document.createElement("li");
  logoutLi.innerHTML = '<a href="#" id="logout-link">Cerrar Sesión</a>';
  linksList.appendChild(logoutLi);
};

const syncCartBadge = () => {
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge) return;

  const count = getCartItemsCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
};

const renderSummary = () => {
  const subtotalEl = document.querySelector<HTMLElement>(
    "[data-summary-subtotal]",
  );
  const shippingEl = document.querySelector<HTMLElement>(
    "[data-summary-shipping]",
  );
  const totalEl = document.querySelector<HTMLElement>("[data-summary-total]");
  const checkoutBtn = document.getElementById(
    "checkout-btn",
  ) as HTMLButtonElement | null;
  const clearCartBtn = document.getElementById(
    "clear-cart-btn",
  ) as HTMLButtonElement | null;

  if (!subtotalEl || !shippingEl || !totalEl) return;

  const subtotal = getCartSubtotal();
  const shipping = subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

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

const renderEmptyState = (container: HTMLElement) => {
  const empty = document.createElement("p");
  empty.className = "cart-empty";
  empty.textContent = "Tu carrito está vacío.";
  container.appendChild(empty);
};

const renderCartItems = () => {
  const itemsContainer =
    document.querySelector<HTMLElement>("[data-cart-items]");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";

  const items = getCartItems();
  if (items.length === 0) {
    renderEmptyState(itemsContainer);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
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

    const decrementBtn = card.querySelector<HTMLButtonElement>(
      '[data-action="decrement"]',
    );
    const incrementBtn = card.querySelector<HTMLButtonElement>(
      '[data-action="increment"]',
    );
    const removeBtn = card.querySelector<HTMLButtonElement>(
      '[data-action="remove"]',
    );

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

const setupActions = () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  checkoutBtn?.addEventListener("click", () => {
    alert("Checkout no disponible en esta etapa.");
  });

  clearCartBtn?.addEventListener("click", () => {
    clearCart();
    renderAll();
  });
};

const renderAll = () => {
  renderCartItems();
  renderSummary();
  syncCartBadge();
};

loadLinks();
setupActions();
renderAll();
