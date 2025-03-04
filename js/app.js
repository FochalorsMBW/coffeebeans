// Product data - in a real application, this would come from a server
const products = [
    {
        id: 1,
        name: "Ethiopian Yirgacheffe",
        origin: "Ethiopia",
        price: 24.99,
        description: "Bright, fruity notes with a floral aroma. These seeds produce plants that thrive in high-altitude environments.",
        featured: true,
        image: "./assets/coffee.png"
    },
    {
        id: 2,
        name: "Colombian Supremo",
        origin: "Colombia",
        price: 19.99,
        description: "Well-balanced with caramel sweetness and a nutty finish. Adaptable to various growing conditions.",
        featured: true,
        image: "./assets/coffee.png"
    },
    {
        id: 3,
        name: "Jamaican Blue Mountain",
        origin: "Jamaica",
        price: 39.99,
        description: "Smooth, clean taste with mild sweetness and minimal bitterness. Grows best in rich, volcanic soil.",
        featured: true,
        image: "./assets/coffee.png"
    },
    {
        id: 4,
        name: "Sumatra Mandheling",
        origin: "Indonesia",
        price: 22.99,
        description: "Full-bodied with earthy, herbal notes and low acidity. Resilient plants suitable for humid climates.",
        featured: true,
        image: "./assets/coffee.png"
    }
];

// Testimonial data
const testimonials = [
    {
        text: "I've been growing my own coffee for 3 years now, and DexterBeans seeds consistently produce the best plants. Their Ethiopian Yirgacheffe has an amazing yield!",
        author: "Hanief Wayoodie",
        location: "Lubay, PDG"
    },
    {
        text: "I basically don't understand about coffee. But the Sumatera Mandheling seeds were easy to grow even for a beginner like me.",
        author: "Yovan Trikolo Darmo",
        location: "Taploe, PDG"
    },
    {
        text: "Coffee are my passion also my hobby. I'm so glad to grow my own coffee. Papua Nuiginea seeds have a rich and cultural flavour.",
        author: "Agil Pridenae",
        location: "Kerinchi, JMB"
    },
    {
        text: "As a coffee enthusiast, growing my own beans has been a dream come true. The Colombian Supremo seeds were easy to grow even for a beginner like me.",
        author: "Moehammad Hanief",
        location: "TanGad, SJJ"
    },
    {
        text: "The quality of these coffee seeds is outstanding. My Jamaican Blue Mountain plants are thriving and the beans have such complex flavors.",
        author: "M Farly Rozack",
        location: "Washington, PYK"
    }
];

// DOM elements
const featuredProductsContainer = document.getElementById('featured-products-container');
const testimonialContainer = document.getElementById('testimonial-container');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');

// Mobile menu toggle
hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X
    const lines = hamburger.querySelectorAll('.line');
    lines[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
    lines[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    lines[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Cart modal toggle
cartIcon?.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart?.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close cart when clicking outside
cartModal?.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Render featured products
function renderFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="origin">${product.origin}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        featuredProductsContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Render testimonials
function renderTestimonials() {
    if (!testimonialContainer) return;
    
    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.classList.add('testimonial-card');
        
        testimonialCard.innerHTML = `
            <p class="testimonial-text">${testimonial.text}</p>
            <p class="testimonial-author">${testimonial.author}</p>
            <p class="testimonial-location">${testimonial.location}</p>
        `;
        
        testimonialContainer.appendChild(testimonialCard);
    });
}

// Initialize the page
function init() {
    renderFeaturedProducts();
    renderTestimonials();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// For use in other scripts
window.appData = {
    products: products
};