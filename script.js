// Cache the phone number
let phoneNumber = null;

async function getPhoneNumber() {
  if (phoneNumber) return phoneNumber;
  
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    phoneNumber = config.phone;
    return phoneNumber;
  } catch (error) {
    console.error('Failed to load phone number:', error);
    throw new Error('Could not load contact information');
  }
}

// Mobile hamburger menu
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Simple client-side routing
function initializeRouting() {
    window.addEventListener('popstate', function(event) {
        handleRoute(window.location.pathname);
    });
    handleRoute(window.location.pathname);
}

function handleRoute(path) {
    switch(path) {
        case '/form-success':
            showFormSuccessPage();
            break;
        default:
            showMainPage();
            break;
    }
}

function showMainPage() {
    const sections = ['home', 'about', 'rooms', 'reviews', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    });
    
    const successPage = document.getElementById('form-success-page');
    if (successPage) {
        successPage.style.display = 'none';
    }
}

function showFormSuccessPage() {
    const sections = ['home', 'about', 'rooms', 'reviews', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    let successPage = document.getElementById('form-success-page');
    if (!successPage) {
        createFormSuccessPage();
    } else {
        successPage.style.display = 'block';
    }
    
    trackConversion();
}

function createFormSuccessPage() {
    const successPage = document.createElement('section');
    successPage.id = 'form-success-page';
    successPage.className = 'form-success-page';
    successPage.innerHTML = `
        <div class="container">
            <div class="success-content">
                <div class="success-icon">✅</div>
                <h1>Booking Request Ready!</h1>
                <p>We've opened WhatsApp for you to send your reservation confirmation to Hotel Bhavani Udupi.</p>
                <p>Just hit send to complete your request. Thank you for choosing us!</p>
                <div class="success-actions">
                    <button onclick="navigateToHome()" class="back-btn">Back to Home</button>
                    <a href="tel:08202526980" class="call-btn">Call Us Now</a>
                </div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .form-success-page {
            height: 100vh;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 2rem 0;
        }
        .success-content {
            text-align: center;
            max-width: 600px;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .success-icon { font-size: 4rem; margin-bottom: 2rem; }
        .success-content h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #d4af37;
        }
        .success-content p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 1rem; opacity: 0.9; }
        .success-actions { margin-top: 3rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .back-btn, .call-btn {
            padding: 15px 30px; border: none; border-radius: 50px;
            font-size: 1rem; font-weight: 600; cursor: pointer;
            transition: all 0.3s ease; text-decoration: none;
            display: inline-block; text-transform: uppercase; letter-spacing: 1px;
        }
        .back-btn { background: linear-gradient(45deg, #d4af37, #f1c40f); color: white; }
        .call-btn { background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; }
        .back-btn:hover, .call-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); }
        @media (max-width: 768px) {
            .success-content h1 { font-size: 2rem; }
            .success-actions { flex-direction: column; align-items: center; }
            .back-btn, .call-btn { width: 100%; max-width: 250px; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(successPage);
}

function navigateToHome() {
    history.pushState(null, '', '/');
    handleRoute('/');
}

function navigateToFormSuccess() {
    history.pushState(null, '', '/form-success');
    handleRoute('/form-success');
}

function trackConversion() {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'form_submission',
            'event_category': 'engagement',
            'event_label': 'hotel_booking_form',
            'value': 1
        });
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
            'value': 1.0,
            'currency': 'INR'
        });
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
const checkinInput = document.querySelector('input[name="checkin"]');
const checkoutInput = document.querySelector('input[name="checkout"]');

if (checkinInput) {
    checkinInput.setAttribute('min', today);
}

if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
    });
}

// Dynamic copyright year
function updateCopyrightYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// WhatsApp functionality
async function openWhatsApp(roomType = '', price = '') {
    try {
        const phone = await getPhoneNumber();
        
        if (!phone) {
            alert('Contact information unavailable. Please try again.');
            return;
        }

        let message = `Hello Hotel Bhavani Udupi!\n\nI would like to make a booking inquiry.`;

        if (roomType && price) {
            message += `\n\nRoom Type: ${roomType}\nPrice: ₹${price}/night\n\nPlease confirm availability and provide booking details.`;
        } else {
            message += `\n\nPlease provide information about room availability and booking process.`;
        }

        message += `\n\nThank you!`;

        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    } catch (error) {
        alert('Unable to load contact information. Please try again later.');
    }
}

// Book room function
function bookRoom(roomType, price) {
    openWhatsApp(roomType, price);
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize routing
    initializeRouting();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Update copyright year
    updateCopyrightYear();
    
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const phone = await getPhoneNumber();
                
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const userPhone = formData.get('phone');
                const roomType = formData.get('roomType');
                const checkin = formData.get('checkin');
                const checkout = formData.get('checkout');
                const message = formData.get('message');

                if (name && email && userPhone && roomType && checkin && checkout) {
                    const bookingMessage = `Hotel Bhavani Udupi - Booking Request\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${userPhone}\n🏨 Room Type: ${roomType}\n📅 Check-in: ${checkin}\n📅 Check-out: ${checkout}\n💬 Message: ${message || 'None'}\n\nPlease confirm availability and booking details.\n\nThank you!`;

                    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(bookingMessage)}`;
                    window.open(whatsappURL, '_blank');
                    
                    navigateToFormSuccess();
                    this.reset();
                } else {
                    alert('Please fill in all required fields.');
                }
            } catch (error) {
                alert('Unable to process booking. Please try again.');
                console.error('Booking error:', error);
            }
        });
    }
});
