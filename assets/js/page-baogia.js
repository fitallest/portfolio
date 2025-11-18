
/*
  JAVASCRIPT RIÊNG CHO TRANG BÁO GIÁ (page-baogia.js)
  Cập nhật: Gated Content (Auto-unlock backdoor), Validate SĐT, Search Fix, Silent Submit.
  UPDATE: Chia đợt thanh toán (3 đợt) trong Modal xác nhận.
*/

// === DATA: Danh sách Tính Năng (Add-on) ===
const FEATURES_DATA = [
    {
        category: "Tính năng chung (Cơ bản & Nâng cao)",
        icon: "layers",
        id: "common",
        items: [
            { id: "f_map", name: "Tích hợp Google Maps", price: 0, desc: "Hiển thị bản đồ vị trí doanh nghiệp." },
            { id: "f_social", name: "Liên kết Mạng Xã Hội", price: 0, desc: "Nút chia sẻ, chat Zalo/Messenger/Call." },
            { id: "f_search_adv", name: "Tìm kiếm nâng cao / Bộ lọc", price: 1500000, desc: "Lọc theo danh mục, giá, thuộc tính, màu sắc." },
            { id: "f_search_suggest", name: "Tìm kiếm gợi ý (Ajax)", price: 1500000, desc: "Gợi ý sản phẩm ngay khi gõ từ khóa." },
            { id: "f_multilang", name: "Đa ngôn ngữ (Anh/Việt/Hoa...)", price: 2000000, desc: "Chuyển đổi ngôn ngữ mượt mà (Chưa bao gồm phí dịch)." },
            { id: "f_analytics", name: "Google Analytics / Pixel", price: 0, desc: "Cài đặt mã theo dõi hành vi người dùng." },
            { id: "f_admin_mobile", name: "Quản trị trên Mobile", price: 0, desc: "Giao diện admin tối ưu cho điện thoại." },
            { id: "f_amp", name: "Giao diện AMP", price: 2000000, desc: "Tăng tốc độ tải trang trên thiết bị di động (Google AMP)." },
            { id: "f_seo_schema", name: "Cấu trúc Schema SEO", price: 1000000, desc: "Tối ưu hiển thị Rich Snippets trên Google." }
        ]
    },
    {
        category: "Thương Mại Điện Tử & Bán Hàng",
        icon: "shopping-cart",
        id: "ecommerce",
        items: [
            { id: "f_cart", name: "Giỏ hàng & Thanh toán", price: 2000000, desc: "Quy trình đặt hàng, quản lý đơn hàng." },
            { id: "f_variant", name: "Biến thể sản phẩm", price: 1500000, desc: "Chọn màu sắc, kích thước, dung lượng cho 1 sản phẩm." },
            { id: "f_flashsale", name: "Flash Sale / Đếm ngược", price: 1000000, desc: "Tạo chiến dịch giảm giá có thời hạn." },
            { id: "f_coupon", name: "Mã giảm giá / Voucher", price: 1500000, desc: "Tạo mã giảm giá theo % hoặc số tiền cố định." },
            { id: "f_inventory", name: "Quản lý tồn kho cơ bản", price: 2000000, desc: "Trừ kho khi có đơn, báo hết hàng." },
            { id: "f_import_excel", name: "Nhập/Xuất sản phẩm Excel", price: 2000000, desc: "Thêm hàng loạt sản phẩm từ file Excel." },
            { id: "f_customer_login", name: "Đăng ký / Đăng nhập TV", price: 2000000, desc: "Khách hàng quản lý đơn hàng, thông tin cá nhân." },
            { id: "f_login_social", name: "Đăng nhập Google/Facebook", price: 1500000, desc: "Đăng nhập nhanh không cần nhớ mật khẩu." }
        ]
    },
    {
        category: "Thanh Toán & Vận Chuyển",
        icon: "credit-card",
        id: "payment_ship",
        items: [
            { id: "f_pay_momo", name: "Cổng thanh toán Momo", price: 4000000, desc: "Tích hợp API thanh toán qua ví Momo." },
            { id: "f_pay_vnpay", name: "Cổng thanh toán VNPAY", price: 4000000, desc: "Thanh toán qua thẻ ATM/Visa/QR Code." },
            { id: "f_pay_onepay", name: "Cổng thanh toán ONEPAY", price: 4000000, desc: "Thanh toán trực tuyến tổng giá trị đơn hàng thông qua cổng thanh toán ONEPAY." },
            { id: "f_pay_paypal", name: "Cổng thanh toán PayPal", price: 4000000, desc: "Thanh toán quốc tế." },
            { id: "f_ship_ghn", name: "API Giao Hàng Nhanh", price: 4000000, desc: "Tính phí ship tự động GHN." },
            { id: "f_ship_ghtk", name: "API Giao Hàng Tiết Kiệm", price: 4000000, desc: "Tính phí ship tự động GHTK." },
            { id: "f_ship_viettel", name: "API Viettel Post", price: 4000000, desc: "Tính phí ship tự động Viettel Post." },
             { id: "f_ship_goship", name: "API Goship", price: 4000000, desc: "Liên kết API với đơn vị Goship để tính phí vận chuyển." }
        ]
    },
    {
        category: "Du Lịch & Khách Sạn",
        icon: "plane",
        id: "tourism",
        items: [
            { id: "f_tour_filter", name: "Bộ lọc Tour nâng cao", price: 2000000, desc: "Lọc theo ngày đi, điểm đến, ngân sách." },
            { id: "f_booking_adv", name: "Đặt phòng/Đặt Tour", price: 2500000, desc: "Form đặt chuyên sâu: Số người, trẻ em, ngày check-in." },
            { id: "f_room_check", name: "Kiểm tra chỗ trống", price: 4000000, desc: "Check lịch trống theo thời gian thực." },
            { id: "f_price_date", name: "Giá thay đổi theo ngày", price: 4000000, desc: "Cấu hình giá khác nhau cho ngày thường/lễ tết." }
        ]
    },
    {
        category: "Xây Dựng & Phong Thủy",
        icon: "hammer",
        id: "construction",
        items: [
            { id: "f_project_filter", name: "Bộ lọc Dự án", price: 1500000, desc: "Lọc theo loại hình, năm thực hiện, quy mô." },
            { id: "f_calc_cost", name: "Dự toán chi phí xây dựng", price: 4000000, desc: "Nhập diện tích -> ra chi phí ước tính." },
            { id: "f_fengshui", name: "Xem hướng nhà / Tuổi", price: 2000000, desc: "Công cụ tra cứu phong thủy cơ bản." },
            { id: "f_color_pick", name: "Màu sắc phong thủy", price: 2000000, desc: "Gợi ý màu sơn theo mệnh gia chủ." },
            { id: "f_luoban", name: "Thước Lỗ Ban Online", price: 2000000, desc: "Công cụ thước lỗ ban tích hợp." }
        ]
    },
    {
        category: "Nội dung & Tin tức",
        icon: "file-text",
        id: "content",
        items: [
            { id: "f_rss", name: "Xuất bản tin RSS", price: 1000000, desc: "Cho phép các trang khác lấy tin tự động." },
            { id: "f_pdf_view", name: "Trình đọc PDF/Catalogue", price: 1500000, desc: "Xem tài liệu PDF trực tiếp trên web (Flipbook)." },
            { id: "f_voice_read", name: "Đọc bài viết (Text-to-Speech)", price: 2000000, desc: "Tự động đọc nội dung bài viết bằng giọng máy." }
        ]
    }
];

