/* =============================================
   AI BUSINESS LANDING PAGE - JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // === POPUP FUNCTIONS ===
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    let countdownInterval = null;

    function openPopup() {
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        startCountdown(1, 50);
    }

    function closePopup() {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (countdownInterval) clearInterval(countdownInterval);
    }

    function startCountdown(min, sec) {
        const minEl = document.getElementById('countdownMin');
        const secEl = document.getElementById('countdownSec');
        let totalSec = min * 60 + sec;

        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (totalSec <= 0) {
                clearInterval(countdownInterval);
                return;
            }
            totalSec--;
            const m = Math.floor(totalSec / 60);
            const s = totalSec % 60;
            minEl.textContent = String(m).padStart(2, '0');
            secEl.textContent = String(s).padStart(2, '0');
        }, 1000);
    }

    if (popupClose) popupClose.addEventListener('click', closePopup);
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closePopup();
        });
    }

    // === GOOGLE SHEETS CONFIG ===
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxkdpM9oEKrLidkhJglOjLDa3Hz2iKYDg3PGVPKYGkUGr2s40GpAOZVPLa0B8ghwnIK/exec';

    // === FORM HANDLING (shared) ===
    function handleFormSubmit(formEl, btnEl) {
        const inputs = formEl.querySelectorAll('input');
        let allFilled = true;
        inputs.forEach(inp => { if (!inp.value.trim()) allFilled = false; });

        if (!allFilled) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Collect data
        const nameVal = formEl.querySelector('input[name="fullName"]').value.trim();
        const emailVal = formEl.querySelector('input[name="email"]').value.trim();
        const phoneVal = formEl.querySelector('input[name="phone"]').value.trim();
        const utmLink = window.location.href; // Full URL with UTM params

        const originalText = btnEl.innerHTML;
        btnEl.innerHTML = '<span class="cta-text">ĐANG XỬ LÝ...</span>';
        btnEl.disabled = true;
        btnEl.style.opacity = '0.7';

        // Send to Google Sheets via form submit (reliable cross-origin)
        const formData = new FormData();
        formData.append('name', nameVal);
        formData.append('email', emailVal);
        formData.append('phone', phoneVal);
        formData.append('utm', utmLink);

        fetch(SHEETS_URL, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            formEl.reset();
            btnEl.innerHTML = originalText;
            btnEl.disabled = false;
            btnEl.style.opacity = '1';
            openPopup();
        })
        .catch(() => {
            // Vẫn mở popup nếu lỗi gửi data
            formEl.reset();
            btnEl.innerHTML = originalText;
            btnEl.disabled = false;
            btnEl.style.opacity = '1';
            openPopup();
        });
    }

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form, document.getElementById('ctaButton'));
        });
    }

    const formBottom = document.getElementById('registrationFormBottom');
    if (formBottom) {
        formBottom.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(formBottom, document.getElementById('ctaButtonBottom'));
        });
    }

    // === SLOT COUNTDOWN (URGENCY) ===
    const urgencyEl = document.querySelector('.urgency-badge strong');
    if (urgencyEl) {
        let slots = parseInt(urgencyEl.textContent);

        setInterval(() => {
            if (slots > 5) {
                // Random chance to decrease
                if (Math.random() < 0.15) {
                    slots--;
                    urgencyEl.textContent = slots;
                    urgencyEl.style.animation = 'none';
                    urgencyEl.offsetHeight; // Trigger reflow
                    urgencyEl.style.animation = 'slotDrop 0.4s ease';
                }
            }
        }, 8000);
    }

    // === FORM INPUT ANIMATIONS ===
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    // === INTERSECTION OBSERVER FOR ANIMATIONS ===
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

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // === CTA BUTTON RIPPLE EFFECT ===
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: 100px;
                height: 100px;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }
    // === GALLERY ===
    const galleryImages = [
        'ảnh 1.jpg', 'ảnh 2.png', 'ảnh 3.jpg', 'ảnh 4.jpg',
        'ảnh 5.jpg', 'ảnh 6.jpg', 'ảnh 7.png'
    ];
    let currentGalleryIndex = 0;
    const mainImg = document.getElementById('galleryMainImg');
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    function updateGallery(index) {
        currentGalleryIndex = index;
        if (mainImg) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = galleryImages[index];
                mainImg.style.opacity = '1';
            }, 200);
        }
        thumbs.forEach((t, i) => {
            t.classList.toggle('active', i === index);
            if (i === index) t.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            updateGallery(parseInt(thumb.dataset.index));
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const idx = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGallery(idx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const idx = (currentGalleryIndex + 1) % galleryImages.length;
            updateGallery(idx);
        });
    }
});

// Inject animation keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slotDrop {
        0% { transform: translateY(-10px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes rippleEffect {
        to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);
