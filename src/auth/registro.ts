import { getUsers, saveUsers } from "../utils/localStorage";
import { isEmailTaken } from "../utils/auth";
import type { IUser } from "../types/IUser";

const form = document.querySelector<HTMLFormElement>("form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = (
      document.getElementById("firstName") as HTMLInputElement | null
    )?.value.trim();
    const lastName = (
      document.getElementById("lastName") as HTMLInputElement | null
    )?.value.trim();
    const email = (
      document.getElementById("email") as HTMLInputElement | null
    )?.value.trim();
    const phone = (
      document.getElementById("phone") as HTMLInputElement | null
    )?.value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement | null
    )?.value.trim();
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement | null
    )?.value.trim();

    if (!email || !password || !confirmPassword) {
      alert("Email y contraseña son obligatorios.");
      return;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (isEmailTaken(email)) {
      alert("Ya existe un usuario registrado con ese email.");
      return;
    }

    const users = getUsers();

    const newUser: IUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "client",
      loggedIn: false,
    };

    users.push(newUser);
    saveUsers(users);

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "/src/pages/auth/login/login.html";
  });
}
