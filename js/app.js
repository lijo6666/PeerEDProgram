class AppController {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.navToggle = document.getElementById('nav-toggle');
    this.navLinks = document.getElementById('nav-links');
    this.navbar = document.getElementById('navbar');
    this.sections = document.querySelectorAll('section');
    this.navItems = document.querySelectorAll('.nav-links li');
    
    this.init();
  }
  
  init() {
    // Theme setup
    this.setupTheme();
    
    // Mobile navigation setup
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Smooth scroll navigation highlight
    window.addEventListener('scroll', () => {
      this.handleNavbarScroll();
      this.highlightNavLinks();
    });
    
    // Mouse Glow Orb Follower
    this.setupCursorGlow();
    
    // Glass card lighting interaction & 3D Tilt
    this.setupGlassInteractions();
    
    // Scroll entry animations (Intersection Observer)
    this.setupScrollReveal();
    
    // Statistics Count-Up
    this.setupCountUp();
    
    // Process flow step interactive highlighting
    this.setupProcessFlow();
    
    // Load lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      this.updateThemeButton(true);
    } else {
      document.documentElement.classList.remove('light-mode');
      this.updateThemeButton(false);
    }
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        this.updateThemeButton(isLight);
        
        // Re-render magazine cover gradients on theme change
        if (window.magazineInstance) {
          window.magazineInstance.switchIssue(window.magazineInstance.activeYear);
        }
      });
    }
  }
  
  updateThemeButton(isLight) {
    if (!this.themeToggle) return;
    if (isLight) {
      this.themeToggle.innerHTML = '<i class="lucide-moon" style="width:20px; height:20px;"></i>';
    } else {
      this.themeToggle.innerHTML = '<i class="lucide-sun" style="width:20px; height:20px;"></i>';
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  toggleMobileMenu() {
    if (this.navLinks) {
      this.navLinks.classList.toggle('open');
      const isOpen = this.navLinks.classList.contains('open');
      this.navToggle.innerHTML = isOpen ? '<i class="lucide-x"></i>' : '<i class="lucide-menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
  
  handleNavbarScroll() {
    if (!this.navbar) return;
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
  
  highlightNavLinks() {
    let scrollPosition = window.scrollY + 120;
    
    this.sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        this.navItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  setupCursorGlow() {
    // Create cursor glow element
    const glow = document.createElement('div');
    glow.className = 'interactive-cursor-glow';
    document.body.appendChild(glow);
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    
    // Smooth interpolation (Lerp) for elastic tracking
    const updateGlowPosition = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      glow.style.transform = `translate3d(${currentX - 150}px, ${currentY - 150}px, 0)`;
      requestAnimationFrame(updateGlowPosition);
    };
    
    updateGlowPosition();
  }
  
  setupGlassInteractions() {
    // 3D Parallax Card-Tilt Engine
    const isMobile = window.innerWidth <= 767;
    if (isMobile) return; // Disable tilt on mobile for performance

    const tiltCards = document.querySelectorAll('.glass-card-hoverable, .metric-card, .process-step');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate coordinates relative to card center
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt rotation angles (max 10 degrees)
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Set dynamic highlight angle properties
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
  
  setupScrollReveal() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const revealEls = document.querySelectorAll('.reveal, .reveal-fade-up, .reveal-scale-in');
    revealEls.forEach(el => observer.observe(el));
  }
  
  setupCountUp() {
    const counterElements = document.querySelectorAll('.counter-num');
    
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 2000; // 2 seconds
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        count += Math.ceil(target / (duration / stepTime));
        if (count >= target) {
          el.textContent = target + (el.getAttribute('data-suffix') || '');
          clearInterval(timer);
        } else {
          el.textContent = count;
        }
      }, stepTime);
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => observer.observe(el));
  }
  
  setupProcessFlow() {
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
      step.classList.add('glass-card-hoverable');
      step.style.cursor = 'pointer';
      
      step.addEventListener('click', () => {
        step.style.transform = 'scale(1.05)';
        step.style.borderColor = 'var(--accent-gold)';
        
        setTimeout(() => {
          step.style.transform = '';
          step.style.borderColor = '';
        }, 600);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  
  // Smooth scroll links inside page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (navToggle) {
            navToggle.innerHTML = '<i class="lucide-menu"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        }
        
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
