// Internationalization support for English and Indonesian
const translations = {
    'en': {
        // Navigation
        'nav_home': 'Home',
        'nav_products': 'Products',
        'nav_about': 'About',
        'nav_contact': 'Contact',
        
        // Home page
        'hero_title': 'Premium Coffee Seeds',
        'hero_subtitle': 'Grow your own specialty coffee with our carefully selected seeds',
        'shop_now': 'Shop Now',
        'featured_products': 'Featured Products',
        'our_story': 'Our Story',
        'about_summary': 'At BeanOrigins, we believe everyone deserves to experience the joy of growing their own coffee. Our seeds are sourced directly from the world\'s finest coffee regions.',
        'learn_more': 'Learn More',
        'testimonials_title': 'What Our Customers Say',
        
        // Product related
        'add_to_cart': 'Add to Cart',
        'from': 'from',
        
        // Cart
        'your_cart': 'Your Cart',
        'total': 'Total',
        'checkout': 'Checkout',
        'cart_empty': 'Your cart is empty.',
        'added_to_cart': 'added to cart!',
        
        // Footer
        'quick_links': 'Quick Links',
        'contact': 'Contact',
        'follow_us': 'Follow Us',
        'copyright': '© 2025 BeanOrigins. All rights reserved.',
        
        // Theme
        'dark_mode': 'Dark Mode',
        'light_mode': 'Light Mode'
    },
    'id': {
        // Navigation
        'nav_home': 'Beranda',
        'nav_products': 'Produk',
        'nav_about': 'Tentang Kami',
        'nav_contact': 'Kontak',
        
        // Home page
        'hero_title': 'Biji Kopi Premium',
        'hero_subtitle': 'Tumbuhkan kopi spesialitas Anda sendiri dengan biji pilihan kami',
        'shop_now': 'Beli Sekarang',
        'featured_products': 'Produk Unggulan',
        'our_story': 'Kisah Kami',
        'about_summary': 'Di BeanOrigins, kami percaya semua orang berhak mengalami kegembiraan menanam kopi mereka sendiri. Biji kami bersumber langsung dari wilayah kopi terbaik di dunia.',
        'learn_more': 'Pelajari Lebih Lanjut',
        'testimonials_title': 'Apa Kata Pelanggan Kami',
        
        // Product related
        'add_to_cart': 'Tambahkan ke Keranjang',
        'from': 'dari',
        
        // Cart
        'your_cart': 'Keranjang Belanja Anda',
        'total': 'Total',
        'checkout': 'Pembayaran',
        'cart_empty': 'Keranjang belanja Anda kosong.',
        'added_to_cart': 'ditambahkan ke keranjang!',
        
        // Footer
        'quick_links': 'Tautan Cepat',
        'contact': 'Kontak',
        'follow_us': 'Ikuti Kami',
        'copyright': '© 2025 BeanOrigins. Seluruh hak cipta dilindungi.',
        
        // Theme
        'dark_mode': 'Mode Gelap',
        'light_mode': 'Mode Terang'
    }
};

// Default language
let currentLanguage = 'en';

// Initialize language selection
function initializeLanguage() {
    // Try to load from localStorage
    const savedLanguage = localStorage.getItem('language');
    
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
            currentLanguage = browserLang;
        }
    }
    
    // Update language selector
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.value = currentLanguage;
    }
    
    // Apply translations
    applyTranslations();
}

// Switch language
function switchLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        applyTranslations();
    }
}

// Apply translations to the page
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[currentLanguage][key]) {
            // Check if this is an attribute translation
            if (element.hasAttribute('data-i18n-attr')) {
                const attr = element.getAttribute('data-i18n-attr');
                element.setAttribute(attr, translations[currentLanguage][key]);
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
    
    // Update document title if needed
    if (document.title && document.title === 'BeanOrigins | Premium Coffee Seeds') {
        if (currentLanguage === 'id') {
            document.title = 'BeanOrigins | Biji Kopi Premium';
        } else {
            document.title = 'BeanOrigins | Premium Coffee Seeds';
        }
    }
}

// Add language selector to the navbar
function createLanguageSelector() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        const langContainer = document.createElement('div');
        langContainer.className = 'language-selector-container';
        
        const langSelector = document.createElement('select');
        langSelector.id = 'language-selector';
        langSelector.className = 'language-selector';
        
        // Add options
        const enOption = document.createElement('option');
        enOption.value = 'en';
        enOption.textContent = '🇺🇸 English';
        
        const idOption = document.createElement('option');
        idOption.value = 'id';
        idOption.textContent = '🇮🇩 Indonesia';
        
        langSelector.appendChild(enOption);
        langSelector.appendChild(idOption);
        
        // Set current language
        langSelector.value = currentLanguage;
        
        // Event listener
        langSelector.addEventListener('change', function() {
            switchLanguage(this.value);
        });
        
        langContainer.appendChild(langSelector);
        
        // Insert before cart icon
        const cartIcon = navbar.querySelector('.cart-icon');
        navbar.insertBefore(langContainer, cartIcon);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createLanguageSelector();
    initializeLanguage();
});

// Expose functions globally
window.i18n = {
    switchLanguage,
    currentLanguage: () => currentLanguage
};