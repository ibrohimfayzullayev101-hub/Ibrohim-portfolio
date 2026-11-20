const languageButton = document.querySelector('#language');
const themeButton = document.querySelector('#theme');
const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('nav');
let language = localStorage.getItem('portfolio-language') || 'uz';
const supportedLanguages = ['uz', 'ru', 'en'];
if (!supportedLanguages.includes(language)) language = 'uz';

const applyLanguage = () => {
  document.querySelectorAll('[data-uz]').forEach((element) => {
    const translation = element.dataset[language];
    if (translation !== undefined) element.innerHTML = translation;
  });
  document.querySelectorAll('[data-uz-placeholder]').forEach((element) => {
    const translation = element.dataset[`${language}Placeholder`];
    if (translation !== undefined) element.placeholder = translation;
  });
  document.documentElement.lang = language;
  if (languageButton) {
    languageButton.textContent = language.toUpperCase();
    languageButton.setAttribute('aria-label', `Current language: ${language.toUpperCase()}. Change language`);
  }
};
applyLanguage();

languageButton?.addEventListener('click', () => {
  language = language === 'uz' ? 'ru' : language === 'ru' ? 'en' : 'uz';
  localStorage.setItem('portfolio-language', language);
  applyLanguage();
});

themeButton?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeButton.textContent = document.body.classList.contains('light') ? '☾' : '☼';
});

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '✕' : '☰';
});

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = '☰';
  });
});

document.addEventListener('click', (event) => {
  if (!navigation || !menuButton || !navigation.classList.contains('open')) return;
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

const filterButtons = document.querySelectorAll('.filters [data-filter]');
const projectCards = document.querySelectorAll('.project[data-cat]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((project) => {
      const shouldShow = selectedFilter === 'all' || project.dataset.cat === selectedFilter;
      project.classList.toggle('hidden', !shouldShow);
    });
  });
});

const glow = document.querySelector('.glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}
