const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    }
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.mobile-menu__link');
const navBackdrop = document.querySelector('.mobile-menu-backdrop');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const scrollTopButton = document.querySelector('[data-scroll-top]');
const MOBILE_NAV_CLOSE_ANIMATION_MS = 420;
const SCROLL_TOP_SHOW_OFFSET = 240;
let mobileNavCloseTimer = null;
const SCROLL_BASE_DURATION_MS = 950;

const easeInOutCubic = (value) => {
  if (value < 0.5) {
    return 4 * value * value * value;
  }
  return 1 - Math.pow(-2 * value + 2, 3) / 2;
};

const smoothScrollToY = (destinationY) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, destinationY);
    return;
  }

  const startY = window.scrollY;
  const distance = destinationY - startY;
  if (Math.abs(distance) < 2) {
    return;
  }

  const duration = Math.min(1450, Math.max(550, SCROLL_BASE_DURATION_MS + Math.abs(distance) * 0.16));
  const startTime = performance.now();

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - startTime) / duration);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, Math.round(startY + distance * easedProgress));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

const updateScrollTopVisibility = () => {
  if (!scrollTopButton) {
    return;
  }
  scrollTopButton.classList.toggle('is-visible', window.scrollY > SCROLL_TOP_SHOW_OFFSET);
};

document.body.classList.remove('nav-open');
document.body.classList.remove('nav-closing');

const clearMobileNavState = () => {
  document.body.classList.remove('nav-open', 'nav-closing');
};

const openMobileNav = () => {
  if (!navToggle || !mobileMenu) {
    return;
  }
  if (mobileNavCloseTimer !== null) {
    window.clearTimeout(mobileNavCloseTimer);
    mobileNavCloseTimer = null;
  }
  document.body.classList.remove('nav-closing');
  document.body.classList.add('nav-open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
};

const closeMobileNav = (withAnimation = true) => {
  if (!navToggle || !mobileMenu) {
    return;
  }
  const isOpen = document.body.classList.contains('nav-open');
  const isClosing = document.body.classList.contains('nav-closing');
  if (!isOpen && !isClosing) {
    return;
  }
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (!withAnimation || window.innerWidth > 760) {
    if (mobileNavCloseTimer !== null) {
      window.clearTimeout(mobileNavCloseTimer);
      mobileNavCloseTimer = null;
    }
    clearMobileNavState();
    return;
  }
  document.body.classList.remove('nav-open');
  document.body.classList.add('nav-closing');
  if (mobileNavCloseTimer !== null) {
    window.clearTimeout(mobileNavCloseTimer);
  }
  mobileNavCloseTimer = window.setTimeout(() => {
    document.body.classList.remove('nav-closing');
    mobileNavCloseTimer = null;
  }, MOBILE_NAV_CLOSE_ANIMATION_MS);
};

navToggle?.addEventListener('click', () => {
  if (!mobileMenu) {
    return;
  }
  if (document.body.classList.contains('nav-open')) {
    closeMobileNav(true);
    return;
  }
  openMobileNav();
});

navBackdrop?.addEventListener('click', () => {
  closeMobileNav();
});

mobileMenuClose?.addEventListener('click', () => {
  closeMobileNav();
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeMobileNav(false);
  }
});

window.addEventListener('pageshow', () => {
  closeMobileNav(false);
  updateScrollTopVisibility();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.getAttribute('data-scroll'));
    if (!target) {
      return;
    }
    const destinationY = target.getBoundingClientRect().top + window.scrollY - 12;
    smoothScrollToY(destinationY);
  });
});

document.querySelectorAll('.form-grid').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

scrollTopButton?.addEventListener('click', () => {
  smoothScrollToY(0);
});

let isScrollTopTicking = false;
window.addEventListener(
  'scroll',
  () => {
    if (isScrollTopTicking) {
      return;
    }
    isScrollTopTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollTopVisibility();
      isScrollTopTicking = false;
    });
  },
  { passive: true }
);

updateScrollTopVisibility();

const currentYear = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(currentYear);
});
