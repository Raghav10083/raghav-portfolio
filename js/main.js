/* ==========================================================================
   Raghav Mathur Portfolio - Interactive Client Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initMobileMenu();
  initJourneyTimeline();
  initProjectTabs();
  initAudioPlayer();
  initScrollReveal();
  initContactForm();
  initHeaderScroll();
});

/* --------------------------------------------------------------------------
   Header scroll styling
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   Particle Background Canvas System
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = { x: null, y: null, radius: 120 };

  // Track cursor position
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);

  // Particle Class Definition
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off screen boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse cursor collision (push away slightly)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 3;
          let directionY = forceDirectionY * force * 3;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate particles list based on window area size
  function initParticles() {
    particlesArray = [];
    let numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles
    
    // Gradient accent colors
    const colors = [
      'rgba(108, 92, 231, 0.35)', // Purple
      'rgba(0, 242, 153, 0.35)',  // Mint
      'rgba(0, 210, 255, 0.35)'   // Blue
    ];

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1.5;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = colors[Math.floor(Math.random() * colors.length)];

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw connecting visual lines between neighboring particles
  function connectParticles() {
    let maxDistance = 140;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Connect line opacity drops as distance increases
          let opacity = (1 - (distance / maxDistance)) * 0.12;
          ctx.strokeStyle = `rgba(164, 164, 193, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Core Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
}

/* --------------------------------------------------------------------------
   Mobile Navigation Toggle Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Timeline ("My Journey")
   -------------------------------------------------------------------------- */
