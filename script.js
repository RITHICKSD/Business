/* ════════════════════════════════════════════════════════════
   NEXELRA CONSULTING — INTERACTIONS & ANIMATIONS
   ════════════════════════════════════════════════════════════ */
'use strict';

/* ── HELPERS ──────────────────────────────────────────────── */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════════
   1. NAVBAR — scroll shrink
   ══════════════════════════════════════════════════════════════ */
const navbar = qs('#navbar');
const btop = qs('#backTop');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  if (btop) btop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

/* ══════════════════════════════════════════════════════════════
   2. MOBILE DRAWER — hamburger / close / overlay
   ══════════════════════════════════════════════════════ */
const hamburger = qs('#hamburger');
const mobileDrawer = qs('#mobileDrawer');

/* Create a dark overlay behind the drawer */
const overlay = document.createElement('div');
overlay.className = 'drawer-overlay';
document.body.appendChild(overlay);

function openDrawer() {
  if (!mobileDrawer || !hamburger) return;
  mobileDrawer.classList.add('open');
  overlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  if (!mobileDrawer || !hamburger) return;
  mobileDrawer.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileDrawer) {
  hamburger.addEventListener('click', () => {
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}

/* Close button (X) inside drawer */
const drawerClose = qs('#drawerClose');
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

/* Click overlay to close */
overlay.addEventListener('click', closeDrawer);

/* Close when a plain (non-toggle) drawer link is clicked */
if (mobileDrawer) {
  qsa('.drawer-link:not(.sub-toggle)', mobileDrawer).forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Global cleanup for mobile drawer on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* Mobile sub-menus (HOME & DASHBOARD) */
function initSubToggle(btnId, subId) {
  const btn = qs(`#${btnId}`);
  const sub = qs(`#${subId}`);
  if (!btn || !sub) return;
  btn.addEventListener('click', () => {
    const isOpen = sub.classList.toggle('open');
    btn.closest('.drawer-item').classList.toggle('sub-open', isOpen);
  });
}
initSubToggle('mobileHomeToggle', 'mobileHomeSub');
initSubToggle('mobileDashToggle', 'mobileDashSub');

/* ══════════════════════════════════════════════════════════════
   3. GLOBE BUTTON — LTR / RTL TOGGLE
   ══════════════════════════════════════════════════════════════ */
function toggleRtl() {
  const html = document.documentElement;
  const isRtl = html.getAttribute('dir') === 'rtl';

  // Instant switch — disable transitions/animations momentarily
  html.classList.add('no-transition');
  document.body.classList.add('no-transition');

  html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');

  const globe = qs('#globeBtn');
  if (globe) globe.style.transform = isRtl ? 'rotate(0deg)' : 'rotate(180deg)';

  // Tiny delay to allow reflow, then re-enable
  setTimeout(() => {
    html.classList.remove('no-transition');
    document.body.classList.remove('no-transition');
  }, 10);
}

const globeBtn = qs('#globeBtn');
if (globeBtn) globeBtn.addEventListener('click', toggleRtl);

const drawerGlobe = qs('#drawerGlobe');
if (drawerGlobe) drawerGlobe.addEventListener('click', toggleRtl);

/* ══════════════════════════════════════════════════════════════
   4. THEME TOGGLE — DARK / LIGHT
   ══════════════════════════════════════════════════════════════ */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');

  // Animation lock like RTL
  body.classList.add('no-transition');
  setTimeout(() => body.classList.remove('no-transition'), 10);
}

// Apply saved theme on load
(function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
})();

const themeToggles = document.querySelectorAll('.theme-toggle, #themeBtn, #drawerTheme, #dashTheme');
themeToggles.forEach(btn => {
  btn.addEventListener('click', toggleTheme);
});

/* ══════════════════════════════════════════════════════════════
   5. ANIMATED PARTICLES — Hero & CTA
   ══════════════════════════════════════════════════════════════ */
function createParticles(containerId, count = 35) {
  const container = qs(`#${containerId}`);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const dur = Math.random() * 18 + 8;
    const delay = Math.random() * 10;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.45 + 0.05;

    Object.assign(p.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `rgba(212,175,55,${opacity})`,
      left: `${x}%`,
      top: `${y}%`,
      animation: `particleDrift ${dur}s ${delay}s linear infinite`,
      boxShadow: size > 2.5 ? `0 0 ${size * 2}px rgba(212,175,55,${opacity})` : 'none',
    });
    container.appendChild(p);
  }
}

/* Inject particle keyframe once */
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleDrift {
    0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: 1; }
    25%  { transform: translateY(-28px) translateX(12px) scale(1.15); }
    50%  { transform: translateY(-14px) translateX(-10px) scale(.85); opacity:.5; }
    75%  { transform: translateY(-36px) translateX(8px) scale(1.1); }
    100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 1; }
  }
