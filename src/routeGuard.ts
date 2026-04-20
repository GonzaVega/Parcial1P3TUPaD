import { getCurrentUser } from "./utils/localStorage";

function guardRoute() {
  const user = getCurrentUser();
  const path = window.location.pathname;

  const isAuthPage =
    path.endsWith("/src/pages/auth/login/login.html") ||
    path.endsWith("/src/pages/auth/login/registro.html");

  if (!user && !isAuthPage) {
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

  if (user?.role === "client" && path.includes("/admin")) {
    window.location.href = "/src/pages/store/home/home.html";
    return;
  }

  if (user && isAuthPage) {
    if (user.role === "admin") {
      window.location.href = "/src/pages/admin/home/home.html";
    } else {
      window.location.href = "/src/pages/store/home/home.html";
    }
  }
}

guardRoute();
