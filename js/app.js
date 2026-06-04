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
    
    // Magnetic Button Interactions
    this.setupMagneticButtons();

    
    // Digital Stall Experience
    this.setupDigitalStall();
    
    // Anonymous Note Wall
    this.setupAnonymousNotes();
    
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
    let scrollPosition = window.scrollY + 140;
    
    const targetIds = Array.from(this.navItems)
      .map(item => item.querySelector('a')?.getAttribute('href')?.substring(1))
      .filter(Boolean);
      
    let activeId = null;
    
    for (const id of targetIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      
      const top = el.offsetTop;
      const height = el.offsetHeight;
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeId = id;
      }
    }
    
    if (activeId) {
      this.navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${activeId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
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
    const stepRows = document.querySelectorAll('.process-step-row');
    const visualStates = document.querySelectorAll('.visual-state');
    const progressFill = document.querySelector('.process-line-progress');
    const stepsListContainer = document.querySelector('.process-steps-list');
    
    if (!stepRows.length || !visualStates.length) return;
    
    // Set active step helper
    const activateStep = (stepNum) => {
      stepRows.forEach(row => {
        if (row.getAttribute('data-step') === stepNum) {
          row.classList.add('active');
        } else {
          row.classList.remove('active');
        }
      });
      
      visualStates.forEach(state => {
        if (state.getAttribute('data-step') === stepNum) {
          state.classList.add('active');
        } else {
          state.classList.remove('active');
        }
      });
      
      // Update line progress
      if (progressFill && stepsListContainer) {
        const totalSteps = stepRows.length;
        const currentActiveIndex = Array.from(stepRows).findIndex(r => r.classList.contains('active'));
        const percentage = ((currentActiveIndex + 1) / totalSteps) * 100;
        progressFill.style.height = `${percentage}%`;
      }
    };
    
    // Click behavior
    stepRows.forEach(row => {
      const card = row.querySelector('.step-detail-card');
      const stepNum = row.getAttribute('data-step');
      
      if (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          activateStep(stepNum);
        });
      }
    });
    
    // Scroll intersection observer to auto-active steps
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNum = entry.target.getAttribute('data-step');
          activateStep(stepNum);
        }
      });
    }, observerOptions);
    
    stepRows.forEach(row => stepObserver.observe(row));
  }

  setupMagneticButtons() {
    const isMobile = window.innerWidth <= 767;
    if (isMobile) return;
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.02)`;
        btn.style.boxShadow = `0 15px 30px rgba(30, 79, 255, 0.45), 0 0 20px var(--accent-gold-glow)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        btn.style.boxShadow = '';
      });
    });
  }


  setupDigitalStall() {
    const panels = document.querySelectorAll('.stall-panel');
    if (!panels.length) return;
    
    panels.forEach(panel => {
      // 3D Parallax Tilt coordinates for Stall panels
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        panel.style.setProperty('--mouse-x', `${x}px`);
        panel.style.setProperty('--mouse-y', `${y}px`);
      });
      
      // Toggle active status on click
      panel.addEventListener('click', () => {
        const isActive = panel.classList.contains('active');
        
        // Remove active class from all panels
        panels.forEach(p => p.classList.remove('active'));
        
        // Toggle this panel
        if (!isActive) {
          panel.classList.add('active');
        }
      });
    });
  }

  setupAnonymousNotes() {
    const board = document.querySelector('.note-board-grid');
    const textarea = document.getElementById('new-note-text');
    const postBtn = document.getElementById('post-note-btn');
    const dots = document.querySelectorAll('.color-select .color-dot');
    
    if (!board || !postBtn || !textarea) return;
    
    let selectedColorIndex = 1; // default to color 1
    
    // Color selector handler
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        selectedColorIndex = parseInt(dot.getAttribute('data-color'), 10);
      });
    });
    
    // Post Note click handler
    postBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) {
        alert('Please enter some text for your note.');
        return;
      }
      
      // Create new note HTML element
      const note = document.createElement('div');
      note.className = `anonymous-note note-color-${selectedColorIndex} reveal-scale-in`;
      
      // Calculate random rotation between -3 and +3 degrees
      const rotation = (Math.random() * 6 - 3).toFixed(1);
      const translateVal = (Math.random() * 6 - 3).toFixed(0);
      note.style.transform = `rotate(${rotation}deg) translateY(${translateVal}px)`;
      
      // Select pin color based on note count or randomly
      const pinColors = ['#ff6b6b', '#5c7cfa', '#fcc419', '#12b886', '#e03131', '#1971c2'];
      const randomPinColor = pinColors[Math.floor(Math.random() * pinColors.length)];
      
      note.innerHTML = `
        <div class="note-pin" style="background: radial-gradient(circle at 30% 30%, ${randomPinColor}, rgba(0,0,0,0.5))"></div>
        <p class="note-content">"${text}"</p>
        <div class="note-footer">
          <span class="note-tag">#Support</span>
          <span class="note-author">Anonymous</span>
        </div>
      `;
      
      // Prepend to board
      board.insertBefore(note, board.firstChild);
      
      // Add animate class after insertion
      setTimeout(() => {
        note.classList.add('reveal-active');
      }, 50);
      
      // Clear textarea
      textarea.value = '';
      
      // Re-trigger lucide icons if applicable
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
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
