import { parseRoute } from "./router/route.js";
import { navbar, initNavbar } from "./src/components/navbar.js";

class App {
  constructor({ content }) {
    this._content = content;

    window.addEventListener("hashchange", () => this._renderPage());
    window.addEventListener("load", () => this._renderPage());
  }

  async _renderPage() {
    const hash = window.location.hash;
    const { PageClass, id } = parseRoute(hash);
    const page = id ? new PageClass(id) : new PageClass();

    // Render halaman
    if (page.getHtml) {
      const html = await page.getHtml();
      this._content.innerHTML = html;
    } else if (page.render) {
      this._content.innerHTML = page.render();
    }

    if (page.load) {
      await page.load();
    } else if (page.afterRender) {
      await page.afterRender();
    }

    initNavbar();
  }
}

// Pasang navbar
const contentEl = document.getElementById("content");
const navbarEl = document.getElementById("navbar");

if (navbarEl) {
  navbarEl.innerHTML = navbar;
  initNavbar();
}

// Inisialisasi app
if (contentEl) new App({ content: contentEl });
else console.warn("App content element (#content) not found in DOM.");

export default App;
