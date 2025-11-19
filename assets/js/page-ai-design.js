
/*
  LOGIC TRANG AI DESIGN
  - Xử lý form, validate SĐT.
  - Gửi thông tin ngầm (Silent Submit).
  - Gọi Gemini API để sinh code HTML.
  - Render kết quả vào iframe.
*/

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

    // API Key Gemini (Dùng chung key của bạn)
    const GEMINI_API_KEY = "AIzaSyC0sOmXY9FsVM-LrX-1qndfeDn4-waeDTQ";

    // 1. Xử lý chọn màu
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColorInput.value = btn.dataset.color;
        });
    });
    // Mặc định chọn màu đầu tiên
    if(colorBtns.length > 0) colorBtns[0].click();

    // 2. Xử lý Chips gợi ý
    chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const textToAdd = " " + btn.dataset.add;
            
            if (btn.classList.contains('active')) {
                descriptionArea.value += textToAdd;
            } else {
                // Logic xóa hơi phức tạp nếu user đã sửa text, 
                // nên đơn giản là chỉ thêm vào, user tự xóa nếu muốn.
                // Ở đây ta chỉ toggle class visual thôi.
            }
        });
    });

    // 3. Hàm thay đổi text loading cho sinh động
    const loadingMessages = [
        "Đang phân tích yêu cầu ngành nghề...",
        "Đang phác thảo bố cục wireframe...",
        "Đang chọn bảng màu và font chữ...",
        "Đang viết nội dung demo hấp dẫn...",
        "Đang hoàn thiện CSS Tailwind...",
        "Đang kiểm tra tính tương thích mobile..."
    ];
    let msgIndex = 0;
    let loadingInterval;

    function startLoadingEffect() {
        emptyState.classList.add('hidden');
        previewContainer.classList.add('hidden');
        loadingState.classList.remove('hidden');
        
        msgIndex = 0;
        loadingText.textContent = loadingMessages[0];
        loadingInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            loadingText.textContent = loadingMessages[msgIndex];
        }, 2500);
    }

    function stopLoadingEffect() {
        clearInterval(loadingInterval);
        loadingState.classList.add('hidden');
        previewContainer.classList.remove('hidden');
    }

    // 4. Xử lý Submit Form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- VALIDATION ---
        const brandName = document.getElementById('brandName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const hours = document.getElementById('contactHours').value.trim();

        // Validate SĐT VN: 10-11 số
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        
        if (!brandName || !phone) {
            alert("Bạn ơi doanh nghiệp không có thông tin làm sao khách hàng tìm được đây anh/chị ơi!!! \n(Vui lòng nhập Tên thương hiệu & SĐT)");
            return;
        }
        
        if (!phoneRegex.test(phone)) {
            alert("Số điện thoại nhìn lạ quá! Vui lòng nhập đúng số điện thoại Việt Nam nhé.");
            return;
        }

        // --- SILENT SUBMIT (Gửi ngầm) ---
        const formData = new FormData();
        formData.append('Brand', brandName);
        formData.append('Phone', phone);
        formData.append('Email', email);
        formData.append('Hours', hours);
        formData.append('Industry', document.getElementById('industry').value);
        formData.append('Style', document.getElementById('style').value);
        formData.append('Request', "AI Design Tool Lead");
        
        // Gửi không chờ đợi (fire and forget)
        fetch("https://formspree.io/f/xldojlkn", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).catch(err => console.log("Silent submit error (ignored):", err));


        // --- BẮT ĐẦU QUY TRÌNH AI ---
        startLoadingEffect();

        // Thu thập dữ liệu cho Prompt
        const industry = document.getElementById('industry').value || "Chung";
        const style = document.getElementById('style').value;
        const color = selectedColorInput.value;
        const refWeb = document.getElementById('refWeb').value;
        const description = descriptionArea.value;

        const prompt = `
            Đóng vai một chuyên gia UI/UX Designer và Frontend Developer.
            Nhiệm vụ: Tạo mã nguồn HTML đầy đủ cho một Landing Page hiện đại, sử dụng thư viện Tailwind CSS (qua CDN).
            
            Thông tin dự án:
            - Tên thương hiệu: ${brandName}
            - Ngành nghề: ${industry}
            - Phong cách: ${style}
            - Màu chủ đạo: ${color}
            - Thông tin liên hệ cần chèn vào header/footer: SĐT: ${phone}, Email: ${email || 'email@example.com'}
            - Mô tả yêu cầu: ${description}
            ${refWeb ? `- Website tham khảo phong cách: ${refWeb}` : ''}

            Yêu cầu kỹ thuật BẮT BUỘC:
            1. Chỉ trả về mã HTML duy nhất. Không có markdown (\`\`\`), không giải thích.
            2. Sử dụng Tailwind CSS qua CDN: <script src="https://cdn.tailwindcss.com"></script>
            3. Font chữ: Sử dụng font 'Inter' hoặc font phù hợp phong cách từ Google Fonts.
            4. Hình ảnh: Sử dụng ảnh placeholder từ https://placehold.co/ (ví dụ: https://placehold.co/600x400).
            5. Icon: Sử dụng Lucide Icons (như trang hiện tại) hoặc SVG trực tiếp.
            6. Bố cục: Header (Logo, Menu, SĐT), Hero Section (Ảnh lớn, Tiêu đề hấp dẫn), Services/Features, About, Contact Form/Footer.
            7. Responsive: Giao diện phải đẹp trên Mobile.
            
            Hãy sáng tạo nội dung (text) phù hợp với ngành nghề ${industry}, đừng dùng Lorem Ipsum.
        `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) throw new Error('Gemini API Error');

            const data = await response.json();
            let htmlCode = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!htmlCode) throw new Error('No code generated');

            // Làm sạch code (nếu AI lỡ thêm markdown)
            htmlCode = htmlCode.replace(/```html/g, '').replace(/```/g, '').trim();

            // Render vào iframe
            const blob = new Blob([htmlCode], { type: 'text/html' });
            previewFrame.src = URL.createObjectURL(blob);
            
            stopLoadingEffect();

        } catch (error) {
            console.error(error);
            stopLoadingEffect();
            alert("Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại sau ít phút!");
        }
    });

    // Hàm resize preview toàn cục
    window.resizePreview = (width) => {
        const frame = document.getElementById('preview-frame');
        frame.style.maxWidth = width;
        if (width === '100%') {
            frame.style.borderLeft = 'none';
            frame.style.borderRight = 'none';
        } else {
            frame.style.borderLeft = '1px solid #e5e7eb';
            frame.style.borderRight = '1px solid #e5e7eb';
            frame.style.margin = '0 auto';
        }
    };
});
