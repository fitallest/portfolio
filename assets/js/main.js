
/*
  JAVASCRIPT CHUNG (main.js)
  Bao gồm logic menu mobile, Header injection, Carousel, Typewriter, 3D Tilt, Konami Code.
*/

const headerHtmlContent = `
<header class="bg-white/90 sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex-shrink-0 flex items-center">
                <a href="index.html" class="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-300"> 
                    Fi.tallest 
                </a>
            </div>
            
            <div class="hidden md:flex md:items-center md:space-x-6">
                <a href="index.html#about" data-page="index.html" data-anchor="#about" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Giới thiệu <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="dichvu.html" data-page="index.html" data-anchor="#services" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Dịch vụ <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="projects.html" data-page="projects.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Dự án <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="hosting.html" data-page="hosting.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Hosting <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="domain.html" data-page="domain.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Tên miền <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="ai-design.html" data-page="ai-design.html" class="nav-link text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:text-indigo-600 transition duration-150 relative group flex items-center">
                    <i data-lucide="sparkles" class="w-4 h-4 mr-1 text-pink-500"></i> AI Design
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="SEO.html" data-page="SEO.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group flex items-center">
                    <i data-lucide="pen-tool" class="w-4 h-4 mr-1"></i> SEO Tool
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="bao-gia.html" data-page="bao-gia.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Báo Giá <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span></a>
                <a href="index.html#contact" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-transform hover:scale-105">Liên hệ ngay</a>
            </div>
            
            <div class="-mr-2 flex items-center md:hidden">
                <button type="button" id="mobile-menu-button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                    <i data-lucide="menu" class="h-6 w-6"></i>
                </button>
            </div>
        </div>
    </nav>

    <div class="hidden md:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="index.html#about" data-page="index.html" data-anchor="#about" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Giới thiệu</a>
            <a href="index.html#services" data-page="index.html" data-anchor="#services" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dịch vụ</a>
            <a href="projects.html" data-page="projects.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dự án</a>
            <a href="hosting.html" data-page="hosting.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Hosting</a>
            <a href="domain.html" data-page="domain.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Tên miền</a>
            <a href="ai-design.html" data-page="ai-design.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-bold text-purple-600 hover:text-purple-800 hover:bg-purple-50">✨ AI Design</a>
            <a href="SEO.html" data-page="SEO.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">SEO Tool</a>
            <a href="bao-gia.html" data-page="bao-gia.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Báo Giá</a>
            <a href="index.html#contact" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Liên hệ ngay</a>
        </div>
    </div>
</header>
`;

function injectHeaderAndSetCurrentLink() {
    const body = document.body;
    if (!body) return;
    const existingHeader = document.querySelector('header');
    // Nếu trang SEO.html đã có header riêng bên trong (dòng "Gemini Flash Ready"), ta chỉ inject Nav chính ở trên cùng
    // Nếu header cũ là Nav chính (nhận biết qua class hoặc ID), ta thay thế.
    // Để an toàn, ta sẽ inject div chứa header vào đầu body.
    
    // Kiểm tra xem đã có Nav chính chưa
    const existingNav = document.querySelector('nav .flex.justify-between'); 
    if (existingNav) return; // Đã có menu, không inject lại

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerHtmlContent;
    body.insertBefore(tempDiv.firstElementChild, body.firstChild);

    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    const currentAnchor = window.location.hash;

    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        const linkPage = link.getAttribute('data-page') || link.getAttribute('href').split('#')[0].split('/').pop();
        const linkAnchor = link.getAttribute('data-anchor') || null;
        let isActive = false;

        if (currentPage === linkPage && currentPage !== 'index.html') isActive = true;
        else if (currentPage === 'index.html' && linkPage === 'index.html') {
            if (linkAnchor && linkAnchor === currentAnchor) isActive = true;
            else if (!linkAnchor && !currentAnchor && link.textContent.includes('Giới thiệu')) isActive = true;
        }

        if (isActive) {
            if (link.classList.contains('nav-link')) {
                link.classList.remove('text-gray-500', 'font-medium');
                if (!link.textContent.includes('AI Design') && !link.textContent.includes('SEO Tool')) link.classList.add('text-indigo-600', 'font-semibold');
                const indicator = link.querySelector('span');
                if(indicator) indicator.classList.add('w-full');
            } else {
                link.classList.remove('text-gray-700', 'hover:bg-gray-50');
                link.classList.add('text-indigo-700', 'bg-indigo-50');
            }
        }
    });

    // Mobile menu logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if(icon) {
                const isHidden = mobileMenu.classList.contains('hidden');
                icon.setAttribute('data-lucide', isHidden ? 'menu' : 'x');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }
}

