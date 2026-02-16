document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Animate burger icon (simple rotation or transform could be added here)
    });

    // Close menu when clicking a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // 2. Sticky Navbar Blur Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const increment = target / 50;

            const updateCount = () => {
                const count = +stat.innerText;

                if (count < target) {
                    stat.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 40);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add reveal class for specific elements
                if (entry.target.classList.contains('service-card-flip')) {
                    entry.target.classList.add('reveal');
                }

                // Trigger stats animation
                if (entry.target.classList.contains('hero-stats') && !hasAnimatedStats) {
                    animateStats();
                    hasAnimatedStats = true;
                }

                // Generic reveal
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe stats container
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card-flip');
    serviceCards.forEach(card => observer.observe(card));

    // 5. Flip Card Touch Support for Mobile
    const cards = document.querySelectorAll('.service-card-flip');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle a class for mobile flip if hover isn't sufficient
            // On desktop hover handles it via CSS
            card.classList.toggle('flipped');
        });
    });

    // 6. Particles Background (Simple Implementation)
    const particleContainer = document.getElementById('particles-container');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(6, 182, 212, ' + (Math.random() * 0.5) + ')';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            particle.style.animation = `float ${10 + Math.random() * 20}s infinite linear`;
            particleContainer.appendChild(particle);
        }
    }

    // 7. Form Submission to n8n
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;

            // Loading State
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Gather Data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            // Add current timestamp
            data.timestamp = new Date().toISOString();

            try {
                // Send to n8n Webhook
                await fetch('https://auraflowfit.app.n8n.cloud/webhook-test/6539874a-c7e6-4e03-a964-0a5de374fdf5', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // Success Feedback
                submitBtn.innerText = '¡Enviado con Éxito!';
                submitBtn.style.background = 'var(--success, #22C55E)';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = ''; // Revert to original gradient
                }, 3000);

            } catch (error) {
                console.error('Error envio:', error);
                // Show specific error in button for debugging
                submitBtn.innerText = 'Error: Ver Consola (F12)';
                submitBtn.style.background = 'var(--warning, #F59E0B)';
                alert("Error enviando datos: " + error.message + "\n\nNota: Si estás abriendo el archivo directamente desde tu carpeta (file://), los navegadores bloquean estas peticiones por seguridad (CORS). Necesitas un servidor local o subir la web.");

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                }, 5000);
            }
        });
    }
});
