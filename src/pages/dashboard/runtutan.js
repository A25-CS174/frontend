import { progressAPI, modulesAPI, learningPathsAPI } from "../../api/api.js";
import * as echarts from "echarts";

export default class RuntutanPage {
  constructor() {
    this.title = "Runtutan Belajar";
  }

  // --- HTML STRUCTURE ---
  async getHtml() {
    return `
    <div class="min-h-screen bg-gray-50 font-sans">

      <!-- SIDEBAR -->
      <aside class="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 hidden md:flex flex-col z-20 overflow-y-auto">
          <div class="py-4">
            <nav class="space-y-1">
                <a href="#/runtutan" class="bg-gray-100 text-slate-900 font-bold group flex items-center px-6 py-4 text-sm transition-all relative">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#0f1742]"></div>
                    <i class="fa-solid fa-chart-pie mr-4 text-lg w-5 text-center"></i>
                    Runtutan Belajar
                </a>
                <a href="#/progress" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                    <i class="fa-regular fa-calendar-check mr-4 text-lg w-5 text-center"></i>
                    Progress Belajar
                </a>
                <a href="#/langganan" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                    <i class="fa-regular fa-file-lines mr-4 text-lg w-5 text-center"></i>
                    Langganan
                </a>
            </nav>
          </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="md:ml-64 pt-24 px-6 pb-12 transition-all duration-300">
        <div class="space-y-8 max-w-6xl mx-auto">
          
          <!-- Header Page -->
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-[#0f1742]">Runtutan Belajar</h2>
            <div class="text-sm text-gray-500 font-medium">Dashboard Academy</div>
          </div>

          <!-- SECTION 1: CHART -->
          <section class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div class="p-2 bg-[#0f1742] rounded-md text-white">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-width="1.5" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-bold text-slate-800">Aktivitas Belajar</div>
                <div class="text-xs text-gray-400">Perkembangan mingguan</div>
              </div>
            </div>
            <div class="p-6">
               <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <div id="progress-minutes" class="text-3xl font-bold text-slate-900">0%</div>
                    <div class="text-sm text-gray-500 mt-1">
                      Perbandingan minggu lalu <span id="progress-percent" class="text-green-600 font-bold ml-1">0%</span>
                    </div>
                  </div>
               </div>
               <div id="learningChart" class="w-full h-[250px]"></div>
            </div>
          </section>

          <!-- SECTION 2: PROGRESS CARDS (2 Columns) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            <!-- LEFT: LEARNING PATH PROGRESS -->
            <article class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div class="bg-[#0f1742] text-white px-6 py-4">
                <div class="flex items-center gap-3">
                    <i class="fa-regular fa-calendar text-xl"></i>
                    <div>
                        <h3 class="font-semibold text-base">Progres Kelas Learning Path</h3>
                        <p class="text-xs text-gray-300">Learning Path yang Anda ikuti</p>
                    </div>
                </div>
              </div>
              <div id="learning-paths-container" class="p-6 space-y-6 min-h-[200px]">
                  <!-- Loading Skeleton -->
                  <div class="animate-pulse space-y-4">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
              </div>
            </article>

            <!-- RIGHT: NON-LEARNING PATH PROGRESS -->
            <article class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div class="bg-[#0f1742] text-white px-6 py-4">
                <div class="flex items-center gap-3">
                    <i class="fa-regular fa-calendar text-xl"></i>
                    <div>
                        <h3 class="font-semibold text-base">Progres Kelas Non Learning Path</h3>
                        <p class="text-xs text-gray-300">Modul terpisah</p>
                    </div>
                </div>
              </div>
              <div id="non-learning-container" class="p-6 space-y-6 min-h-[200px]">
                  <!-- Loading Skeleton -->
                  <div class="animate-pulse space-y-4">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
              </div>
            </article>

          </div>
        </div>
      </main>
    </div>
    `;
  }

  // --- LOGIC & RENDERING ---

