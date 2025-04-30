/**
 * Obsługa filtrowania galerii zdjęć
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Pobranie wartości filtra
            const filter = this.getAttribute('data-filter');

            // Usunięcie aktywnej klasy ze wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Dodanie aktywnej klasy do klikniętego przycisku
            this.classList.add('active');

            // Filtrowanie elementów galerii
            galleryItems.forEach(item => {
                if (filter === 'wszystkie' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Obsługa mobilnego menu
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.querySelector('.overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // Funkcja do zamykania menu
    function closeMenu() {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Otwieranie menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Blokada przewijania strony
    });

    // Zamykanie menu przez przycisk
    closeMenuBtn.addEventListener('click', closeMenu);
    
    // Zamykanie menu przez kliknięcie w tło
    overlay.addEventListener('click', closeMenu);
    
    // Zamykanie menu po kliknięciu w link nawigacyjny
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * Inicjalizacja wszystkich funkcji po załadowaniu strony
 */
document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initMobileMenu();

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-lightbox');
    const nextBtn = document.querySelector('.next-lightbox');
    
    let currentImageIndex = 0;
    let images = [];
    let captions = [];

    // Collect all gallery images and captions
    document.querySelectorAll('[data-lightbox="gallery"]').forEach((link, index) => {
        images.push(link.getAttribute('href'));
        captions.push(link.getAttribute('data-title'));
    });

    // Open lightbox
    document.querySelectorAll('[data-lightbox="gallery"]').forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            currentImageIndex = index;
            updateLightbox();
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Previous image
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    });

    // Next image
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                updateLightbox();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                updateLightbox();
            }
        }
    });

    function updateLightbox() {
        lightboxImg.src = images[currentImageIndex];
        lightboxCaption.textContent = captions[currentImageIndex];
    }
});