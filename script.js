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
const MOBILE_NAV_CLOSE_ANIMATION_MS = 260;
let mobileNavCloseTimer = null;

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
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.getAttribute('data-scroll'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.form-grid').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

const scrollTopButton = document.querySelector('[data-scroll-top]');
scrollTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const currentYear = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(currentYear);
});
