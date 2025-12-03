// assets/js/page-seo.js
// PHIÊN BẢN: SUPER DETAIL + GRADIENT CONTROL + MODERN UI

// CONFIG & STATE
const apiKey = (typeof CONFIG !== 'undefined') ? CONFIG.GEMINI_API_KEY : "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

let currentLang = 'vi';
const gradients = ['grad-1', 'grad-2', 'grad-3', 'grad-4', 'grad-5'];

// --- UI HANDLERS ---
window.toggleLang = function(lang) { currentLang = lang; }

// Hàm bật tắt ô chọn màu thứ 2
window.toggleGradientOption = function() {
    const isChecked = document.getElementById('useGradient').checked;
    const endSection = document.getElementById('gradientEndSection');
    if(isChecked) {
        endSection.classList.remove('hidden');
    } else {
        endSection.classList.add('hidden');
    }
}

window.copyContent = function(id) {
    let text = (id === 'resContentHtml') ? document.getElementById(id).innerHTML : document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => showToast("Đã copy!"));
}

window.copyInput = function(id) {
    const el = document.getElementById(id);
    if(el) {
        el.select();
        navigator.clipboard.writeText(el.value).then(() => showToast("Đã copy cấu hình!"));
    }
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast.querySelector('i');
    
    toastMsg.innerText = msg;
    
    if(isError) {
        icon.className = "fa-solid fa-circle-xmark text-red-400 text-lg";
    } else {
        icon.className = "fa-solid fa-circle-check text-green-400 text-lg";
    }

    toast.classList.remove('translate-y-32');
    setTimeout(() => toast.classList.add('translate-y-32'), 2000);
}

window.resetEditor = function() {
    if(confirm("Làm mới toàn bộ?")) {
        document.getElementById('emptyState').classList.remove('hidden');
        document.getElementById('resultArea').classList.add('hidden');
        document.getElementById('outlineArea').classList.add('hidden');
        document.getElementById('checklistArea').classList.remove('hidden');
        document.getElementById('keywordInput').value = '';
        document.getElementById('requiredContentInput').value = '';
        document.getElementById('seoTitleInput').value = ''; 
        document.getElementById('seoDescInput').value = '';
        document.getElementById('seoKeywordsInput').value = '';
        document.getElementById('seoScore').innerText = '0';
        updateScoreCircle(0);
    }
}

// --- RENDER FUNCTIONS ---
function renderSuggestions(topics) {
    const container = document.getElementById('suggestionList');
    container.innerHTML = '';
    if(!topics || topics.length === 0) return;

    document.getElementById('outlineArea').classList.remove('hidden');

    topics.forEach((topic, idx) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item p-2 rounded border border-slate-200 bg-white text-xs text-slate-600 cursor-pointer hover:border-indigo-300 transition-all select-none flex items-start gap-2';
        div.innerHTML = `
            <input type="checkbox" class="mt-0.5 accent-indigo-600 pointer-events-none" id="sug-${idx}">
            <span class="leading-relaxed">${topic}</span>
        `;
        div.onclick = (e) => {
            const cb = div.querySelector('input');
            cb.checked = !cb.checked;
            div.classList.toggle('selected', cb.checked);
        }
        container.appendChild(div);
    });
}

// --- GEMINI API CORE ---
async function callGemini(prompt, isRaw = false, useSearch = false) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 phút Timeout

    try {
        const freshKey = (typeof CONFIG !== 'undefined') ? CONFIG.GEMINI_API_KEY : "";
        if (!freshKey || freshKey.length < 20) throw new Error("API Key Missing");

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
        };

        if (useSearch) {
            payload.tools = [{ google_search: {} }];
            payload.generationConfig = {}; 
        } else {
            payload.generationConfig = isRaw ? {} : { responseMimeType: "application/json" };
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${freshKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("API Error Body:", errData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
             throw new Error("API trả về lỗi hoặc bị chặn.");
        }

        let text = data.candidates[0].content.parts[0].text;
        
        if (isRaw) return text;

        try {
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonMatch) cleanText = jsonMatch[0];
            return JSON.parse(cleanText);
        } catch (e) {
             console.warn("JSON Parse Failed. Raw text:", text);
             return null;
        }

    } catch (e) { 
        clearTimeout(timeoutId);
        console.error("Gemini API Error:", e); 
        return null; 
    }
}