`;
document.head.appendChild(particleStyle);

createParticles('heroParticles', 40);
createParticles('ctaParticles', 28);

/* ══════════════════════════════════════════════════════════════
   5. INTERSECTION OBSERVER — AOS (Animate On Scroll)
   ══════════════════════════════════════════════════════════════ */
const AOSObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.style.getPropertyValue('--delay') || '0s';
      setTimeout(() => {
        el.classList.add('animated');
      }, parseFloat(delay) * 1000);
      AOSObserver.unobserve(el);
    }
  });
}, { threshold: 0.10 });

qsa('[data-aos]').forEach(el => AOSObserver.observe(el));

/* ══════════════════════════════════════════════════════════════
   6. COUNTER ANIMATION — hero & impact sections
   ══════════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  const dur = 2200;
  const step = 16;
  const steps = dur / step;
  let current = 0;

  const timer = setInterval(() => {
    current += target / steps;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
  }, step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

qsa('.stat-number, .count').forEach(el => counterObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   7. PILLAR PROGRESS BARS
   ══════════════════════════════════════════════════════════════ */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

qsa('.pillar-card').forEach(el => barObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   8. TESTIMONIALS CAROUSEL
   ══════════════════════════════════════════════════════════════ */
(function initCarousel() {
  const track = qs('#testiTrack');
  if (!track) return;

  const cards = qsa('.testi-card', track);
  const total = cards.length;
  const dots = qs('#testiDots');
  let index = 0;
  let timer;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `testi-dot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goTo(i));
    if (dots) dots.appendChild(dot);
  });

  function goTo(n) {
    index = (n + total) % total;
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const sign = isRtl ? 1 : -1;
    track.style.transform = `translateX(${sign * index * 100}%)`;
    if (dots) qsa('.testi-dot', dots).forEach((d, i) => d.classList.toggle('active', i === index));
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6000);
  }

  const prevBtn = qs('#testiPrev');
  const nextBtn = qs('#testiNext');
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

  /* Touch/swipe support */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? index + 1 : index - 1);
  });

  resetTimer();
})();

/* ══════════════════════════════════════════════════════════════
   9. NEWSLETTER FORM
   ══════════════════════════════════════════════════════════════ */
const newsletterForm = qs('#newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = qs('#emailInput');
    if (!input) return;
    const val = input.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRe.test(val)) {
      input.style.borderColor = '#e05c5c';
      input.style.boxShadow = '0 0 0 3px rgba(224,92,92,.15)';
      input.placeholder = 'Please enter a valid email';
      input.value = '';
      return;
    }

    const btn = this.querySelector('.newsletter-btn');
    if (btn) {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'linear-gradient(135deg,#4CAF50,#388E3C)';
    }
    input.value = '';
    input.style.borderColor = '';
    input.style.boxShadow = '';
    input.placeholder = 'Enter your business email';

    if (btn) {
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 4000);
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   10. BACK TO TOP
   ══════════════════════════════════════════════════════════════ */
const backTopBtn = qs('#backTop');
if (backTopBtn) {
  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   11. ACTIVE NAV LINK — highlight based on section in view
   ══════════════════════════════════════════════════════════════ */
const sections = qsa('section[id]');
const navLinks = qsa('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.style.color = href === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));

/* ══════════════════════════════════════════════════════════════
   12. SMOOTH ANCHOR SCROLL
   ══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // Ignore empty hashes

    try {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    } catch (err) {
      // Ignore invalid selectors gracefully
    }
  });
});
/* ══════════════════════════════════════════════════════════════
   13. CURSOR GLOW (desktop only)
   ══════════════════════════════════════════════════════════════ */
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9999',
    width: '320px', height: '320px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,175,55,.06) 0%, transparent 65%)',
    transform: 'translate(-50%,-50%)', transition: 'left .12s, top .12s',
    left: '-500px', top: '-500px',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* ══════════════════════════════════════════════════════════════
   14. HOVER TILT on cards
   ══════════════════════════════════════════════════════════════ */
qsa('.pillar-card, .industry-card, .case-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease, border-color .3s, box-shadow .3s';
  });
});

/* ══════════════════════════════════════════════════════════════
   15. TYPED TEXT — hero subtitle cycling
   ══════════════════════════════════════════════════════════════ */
(function initTyped() {
  const phrases = [
    'Nexelra empowers world-class enterprises with bespoke strategy, transformative leadership, and precision-engineered growth solutions.',
    'From boardroom strategy to market execution — we architect success at every turn.',
    'Trusted by 340+ global enterprises across 48 countries for 15+ years.',
  ];
  const el = qs('.hero-subtitle');
  if (!el || (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('index2.html'))) return;

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2800); return; }
      setTimeout(type, 28);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 14);
    }
  }

  /* Start after 1.5s */
  setTimeout(type, 1500);
})();

/* ══════════════════════════════════════════════════════════════
   16. DESKTOP DROPDOWNS — click toggle
   ══════════════════════════════════════════════════════════════ */
const dropdownItems = qsa('.nav-item.has-dropdown');

