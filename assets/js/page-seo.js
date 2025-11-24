




// assets/js/page-seo.js

// CONFIG & STATE
const apiKey = "AIzaSyC0sOmXY9FsVM-LrX-1qndfeDn4-waeDTQ"; // Runtime Environment Key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

let currentSource = 'unsplash';
let currentLang = 'vi';
const gradients = ['grad-1', 'grad-2', 'grad-3', 'grad-4', 'grad-5'];

// --- UI HANDLERS ---
window.selectImageSource = function(source) {
    currentSource = source;
    document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`btn-${source}`);
    if(btn) btn.classList.add('active');
    
    const input = document.getElementById('imageSourceInput');
    const helper = document.getElementById('imageSourceHelper');
    const preview = document.getElementById('aiImagePreview');
    
    // Reset state
    if(input) input.value = '';
    if(preview) preview.classList.add('hidden');
    
    if (source === 'unsplash') {
        input.placeholder = "Nhập từ khóa ảnh (để trống AI tự tìm)...";
        helper.innerText = "Sử dụng từ khóa để tìm ảnh Unsplash.";
    } else if (source === 'ai') {
        input.placeholder = "Mô tả chi tiết ảnh AI muốn tạo...";
        helper.innerText = "Sử dụng AI để vẽ ảnh minh họa độc quyền (Model Flux).";
    } else if (source === 'facebook' || source === 'pinterest') {
        input.placeholder = `Dán link ảnh trực tiếp (Image URL) từ ${source.charAt(0).toUpperCase() + source.slice(1)}...`;
        helper.innerText = "⚠️ Ảnh có thể không hiển thị nếu link không phải URL ảnh trực tiếp.";
    }
}

window.toggleLang = function(lang) { currentLang = lang; }

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
        document.getElementById('imageSourceInput').value = '';
        document.getElementById('seoTitleInput').value = ''; 
        document.getElementById('seoDescInput').value = '';
        document.getElementById('seoKeywordsInput').value = '';
        document.getElementById('seoScore').innerText = '0';
        document.getElementById('aiImagePreview').classList.add('hidden');
        updateScoreCircle(0);
    }
}

// --- SUGGESTION LOGIC ---
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

window.addSelectedIdeas = async function() {
    const selected = [];
    document.querySelectorAll('.suggestion-item input:checked').forEach(cb => {
        selected.push(cb.nextElementSibling.innerText);
    });

    if(selected.length === 0) return alert("Vui lòng chọn ít nhất 1 ý để viết thêm!");

    // Prepare Prompt
    const currentHtml = document.getElementById('resContentHtml').innerHTML;
    const btn = document.getElementById('btnAddIdeas');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang viết thêm...';
    btn.disabled = true;

    const prompt = `
    Task: Expand the Article.
    Language: ${currentLang === 'vi' ? 'Tiếng Việt' : 'English'}.
    
    Current HTML Content: ${currentHtml}
    
    New Topics to Add (seamlessly integrate these into the article as new H2 sections):
    ${selected.join('\n')}
    
    Output: Return ONLY the FULL updated HTML content (starting with existing content and adding new sections naturally).
    `;

    const updatedHtml = await callGemini(prompt, true); // true = raw text
    
    if(updatedHtml) {
        // Clean markdown if present
        const cleanHtml = updatedHtml.replace(/```html/g, '').replace(/```/g, '');
        document.getElementById('resContentHtml').innerHTML = cleanHtml;
        document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;
        
        // Clear suggestions
        document.getElementById('suggestionList').innerHTML = '<div class="text-xs text-green-600 italic text-center py-2">Đã thêm thành công!</div>';
        setTimeout(() => {
            document.getElementById('outlineArea').classList.add('hidden');
            document.getElementById('checklistArea').classList.remove('hidden');
        }, 2000);
        
        showToast("Đã bổ sung nội dung mới!");
    } else {
        alert("Lỗi khi viết thêm.");
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}


// --- GEMINI AI LOGIC (TEXT) ---
async function callGemini(prompt, isRaw = false) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: isRaw ? {} : { responseMimeType: "application/json" }
            })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        // Try to parse JSON if not raw, otherwise return text
        if (isRaw) return text;
        return JSON.parse(text);

    } catch (e) { console.error(e); return null; }
}