// --- MAIN GENERATION LOGIC ---
window.startGenerating = async function() {
    const keyword = document.getElementById('keywordInput').value.trim();
    if(!keyword) return alert("Vui lòng nhập từ khóa chính!");

    // Get Inputs
    const brandName = document.getElementById('brandNameInput').value || "Thương hiệu";
    const footerInfo = document.getElementById('footerInput').value || "Liên hệ ngay để được tư vấn!";
    const requiredContent = document.getElementById('requiredContentInput').value.trim();
    
    // --- XỬ LÝ MÀU SẮC & GRADIENT ---
    const startColor = document.getElementById('brandColorInput').value || "#6366f1";
    const useGradient = document.getElementById('useGradient').checked;
    const endColor = document.getElementById('brandColorEndInput').value || "#a855f7";
    
    // Tạo chuỗi CSS Gradient hoặc màu đơn
    let cssGradientVal = "";
    if(useGradient) {
        cssGradientVal = `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
    } else {
        // Nếu không dùng gradient, tạo gradient nhẹ từ màu gốc để vẫn đẹp
        cssGradientVal = `linear-gradient(135deg, ${startColor} 0%, ${startColor} 100%)`; 
    }

    // Tone
    let selectedTone = "Chuyên gia & Tin cậy";
    const toneRadio = document.querySelector('input[name="toneStyle"]:checked');
    if (toneRadio) selectedTone = toneRadio.value;

    document.documentElement.style.setProperty('--brand-color', startColor);

    // UI Setup
    document.getElementById('loadingState').classList.remove('hidden');
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const headerCard = document.getElementById('headerCard');
    if(headerCard) headerCard.className = `rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group ${randomGrad}`;
    document.getElementById('loadingText').innerText = "Đang lên dàn ý chi tiết 5 phần và viết bài...";

    const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const requiredInstruct = requiredContent ? `MANDATORY USER POINTS: "${requiredContent}"` : "";

    // --- PROMPT MỚI: ÉP CẤU TRÚC DÀI VÀ CHI TIẾT ---
    const articlePrompt = `
    Role: Senior Copywriter & SEO Expert.
    Task: Write a VERY DETAILED, LONG-FORM blog post (min 1500 words) about "${keyword}".
    Language: Vietnamese.
    Tone: ${selectedTone}. Brand: "${brandName}".
    
    ${requiredInstruct}

    --- IMPORTANT STRUCTURE RULES (MUST FOLLOW) ---
    1. **Structure:** You MUST create at least **4 to 5 Main H2 Sections** (excluding Intro/Conclusion).
    2. **Depth:** Inside each H2, you MUST use **H3 Subheadings** to break down the concept further.
    3. **Formatting:** - Do NOT write long walls of text. 
       - MUST use **Bullet Points**, **Numbered Lists**, or **Checklists** (✅) in every section.
       - Use Icons (🔥, 💡, ⚠️, 🚀) to make headers pop.
    4. **Color & Style:**
       - **Primary Color:** ${startColor}
       - **Gradient:** ${cssGradientVal} (Use this for H1 and CTA).
       - **H2 Style:** Use the Primary Color.
    
    --- HTML OUTPUT TEMPLATE ---
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; line-height: 1.8; color: #334155; max-width: 100%; margin: 0 auto;">
        
        <div style="text-align: center; margin-bottom: 50px;">
            <span style="background-color: ${startColor}15; color: ${startColor}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase;">
                ${brandName} Blog
            </span>
            <h1 style="margin-top: 25px; font-size: 36px; font-weight: 800; line-height: 1.3; 
                background: ${cssGradientVal}; 
                -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
                background-clip: text; color: ${startColor};">
                [SEO TITLE - HẤP DẪN]
            </h1>
            <p style="font-size: 19px; color: #64748b; margin-top: 20px; font-weight: 500;">
                [Sapo: 3-4 dòng dẫn dắt vấn đề...]
            </p>
        </div>

        <div style="background: ${startColor}08; border: 1px solid ${startColor}20; border-radius: 16px; padding: 30px; margin: 40px 0;">
            <h3 style="margin-top: 0; color: ${startColor}; font-size: 20px; font-weight: 700;">💡 Nội dung chính:</h3>
            <ul style="margin-top: 15px; padding-left: 20px; color: #475569; list-style-type: none;">
                <li style="margin-bottom: 10px;">✅ [Ý chính 1]</li>
                <li style="margin-bottom: 10px;">✅ [Ý chính 2]</li>
                <li style="margin-bottom: 10px;">✅ [Ý chính 3]</li>
                <li>✅ [Ý chính 4]</li>
            </ul>
        </div>

        <h2 style="font-size: 28px; font-weight: 700; color: ${startColor}; margin-top: 60px; margin-bottom: 25px;">
            1. [TIÊU ĐỀ H2 THỨ NHẤT: Vấn đề/Tổng quan]
        </h2>
        <p>[Nội dung chi tiết...]</p>
        <h3 style="font-size: 20px; font-weight: 600; color: #475569; margin-top: 20px;">1.1 [Tiêu đề phụ H3]</h3>
        <p>[Nội dung H3...]</p>
        <ul style="margin: 20px 0; padding-left: 20px;">
            <li>Chi tiết A...</li>
            <li>Chi tiết B...</li>
        </ul>
        
        <div class="ai-image-placeholder" data-prompt="Contextual image for section 1 about ${keyword}"></div>

        <h2 style="font-size: 28px; font-weight: 700; color: ${startColor}; margin-top: 60px; margin-bottom: 25px;">
            2. [TIÊU ĐỀ H2 THỨ HAI: Giải pháp chi tiết]
        </h2>
        <p>[Nội dung chuyên sâu...]</p>
        <div class="ai-image-placeholder" data-prompt="Detailed illustration for section 2 about ${keyword}"></div>

        <h2 style="font-size: 28px; font-weight: 700; color: ${startColor}; margin-top: 60px; margin-bottom: 25px;">
            3. [TIÊU ĐỀ H2 THỨ BA: So sánh/Đánh giá]
        </h2>
        <div style="overflow-x: auto; border-radius: 16px; border: 1px solid ${startColor}20; margin: 30px 0;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                <thead>
                    <tr style="background: ${cssGradientVal}; color: white;">
                        <th style="padding: 15px;">Tiêu chí</th><th style="padding: 15px;">${brandName}</th><th style="padding: 15px;">Khác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="padding: 15px; border-bottom: 1px solid #eee;">Chất lượng</td><td style="padding: 15px; border-bottom: 1px solid #eee; color: ${startColor}; font-weight: bold;">⭐⭐⭐⭐⭐</td><td style="padding: 15px; border-bottom: 1px solid #eee;">⭐⭐⭐</td></tr>
                </tbody>
            </table>
        </div>

        <h2 style="font-size: 28px; font-weight: 700; color: ${startColor}; margin-top: 60px; margin-bottom: 25px;">
            4. [TIÊU ĐỀ H2 THỨ TƯ: Quy trình/Các bước thực hiện]
        </h2>
        <h3 style="font-size: 20px; font-weight: 600; color: #475569;">🚀 Bước 1: ...</h3>
        <p>...</p>
        <h3 style="font-size: 20px; font-weight: 600; color: #475569;">⚙️ Bước 2: ...</h3>
        <p>...</p>
        
        <div class="ai-image-placeholder" data-prompt="Process flowchart or action shot for ${keyword}"></div>

        <h2 style="font-size: 28px; font-weight: 700; color: ${startColor}; margin-top: 60px; margin-bottom: 25px;">
            5. [TIÊU ĐỀ H2 THỨ NĂM: Câu hỏi thường gặp/Lời khuyên]
        </h2>
        <p>[Nội dung...]</p>

        <div style="text-align: center; margin-top: 80px; padding: 50px 30px; background: linear-gradient(to bottom, ${startColor}05, #ffffff); border-radius: 24px; border: 1px solid ${startColor}10;">
            <h3 style="margin-bottom: 20px; color: ${startColor}; font-size: 24px; font-weight: 800;">Tư vấn ${keyword} ngay hôm nay?</h3>
            <p style="margin-bottom: 30px; color: #64748b;">${footerInfo}</p>
            <a href="#contact" style="display: inline-block; padding: 18px 50px; background: ${cssGradientVal}; color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 15px 30px -10px ${startColor}80; transition: transform 0.2s;">
                Liên Hệ Ngay
            </a>
        </div>
    </div>
    
    IMPORTANT: 
    - The output MUST be Raw HTML.
    - DO NOT include markdown blocks.
    - Ensure content is LONG and DETAILED.
    `;

    const seoPrompt = `
    Role: SEO Strategist.
    Keyword: "${keyword}".
    Task: Generate SEO Metadata.
    Output JSON ONLY:
    {
        "title": "SEO Title < 60 chars",
        "description": "Meta description 150-160 chars",
        "keywords": "keyword1, keyword2",
        "snippet": "Featured snippet text",
        "expansion_ideas": ["Idea 1", "Idea 2"],
        "new_topics": [{"title": "T1", "type": "Guide", "desc": "D1"}]
    }
    `;

    // === EXECUTION ===
    const p1 = callGemini(articlePrompt, true, true).then(rawText => {
        if (rawText && rawText.length > 100) {
            let cleanHtml = rawText.replace(/```html/g, '').replace(/```/g, '');
            // Clean markdown bold/italic
            cleanHtml = cleanHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            cleanHtml = cleanHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');
            cleanHtml = cleanHtml.replace(/^\s*\*\s+/gm, '• ');
            cleanHtml = cleanHtml.trim();

            document.getElementById('resContentHtml').innerHTML = cleanHtml;
            document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;
            
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('emptyState').classList.add('hidden');
            document.getElementById('resultArea').classList.remove('hidden');
            showToast("Đã hoàn tất bài viết!");
            
            return cleanHtml;
        }
        throw new Error("Nội dung trả về quá ngắn.");
    });

    const p2 = callGemini(seoPrompt, false, false).then(seoData => {
        if (seoData) {
            document.getElementById('resTitle').innerText = seoData.title || "...";
            document.getElementById('resDesc').innerText = seoData.description || "...";
            document.getElementById('resSnippet').innerText = seoData.snippet || "...";
            
            document.getElementById('seoTitleInput').value = seoData.title || "";
            document.getElementById('seoDescInput').value = seoData.description || "";
            document.getElementById('seoKeywordsInput').value = seoData.keywords || "";
            
            if (seoData.expansion_ideas) renderSuggestions(seoData.expansion_ideas);
            if (seoData.new_topics) renderNewTopics(seoData.new_topics);
            showToast("Đã cập nhật SEO Meta!");
            return seoData;
        }
        return null;
    });

    Promise.allSettled([p1, p2]).then(async (results) => {
        if (results[0].status === 'fulfilled') {
            const contentHtml = results[0].value;
            // Xử lý ảnh AI
            processAIImagePlaceholders(keyword);
            // Audit SEO
            if (results[1].status === 'fulfilled') {
                const seoData = results[1].value;
                runAudit(keyword, seoData.title, seoData.description, contentHtml);
            }
        } else {
            alert("Có lỗi khi tạo nội dung. Vui lòng thử lại.");
            document.getElementById('loadingState').classList.add('hidden');
        }
    });
}

// --- GENERATE AI IMAGE ---
async function generateAIImage(prompt) {
    return new Promise((resolve) => {
        const seed = Math.floor(Math.random() * 1000000);
        const safePrompt = encodeURIComponent(prompt + ", modern photography, cinematic lighting, high resolution, 8k");
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=450&seed=${seed}&nologo=true&model=flux`;
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => { console.error("Img Error"); resolve(null); };
        img.src = imageUrl;
    });
}

