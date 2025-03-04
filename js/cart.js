// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Add to cart function
function addToCart(productId) {
    const { products } = window.appData;
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartUI();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    if (!cartItemsContainer || !cartTotalPrice || !cartCountElement) return;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    // Render cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.3s, transform 0.3s'
    });
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) return;
    
    // In a real app, this would redirect to a checkout page or show a checkout form
    alert('Proceeding to checkout...');
    // For demo purposes, just clear the cart
    cart = [];
    saveCart();
    updateCartUI();
}

// Initialize cart
function initCart() {
    updateCartUI();
    
    // Add event listener to checkout button
    checkoutBtn?.addEventListener('click', checkout);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCart);