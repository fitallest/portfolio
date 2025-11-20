


document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const form = document.getElementById('ai-design-form');
    const colorBtns = document.querySelectorAll('.color-btn');
    const chipBtns = document.querySelectorAll('.chip-btn');
    const descriptionArea = document.getElementById('description');
    const previewFrame = document.getElementById('preview-frame');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const previewContainer = document.getElementById('preview-container');
    const loadingText = document.getElementById('loading-text');
    const selectedColorInput = document.getElementById('selectedColor');
    const conversionBar = document.getElementById('conversion-bar');
    const designIdDisplay = document.getElementById('design-id-display');
    const btnRealize = document.getElementById('btn-realize');
    
    // Elements for Mockup Switching
    const laptopWrapper = document.getElementById('laptop-wrapper');
    const phoneWrapper = document.getElementById('phone-wrapper');
    const laptopScreen = laptopWrapper.querySelector('.bg-black > div'); // Div inside laptop screen
    const phoneScreen = phoneWrapper.querySelector('.bg-white'); // Div inside phone screen

    // Download Modal Elements
    const btnDownload = document.getElementById('btn-download');
    const downloadModal = document.getElementById('download-modal');
    const closeDownloadModal = document.getElementById('close-download-modal');
    const downloadForm = document.getElementById('download-form');
    const dlStatus = document.getElementById('dl-status');

    const GEMINI_API_KEY = "AIzaSyC0sOmXY9FsVM-LrX-1qndfeDn4-waeDTQ";
    let currentDesignId = "";
    let currentGeneratedHTML = ""; // Store generated code for download
    let currentPromptParams = {};  // Store params to send to owner

    function generateDesignId() { return `#AI-${Math.floor(Math.random() * 9000) + 1000}`; }

    // --- INITIAL SETUP ---
    // Default view: Desktop
    laptopScreen.appendChild(previewFrame);

    // --- UI HANDLERS ---
    colorBtns.forEach(btn => btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColorInput.value = btn.dataset.color;
    }));
    if(colorBtns.length > 0) colorBtns[0].click();

    // --- CHIP BUTTONS LOGIC (SMART SYNC) ---
    if (chipBtns.length > 0 && descriptionArea) {
        const updateButtonStates = () => {
            const currentText = descriptionArea.value;
            chipBtns.forEach(btn => {
                // Check if the dataset text is inside the textarea
                if (currentText.includes(btn.dataset.add)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        };

        chipBtns.forEach(btn => btn.addEventListener('click', () => {
            const textToAdd = btn.dataset.add;
            let currentText = descriptionArea.value;

            if (btn.classList.contains('active')) {
                // Remove text
                // Handle potential leading space
                currentText = currentText.replace(" " + textToAdd, ""); 
                currentText = currentText.replace(textToAdd, "");
                // Clean up double spaces just in case
                descriptionArea.value = currentText.replace(/\s\s+/g, ' ').trim();
            } else {
                // Add text
                if (currentText.length > 0 && !currentText.endsWith(' ')) {
                    descriptionArea.value += " " + textToAdd;
                } else {
                    descriptionArea.value += textToAdd;
                }
            }
            // Sync visual state immediately
            updateButtonStates();
        }));

        // Also sync when user types manually
        descriptionArea.addEventListener('input', updateButtonStates);
    }

    // --- MOCKUP SWITCHING LOGIC ---
    window.resizePreview = (mode) => {
        if (mode === 'mobile') {
            laptopWrapper.classList.add('hidden');
            phoneWrapper.classList.remove('hidden');
            phoneScreen.appendChild(previewFrame); // Move iframe to phone
        } else {
            phoneWrapper.classList.add('hidden');
            laptopWrapper.classList.remove('hidden');
            laptopScreen.appendChild(previewFrame); // Move iframe to laptop
        }
    };

    // --- GENERATION LOGIC ---
    let loadingInterval;
    const msgs = ["Đang phân tích yêu cầu...", "Đang phác thảo bố cục...", "Đang chọn bảng màu...", "Đang viết nội dung...", "Đang hoàn thiện CSS...", "Đang kiểm tra mobile..."];
    
    function startLoading() {
        emptyState.classList.add('hidden');
        previewContainer.classList.remove('visible');
        setTimeout(() => previewContainer.classList.add('hidden'), 300);
        loadingState.classList.remove('hidden');
        conversionBar.classList.remove('visible');
        let i = 0; loadingText.textContent = msgs[0];
        loadingInterval = setInterval(() => { i = (i + 1) % msgs.length; loadingText.textContent = msgs[i]; }, 2000);
    }

    function stopLoading() {
        clearInterval(loadingInterval);
        loadingState.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        setTimeout(() => previewContainer.classList.add('visible'), 100);
        setTimeout(triggerSuccess, 1500);
    }

    function triggerSuccess() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        currentDesignId = generateDesignId();
        designIdDisplay.textContent = currentDesignId;
        
        // Update Discount Info based on Config
        if (typeof AI_CONFIG !== 'undefined') {
            const discountDisplay = document.getElementById('discount-display');
            const originalPrice = document.getElementById('original-price');
            const badge = document.getElementById('discount-badge');

            badge.textContent = AI_CONFIG.discountLabel || "Ưu đãi";
            
            if (AI_CONFIG.showOriginalPrice) {
                originalPrice.classList.remove('hidden');
            } else {
                originalPrice.classList.add('hidden');
            }

            if (AI_CONFIG.discountType === 'percent') {
                 discountDisplay.textContent = `Giảm ngay ${AI_CONFIG.discountValue}%`;
            } else {
                 const val = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(AI_CONFIG.discountValue);
                 discountDisplay.textContent = `Giảm ngay ${val.replace('₫', '')}đ`;
            }
        }

        conversionBar.classList.add('visible');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const brand = document.getElementById('brandName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const industry = document.getElementById('industry').value || "Chung";
        const style = document.getElementById('style').value;
        const color = selectedColorInput.value;
        const refWeb = document.getElementById('refWeb').value;
        const desc = descriptionArea.value;
        const email = document.getElementById('contactEmail').value;

        if (!brand || !phone) return alert("Vui lòng nhập Tên thương hiệu & SĐT để AI tạo bản vẽ chính xác.");
        if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) return alert("Số điện thoại không hợp lệ.");

        // Store params for owner notification
        currentPromptParams = {
            brand, phone, industry, style, color, refWeb, desc, email
        };

        startLoading();
        const prompt = `Tạo mã HTML trọn vẹn cho Landing Page tỷ lệ chuyển đổi cao.
            Brand: ${brand}. Ngành: ${industry}. Style: ${style}. Màu: ${color}. SĐT: ${phone}.
            Yêu cầu: ${desc}. ${refWeb ? `Tham khảo: ${refWeb}` : ''}.
            Kỹ thuật: HTML5, Tailwind CSS (CDN), Font Inter, Ảnh placehold.co, Icon Lucide.
            Copywriting: Hấp dẫn, tiếng Việt, CTA mạnh mẽ. Trả về duy nhất mã HTML.`;

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await res.json();
            let html = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!html) throw new Error('No code');
            html = html.replace(/```html|```/g, '').trim();
            
            currentGeneratedHTML = html; // Save for download
            
            previewFrame.src = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
            stopLoading();
        } catch (err) {
            stopLoading(); alert("Hệ thống bận, vui lòng thử lại."); console.error(err);
        }
    });

    // --- DOWNLOAD & MODAL LOGIC ---
    if (btnDownload) {
        btnDownload.onclick = () => {
            downloadModal.style.display = 'block';
        };
    }
    if (closeDownloadModal) {
        closeDownloadModal.onclick = () => {
            downloadModal.style.display = 'none';
        };
    }
    window.onclick = (e) => {
        if (e.target == downloadModal) downloadModal.style.display = 'none';
    };

    if (downloadForm) {
        downloadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dlName = document.getElementById('dl-name').value;
            const dlPhone = document.getElementById('dl-phone').value;
            const dlEmail = document.getElementById('dl-email').value;

            dlStatus.textContent = "Đang xử lý...";
            dlStatus.className = "text-center text-xs mt-3 h-4 text-indigo-600";

            // 1. Download File to User
            const blob = new Blob([currentGeneratedHTML], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Thiet_Ke_Web_${currentDesignId.replace('#', '')}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 2. Send Info to Owner (Silent)
            const fd = new FormData();
            fd.append('Request', 'Tải xuống bản vẽ AI');
            fd.append('DesignID', currentDesignId);
            fd.append('Customer_Name', dlName);
            fd.append('Customer_Phone', dlPhone);
            fd.append('Customer_Email', dlEmail);
            // Design Specs so owner can recreate
            fd.append('Design_Specs', JSON.stringify(currentPromptParams));

            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: fd })
                .then(() => {
                    dlStatus.textContent = "Đã tải xuống thành công!";
                    dlStatus.className = "text-center text-xs mt-3 h-4 text-green-600";
                    setTimeout(() => {
                         downloadModal.style.display = 'none';
                         dlStatus.textContent = "";
                    }, 2000);
                })
                .catch(err => {
                    console.error(err);
                    dlStatus.textContent = "Đã tải file (Lỗi gửi mail thông báo).";
                });
        });
    }

    const openZalo = (msg) => window.open(`https://zalo.me/0909876817?text=${encodeURIComponent(msg)}`, '_blank');
    if(btnRealize) btnRealize.onclick = () => openZalo(`Tôi muốn hiện thực hóa bản vẽ ${currentDesignId} với ưu đãi giảm giá đặc biệt.`);
});
