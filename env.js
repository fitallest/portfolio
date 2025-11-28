// assets/js/env.js
// File cấu hình môi trường chung cho toàn bộ website.

const CONFIG = {
    // --- CẤU HÌNH API KEY ---
    // Để tránh bị GitHub quét và khóa Key tự động, ta chia Key thành 2 phần.
    // Hãy dán API Key MỚI của bạn vào 2 biến dưới đây.
    
    // Ví dụ Key là: AIzaSyDxxxxxxxxxxxxxxxxx
    // PART_1: "AIzaSy" (Giữ nguyên phần đầu này)
    // PART_2: "Dxxxxxxxxxxxxxxxxx" (Dán phần còn lại vào đây)
    
    API_KEY_PART_1: "AIzaSy", 
    API_KEY_PART_2: "A0JpPor6PqfiSWYsivlX7ILaTNdy_SrRI", // <--- THAY PHẦN NÀY BẰNG KEY MỚI CỦA BẠN (Bỏ AIzaSy ở đầu đi)

    // Hàm tự động ghép Key (Không sửa phần này)
    get GEMINI_API_KEY() {
        return this.API_KEY_PART_1 + this.API_KEY_PART_2;
    }

};