// --- GENERATE AI IMAGE (USING POLLINATIONS AI - RELIABLE) ---
async function generateAIImage(prompt) {
    // Sử dụng Pollinations AI (Miễn phí, Ổn định)
    return new Promise((resolve) => {
        const seed = Math.floor(Math.random() * 1000000);
        // Tối ưu prompt kỹ hơn để tránh ảnh ảo giác
        // Thêm 'no text' để tránh AI viết chữ linh tinh vào ảnh
        // Thêm 'clear focus' để ảnh tập trung
        const safePrompt = encodeURIComponent(prompt + ", photorealistic, 8k, highly detailed, professional photography, clear focus, cinematic lighting, no text");
        
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=450&seed=${seed}&nologo=true&model=flux`;
        
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => {
            console.error("Lỗi tải ảnh từ Pollinations");
            resolve(null);
        };
        img.src = imageUrl;
    });
}

// --- NEW: PROCESS H2 IMAGES (SMART CONTEXT AWARENESS) ---
async function processH2Images(mainKeyword) {
    const contentDiv = document.getElementById('resContentHtml');
    const h2Elements = contentDiv.querySelectorAll('h2');
    
    if(h2Elements.length === 0) return;

    showToast(`Đang vẽ ${h2Elements.length} ảnh minh họa...`);

    for (const h2 of h2Elements) {
        const containerId = `ai-img-${Math.random().toString(36).substr(2, 9)}`;
        
        // 1. Lấy nội dung ngữ cảnh (đoạn văn ngay sau H2)
        // Quét các thẻ tiếp theo cho đến khi gặp tiêu đề khác hoặc đủ nội dung
        let contextText = "";
        let sibling = h2.nextElementSibling;
        let count = 0;
        
        while(sibling && count < 2) { // Chỉ lấy tối đa 2 đoạn văn/thẻ tiếp theo
            if(['H2','H3','H4'].includes(sibling.tagName)) break; // Dừng nếu gặp tiêu đề khác
            
            if(sibling.innerText && sibling.innerText.trim().length > 10) {
                contextText += sibling.innerText.trim() + " ";
            }
            sibling = sibling.nextElementSibling;
            count++;
        }

        // Nếu không tìm thấy nội dung, dùng chính H2 và keyword
        if(!contextText) contextText = `${mainKeyword} - ${h2.innerText}`;

        // 2. Chèn khung loading
        const container = document.createElement('div');
        container.className = 'ai-image-container';
        container.id = containerId;
        container.innerHTML = `
            <div class="ai-loading-box">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span class="text-xs">Đang đọc nội dung & vẽ ảnh...</span>
            </div>
        `;
        h2.parentNode.insertBefore(container, h2.nextSibling);

        // 3. Dùng Gemini để tạo Prompt tiếng Anh chuẩn xác từ nội dung
        const cleanH2 = h2.innerText.replace(/^([0-9]+|[IVX]+)[\.\)]\s*/i, '').trim();
        
        const promptRequest = `
            Act as an AI Image Prompt Expert.
            Context: Writing a blog post about "${mainKeyword}".
            Section Heading: "${cleanH2}".
            Section Content: "${contextText.substring(0, 500)}".
            
            Task: Create a highly detailed, photorealistic image generation prompt in English that visualizes the content of this section perfectly.
            Rules:
            - Visualize the main action, object, or concept described in the content.
            - Style: Cinematic lighting, 8k resolution, professional photography, realistic.
            - Keep it under 40 words.
            - Output ONLY the prompt string. No explanations.
        `;
        
        let englishPrompt = await callGemini(promptRequest, true);
        
        // Fallback nếu Gemini lỗi
        if (!englishPrompt || englishPrompt.length < 5) {
             englishPrompt = `${mainKeyword}, ${cleanH2}, photorealistic, high quality, 8k`;
        } else {
             englishPrompt = englishPrompt.replace(/```/g, '').trim();
        }

        console.log(`Generating image for "${cleanH2}" with prompt: ${englishPrompt}`);

        // 4. Gọi API vẽ ảnh với prompt tiếng Anh
        const imgUrl = await generateAIImage(englishPrompt);
        
        const targetContainer = document.getElementById(containerId);
        if (targetContainer) {
            if (imgUrl) {
                targetContainer.innerHTML = `<img src="${imgUrl}" alt="${cleanH2}" class="ai-generated-img">`;
            } else {
                targetContainer.remove();
            }
        }
        
        // Delay nhẹ để tránh quá tải
        await new Promise(r => setTimeout(r, 1000)); 
    }
}


