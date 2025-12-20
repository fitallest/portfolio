
/*
  JAVASCRIPT RIÊNG CHO TRANG PROJECTS (page-projects.js)
  Chứa logic cho:
  - Tải và hiển thị dữ liệu dự án từ project-data.js
  - Tải và hiển thị Giao diện mẫu từ GOOGLE SHEET (CSV)
  - Chuyển đổi Tabs
  - Tìm kiếm & Bộ lọc (Ngành, Màu sắc)
  - MODAL Logic: Xem nhanh (Preview) và Đặt hàng (Order)
*/

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt icon Lucide
    lucide.createIcons();

    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    // === 1. LOGIC DỰ ÁN ĐÃ LÀM (EXISTING) ===
    const projectGrid = document.getElementById('project-grid'); 

    if (projectGrid && typeof projectsData !== 'undefined' && Array.isArray(projectsData)) {
        projectGrid.innerHTML = '';

        if (projectsData.length === 0) {
            projectGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">Chưa có dự án nào được thêm.</p>';
        } else {
            projectsData.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card group'; 
                
                projectCard.innerHTML = `
                    <a href="${escapeHtml(project.link) || '#'}" target="_blank" class="block overflow-hidden relative">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                        <img src="${escapeHtml(project.imageUrl) || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}" 
                             alt="${escapeHtml(project.title)}" 
                             onerror="this.onerror=null; this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';" 
                             loading="lazy">
                    </a>
                    <div class="content">
                        <span class="category">${escapeHtml(project.category)}</span>
                        <h3>${escapeHtml(project.title)}</h3>
                        <p class="line-clamp-3">${escapeHtml(project.description)}</p>
                    </div>
                `;
                projectGrid.appendChild(projectCard);
            });
        }
    } else if (projectGrid) {
        projectGrid.innerHTML = '<p class="text-center text-red-500 col-span-full">Lỗi: Không thể tải dữ liệu dự án.</p>';
    }

    // === 2. DỮ LIỆU GIAO DIỆN MẪU TỪ GOOGLE SHEET ===
    const templateGrid = document.getElementById('template-grid');
    const searchInput = document.getElementById('template-search');
    const filterIndustry = document.getElementById('filter-industry');
    const filterColor = document.getElementById('filter-color');
    const noResult = document.getElementById('no-template-result');
    const syncStatus = document.getElementById('sync-status');

    // Google Sheet CSV Link (Đã sửa từ output=pdf thành output=csv)
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRn3P83CbT92vG--ObmNHT0giyfvj6upWgPe5HJ_VjR7KhFkuiC-OPI-CQzeKRqU-yjMnp-kl8VnVK2/pub?gid=504793513&single=true&output=csv';

    let allTemplates = []; // Chứa dữ liệu sau khi tải

    // Hàm Parse CSV thủ công
    function parseCSV(csvText) {
        const rows = [];
        // Tách dòng, xử lý cả \r\n
        const lines = csvText.split(/\r?\n/);
        
        // Dòng đầu là header (bỏ qua hoặc dùng để map)
        // Cấu trúc mong đợi: Title, Category, Link, Image, Tags, Description
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Xử lý CSV chuẩn (có dấu phẩy trong ngoặc kép)
            // Regex match các trường CSV
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            // Fallback simple split nếu regex fail (đối với CSV đơn giản)
            const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim()); 

            if (cols.length >= 3) { // Cần ít nhất Title, Category, Link
                rows.push({
                    id: `sheet-${i}`,
                    title: cols[0] || 'Mẫu Giao Diện', // Cột A
                    category: cols[1] || 'Khác',       // Cột B
                    link: cols[2] || '#',              // Cột C
                    img: cols[3] || 'https://placehold.co/600x400/e2e8f0/64748b?text=Demo', // Cột D
                    tags: cols[4] || '',               // Cột E
                    description: cols[5] || ''         // Cột F
                });
            }
        }
        return rows;
    }

    async function fetchSheetData() {
        try {
            const response = await fetch(SHEET_CSV_URL);
            if (!response.ok) throw new Error('Network error');
            const csvText = await response.text();
            const sheetData = parseCSV(csvText);
            
            // Gộp dữ liệu từ file tĩnh (nếu có) và Sheet
            const staticData = (typeof templatesData !== 'undefined' && Array.isArray(templatesData)) ? templatesData : [];
            allTemplates = [...staticData, ...sheetData];
            
            if (syncStatus) syncStatus.innerHTML = '<i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i> Đã đồng bộ dữ liệu mới nhất';
            lucide.createIcons();

            populateFilters();
            renderTemplates(allTemplates);

        } catch (error) {
            console.error("Lỗi tải Google Sheet:", error);
            if (syncStatus) syncStatus.innerHTML = '<i data-lucide="alert-circle" class="w-3 h-3 text-red-500"></i> Lỗi đồng bộ. Dùng dữ liệu đệm.';
            
            // Fallback to static data only
            if (typeof templatesData !== 'undefined' && Array.isArray(templatesData)) {
                allTemplates = templatesData;
                populateFilters();
                renderTemplates(allTemplates);
            } else {
                if(templateGrid) templateGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">Chưa có dữ liệu.</p>';
            }
            lucide.createIcons();
        }
    }

    function populateFilters() {
        // Industry và Color đã hardcode trong HTML, không cần populate bằng JS nữa để tránh ghi đè
    }

    function filterTemplates() {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const industry = filterIndustry ? filterIndustry.value : '';
        const color = filterColor ? filterColor.value.toLowerCase() : '';

        const filtered = allTemplates.filter(t => {
            const matchesTerm = !term || t.title.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term);
            const matchesIndustry = !industry || t.category === industry;
            
            // So sánh tương đối cho màu sắc/tag
            const matchesColor = !color || (t.tags && t.tags.toLowerCase().includes(color));
            
            return matchesTerm && matchesIndustry && matchesColor;
        });

        renderTemplates(filtered);
    }

    // === MODAL ELEMENTS ===
    const previewModal = document.getElementById('preview-modal');
    const orderModal = document.getElementById('order-modal');
    
    // Preview Elements
    const previewImg = document.getElementById('preview-img');
    const previewTitle = document.getElementById('preview-title');
    const closePreviewBtn = document.getElementById('close-preview');
    const btnChooseFromPreview = document.getElementById('btn-choose-from-preview');

    // Order Elements
    const orderTplImg = document.getElementById('order-tpl-img');
    const orderTplTitle = document.getElementById('order-tpl-title');
    const orderTplId = document.getElementById('order-tpl-id');
    const hiddenTplInfo = document.getElementById('hidden-tpl-info');
    const closeOrderBtn = document.getElementById('close-order');
    const orderForm = document.getElementById('order-form');

    let currentSelectedTemplate = null;

    // --- RENDER TEMPLATES ---
    function renderTemplates(data) {
        if (!templateGrid) return;
        templateGrid.innerHTML = '';
        
        if (!data || data.length === 0) {
            if(noResult) noResult.classList.remove('hidden');
            return;
        } else {
            if(noResult) noResult.classList.add('hidden');
        }

        data.forEach(tpl => {
            const tplCard = document.createElement('div');
            tplCard.className = 'template-card group animate-fadeIn'; 
            
            // Tạo ID duy nhất cho nút
            const btnOrderId = `btn-order-${tpl.id}`;

            tplCard.innerHTML = `
                <div class="overflow-hidden relative h-56 cursor-pointer preview-trigger" data-tpl-id="${tpl.id}">
                    <img src="${tpl.img}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" onerror="this.src='https://placehold.co/600x400/cccccc/ffffff?text=No+Image'">
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span class="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i> Xem Nhanh
                        </span>
                    </div>
                </div>
                <div class="content">
                    <span class="category">${escapeHtml(tpl.category)}</span>
                    <h3 class="group-hover:text-indigo-600 transition-colors line-clamp-1">${escapeHtml(tpl.title)}</h3>
                    <p class="text-xs mt-1 text-gray-500 truncate"><i data-lucide="tag" class="w-3 h-3 inline mr-1"></i>${escapeHtml(tpl.tags || 'Đang cập nhật')}</p>
                    <div class="actions">
                        <!-- Đổi nút "Xem ảnh lớn" thành "Xem Website" -->
                        <a href="${tpl.link || '#'}" target="_blank" class="template-btn btn-preview flex items-center justify-center gap-1 text-decoration-none">
                            <i data-lucide="external-link" class="w-3 h-3"></i> Xem Website
                        </a>
                        <button id="${btnOrderId}" class="template-btn btn-choose">Chọn mẫu này</button>
                    </div>
                </div>
            `;
            templateGrid.appendChild(tplCard);

            const imgTrigger = tplCard.querySelector('.preview-trigger');
            const btnOrder = document.getElementById(btnOrderId);

            const openPreviewHandler = () => openPreviewModal(tpl);
            imgTrigger.addEventListener('click', openPreviewHandler);
            
            btnOrder.addEventListener('click', () => openOrderModal(tpl));
        });
        lucide.createIcons();
    }

    // --- MODAL FUNCTIONS ---

    function openPreviewModal(tpl) {
        currentSelectedTemplate = tpl;
        previewImg.src = tpl.img;
        previewTitle.textContent = tpl.title;
        previewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => previewModal.classList.remove('opacity-0'), 10);
    }

    function closePreviewModal() {
        previewModal.classList.add('opacity-0');
        setTimeout(() => {
            previewModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    function openOrderModal(tpl) {
        if (!previewModal.classList.contains('hidden')) {
            closePreviewModal();
        }
        orderTplImg.src = tpl.img;
        orderTplTitle.textContent = tpl.title;
        orderTplId.textContent = `ID: ${tpl.id}`;
        hiddenTplInfo.value = `${tpl.title} (ID: ${tpl.id}, Link: ${tpl.link})`;
        
        orderModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeOrderModal() {
        orderModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // --- EVENT LISTENERS ---
    if (closePreviewBtn) closePreviewBtn.addEventListener('click', closePreviewModal);
    if (btnChooseFromPreview) btnChooseFromPreview.addEventListener('click', () => { if (currentSelectedTemplate) openOrderModal(currentSelectedTemplate); });
    if (closeOrderBtn) closeOrderBtn.addEventListener('click', closeOrderModal);
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreviewModal();
        if (e.target === orderModal) closeOrderModal();
    });

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = orderForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Đang gửi...'; btn.disabled = true;
            const fd = new FormData(orderForm);
            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: fd, headers: { 'Accept': 'application/json' } })
            .then(response => {
                if (response.ok) { alert("Yêu cầu đã được gửi thành công!"); orderForm.reset(); closeOrderModal(); }
                else { alert("Có lỗi xảy ra. Vui lòng thử lại sau."); }
            })
            .catch(error => { alert("Lỗi kết nối mạng."); })
            .finally(() => { btn.innerText = originalText; btn.disabled = false; });
        });
    }

    // Filter Events
    if (searchInput) searchInput.addEventListener('keyup', filterTemplates);
    if (filterIndustry) filterIndustry.addEventListener('change', filterTemplates);
    if (filterColor) filterColor.addEventListener('change', filterTemplates);

    // === 3. TAB SWITCHING LOGIC ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.add('text-gray-500');
                b.classList.remove('text-indigo-600');
            });
            btn.classList.add('active');
            btn.classList.remove('text-gray-500');
            tabPanes.forEach(p => p.classList.add('hidden'));
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // START FETCHING
    fetchSheetData();

}); // End DOMContentLoaded
