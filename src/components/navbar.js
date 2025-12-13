export const navbar = `
<nav class="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 h-16 shadow-sm">
  <!-- Container Utama -->
  <div class="container mx-auto h-full px-4 md:px-8 flex flex-row items-center justify-between max-w-7xl relative bg-white">
    
    <!-- 1. BAGIAN KIRI: LOGO -->
    <div class="flex justify-start items-center">
        <a href="#/" class="flex items-center gap-2 z-50">
          <img src="/image/learnflow-header-logo.png" 
               alt="LearnFlow" 
               class="h-8 w-auto object-contain block" 
               onerror="this.style.display='none'; document.getElementById('logo-text').classList.remove('hidden')" />
          <span id="logo-text" class="font-bold text-xl text-[#0f1742] hidden whitespace-nowrap">LEARNFLOW</span>
        </a>
    </div>

    <!-- 2. BAGIAN TENGAH: MENU DESKTOP (Hidden on Mobile) -->
    <div class="hidden md:flex flex-1 justify-center items-center px-4">
        <ul class="flex gap-8 text-sm font-medium text-gray-600">
            <li><a href="#/" class="hover:text-slate-900 hover:font-bold transition-all">Home</a></li>
            <li><a href="#/runtutan" class="hover:text-slate-900 hover:font-bold transition-all">Dashboard</a></li>
            <li><a href="#/login" class="hover:text-slate-900 hover:font-bold transition-all">Login</a></li>
            <li><a href="#/register" class="hover:text-slate-900 hover:font-bold transition-all">Register</a></li>
        </ul>
    </div>

    <!-- 3. BAGIAN KANAN: MENU (Profile & Toggle) -->
    <div class="flex justify-end items-center gap-3">
        
        <!-- Desktop Profile (Hidden on Mobile) -->
        <div class="hidden md:flex items-center gap-4 pl-4 border-l border-gray-200">
            
            <a href="#/profile" class="block">
                <img id="nav-profile-img-desktop" src="https://ui-avatars.com/api/?name=Guest&background=E2E8F0&color=64748B" alt="Profile" class="w-9 h-9 rounded-full border border-gray-200 object-cover hover:ring-2 hover:ring-blue-100 transition-all">
            </a>
        </div>

        <!-- Mobile Profile & Toggle (Visible on Mobile) -->
        <div class="flex md:hidden items-center gap-2">

            <!-- Toggle Button (Profile + Drawer Icon) -->
            <button id="mobile-menu-toggle" class="flex items-center gap-2 focus:outline-none p-1 pr-2 rounded-full border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                <!-- Foto Profile -->
                <img id="nav-profile-img-mobile" src="https://ui-avatars.com/api/?name=GU&background=E2E8F0&color=64748B" alt="Profile" class="w-8 h-8 rounded-full border border-gray-200 object-cover">
                
                <!-- ICON DRAWER BARU -->
                <img src="/image/drawer-icon.png" alt="Menu" class="w-5 h-5 object-contain opacity-80" />
            </button>
        </div>

    </div>
  </div>

  <!-- === MOBILE DRAWER (Menu Samping) === -->
  
  <div id="mobile-backdrop" class="fixed inset-0 bg-slate-900/50 z-30 hidden md:hidden transition-opacity duration-300 backdrop-blur-sm top-16"></div>

  <!-- Drawer Container -->
  <div id="mobile-drawer" class="fixed top-16 left-0 w-[85%] max-w-[300px] h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transform -translate-x-full transition-transform duration-300 md:hidden overflow-y-auto shadow-2xl">
      <div class="py-4">
          <ul class="flex flex-col">
              
              <!-- 1. PROFILE -->
              <li class="border-b border-gray-50">
                  <a href="#/profile" class="block py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-50 hover:text-[#0f1742] transition-colors">
                    Profile
                  </a>
              </li>

              <!-- 2. HOME -->
              <li class="border-b border-gray-50">
                  <a href="#/" class="block py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-50 hover:text-[#0f1742] transition-colors">
                    Home
                  </a>
              </li>

              <!-- 3. DASHBOARD MENU -->
              <li class="border-b border-gray-50">
                  <div class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Dashboard Menu
                  </div>
                  <ul class="flex flex-col pb-4 pl-6 space-y-1">
                      <li>
                          <a href="#/runtutan" class="block py-2 px-4 text-sm font-medium text-slate-600 hover:text-[#0f1742] hover:bg-gray-50 rounded-l-lg transition-colors">
                             Runtutan Belajar
                          </a>
                      </li>
                      <li>
                          <a href="#/progress" class="block py-2 px-4 text-sm font-medium text-slate-600 hover:text-[#0f1742] hover:bg-gray-50 rounded-l-lg transition-colors">
                             Progress Belajar
                          </a>
                      </li>
                      <li>
                          <a href="#/langganan" class="block py-2 px-4 text-sm font-medium text-slate-600 hover:text-[#0f1742] hover:bg-gray-50 rounded-l-lg transition-colors">
                             Langganan
                          </a>
                      </li>
                  </ul>
              </li>

              <!-- 4. LOGIN -->
              <li class="border-b border-gray-50 mt-2">
                  <a href="#/login" class="block py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-50 hover:text-[#0f1742] transition-colors">
                    Login
                  </a>
              </li>

              <!-- 5. REGISTER -->
              <li class="border-b border-gray-50">
                  <a href="#/register" class="block py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-gray-50 hover:text-[#0f1742] transition-colors">
                    Register
                  </a>
              </li>
          </ul>
      </div>
  </div>
</nav>
`;

/**
 * Fungsi inisialisasi navbar
 */
export function initNavbar() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-backdrop");

  // Logic Toggle Menu
  if (toggleBtn && drawer && backdrop) {
    let isOpen = false;

    const toggle = () => {
      isOpen = !isOpen;
      if (isOpen) {
        drawer.classList.remove("-translate-x-full");
        backdrop.classList.remove("hidden");
      } else {
        drawer.classList.add("-translate-x-full");
        backdrop.classList.add("hidden");
      }
    };

    // Event Listeners
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      toggle();
    };
    backdrop.onclick = () => toggle();

    // Close when clicking link inside drawer
    drawer.querySelectorAll("a").forEach((link) => {
      link.onclick = () => {
        if (isOpen) toggle();
      };
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        isOpen &&
        !drawer.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        toggle();
      }
    });
  }

  // Update Profile Image
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const initials = user.name
        ? user.name.substring(0, 2).toUpperCase()
        : "GU";
      const photo =
        user.photo ||
        `https://ui-avatars.com/api/?name=${initials}&background=E2E8F0&color=64748B`;

      const desktopImg = document.getElementById("nav-profile-img-desktop");
      const mobileImg = document.getElementById("nav-profile-img-mobile");

      if (desktopImg) desktopImg.src = photo;
      if (mobileImg) mobileImg.src = photo;
    } catch (e) {
      console.error("Error parsing user navbar", e);
    }
  }
}
