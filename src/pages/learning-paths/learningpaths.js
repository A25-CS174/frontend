import { learningPathsAPI } from "../../api/api.js";

export default class LearningPathsPage {
  constructor() {
    this.title = "Learning Paths";
  }

  async getHtml() {
    return `
      <div class="min-h-screen bg-gray-50 font-sans">
        <!-- SIDEBAR -->
        <aside class="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 hidden md:flex flex-col z-20 overflow-y-auto">
          <div class="py-4">
            <nav class="space-y-1">
              <a href="#/runtutan" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                <i class="fa-solid fa-chart-pie mr-4 text-lg w-5 text-center"></i>
                Runtutan Belajar
              </a>
              <a href="#/progress" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                <i class="fa-regular fa-calendar-check mr-4 text-lg w-5 text-center"></i>
                Progress Belajar
              </a>
              <a href="#/learning-paths" class="bg-gray-100 text-slate-900 font-bold group flex items-center px-6 py-4 text-sm transition-all relative">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#0f1742]"></div>
                <i class="fa-solid fa-road mr-4 text-lg w-5 text-center"></i>
                Learning Paths
              </a>
              <a href="#/langganan" class="text-gray-600 hover:bg-gray-50 hover:text-slate-900 group flex items-center px-6 py-4 text-sm font-medium transition-all">
                <i class="fa-regular fa-file-lines mr-4 text-lg w-5 text-center"></i>
                Langganan
              </a>
            </nav>
          </div>
        </aside>

        <main class="md:ml-64 pt-24 px-6 pb-12 max-w-6xl mx-auto">
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-[#0f1742] text-white p-2 rounded flex items-center justify-center w-10 h-10">
              <i class="fa-solid fa-road"></i>
            </div>
            <h1 class="text-xl font-bold">Learning Paths</h1>
          </div>

          <div id="lp-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Loading -->
            <div class="animate-pulse bg-white p-6 rounded-lg border border-gray-200 shadow-sm"> 
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
            </div>
            <div class="animate-pulse bg-white p-6 rounded-lg border border-gray-200 shadow-sm"> 
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  async afterRender() {
    // cek login
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      window.location.hash = "#/login";
      return;
    }

    await this.loadLearningPaths();
    // refresh when LP selection changes
    window.addEventListener("learningpath:changed", async () => {
      await this.loadLearningPaths();
    });
  }

  async loadLearningPaths() {
    const container = document.getElementById("lp-list");
    if (!container) return;

    try {
      const paths = await learningPathsAPI.getAll();
      const selected = parseInt(localStorage.getItem("selectedLearningPath")) || null;

      if (!paths || paths.length === 0) {
        container.innerHTML = `<p class="col-span-2 text-center text-gray-500 py-10">Tidak ada Learning Path.</p>`;
        return;
      }

      container.innerHTML = paths
        .map((p) => {
          const isSelected = selected === p.learning_path_id || selected === p.learning_path_id;
          const modulesCount = (p.modules && p.modules.length) || 0;
          return `
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-slate-900 text-lg mb-2">${p.learning_path_name}</h3>
                <p class="text-sm text-gray-500 mb-4">${modulesCount} modul</p>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-400">Diperbarui: ${new Date(p.updated_at || p.created_at).toLocaleDateString()}</div>
                <div class="flex items-center gap-2">
                  <button data-id="${p.learning_path_id}" class="btn-follow bg-[#0f1742] text-white text-xs font-medium py-2 px-3 rounded transition-colors">
                    ${isSelected ? "Sedang Diikuti" : "Ikuti"}
                  </button>
                  ${isSelected ? `<button data-id="${p.learning_path_id}" class="btn-unfollow text-xs text-red-500">Berhenti</button>` : ""}
                </div>
              </div>
            </div>
          `;
        })
        .join("");

      // attach listeners
      container.querySelectorAll(".btn-follow").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = parseInt(btn.getAttribute("data-id"));
          localStorage.setItem("selectedLearningPath", id);
          alert("Anda sekarang mengikuti Learning Path. Halaman akan diperbarui.");
          // refresh page to update UI
          await this.loadLearningPaths();
          // trigger other pages by dispatching event
          window.dispatchEvent(new Event("learningpath:changed"));
        });
      });

      container.querySelectorAll(".btn-unfollow").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = parseInt(btn.getAttribute("data-id"));
          const current = parseInt(localStorage.getItem("selectedLearningPath"));
          if (current === id) {
            localStorage.removeItem("selectedLearningPath");
            alert("Anda berhenti mengikuti Learning Path ini. Halaman akan diperbarui.");
            await this.loadLearningPaths();
            window.dispatchEvent(new Event("learningpath:changed"));
          }
        });
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p class="col-span-2 text-center text-red-500 py-10">Gagal memuat Learning Paths.</p>`;
    }
  }
}
