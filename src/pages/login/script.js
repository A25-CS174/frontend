import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="login-container">
    <div class="image-placeholder">
      <img src="../../public/image/homepage-hero.png" alt="Login Illustration" />
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
`;

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