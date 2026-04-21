import { getCurrentUser } from "../../../utils/localStorage";
import { PRODUCTS } from "../../../data/data";
import { filterProductsByName } from "../../../utils/filters/productSearch";
import { filterProductsByCategory } from "../../../utils/filters/productCategoryFilter";
import {
  addProductToCart,
  getCartItemsCount,
} from "../../../utils/cart/cartStorage";
import type { Product } from "../../../types/product";
import { CART_ICON } from "../../../utils/cart/cartIcon";

const categorias = Array.from(
  new Set(
    PRODUCTS.flatMap((product) =>
      product.categorias.map((category) => category.nombre),
    ).filter(Boolean),
  ),
);

const TODAS_LABEL = "Todas";

let selectedCategory: string | null = null;
let searchValue = "";

const loadLinks = () => {
  const linksList = document.querySelector(".navbar-menu");
  if (!linksList) return;

  linksList.innerHTML = "";

  const links = ["Inicio", "Mis Pedidos"];

  links.forEach((link) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${link}</a>`;
    linksList.appendChild(li);
  });

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
    adminLink.innerHTML = `<a href="/src/pages/admin/home/home.html"><strong>Panel Admin</strong></a>`;
  }
  linksList.appendChild(adminLink);

  const logoutLi = document.createElement("li");
  logoutLi.innerHTML = '<a href="#" id="logout-link">Cerrar Sesión</a>';
  linksList.appendChild(logoutLi);
};

const cargarCategorias = () => {
  const categoryList = document.querySelector(".category-list");
  if (!categoryList) return;

  categoryList.innerHTML = "";

  const createCategoryItem = (categoryName: string, active = false) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = categoryName;
    link.dataset.category = categoryName;

    if (active) {
      link.classList.add("active");
    }

    li.appendChild(link);
    categoryList.appendChild(li);
  };

  createCategoryItem(TODAS_LABEL, true);

  categorias.forEach((categoria) => {
    createCategoryItem(categoria);
  });
};

const syncCartBadge = () => {
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge) return;

  const count = getCartItemsCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
};

const handleAddToCart = (product: Product) => {
  addProductToCart(product);
  syncCartBadge();
};

const renderSinResultados = (container: Element) => {
  const message = document.createElement("p");
  message.className = "product-list-empty";
  message.textContent =
    "No se encontraron productos con los filtros aplicados.";
  container.appendChild(message);
};

const cargarProductos = (productsToRender: Product[]) => {
  const productList = document.querySelector(".product-list");
  if (!productList) return;

  productList.innerHTML = "";

  if (productsToRender.length === 0) {
    renderSinResultados(productList);
    return;
  }

  productsToRender.forEach((producto) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" height="200" width="250" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Precio $${producto.precio.toLocaleString()}</strong></p>
    `;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => handleAddToCart(producto));

    article.appendChild(button);
    productList.appendChild(article);
  });
};

const applyFilters = () => {
  const byCategory = filterProductsByCategory(PRODUCTS, selectedCategory);
  const byName = filterProductsByName(byCategory, searchValue);
  cargarProductos(byName);
};

const updateActiveCategory = (clickedCategory: string) => {
  const links =
    document.querySelectorAll<HTMLAnchorElement>(".category-list a");

  links.forEach((link) => {
    const isCurrent = link.dataset.category === clickedCategory;
    link.classList.toggle("active", isCurrent);
  });
};

const setupCategoryFilter = () => {
  const categoryList = document.querySelector<HTMLElement>(".category-list");
  if (!categoryList) return;

  categoryList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const clickedLink = target?.closest("a");
    if (!clickedLink) return;

    event.preventDefault();

    const category = clickedLink.dataset.category;
    if (!category) return;

    selectedCategory = category === TODAS_LABEL ? null : category;
    updateActiveCategory(category);
    applyFilters();
  });
};

const setupSearch = () => {
  const form = document.querySelector<HTMLFormElement>("main > form");
  const input = form?.querySelector<HTMLInputElement>('input[type="text"]');

  if (!form || !input) return;

  const applySearch = () => {
    searchValue = input.value;
    applyFilters();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applySearch();
  });

  input.addEventListener("input", applySearch);
};

loadLinks();
cargarCategorias();
applyFilters();
setupCategoryFilter();
setupSearch();
syncCartBadge();
