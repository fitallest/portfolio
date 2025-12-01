


// assets/js/page-seo.js

// CONFIG & STATE
// --- LẤY API KEY TỪ ENV.JS ---
const apiKey = (typeof CONFIG !== 'undefined') ? CONFIG.GEMINI_API_KEY : "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
        const requiredContentInput = document.getElementById('requiredContentInput');
        if(requiredContentInput) requiredContentInput.value = '';
        document.getElementById('imageSourceInput').value = '';
        document.getElementById('seoTitleInput').value = ''; 
        document.getElementById('seoDescInput').value = '';
        document.getElementById('seoKeywordsInput').value = '';
        document.getElementById('seoScore').innerText = '0';
        document.getElementById('aiImagePreview').classList.add('hidden');
        updateScoreCircle(0);
    }
}

// --- SUGGESTION LOGIC (OUTLINE) ---
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

    const currentHtml = document.getElementById('resContentHtml').innerHTML;
    const btn = document.getElementById('btnAddIdeas');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang viết thêm...';
    btn.disabled = true;

    const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `
    Task: Expand the Article with UP-TO-DATE information.
    Current Date: ${today}.
    Language: ${currentLang === 'vi' ? 'Tiếng Việt' : 'English'}.
    
    Current HTML Content: ${currentHtml}
    
    New Topics to Add (seamlessly integrate these into the article as new H2 sections):
    ${selected.join('\n')}
    
    Requirement: Use Google Search to ensure the new content contains the latest facts and data.
    
    Output: Return ONLY the FULL updated HTML content (starting with existing content and adding new sections naturally).
    `;

    const updatedHtml = await callGemini(prompt, true, true); 
    
    if(updatedHtml) {
        const cleanHtml = updatedHtml.replace(/```html|```/g, '').trim();
        document.getElementById('resContentHtml').innerHTML = cleanHtml;
        document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;
        
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

// --- NEW TOPIC GENERATION LOGIC ---
window.generateTopicIdeas = async function() {
    const keyword = document.getElementById('keywordInput').value.trim();
    const brand = document.getElementById('brandNameInput').value.trim();
    
    if(!keyword && !brand) {
        alert("Vui lòng nhập ít nhất 'Từ khóa chính' hoặc 'Tên thương hiệu' để AI có thể gợi ý.");
        return;
    }

    const modal = document.getElementById('topicModal');
    const listContainer = document.getElementById('topicList');
    const btn = document.getElementById('btnSuggestTopics');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tìm...';
    btn.disabled = true;
    modal.classList.remove('hidden');
    listContainer.innerHTML = `
        <div class="text-center py-10 text-gray-400">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500 mb-3"></i>
            <p>Đang nghiên cứu xu hướng...</p>
        </div>`;

    const prompt = `
    Role: Content Strategist.
    Context: A user is writing about "${keyword}" for brand "${brand}".
    Task: Suggest 10 highly engaging blog post topics related to this niche.
    
    Mix different types:
    - Educational (How-to, Guide)
    - Trends/News
    - Viral/Listicle
    - Commercial/Sales
    
    Output JSON Format:
    [
        { "title": "Catchy Title 1", "type": "Guide", "desc": "Short description of what to write" },
        ...
    ]
    `;

    const data = await callGemini(prompt);

    if(data && Array.isArray(data)) {
        listContainer.innerHTML = '';
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-white p-3 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group';
            div.innerHTML = `
                <div class="flex justify-between items-start mb-1">
                    <h4 class="font-bold text-sm text-gray-800 group-hover:text-indigo-600">${item.title}</h4>
                    <span class="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">${item.type}</span>
                </div>
                <p class="text-xs text-gray-500 leading-snug">${item.desc}</p>
                <div class="mt-2 text-right hidden group-hover:block">
                    <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Chọn viết bài này <i class="fa-solid fa-arrow-right ml-1"></i></span>
                </div>
            `;
            div.onclick = () => window.useTopic(item.title);
            listContainer.appendChild(div);
        });
    } else {
        listContainer.innerHTML = '<p class="text-center text-red-400">Không tìm thấy ý tưởng. Thử lại sau.</p>';
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

window.useTopic = function(title) {
    if(confirm(`Bạn có muốn dùng chủ đề "${title}" làm từ khóa chính cho bài viết mới không?`)) {
        document.getElementById('keywordInput').value = title;
        document.getElementById('topicModal').classList.add('hidden');
        
        // Reset editor để sẵn sàng viết
        document.getElementById('emptyState').classList.remove('hidden');
        document.getElementById('resultArea').classList.add('hidden');
        document.getElementById('seoTitleInput').value = '';
        document.getElementById('seoDescInput').value = '';
        document.getElementById('seoKeywordsInput').value = '';
        
        showToast("Đã cập nhật từ khóa mới!");
    }
}


// --- GEMINI AI LOGIC (TEXT) ---
async function callGemini(prompt, isRaw = false, useSearch = false) {
    try {
        const freshKey = (typeof CONFIG !== 'undefined') ? CONFIG.GEMINI_API_KEY : "";
        if (!freshKey || freshKey.length < 20) throw new Error("API Key Missing");

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
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
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
             console.error("API Response Error:", data);
             throw new Error("API trả về lỗi hoặc bị chặn.");
        }

        let text = data.candidates[0].content.parts[0].text;
        
        if (isRaw) return text;

        if (useSearch) {
            const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/); // Match {} or []
            if (jsonMatch) {
                text = jsonMatch[0];
            } else {
                // If expecting JSON but search returns text, try to return as simple object
                console.warn("Non-JSON search response, creating fallback object");
                return { content: text }; 
            }
        }

        return JSON.parse(text);

    } catch (e) { 
        console.error(e); 
        return null; 
    }
}