async function processAIImagePlaceholders(mainKeyword) {
    const contentDiv = document.getElementById('resContentHtml');
    const placeholders = contentDiv.querySelectorAll('.ai-image-placeholder');
    if(placeholders.length === 0) return;

    for (const placeholder of placeholders) {
        placeholder.innerHTML = `<div class="ai-loading-box inline-block p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 shadow-sm flex items-center gap-2"><i class="fa-solid fa-paintbrush text-indigo-500 fa-spin"></i>Đang vẽ minh họa...</div>`;
        placeholder.style.textAlign = 'center';
        placeholder.style.margin = '30px 0';
        
        const prompt = placeholder.getAttribute('data-prompt');
        if (prompt) {
            const url = await generateAIImage(prompt);
            if (url) {
                const img = document.createElement('img');
                img.src = url;
                img.alt = `Minh họa: ${prompt.substring(0, 50)}...`;
                img.style.width = '100%';
                img.style.borderRadius = '16px';
                img.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.1)';
                img.style.marginTop = '10px';
                placeholder.parentNode.replaceChild(img, placeholder);
            } else { placeholder.remove(); }
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;
}

// --- OTHER HELPERS ---
window.addSelectedIdeas = async function() { 
    const selected = [];
    document.querySelectorAll('.suggestion-item input:checked').forEach(cb => {
        selected.push(cb.nextElementSibling.innerText);
    });
    if(selected.length === 0) return alert("Chọn ý để viết!");

    const btn = document.getElementById('btnAddIdeas');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Writing...'; btn.disabled = true;

    const currentHtml = document.getElementById('resContentHtml').innerHTML;
    const startColor = document.getElementById('brandColorInput').value || "#6366f1";
    
    const prompt = `Task: Expand blog post (Vietnamese) with sections: ${selected.join(', ')}. Return FULL HTML. 
    Style: Modern UI, Color: ${startColor}. Ensure bullet points and H3 are used.
    Content: ${currentHtml}`;
    
    const rawText = await callGemini(prompt, true, true); 
    if(rawText) {
        let cleanHtml = rawText.replace(/```html/g, '').replace(/```/g, '').trim();
        cleanHtml = cleanHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        document.getElementById('resContentHtml').innerHTML = cleanHtml;
        document.getElementById('resContentText').innerText = cleanHtml;
        showToast("Đã mở rộng nội dung!");
        processAIImagePlaceholders(document.getElementById('keywordInput').value.trim());
    }
    btn.innerHTML = oldText; btn.disabled = false;
};

function runAudit(kw, title, desc, html) {
    kw = (kw || "").toLowerCase();
    title = (title || "").toLowerCase();
    desc = (desc || "").toLowerCase();
    html = (html || "").toLowerCase();
    if(!kw) return;
    
    let score = 0; let checks = 0;
    const update = (id, valid) => {
        const el = document.getElementById(id);
        const icon = el.querySelector('.check-icon');
        if(valid) {
            icon.className = "fa-solid fa-circle-check mt-1 text-green-500 check-icon";
            el.classList.add('border-green-100', 'bg-green-50/50');
            return 1;
        } else {
            icon.className = "fa-solid fa-circle-xmark mt-1 text-red-400 check-icon";
            el.classList.remove('border-green-100', 'bg-green-50/50');
            return 0;
        }
    };
    score += update('chk-keyword', title.includes(kw) || html.includes('<h1>' + kw)); checks++;
    score += update('chk-length', html.length > 5000); checks++;
    score += update('chk-headings', html.includes('<h2') && html.includes('<h3')); checks++;
    score += update('chk-meta', desc.includes(kw)); checks++;
    const finalScore = checks > 0 ? Math.round((score/checks)*100) : 0;
    document.getElementById('seoScore').innerText = finalScore;
    updateScoreCircle(finalScore);
}

function updateScoreCircle(score) {
    const circle = document.getElementById('scoreCircle');
    const offset = 301 - (score / 100) * 301;
    circle.style.strokeDashoffset = offset;
    circle.setAttribute('stroke', score < 50 ? '#ef4444' : (score < 80 ? '#f59e0b' : '#10b981'));
}

window.useTopic = function(title) {
    if(confirm(`Dùng chủ đề "${title}"?`)) {
        document.getElementById('keywordInput').value = title;
        document.getElementById('topicModal').classList.add('hidden');
        resetEditor();
    }
}

window.generateTopicIdeas = async function() {
    const keyword = document.getElementById('keywordInput').value.trim();
    const brand = document.getElementById('brandNameInput').value.trim();
    if(!keyword) return alert("Nhập từ khóa!");
    
    const modal = document.getElementById('topicModal');
    const list = document.getElementById('topicList');
    modal.classList.remove('hidden');
    list.innerHTML = '<p class="text-center p-5">Đang tìm ý tưởng...</p>';
    
    const prompt = `Suggest 10 blog topics for "${keyword}" (Brand: ${brand}). Return JSON: [{"title": "...", "type": "...", "desc": "..."}]`;
    const data = await callGemini(prompt, false, false);
    if(data && Array.isArray(data)) renderNewTopics(data);
    else list.innerHTML = '<p class="text-center text-red-500">Lỗi.</p>';
}

function initVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    const keywordInput = document.getElementById('keywordInput');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { if(voiceBtn) voiceBtn.style.display = 'none'; return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) recognition.stop();
        else recognition.start();
    });
    recognition.onstart = () => {
        voiceBtn.classList.add('listening');
        keywordInput.placeholder = "Đang nghe...";
    };
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
        keywordInput.placeholder = "VD: Thiết kế nội thất...";
    };
    recognition.onresult = (event) => {
        keywordInput.value = event.results[0][0].transcript;
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Sync input text với color picker
    document.getElementById('brandColorInput').addEventListener('input', (e) => {
        document.getElementById('brandColorText').value = e.target.value.toUpperCase();
    });
    const endPicker = document.getElementById('brandColorEndInput');
    if(endPicker) {
        endPicker.addEventListener('input', (e) => {
            document.getElementById('brandColorEndText').value = e.target.value.toUpperCase();
        });
    }
    const imageSourceSection = document.getElementById('imageSourceSection');
    if(imageSourceSection) imageSourceSection.classList.add('hidden');
    initVoiceInput();
});
