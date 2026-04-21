import type { IUser } from "../types/IUser";
import { loginUser } from "../utils/auth";
import { setCurrentUser } from "../utils/localStorage";

const form: HTMLFormElement | null =
  document.querySelector<HTMLFormElement>("form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email: string | undefined = (
      document.getElementById("email") as HTMLInputElement | null
    )?.value.trim();
    const password: string | undefined = (
      document.getElementById("password") as HTMLInputElement | null
    )?.value.trim();

    if (!email || !password) {
      alert("Email y contraseña son obligatorios.");
      return;
    }

    const user: IUser | null = loginUser(email, password);

    if (!user) {
      alert("Credenciales inválidas.");
      return;
    }

    setCurrentUser(user);

    if (user.role === "admin") {
      window.location.href = "/src/pages/admin/home/home.html";
    } else {
      window.location.href = "/src/pages/store/home/home.html";
    }
  });
}
