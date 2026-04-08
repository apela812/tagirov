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

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-inline .nav-pill');

if (header && navToggle) {
  header.classList.add('nav-ready');
}

const closeMobileNav = () => {
  if (!header || !navToggle) {
    return;
  }
  header.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  if (!header) {
    return;
  }
  const isOpen = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
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
