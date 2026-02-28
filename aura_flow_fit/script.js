document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

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
                if (entry.target.classList.contains('service-card-flip')) {
                    entry.target.classList.add('reveal');
                }
                if (entry.target.classList.contains('hero-stats') && !hasAnimatedStats) {
                    animateStats();
                    hasAnimatedStats = true;
                }
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
    const serviceCards = document.querySelectorAll('.service-card-flip');
    serviceCards.forEach(card => observer.observe(card));

    // 5. Flip Card Touch Support
    const cards = document.querySelectorAll('.service-card-flip');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // 6. Particles Background
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

    // 7. Form Submission to n8n (CORREGIDO)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();

            try {
                // DIRECCIÓN CORRECTA DE TU PRODUCCIÓN
                await fetch('https://n8n.auraflow.cl/webhook/f98fa7cc-f925-4122-8356-9be896957297', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                submitBtn.innerText = '¡Enviado con Éxito!';
                submitBtn.style.background = '#22C55E';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                }, 3000);

           await fetch('https://n8n.auraflow.cl/webhook/f98fa7cc-f925-4122-8356-9be896957297', {
                console.error('Error envio:', error);
                submitBtn.innerText = 'Error al enviar';
                submitBtn.style.background = '#F59E0B';
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


