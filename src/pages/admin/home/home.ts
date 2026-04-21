import { getCurrentUser } from "../../../utils/localStorage";
import { getCategories, PRODUCTS } from "../../../data/data";
import type { IUser } from "../../../types/IUser";

const initPage: () => void = () => {
  const user: IUser | null = getCurrentUser();

  if (!user) {
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

  if (user.role !== "admin") {
    window.location.href = "/src/pages/store/home/home.html";
    return;
  }

  renderCategoryOptions();
  renderProductsTable();
};

const renderCategoryOptions: () => void = () => {
  const categorySelect: HTMLSelectElement | null = document.getElementById(
    "categoria",
  ) as HTMLSelectElement | null;
  if (!categorySelect) return;

  categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>';

  const categories: { nombre: string }[] = getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.nombre;
    option.textContent = category.nombre;
    categorySelect.appendChild(option);
  });
};

const renderProductsTable: () => void = () => {
  const tableBody: HTMLElement | null = document.getElementById(
    "products-table-body",
  );

  if (!tableBody) return;

  tableBody.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const row: HTMLTableRowElement = document.createElement("tr");
    const categorias: string = product.categorias
      .map((c) => c.nombre)
      .join(", ");

    row.innerHTML = `
      <td>${product.id}</td>
      <td>
        <img
          src="${product.imagen}"
          height="50"
          width="50"
          alt="${product.nombre}"
        />
      </td>
      <td>${product.nombre}</td>
      <td>${categorias}</td>
      <td>$${product.precio.toLocaleString()}</td>
      <td>${product.stock}</td>
      <td><button>Editar</button> <button>Eliminar</button></td>
    `;

    tableBody.appendChild(row);
  });
};

initPage();