const TIMELINE_DATA = [
  {
    num: "01 // MUSIC PRODUCTION",
    title: "Music Production",
    desc: "Started exploring creative production through music and audio creation. Learned how sound influences emotion, storytelling, and audience engagement. Built a foundation in structure, rhythm, and acoustic pacing which directly informs user retention.",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
           </svg>`
  },
  {
    num: "02 // VISUAL ASSET DESIGN",
    title: "Asset Design",
    desc: "Expanded into visual creation and asset development. Worked on designing high-quality game assets, texturing, character/environment consistency, and understanding complex asset production pipelines.",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
           </svg>`
  },
  {
    num: "03 // GAME DEVELOPMENT",
    title: "Game Development",
    desc: "Began exploring game design, core gameplay loops, progression systems, publishing platforms, and player experience design. Shifted focus toward transforming static design concepts into fun, responsive, playable experiences.",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
           </svg>`
  },
  {
    num: "04 // PUBLISHING & OPERATIONS",
    title: "Publishing & Product Development",
    desc: "Mastered mobile store publishing workflows, ad integrations (AdMob), telemetry tracking, user acquisition, product roadmap planning, monetization systems, and live operations (LiveOps) strategy for competitive mobile environments.",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
           </svg>`
  },
  {
    num: "05 // TXNB STUDIOS FOUNDATION",
    title: "TXnB Studios",
    desc: "Founded TXnB Studios with a vision of constructing high-fidelity indie games, gaming communities, digital media products, and creative experiences. Leading development pipelines, collaborative jam ecosystems, and scaling studio vision.",
    icon: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.2 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
           </svg>`
  }
];

function initJourneyTimeline() {
  const nodes = document.querySelectorAll('.timeline-node');
  const progressFill = document.getElementById('timeline-progress');
  const card = document.getElementById('timeline-detail-card');
  const detailNum = document.getElementById('timeline-detail-num');
  const detailTitle = document.getElementById('timeline-detail-title');
  const detailDesc = document.getElementById('timeline-detail-desc');
  const detailIcon = document.getElementById('timeline-detail-icon');

  if (!progressFill || !card || nodes.length === 0) return;

  // Set initial icon and status
  detailIcon.innerHTML = TIMELINE_DATA[0].icon;

  function updateTimeline(index) {
    // 1. Update active nodes classes
    nodes.forEach(node => {
      const nodeIndex = parseInt(node.getAttribute('data-index'));
      if (nodeIndex <= index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // 2. Adjust connecting fill bar percentage
    const fillPercent = (index / (nodes.length - 1)) * 100;
    progressFill.style.width = `${fillPercent}%`;

    // 3. Fade out card, switch values, fade in
    card.classList.add('fade-out');

    setTimeout(() => {
      const data = TIMELINE_DATA[index];
      detailNum.textContent = data.num;
      detailTitle.textContent = data.title;
      detailDesc.textContent = data.desc;
      detailIcon.innerHTML = data.icon;
      card.classList.remove('fade-out');
    }, 300);
  }

  // Click event triggers update
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const index = parseInt(node.getAttribute('data-index'));
      updateTimeline(index);
    });
  });
}

/* --------------------------------------------------------------------------
   Tabs Navigation UI (Project 01)
   -------------------------------------------------------------------------- */
function initProjectTabs() {
  const tabHeader = document.querySelector('.project-tab-header');
  if (!tabHeader) return;

  const tabButtons = tabHeader.querySelectorAll('.project-tab-btn');
  const showcaseCard = tabHeader.closest('.project-showcase');
  const tabContents = showcaseCard.querySelectorAll('.project-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update active btn status
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update visibility of content blocks
      tabContents.forEach(content => {
        if (content.id === targetTabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Premium Audio Player (Project 02)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const triggerBtn = document.getElementById('audio-play-trigger');
  const visualizer = document.getElementById('audio-bars');
  const audioFill = document.getElementById('audio-fill');
  const audio = document.getElementById('bg-music-mock');

  if (!triggerBtn || !audio) return;

  const playSvg = triggerBtn.querySelector('.play-svg');
  const pauseSvg = triggerBtn.querySelector('.pause-svg');

  let durationSimVal = 0;
  let simulatedTimer = null;

  function togglePlayState() {
    if (audio.paused) {
      // Play Audio
      audio.play().then(() => {
        visualizer.classList.add('playing');
        playSvg.classList.add('hide');
        pauseSvg.classList.remove('hide');
        startProgressTracking();
      }).catch(e => {
        // Fallback simulation if browser blocks autoplay/playback due to user gesture missing
        simulatePlayback();
      });
    } else {
      // Pause Audio
      audio.pause();
      visualizer.classList.remove('playing');
      playSvg.classList.remove('hide');
      pauseSvg.classList.add('hide');
      stopProgressTracking();
    }
  }

  function simulatePlayback() {
    if (visualizer.classList.contains('playing')) {
      // Pause simulation
      visualizer.classList.remove('playing');
      playSvg.classList.remove('hide');
      pauseSvg.classList.add('hide');
      clearInterval(simulatedTimer);
    } else {
      // Start simulation
      visualizer.classList.add('playing');
      playSvg.classList.add('hide');
      pauseSvg.classList.remove('hide');
      
      simulatedTimer = setInterval(() => {
        durationSimVal += 0.5;
        if (durationSimVal > 100) {
          durationSimVal = 0;
        }
        audioFill.style.width = `${durationSimVal}%`;
      }, 100);
    }
  }

  function startProgressTracking() {
    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', resetPlayerState);
  }

  function stopProgressTracking() {
    audio.removeEventListener('timeupdate', updateProgressBar);
  }

  function updateProgressBar() {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      audioFill.style.width = `${percent}%`;
    }
  }

  function resetPlayerState() {
    visualizer.classList.remove('playing');
    playSvg.classList.remove('hide');
    pauseSvg.classList.add('hide');
    audioFill.style.width = '0%';
  }

  triggerBtn.addEventListener('click', togglePlayState);
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animation (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // default: viewport
    threshold: 0.15, // trigger when 15% visible
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // stop observing once animated
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Contact Form Submit Validation & Mock feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-portfolio-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable button, show progress animation
    submitBtn.disabled = true;
    const btnSpan = submitBtn.querySelector('span');
    const oldText = btnSpan.textContent;
    btnSpan.textContent = 'Sending...';

    // Simulate sending payload to server
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      btnSpan.textContent = oldText;
      successMsg.classList.remove('hide');
      
      // Auto-hide success alert
      setTimeout(() => {
        successMsg.classList.add('hide');
      }, 5000);
    }, 1500);
  });
}
