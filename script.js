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

const admissionForm = document.querySelector('#admission-form');
const parentNameInput = admissionForm?.querySelector('input[name="parent_name"]');
const phoneInput = admissionForm?.querySelector('input[name="phone"]');
const gradeSelect = admissionForm?.querySelector('select[name="grade"]');
const profileSelect = admissionForm?.querySelector('select[name="profile"]');
const commentInput = admissionForm?.querySelector('textarea[name="comment"]');
const PROFILE_MIN_GRADE = 7;

const sanitizeParentName = (rawValue) => {
  return rawValue
    .replace(/[^A-Za-zА-Яа-яЁё\s-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, '-')
    .replace(/(^[ -]+|[ -]+$)/g, '');
};

const validateParentName = () => {
  if (!parentNameInput) {
    return true;
  }
  parentNameInput.value = sanitizeParentName(parentNameInput.value);
  const value = parentNameInput.value.trim();
  const isValid = /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/.test(value) && value.length >= 2;
  parentNameInput.setCustomValidity(isValid ? '' : 'Введите ФИО без цифр и лишних символов.');
  return isValid;
};

const normalizePhoneDigits = (rawValue) => {
  const digitsOnly = rawValue.replace(/\D/g, '');
  if (!digitsOnly) {
    return '';
  }
  let normalized = digitsOnly;
  if (normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`;
  } else if (normalized.startsWith('9')) {
    normalized = `7${normalized}`;
  } else if (!normalized.startsWith('7') && normalized.length === 10) {
    normalized = `7${normalized}`;
  } else if (!normalized.startsWith('7')) {
    normalized = `7${normalized.slice(1)}`;
  }
  return normalized.slice(0, 11);
};

const formatPhone = (digits) => {
  if (!digits) {
    return '';
  }
  const partCode = digits.slice(1, 4);
  const partMain = digits.slice(4, 7);
  const partA = digits.slice(7, 9);
  const partB = digits.slice(9, 11);
  let formatted = '+7';
  if (partCode) {
    formatted += ` (${partCode}`;
    if (partCode.length === 3) {
      formatted += ')';
    }
  }
  if (partMain) {
    formatted += ` ${partMain}`;
  }
  if (partA) {
    formatted += `-${partA}`;
  }
  if (partB) {
    formatted += `-${partB}`;
  }
  return formatted;
};

const validatePhone = () => {
  if (!phoneInput) {
    return true;
  }
  const normalizedDigits = normalizePhoneDigits(phoneInput.value);
  phoneInput.value = formatPhone(normalizedDigits);
  const isValid = normalizedDigits.length === 11 && normalizedDigits.startsWith('7');
  phoneInput.setCustomValidity(isValid ? '' : 'Введите телефон в формате +7 (999) 123-45-67.');
  return isValid;
};

const syncProfileByGrade = () => {
  if (!gradeSelect || !profileSelect) {
    return true;
  }
  const grade = Number.parseInt(gradeSelect.value, 10);
  if (Number.isNaN(grade)) {
    profileSelect.disabled = true;
    profileSelect.required = false;
    profileSelect.value = 'none';
    profileSelect.setCustomValidity('');
    return true;
  }

  const shouldEnableProfile = grade >= PROFILE_MIN_GRADE;
  profileSelect.disabled = !shouldEnableProfile;
  profileSelect.required = shouldEnableProfile;

  if (!shouldEnableProfile) {
    profileSelect.value = 'none';
    profileSelect.setCustomValidity('');
    return true;
  }

  const profileIsValid = profileSelect.value !== 'none';
  profileSelect.setCustomValidity(profileIsValid ? '' : 'Профиль можно выбрать только с 7 класса. Выберите профиль.');
  return profileIsValid;
};

const sanitizeComment = () => {
  if (!commentInput) {
    return;
  }
  commentInput.value = commentInput.value.replace(/[<>]/g, '');
};

parentNameInput?.addEventListener('input', () => {
  validateParentName();
});

phoneInput?.addEventListener('input', () => {
  validatePhone();
});

gradeSelect?.addEventListener('change', () => {
  syncProfileByGrade();
});

profileSelect?.addEventListener('change', () => {
  syncProfileByGrade();
});

commentInput?.addEventListener('input', () => {
  sanitizeComment();
});

if (admissionForm) {
  syncProfileByGrade();
  admissionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isNameValid = validateParentName();
    const isPhoneValid = validatePhone();
    const isProfileValid = syncProfileByGrade();
    sanitizeComment();
    if (!isNameValid || !isPhoneValid || !isProfileValid) {
      admissionForm.reportValidity();
      return;
    }
    admissionForm.reportValidity();
  });
}

document.querySelectorAll('.form-grid:not(#admission-form)').forEach((form) => {
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