function initProjectsCarousel() {
    const container = document.getElementById('projects-carousel-container');
    if (!container || typeof projectsData === 'undefined') return;

    let currentIndex = 0;
    let autoSlideInterval;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const ITEMS_PER_VIEW = isMobile ? 1 : 3; // Default 3 items desktop
    const ITEMS_PER_SLIDE = isMobile ? 1 : 1;
    const AUTO_SLIDE_DELAY = 4000;

    const escapeHtml = (u) => u ? u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : '';

    const renderProjects = () => {
        const grid = container.querySelector('.projects-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        // Logic Carousel Loop
        for (let i = 0; i < ITEMS_PER_VIEW; i++) {
            const projectIndex = (currentIndex + i) % projectsData.length;
            const project = projectsData[projectIndex];
            const card = document.createElement('div');
            // Sử dụng class project-card để kế thừa CSS
            card.innerHTML = `
                <div class="project-card opacity-0 h-full">
                    <div class="group rounded-xl shadow-lg overflow-hidden h-full bg-white border border-gray-100 hover:border-indigo-200 transition-all duration-300 flex flex-col">
                        <a href="${escapeHtml(project.link) || '#'}" class="block relative overflow-hidden h-48 shrink-0">
                            <img src="${escapeHtml(project.imageUrl) || 'https://placehold.co/600x400'}" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" loading="lazy">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <div class="p-6 flex-1 flex flex-col">
                            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md w-fit">${escapeHtml(project.category)}</span>
                            <h3 class="mt-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">${escapeHtml(project.title)}</h3>
                            <p class="mt-2 text-base text-gray-600 line-clamp-3 flex-1">${escapeHtml(project.description)}</p>
                        </div>
                    </div>
                </div>`;
            grid.appendChild(card.firstElementChild);
            // Animation cascade
            setTimeout(() => {
                const inserted = grid.children[i];
                if(inserted) inserted.classList.replace('opacity-0', 'opacity-100');
            }, i * 50);
        }
    };

    const slide = (dir = 'next') => {
        const grid = container.querySelector('.projects-grid');
        grid.classList.add(dir === 'next' ? 'slide-left' : 'slide-right');
        setTimeout(() => {
            currentIndex = dir === 'next' ? (currentIndex + ITEMS_PER_SLIDE) % projectsData.length : (currentIndex - ITEMS_PER_SLIDE + projectsData.length) % projectsData.length;
            // Fix negative index js modulo bug
            if (currentIndex < 0) currentIndex += projectsData.length;
            
            grid.classList.remove('slide-left', 'slide-right');
            renderProjects();
        }, 500); // Match CSS duration
    };

    const start = () => { stop(); autoSlideInterval = setInterval(() => slide('next'), AUTO_SLIDE_DELAY); };
    const stop = () => clearInterval(autoSlideInterval);

    container.querySelector('.carousel-btn-prev')?.addEventListener('click', () => { stop(); slide('prev'); start(); });
    container.querySelector('.carousel-btn-next')?.addEventListener('click', () => { stop(); slide('next'); start(); });
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    renderProjects();
    start();
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const counters = entry.target.querySelectorAll('.counter-value');
                counters.forEach(c => {
                    const target = +c.getAttribute('data-target');
                    let current = 0;
                    const inc = target / 100; // Tốc độ
                    const update = () => {
                        current += inc;
                        if (current < target) { 
                            c.innerText = Math.ceil(current).toLocaleString(); 
                            requestAnimationFrame(update); 
                        } else {
                            c.innerText = target.toLocaleString();
                        }
                    };
                    update();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('section, .reveal-on-scroll').forEach(t => {
        t.classList.add('reveal-on-scroll');
        observer.observe(t);
    });
}

// --- TYPEWRITER EFFECT ---
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const phrases = ["Tinh Tế & Đột Phá", "Sáng Tạo & Khác Biệt", "Uy Tín & Bảo Mật", "Tốc Độ & Hiệu Quả"];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    const type = () => {
        const current = phrases[phraseIndex];
        el.textContent = current.substring(0, charIndex + (isDeleting ? -1 : 1));
        charIndex += isDeleting ? -1 : 1;
        if (!isDeleting && charIndex === current.length) setTimeout(() => isDeleting = true, 2000);
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
        setTimeout(type, isDeleting ? 50 : 100);
    };
    type();
}

// --- 3D TILT EFFECT ---
function initTiltEffect() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)');
    });
}

// --- KONAMI CODE ---
function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                if (typeof confetti === 'function') confetti({ particleCount: 300, spread: 180, origin: { y: 0.6 } });
                alert("🎉 Bạn đã tìm thấy Trứng Phục Sinh! Mã giảm giá 10%: KONAMI10");
                index = 0;
            }
        } else index = 0;
    });
}

// --- HERO PARALLAX EFFECT ---
function initHeroParallax() {
    const heroSection = document.getElementById('hero');
    const heroVideo = heroSection ? heroSection.querySelector('video') : null;

    if (!heroSection || !heroVideo) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                // Only apply if hero is partially in view (plus buffer) to save performance
                if (scrollPosition <= heroSection.offsetHeight + 100) {
                    // Rate of 0.4 means the background moves at 40% speed of scroll
                    const translateY = scrollPosition * 0.4;
                    // Preserve existing transform (-50%, -50%) which centers the video
                    heroVideo.style.transform = `translate3d(-50%, calc(-50% + ${translateY}px), 0)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectHeaderAndSetCurrentLink();
    initProjectsCarousel();
    initScrollAnimations();
    initTypewriter();
    initTiltEffect();
    initKonamiCode();
    initHeroParallax();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