// Bảng giá gốc cho các phần tử TĨNH
const STATIC_PRICES = {
    'package_basic': 7500000,
    'package_multiple_interface': 10500000,
    'package_full': 13500000,
    'hosting_5gb': 4872000,
    'hosting_7gb': 6000000,
    'hosting_10gb': 7200000,
    'hosting_16gb': 10560000,
    'hosting_20gb_ca_nhan': 12000000,
    'hosting_25gb': 14400000,
    'hosting_30gb': 16080000,
    'hosting_40gb_dn': 20080000,
    'hosting_50gb_dn': 24000000,
    'hosting_70gb_dn': 32040000,
    'hosting_100gb_sieu_dn': 43200000,
    'hosting_200gb_sieu_dn': 72000000,
    'domain_com': 339000,
    'domain_vn': 759259,
    'domain_com_vn': 639815
};

let PRICES_BASE = { ...STATIC_PRICES };
FEATURES_DATA.forEach(cat => {
    cat.items.forEach(item => {
        PRICES_BASE[item.id] = item.price;
    });
});

// Biến lưu SĐT khách hàng (từ Gated Modal)
let CUSTOMER_PHONE = "";

// Hàm tính tiền tệ
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Math.round(amount));

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. GATED CONTENT & PHONE VALIDATION ===
    const gatedModal = document.getElementById('gated-modal');
    const mainContainer = document.getElementById('main-container');
    const bodyContent = document.getElementById('body-content');
    const leadPhoneInput = document.getElementById('lead-phone');
    const ACCESS_CODE = "xembaogia.fi";
    const SESSION_KEY = "baogia_access_granted";

    // Hàm mở khóa trang
    const unlockPage = () => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        if (gatedModal) gatedModal.style.display = 'none';
        if (mainContainer) mainContainer.classList.remove('blur-sm');
        if (bodyContent) bodyContent.classList.remove('overflow-hidden');
    };

    // Xử lý input SĐT: Cho phép nhập để kiểm tra mã, nhưng sẽ validate số khi submit
    if (leadPhoneInput) {
        leadPhoneInput.addEventListener('input', function(e) {
            const val = this.value.toLowerCase();
            
            // KIỂM TRA BACKDOOR: Nếu nhập đúng mã code vào ô SĐT -> Tự động mở khóa ngay
            if (val === ACCESS_CODE) {
                unlockPage();
                return;
            }
            // Không chặn nhập ký tự tại đây để người dùng có thể gõ mã chữ
        });
    }

    const checkAccess = () => {
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            unlockPage();
        } else {
            if (gatedModal) gatedModal.style.display = 'flex';
            if (mainContainer) mainContainer.classList.add('blur-sm');
        }
    };

    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = leadPhoneInput.value;
            
            // Validate SĐT chặt chẽ khi submit (chỉ chấp nhận số)
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$|^02([0-9]{9})$/; 
            // Regex đơn giản hơn để check độ dài và chỉ chứa số
            const isNumeric = /^\d+$/.test(phone);

            if (!isNumeric || phone.length < 10 || phone.length > 11) { 
                alert("Số điện thoại không hợp lệ (10-11 số)."); 
                return; 
            }
            
            // Lưu SĐT để dùng khi gửi báo giá cuối cùng
            CUSTOMER_PHONE = phone;

            // Gửi thông tin Lead (không chặn UI)
            const formData = new FormData();
            formData.append('phone', phone);
            formData.append('source', 'BaoGia_Gated_Entry');
            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: formData, headers: { 'Accept': 'application/json' } });

            // Chuyển bước sang nhập mã (mô phỏng gửi Zalo)
            document.getElementById('step-phone').classList.add('hidden');
            document.getElementById('step-code').classList.remove('hidden');
        });
    }

    const codeForm = document.getElementById('code-form');
    if (codeForm) {
        codeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('access-code').value.trim().toLowerCase();
            if (code === ACCESS_CODE) {
                unlockPage();
            } else {
                document.getElementById('code-error').classList.remove('hidden');
            }
        });
    }
    checkAccess();


    // === 2. RENDER FEATURES & SEARCH LOGIC ===
    const featuresContainer = document.getElementById('features-container');
    const searchInput = document.getElementById('feature-search');

    function renderFeatures() {
        if (!featuresContainer) return;
        featuresContainer.innerHTML = '';

        FEATURES_DATA.forEach((category) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-4 feature-group';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'accordion-header flex justify-between items-center p-4 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 transition';
            headerDiv.setAttribute('aria-expanded', 'false');
            headerDiv.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <i data-lucide="${category.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="flex flex-col">
                        <h3 class="font-bold text-gray-800 text-lg">${category.category}</h3>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">${category.items.length} tính năng</span>
                            <span class="selected-badge hidden text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">0 đã chọn</span>
                        </div>
                    </div>
                </div>
                <i data-lucide="chevron-down" class="accordion-icon w-5 h-5 text-gray-400 transition-transform duration-300"></i>
            `;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'accordion-content bg-white';
            
            const gridDiv = document.createElement('div');
            gridDiv.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4';

            category.items.forEach(item => {
                const itemLabel = document.createElement('label');
                itemLabel.className = 'feature-card group relative border border-gray-200 rounded-lg p-3 cursor-pointer flex items-start space-x-3 h-full';
                const priceDisplay = item.price > 0 ? `<span class="text-gray-900 font-bold">${formatCurrency(item.price)}</span>` : '<span class="text-green-600 font-bold">Miễn phí</span>';
                
                itemLabel.innerHTML = `
                    <input type="checkbox" name="addon-feature" id="${item.id}" value="${item.price}" class="feature-checkbox hidden">
                    <div class="flex-1">
                        <div class="flex justify-between items-start w-full">
                            <h4 class="font-semibold text-gray-700 text-sm group-hover:text-green-700 transition-colors pr-6">${item.name}</h4>
                            <div class="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors check-circle">
                                <i data-lucide="check" class="w-3 h-3 text-white check-icon"></i>
                            </div>
                        </div>
                        <div class="feature-info mt-2">
                            <div class="feature-price text-xs font-bold mb-1">${priceDisplay}</div>
                            <p class="feature-desc text-xs text-gray-500 leading-snug hidden group-hover:block">${item.desc}</p>
                        </div>
                    </div>
                `;
                gridDiv.appendChild(itemLabel);
            });

            contentDiv.appendChild(gridDiv);
            groupDiv.appendChild(headerDiv);
            groupDiv.appendChild(contentDiv);
            featuresContainer.appendChild(groupDiv);

            // Accordion Toggle
            headerDiv.addEventListener('click', () => {
                const isExpanded = headerDiv.getAttribute('aria-expanded') === 'true';
                headerDiv.setAttribute('aria-expanded', !isExpanded);
                contentDiv.classList.toggle('expanded', !isExpanded);
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderFeatures();

    // === FIX SEARCH LOGIC ===
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const groups = document.querySelectorAll('.feature-group');

            groups.forEach(group => {
                const cards = group.querySelectorAll('.feature-card');
                const header = group.querySelector('.accordion-header');
                const content = group.querySelector('.accordion-content');
                let groupHasMatch = false;

                cards.forEach(card => {
                    const name = card.querySelector('h4').textContent.toLowerCase();
                    if (name.includes(keyword)) {
                        card.style.display = 'flex';
                        card.classList.add('highlight-match');
                        groupHasMatch = true;
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('highlight-match');
                    }
                });

                if (keyword.length > 0) {
                    if (groupHasMatch) {
                        group.style.display = 'block';
                        // Tự động mở accordion nếu có kết quả
                        header.setAttribute('aria-expanded', 'true');
                        content.classList.add('expanded');
                    } else {
                        group.style.display = 'none';
                    }
                } else {
                    // Reset về trạng thái ban đầu
                    group.style.display = 'block';
                    header.setAttribute('aria-expanded', 'false');
                    content.classList.remove('expanded');
                    cards.forEach(c => {
                        c.style.display = 'flex';
                        c.classList.remove('highlight-match');
                    });
                }
            });
        });
    }


    // === 3. CALCULATION LOGIC ===
    let currentDiscountAmount = 0;
    let currentDiscountType = 'none';
    const VAT_RATE_8 = 0.08;
    const VAT_RATE_0 = 0.0;
    const calculateFinalPrice = (basePrice, vatRate) => basePrice * (1 + vatRate);
    const formatShortCurrency = (amount) => formatCurrency(amount).replace(" VNĐ", " đ");

    function updateHeaderCounts() {
        const groups = document.querySelectorAll('.feature-group');
        groups.forEach(group => {
            const count = group.querySelectorAll('input.feature-checkbox:checked').length;
            const badge = group.querySelector('.selected-badge');
            const header = group.querySelector('.accordion-header');
            if(badge && header) {
                if(count > 0) {
                    badge.textContent = `${count} đã chọn`;
                    badge.classList.remove('hidden');
                    header.classList.add('bg-green-50');
                } else {
                    badge.classList.add('hidden');
                    header.classList.remove('bg-green-50');
                }
            }
        });
    }

    const calculateTotal = () => {
        let packageBasePrice = 0, addonBasePrice = 0, hostingBasePrice = 0, domainBasePrice = 0;

        const selectedPackage = document.querySelector('input[name="package-option"]:checked');
        if (selectedPackage && PRICES_BASE[selectedPackage.id]) packageBasePrice = PRICES_BASE[selectedPackage.id];

        const selectedHosting = document.querySelector('input[name="hosting-option"]:checked');
        if (selectedHosting && PRICES_BASE[selectedHosting.id]) hostingBasePrice = PRICES_BASE[selectedHosting.id];

        const selectedDomain = document.querySelector('input[name="domain-option"]:checked');
        if (selectedDomain && PRICES_BASE[selectedDomain.id]) domainBasePrice = PRICES_BASE[selectedDomain.id];

        document.querySelectorAll('input.feature-checkbox:checked').forEach(cb => {
            if (PRICES_BASE[cb.id]) addonBasePrice += PRICES_BASE[cb.id];
        });

        let totalDesignBaseCost = packageBasePrice + addonBasePrice;
        let finalDiscountAmount = 0;
        if (currentDiscountType === 'percent') finalDiscountAmount = totalDesignBaseCost * (currentDiscountAmount / 100);
        else if (currentDiscountType === 'fixed') finalDiscountAmount = currentDiscountAmount;
        if (finalDiscountAmount > totalDesignBaseCost) finalDiscountAmount = totalDesignBaseCost;
        
        const totalDesignCostAfterDiscountBase = totalDesignBaseCost - finalDiscountAmount;

        const packageFinalCost = calculateFinalPrice(packageBasePrice, VAT_RATE_0);
        const addonFinalCost = calculateFinalPrice(addonBasePrice, VAT_RATE_0);
        const hostingFinalCost = calculateFinalPrice(hostingBasePrice, VAT_RATE_8);
        const domainFinalCost = calculateFinalPrice(domainBasePrice, VAT_RATE_8);
        
        const totalInfrastructureFinalCost = hostingFinalCost + domainFinalCost;
        const totalFinalCost = calculateFinalPrice(totalDesignCostAfterDiscountBase, VAT_RATE_0) + totalInfrastructureFinalCost;
        const infrastructureBaseCost = hostingBasePrice + domainBasePrice;
        const vatAmount = calculateFinalPrice(infrastructureBaseCost, VAT_RATE_8) - infrastructureBaseCost;

        // Update UI
        const updateText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        updateText('package-price-display', formatShortCurrency(packageFinalCost));
        updateText('addon-price-display', formatShortCurrency(addonFinalCost));
        updateText('discount-price-display', formatShortCurrency(-finalDiscountAmount));
        updateText('hosting-price-display', formatShortCurrency(hostingFinalCost));
        updateText('domain-price-display', formatShortCurrency(domainFinalCost));
        updateText('vat-display', formatShortCurrency(vatAmount));
        updateText('total-cost-display', formatShortCurrency(totalFinalCost));
        updateText('total-cost-display-minimal', formatShortCurrency(totalFinalCost));

        updateHeaderCounts();

        window.costData = { 
            totalDesignCost: calculateFinalPrice(totalDesignCostAfterDiscountBase, VAT_RATE_0), 
            totalInfrastructureCost: totalInfrastructureFinalCost, 
            hostingFinalCost, domainFinalCost, totalFinalCost, finalDiscountAmount,
            // Lưu thêm tên các gói đã chọn để gửi form
            packageName: selectedPackage ? selectedPackage.parentElement.querySelector('h3').textContent : '',
            hostingName: selectedHosting ? selectedHosting.parentElement.querySelector('p').textContent : '',
            domainName: selectedDomain ? selectedDomain.parentElement.querySelector('p').textContent : ''
        };
    };

    // Listeners
    featuresContainer.addEventListener('change', (e) => { if (e.target.classList.contains('feature-checkbox')) calculateTotal(); });
    document.querySelectorAll('input[name="package-option"], input[name="hosting-option"], input[name="domain-option"]').forEach(input => {
        input.addEventListener('change', calculateTotal);
        input.addEventListener('click', function(e) {
            if (this.getAttribute('data-checked') === 'true') {
                this.checked = false; this.setAttribute('data-checked', 'false'); calculateTotal();
            } else {
                document.querySelectorAll(`input[name="${this.name}"]`).forEach(i => i.setAttribute('data-checked', 'false'));
                this.setAttribute('data-checked', 'true'); calculateTotal();
            }
        });
    });

    // Toggle Footer
    const footerTrigger = document.getElementById('quote-summary-trigger');
    const footerPanel = document.getElementById('quote-details-panel');
    if (footerTrigger && footerPanel) {
        footerTrigger.addEventListener('click', () => { footerPanel.classList.toggle('expanded'); });
    }

    // === 4. FINAL SUBMISSION & CONFIRMATION ===
    const btnFinalize = document.getElementById('btn-finalize-quote');
    const modal = document.getElementById('alert-modal');
    const modalTitle = document.getElementById('alert-title');
    const modalMessage = document.getElementById('alert-message');
    const modalConfirmBtn = document.getElementById('alert-close-btn');

    if (btnFinalize) {
        btnFinalize.addEventListener('click', () => {
            if (!window.costData) { alert('Vui lòng chọn gói dịch vụ.'); return; }
            const data = window.costData;
            if (!document.querySelector('input[name="package-option"]:checked')) {
                 alert("Vui lòng chọn một Gói Thiết kế.");
                 return;
            }
            
            // CHIA 3 ĐỢT THANH TOÁN
            // Đợt 1: 50% (Web + Addon đã giảm giá)
            const phase1 = data.totalDesignCost / 2;
            // Đợt 2: 100% (Hosting + Domain đã VAT)
            const phase2 = data.totalInfrastructureCost;
            // Đợt 3: 50% (Web + Addon còn lại)
            const phase3 = data.totalDesignCost / 2;

            // Hiển thị Modal Xác nhận
            const modalHtml = `
                <div class="text-left space-y-4">
                    <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p class="text-xs text-gray-500 uppercase font-bold">Tổng chi phí dự kiến (Đã VAT)</p>
                        <p class="text-3xl font-extrabold text-gray-900">${formatCurrency(data.totalFinalCost)}</p>
                        ${data.finalDiscountAmount > 0 ? `<p class="text-sm text-green-600 mt-1 font-semibold">Đã tiết kiệm: ${formatCurrency(data.finalDiscountAmount)}</p>` : ''}
                    </div>
                    <div class="space-y-3 text-sm text-gray-700 border-t border-gray-200 pt-3">
                        <p class="font-bold text-indigo-600 uppercase text-xs">Lộ trình thanh toán:</p>
                        
                        <div class="flex justify-between items-center">
                            <span><b class="text-gray-900">Đợt 1:</b> Ký Hợp đồng (50% Web)</span>
                            <span class="font-bold text-gray-900">${formatCurrency(phase1)}</span>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <span><b class="text-gray-900">Đợt 2:</b> Hạ tầng (100% Host + Domain)</span>
                            <span class="font-bold text-gray-900">${formatCurrency(phase2)}</span>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <span><b class="text-gray-900">Đợt 3:</b> Bàn giao (50% Web còn lại)</span>
                            <span class="font-bold text-gray-900">${formatCurrency(phase3)}</span>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                        <p><b>Gói Web:</b> ${data.packageName}</p>
                        <p><b>Hosting:</b> ${data.hostingName || 'Chưa chọn'}</p>
                        <p><b>Domain:</b> ${data.domainName || 'Chưa chọn'}</p>
                    </div>
                    <p class="text-center text-gray-500 text-xs mt-2">Nhấn "Xác nhận & Gửi" để gửi yêu cầu báo giá chi tiết về hệ thống.</p>
                </div>
            `;
            
            modalTitle.textContent = "Xác nhận Yêu cầu";
            modalMessage.innerHTML = modalHtml;
            
            // Đổi text nút thành "Xác nhận & Gửi" và reset state
            modalConfirmBtn.textContent = "Xác nhận & Gửi";
            modalConfirmBtn.classList.remove('bg-gray-500');
            modalConfirmBtn.classList.add('bg-green-600');
            modalConfirmBtn.disabled = false;
            
            // Remove old listeners (trick: clone element)
            const newBtn = modalConfirmBtn.cloneNode(true);
            modalConfirmBtn.parentNode.replaceChild(newBtn, modalConfirmBtn);
            
            // Attach NEW listener for Silent Submission
            newBtn.addEventListener('click', () => {
                // 1. Disable button & Change text
                newBtn.disabled = true;
                newBtn.textContent = "Đang gửi...";
                
                // 2. Gather Data
                const formData = new FormData();
                formData.append('phone', CUSTOMER_PHONE || "Khách vãng lai");
                formData.append('total_cost', formatCurrency(data.totalFinalCost));
                formData.append('package', data.packageName);
                formData.append('hosting', data.hostingName);
                formData.append('domain', data.domainName);
                formData.append('payment_phase_1', formatCurrency(phase1));
                formData.append('payment_phase_2', formatCurrency(phase2));
                formData.append('payment_phase_3', formatCurrency(phase3));
                formData.append('details', 'Yêu cầu báo giá từ trang Báo Giá');

                // 3. Silent Fetch
                fetch("https://formspree.io/f/xldojlkn", {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => {
                    if (response.ok) {
                        // 4. Success State
                        modalTitle.textContent = "Gửi thành công!";
                        modalMessage.innerHTML = `<div class="text-center p-4"><i data-lucide="check-circle" class="w-16 h-16 text-green-500 mx-auto mb-2"></i><p class="text-gray-700">Cảm ơn bạn! Chúng tôi sẽ liên hệ số <b>${CUSTOMER_PHONE}</b> trong ít phút.</p></div>`;
                        lucide.createIcons();
                        newBtn.textContent = "Đóng";
                        newBtn.classList.replace('bg-green-600', 'bg-gray-600');
                        newBtn.disabled = false;
                        
                        // Close on next click
                        newBtn.onclick = () => { modal.classList.add('hidden'); };
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    newBtn.textContent = "Thử lại";
                    newBtn.disabled = false;
                    alert("Có lỗi khi gửi. Vui lòng kiểm tra kết nối mạng.");
                });
            });

            modal.classList.remove('hidden');
        });
    }

    calculateTotal();
});
