/* =============================================
   AI BUSINESS LANDING PAGE - JAVASCRIPT
   Upgraded: Autocapture + UTM + Hidden iframe + Autofill
   (Giống Siêu Trợ Lý)
   ============================================= */

// ============================
// AUTOCAPTURE & AUTOFILL LOGIC
// ============================
function setRootCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    const hostParts = window.location.hostname.split('.');
    let rootDomain = window.location.hostname;
    if (hostParts.length > 2) {
        rootDomain = hostParts.slice(-2).join('.');
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; domain=." + rootDomain;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function autoFillForm() {
    const urlParams = new URLSearchParams(window.location.search);
    let savedName = urlParams.get('name') || '';
    let savedEmail = urlParams.get('email') || '';
    let savedPhone = urlParams.get('phone') || '';

    if(!savedName) {
        let tmp = localStorage.getItem('user_name') || getCookie('user_name');
        if(tmp) try { savedName = decodeURIComponent(tmp); } catch(e) { savedName = tmp; }
    }
    if(!savedEmail) {
        let tmp = localStorage.getItem('user_email') || getCookie('user_email');
        if(tmp) try { savedEmail = decodeURIComponent(tmp); } catch(e) { savedEmail = tmp; }
    }
    if(!savedPhone) {
        let tmp = localStorage.getItem('user_phone') || getCookie('user_phone');
        if(tmp) try { savedPhone = decodeURIComponent(tmp); } catch(e) { savedPhone = tmp; }
    }

    if (savedName || savedEmail || savedPhone) {
        document.querySelectorAll('.registration-form').forEach(form => {
            const nameInput = form.querySelector('input[name="fullName"]');
            const emailInput = form.querySelector('input[name="email"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            if (savedName && nameInput && !nameInput.value) nameInput.value = savedName;
            if (savedEmail && emailInput && !emailInput.value) emailInput.value = savedEmail;
            if (savedPhone && phoneInput && !phoneInput.value) phoneInput.value = savedPhone;
        });
    }
}

// ============================
// HÀM ĐỌC UTM PARAMETERS TỪ URL
// ============================
function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || '',
        utm_term: params.get('utm_term') || '',
        utm_id: params.get('utm_id') || '',
        fbclid: params.get('fbclid') || ''
    };
}

// Lấy UTM ngay khi trang load
const utmData = getUtmParams();

// ============================
// GOOGLE SHEETS CONFIG
// ============================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkdpM9oEKrLidkhJglOjLDa3Hz2iKYDg3PGVPKYGkUGr2s40GpAOZVPLa0B8ghwnIK/exec';

// Hàm gửi dữ liệu qua hidden iframe (bypass CORS 100%)
function sendToGoogleSheet(data) {
    return new Promise((resolve) => {
        const iframeName = 'hidden-iframe-' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = GOOGLE_SCRIPT_URL;
        hiddenForm.target = iframeName;
        hiddenForm.style.display = 'none';

        for (const [key, value] of Object.entries(data)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            hiddenForm.appendChild(input);
        }

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();

        setTimeout(() => {
            iframe.remove();
            hiddenForm.remove();
            resolve();
        }, 3000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Auto-fill form nếu khách quay lại
    autoFillForm();

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

    // === FORM HANDLING (shared) ===
    function handleFormSubmit(formEl, btnEl) {
        const nameVal = formEl.querySelector('input[name="fullName"]').value.trim();
        const emailVal = formEl.querySelector('input[name="email"]').value.trim();
        const phoneVal = formEl.querySelector('input[name="phone"]').value.trim();

        if (!nameVal || !emailVal || !phoneVal) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // --- SAVE AUTOCAPTURE DATA ---
        localStorage.setItem('user_name', encodeURIComponent(nameVal));
        localStorage.setItem('user_email', encodeURIComponent(emailVal));
        localStorage.setItem('user_phone', encodeURIComponent(phoneVal));

        setRootCookie('user_name', encodeURIComponent(nameVal), 365);
        setRootCookie('user_email', encodeURIComponent(emailVal), 365);
        setRootCookie('user_phone', encodeURIComponent(phoneVal), 365);
        // -----------------------------

        // Loading state
        const originalText = btnEl.innerHTML;
        btnEl.innerHTML = 'ĐANG XỬ LÝ...';
        btnEl.disabled = true;
        btnEl.style.opacity = '0.7';

        // Gửi dữ liệu qua hidden iframe (giống Siêu Trợ Lý)
        const linkUtm = window.location.href;
        const source = utmData.utm_source;

        sendToGoogleSheet({
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            timestamp: new Date().toLocaleString('vi-VN'),
            link_utm: linkUtm,
            source: source
        }).then(() => {
            // Fire Meta Pixel Lead event
            if (typeof fbq === 'function') {
                fbq('track', 'Lead');
            }

            // Reset form & button
            formEl.reset();
            btnEl.innerHTML = originalText;
            btnEl.disabled = false;
            btnEl.style.opacity = '1';

            // Mở popup Zalo
            openPopup();
        }).catch(() => {
            // Vẫn mở popup nếu lỗi gửi data
            if (typeof fbq === 'function') {
                fbq('track', 'Lead');
            }
            formEl.reset();
            btnEl.innerHTML = originalText;
            btnEl.disabled = false;
            btnEl.style.opacity = '1';
            openPopup();
        });
    }

    // Bind cả 2 form (trên + dưới)
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
                if (Math.random() < 0.15) {
                    slots--;
                    urgencyEl.textContent = slots;
                    urgencyEl.style.animation = 'none';
                    urgencyEl.offsetHeight;
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
