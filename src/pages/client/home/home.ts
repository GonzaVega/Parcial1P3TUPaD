import { getCurrentUser } from "../../../utils/localStorage";
import { PRODUCTS } from "../../../data/data";

// Categorías extraídas de productos únicos
const categorias = Array.from(
  new Set(PRODUCTS.map((p) => p.categorias?.[0]?.nombre || "").filter(Boolean)),
);

const loadLinks = () => {
  const linksList = document.querySelector(".navbar-menu");
  if (!linksList) return;

  const links = ["Inicio", "Mis Pedidos", "Carrito"];

  links.forEach((link) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${link}</a>`;
    linksList.appendChild(li);
  });

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

  categorias.forEach((categoria) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${categoria}</a>`;
    categoryList.appendChild(li);
  });
};

function agregarAlCarrito(productoNombre: string) {
  alert(`Producto ${productoNombre} agregado al carrito`);
}

(window as any).agregarAlCarrito = agregarAlCarrito;

const cargarProductos = () => {
  const productList = document.querySelector(".product-list");
  if (!productList) return;

  PRODUCTS.forEach((producto) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" height="200" width="250" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Precio $${producto.precio.toLocaleString()}</strong></p>
      <button onclick="agregarAlCarrito('${producto.nombre}')">Agregar</button>
    `;
    productList.appendChild(article);
  });
};

loadLinks();
cargarCategorias();
cargarProductos();
