document.addEventListener('DOMContentLoaded', function() {
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            // For this example, we'll just log it and show a success message
            console.log({
                name,
                email,
                subject,
                message
            });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Change icon
            const icon = item.querySelector('.faq-toggle i');
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real application, you would send this to a server
            console.log('Newsletter subscription:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        });
    }
    
    // Map placeholder handling
    const mapContainer = document.querySelector('.placeholder-map');
    
    if (mapContainer) {
        // In a real application, initialize a map here
        // For example, with Google Maps API:
        
        /*
        function initMap() {
            const storeLocation = { lat: 47.6062, lng: -122.3321 }; // Seattle coordinates
            const map = new google.maps.Map(document.querySelector('.map-container'), {
                zoom: 14,
                center: storeLocation,
            });
            const marker = new google.maps.Marker({
                position: storeLocation,
                map: map,
                title: 'DexterBeans Store'
            });
        }
        */
    }
});