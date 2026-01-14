// Basic script for interactivity

document.addEventListener('DOMContentLoaded', () => {
    console.log('Artify loaded.');

    /* 
     * 3D Infinite Scroll with Concave Effect (Restored)
     */
    const track = document.querySelector('.explore-track');
    const container = document.querySelector('.explore-carousel-container');

    // Check if elements exist to avoid errors on other pages
    if (track && container) {
        let cards = Array.from(document.querySelectorAll('.explore-card'));

        // Duplicate the content a few times to fill screen + buffer for infinite loop
        const originalLength = cards.length;
        if (cards.length > 0) {
            // Clone first set to end
            cards.forEach(card => {
                let clone = card.cloneNode(true);
                track.appendChild(clone);
            });
            // And maybe one more set for safety
            cards.forEach(card => {
                let clone = card.cloneNode(true);
                track.appendChild(clone);
            });
        }

        // Re-query all cards (original + clones)
        const allCards = document.querySelectorAll('.explore-card');
        const cardWidth = 250;
        const gap = 30;
        const itemFullWidth = cardWidth + gap;
        const totalWidth = itemFullWidth * allCards.length;

        let scrollPos = 0;
        const speed = 1; // Pixels per frame

        function animate() {
            scrollPos -= speed;

            // Seamless Loop Logic: 
            const segmentWidth = itemFullWidth * originalLength;
            if (scrollPos <= -segmentWidth) {
                scrollPos += segmentWidth;
            }

            // Apply global track translation
            track.style.transform = `translateX(${scrollPos}px)`;

            // Calculate 3D Transforms for "Concave" effect
            const centerScreen = window.innerWidth / 2;

            allCards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;

                // Distance from center
                const dist = cardCenter - centerScreen;

                // Concave / Panoramic logic:
                const val = dist / centerScreen; // -1 to 1 approx
                const angle = val * 40; // Max rotation +/- 40deg

                card.style.transform = `rotateY(${-angle}deg) scale(${1 - Math.abs(val) * 0.1})`;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    /* 
     * Dynamic Product Detail Page Logic
     */
    const productTitleEl = document.getElementById('product-title');

    // Check if we are on the detail page by looking for the unique element
    if (productTitleEl) {
        console.log('Product Detail Page Detected');

        const productData = {
            hasami_mug: {
                title: 'Hasami Porcelain Mug',
                price: '₦25,000',
                img: 'assets/image/product_img/hasami_porcelain_mug.jpeg',
                desc: 'This mug features clean lines, a smooth matte finish, and durable porcelain that\'s both microwave and dishwasher safe. Its balanced form makes it perfect for everyday use.',
                category: 'Ceramics',
                subcategory: 'Porcelain Mugs',
                rating: 4.9,
                reviews: 288,
                size: '100ml',
                colors: [
                    { name: 'Matte Brown', hex: '#5D4037' },
                    { name: 'Sand', hex: '#A1887F' },
                    { name: 'Onyx', hex: '#212121' }
                ],
                gallery: [
                    'assets/image/product_img/hasami_porcelain_mug.jpeg',
                    'assets/image/product_img/hasami_bead_style.jpeg',
                    'assets/image/product_img/minimal_ceramic_plates.jpeg'
                ]
            },
            ceramic_plates: {
                title: 'Minimal Ceramic Plates',
                price: '₦35,000',
                img: 'assets/image/product_img/minimal_ceramic_plates.jpeg',
                desc: 'Handcrafted ceramic plates with a minimalist design. Perfect for modern dining setups and durable enough for daily use.',
                category: 'Ceramics',
                subcategory: 'Dinnerware',
                rating: 4.8,
                reviews: 196,
                size: '4-piece set',
                colors: [
                    { name: 'Ivory', hex: '#f5f1e8' },
                    { name: 'Charcoal Rim', hex: '#6d6a63' }
                ],
                gallery: [
                    'assets/image/product_img/minimal_ceramic_plates.jpeg',
                    'assets/image/product_img/mixed_clay_dining_set.jpeg',
                    'assets/image/product_img/hasami_porcelain_mug.jpeg'
                ]
            },
            clay_set: {
                title: 'Mixed Clay Dining Set',
                price: '₦45,000',
                img: 'assets/image/product_img/mixed_clay_dining_set.jpeg',
                desc: 'A complete dining set made from mixed locally sourced clay. Each piece is unique, featuring earthy tones and natural textures.',
                category: 'Ceramics',
                subcategory: 'Dining Sets',
                rating: 4.7,
                reviews: 310,
                size: '12-piece set',
                colors: [
                    { name: 'Earth Blend', hex: '#9c6b3d' },
                    { name: 'Natural Clay', hex: '#c49a6c' }
                ],
                gallery: [
                    'assets/image/product_img/mixed_clay_dining_set.jpeg',
                    'assets/image/product_img/minimal_ceramic_plates.jpeg',
                    'assets/image/product_img/stiff_woven_basket.jpeg'
                ]
            },
            basket: {
                title: 'Stiff Woven Basket',
                price: '₦25,000',
                img: 'assets/image/product_img/stiff_woven_basket.jpeg',
                desc: 'Expertly woven from stiff natural fibers, this basket is both a storage solution and a decorative art piece for your home.',
                category: 'Handwoven',
                subcategory: 'Storage',
                rating: 4.6,
                reviews: 142,
                size: 'Large 16"',
                colors: [
                    { name: 'Natural Fiber', hex: '#c2a574' },
                    { name: 'Deep Brown', hex: '#5d3a1a' }
                ],
                gallery: [
                    'assets/image/product_img/stiff_woven_basket.jpeg',
                    'assets/image/product_img/hasami_bead_style.jpeg',
                    'assets/image/product_img/mixed_clay_dining_set.jpeg'
                ]
            },
            leather_bag: {
                title: 'Zara Leather Bag',
                price: '₦25,000',
                img: 'assets/image/product_img/zara_leather_bag.jpeg',
                desc: 'Crafted from premium leather, this bag combines style and functionality with ample space and a rugged yet elegant finish.',
                category: 'Leatherwork',
                subcategory: 'Bags',
                rating: 4.5,
                reviews: 205,
                size: '15" width',
                colors: [
                    { name: 'Chestnut', hex: '#6b3f24' },
                    { name: 'Espresso', hex: '#3b2416' }
                ],
                gallery: [
                    'assets/image/product_img/zara_leather_bag.jpeg',
                    'assets/image/product_img/hasami_bead_style.jpeg',
                    'assets/image/product_img/stiff_woven_basket.jpeg'
                ]
            },
            bead_style: {
                title: 'Hasami Bead Style',
                price: '₦20,000',
                img: 'assets/image/product_img/hasami_bead_style.jpeg',
                desc: 'Intricate beadwork meets ceramic art. This unique piece showcases traditional beading techniques applied to modern forms.',
                category: 'Ceramics',
                subcategory: 'Decor',
                rating: 4.4,
                reviews: 120,
                size: 'One size',
                colors: [
                    { name: 'Terra', hex: '#9a4a28' },
                    { name: 'Ocean Bead', hex: '#2c5d63' }
                ],
                gallery: [
                    'assets/image/product_img/hasami_bead_style.jpeg',
                    'assets/image/product_img/hasami_porcelain_mug.jpeg',
                    'assets/image/product_img/mixed_clay_dining_set.jpeg'
                ]
            }
        };

        // Parse URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        console.log('Product ID:', productId);

        if (!productId || !productData[productId]) {
            console.warn('Product ID not found or invalid:', productId);
            window.location.href = 'index.html';
            return;
        }

        const data = productData[productId];

        // Update document title for better UX/SEO
        document.title = `${data.title} - Artify`;

        // Update basic fields
        productTitleEl.textContent = data.title;
        const priceEl = document.getElementById('product-price');
        if (priceEl) priceEl.textContent = data.price;

        const imgEl = document.getElementById('main-image');
        if (imgEl) {
            imgEl.src = data.img;
            imgEl.alt = data.title;
        }

        const descEl = document.getElementById('product-description');
        if (descEl) descEl.textContent = data.desc;

        const breadcrumbEl = document.getElementById('breadcrumb-current');
        if (breadcrumbEl) breadcrumbEl.textContent = data.title;

        const breadcrumbCategory = document.getElementById('breadcrumb-category');
        if (breadcrumbCategory) breadcrumbCategory.textContent = data.category || 'Category';
        const breadcrumbSubcategory = document.getElementById('breadcrumb-subcategory');
        if (breadcrumbSubcategory) breadcrumbSubcategory.textContent = data.subcategory || 'Subcategory';

        const ratingStarsEl = document.getElementById('rating-stars');
        if (ratingStarsEl) ratingStarsEl.textContent = `★ ${data.rating.toFixed(1)}`;

        const ratingCountEl = document.getElementById('rating-count');
        if (ratingCountEl) ratingCountEl.textContent = `${data.reviews} reviews`;

        const sizeEl = document.getElementById('product-size');
        if (sizeEl) sizeEl.textContent = data.size || '';

        // Render gallery thumbnails
        const galleryThumbs = document.getElementById('gallery-thumbs');
        if (galleryThumbs) {
            galleryThumbs.innerHTML = '';
            const galleryImages = Array.isArray(data.gallery) && data.gallery.length ? data.gallery : [data.img];
            galleryImages.forEach((src, idx) => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.alt = `${data.title} view ${idx + 1}`;
                thumb.className = 'related-thumb';
                thumb.style.opacity = idx === 0 ? '1' : '0.7';
                thumb.addEventListener('click', () => {
                    if (imgEl) {
                        imgEl.src = src;
                        imgEl.alt = data.title;
                    }
                    galleryThumbs.querySelectorAll('.related-thumb').forEach(t => t.style.opacity = '0.7');
                    thumb.style.opacity = '1';
                });
                galleryThumbs.appendChild(thumb);
            });
        }

        // Render colors
        const colorLabel = document.getElementById('color-label');
        const colorOptions = document.getElementById('color-options');
        if (colorOptions && Array.isArray(data.colors)) {
            colorOptions.innerHTML = '';
            data.colors.forEach((color, idx) => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                if (idx === 0) swatch.classList.add('active');
                swatch.style.backgroundColor = color.hex;
                swatch.title = color.name;
                swatch.setAttribute('aria-label', color.name);
                swatch.addEventListener('click', () => {
                    colorOptions.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('active'));
                    swatch.classList.add('active');
                    if (colorLabel) colorLabel.textContent = `Color: ${color.name}`;
                });
                colorOptions.appendChild(swatch);
            });
            if (colorLabel && data.colors[0]) {
                colorLabel.textContent = `Color: ${data.colors[0].name}`;
            }
        }

        // Render sizes
        const sizeOptions = document.getElementById('size-options');
        if (sizeOptions) {
            sizeOptions.innerHTML = '';
            const sizes = Array.isArray(data.size) ? data.size : [data.size];
            sizes.forEach((size, idx) => {
                const btn = document.createElement('button');
                btn.className = 'size-pill';
                btn.textContent = size;
                if (idx === 0) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    sizeOptions.querySelectorAll('.size-pill').forEach(el => el.classList.remove('active'));
                    btn.classList.add('active');
                    const sizeTextEl = document.getElementById('product-size');
                    if (sizeTextEl) sizeTextEl.textContent = size;
                });
                sizeOptions.appendChild(btn);
            });
        }
    }
});