// --- GENERATE AI IMAGE (USING POLLINATIONS AI - RELIABLE) ---
async function generateAIImage(prompt) {
    return new Promise((resolve) => {
        const seed = Math.floor(Math.random() * 1000000);
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
        
        let contextText = "";
        let sibling = h2.nextElementSibling;
        let count = 0;
        
        while(sibling && count < 2) { 
            if(['H2','H3','H4'].includes(sibling.tagName)) break; 
            if(sibling.innerText && sibling.innerText.trim().length > 10) {
                contextText += sibling.innerText.trim() + " ";
            }
            sibling = sibling.nextElementSibling;
            count++;
        }

        if(!contextText) contextText = `${mainKeyword} - ${h2.innerText}`;

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

        const cleanH2 = h2.innerText.replace(/^([0-9]+|[IVX]+)[\.\)]\s*/i, '').trim();
        
        const promptRequest = `
            Act as an AI Image Prompt Expert.
            Context: Writing a blog post about "${mainKeyword}".
            Section Heading: "${cleanH2}".
            Section Content: "${contextText.substring(0, 500)}".
            
            Task: Create a highly detailed, photorealistic image generation prompt in English.
            Rules:
            - Visualize the main action/object.
            - Style: Cinematic lighting, 8k resolution, professional photography.
            - Keep it under 40 words.
            - Output ONLY the prompt string.
        `;
        
        let englishPrompt = await callGemini(promptRequest, true, false); 
        
        if (!englishPrompt || englishPrompt.length < 5) {
             englishPrompt = `${mainKeyword}, ${cleanH2}, photorealistic, high quality, 8k`;
        } else {
             englishPrompt = englishPrompt.replace(/```/g, '').trim();
        }

        console.log(`Generating image for "${cleanH2}" with prompt: ${englishPrompt}`);

        const imgUrl = await generateAIImage(englishPrompt);
        
        const targetContainer = document.getElementById(containerId);
        if (targetContainer) {
            if (imgUrl) {
                targetContainer.innerHTML = `<img src="${imgUrl}" alt="${cleanH2}" class="ai-generated-img">`;
            } else {
                targetContainer.remove();
            }
        }
        
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
    
    // Get required content
    const requiredContent = document.getElementById('requiredContentInput').value.trim();

    const userTitle = document.getElementById('seoTitleInput').value;
    const userDesc = document.getElementById('seoDescInput').value;
    const userKw = document.getElementById('seoKeywordsInput').value;

    document.getElementById('loadingState').classList.remove('hidden');
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const headerCard = document.getElementById('headerCard');
    headerCard.className = `rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group ${randomGrad}`;
    document.getElementById('aiImagePreview').classList.add('hidden'); 

    const loadingText = document.getElementById('loadingText');
    loadingText.innerText = "Đang nghiên cứu & viết nội dung bài viết (Ưu tiên hiển thị)...";

    const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // --- STEP 1: GENERATE ARTICLE BODY FIRST (FASTEST UX) ---
    // Instruction for Body
    const draftInstruct = ""; 
    let requiredContentInstruct = "";
    if (requiredContent) {
        requiredContentInstruct = `
        MANDATORY CONTENT REQUIREMENTS:
        The user explicitly requires the following points to be covered in the article:
        "${requiredContent}"
        Ensure these points are seamlessly integrated into relevant sections of the article.
        `;
    }

    // STYLE INSTRUCTION FROM SEO.TXT (Updated based on user request)
    const styleInstruction = `
    HTML FORMAT RULES (Strictly follow):
    - Return ONLY the HTML Body content (Start with H2, P, UL...). Do NOT wrap in <html> or <body>.
    - Wrap all content in a main div: <div style="font-family: Tahoma, sans-serif; font-size: 16px; line-height: 1.6; text-align: justify; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
    - Use Inline CSS for everything.
    - Brand Color: ${brandColor}
    - H2 Style: color: #2c3e50; font-size: 22px; line-height: 1.5; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #2c3e50; font-weight: bold;
    - H3 Style: color: #34495e; font-size: 18px; line-height: 1.5; margin-top: 25px; margin-bottom: 10px; font-weight: bold;
    - P Style: margin-bottom: 15px;
    - Images: <p style="text-align: center; margin-bottom: 20px;"><img style="max-width: 100%; width: 800px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" ...><br><em style="font-size: 14px; color: #555;">Caption</em></p>
    - Lists: <ul style="padding-left: 20px; margin-bottom: 20px;"> with <li style="margin-bottom: 8px;">
    - Highlight Box: <div style="background-color: #f7f9fa; border-left: 5px solid ${brandColor}; padding: 10px 15px; margin-bottom: 20px; border-radius: 5px;">
    - Tables: <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"> with <th style="padding: 12px; border: 1px solid #ddd; color: ${brandColor}; text-align: center; background-color: #e6f0ff;"> and <td style="padding: 10px; border: 1px solid #ddd;">
    - Strong/Bold: Use <strong style="color: ${brandColor};">text</strong> for important keywords.
    `;

    // 1. IMAGE GENERATION (MAIN) - Start parallel if possible, but simplicity first.
    let imgInstruct = '';
    if (currentSource === 'unsplash') {
        const keywordForUrl = sourceInput.trim() || keyword;
        imgInstruct = `Tự tìm ảnh Unsplash phù hợp. Chèn: <img src="https://source.unsplash.com/800x600/?${encodeURIComponent(keywordForUrl)}" alt="${keyword}">`;
    } else if (currentSource === 'pinterest' || currentSource === 'facebook') {
        const url = sourceInput.trim();
        if (url && url.startsWith('http')) imgInstruct = `Chèn ảnh từ URL người dùng: <img src="${url}" alt="${keyword}">`;
    } else if (currentSource === 'ai') {
        imgInstruct = `Tạo placeholder [Ảnh AI đang được vẽ...]`;
    }

    const articlePrompt = `
    Role: SEO Expert & Content Writer. 
    Current Date: ${today}.
    Language: ${currentLang === 'vi' ? 'Tiếng Việt' : 'English'}.
    Info: Keyword="${keyword}", Length=${length}, Location=${location}.
    Brand Info: Name="${brandName}", Color="${brandColor}", Footer="${footerInfo}".
    
    IMPORTANT: Use Google Search to find the LATEST information about "${keyword}" up to ${today}.
    
    ${requiredContentInstruct}
    ${styleInstruction}

    Output Format: JSON with a single key "content_html".
    {
        "content_html": "Full HTML article content starting with body text (H2, H3, P, UL). Do NOT include an H1 tag. Add footer info at the end inside a styled box. ${imgInstruct}"
    }
    `;

    // CALL API FOR BODY
    const articleData = await callGemini(articlePrompt, false, true);

    if(articleData && articleData.content_html) {
        // RENDER BODY IMMEDIATELY
        document.getElementById('resContentHtml').innerHTML = articleData.content_html;
        document.getElementById('resContentText').innerText = document.getElementById('resContentHtml').innerText;
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('resultArea').classList.remove('hidden');
        document.getElementById('loadingState').classList.add('hidden'); // Hide loading screen so user can read
        showToast("Nội dung bài viết đã xong! Đang tối ưu SEO...", false);
        
        // --- STEP 2: GENERATE SEO METADATA (BACKGROUND) ---
        // Generate Main AI Image if needed
        if (currentSource === 'ai') {
            const imagePrompt = sourceInput.trim() || `High quality photo representing ${keyword}. Professional, modern style, cinematic lighting.`;
            generateAIImage(imagePrompt).then(url => {
                if(url) {
                    document.getElementById('aiImageTag').src = url;
                    document.getElementById('aiImagePreview').classList.remove('hidden');
                    // Replace placeholder in body
                    const bodyHtml = document.getElementById('resContentHtml').innerHTML;
                    if(bodyHtml.includes("[Ảnh AI đang được vẽ...]")) {
                         document.getElementById('resContentHtml').innerHTML = bodyHtml.replace("[Ảnh AI đang được vẽ...]", `<img src="${url}" alt="${keyword}">`);
                    }
                }
            });
        }

        // Generate SEO Tags
        const seoPrompt = `
        Role: SEO Specialist.
        Context: An article about "${keyword}" has been written for brand "${brandName}".
        Task: Generate optimized SEO metadata.
        
        Output JSON Format:
        {
            "title": "Optimized SEO Title (<70 chars)",
            "description": "Optimized Meta Desc (<160 chars)",
            "keywords": "Optimized list of keywords separated by commas",
            "snippet": "Featured Snippet (40-50 words) defining the keyword",
            "suggested_topics": ["List of 3-4 related sub-topics or H2 headings that are NOT in the content yet but would add value"]
        }
        `;
        
        // Call without search for speed
        callGemini(seoPrompt, false, false).then(seoData => {
            if (seoData) {
                document.getElementById('resTitle').innerText = seoData.title;
                document.getElementById('resDesc').innerText = seoData.description;
                document.getElementById('resSnippet').innerText = seoData.snippet;
                document.getElementById('seoTitleInput').value = seoData.title;
                document.getElementById('seoDescInput').value = seoData.description;
                document.getElementById('seoKeywordsInput').value = seoData.keywords || "";
                renderSuggestions(seoData.suggested_topics);
                runAudit(keyword, seoData.title, seoData.description, articleData.content_html);
                showToast("Đã tối ưu hoàn tất!");
            }
        });

        // --- STEP 3: H2 IMAGES (BACKGROUND) ---
        if(isAutoH2Image) {
            processH2Images(keyword);
        }

    } else {
        alert("Lỗi kết nối AI khi viết nội dung. Vui lòng thử lại!");
        document.getElementById('loadingState').classList.add('hidden');
    }
}	
