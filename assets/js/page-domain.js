
/*
  JAVASCRIPT RIÊNG CHO TRANG DOMAIN (page-domain.js)
  Đã tách từ thẻ <script> inline của domain.html gốc.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt icon Lucide
    lucide.createIcons(); 

    // LẤY API KEY TỪ ENV.JS
    const GEMINI_API_KEY = (typeof CONFIG !== 'undefined') ? CONFIG.GEMINI_API_KEY : "";

    // === SCRIPT GỢI Ý TÊN MIỀN ===
    const domainInput = document.getElementById('domainInput');
    const industryInput = document.getElementById('industryInput'); 
    const searchDomainButton = document.getElementById('searchDomainButton');
    const suggestionResultsArea = document.getElementById('suggestionResultsArea');
    const col1ResultsDiv = document.getElementById('column1Results').querySelector('.suggestion-list');
    const col2TabsDiv = document.getElementById('suggestionTabs');
    const col2ContentDiv = document.getElementById('suggestionTabContent');
    const modalMessageTextarea = document.getElementById('modal_message'); 

    // Hàm xóa dấu tiếng Việt
    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    // Hàm xử lý từ khóa: xóa dấu, thay khoảng trắng/ký tự đặc biệt bằng '-', xóa dấu '-' thừa
    function processKeyword(input) {
        if (!input) return '';
        let processed = removeAccents(input.trim().toLowerCase());
        processed = processed.replace(/[^a-z0-9\-]+/g, '-'); 
        processed = processed.replace(/-+/g, '-');
        processed = processed.replace(/^-+|-+$/g, '');
        return processed;
    }
    
    function processKeywordForCombine(input) {
        if (!input) return '';
        let processed = removeAccents(input.trim().toLowerCase());
        processed = processed.replace(/[^a-z0-9]+/g, ''); 
        return processed;
    }

    // Danh sách đuôi tên miền phổ biến
    const commonTLDs = ['.com', '.vn', '.net', '.com.vn', '.info', '.org', '.store', '.online', '.shop', '.xyz', '.site'];
    const vnTLDs = ['.vn', '.com.vn', '.net.vn', '.info.vn', '.edu.vn', '.gov.vn'];

    const industryKeywords = {
        'nhua': ['plastic', 'poly', 'plas'],
        'thoi trang': ['fashion', 'style', 'boutique', 'shop', 'store', 'mode'],
        'du lich': ['travel', 'tour', 'booking', 'trip', 'holiday'],
        'xay dung': ['construction', 'build', 'decor', 'home', 'solution', 'group', 'cons'],
        'giao duc': ['edu', 'school', 'academy', 'learn', 'study'],
        'bat dong san': ['real', 'land', 'property', 'bds', 'homes', 'realty'],
        'noi that': ['interior', 'decor', 'furniture', 'design'],
        'thuc pham': ['food', 'kitchen', 'mart', 'deli'],
        'my pham': ['beauty', 'cosmetic', 'spa', 'skin'],
        'cong nghe': ['tech', 'solution', 'soft', 'data', 'it'],
        'van tai': ['logistics', 'trans', 'ship', 'cargo']
    };

    // Hàm thuật toán cũ (Fallback)
    function generateSmartSuggestions(keyword, industry) {
        const suggestions = new Set(); 
        const keywordProcessedHyphen = processKeyword(keyword);
        const keywordProcessedCombine = processKeywordForCombine(keyword);
        const industryProcessedHyphen = processKeyword(industry);
        const industryProcessedCombine = processKeywordForCombine(industry);

        if (industryProcessedCombine) {
            const industryENKeywords = industryKeywords[industryProcessedHyphen] || [industryProcessedCombine]; 
            industryENKeywords.forEach(indKey => {
                commonTLDs.forEach(tld => {
                    suggestions.add(keywordProcessedCombine + indKey + tld); 
                });
                 if (keywordProcessedHyphen && indKey) {
                    commonTLDs.slice(0, 4).forEach(tld => {
                        suggestions.add(keywordProcessedHyphen + '-' + indKey + tld);
                    });
                 }
            });
        }

         const commonSuffixes = ['vn', 'sg', 'hcm', 'hanoi', 'group', 'global', 'tech', 'solution', 'shop', 'store', 'pro', 'plus'];
         commonSuffixes.forEach(suffix => {
             commonTLDs.forEach(tld => suggestions.add(keywordProcessedCombine + suffix + tld));
         });
         const commonPrefixes = ['the', 'my', 'best', 'top', 'go', 'get'];
         commonPrefixes.forEach(prefix => {
             commonTLDs.forEach(tld => suggestions.add(prefix + keywordProcessedCombine + tld));
         });
        
         ['group', 'global', 'tech', 'solution'].forEach(suffix => {
            if(keywordProcessedHyphen){
                commonTLDs.slice(0, 2).forEach(tld => suggestions.add(keywordProcessedHyphen + '-' + suffix + tld));
            }
         });

        const validSuggestions = Array.from(suggestions).filter(domain => {
            if (domain.includes('--')) return false; 
            const parts = domain.split('.');
            return parts.length >= 2 && parts[0] !== '' && parts[parts.length -1] !== ''; 
        });
        return validSuggestions.slice(0, 50);
    }

    // --- HÀM GỌI AI GEMINI ---
    async function fetchGeminiSuggestions(keyword, industry) {
        if (!GEMINI_API_KEY) {
            console.warn('Missing API Key');
            return null; 
        }

        const prompt = `
        Đóng vai một chuyên gia thương hiệu và đặt tên miền (Naming Expert).
        Tôi đang cần tìm tên miền cho từ khóa: "${keyword}" hoạt động trong lĩnh vực: "${industry || 'Tổng hợp'}".
        Hãy gợi ý 15 tên miền sáng tạo, ngắn gọn, dễ nhớ, ưu tiên đuôi .vn, .com.vn, .com, .net.
        Tên miền có thể dùng tiếng Anh hoặc tiếng Việt không dấu, có thể ghép từ, chơi chữ.
        
        Yêu cầu quan trọng:
        1. Chỉ trả về một mảng JSON chứa các chuỗi tên miền (ví dụ: ["tenmien1.com", "tenmien2.vn"]).
        2. Không thêm bất kỳ văn bản, giải thích hay định dạng markdown nào khác (không dùng \`\`\`json).
        3. Đảm bảo tên miền hợp lệ (không chứa ký tự đặc biệt ngoài dấu gạch ngang và dấu chấm).
        `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) throw new Error('Lỗi API Gemini');

            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) throw new Error('Phản hồi rỗng');

            // Làm sạch chuỗi JSON
            text = text.replace(/```json|```/g, '').trim();
            const aiSuggestions = JSON.parse(text);
            
            if (Array.isArray(aiSuggestions)) {
                return aiSuggestions;
            } else {
                throw new Error('Định dạng không phải mảng');
            }

        } catch (error) {
            console.warn('AI Error, falling back to algorithm:', error);
            return null; // Trả về null để kích hoạt fallback
        }
    }

    // Hàm hiển thị kết quả (Cập nhật để nhận dữ liệu AI)
    function displayResults(keyword, industry, userTLD, aiResults = null) {
        // --- Xử lý Cột 1: Kết quả trực tiếp (Luôn chạy ngay) ---
        if (!aiResults) { // Chỉ chạy lần đầu, không chạy lại khi AI trả về để tránh flash
            col1ResultsDiv.innerHTML = ''; 
            let col1Domains = new Set(); 
            if (userTLD) {
                 const userDomain = keyword + userTLD;
                 if (!userDomain.includes('--')) col1Domains.add(userDomain);
            }
            commonTLDs.forEach(tld => {
                const domain = keyword + tld;
                if (!domain.endsWith(tld + tld) && !domain.includes('--')) col1Domains.add(domain);
            });
            
            if (col1Domains.size > 0) {
                 col1Domains.forEach(domain => {
                     const div = document.createElement('div');
                     div.className = 'suggestion-item';
                     div.innerHTML = `<span class="domain-name">${domain}</span><button data-domain="${domain}" class="register-suggestion-btn open-register-modal">Đăng ký</button>`;
                     col1ResultsDiv.appendChild(div);
                 });
             } else {
                 col1ResultsDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Không có kết quả trực tiếp hợp lệ.</p>';
             }
             
             // Hiển thị Loading bên cột 2
             col2ContentDiv.innerHTML = `
                <div class="ai-loading-container">
                    <div class="ai-dots"><div></div><div></div><div></div></div>
                    <p class="text-sm text-indigo-600 font-medium">AI đang phân tích và tìm ý tưởng...</p>
                </div>
             `;
             col2TabsDiv.innerHTML = ''; // Xóa tab cũ
             return; // Dừng ở đây, đợi AI
        }

        // --- Xử lý Cột 2: Kết quả AI hoặc Fallback ---
        col2TabsDiv.innerHTML = ''; 
        col2ContentDiv.innerHTML = ''; 

        // Nếu AI trả về null, dùng thuật toán cũ
        const suggestionsSource = aiResults || generateSmartSuggestions(keyword, industry);
        
        const suggestionsByTLD = {};
        const existingCol1Domains = Array.from(col1ResultsDiv.querySelectorAll('.domain-name')).map(span => span.textContent);

        suggestionsSource.forEach(domain => {
            if(existingCol1Domains.includes(domain)) return;
            let tldGroup = 'Gợi ý'; // Gom chung nếu là AI
            
            // Nếu là thuật toán cũ thì chia tab, nếu là AI thì ưu tiên hiển thị dạng danh sách đẹp
            if (!aiResults) {
                const sortedTLDs = [...commonTLDs, ...vnTLDs].sort((a, b) => b.length - a.length); 
                for (const tld of sortedTLDs) { 
                    if (domain.endsWith(tld)) {
                        tldGroup = tld.toUpperCase();
                        break;
                    }
                }
            } else {
                tldGroup = 'AI Đề Xuất';
            }

            if (!suggestionsByTLD[tldGroup]) suggestionsByTLD[tldGroup] = [];
            if (!suggestionsByTLD[tldGroup].includes(domain)) {
                suggestionsByTLD[tldGroup].push(domain);
            }
        });

         // Hiển thị Tabs và Content
         const groupKeys = Object.keys(suggestionsByTLD);
         
         if(groupKeys.length > 0) {
            groupKeys.forEach((tldGroup, index) => {
                 // Tạo Tab Button
                 const tabButton = document.createElement('button');
                 tabButton.className = `tab-btn ${index === 0 ? 'active' : ''}`;
                 tabButton.dataset.tab = `tab-${index}`; 
                 tabButton.textContent = tldGroup;
                 col2TabsDiv.appendChild(tabButton);

                 // Tạo Tab Content Div
                 const tabContent = document.createElement('div');
                 tabContent.id = `tab-${index}`;
                 tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
                 
                 suggestionsByTLD[tldGroup].forEach(domain => {
                     const div = document.createElement('div');
                     div.className = 'suggestion-item';
                     // Thêm badge AI nếu là kết quả từ AI
                     const aiBadge = aiResults ? `<span class="ai-badge">✨ AI</span>` : '';
                     
                     div.innerHTML = `
                        <span class="domain-name">${aiBadge}${domain}</span>
                        <button data-domain="${domain}" class="register-suggestion-btn open-register-modal">Đăng ký</button>
                     `;
                     tabContent.appendChild(div);
                 });
                 col2ContentDiv.appendChild(tabContent);
            });

            // Sự kiện chuyển tab
            col2TabsDiv.querySelectorAll('.tab-btn').forEach(button => {
                 button.addEventListener('click', () => {
                     col2TabsDiv.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                     col2ContentDiv.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                     button.classList.add('active');
                     const targetContent = document.getElementById(button.dataset.tab);
                     if (targetContent) targetContent.classList.add('active');
                 });
             });
         } else {
             col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Không có gợi ý phù hợp.</p>';
         }

        // Gắn lại sự kiện mở modal
        attachModalOpenListeners();
    }


    if(searchDomainButton && domainInput && suggestionResultsArea) {
        searchDomainButton.addEventListener('click', async () => {
            const rawInput = domainInput.value;
            const industry = industryInput.value;
            
            if (!rawInput.trim()) {
                alert("Vui lòng nhập tên miền hoặc từ khóa!");
                return;
            }

            // Tách tên miền và TLD
            let baseKeywordRaw = rawInput;
            let userTLD = null;
            const lastDotIndex = rawInput.lastIndexOf('.');
            if (lastDotIndex > 0 && lastDotIndex < rawInput.length - 1) { 
                 const potentialTLD = rawInput.substring(lastDotIndex).toLowerCase();
                 const isValidTLD = commonTLDs.includes(potentialTLD) || vnTLDs.includes(potentialTLD) || /^\.[a-z]{2,}(\.[a-z]{2})?$/.test(potentialTLD);
                 if (isValidTLD) {
                    const potentialBase = rawInput.substring(0, lastDotIndex);
                    if (potentialBase && !potentialBase.endsWith('.')) { 
                        userTLD = potentialTLD;
                        baseKeywordRaw = potentialBase;
                    }
                 }
            }

            const processedKeyword = processKeyword(baseKeywordRaw);
            if (!processedKeyword) {
                alert("Từ khóa không hợp lệ.");
                return;
            }
            
            // 1. Hiển thị UI + Kết quả trực tiếp ngay lập tức
            suggestionResultsArea.classList.remove('hidden'); 
            displayResults(processedKeyword, industry, userTLD, null); 

            // 2. Vô hiệu hóa nút tìm kiếm để tránh spam
            searchDomainButton.disabled = true;
            searchDomainButton.textContent = "Đang tìm...";

            // 3. Gọi AI (bất đồng bộ)
            const aiResults = await fetchGeminiSuggestions(rawInput, industry);

            // 4. Cập nhật UI với kết quả AI (hoặc fallback)
            displayResults(processedKeyword, industry, userTLD, aiResults || generateSmartSuggestions(processedKeyword, industry));

            // 5. Mở lại nút
            searchDomainButton.disabled = false;
            searchDomainButton.textContent = "Tìm kiếm & Gợi ý";
        });
    }
    // === HẾT SCRIPT GỢI Ý TÊN MIỀN ===

    // === SCRIPT MỞ/ĐÓNG MODAL ĐĂNG KÝ ===
    const registerModal = document.getElementById('registerModal');
    const closeModalButtons = document.querySelectorAll('.close-register-modal');
    const successMessage = document.getElementById('success-message');

    function openModal(domainToRegister = null) {
        if (registerModal) {
            if (domainToRegister && modalMessageTextarea) {
                modalMessageTextarea.value = `Tôi muốn đăng ký tên miền: ${domainToRegister}`;
            } else if (modalMessageTextarea) {
                modalMessageTextarea.value = ''; 
                modalMessageTextarea.placeholder = 'Bạn cần tư vấn thêm về tên miền nào?';
            }
            registerModal.style.display = 'block';
            lucide.createIcons(); 
        }
    }

    function closeModal() {
         if (registerModal) {
            registerModal.style.display = 'none';
            if (modalMessageTextarea) {
                modalMessageTextarea.value = '';
                modalMessageTextarea.placeholder = 'Ví dụ: Tôi muốn đăng ký tên miền abc.com'; 
            }
        }
    }
    
    function attachModalOpenListeners() {
         const resultsArea = document.getElementById('suggestionResultsArea');
         const priceTables = document.querySelectorAll('.price-table-container'); 

         const handleOpenClick = (event) => {
             if (event.target.classList.contains('open-register-modal')) {
                 const domain = event.target.dataset.domain || null; 
                 openModal(domain);
             }
         };

         if (resultsArea) {
             resultsArea.removeEventListener('click', handleOpenClick); 
             resultsArea.addEventListener('click', handleOpenClick); 
         }
         priceTables.forEach(table => {
             table.removeEventListener('click', handleOpenClick); 
             table.addEventListener('click', handleOpenClick); 
         });
    }

    attachModalOpenListeners(); 

    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target == registerModal) {
            closeModal();
        }
    });
    // === HẾT SCRIPT MODAL ===

    // === SCRIPT XỬ LÝ FORM SUBMISSION VÀ PHÁO HOA ===
    const form = document.getElementById('registrationForm');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submitButton');

    if (form && formStatus && submitButton) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const formData = new FormData(form);
            submitButton.disabled = true; 
            formStatus.textContent = 'Đang gửi...';
            formStatus.className = 'text-center text-sm text-gray-500';

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Gửi thành công!';
                    formStatus.className = 'text-center text-sm text-green-600';
                    form.reset(); 
                    closeModal(); 

                    if (successMessage)	 {
                        successMessage.classList.add('show');
                        setTimeout(() => { successMessage.classList.remove('show'); }, 3000); 
                    }

                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                    }
                    
                } else {
                    response.json().then(data => {
                        formStatus.textContent = (data && data.errors) ? data.errors.map(e => e.message).join(", ") : 'Oops! Có lỗi xảy ra.';
                        formStatus.className = 'text-center text-sm text-red-600';
                    }).catch(() => {
                        formStatus.textContent = 'Oops! Lỗi xử lý phản hồi.';
                        formStatus.className = 'text-center text-sm text-red-600';
                    });
                }
            }).catch(error => {
                console.error('Form submission fetch error:', error); 
                formStatus.textContent = 'Oops! Lỗi mạng khi gửi form.';
                formStatus.className = 'text-center text-sm text-red-600';
            }).finally(() => {
                submitButton.disabled = false; 
                setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 5000); 
               if (modalMessageTextarea) modalMessageTextarea.value = ''; 
            });
        });
    } else {
        console.error("Không tìm thấy các thành phần form cần thiết."); 
    }
});