window.startGenerating = async function() {
    const keyword = document.getElementById('keywordInput').value.trim();
    if(!keyword) return alert("Vui lòng nhập từ khóa chính!");

    const length = document.querySelector('input[name="wordCount"]:checked').value;
    const location = document.getElementById('locationInput').value;
    const brandName = document.getElementById('brandNameInput').value;
    const brandColor = document.getElementById('brandColorInput').value;
    const footerInfo = document.getElementById('footerInput').value;
    const sourceInput = document.getElementById('imageSourceInput').value;
    const isAutoH2Image = document.getElementById('autoH2Image').checked; 
    
    // User Drafts
    const userTitle = document.getElementById('seoTitleInput').value;
    const userDesc = document.getElementById('seoDescInput').value;
    const userKw = document.getElementById('seoKeywordsInput').value;

    // UI Loading
    document.getElementById('loadingState').classList.remove('hidden');
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const headerCard = document.getElementById('headerCard');
    headerCard.className = `rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group ${randomGrad}`;
    document.getElementById('aiImagePreview').classList.add('hidden'); 


    // --- IMAGE GENERATION (MAIN) ---
    let imgInstruct = '';
    let aiImageUrl = '';
    const loadingText = document.getElementById('loadingText');

    if (currentSource === 'ai') {
        loadingText.innerText = "Đang vẽ ảnh bìa (3-5s)...";
        // Tối ưu prompt cho ảnh bìa
        const imagePrompt = sourceInput.trim() || `High quality photo representing ${keyword}. Professional, modern style, cinematic lighting.`;
        aiImageUrl = await generateAIImage(imagePrompt);
        
        if (aiImageUrl) {
            imgInstruct = `Chèn ảnh AI đã tạo: <img src="${aiImageUrl}" alt="${keyword}">`;
            document.getElementById('aiImageTag').src = aiImageUrl;
            document.getElementById('aiImagePreview').classList.remove('hidden');
            showToast("Đã tạo ảnh AI thành công!");
        } else {
            imgInstruct = `Tạo placeholder [Lỗi tạo ảnh AI. Thử lại sau.]`;
            showToast("Lỗi tạo ảnh AI.", true);
        }
    } else if (currentSource === 'unsplash') {
        const keywordForUrl = sourceInput.trim() || keyword;
        imgInstruct = `Tự tìm ảnh Unsplash phù hợp. Chèn: <img src="https://source.unsplash.com/800x600/?${encodeURIComponent(keywordForUrl)}" alt="${keyword}">`;
    } else if (currentSource === 'pinterest' || currentSource === 'facebook') {
        const url = sourceInput.trim();
        if (url && url.startsWith('http')) {
            imgInstruct = `Chèn ảnh từ URL người dùng: <img src="${url}" alt="${keyword}">`;
        } else {
            imgInstruct = `Tạo placeholder [Vui lòng cung cấp URL ảnh hợp lệ từ ${currentSource}.]`;
        }
    }


    // Draft Handling Instruction
    let draftInstruct = "Generate optimized Title, Description, and Keywords from scratch based on the main keyword.";
    if(userTitle || userDesc || userKw) {
        draftInstruct = `
        USER DRAFT PROVIDED:
        - Draft Title: "${userTitle}"
        - Draft Desc: "${userDesc}"
        - Draft Keywords: "${userKw}"
        
        ACTION: Analyze the drafts. Rewrite and Optimize them for better SEO (CTR, ranking) while maintaining the original intent/meaning. DO NOT simply discard them.
        `;
    }

    // STYLE INSTRUCTION FROM SEO.TXT
    const styleInstruction = `
    HTML FORMAT RULES (Strictly follow):
    - Wrap all content in a main div: <div style="font-family: Tahoma, sans-serif; font-size: 16px; line-height: 1.6; text-align: justify; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
    - Use Inline CSS for everything.
    - Brand Color: ${brandColor}
    - H2 Style: color: ${brandColor}; font-size: 22px; line-height: 1.5; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid ${brandColor}; font-weight: 800; /* IN ĐẬM cho H2 */
    - H3 Style: color: #34495e; font-size: 18px; line-height: 1.5; margin-top: 25px; margin-bottom: 10px; font-weight: 700; /* IN ĐẬM cho H3 */
    - Images: Centered with captions. Format: <p style="text-align: center; margin-bottom: 20px;"><img ...><br><em style="font-size: 14px; color: #555;">Caption</em></p>
    - Lists: <ul style="padding-left: 20px; margin-bottom: 20px;"> with <li style="margin-bottom: 8px;">
    - Tables: Full width table with header background-color: ${brandColor} and white text.
    - Important Terms: Use <strong style="color: ${brandColor};">Term</strong> for emphasis.
    `;
    
    loadingText.innerText = "Đang viết bài và tối ưu SEO...";

    const prompt = `
    Role: SEO Expert & Content Writer. Language: ${currentLang === 'vi' ? 'Tiếng Việt' : 'English'}.
    Info: Keyword="${keyword}", Length=${length}, Location=${location}.
    Brand Info: Name="${brandName}", Color="${brandColor}", Footer="${footerInfo}".
    
    ${draftInstruct}

    ${styleInstruction}

    Output JSON Format:
    {
        "title": "Optimized SEO Title (<70 chars)",
        "description": "Optimized Meta Desc (<160 chars)",
        "keywords": "Optimized list of keywords separated by commas",
        "snippet": "Featured Snippet (40-50 words) defining the keyword",
        "content_html": "Full HTML article content starting with body text (H2, H3, P, UL). Do NOT include an H1 tag (H1 is the Title). Add footer info at the end inside a styled box. ${imgInstruct}",
        "suggested_topics": ["List of 3-4 related sub-topics or H2 headings that are NOT in the content yet but would add value"]
    }
    `;

    const data = await callGemini(prompt);

    if(data) {
        document.getElementById('resTitle').innerText = data.title;
        document.getElementById('resDesc').innerText = data.description;
        document.getElementById('resSnippet').innerText = data.snippet;
        document.getElementById('resContentHtml').innerHTML = data.content_html;
        document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;

        document.getElementById('seoTitleInput').value = data.title;
        document.getElementById('seoDescInput').value = data.description;
        document.getElementById('seoKeywordsInput').value = data.keywords || "";
        
        renderSuggestions(data.suggested_topics);

        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('resultArea').classList.remove('hidden');
        
        runAudit(keyword, data.title, data.description, data.content_html);
        
        if(isAutoH2Image) {
            processH2Images(keyword);
        } else {
            showToast("Đã viết bài và chèn ảnh thành công!");
        }

    } else {
        alert("Lỗi kết nối AI khi viết nội dung. Vui lòng thử lại!");
    }

    document.getElementById('loadingState').classList.add('hidden');
}

