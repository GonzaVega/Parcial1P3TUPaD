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
import type { IUser } from "../../../types/IUser";

const categorias: string[] = Array.from(
  new Set(
    PRODUCTS.flatMap((product) =>
      product.categorias.map((category) => category.nombre),
    ).filter(Boolean),
  ),
);

const TODAS_LABEL: string = "Todas";

let selectedCategory: string | null = null;
let searchValue: string = "";

const loadLinks: () => void = () => {
  const linksList: HTMLElement | null = document.querySelector(".navbar-menu");
  if (!linksList) return;

  linksList.innerHTML = "";

  const links: string[] = ["Inicio", "Mis Pedidos"];

  links.forEach((link) => {
    const li: HTMLElement = document.createElement("li");
    li.innerHTML = `<a href="#">${link}</a>`;
    linksList.appendChild(li);
  });

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
    adminLink.innerHTML = `<a href="/src/pages/admin/home/home.html"><strong>Panel Admin</strong></a>`;
  }
  linksList.appendChild(adminLink);

  const logoutLi: HTMLElement = document.createElement("li");
  logoutLi.innerHTML = '<a href="#" id="logout-link">Cerrar Sesión</a>';
  linksList.appendChild(logoutLi);
};

const cargarCategorias: () => void = () => {
  const categoryList: HTMLElement | null =
    document.querySelector(".category-list");
  if (!categoryList) return;

  categoryList.innerHTML = "";

  const createCategoryItem = (categoryName: string, active = false) => {
    const li: HTMLElement = document.createElement("li");
    const link: HTMLAnchorElement = document.createElement("a");

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

const syncCartBadge: () => void = () => {
  const badge: HTMLElement | null =
    document.querySelector<HTMLElement>("[data-cart-badge]");
  if (!badge) return;

  const count: number = getCartItemsCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
};

const handleAddToCart: (product: Product) => void = (product: Product) => {
  addProductToCart(product);
  syncCartBadge();
};

const renderSinResultados: (container: Element) => void = (
  container: Element,
) => {
  const message: HTMLParagraphElement = document.createElement("p");
  message.className = "product-list-empty";
  message.textContent =
    "No se encontraron productos con los filtros aplicados.";
  container.appendChild(message);
};

const cargarProductos: (productsToRender: Product[]) => void = (
  productsToRender: Product[],
) => {
  const productList: HTMLElement | null =
    document.querySelector(".product-list");
  if (!productList) return;

  productList.innerHTML = "";

  if (productsToRender.length === 0) {
    renderSinResultados(productList);
    return;
  }

  productsToRender.forEach((producto) => {
    const article: HTMLElement = document.createElement("article");
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" height="200" width="250" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Precio $${producto.precio.toLocaleString()}</strong></p>
    `;

    const button: HTMLButtonElement = document.createElement("button");
    button.type = "button";
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => handleAddToCart(producto));

    article.appendChild(button);
    productList.appendChild(article);
  });
};

const applyFilters: () => void = () => {
  const byCategory: Product[] = filterProductsByCategory(
    PRODUCTS,
    selectedCategory,
  );
  const byName: Product[] = filterProductsByName(byCategory, searchValue);
  cargarProductos(byName);
};

const updateActiveCategory: (clickedCategory: string) => void = (
  clickedCategory: string,
) => {
  const links: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll<HTMLAnchorElement>(".category-list a");

  links.forEach((link) => {
    const isCurrent: boolean = link.dataset.category === clickedCategory;
    link.classList.toggle("active", isCurrent);
  });
};

const setupCategoryFilter: () => void = () => {
  const categoryList: HTMLElement | null =
    document.querySelector<HTMLElement>(".category-list");
  if (!categoryList) return;

  categoryList.addEventListener("click", (event) => {
    const target: HTMLElement | null = event.target as HTMLElement | null;
    const clickedLink: HTMLAnchorElement | null | undefined =
      target?.closest("a");
    if (!clickedLink) return;

    event.preventDefault();

    const category: string | undefined = clickedLink.dataset.category;
    if (!category) return;

    selectedCategory = category === TODAS_LABEL ? null : category;
    updateActiveCategory(category);
    applyFilters();
  });
};

const setupSearch: () => void = () => {
  const form: HTMLFormElement | null =
    document.querySelector<HTMLFormElement>("main > form");
  const input: HTMLInputElement | null | undefined =
    form?.querySelector<HTMLInputElement>('input[type="text"]');

  if (!form || !input) return;

  const applySearch: () => void = () => {
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
