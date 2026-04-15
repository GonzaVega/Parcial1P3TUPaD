import { loginUser } from "../utils/auth";
import { setCurrentUser } from "../utils/localStorage";

const form = document.querySelector<HTMLFormElement>("form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = (
      document.getElementById("email") as HTMLInputElement | null
    )?.value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement | null
    )?.value.trim();

    if (!email || !password) {
      alert("Email y contraseña son obligatorios.");
      return;
    }

    const user = loginUser(email, password);

    if (!user) {
      alert("Credenciales inválidas.");
      return;
    }

    setCurrentUser(user);

    if (user.role === "admin") {
      window.location.href = "/src/pages/admin/home/home.html";
    } else {
      window.location.href = "/src/pages/client/home/home.html";
    }
  });
}
