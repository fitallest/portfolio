

/*
  JAVASCRIPT RIÊNG CHO TRANG BÁO GIÁ (page-baogia.js)
  Cập nhật: Gated Content (Auto-unlock backdoor), Validate SĐT, Search Fix, Silent Submit.
  UPDATE: Chia đợt thanh toán (3 đợt) trong Modal xác nhận.
  UPDATE V2: Bổ sung đầy đủ bảng giá Hosting (16GB -> 1TB).
  UPDATE V3: Logic Mã Giảm Giá chặt chẽ (Chỉ giảm trên Web + Addon, KHÔNG giảm Hosting/Domain).
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

// Bảng giá gốc
const STATIC_PRICES = {
    // Gói Thiết kế
    'package_basic': 7500000,
    'package_multiple_interface': 10500000,
    'package_full': 13500000,

    // Hosting (Cơ bản)
    'hosting_5gb': 5261760,
    'hosting_7gb': 6480000,
    'hosting_10gb': 7776000,
    'hosting_20gb_ca_nhan': 12960000,

    // Hosting (Mở rộng - Doanh nghiệp & Siêu DN)
    'hosting_16gb': 11404800,
    'hosting_25gb': 15552000,
    'hosting_30gb': 17366400,
    'hosting_40gb_dn': 21686400,
    'hosting_50gb_dn': 25920000,
    'hosting_70gb_dn': 34603200,
    'hosting_100gb_sieu_dn': 46656000,
    'hosting_200gb_sieu_dn': 77760000,
    'hosting_1tb_sieu_dn': 192000000,

    // Tên miền
    'domain_com': 366120,
    'domain_vn': 820000,
    'domain_com_vn': 691000
};

let PRICES_BASE = { ...STATIC_PRICES };
FEATURES_DATA.forEach(cat => {
    cat.items.forEach(item => {
        PRICES_BASE[item.id] = item.price;
    });
});

// Biến toàn cục
let CUSTOMER_PHONE = "";
let currentDiscountAmount = 0;
let currentDiscountType = 'none';
const VAT_RATE_8 = 0.08;
const VAT_RATE_0 = 0.0;

// Helper định dạng tiền
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Math.round(amount));
const formatShortCurrency = (amount) => formatCurrency(amount).replace(" VNĐ", " đ");

// Hàm tính giá cuối cùng
const calculateFinalPrice = (basePrice, vatRate) => basePrice * (1 + vatRate);

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. GATED CONTENT & PHONE VALIDATION ===
    const gatedModal = document.getElementById('gated-modal');
    const mainContainer = document.getElementById('main-container');
    const bodyContent = document.getElementById('body-content');
    const leadPhoneInput = document.getElementById('lead-phone');
    const ACCESS_CODE = "xembaogia.fi";
    const SESSION_KEY = "baogia_access_granted";

    const unlockPage = () => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        if (gatedModal) gatedModal.style.display = 'none';
        if (mainContainer) mainContainer.classList.remove('blur-sm');
        if (bodyContent) bodyContent.classList.remove('overflow-hidden');
    };

    if (leadPhoneInput) {
        leadPhoneInput.addEventListener('input', function(e) {
            const val = this.value.toLowerCase();
            if (val === ACCESS_CODE) {
                unlockPage();
                return;
            }
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
            const isNumeric = /^\d+$/.test(phone);
            if (!isNumeric || phone.length < 10 || phone.length > 11) { 
                alert("Số điện thoại không hợp lệ (10-11 số)."); 
                return; 
            }
            CUSTOMER_PHONE = phone;
            const formData = new FormData();
            formData.append('phone', phone);
            formData.append('source', 'BaoGia_Gated_Entry');
            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: formData, headers: { 'Accept': 'application/json' } });
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

            headerDiv.addEventListener('click', () => {
                const isExpanded = headerDiv.getAttribute('aria-expanded') === 'true';
                headerDiv.setAttribute('aria-expanded', !isExpanded);
                contentDiv.classList.toggle('expanded', !isExpanded);
            });
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderFeatures();

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
                        header.setAttribute('aria-expanded', 'true');
                        content.classList.add('expanded');
                    } else {
                        group.style.display = 'none';
                    }
                } else {
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
        let packageBasePrice = 0, addonBasePrice = 0, hostingDisplayPrice = 0, domainDisplayPrice = 0;

        const selectedPackage = document.querySelector('input[name="package-option"]:checked');
        if (selectedPackage && PRICES_BASE[selectedPackage.id]) packageBasePrice = PRICES_BASE[selectedPackage.id];

        const selectedHosting = document.querySelector('input[name="hosting-option"]:checked');
        if (selectedHosting && PRICES_BASE[selectedHosting.id]) hostingDisplayPrice = PRICES_BASE[selectedHosting.id];

        const selectedDomain = document.querySelector('input[name="domain-option"]:checked');
        if (selectedDomain && PRICES_BASE[selectedDomain.id]) domainDisplayPrice = PRICES_BASE[selectedDomain.id];

        document.querySelectorAll('input.feature-checkbox:checked').forEach(cb => {
            if (PRICES_BASE[cb.id]) addonBasePrice += PRICES_BASE[cb.id];
        });

        // === LOGIC QUAN TRỌNG: CHỈ GIẢM GIÁ TRÊN GÓI THIẾT KẾ + ADDON ===
        // 1. Tính tổng tiền của phần Thiết kế & Tính năng (Phần có thể giảm giá)
        let totalDesignAndAddonCost = packageBasePrice + addonBasePrice;
        
        let finalDiscountAmount = 0;
        
        // 2. Tính toán số tiền giảm
        if (currentDiscountType === 'percent') {
            // Nếu giảm theo %, chỉ nhân với phần Thiết kế
            finalDiscountAmount = totalDesignAndAddonCost * (currentDiscountAmount / 100);
        } else if (currentDiscountType === 'fixed') {
            // Nếu giảm tiền mặt cố định
            finalDiscountAmount = currentDiscountAmount;
        }
        
        // 3. Ràng buộc: Số tiền giảm không được vượt quá tổng tiền Thiết kế
        // Để đảm bảo không bao giờ trừ âm sang tiền Hosting/Domain
        if (finalDiscountAmount > totalDesignAndAddonCost) {
            finalDiscountAmount = totalDesignAndAddonCost;
        }
        
        const totalDesignCostAfterDiscount = totalDesignAndAddonCost - finalDiscountAmount;

        // Tính toán VAT & Hạ tầng
        const hostingBase = hostingDisplayPrice / 1.08;
        const domainBase = domainDisplayPrice / 1.08;
        const infrastructureBaseCost = hostingBase + domainBase;
        const vatAmount = (hostingDisplayPrice + domainDisplayPrice) - infrastructureBaseCost;

        const packageFinalCost = calculateFinalPrice(packageBasePrice, VAT_RATE_0);
        const addonFinalCost = calculateFinalPrice(addonBasePrice, VAT_RATE_0);
        
        // Tổng cộng = (Thiết kế sau giảm) + Hosting (đã VAT) + Domain (đã VAT)
        const totalFinalCost = calculateFinalPrice(totalDesignCostAfterDiscount, VAT_RATE_0) + hostingDisplayPrice + domainDisplayPrice;

        // Update UI
        const updateText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        updateText('package-price-display', formatShortCurrency(packageFinalCost));
        updateText('addon-price-display', formatShortCurrency(addonFinalCost));
        updateText('discount-price-display', formatShortCurrency(-finalDiscountAmount));
        updateText('hosting-price-display', formatShortCurrency(hostingDisplayPrice));
        updateText('domain-price-display', formatShortCurrency(domainDisplayPrice));
        updateText('vat-display', formatShortCurrency(vatAmount)); 
        updateText('total-cost-display', formatShortCurrency(totalFinalCost));
        updateText('total-cost-display-minimal', formatShortCurrency(totalFinalCost));

        updateHeaderCounts();

        window.costData = { 
            totalDesignCost: calculateFinalPrice(totalDesignCostAfterDiscount, VAT_RATE_0), 
            totalInfrastructureCost: hostingDisplayPrice + domainDisplayPrice, 
            hostingFinalCost: hostingDisplayPrice, 
            domainFinalCost: domainDisplayPrice, 
            totalFinalCost, 
            finalDiscountAmount,
            packageName: selectedPackage ? selectedPackage.parentElement.querySelector('h3').textContent : '',
            hostingName: selectedHosting ? selectedHosting.parentElement.querySelector('p').textContent : '',
            domainName: selectedDomain ? selectedDomain.parentElement.querySelector('p').textContent : ''
        };
    };

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

    document.getElementById('toggle-extra-packages-btn')?.addEventListener('click', function() {
        const container = document.getElementById('extra-hosting-packages');
        container.classList.toggle('expanded');
        
        if (container.classList.contains('expanded')) {
            this.innerHTML = `Thu gọn <i data-lucide="chevron-up" class="w-4 h-4 ml-2"></i>`;
        } else {
            this.innerHTML = `Xem thêm các gói Hosting khác <i data-lucide="chevron-down" class="w-4 h-4 ml-2"></i>`;
        }
        lucide.createIcons();
    });

    // APPLY DISCOUNT
    document.getElementById('apply-discount-btn')?.addEventListener('click', () => {
        const code = document.getElementById('discount-code-input').value.trim().toUpperCase();
        const status = document.getElementById('discount-status');
        status.textContent = ''; currentDiscountAmount = 0; currentDiscountType = 'none';
        
        if (!code) return;
        
        // Thông báo trạng thái cập nhật: Ghi chú rõ ràng phạm vi áp dụng
        const successMsgSuffix = " (Web + Addon)";

        if (code.startsWith('FI') && code.endsWith('PT')) {
            const val = parseFloat(code.slice(2, -2));
            if (!isNaN(val) && val > 0) { 
                currentDiscountAmount = val; 
                currentDiscountType = 'percent'; 
                status.textContent = `Đã áp dụng giảm ${val}%${successMsgSuffix}`; 
                status.className = "text-xs text-green-600 h-4 -mt-2 pl-1 font-medium"; 
            }
            else { status.textContent = "Mã không hợp lệ"; status.className = "text-xs text-red-500 h-4 -mt-2 pl-1 font-medium"; }
        } else if (code.startsWith('FI') && code.endsWith('TR')) {
            let valStr = code.slice(2, -2); let amount = 0;
            if (valStr.includes('TR')) { const p = valStr.split('TR'); amount = (parseFloat(p[0]) + (parseFloat(p[1]||0)/10)) * 1000000; }
            else { amount = parseFloat(valStr) * 1000000; }
            if (!isNaN(amount) && amount > 0) { 
                currentDiscountAmount = amount; 
                currentDiscountType = 'fixed'; 
                status.textContent = `Đã áp dụng giảm ${formatShortCurrency(amount)}${successMsgSuffix}`; 
                status.className = "text-xs text-green-600 h-4 -mt-2 pl-1 font-medium"; 
            }
            else { status.textContent = "Mã không hợp lệ"; status.className = "text-xs text-red-500 h-4 -mt-2 pl-1 font-medium"; }
        } else {
            status.textContent = "Mã không tìm thấy"; status.className = "text-xs text-red-500 h-4 -mt-2 pl-1 font-medium";
        }
        calculateTotal();
    });

    document.getElementById('quote-summary-trigger')?.addEventListener('click', () => {
        document.getElementById('quote-details-panel').classList.toggle('expanded');
        const iconContainer = document.getElementById('quote-toggle-icon');
        if (document.getElementById('quote-details-panel').classList.contains('expanded')) {
             iconContainer.innerHTML = '<i data-lucide="chevron-down" class="w-5 h-5 text-gray-600"></i>';
        } else {
             iconContainer.innerHTML = '<i data-lucide="chevron-up" class="w-5 h-5 text-gray-600"></i>';
        }
        lucide.createIcons();
    });

    window.finalizeQuote = () => {
        if (!window.costData || !document.querySelector('input[name="package-option"]:checked')) {
            alert("Vui lòng chọn Gói Thiết kế để tiếp tục."); return;
        }
        const data = window.costData;
        // Logic thanh toán:
        // Đợt 1: 50% Gói Web (sau khi trừ giảm giá)
        // Đợt 2: 100% Hạ tầng
        // Đợt 3: 50% Gói Web còn lại
        
        const webCost = data.totalDesignCost;
        const infraCost = data.totalInfrastructureCost;
        
        const p1 = webCost / 2;
        const p2 = infraCost;
        const p3 = webCost / 2;

        const modalHtml = `
            <div class="text-left space-y-5">
                <div class="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                    <p class="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1">Tổng chi phí ước tính (Đã VAT)</p>
                    <p class="text-3xl font-extrabold text-indigo-900">${formatCurrency(data.totalFinalCost)}</p>
                    ${data.finalDiscountAmount > 0 ? `<p class="text-sm text-green-600 mt-1 font-semibold flex items-center"><i data-lucide="check" class="w-3 h-3 mr-1"></i> Đã tiết kiệm: ${formatCurrency(data.finalDiscountAmount)}</p>` : ''}
                </div>
                
                <div class="space-y-3 text-sm text-gray-700 border-t border-gray-100 pt-4">
                    <p class="font-bold text-gray-900 uppercase text-xs tracking-wide mb-2">Lộ trình thanh toán đề xuất:</p>
                    
                    <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span><span class="inline-block w-16 font-bold text-gray-500">Đợt 1:</span> Ký Hợp đồng (50% Web)</span>
                        <span class="font-bold text-gray-900">${formatCurrency(p1)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span><span class="inline-block w-16 font-bold text-gray-500">Đợt 2:</span> Hạ tầng (Host + Domain)</span>
                        <span class="font-bold text-gray-900">${formatCurrency(p2)}</span>
                    </div>
                    
                    <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span><span class="inline-block w-16 font-bold text-gray-500">Đợt 3:</span> Bàn giao (50% Web còn lại)</span>
                        <span class="font-bold text-gray-900">${formatCurrency(p3)}</span>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-100 space-y-1">
                    <p><b>Gói Web:</b> ${data.packageName}</p>
                    <p><b>Hosting:</b> ${data.hostingName || 'Chưa chọn'}</p>
                    <p><b>Domain:</b> ${data.domainName || 'Chưa chọn'}</p>
                </div>
                
                <p class="text-center text-gray-400 text-xs mt-2">Nhấn "Xác nhận & Gửi" để gửi yêu cầu chi tiết đến bộ phận kinh doanh.</p>
            </div>
        `;
        
        const modal = document.getElementById('alert-modal');
        document.getElementById('alert-title').innerHTML = `<i data-lucide="file-check" class="w-6 h-6 mr-2 text-indigo-600"></i> Xác nhận Yêu cầu`;
        document.getElementById('alert-message').innerHTML = modalHtml;
        lucide.createIcons();

        const btn = document.getElementById('alert-close-btn');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.textContent = "ĐÃ HIỂU"; 
        newBtn.className = "w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3.5 px-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition";
        
        newBtn.addEventListener('click', () => {
            newBtn.textContent = "Đang xử lý..."; newBtn.disabled = true;
            const fd = new FormData();
            fd.append('phone', CUSTOMER_PHONE || "Khách vãng lai");
            fd.append('total', formatCurrency(data.totalFinalCost));
            fd.append('package', data.packageName);
            fd.append('hosting', data.hostingName);
            fd.append('domain', data.domainName);
            fd.append('payment_phase_1', formatCurrency(p1));
            fd.append('payment_phase_2', formatCurrency(p2));
            fd.append('payment_phase_3', formatCurrency(p3));
            fd.append('details', 'Yêu cầu báo giá từ trang Báo Giá (Phiên bản mới)');
            
            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: fd, headers: { 'Accept': 'application/json' } })
            .then(r => {
                if(r.ok) {
                    document.getElementById('alert-title').textContent = "Gửi thành công!";
                    document.getElementById('alert-message').innerHTML = `
                        <div class="text-center p-6">
                            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <i data-lucide="check" class="w-10 h-10 text-green-600"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h3>
                            <p class="text-gray-600">Yêu cầu báo giá đã được gửi đi.</p>
                            <p class="text-gray-600 mt-2">Chúng tôi sẽ liên hệ số <b>${CUSTOMER_PHONE}</b> trong ít phút.</p>
                        </div>`;
                    lucide.createIcons();
                    newBtn.textContent = "Đóng"; 
                    newBtn.className = "w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 transition";
                    newBtn.disabled = false;
                    newBtn.onclick = () => modal.classList.add('hidden');
                } else throw new Error();
            })
            .catch(() => { alert("Lỗi gửi form. Vui lòng kiểm tra kết nối."); newBtn.textContent = "Thử lại"; newBtn.disabled = false; });
        });
        modal.classList.remove('hidden');
    };

    document.getElementById('btn-finalize-quote')?.addEventListener('click', window.finalizeQuote);

    calculateTotal();
});
