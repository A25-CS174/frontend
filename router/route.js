import LandingPage from "../src/pages/landing/landing.js";
import LoginPage from "../src/pages/login/login.js";
import RegisterPage from "../src/pages/register/register.js";
import RuntutanPage from "../src/pages/dashboard/runtutan.js";
import ProgressPage from "../src/pages/dashboard/progress.js";
import LanggananPage from "../src/pages/dashboard/langganan.js";
import ProfilePage from "../src/pages/profile/profile.js";
import ModulePage from "../src/pages/module/module.js";
import SubchapterPage from "../src/pages/module/subchapter.js";

const routes = {
  "/": LandingPage,
  login: LoginPage,
  register: RegisterPage,
  runtutan: RuntutanPage,
  progress: ProgressPage,
  langganan: LanggananPage,
  profile: ProfilePage,
  "module/:id": ModulePage,
  "subchapter/:id": SubchapterPage,
};

function parseRoute(hash) {
  const cleanHash = hash.replace(/^#\/?/, "");
  for (const route in routes) {
    if (route.includes(":id")) {
      const regex = new RegExp("^" + route.replace(":id", "(\\d+)") + "$");
      const match = cleanHash.match(regex);
      if (match) {
        return { PageClass: routes[route], id: match[1] };
      }
    } else if (route === cleanHash) {
      return { PageClass: routes[route] };
    }
  }
  return { PageClass: LandingPage };
}

export { routes, parseRoute };
export default routes;
