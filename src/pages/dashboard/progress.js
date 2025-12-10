import { progressAPI } from "../../api/api.js";

export default class ProgressPage {
  constructor() {
    this.title = "Progres Belajar";
  }

  // UBAH NAMA METHOD: dari render() menjadi getHtml() agar dibaca Router
  async getHtml() {
    return `
    <!-- Container Halaman -->
    <div class="min-h-screen bg-gray-50 font-sans text-slate-700">
      
      <!-- SIDEBAR -->
      <aside class="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 hidden md:flex flex-col z-20 overflow-y-auto">
          <div class="py-4">
            <nav class="space-y-1">
                </a>
                <a href="#/runtutan" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                    <i class="fa-regular fa-calendar-check mr-4 text-lg w-5 text-center"></i>
                    Runtutan Belajar
                </a>
                <a href="#/progress" class="bg-gray-100 text-slate-900 font-bold group flex items-center px-6 py-4 text-sm transition-all relative">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#0f1742]"></div>
                    <i class="fa-solid fa-chart-pie mr-4 text-lg w-5 text-center"></i>
                    Progress Belajar
                <a href="#/langganan" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                    <i class="fa-regular fa-file-lines mr-4 text-lg w-5 text-center"></i>
                    Langganan
                </a>
            </nav>
          </div>
      </aside>

      <!-- MAIN CONTENT -->
      <!-- pt-24: Memberi jarak agar tidak tertutup Navbar -->
      <!-- md:ml-64: Memberi margin kiri agar tidak tertutup Sidebar -->
      <main class="md:ml-64 pt-24 px-6 pb-12 transition-all duration-300">
        
        <div class="max-w-6xl mx-auto space-y-8">
          
          <!-- Page Header -->
          <div class="flex items-center gap-3">
             <div class="p-2 bg-[#0f1742] rounded text-white">
                <i class="fa-solid fa-chart-pie text-xl"></i>
             </div>
             <div>
                <h2 class="text-2xl font-bold text-[#0f1742]">Progres Belajar</h2>
                <p id="header-subtitle" class="text-sm text-gray-500">Memuat data...</p>
             </div>
          </div>

          <!-- SECTION 1: Kelas yang Sedang Dipelajari -->
          <section class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <!-- Header Card -->
            <div class="px-6 py-4 bg-[#0f1742] text-white flex items-center gap-3">
               <i class="fa-regular fa-calendar text-lg opacity-90"></i>
               <div>
                   <div class="text-sm font-bold">Kelas yang Sedang Dipelajari</div>
                   <div class="text-xs text-gray-300 font-light">Lanjutkan progres Anda</div>
               </div>
            </div>
            
            <!-- List Container -->
            <div id="in-progress-list" class="flex flex-col min-h-[100px]">
                <!-- Skeleton Loading -->
                <div class="p-6 space-y-4 animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
          </section>

          <!-- SECTION 2: Kelas yang Sudah Diselesaikan -->
          <section class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-10">
            <!-- Header Card -->
            <div class="px-6 py-4 bg-[#0f1742] text-white flex items-center gap-3">
               <i class="fa-regular fa-calendar-check text-lg opacity-90"></i>
               <div>
                   <div class="text-sm font-bold">Kelas yang Sudah Diselesaikan</div>
                   <div class="text-xs text-gray-300 font-light">Riwayat pencapaian</div>
               </div>
            </div>
            
            <!-- List Container -->
            <div id="completed-list" class="flex flex-col min-h-[100px]">
                 <!-- Skeleton Loading -->
                <div class="p-6 space-y-4 animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
          </section>

        </div>
      </main>
    </div>
    `;
  }

  // UBAH NAMA METHOD: dari load() menjadi afterRender() agar dipanggil Router
  async afterRender() {
    // 1. CEK TOKEN DULU
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      window.location.hash = "#/login"; // Pastikan pake # jika hash routing
      return;
    }

    await this.fetchProgressData();
  }

  async fetchProgressData() {
    const activeContainer = document.querySelector("#in-progress-list");
    const completedContainer = document.querySelector("#completed-list");
    const headerSubtitle = document.querySelector("#header-subtitle");

    if (!activeContainer || !completedContainer) return;

    try {
      // Panggil API
      const data = await progressAPI.getOverview();

      // Debugging
      console.log("Data Progress:", data);

      const allModules = data.modules || [];
      const overallPercentage = data.percentage || 0;

      if (headerSubtitle) {
        headerSubtitle.textContent = `Total Pencapaian Keseluruhan: ${overallPercentage}%`;
      }

      // Filter Data
      const activeModules = allModules.filter(
        (m) => parseInt(m.progress) < 100
      );
      const completedModules = allModules.filter(
        (m) => parseInt(m.progress) >= 100
      );

      // Helper HTML Item Generator
      const createItemHTML = (module, isCompleted) => {
        const iconClass = isCompleted
          ? "fa-solid fa-circle-check text-green-500"
          : "fa-solid fa-circle-exclamation text-yellow-500"; // Kuning untuk on-progress

        const btnText = isCompleted ? "Ulas Kembali" : "Lanjutkan Belajar";
        const progressColor = isCompleted ? "bg-green-500" : "bg-yellow-500";

        return `
            <div class="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0 gap-4">
                <div class="flex items-start gap-4">
                    <i class="${iconClass} text-xl mt-1"></i>
                    <div>
                        <div class="text-slate-800 font-bold text-base">${module.title}</div>
                        
                        <!-- Progress Bar Kecil -->
                        <div class="flex items-center gap-3 mt-2">
                            <div class="w-32 h-2 bg-gray-200 rounded-full">
                                <div class="h-2 rounded-full ${progressColor}" style="width: ${module.progress}%"></div>
                            </div>
                            <div class="text-xs text-gray-500 font-semibold">
                                ${module.progress}% Selesai
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    onclick="window.location.hash='#/module/${module.id}'"
                    class="bg-[#0f1742] text-white text-xs font-medium px-5 py-2.5 rounded shadow-sm hover:bg-blue-900 transition whitespace-nowrap self-start md:self-center">
                    ${btnText}
                </button>
            </div>
        `;
      };

      // Render Active
      if (activeModules.length > 0) {
        activeContainer.innerHTML = activeModules
          .map((m) => createItemHTML(m, false))
          .join("");
      } else {
        activeContainer.innerHTML = `
            <div class="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                <i class="fa-solid fa-clipboard-check text-4xl mb-3 opacity-20"></i>
                <span class="text-sm">Tidak ada kelas yang sedang dipelajari saat ini.</span>
            </div>`;
      }

      // Render Completed
      if (completedModules.length > 0) {
        completedContainer.innerHTML = completedModules
          .map((m) => createItemHTML(m, true))
          .join("");
      } else {
        completedContainer.innerHTML = `
            <div class="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                <i class="fa-solid fa-trophy text-4xl mb-3 opacity-20"></i>
                <span class="text-sm">Belum ada kelas yang diselesaikan. Ayo semangat!</span>
            </div>`;
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      const errorHTML = `<div class="p-5 text-red-500 text-sm text-center">Gagal memuat data. Periksa koneksi internet Anda.</div>`;
      activeContainer.innerHTML = errorHTML;
      completedContainer.innerHTML = errorHTML;
    }
  }
}
