import { usersAPI, modulesAPI, progressAPI } from "../../api/api.js";

class ProfilePage {
  render() {
    return `
      <div class="min-h-screen bg-gray-50 pt-16 font-sans text-slate-800">
        
        <!-- === HEADER PROFILE === -->
        <div class="bg-[#0f1742] max-w-full text-white pb-12 pt-8 px-4 md:px-8">
          <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
            
            <!-- KOLOM KIRI: FOTO & LOGOUT -->
            <div class="flex flex-col items-center gap-4 mx-auto md:mx-0">
                <!-- Foto Profil Besar -->
                <div class="w-40 h-40 bg-white rounded-md shrink-0 shadow-lg overflow-hidden relative group">
                   <img id="profile-image" src="https://ui-avatars.com/api/?name=Loading" alt="Profile" class="w-full h-full object-cover">
                </div>
                
                <!-- TOMBOL LOGOUT -->
                <button id="btn-logout" class="w-full py-2 px-4 border border-red-400 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>

            <!-- Informasi User -->
            <div class="flex-1 space-y-2 text-center md:text-left mt-2">
              <h1 id="user-name" class="text-3xl font-bold">Memuat Data...</h1>
              
              <p class="text-gray-300 text-sm">
                Bergabung sejak <span id="join-date">...</span>
              </p>
              
              <p class="text-gray-300 text-sm">
                <i class="fa-solid fa-location-dot mr-1"></i> 
                <span id="user-location">...</span>
              </p>
              
              <p id="user-email" class="text-gray-300 text-sm">...</p>
            </div>

            <!-- Kotak Maskot -->
            <div class="w-full md:w-64 h-48 rounded-md flex items-center justify-center p-4 text-center shrink-0 mt-4 md:mt-0 transition-transform hover:scale-105 cursor-pointer">
              <!-- Pastikan path gambar maskot benar -->
              <img src="/image/LearnFlow-mascot.png" alt="LearnFlow Mascot" class="max-w-full max-h-full object-contain" onerror="this.style.display='none'">
            </div>
          </div>
        </div>

        <!-- === DAFTAR KELAS === -->
        <div class="max-w-6xl mx-auto px-4 md:px-8 -mt-6">
          
          <div class="flex items-center gap-3 mb-6 mt-10">
            <div class="bg-[#0f1742] text-white p-2 rounded flex items-center justify-center w-10 h-10">
               <i class="fa-solid fa-book-open"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Kelas yang diikuti</h2>
          </div>

          <!-- Grid Cards -->
          <div id="course-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <!-- SKELETON LOADING -->
            ${[1, 2]
              .map(
                () => `
              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-48 animate-pulse">
                <div class="flex gap-4 h-full">
                    <div class="w-32 bg-gray-200 rounded-md"></div>
                    <div class="flex-1 space-y-3 py-2">
                        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
                    </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          
           <div class="flex justify-center pb-12">
             <button class="bg-[#0f1742] hover:bg-blue-900 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg flex items-center gap-2 text-sm">
                Tampilkan Semua Kelas
                <i class="fa-solid fa-chevron-down text-xs"></i>
             </button>
          </div>

        </div>
      </div>
    `;
  }

  // --- LOGIC UTAMA ---
  async afterRender() {
    // 1. Setup Logout Button
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Yakin ingin logout?")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.hash = "#/login";
          window.location.reload();
        }
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Ambil data user dari LocalStorage
      const localUserStr = localStorage.getItem("user");
      const localUser = localUserStr ? JSON.parse(localUserStr) : null;

      // Ambil SEMUA user dari API
      const allUsers = await usersAPI.getAll();

      let currentUser = null;

      // Helper: decode payload JWT
      const parseJwt = (t) => {
        try {
          const base64Url = t.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch {
          return null;
        }
      };

      if (Array.isArray(allUsers)) {
        if (localUser) {
          currentUser =
            allUsers.find((u) => u.id === localUser.id) ||
            allUsers.find((u) => u.email === localUser.email);
        }
        if (!currentUser && token) {
          const payload = parseJwt(token);
          if (payload) {
            currentUser =
              allUsers.find((u) => u.id === payload.id) ||
              allUsers.find((u) => u.email === payload.email);
          }
        }
      }

      if (!currentUser) {
        console.warn(
          "User tidak ditemukan di list API, menggunakan data local."
        );
        currentUser = localUser;
      }

      // Update UI Profile
      if (currentUser) {
        document.getElementById("user-name").textContent =
          currentUser.name || "User";
        document.getElementById("user-email").textContent =
          currentUser.email || "-";
        document.getElementById("user-location").textContent =
          currentUser.city || currentUser.address || "Indonesia";

        const joinYear = currentUser.createdAt
          ? new Date(currentUser.createdAt).getFullYear()
          : new Date().getFullYear();
        document.getElementById("join-date").textContent = joinYear;

        const photoUrl =
          currentUser.photo ||
          `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`;

        const profileImg = document.getElementById("profile-image");
        if (profileImg) profileImg.src = photoUrl;

        const navImg = document.getElementById("nav-profile-img");
        if (navImg) navImg.src = photoUrl;
      }

      // --- Ambil Data Kelas ---
      const [modules, overviewData] = await Promise.all([
        modulesAPI.getAll(),
        progressAPI.getOverview(),
      ]);

      const gridContainer = document.getElementById("course-grid");

      if (!modules || modules.length === 0) {
        gridContainer.innerHTML = `<p class="col-span-2 text-center text-gray-500 py-10">Belum ada kelas.</p>`;
        return;
      }

      gridContainer.innerHTML = modules
        .map((module) => {
          // Cari progress user untuk modul ini
          const userModuleData = overviewData.modules?.find(
            (m) => m.id === module.id
          );
          const currentProgress = userModuleData
            ? parseInt(userModuleData.progress)
            : 0;
          const isLulus = currentProgress === 100;
          const totalModul = module.totalChapters || 0;

          const statusData = isLulus
            ? {
                text: "Lulus",
                icon: "fa-circle-check",
                color: "text-green-600",
              }
            : {
                text: "Belum Lulus",
                icon: "fa-circle-exclamation",
                color: "text-red-500",
              };

          return `
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
            <div class="w-full md:w-32 h-32 bg-gray-100 rounded-md shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors overflow-hidden">
               <img src="/image/module-icon.png" alt="Class" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
               <i class="fa-solid fa-image text-3xl hidden"></i>
            </div>
            <div class="flex flex-col justify-between flex-1 w-full">
              <div class="flex items-center gap-2 ${
                statusData.color
              } text-sm font-bold mb-2">
                <i class="fa-solid ${statusData.icon}"></i>
                <span>${statusData.text}</span>
                ${
                  !isLulus
                    ? `<span class="text-xs text-gray-500 font-normal">(${currentProgress}%)</span>`
                    : ""
                }
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug">${
                module.title
              }</h3>
              <div class="flex items-center justify-between mt-auto pt-2">
                <button onclick="window.location.hash='#/module/${
                  module.id
                }'" class="bg-[#0f1742] hover:bg-blue-900 text-white text-xs font-medium py-2 px-5 rounded-full transition-colors">Detail Kelas</button>
                <span class="text-xs text-slate-500 font-medium">${
                  totalModul > 0 ? `${totalModul} Chapters` : "Akses Selamanya"
                }</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (error) {
      console.error("Profile Error:", error);
      const grid = document.getElementById("course-grid");
      if (grid)
        grid.innerHTML = `<p class="text-red-500 col-span-2 text-center">Gagal memuat data. Silakan login ulang.</p>`;
    }
  }
}

export default ProfilePage;
