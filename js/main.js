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
    // Inicjalizacja filtrowania galerii
    initGalleryFilter();
    
    // Inicjalizacja mobilnego menu
    initMobileMenu();
    
    // Inicjalizacja lightboxa
    initLightbox();
});

// Funkcja inicjalizacji lightboxa
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevLightbox = document.querySelector('.prev-lightbox');
    const nextLightbox = document.querySelector('.next-lightbox');

    // Zmienne do przechowywania aktualnego zdjęcia
    let currentImageIndex = 0;
    let images = [];

    // Funkcja do otwierania lightboxa
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Funkcja do zamykania lightboxa
    function closeLightboxHandler() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Funkcja do aktualizacji zawartości lightboxa
    function updateLightbox() {
        const currentImage = images[currentImageIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.title;
    }

    // Inicjalizacja zdjęć w galerii
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item a');
        images = Array.from(galleryItems).map(item => ({
            src: item.href,
            alt: item.querySelector('img').alt,
            title: item.getAttribute('data-title')
        }));

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });
    }

    // Event listeners
    closeLightbox.addEventListener('click', closeLightboxHandler);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    });

    prevLightbox.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    });

    nextLightbox.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    });

    // Obsługa klawiszy
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display !== 'flex') return;
        
        switch(e.key) {
            case 'Escape':
                closeLightboxHandler();
                break;
            case 'ArrowLeft':
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                updateLightbox();
                break;
            case 'ArrowRight':
                currentImageIndex = (currentImageIndex + 1) % images.length;
                updateLightbox();
                break;
        }
    });

    // Inicjalizacja galerii
    initGallery();
}

// Zabezpieczenia zdjęć
document.addEventListener('contextmenu', function(e) {
    // Blokada prawego przycisku myszy na całej stronie
    e.preventDefault();
});

// Blokada przeciągania
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('gallery-item')) {
        e.preventDefault();
    }
});

// Blokada zaznaczania
document.addEventListener('selectstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('gallery-item')) {
        e.preventDefault();
    }
});

// Blokada skrótów klawiszowych
document.addEventListener('keydown', function(e) {
    // Blokada Ctrl+S, Ctrl+P, PrintScreen
    if ((e.ctrlKey && e.key === 's') || 
        (e.ctrlKey && e.key === 'p') || 
        e.key === 'PrintScreen') {
        e.preventDefault();
    }
});

// Dodatkowe zabezpieczenie dla lightboxa
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target.id === 'lightbox-img' || e.target.classList.contains('gallery-item')) {
        e.preventDefault();
    }
});

// Dodatkowe zabezpieczenie dla galerii
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
});