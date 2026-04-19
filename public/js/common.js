// ---- NAVBAR scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});
// ---- HAMBURGER MENU (top dropdown) ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = navLinks.querySelectorAll('li');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  document.body.classList.add('menu-open');
  navItems.forEach((item, i) => {
    item.style.transitionDelay = `${0.06 + i * 0.07}s`;
    setTimeout(() => item.classList.add('revealed'), 20);
  });
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  navItems.forEach(item => {
    item.classList.remove('revealed');
    item.style.transitionDelay = '0s';
  });
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMenu();
  }
});
    // ---- ABOUT DROPDOWN — mobile tap toggle ----
const aboutDropdown = document.getElementById('aboutDropdown');
const dropTrigger   = aboutDropdown.querySelector('.dropdown-trigger');

dropTrigger.addEventListener('click', function (e) {
  if (window.innerWidth <= 768) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = aboutDropdown.classList.toggle('mobile-open');
    this.setAttribute('aria-expanded', isOpen);
  }
});

const _origClose = closeMenu;
closeMenu = function () {
  _origClose();
  aboutDropdown.classList.remove('mobile-open');
  dropTrigger.setAttribute('aria-expanded', 'false');
};

// ---- HERO SLIDER ----
let heroIndex = 0;
const heroSlider = document.getElementById('slider');
const heroSlides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');

if (heroSlider && heroSlides.length > 0) {
  const totalSlides = heroSlides.length;

  heroSlides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToSlide(i));
    if (dotsContainer) dotsContainer.appendChild(d);
  });

  function goToSlide(i) {
    heroIndex = i;
    heroSlider.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
    });
  }

  let autoSlide = setInterval(() => {
    goToSlide((heroIndex + 1) % totalSlides);
  }, 5000);

  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(autoSlide);
      goToSlide((heroIndex + 1) % totalSlides);
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(autoSlide);
      goToSlide((heroIndex - 1 + totalSlides) % totalSlides);
    });
  }
}

// ---- CARDS SLIDERS ----
function initCardsSlider(trackId, prevBtn, nextBtn) {
  const track = document.getElementById(trackId);
  const card = track.querySelector('.pkg-card');
  if (!card) return;
  const gap = 28;
  let pos = 0;

  function getCardWidth() {
    return card.getBoundingClientRect().width + gap;
  }

  document.querySelector(prevBtn).addEventListener('click', () => {
    pos = Math.max(pos - getCardWidth(), 0);
    track.style.transform = `translateX(-${pos}px)`;
  });
  document.querySelector(nextBtn).addEventListener('click', () => {
    const max = track.scrollWidth - track.parentElement.clientWidth;
    pos = Math.min(pos + getCardWidth(), max);
    track.style.transform = `translateX(-${pos}px)`;
  });
}

initCardsSlider('travelTrack', '.cards-prev:not(.cards-prev-work)', '.cards-next:not(.cards-next-work)');
initCardsSlider('workTrack', '.cards-prev-work', '.cards-next-work');

// ---- CONTACT FORM ----
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('formSuccess').style.display = 'block';
  e.target.reset();
  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'none';
  }, 5000);
}