  async afterRender() {
    // Cek Login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    // Load semua data secara paralel agar efisien
    await Promise.all([
      this.initChart(),
      this.loadLearningPaths(),
      this.loadNonLearningPathModules(),
    ]);
  }

  // Helper: Menentukan warna berdasarkan value progress
  getStatusStyle(percentage) {
    if (percentage >= 100) {
      return {
        bg: "bg-green-600",
        text: "text-green-600",
        icon: "fa-circle-check",
      };
    } else if (percentage >= 50) {
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-600",
        icon: "fa-circle-exclamation",
      };
    } else {
      return {
        bg: "bg-red-600",
        text: "text-red-600",
        icon: "fa-circle-exclamation",
      };
    }
  }

  // 1. RENDER LEARNING PATHS (REAL DATA)
  async loadLearningPaths() {
    const container = document.querySelector("#learning-paths-container");
    if (!container) return;

    try {
      // 1. Ambil daftar Learning Paths dan Data Overview Progress User
      const [paths, overviewData] = await Promise.all([
        learningPathsAPI.getAll(),
        progressAPI.getOverview(),
      ]);

      if (!paths || paths.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-sm text-center">Belum ada Learning Path yang diikuti.</p>`;
        return;
      }

      // 2. Render HTML
      container.innerHTML = paths
        .map((path, index) => {
          const uniqueId = `lp-${path.id || index}`;
          const modules = path.modules || [];

          // --- LOGIC HITUNG PROGRESS REAL ---
          let totalProgress = 0;
          let totalModules = modules.length;

          // Mapping modul untuk mendapatkan progress masing-masing
          const modulesWithProgress = modules.map((mod) => {
            // Cari progress modul ini di data overview user
            // overviewData.modules berisi array [{id, progress}, ...]
            const userModData = overviewData.modules?.find(
              (m) => m.id === mod.id
            );
            const currentP = userModData ? parseInt(userModData.progress) : 0;

            totalProgress += currentP;

            return {
              ...mod,
              progress: currentP,
            };
          });

          // Hitung rata-rata progress Learning Path
          const pathProgress =
            totalModules > 0 ? Math.round(totalProgress / totalModules) : 0;

          // Tentukan style berdasarkan rata-rata
          const style = this.getStatusStyle(pathProgress);

          // Generate List Modules (Dropdown Items)
          const modulesListHTML = modulesWithProgress
            .map((mod, i) => {
              const modStyle = this.getStatusStyle(mod.progress);

              return `
              <div class="flex items-center justify-between gap-4 text-sm mt-3 pl-4 relative">
                  <!-- Garis Tree Vertikal -->
                  <div class="absolute left-0 top-[-10px] bottom-0 w-[2px] bg-gray-200"></div>
                  <!-- Garis Tree Horizontal -->
                  <div class="absolute left-0 top-1/2 w-3 h-[2px] bg-gray-200"></div>

                  <span class="text-gray-600 truncate flex-1 pl-2">${
                    mod.title || "Modul Tanpa Judul"
                  }</span>
                  <div class="w-16 h-2 bg-gray-200 rounded-full shrink-0">
                      <div class="h-2 rounded-full ${
                        modStyle.bg
                      }" style="width: ${mod.progress}%"></div>
                  </div>
              </div>
             `;
            })
            .join("");

          // Render Card Item
          return `
            <div class="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <!-- Header Item -->
                <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid ${style.icon} ${style.text} text-lg"></i>
                    <h4 class="font-semibold text-slate-800 text-sm md:text-base">
                        ${path.learning_path_name}
                    </h4>
                </div>

                <!-- Progress Bar Utama -->
                <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div class="h-3 rounded-full ${style.bg} transition-all duration-500" style="width: ${pathProgress}%"></div>
                </div>

                <!-- Accordion Trigger -->
                <button 
                    onclick="document.getElementById('details-${uniqueId}').classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180');"
                    class="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors focus:outline-none group mt-1"
                >
                    <div class="flex items-center gap-1 font-medium">
                        <i class="chevron fa-solid fa-chevron-down transition-transform duration-200 text-[10px]"></i>
                        <span>Detail Progress</span>
                    </div>
                    <span class="font-bold text-slate-700">${pathProgress}%/100%</span>
                </button>

                <!-- Dropdown Content (Hidden by default) -->
                <div id="details-${uniqueId}" class="hidden mt-2 pl-2 border-l-2 border-dashed border-gray-100 ml-1">
                    ${modulesListHTML}
                </div>
            </div>
          `;
        })
        .join("");
    } catch (err) {
      console.error("Error loading LP:", err);
      container.innerHTML = `<p class="text-red-500 text-sm">Gagal memuat data.</p>`;
    }
  }

  // 2. RENDER NON-LEARNING PATH (REAL DATA)
  async loadNonLearningPathModules() {
    const container = document.querySelector("#non-learning-container");
    if (!container) return;

    try {
      const [modules, overviewData] = await Promise.all([
        modulesAPI.getAll(),
        progressAPI.getOverview(),
      ]);

      if (!modules || modules.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-sm text-center">Belum ada modul yang diikuti.</p>`;
        return;
      }

      // Opsional: Filter jika ingin memisahkan mana yang masuk LP dan mana yang tidak
      // Untuk sekarang kita tampilkan 5 modul pertama sebagai contoh
      const displayModules = modules.slice(0, 5);

      container.innerHTML = displayModules
        .map((m) => {
          // Cari progress user untuk modul ini
          const foundMod = overviewData.modules?.find((ov) => ov.id === m.id);
          const progress = foundMod ? parseInt(foundMod.progress) : 0;

          const style = this.getStatusStyle(progress);

          return `
            <div class="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <!-- Header -->
                <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid ${style.icon} ${style.text} text-lg"></i>
                    <h4 class="font-semibold text-slate-800 text-sm md:text-base truncate">
                        ${m.title}
                    </h4>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div class="h-3 rounded-full ${style.bg} transition-all duration-500" style="width: ${progress}%"></div>
                </div>

                <!-- Footer Percentage -->
                <div class="text-right">
                    <span class="text-xs font-bold text-slate-700">${progress}%/100%</span>
                </div>
            </div>
          `;
        })
        .join("");
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p class="text-red-500 text-sm">Gagal memuat modul.</p>`;
    }
  }

  // --- CHART (REAL DATA) ---
  async initChart() {
    // Memastikan elemen ada sebelum inisialisasi
    requestAnimationFrame(async () => {
      const chartDom = document.getElementById("learningChart");
      if (!chartDom) return;

      let labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
      let values = [0, 0, 0, 0, 0, 0, 0];

      try {
        // Ambil Data Chart
        const apiData = await progressAPI.getChart();
        if (apiData?.labels) labels = apiData.labels;
        if (apiData?.data) values = apiData.data;

        // Ambil Data Overview untuk Statistik Angka
        const overview = await progressAPI.getOverview();

        if (document.getElementById("progress-minutes"))
          document.getElementById("progress-minutes").textContent = `${
            overview.percentage || 0
          }%`;

        if (document.getElementById("progress-percent"))
          document.getElementById("progress-percent").textContent = `${
            overview.percentage || 0
          }%`;
      } catch (e) {
        console.log("Gagal load chart data");
      }

      // Reset Chart Instance jika ada (mencegah double render)
      if (echarts.getInstanceByDom(chartDom)) {
        echarts.getInstanceByDom(chartDom).dispose();
      }

      const myChart = echarts.init(chartDom);
      const option = {
        color: ["#0f1742"],
        tooltip: { trigger: "axis" },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: labels,
          axisLine: { lineStyle: { color: "#ccc" } },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
        },
        series: [
          {
            name: "Menit",
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(15, 23, 66, 0.3)" },
                { offset: 1, color: "rgba(15, 23, 66, 0.01)" },
              ]),
            },
            data: values,
            lineStyle: { width: 3 },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize());
    });
  }
}
