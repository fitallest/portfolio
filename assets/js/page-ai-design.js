

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
    const btnFullscreen = document.getElementById('btn-fullscreen'); 
    const btnExitFullscreen = document.getElementById('btn-exit-fullscreen'); // New exit button
    
    // Elements for Mockup
    const laptopWrapper = document.getElementById('laptop-wrapper');
    const laptopScreen = document.getElementById('laptop-screen'); 

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
    // IMPORTANT: Move iframe to laptop screen initially if elements exist
    if (laptopScreen && previewFrame) {
        laptopScreen.appendChild(previewFrame);
    }

    // --- 1. HANDLE COLOR SELECTION ---
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColorInput.value = btn.dataset.color;
        });
    });

    // --- 2. HANDLE SUGGESTION CHIPS ---
    chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToAdd = btn.getAttribute('data-add');
            const currentText = descriptionArea.value;

            if (btn.classList.contains('active')) {
                // Remove text
                btn.classList.remove('active');
                // Simple remove: replace text and trim cleanup
                if (currentText.includes(textToAdd)) {
                    descriptionArea.value = currentText.replace(textToAdd, '').replace(/\n\s*\n/g, '\n').trim();
                }
            } else {
                // Add text
                btn.classList.add('active');
                if (currentText.trim() === "") {
                    descriptionArea.value = textToAdd;
                } else if (!currentText.includes(textToAdd)) {
                    descriptionArea.value = currentText + "\n" + textToAdd;
                }
            }
        });
    });

    // --- 3. CONFIG DISCOUNT DISPLAY ---
    function applyAIConfig() {
        if (typeof AI_CONFIG === 'undefined') return;
        
        const discountDisplay = document.getElementById('discount-display');
        const discountBadge = document.getElementById('discount-badge');
        const originalPrice = document.getElementById('original-price');

        if (discountDisplay) {
            if (AI_CONFIG.discountType === 'percent') {
                discountDisplay.textContent = `Giảm ngay ${AI_CONFIG.discountValue}%`;
            } else {
                const val = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(AI_CONFIG.discountValue);
                discountDisplay.textContent = `Giảm ngay ${val}`;
            }
        }

        if (discountBadge && AI_CONFIG.discountLabel) {
            discountBadge.textContent = AI_CONFIG.discountLabel;
        }

        if (originalPrice) {
            if (AI_CONFIG.showOriginalPrice) {
                originalPrice.classList.remove('hidden');
            } else {
                originalPrice.classList.add('hidden');
            }
        }
    }
    applyAIConfig();

    // --- 4. MAIN GENERATE FUNCTION ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate Phone
        const phone = document.getElementById('contactPhone').value;
        if (!/^\d{10,11}$/.test(phone)) {
            alert("Bạn ơi doanh nghiệp không có thông tin làm sao khách hàng tìm được đây anh/chị ơi!!! (Vui lòng nhập SĐT đúng)");
            return;
        }
        const brand = document.getElementById('brandName').value;
        if (!brand.trim()) {
             alert("Bạn ơi doanh nghiệp không có thông tin làm sao khách hàng tìm được đây anh/chị ơi!!! (Thiếu tên thương hiệu)");
             return;
        }

        // UI Updates
        emptyState.classList.add('hidden');
        previewContainer.classList.add('hidden'); // Hide container while loading
        loadingState.classList.remove('hidden');
        conversionBar.classList.remove('visible');
        if(btnFullscreen) btnFullscreen.classList.add('hidden'); // Hide fullscreen btn while loading
        
        currentDesignId = generateDesignId();
        
        // Silent Submit Data
        currentPromptParams = {
            industry: document.getElementById('industry').value,
            style: document.getElementById('style').value,
            color: selectedColorInput.value,
            description: descriptionArea.value,
            brand: brand,
            phone: phone,
            email: document.getElementById('contactEmail').value,
            ref: document.getElementById('refWeb').value
        };
        
        // Gửi form ẩn (Silent)
        const fd = new FormData();
        for (const key in currentPromptParams) {
            fd.append(key, currentPromptParams[key]);
        }
        fd.append('source', 'AI_Design_Generator');
        fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: fd, headers: {'Accept': 'application/json'} });

        // Gemini API Call
        const prompt = `
            Đóng vai Senior Frontend Developer & UI/UX Designer. 
            Nhiệm vụ: Tạo mã nguồn HTML5 trọn vẹn cho một trang Landing Page (Single Page) theo phong cách Desktop chuyên nghiệp.

            THÔNG TIN DỰ ÁN:
            - Ngành nghề: ${currentPromptParams.industry}
            - Phong cách: ${currentPromptParams.style}
            - Màu chủ đạo: ${currentPromptParams.color} (Hãy tự chọn mã HEX đẹp, phối màu hài hòa)
            - Thương hiệu: ${currentPromptParams.brand}
            - SĐT: ${currentPromptParams.phone}
            - Email: ${currentPromptParams.email}
            - Yêu cầu chi tiết: ${currentPromptParams.description}
            
            YÊU CẦU KỸ THUẬT NGHIÊM NGẶT:
            1. OUTPUT: Chỉ trả về duy nhất mã code HTML. Không giải thích, không markdown (\`\`\`).
            2. THƯ VIỆN: Sử dụng TailwindCSS (CDN) để style. Sử dụng Font Awesome hoặc Lucide (CDN) cho icon.
            
            3. GIAO DIỆN DESKTOP (QUAN TRỌNG):
               - Thiết kế bố cục rộng (container max-w-screen-xl), thoáng đãng.
               - Header: Logo bên trái, Menu ở giữa/phải, Nút CTA nổi bật.
               - Hero Section: Banner lớn, Full-width, ảnh nền ấn tượng, Text to rõ.
               - Grid System: Sử dụng grid-cols-3 hoặc grid-cols-4 cho các phần Dịch vụ/Sản phẩm (Không xếp chồng dọc như mobile).
               - Footer: Đầy đủ 4 cột thông tin.

            4. HÌNH ẢNH (BẮT BUỘC ẢNH ONLINE):
               - TUYỆT ĐỐI KHÔNG sử dụng đường dẫn cục bộ (ví dụ: ./assets/img.jpg).
               - PHẢI DÙNG link ảnh online thực tế từ LoremFlickr hoặc Placehold.co.
               - Cấu trúc link ảnh: 'https://loremflickr.com/800/600/${currentPromptParams.industry.replace(/ /g, ',')},website/all' hoặc 'https://placehold.co/600x400/png?text=Image'.
               - Đảm bảo ảnh Hero Banner có kích thước lớn (ví dụ: 1920x1080).

            5. CẤU TRÚC NỘI DUNG:
               - Header (Logo ${currentPromptParams.brand})
               - Hero Section (Headline hấp dẫn)
               - About Us (Về chúng tôi)
               - Services/Products (Lưới 3-4 cột)
               - Testimonials (Đánh giá khách hàng)
               - CTA Section (Kêu gọi hành động)
               - Contact Form & Footer
        `;

        loadingText.textContent = "Đang phác thảo cấu trúc Desktop...";
        setTimeout(() => loadingText.textContent = "Đang tìm kiếm hình ảnh phù hợp...", 2000);
        setTimeout(() => loadingText.textContent = "Đang hoàn thiện giao diện...", 4500);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            let htmlCode = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (htmlCode) {
                // Cleanup
                htmlCode = htmlCode.replace(/```html|```/g, '').trim();
                currentGeneratedHTML = htmlCode; // Save for download

                // Inject to iframe
                const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                doc.open();
                doc.write(htmlCode);
                doc.close();

                // Show Result
                loadingState.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                // Ensure laptop wrapper is visible
                if(laptopWrapper) laptopWrapper.classList.remove('hidden');

                setTimeout(() => {
                     previewContainer.classList.add('visible'); // Fade in
                     conversionBar.classList.add('visible'); // Slide up bar
                     if(btnFullscreen) btnFullscreen.classList.remove('hidden'); // Show fullscreen btn
                     designIdDisplay.textContent = currentDesignId;
                     
                     if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 100, origin: { y: 0.8 } });
                     }
                }, 500);

            } else {
                throw new Error("No code generated");
            }

        } catch (error) {
            console.error(error);
            loadingState.classList.add('hidden');
            emptyState.classList.remove('hidden');
            alert("Hệ thống đang quá tải, vui lòng thử lại sau ít phút!");
        }
    });

    // --- 5. CONVERSION ACTIONS ---
    btnRealize.addEventListener('click', () => {
        // Zalo Link with pre-filled message
        const msg = encodeURIComponent(`Chào Fi.tallest, tôi muốn hiện thực hóa bản vẽ mã số ${currentDesignId}. Tôi đã có ý tưởng cụ thể.`);
        window.open(`https://zalo.me/0909876817?text=${msg}`, '_blank');
    });
    
    // --- FULLSCREEN LOGIC (Request on Container) ---
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!currentGeneratedHTML) {
                alert("Chưa có bản vẽ nào để xem!");
                return;
            }
            // Request Fullscreen on the laptop screen container (to show exit btn)
            if (laptopScreen.requestFullscreen) {
                laptopScreen.requestFullscreen();
            } else if (laptopScreen.webkitRequestFullscreen) { /* Safari */
                laptopScreen.webkitRequestFullscreen();
            } else if (laptopScreen.msRequestFullscreen) { /* IE11 */
                laptopScreen.msRequestFullscreen();
            }
        });
    }

    // --- EXIT FULLSCREEN LOGIC ---
    if (btnExitFullscreen) {
        btnExitFullscreen.addEventListener('click', () => {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        });
    }

    // Listen for fullscreen changes to toggle button visibility
    document.addEventListener('fullscreenchange', () => {
        // If we are in fullscreen mode AND the element is our laptop screen
        if (document.fullscreenElement === laptopScreen) {
            btnExitFullscreen.classList.remove('hidden');
        } else {
            btnExitFullscreen.classList.add('hidden');
        }
    });

    // --- 6. DOWNLOAD LOGIC ---
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            downloadModal.style.display = 'flex';
        });
    }
    
    if (closeDownloadModal) {
        closeDownloadModal.addEventListener('click', () => {
            downloadModal.style.display = 'none';
        });
    }
    
    // Close modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) downloadModal.style.display = 'none';
    });

    if (downloadForm) {
        downloadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentGeneratedHTML) {
                alert("Chưa có bản vẽ nào để tải!"); 
                return;
            }

            dlStatus.textContent = "Đang xử lý...";
            dlStatus.className = "text-center text-xs mt-3 h-4 text-indigo-600";

            // 1. Send Info to Formspree
            const fd = new FormData();
            fd.append('name', document.getElementById('dl-name').value);
            fd.append('phone', document.getElementById('dl-phone').value);
            fd.append('email', document.getElementById('dl-email').value);
            fd.append('design_id', currentDesignId);
            fd.append('action', 'DOWNLOAD_SOURCE_CODE');
            
            fetch("https://formspree.io/f/xldojlkn", { method: "POST", body: fd, headers: {'Accept': 'application/json'} })
            .then(r => {
                if(r.ok) {
                    dlStatus.textContent = "Thành công! Đang tải xuống...";
                    dlStatus.className = "text-center text-xs mt-3 h-4 text-green-600";
                    
                    // 2. Download File
                    const blob = new Blob([currentGeneratedHTML], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Ban_ve_${currentDesignId.replace('#','')}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    setTimeout(() => {
                        downloadModal.style.display = 'none';
                        dlStatus.textContent = "";
                        document.getElementById('dl-name').value = ""; // Reset form
                    }, 2000);
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .catch(() => {
                dlStatus.textContent = "Lỗi kết nối. Vui lòng thử lại.";
                dlStatus.className = "text-center text-xs mt-3 h-4 text-red-600";
            });
        });
    }

});
