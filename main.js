// Import navbar component
import { navbar } from './src/components/navbar.js';

// Simple SPA Router
class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Load navbar
    document.getElementById('navbar').innerHTML = navbar;
    // Import navbar styles
    const navbarLink = document.createElement('link');
    navbarLink.rel = 'stylesheet';
    navbarLink.href = '/src/components/navbar.css';
    document.head.appendChild(navbarLink);

    window.addEventListener('popstate', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  navigate(path) {
    history.pushState(null, null, path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
    if (route) {
      this.currentRoute = route;
      this.render(route);
    }
  }

  render(route) {
    const content = document.getElementById('content');
    content.innerHTML = route.template;
    if (route.script) route.script();
  }
}

// Routes
const routes = [
  { path: '/', template: `
    <section class="hero">
      <div class="hero-text">
        <h1>Bangun Karirmu Sebagai</h1>
        <h1>Developer Profesional</h1>
        <p>Mulai belajar terarah dengan learning path</p>
        <button class="cta">Belajar Sekarang</button>
      </div>
      <div class="hero-image">
        <img src="/public/image/homepage-hero.png" alt="Feature" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="feature-head">
        <h1>Kenapa Dicoding Academy Berbeda</h1>
        <p>Saatnya bijak memilih sumber belajar. Tak hanya materi yang terjamin,</p>
        <p>Dicoding Academy juga memiliki reviewer profesional yang akan mengulas kode Anda.</p>
      </div>
      <div class="feature-main">
      <div class="features-text">
        <div class="feature-box">
          <p>Kurikulum standar industri global</p>
          <p>Belajar fleksibel sesuai jadwal anda</p>
          <p>Code review dari developer expert</p>
          <p>Alumni terpercaya di berbagai perusahaan</p>
        </div>
      </div>
      <div class="features-image">
        <img src="/public/image/feature-1-landing-page.png" alt="Feature" />
      </div>
      </div>
    </section>
  `, script: () => {
    // Import landing page styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/pages/landing/style.css';
    document.head.appendChild(link);
    console.log('Landing page loaded');
  } },
  { path: '/dashboard', template: '<h1>Dashboard</h1><p>Your learning progress</p>', script: () => console.log('Dashboard loaded') },
  { path: '/login', template: `
    <div class="login-container">
      <div class="image-placeholder">
        <img src="/public/image/homepage-hero.png" alt="Login Illustration" />
      </div>

      <div class="form-section">
        <h1 class="title">Selamat Datang di Dcoding</h1>
        <h2 class="subtitle">Permudah alur belajar dan tingkatkan produktivitas latihanmu</h2>

        <form id="login-form">
          <input type="email" placeholder="Email" required />

          <div class="password-wrapper">
            <input type="password" id="password" placeholder="Password" required />
            <span id="togglePassword" class="toggle-icon" title="Tampilkan Password">🙈</span>
          </div>

          <a href="#" class="forgot-password">Lupa Password ?</a>
          <button type="submit" class="btn-login">Login</button>
        </form>

        <div class="divider-container">
          <div class="divider"></div>
          <div class="divider"></div>
        </div>

        <p class="register-text">
          Belum Punya Akun ? <a href="#" class="register-link">Daftar Sekarang</a>
        </p>
      </div>
    </div>
  `, script: () => {
    // Import login page styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/pages/login/style.css';
    document.head.appendChild(link);

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login berhasil!');
    });

    // Kode JavaScript untuk togglePassword (ikon monyet)
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.textContent = isHidden ? '👁️' : '🙈';
      togglePassword.title = isHidden ? 'Sembunyikan Password' : 'Tampilkan Password';
    });
  } },
  { path: '/register', template: `
    <div class="register-container">
      <div class="image-placeholder">
        <img src="/public/image/homepage-hero.png" alt="Register Illustration" />
      </div>

      <div class="form-section">
        <h2>Daftar Sekarang</h2>
        <form id="register-form">
          <input type="text" placeholder="Nama" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="text" placeholder="Asal Kota" required />

          <div class="terms">
            <input type="checkbox" id="agree" required />
            <label for="agree">
              <strong class="warning-text">Saya setuju dengan Syarat dan Kebijakan Privasi.</strong>
            </label>
          </div>

          <button type="submit" class="btn-login">Register</button>
        </form>
      </div>
    </div>
  `, script: () => {
    // Import register page styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/pages/register/style.css';
    document.head.appendChild(link);

    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Registrasi berhasil!');
    });
  } }
];

// Initialize router
new Router(routes);
