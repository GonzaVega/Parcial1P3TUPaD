import { setCurrentUser } from "../utils/localStorage";

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  const logoutLink = target?.closest(
    "#logout-link",
  ) as HTMLAnchorElement | null;

  if (!logoutLink) return;

  event.preventDefault();
  setCurrentUser(null);
  window.location.href = "/src/pages/auth/login/login.html";
});
