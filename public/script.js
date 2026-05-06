document.addEventListener('DOMContentLoaded', () => {
    // Accessibility Menu Toggle
    const accBtn = document.getElementById('accessibility-btn');
    const accMenu = document.getElementById('accessibility-menu');
    
    if (accBtn && accMenu) {
        accBtn.addEventListener('click', () => {
            accMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!accBtn.contains(e.target) && !accMenu.contains(e.target)) {
                accMenu.classList.remove('show');
            }
        });
    }

    // Toggle Mode
    const toggleMode = document.getElementById('toggle-mode');
    if (toggleMode) {
        toggleMode.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    // Toggle Contrast
    const toggleContrast = document.getElementById('toggle-contrast');
    if (toggleContrast) {
        toggleContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
    }

    // Font Size Adjust
    let fontSize = 100;
    const fontInc = document.getElementById('font-inc');
    const fontDec = document.getElementById('font-dec');
    
    if (fontInc && fontDec) {
        fontInc.addEventListener('click', () => {
            fontSize += 10;
            document.documentElement.style.fontSize = `${fontSize}%`;
        });
        
        fontDec.addEventListener('click', () => {
            fontSize -= 10;
            document.documentElement.style.fontSize = `${fontSize}%`;
        });
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            const isActive = header.classList.contains('active');

            // Close all other items (optional, but professional)
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
                h.querySelector('.accordion-icon').textContent = '+';
            });

            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '-';
            }
        });
    });

    // Hero Slider Logic
    const slider = document.getElementById('hero-slider');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    const slideCount = 3;
    const intervalTime = 6000; // Updated to 6 seconds

    function updateSlider(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider(currentSlide);
    }

    // Auto Slide
    let sliderInterval = setInterval(nextSlide, intervalTime);

    function resetInterval() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, intervalTime);
    }

    // Arrow Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    // Dot Click Navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            updateSlider(index);
            resetInterval();
        });
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero content stagger animation
    const heroItems = document.querySelectorAll('.fade-in');
    heroItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});


// Mobile Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerIcons = document.querySelectorAll('.hamburger');
    
    hamburgerIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const navContainer = e.currentTarget.parentElement; // should be .nav-bar or .container
            const navLinks = navContainer.querySelector('.nav-links') || document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    });
});
