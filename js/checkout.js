// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartModal = document.getElementById('cart-modal');
    const body = document.body;
    
    // Event listeners
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', initiateCheckout);
    }
    
    // Checkout process
    function initiateCheckout() {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Create checkout overlay
        createCheckoutOverlay(cart);
    }
    
    function createCheckoutOverlay(cart) {
        // Close cart modal first
        cartModal.classList.remove('active');
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'checkout-overlay';
        
        // Create checkout form
        const checkoutContent = `
            <div class="checkout-container">
                <div class="checkout-header">
                    <h2>Checkout</h2>
                    <button class="close-checkout">&times;</button>
                </div>
                
                <div class="checkout-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-items">
                        ${cart.map(item => `
                            <div class="summary-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <form id="checkout-form">
                    <div class="form-section">
                        <h3>Personal Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" required>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Shipping Address</h3>
                        <div class="form-group">
                            <label for="address">Street Address</label>
                            <input type="text" id="address" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City</label>
                                <input type="text" id="city" required>
                            </div>
                            <div class="form-group">
                                <label for="state">State/Province</label>
                                <input type="text" id="state" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="zipCode">Zip/Postal Code</label>
                                <input type="text" id="zipCode" required>
                            </div>
                            <div class="form-group">
                                <label for="country">Country</label>
                                <select id="country" required>
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Payment Information</h3>
                        <div class="form-group">
                            <label for="cardName">Name on Card</label>
                            <input type="text" id="cardName" required>
                        </div>
                        <div class="form-group">
                            <label for="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" required placeholder="XXXX XXXX XXXX XXXX">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiry">Expiry Date</label>
                                <input type="text" id="expiry" required placeholder="MM/YY">
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" required placeholder="XXX">
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn place-order-btn">Place Order</button>
                </form>
            </div>
        `;
        
        overlay.innerHTML = checkoutContent;
        body.appendChild(overlay);
        body.style.overflow = 'hidden';
        
        // Add event listeners
        const closeBtn = overlay.querySelector('.close-checkout');
        closeBtn.addEventListener('click', () => {
            body.removeChild(overlay);
            body.style.overflow = '';
        });
        
        const form = overlay.querySelector('#checkout-form');
        form.addEventListener('submit', submitOrder);
    }
    
    function submitOrder(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const formEntries = Object.fromEntries(formData.entries());
        
        // Simulate API call with a timeout
        showLoadingOverlay();
        
        setTimeout(() => {
            // Clear cart after successful order
            localStorage.removeItem('cart');
            
            // Remove checkout overlay
            const checkoutOverlay = document.querySelector('.checkout-overlay');
            if (checkoutOverlay) {
                body.removeChild(checkoutOverlay);
            }
            
            // Remove loading overlay
            hideLoadingOverlay();
            
            // Show success message
            showOrderConfirmation();
            
            // Update cart UI
            updateCartUI();
        }, 2000);
    }
    
    function showLoadingOverlay() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing your order...</p>
        `;
        
        body.appendChild(loadingOverlay);
    }
    
    function hideLoadingOverlay() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            body.removeChild(loadingOverlay);
        }
    }
    
    function showOrderConfirmation() {
        const confirmationOverlay = document.createElement('div');
        confirmationOverlay.className = 'confirmation-overlay';
        
        confirmationOverlay.innerHTML = `
            <div class="confirmation-container">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. A confirmation email has been sent to your inbox.</p>
                <p>Order #: ${generateOrderNumber()}</p>
                <button class="btn continue-shopping-btn">Continue Shopping</button>
            </div>
        `;
        
        body.appendChild(confirmationOverlay);
        
        // Add event listener to continue shopping button
        const continueBtn = confirmationOverlay.querySelector('.continue-shopping-btn');
        continueBtn.addEventListener('click', () => {
            body.removeChild(confirmationOverlay);
            body.style.overflow = '';
            window.location.href = 'index.html';
        });
    }
    
    function generateOrderNumber() {
        return 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
});

