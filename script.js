// ===== Phone Number Cache =====
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

// ===== Theme Toggle =====
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('.theme-icon');
    const saved = localStorage.getItem('theme');
    
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        icon.textContent = saved === 'dark' ? '☀️' : '🌙';
    } else {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.textContent = '☀️';
        }
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        icon.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

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
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Scroll Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.boxShadow = window.scrollY > 50 ? 'var(--shadow-md)' : 'none';
});

// ===== Date Inputs =====
const today = new Date().toISOString().split('T')[0];
const checkinInput = document.querySelector('input[name="checkin"]');
const checkoutInput = document.querySelector('input[name="checkout"]');
if (checkinInput) checkinInput.setAttribute('min', today);
if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', function() {
        const d = new Date(this.value);
        d.setDate(d.getDate() + 1);
        checkoutInput.setAttribute('min', d.toISOString().split('T')[0]);
    });
}

// ===== WhatsApp =====
async function openWhatsApp(roomType = '', price = '') {
    try {
        const phone = await getPhoneNumber();
        if (!phone) { alert('Contact info unavailable.'); return; }
        let msg = 'Hello Hotel Bhavani Udupi!\n\nI would like to make a booking inquiry.';
        if (roomType && price) {
            msg += `\n\nRoom Type: ${roomType}\nPrice: ₹${price}/night\n\nPlease confirm availability.`;
        }
        msg += '\n\nThank you!';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } catch (e) {
        alert('Unable to load contact info. Please try again.');
    }
}

function bookRoom(roomType, price) { openWhatsApp(roomType, price); }

// ===== Form Submission =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    
    // Dynamic year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const phone = await getPhoneNumber();
                const fd = new FormData(this);
                const name = fd.get('name'), email = fd.get('email'),
                      userPhone = fd.get('phone'), roomType = fd.get('roomType'),
                      checkin = fd.get('checkin'), checkout = fd.get('checkout'),
                      message = fd.get('message');

                if (name && email && userPhone && roomType && checkin && checkout) {
                    const msg = `Hotel Bhavani Udupi - Booking\n\n👤 ${name}\n📧 ${email}\n📱 ${userPhone}\n🏨 ${roomType}\n📅 ${checkin} to ${checkout}\n💬 ${message || 'None'}\n\nPlease confirm. Thank you!`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                    this.reset();
                } else {
                    alert('Please fill all required fields.');
                }
            } catch (e) {
                alert('Unable to process. Please try again.');
            }
        });
    }
});
