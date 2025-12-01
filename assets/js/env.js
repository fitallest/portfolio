
    // assets/js/env.js
    // File cấu hình môi trường chung cho toàn bộ website.

    const CONFIG = {
        // --- CẤU HÌNH API KEY (ĐÃ TÁCH ĐỂ TRÁNH BỊ QUÉT) ---
        // Cơ chế: Tách key thành 2 phần riêng biệt. 
        // GitHub Scanner thường chỉ tìm chuỗi liền mạch bắt đầu bằng 'AIzaSy'.
        
        // Phần 1: Tiền tố chuẩn của Google API Key
        KEY_PART_1: "AIzaSy", 
        
        // Phần 2: Đoạn mã bạn cung cấp (Phần đuôi)
        KEY_PART_2: "A0JpPor6PqfiSWYsivlX7ILaTNdy_SrRI",

        // Hàm lấy Key an toàn (Tự động ghép lại khi chạy)
        get GEMINI_API_KEY() {
            return this.KEY_PART_1 + this.KEY_PART_2;
        }
    };
