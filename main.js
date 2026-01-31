// ================================
// PARTICLES BACKGROUND
// ================================
function createParticles() {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDuration = Math.random() * 10 + 10 + "s";
        particle.style.animationDelay = Math.random() * 5 + "s";
        particle.style.width = Math.random() * 4 + 2 + "px";
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.3;

        const colors = ["#667eea", "#764ba2", "#f093fb", "#ffd700"];
        particle.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }
}

// ================================
// CUSTOM CURSOR
// ================================
function initCustomCursor() {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (!cursor || !follower) return;

    let mouseX = 0,
        mouseY = 0;
    let cursorX = 0,
        cursorY = 0;
    let followerX = 0,
        followerY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";
        follower.style.left = followerX + "px";
        follower.style.top = followerY + "px";

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll(
        "a, button, .skill-card, .why-card, .fact-card, .gallery-item"
    );
    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            follower.classList.add("hover");
            cursor.style.transform = "scale(1.5)";
        });
        el.addEventListener("mouseleave", () => {
            follower.classList.remove("hover");
            cursor.style.transform = "scale(1)";
        });
    });
}

// ================================
// NAVBAR
// ================================
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    // Scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile menu
    burger.addEventListener("click", () => {
        burger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu on link click
    links.forEach((link) => {
        link.addEventListener("click", () => {
            burger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // Smooth scroll
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });
}

// ================================
// COUNTER ANIMATION
// ================================
function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ================================
// SKILLS PROGRESS BARS
// ================================
function initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute("data-progress");
                    entry.target.style.width = progress + "%";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".section-header, .about-image, .about-text, .skill-card, .why-card, " +
            ".fact-card, .gallery-item, .contact-item, .contact-form-container, " +
            ".feature-item, .achievement-item"
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Trigger counter animation when hero stats become visible
                    if (entry.target.closest(".hero-stats")) {
                        animateCounters();
                    }
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    revealElements.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });

    // Animate counters when page loads (hero section)
    setTimeout(animateCounters, 1000);
}

// ================================
// REVIEWS SLIDER
// ================================
function initReviewsSlider() {
    const track = document.querySelector(".reviews-track");
    const cards = document.querySelectorAll(".review-card");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    const dotsContainer = document.querySelector(".slider-dots");

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("div");
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll(".slider-dot");

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto-play
    let autoplay = setInterval(nextSlide, 5000);

    track.addEventListener("mouseenter", () => clearInterval(autoplay));
    track.addEventListener("mouseleave", () => {
        autoplay = setInterval(nextSlide, 5000);
    });

    // Touch support
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", () => {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

// ================================
// GALLERY HOVER EFFECTS
// ================================
function initGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            galleryItems.forEach((other) => {
                if (other !== item) {
                    other.style.opacity = "0.5";
                    other.style.transform = "scale(0.95)";
                }
            });
        });

        item.addEventListener("mouseleave", () => {
            galleryItems.forEach((other) => {
                other.style.opacity = "1";
                other.style.transform = "scale(1)";
            });
        });
    });
}

// ================================
// CONTACT FORM
// ================================
function initContactForm() {
    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector(".btn-submit");
        const originalText = btn.innerHTML;

        // Animate button
        btn.innerHTML = "<span>Отправляем... ✨</span>";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = "<span>Отправлено! 🎉</span>";
            btn.style.background =
                "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)";

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = "";
                btn.disabled = false;
                form.reset();

                // Show thank you message
                showNotification("Спасибо за вашу благодарность! 💖");
            }, 2000);
        }, 1500);
    });
}

// ================================
// NOTIFICATIONS
// ================================
function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// ================================
// BACK TO TOP BUTTON
// ================================
function initBackToTop() {
    const btn = document.getElementById("backToTop");

    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

// ================================
// PARALLAX EFFECTS
// ================================
function initParallax() {
    const heroCircle = document.querySelector(".hero-circle");
    const heroCircle2 = document.querySelector(".hero-circle-2");
    const floatingIcons = document.querySelectorAll(".float-icon");

    window.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;

        if (heroCircle) {
            heroCircle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${x}deg)`;
        }

        if (heroCircle2) {
            heroCircle2.style.transform = `translate(calc(-50% + ${-x}px), calc(-50% + ${-y}px)) rotate(${-x}deg)`;
        }

        floatingIcons.forEach((icon, index) => {
            const factor = (index + 1) * 0.5;
            icon.style.transform = `translate(${x * factor}px, ${
                y * factor
            }px)`;
        });
    });
}

// ================================
// TYPING EFFECT FOR HERO
// ================================
function initTypingEffect() {
    const words = [
        "Королева Чистоты",
        "Мастер Порядка",
        "Герой Гигиены",
        "Звезда Больницы",
    ];
    const element = document.querySelector(".title-accent");

    if (!element) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    // Start after initial animation
    setTimeout(type, 3000);
}

// ================================
// MAGNETIC BUTTONS
// ================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate(0, 0)";
        });
    });
}

// ================================
// TILT EFFECT FOR CARDS
// ================================
function initTiltEffect() {
    const cards = document.querySelectorAll(
        ".skill-card, .why-card, .fact-card"
    );

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
        });
    });
}

// ================================
// CONFETTI ON SCROLL TO ACHIEVEMENTS
// ================================
function initConfetti() {
    const achievementsSection = document.getElementById("achievements");
    let confettiTriggered = false;

    if (!achievementsSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !confettiTriggered) {
                    confettiTriggered = true;
                    createConfetti();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(achievementsSection);
}

function createConfetti() {
    const colors = ["#667eea", "#764ba2", "#f093fb", "#ffd700", "#4ade80"];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      z-index: 9999;
      pointer-events: none;
      animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
    `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

// ================================
// EASTER EGG - KONAMI CODE
// ================================
function initEasterEgg() {
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "KeyB",
        "KeyA",
    ];
    let konamiIndex = 0;

    document.addEventListener("keydown", (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                activateRainbowMode();
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateRainbowMode() {
    document.body.style.animation = "rainbow 2s linear infinite";
    showNotification("🌈 Радужный режим активирован! 🦄");

    const rainbowStyle = document.createElement("style");
    rainbowStyle.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
        document.body.style.animation = "";
        rainbowStyle.remove();
    }, 10000);
}

// ================================
// SOUND EFFECTS (Optional)
// ================================
function initSoundEffects() {
    // Create audio context for click sounds
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Add click sound to buttons (disabled by default to avoid annoyance)
    // Uncomment to enable:
    // document.querySelectorAll('.btn').forEach(btn => {
    //   btn.addEventListener('click', playClickSound);
    // });
}

// ================================
// INITIALIZE EVERYTHING
// ================================
document.addEventListener("DOMContentLoaded", () => {
    createParticles();
    initCustomCursor();
    initNavbar();
    initScrollReveal();
    initSkillBars();
    initReviewsSlider();
    initGallery();
    initContactForm();
    initBackToTop();
    initParallax();
    initTypingEffect();
    initMagneticButtons();
    initTiltEffect();
    initConfetti();
    initEasterEgg();
    // initSoundEffects(); // Uncomment to enable sound effects

    console.log("✨ Лендинг Шахины успешно загружен! ✨");
    console.log("🎮 Попробуй Konami Code: ↑↑↓↓←→←→BA");
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================
// Disable animations for users who prefer reduced motion
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty("--transition-smooth", "linear");
    document.querySelectorAll('[class*="animation"]').forEach((el) => {
        el.style.animation = "none";
    });
}

// Lazy load particles on slower devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.getElementById("particles").style.display = "none";
}