// --- AUDIT LOGIC ---
function runAudit(kw, title, desc, html) {
    kw = kw || document.getElementById('keywordInput').value.toLowerCase();
    title = title || document.getElementById('resTitle').innerText.toLowerCase();
    desc = desc || document.getElementById('resDesc').innerText.toLowerCase();
    html = html || document.getElementById('resContentHtml').innerHTML.toLowerCase();

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

    score += update('chk-keyword', title.toLowerCase().includes(kw.toLowerCase())); checks++;
    score += update('chk-length', html.length > 1500); checks++;
    score += update('chk-headings', html.includes('<h2') || html.includes('<h3')); checks++;
    score += update('chk-meta', desc.toLowerCase().includes(kw.toLowerCase())); checks++;

    const finalScore = Math.round((score/checks)*100);
    
    let current = 0;
    const scoreEl = document.getElementById('seoScore');
    const interval = setInterval(() => {
        if(current >= finalScore) { clearInterval(interval); updateScoreCircle(finalScore); } 
        else { current++; scoreEl.innerText = current; }
    }, 20);
}

function updateScoreCircle(score) {
    const circle = document.getElementById('scoreCircle');
    const offset = 301 - (score / 100) * 301;
    circle.style.strokeDashoffset = offset;
    circle.setAttribute('stroke', score < 50 ? '#ef4444' : (score < 80 ? '#f59e0b' : '#10b981'));
}

// --- VOICE INPUT LOGIC ---
function initVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    const keywordInput = document.getElementById('keywordInput');

    if (!voiceBtn || !keywordInput) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none'; 
        console.warn('Trình duyệt không hỗ trợ Speech Recognition');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
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
        const transcript = event.results[0][0].transcript;
        keywordInput.value = transcript;
        keywordInput.dispatchEvent(new Event('input'));
    };

    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        voiceBtn.classList.remove('listening');
        showToast('Lỗi nhận dạng giọng nói', true);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const brandColorInput = document.getElementById('brandColorInput');
    if(brandColorInput) {
        brandColorInput.addEventListener('input', (e) => {
            document.getElementById('brandColorText').value = e.target.value.toUpperCase();
        });
    }
    selectImageSource('unsplash');
    initVoiceInput();
});