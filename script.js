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

// ===== Reviews Carousel =====
function initReviewsCarousel() {
    const track = document.getElementById('reviewsTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.review-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoPlayInterval;

    function getVisibleCards() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getTotalDots() {
        return Math.max(1, totalCards - getVisibleCards() + 1);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const total = getTotalDots();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
            dot.addEventListener('click', () => scrollToCard(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function scrollToCard(index) {
        const total = getTotalDots();
        currentIndex = Math.max(0, Math.min(index, total - 1));
        const card = cards[currentIndex];
        if (card) {
            track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
        updateDots();
    }

    function nextSlide() {
        const total = getTotalDots();
        currentIndex = (currentIndex + 1) % total;
        scrollToCard(currentIndex);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    // Update current dot on manual scroll
    track.addEventListener('scroll', () => {
        const scrollLeft = track.scrollLeft;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
            const dist = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        if (closest !== currentIndex) {
            currentIndex = Math.min(closest, getTotalDots() - 1);
            updateDots();
        }
    });

    createDots();
    startAutoPlay();

    // Arrow buttons
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) prevBtn.addEventListener('click', () => { scrollToCard(currentIndex - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { scrollToCard(currentIndex + 1); startAutoPlay(); });

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay, { passive: true });
    track.addEventListener('touchend', () => setTimeout(startAutoPlay, 3000));

    window.addEventListener('resize', createDots);
}

// ===== Form Submission =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initReviewsCarousel();
    initChatbot();
    
    // Dynamic year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Honeypot check - if filled, silently reject (it's a bot)
            const honeypot = this.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                // Fake success for bots
                this.reset();
                return;
            }

            const fd = new FormData(this);
            const name = fd.get('name').trim();
            const email = fd.get('email').trim();
            const userPhone = fd.get('phone').trim();
            const roomType = fd.get('roomType');
            const checkin = fd.get('checkin');
            const checkout = fd.get('checkout');
            const message = fd.get('message');

            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

            let hasError = false;

            // Name validation
            if (!name || name.length < 2) {
                showFieldError('nameError', 'Please enter your name (min 2 characters)');
                this.querySelector('input[name="name"]').classList.add('invalid');
                hasError = true;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFieldError('emailError', 'Please enter a valid email address');
                this.querySelector('input[name="email"]').classList.add('invalid');
                hasError = true;
            }

            // Phone validation (10 digit Indian number)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!userPhone || !phoneRegex.test(userPhone)) {
                showFieldError('phoneError', 'Please enter a valid 10-digit phone number');
                this.querySelector('input[name="phone"]').classList.add('invalid');
                hasError = true;
            }

            // Room type validation
            if (!roomType) {
                showFieldError('roomError', 'Please select a room type');
                this.querySelector('select[name="roomType"]').classList.add('invalid');
                hasError = true;
            }

            // Date validation
            if (!checkin) {
                showFieldError('checkinError', 'Please select check-in date');
                hasError = true;
            }
            if (!checkout) {
                showFieldError('checkoutError', 'Please select check-out date');
                hasError = true;
            }
            if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
                showFieldError('checkoutError', 'Check-out must be after check-in');
                hasError = true;
            }

            if (hasError) return;

            // All valid - send via WhatsApp
            try {
                const phone = await getPhoneNumber();
                const msg = `Hotel Bhavani Udupi - Booking\n\n👤 ${name}\n📧 ${email}\n📱 ${userPhone}\n🏨 ${roomType}\n📅 ${checkin} to ${checkout}\n💬 ${message || 'None'}\n\nPlease confirm. Thank you!`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                this.reset();
                document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
            } catch (err) {
                alert('Unable to process. Please try again or call us at 0820-2526980.');
            }
        });

        // Real-time phone input - numbers only
        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        }
    }

    function showFieldError(id, message) {
        const el = document.getElementById(id);
        if (el) el.textContent = message;
    }
});



