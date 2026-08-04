/* ========================================
   PREMIUM MENU UI - JavaScript
   ======================================== */

(function() {
    'use strict';

    // ========== Premium Hero Slider ==========
    function initPremiumHeroSlider() {
        const slider = document.getElementById('premiumHeroSlider');
        if (!slider) return;

        const dots = document.getElementById('premiumHeroDots');
        const slides = slider.querySelectorAll('.premium-hero-slide');
        
        if (slides.length === 0) return;

        const dotElements = dots ? dots.querySelectorAll('.premium-hero-dot') : [];
        let currentSlide = 0;
        let autoSlideInterval;

        function goToSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dotElements.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        function nextSlide() {
            if (slides.length <= 1) return;
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function startAutoSlide() {
            if (slides.length <= 1) return;
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Click on dots (only if dots exist)
        if (dotElements.length > 0) {
            dotElements.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    stopAutoSlide();
                    goToSlide(index);
                    startAutoSlide();
                });
            });
        }

        // Touch swipe support (only if multiple slides)
        if (slides.length > 1) {
            let touchStartX = 0;
            let touchEndX = 0;

            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoSlide();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (diff > swipeThreshold) {
                    // Swipe left - next slide
                    const next = (currentSlide + 1) % slides.length;
                    goToSlide(next);
                } else if (diff < -swipeThreshold) {
                    // Swipe right - previous slide
                    const prev = (currentSlide - 1 + slides.length) % slides.length;
                    goToSlide(prev);
                }
            }
        }

        // Start auto-slide only if multiple slides
        startAutoSlide();
    }

    // ========== Premium Header Scroll Effect ==========
    function initPremiumHeaderScroll() {
        const header = document.getElementById('premiumHeader');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========== Premium Category Rendering ==========
    function renderPremiumCategories(categories) {
        const container = document.getElementById('premiumCategoryScroll');
        if (!container) return;

        container.innerHTML = '';

        // Professional SVG icons for categories (Lucide-style)
        const categoryIcons = {
            'Hot Drinks': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
            'Cold Drinks': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10h-3V7a3 3 0 0 0-6 0v3H5"/><path d="M5 10a5 5 0 0 0 5 5v4a3 3 0 0 0 6 0v-4a5 5 0 0 0 5-5"/></svg>',
            'Desserts': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
            'Food': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
            'Coffee': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
            'Tea': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
            'Juice': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10h-3V7a3 3 0 0 0-6 0v3H5"/><path d="M5 10a5 5 0 0 0 5 5v4a3 3 0 0 0 6 0v-4a5 5 0 0 0 5-5"/></svg>',
            'Sandwich': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M3 11V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M12 11V3"/></svg>',
            'Burger': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M3 11V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M12 11V3"/><path d="M5 7h14"/></svg>',
            'Pizza': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16.5 4a2.121 2.121 0 0 1 2.12 2.12l.66 3.3a2 2 0 0 1-1.66 2.3L12 12.5l-5.62 1.22a2 2 0 0 1-1.66-2.3l.66-3.3A2.121 2.121 0 0 1 7.5 4h9Z"/><path d="M12 12.5V22"/></svg>',
            'Cake': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>',
            'Ice Cream': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8"/><path d="M5 11a7 7 0 0 1 14 0"/><path d="M12 11V3"/></svg>',
            'Snacks': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M3 11V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M12 11V3"/></svg>',
            'Breakfast': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8"/><path d="M3 11V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M12 11V3"/><path d="M8 7h8"/></svg>',
            'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
        };

        categories.forEach((category, index) => {
            const card = document.createElement('div');
            card.className = 'premium-category-card';
            card.dataset.category = category.id || category.name;
            card.style.animationDelay = `${index * 0.1}s`;

            const iconSvg = categoryIcons[category.name] || categoryIcons.default;

            card.innerHTML = `
                <div class="premium-category-icon">${iconSvg}</div>
                <span class="premium-category-name">${category.name}</span>
            `;

            card.addEventListener('click', () => {
                // Remove active from all cards
                container.querySelectorAll('.premium-category-card').forEach(c => {
                    c.classList.remove('active');
                });
                // Add active to clicked card
                card.classList.add('active');
                // Filter products by category with animation
                filterPremiumProducts(category.id || category.name);
            });

            container.appendChild(card);
        });

        // Activate first category
        if (categories.length > 0) {
            container.querySelector('.premium-category-card').classList.add('active');
        }
    }

    // ========== Show/Hide Skeleton Loading ==========
    function showSkeletonLoading() {
        const container = document.getElementById('premiumProductsGrid');
        if (!container) return;

        container.innerHTML = `
            <div class="premium-skeleton-card">
                <div class="premium-skeleton premium-skeleton-image"></div>
                <div class="premium-skeleton-content">
                    <div class="premium-skeleton premium-skeleton-title"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                </div>
            </div>
            <div class="premium-skeleton-card">
                <div class="premium-skeleton premium-skeleton-image"></div>
                <div class="premium-skeleton-content">
                    <div class="premium-skeleton premium-skeleton-title"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                </div>
            </div>
            <div class="premium-skeleton-card">
                <div class="premium-skeleton premium-skeleton-image"></div>
                <div class="premium-skeleton-content">
                    <div class="premium-skeleton premium-skeleton-title"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                </div>
            </div>
            <div class="premium-skeleton-card">
                <div class="premium-skeleton premium-skeleton-image"></div>
                <div class="premium-skeleton-content">
                    <div class="premium-skeleton premium-skeleton-title"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                    <div class="premium-skeleton premium-skeleton-text"></div>
                </div>
            </div>
        `;
    }

    function hideSkeletonLoading() {
        // Skeleton will be replaced by actual products when renderPremiumProducts is called
    }

    // ========== Premium Product Rendering ==========
    function renderPremiumProducts(items) {
        const container = document.getElementById('premiumProductsGrid');
        if (!container) return;

        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--premium-text-muted);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px; opacity: 0.5;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    <p style="font-size: 1.1rem;">No items found</p>
                </div>
            `;
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'premium-product-card premium-ripple';
            card.style.animationDelay = `${index * 0.05}s`;

            const isPopular = item.popular || item.featured;
            const isNew = item.new || (item.created_at && new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
            const price = item.price || 0;
            const currency = item.currency || 'IQD';
            const imageUrl = item.image || 'images/placeholder-food.jpg';

            let badgesHtml = '';
            if (isPopular) {
                badgesHtml += `<span class="premium-card-badge popular">Popular</span>`;
            }
            if (isNew) {
                badgesHtml += `<span class="premium-card-badge new" style="${isPopular ? 'top: 48px;' : ''}">New</span>`;
            }

            card.innerHTML = `
                <div class="premium-card-image-wrapper">
                    <img class="premium-card-image" src="${imageUrl}" alt="${item.name_en || item.name}" loading="lazy" onerror="this.src='images/placeholder-food.jpg'">
                    ${badgesHtml}
                    <button class="premium-card-fav" data-item-id="${item.id}" aria-label="Add to favorites">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="premium-card-content">
                    <h3 class="premium-card-title">${item.name_ku || item.name_ar || item.name_en || item.name}</h3>
                    <p class="premium-card-description">${item.description_ku || item.description_ar || item.description_en || item.description || ''}</p>
                    <div class="premium-card-footer">
                        <div>
                            <span class="premium-card-price">${price.toLocaleString()}</span>
                            <span class="premium-card-currency">${currency}</span>
                        </div>
                        <button class="premium-card-add" data-item-id="${item.id}" aria-label="Add to cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Add to cart functionality
            const addBtn = card.querySelector('.premium-card-add');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(item);
            });

            // Favorite functionality
            const favBtn = card.querySelector('.premium-card-fav');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(item.id, favBtn);
            });

            // Open detail on card click
            card.addEventListener('click', () => {
                openItemDetail(item);
            });

            container.appendChild(card);
        });
    }

    // ========== Filter Products by Category ==========
    function filterPremiumProducts(categoryId) {
        const container = document.getElementById('premiumProductsGrid');
        if (!container) return;

        // Add fade-out animation
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Get all items from the existing menu-data system
        if (window.menuItems && window.menuItems.length > 0) {
            const filtered = window.menuItems.filter(item => {
                const itemCategory = item.category;
                return itemCategory === categoryId || itemCategory === categoryId.toLowerCase();
            });

            // Wait for fade-out, then render and fade-in
            setTimeout(() => {
                renderPremiumProducts(filtered);
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    // ========== Add to Cart ==========
    function addToCart(item) {
        // Use existing cart functionality if available
        if (window.addToCart && typeof window.addToCart === 'function') {
            window.addToCart(item);
        } else {
            // Fallback: simple cart implementation
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingIndex = cart.findIndex(c => c.id === item.id);
            
            if (existingIndex >= 0) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name_ku || item.name_ar || item.name_en || item.name,
                    price: item.price,
                    quantity: 1,
                    image: item.image
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updatePremiumCartBadge();
            
            // Show feedback
            showAddToCartFeedback();
        }
    }

    // ========== Update Cart Badge ==========
    function updatePremiumCartBadge() {
        const badge = document.getElementById('premiumCartBadge');
        if (!badge) return;

        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }

    // ========== Show Add to Cart Feedback ==========
    function showAddToCartFeedback() {
        const cartBtn = document.getElementById('premiumCartBtn');
        if (!cartBtn) return;

        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = '';
        }, 200);
    }

    // ========== Toggle Favorite ==========
    function toggleFavorite(itemId, btn) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(itemId);
        
        if (index >= 0) {
            favorites.splice(index, 1);
            btn.classList.remove('active');
        } else {
            favorites.push(itemId);
            btn.classList.add('active');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // ========== Open Item Detail ==========
    function openItemDetail(item) {
        // Use existing detail overlay if available
        if (window.openItemDetail && typeof window.openItemDetail === 'function') {
            window.openItemDetail(item);
        }
    }

    // ========== Premium Search ==========
    function initPremiumSearch() {
        const searchInput = document.getElementById('premiumSearchInput');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (window.menuItems && window.menuItems.length > 0) {
                if (query === '') {
                    // Show all items
                    renderPremiumProducts(window.menuItems);
                } else {
                    // Filter by search query
                    const filtered = window.menuItems.filter(item => {
                        const name = (item.name_ku || item.name_ar || item.name_en || item.name || '').toLowerCase();
                        const desc = (item.description_ku || item.description_ar || item.description_en || item.description || '').toLowerCase();
                        return name.includes(query) || desc.includes(query);
                    });
                    renderPremiumProducts(filtered);
                }
            }
        });
    }

    // ========== Premium Language Button ==========
    function initPremiumLangButton() {
        const langBtn = document.getElementById('premiumLangBtn');
        if (!langBtn) return;

        langBtn.addEventListener('click', () => {
            // Toggle language dropdown or cycle through languages
            const currentLang = localStorage.getItem('selectedLang') || 'ku';
            const langs = ['ku', 'ar', 'en'];
            const currentIndex = langs.indexOf(currentLang);
            const nextLang = langs[(currentIndex + 1) % langs.length];
            
            // Update language
            if (window.setLanguage && typeof window.setLanguage === 'function') {
                window.setLanguage(nextLang);
            } else {
                localStorage.setItem('selectedLang', nextLang);
                location.reload();
            }
        });
    }

    // ========== Premium Cart Button ==========
    function initPremiumCartButton() {
        const cartBtn = document.getElementById('premiumCartBtn');
        if (!cartBtn) return;

        cartBtn.addEventListener('click', () => {
            // Open cart overlay
            const cartOverlay = document.getElementById('cartOverlay');
            if (cartOverlay) {
                cartOverlay.classList.add('active');
            }
        });
    }

    // ========== Initialize Premium UI ==========
    function initPremiumUI() {
        // Initialize components
        initPremiumHeroSlider();
        initPremiumHeaderScroll();
        initPremiumSearch();
        initPremiumLangButton();
        initPremiumCartButton();
        updatePremiumCartBadge();

        // Show skeleton loading initially
        showSkeletonLoading();

        // Wait for menu data to load
        const checkMenuData = setInterval(() => {
            if (window.menuItems && window.menuItems.length > 0) {
                clearInterval(checkMenuData);
                
                // Get unique categories
                const categories = [];
                const categoryMap = new Map();
                
                window.menuItems.forEach(item => {
                    const catName = item.category;
                    if (catName && !categoryMap.has(catName)) {
                        categoryMap.set(catName, true);
                        categories.push({
                            id: catName,
                            name: catName
                        });
                    }
                });

                // Render categories and products (this will hide skeleton)
                renderPremiumCategories(categories);
                renderPremiumProducts(window.menuItems);
            }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkMenuData);
        }, 10000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPremiumUI);
    } else {
        initPremiumUI();
    }

    // Expose functions globally
    window.PremiumUI = {
        renderCategories: renderPremiumCategories,
        renderProducts: renderPremiumProducts,
        updateCartBadge: updatePremiumCartBadge
    };

})();
