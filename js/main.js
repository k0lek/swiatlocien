/**
 * Obsługa filtrowania galerii zdjęć
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const filterItems = (filter) => {
        galleryItems.forEach(item => {
            item.style.display = (filter === 'wszystkie' || item.getAttribute('data-category') === filter) 
                ? 'block' 
                : 'none';
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterItems(filter);
        });
    });
}

/**
 * Obsługa filtrowania sekcji Inspiracje
 */
function initInspiracjeFilter() {
    console.log('Inicjalizacja filtrowania inspiracji...');
    
    const filterButtons = document.querySelectorAll('.inspiracje-filter-btn');
    const inspiracjeItems = document.querySelectorAll('.inspiracje-item');
    
    console.log('Znaleziono przycisków:', filterButtons.length);
    console.log('Znaleziono elementów:', inspiracjeItems.length);
    
    const filterItems = (filter) => {
        console.log('Filtrowanie:', filter);
        inspiracjeItems.forEach(item => {
            const category = item.getAttribute('data-category');
            console.log('Element:', item, 'Kategoria:', category);
            const isVisible = filter === 'wszystkie-inspiracje' || category === filter;
            item.style.display = isVisible ? 'block' : 'none';
            item.setAttribute('aria-hidden', !isVisible);
        });
    };

    // Ustawienie początkowego stanu
    filterButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        console.log('Przycisk:', btn, 'Filtr:', filter);
        if (filter === 'wszystkie-inspiracje') {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    // Pokazanie wszystkich elementów na początku
    inspiracjeItems.forEach(item => {
        item.style.display = 'block';
        item.setAttribute('aria-hidden', 'false');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            console.log('Kliknięto przycisk:', filter);

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            filterItems(filter);
        });

        // Obsługa klawiatury
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
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
    
    // Inicjalizacja filtrowania inspiracji
    initInspiracjeFilter();
    
    // Inicjalizacja mobilnego menu
    initMobileMenu();
    
    // Inicjalizacja lightboxa
    initLightbox();
});

// Funkcja inicjalizacji lightboxa
function initLightbox() {
    // Cache elementów DOM
    const elements = {
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxCaption: document.getElementById('lightbox-caption'),
        closeLightbox: document.querySelector('.close-lightbox'),
        prevLightbox: document.querySelector('.prev-lightbox'),
        nextLightbox: document.querySelector('.next-lightbox')
    };

    // Stan lightboxa
    const state = {
        currentImageIndex: 0,
        images: [],
        currentGroup: ''
    };

    // Funkcje pomocnicze
    const updateLightbox = () => {
        const currentImage = state.images[state.currentImageIndex];
        elements.lightboxImg.src = currentImage.src;
        elements.lightboxImg.alt = currentImage.alt;
        elements.lightboxCaption.textContent = currentImage.title;
    };

    const openLightbox = (index, group) => {
        state.currentImageIndex = index;
        state.currentGroup = group;
        updateLightbox();
        elements.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        elements.lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    const navigateImage = (direction) => {
        state.currentImageIndex = (state.currentImageIndex + direction + state.images.length) % state.images.length;
        updateLightbox();
    };

    // Obsługa klawiszy z debounce
    const handleKeyDown = (e) => {
        if (elements.lightbox.style.display !== 'flex') return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateImage(-1);
                break;
            case 'ArrowRight':
                navigateImage(1);
                break;
        }
    };

    // Inicjalizacja galerii
    const initGallery = () => {
        const galleryItems = document.querySelectorAll('.gallery-item a, .inspiracje-item a');
        
        galleryItems.forEach(item => {
            const group = item.getAttribute('data-lightbox');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Filtrujemy zdjęcia tylko z tej samej grupy
                state.images = Array.from(document.querySelectorAll(`[data-lightbox="${group}"]`)).map(item => ({
                    src: item.href,
                    alt: item.querySelector('img').alt,
                    title: item.getAttribute('data-title')
                }));
                
                const groupIndex = Array.from(document.querySelectorAll(`[data-lightbox="${group}"]`)).indexOf(item);
                openLightbox(groupIndex, group);
            });
        });
    };

    // Event listeners
    elements.closeLightbox.addEventListener('click', closeLightbox);
    elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) closeLightbox();
    });
    elements.prevLightbox.addEventListener('click', () => navigateImage(-1));
    elements.nextLightbox.addEventListener('click', () => navigateImage(1));
    document.addEventListener('keydown', handleKeyDown);

    // Inicjalizacja
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