// ===== FAQ Chatbot =====
function initChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggle = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const messages = document.getElementById('chatbotMessages');
    const suggestions = document.getElementById('chatbotSuggestions');

    if (!chatbot || !toggle) return;

    // FAQ database
    const faqs = [
        { keywords: ['price', 'rate', 'cost', 'tariff', 'how much', 'charge', 'rupee', '₹'], answer: 'Our room rates:\n• Single Bedded Room (1 bed): ₹500/night\n• Double Bedded Room (2 beds): ₹700/night\n• Three Bedded Room (3 beds): ₹900/night\n\nAll rooms include attached bathroom, fan, light, and clean linen.' },
        { keywords: ['location', 'where', 'address', 'direction', 'how to reach', 'find'], answer: 'We\'re at Shyam Complex, Maruthi Veethika, Near Head Post Office, Udupi 576101.\n\nJust 600m (5 min walk) from Sri Krishna Temple and Udupi Bus Stand.\n\n📍 <a href="https://maps.app.goo.gl/Fn6qMLiw7N8J1hVw6" target="_blank">Open in Google Maps</a>' },
        { keywords: ['check in', 'checkin', 'check-in', 'check out', 'checkout', 'check-out', 'timing'], answer: 'Check-in: 6 AM to 11 PM\nStay: 24 hours from check-in\n\nPlease call one day before arrival to confirm your booking.' },
        { keywords: ['book', 'reserve', 'reservation', 'available', 'vacancy'], answer: 'You can book via WhatsApp for instant confirmation!\n\n📱 <a href="javascript:void(0)" onclick="openWhatsApp()">Message us on WhatsApp</a>\n📞 Or call: <a href="tel:08202526980">0820-2526980</a> (6 AM - 10 PM)' },
        { keywords: ['phone', 'call', 'contact', 'number', 'mobile'], answer: '📞 Phone: <a href="tel:08202526980">0820-2526980</a>\n⏰ Working hours: 6 AM to 10 PM\n💬 <a href="javascript:void(0)" onclick="openWhatsApp()">WhatsApp</a> (anytime)' },
        { keywords: ['temple', 'krishna', 'matha', 'math', 'mutt'], answer: 'Sri Krishna Temple is just 600 meters away — a 5 minute walk from our hotel! Perfect for pilgrims visiting the temple.' },
        { keywords: ['beach', 'malpe', 'st mary', 'island'], answer: 'Malpe Beach is 6 km away (15 min drive). St. Mary\'s Island is accessible by boat from Malpe.\n\nWe can help arrange an auto/taxi!' },
        { keywords: ['bus', 'stand', 'station', 'transport'], answer: 'Udupi Bus Stand is just 400m away (5 min walk). We\'re in the city center with easy access to all transport.' },
        { keywords: ['wifi', 'internet', 'tv', 'ac', 'air condition', 'amenities', 'facility'], answer: 'Our rooms include:\n✓ Attached bathroom\n✓ Fan & light\n✓ Clean linen\n✓ 24-hour water\n\nWe\'re a budget hotel focused on clean, comfortable basics.' },
        { keywords: ['food', 'restaurant', 'breakfast', 'meal', 'eat'], answer: 'We don\'t have an in-house restaurant, but famous Udupi vegetarian restaurants are within 200m walking distance! The area is known for authentic South Indian food.' },
        { keywords: ['family', 'children', 'kid', 'safe'], answer: 'Yes! We\'re family-friendly. Our three bedded room (₹900/night) with 3 beds is perfect for families. The area is peaceful and safe.' },
        { keywords: ['cancel', 'refund', 'policy'], answer: 'Please call us at least one day before to cancel or modify your booking. No advance payment is needed — pay at check-in.' },
        { keywords: ['parking', 'car', 'bike', 'vehicle'], answer: 'Limited parking is available nearby. For two-wheelers, parking is usually easy to find. Please ask at reception on arrival.' },
        { keywords: ['manipal', 'college', 'university', 'student'], answer: 'Manipal University is just 5 km away (10 min drive). We\'re popular with students and their visiting families due to our budget rates!' },
        { keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'], answer: 'Namaste! 🙏 Welcome to Hotel Bhavani Udupi. How can I help you today?\n\nYou can ask about room prices, location, check-in times, or booking.' },
        { keywords: ['ok', 'okay', 'thanks', 'thank you', 'thank', 'got it', 'cool', 'great', 'perfect', 'nice', 'good', 'bye', 'goodbye', 'see you', 'that\'s all'], answer: 'Glad I could help! 😊 We look forward to welcoming you at Hotel Bhavani. Have a great day!\n\nIf you need anything else, just ask or reach us on <a href="javascript:void(0)" onclick="openWhatsApp()">WhatsApp</a>.' },
    ];

    const fallbackAnswer = 'I\'m sorry, I don\'t have information on that topic. But I can help you with:\n\n• Room prices & availability\n• Location & directions\n• Check-in/check-out times\n• Booking a room\n• Nearby attractions\n\nOr you can contact us directly:\n📱 <a href="javascript:void(0)" onclick="openWhatsApp()">WhatsApp</a> (instant reply)\n📞 <a href="tel:08202526980">0820-2526980</a> (6 AM - 10 PM)';

    function openChat() {
        chatbot.classList.add('open');
        toggle.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        input.focus();
    }

    function closeChat() {
        chatbot.classList.remove('open');
        toggle.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ' + sender;
        msg.innerHTML = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function getAnswer(question) {
        const q = question.toLowerCase().trim();
        
        // Check if input is too short or nonsensical
        if (q.length < 2) {
            return 'Please type a longer question so I can help you better! You can ask about rooms, prices, location, or booking.';
        }

        for (const faq of faqs) {
            for (const keyword of faq.keywords) {
                if (q.includes(keyword)) {
                    return faq.answer;
                }
            }
        }
        
        // Improved fallback with suggestions
        return fallbackAnswer;
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // Hide suggestions after first interaction
        if (suggestions) suggestions.style.display = 'none';

        // Simulate typing delay
        setTimeout(() => {
            const answer = getAnswer(text);
            addMessage(answer, 'bot');
            
            // Show quick suggestions again after fallback
            if (answer === fallbackAnswer) {
                showFallbackSuggestions();
            }
        }, 400);
    }

    function showFallbackSuggestions() {
        const sugDiv = document.createElement('div');
        sugDiv.className = 'chatbot-suggestions';
        sugDiv.setAttribute('role', 'group');
        sugDiv.setAttribute('aria-label', 'Suggested questions');
        sugDiv.innerHTML = `
            <button class="suggestion-btn" data-q="room price">Room prices</button>
            <button class="suggestion-btn" data-q="location">Location</button>
            <button class="suggestion-btn" data-q="book a room">Book a room</button>
            <button class="suggestion-btn" data-q="check in time">Check-in time</button>
        `;
        messages.appendChild(sugDiv);
        messages.scrollTop = messages.scrollHeight;
        
        // Attach click handlers to new suggestions
        sugDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.dataset.q;
                sugDiv.remove();
                handleSend();
            });
        });
    }

    // Event listeners
    toggle.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.q;
            handleSend();
        });
    });
}