dropdownItems.forEach(item => {
  const link = qs('.nav-link', item);
  if (!link) return;

  link.addEventListener('click', (e) => {
    // Only on desktop view (above 991px)
    if (window.innerWidth > 991) {
      e.preventDefault();
      e.stopPropagation();

      const isActive = item.classList.contains('active-dropdown');

      // Close all other dropdowns
      dropdownItems.forEach(other => {
        if (other !== item) other.classList.remove('active-dropdown');
      });

      if (!isActive) {
        item.classList.add('active-dropdown');
      } else {
        item.classList.remove('active-dropdown');
      }
    }
  });
});

// Close open dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-item.has-dropdown')) {
    dropdownItems.forEach(item => item.classList.remove('active-dropdown'));
  }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropdownItems.forEach(item => item.classList.remove('active-dropdown'));
  }
});

/* ══════════════════════════════════════════════════════════════
   17. GLOBAL DASHBOARD CONTROLS
   ══════════════════════════════════════════════════════════════ */
function initDashboard() {
  const dashSidebar = qs('#dashSidebar');
  const dashMenuBtn = qs('#dashMenuToggle');
  const dashCloseBtn = qs('#dashSidebarClose');
  const dashLinks = qsa('.side-link[data-tab]');
  const dashTabs = qsa('.tab-content');
  const dashTitle = qs('#currentTabTitle');

  // Skip if not on dashboard page
  if (!dashSidebar && !dashMenuBtn && dashLinks.length === 0) return;

  // Create Overlay for Mobile
  let dashOverlay = qs('.dash-overlay');
  if (!dashOverlay) {
    dashOverlay = document.createElement('div');
    dashOverlay.className = 'dash-overlay';
    document.body.appendChild(dashOverlay);
  }

  function openDashSidebar() {
    if (!dashSidebar) return;
    dashSidebar.classList.add('active');
    if (dashOverlay) dashOverlay.classList.add('active');
    if (dashMenuBtn) dashMenuBtn.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  function closeDashSidebar() {
    if (!dashSidebar) return;
    dashSidebar.classList.remove('active');
    if (dashOverlay) dashOverlay.classList.remove('active');
    if (dashMenuBtn) dashMenuBtn.style.display = 'flex';
    document.body.style.overflow = '';
  }

  // Show/Hide close button based on screen size + State cleanup for desktop transition
  function handleResize() {
    if (dashCloseBtn) {
      dashCloseBtn.style.display = window.innerWidth <= 991 ? 'flex' : 'none';
    }

    // If transitioning to desktop view, ensure body scroll is restored and state is clean
    if (window.innerWidth > 991) {
      if (document.body.style.overflow === 'hidden' && dashSidebar.classList.contains('active')) {
        closeDashSidebar();
      }
    }
  }

  handleResize();
  window.addEventListener('resize', handleResize);

  // Mobile Toggle logic
  if (dashMenuBtn) {
    dashMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDashSidebar();
    });
  }

  // Close Button logic
  if (dashCloseBtn) {
    dashCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDashSidebar();
    });
  }

  // Overlay click to close
  if (dashOverlay) {
    dashOverlay.addEventListener('click', closeDashSidebar);
  }

  // Tab Switching Logic
  dashLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-tab');
      if (!targetId) return;

      const targetContent = qs(`#${targetId}`);
      if (!targetContent) return;

      // Update Links and Tabs
      dashLinks.forEach(l => l.classList.remove('active'));
      dashTabs.forEach(t => t.classList.remove('active'));

      link.classList.add('active');
      targetContent.classList.add('active');

      // Update Title
      if (dashTitle) {
        const span = link.querySelector('span');
        if (span) dashTitle.textContent = span.textContent;
      }

      // Auto-close sidebar on mobile
      if (window.innerWidth <= 991) {
        closeDashSidebar();
      }
    });
  });

  // Dashboard Globe RTL
  const dashGlobe = qs('#dashGlobe');
  if (dashGlobe) {
    dashGlobe.addEventListener('click', (e) => {
      e.preventDefault();
      toggleRtl();
    });
  }
}

// Ensure the dashboard logic runs regardless of load order
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

/* ══════════════════════════════════════════════════════════════
   15. ACTIVE PAGE DETECTION
   ══════════════════════════════════════════════════════════════ */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const fileName = currentPath.split('/').pop() || 'index.html';

  // Desktop Links
  qsa('.nav-link, .dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === fileName) {
      link.classList.add('active');
      // If it's a dropdown item, also highlight the parent
      const parentDropdown = link.closest('.nav-item.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // Mobile Links
  qsa('.drawer-link, .drawer-sub-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === fileName) {
      link.classList.add('active');
      // If it's a sub-link, open the parent sub-menu
      const parentSub = link.closest('.drawer-sub');
      if (parentSub) {
        parentSub.classList.add('open');
        const parentItem = parentSub.closest('.drawer-item');
        if (parentItem) parentItem.classList.add('sub-open');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', highlightActiveNav);
