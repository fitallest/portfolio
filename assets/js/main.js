

	/*
	  JAVASCRIPT CHUNG (main.js)
	  Bao gồm logic menu mobile, kích hoạt icon, và logic chèn Header/Navbar (dùng cho MỌI trang).
	  Hợp nhất thêm logic Carousel cho trang chủ.
	*/

	// CHÚ Ý: ĐÂY LÀ NỘI DUNG MỚI ĐƯỢC DÙNG ĐỂ TỰ ĐỘNG CHÈN HEADER
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
					<a href="index.html#about" data-page="index.html" data-anchor="#about" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Giới thiệu
						<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="index.html#services" data-page="index.html" data-anchor="#services" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Dịch vụ
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="projects.html" data-page="projects.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Dự án
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="hosting.html" data-page="hosting.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Hosting
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="domain.html" data-page="domain.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Tên miền
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
                    <a href="ai-design.html" data-page="ai-design.html" class="nav-link text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:text-indigo-600 transition duration-150 relative group flex items-center">
                        <i data-lucide="sparkles" class="w-4 h-4 mr-1 text-pink-500"></i> AI Design
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="bao-gia.html" data-page="bao-gia.html" class="nav-link text-gray-500 font-medium hover:text-indigo-600 transition duration-150 relative group">Báo Giá
						 <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
					<a href="index.html#contact" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105">
						Liên hệ ngay
					</a>
				</div>
				
				<div class="-mr-2 flex items-center md:hidden">
					<button type="button" id="mobile-menu-button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
						<span class="sr-only">Mở menu</span>
						<i data-lucide="menu" class="h-6 w-6"></i>
					</button>
				</div>
			</div>
		</nav>

		<div class="hidden md:hidden" id="mobile-menu">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<a href="index.html#about" data-page="index.html" data-anchor="#about" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Giới thiệu</a>
				<a href="index.html#services" data-page="index.html" data-anchor="#services" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Dịch vụ</a>
				<a href="projects.html" data-page="projects.html" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Dự án</a>
				<a href="hosting.html" data-page="hosting.html" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Hosting</a>
				<a href="domain.html" data-page="domain.html" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Tên miền</a>
                <a href="ai-design.html" data-page="ai-design.html" class="nav-link-mobile text-purple-600 hover:bg-purple-50 hover:text-purple-800 block px-3 py-2 rounded-md text-base font-bold transition-colors">✨ AI Design</a>
				<a href="bao-gia.html" data-page="bao-gia.html" class="nav-link-mobile text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors">Báo Giá</a>
				<a href="index.html#contact" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">Liên hệ ngay</a>
			</div>
		</div>
	</header>
	`;

	function injectHeaderAndSetCurrentLink() {
		const body = document.body;
		if (!body) return;

		// 1. Chèn Header vào đầu Body (hoặc thay thế nếu đã tồn tại)
		const existingHeader = document.querySelector('header');
		if (existingHeader) {
			existingHeader.remove(); // Xóa header cũ
		}
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = headerHtmlContent;
		const newHeader = tempDiv.firstElementChild;
		body.insertBefore(newHeader, body.firstChild);


		// 2. Xác định trang hiện tại (lấy tên file)
		const currentPath = window.location.pathname;
		const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
		const currentAnchor = window.location.hash;

		// 3. Set Active cho Desktop và Mobile
		const links = document.querySelectorAll('.nav-link, .nav-link-mobile');
		links.forEach(link => {
			const linkPage = link.getAttribute('data-page') || link.getAttribute('href').split('#')[0].split('/').pop();
			const linkAnchor = link.getAttribute('data-anchor') || null;

			let isActive = false;

			// Logic cho trang con (projects.html, hosting.html, domain.html, bao-gia.html, ai-design.html)
			if (currentPage === linkPage && currentPage !== 'index.html') {
				isActive = true;
			} 
			// Logic cho trang chủ (index.html) và link anchor trên trang chủ
			else if (currentPage === 'index.html' && linkPage === 'index.html') {
				 // Link anchor chỉ active khi anchor trùng khớp hoặc không có anchor
				if (linkAnchor && linkAnchor === currentAnchor) {
					 isActive = true;
				} else if (!linkAnchor && !currentAnchor && link.textContent.includes('Giới thiệu')) {
					// Mặc định active Giới thiệu nếu đang ở trang chủ không có anchor
					 isActive = true;
				}
			}

			// Áp dụng class Active
			if (isActive) {
				if (link.classList.contains('nav-link')) {
					// Desktop
					link.classList.remove('text-gray-500', 'font-medium');
                    // Giữ màu gradient đặc biệt cho AI Design nếu active
                    if (!link.textContent.includes('AI Design')) {
					    link.classList.add('text-indigo-600', 'font-semibold');
                    }
					// Add visual indicator for active link
					const indicator = link.querySelector('span');
					if(indicator) indicator.classList.add('w-full');
				} else if (link.classList.contains('nav-link-mobile')) {
					 // Mobile
					link.classList.remove('text-gray-700', 'hover:bg-gray-50', 'hover:text-gray-900');
					link.classList.add('text-indigo-700', 'bg-indigo-50');
				}
			}
		});

		// 4. Gọi lại logic menu mobile (từ phần 2 trong main.js gốc)
		const mobileMenuButton = document.getElementById('mobile-menu-button');
		const mobileMenu = document.getElementById('mobile-menu');
	  
		if (mobileMenuButton && mobileMenu) {
			const mobileMenuIcon = mobileMenuButton.querySelector('i');

			mobileMenuButton.addEventListener('click', () => {
				const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
				mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
				mobileMenu.classList.toggle('hidden');
				
				if (mobileMenuIcon) {
					mobileMenuIcon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
					// Gọi lại lucide.createIcons() sau khi thay đổi data-lucide
					if (typeof lucide !== 'undefined') {
						lucide.createIcons();
					}
				}
			});

			// Đóng menu mobile khi click vào link
			document.querySelectorAll('#mobile-menu a').forEach(link => {
				link.addEventListener('click', () => {
					const currentPage = window.location.pathname.split('/').pop() || 'index.html';
					const linkTarget = link.getAttribute('href');
					
					if (!linkTarget) return; 

					const linkPage = linkTarget.split('#')[0].split('/').pop();
					const isAnchorLinkOnCurrentPage = linkTarget.startsWith('#') && linkPage === currentPage;

					// Chỉ đóng menu khi chuyển đến trang khác hoặc là anchor trên cùng trang
					if (isAnchorLinkOnCurrentPage || (linkPage && linkPage !== currentPage && linkPage !== "") ) {
						if (mobileMenuButton && mobileMenu) {
							mobileMenuButton.setAttribute('aria-expanded', 'false');
							mobileMenu.classList.add('hidden');
							if (mobileMenuIcon) {
								mobileMenuIcon.setAttribute('data-lucide', 'menu');
								if (typeof lucide !== 'undefined') {
									lucide.createIcons();
								}
							}
						}
					}
				});
			});
		}
	}

	// --- LOGIC CAROUSEL DỰ ÁN (Hợp nhất từ projects-carousel.js) ---
	function initProjectsCarousel() {
		const projectsContainer = document.getElementById('projects-carousel-container');
		
		if (!projectsContainer || typeof projectsData === 'undefined' || !Array.isArray(projectsData)) {
			return;
		}

		let currentIndex = 0;
		let autoSlideInterval;
		
		// === ĐIỀU CHỈNH LOGIC CAROUSEL CHO MOBILE ===
		const isMobile = window.matchMedia("(max-width: 768px)").matches; 
		
		// Trên Desktop: 3 cột x 2 hàng = 6 dự án.
		// Trên Mobile (1 cột): Chỉ hiển thị 1 dự án để card lớn.
		const ITEMS_PER_VIEW = isMobile ? 1 : 6; 
		const ITEMS_PER_SLIDE = isMobile ? 1 : 2; 
		// ===========================================
		
		const AUTO_SLIDE_DELAY = 4000; // 2 giây
		let projectCards = []; // Cache các card đã tạo

		// Hàm escape HTML
		const escapeHtml = (unsafe) => {
			if (!unsafe) return '';
			return unsafe
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
		};

		// Hàm tạo HTML card dự án
		const createProjectCard = (project) => {
			return `
				<div class="project-card opacity-0">
					<div class="group rounded-xl shadow-lg overflow-hidden h-full bg-white border border-gray-100 hover:border-indigo-200 transition-all duration-300">
						<a href="${escapeHtml(project.link) || '#'}" class="block relative overflow-hidden">
							<img src="${escapeHtml(project.imageUrl) || 'https://placehold.co/600x400/e0e7ff/4f46e5?text=No+Image'}" 
								 alt="${escapeHtml(project.title)}" 
								 class="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
								 onerror="this.onerror=null; this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';"
								 loading="lazy">
							 <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</a>
						<div class="p-6">
							<span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md">${escapeHtml(project.category)}</span>
							<h3 class="mt-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">${escapeHtml(project.title)}</h3>
							<p class="mt-2 text-base text-gray-600 line-clamp-3">${escapeHtml(project.description)}</p>
						</div>
					</div>
				</div>
			`;
		};

		// Hàm render dự án
		const renderProjects = () => {
			const grid = projectsContainer.querySelector('.projects-grid');
			if (!grid) return;

			grid.innerHTML = '';
			
			// Lấy số dự án cần hiển thị
			for (let i = 0; i < ITEMS_PER_VIEW; i++) {
				const projectIndex = (currentIndex + i) % projectsData.length;
				const project = projectsData[projectIndex];
				
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = createProjectCard(project);
				const card = tempDiv.firstElementChild;
				
				grid.appendChild(card);
				
				// Trigger fade in với delay
				setTimeout(() => {
					card.classList.remove('opacity-0');
					card.classList.add('opacity-100');
				}, i * 50);
			}
		};

		// Hàm chuyển slide
		const slideProjects = (direction = 'next') => {
			const grid = projectsContainer.querySelector('.projects-grid');
			if (!grid) return;

			// Thêm class animation
			grid.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');

			setTimeout(() => {
				if (direction === 'next') {
					currentIndex = (currentIndex + ITEMS_PER_SLIDE) % projectsData.length;
				} else {
					currentIndex = (currentIndex - ITEMS_PER_SLIDE + projectsData.length) % projectsData.length;
				}
				
				grid.classList.remove('slide-left', 'slide-right');
				renderProjects();
			}, 500);
		};

		// Hàm bắt đầu auto slide
		const startAutoSlide = () => {
			stopAutoSlide();
			autoSlideInterval = setInterval(() => {
				slideProjects('next');
			}, AUTO_SLIDE_DELAY);
		};

		// Hàm dừng auto slide
		const stopAutoSlide = () => {
			if (autoSlideInterval) {
				clearInterval(autoSlideInterval);
			}
		};

		// Xử lý nút prev
		const prevBtn = projectsContainer.querySelector('.carousel-btn-prev');
		if (prevBtn) {
			prevBtn.addEventListener('click', () => {
				stopAutoSlide();
				slideProjects('prev');
				startAutoSlide();
			});
		}

		// Xử lý nút next
		const nextBtn = projectsContainer.querySelector('.carousel-btn-next');
		if (nextBtn) {
			nextBtn.addEventListener('click', () => {
				stopAutoSlide();
				slideProjects('next');
				startAutoSlide();
			});
		}

		// Dừng auto slide khi hover
		projectsContainer.addEventListener('mouseenter', stopAutoSlide);
		projectsContainer.addEventListener('mouseleave', startAutoSlide);

		// Khởi tạo
		renderProjects();
		startAutoSlide();
	}

	// --- SCROLL ANIMATION LOGIC ---
	function initScrollAnimations() {
		const observerOptions = {
			threshold: 0.1, // Trigger when 10% of element is visible
			rootMargin: "0px 0px -50px 0px"
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					
					// Trigger counter animation if it's the stats section
					const counters = entry.target.querySelectorAll('.counter-value');
					if (counters.length > 0) {
						counters.forEach(counter => {
							 const target = +counter.getAttribute('data-target');
							 const duration = 2000; // 2 seconds
							 const increment = target / (duration / 16); // 60fps
							 
							 let current = 0;
							 const updateCounter = () => {
								 current += increment;
								 if (current < target) {
									 counter.innerText = Math.ceil(current).toLocaleString();
									 requestAnimationFrame(updateCounter);
								 } else {
									 counter.innerText = target.toLocaleString();
								 }
							 };
							 updateCounter();
						});
					}
					
					observer.unobserve(entry.target); // Only animate once
				}
			});
		}, observerOptions);

		// Target specific elements to animate
		const targets = document.querySelectorAll('section, .project-card, .benefit-card, .photo-card, .glass-card, .service-card, .price-table-container, .reveal-on-scroll');
		
		targets.forEach(target => {
			target.classList.add('reveal-on-scroll'); // Add base class
			observer.observe(target);
		});
	}


	document.addEventListener('DOMContentLoaded', () => {
		
		// 1. Chèn Header và Set Active Link
		injectHeaderAndSetCurrentLink(); 

		// 2. Khởi tạo Carousel Dự án (nếu có trên trang)
		initProjectsCarousel();

		// 3. Khởi tạo Scroll Animations
		initScrollAnimations();

		// 4. Kích hoạt icon Lucide
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		} else {
			console.error("Lucide library not loaded before main.js");
		}
	});
