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

// Enhanced preloader: animated progress, rotating status messages, minimum display time.
const preloader = document.querySelector('#preloader');
if (preloader) {
  const progressFill = document.querySelector('#loader-progress-fill');
  const percentLabel = document.querySelector('#loader-percent');
  const statusLabel = document.querySelector('#loader-status');
  const statusMessages = ['INITIALIZING INTERFACE', 'LOADING COMPONENTS', 'PREPARING PROJECTS', 'SYSTEM READY'];
  const startTime = Date.now();
  let progress = 0;
  let pageLoaded = false;
  let dismissed = false;
  const renderProgress = (value) => {
    progress = Math.min(100, Math.max(progress, value));
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (percentLabel) percentLabel.textContent = `${String(Math.round(progress)).padStart(2, '0')}%`;
    if (statusLabel) statusLabel.textContent = statusMessages[Math.min(3, Math.floor(progress / 26))];
  };
  const progressTimer = window.setInterval(() => {
    if (!pageLoaded && progress < 92) renderProgress(progress + (progress < 45 ? 2.4 : progress < 75 ? 1.1 : .45));
    if (pageLoaded && progress < 100) renderProgress(progress + 4);
    if (pageLoaded && progress >= 100 && Date.now() - startTime >= 900 && !dismissed) {
      dismissed = true;
      window.clearInterval(progressTimer);
      preloader.classList.add('is-hidden');
    }
  }, 35);
  const finishLoading = () => { pageLoaded = true; renderProgress(100); };
  window.addEventListener('load', finishLoading, { once: true });
  window.setTimeout(() => { pageLoaded = true; renderProgress(100); }, 4200);
}

// Premium interaction layer: custom cursor, subtle 3D tilt, and restrained glitch.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const heroVisual = document.querySelector('.visual');
  const idCard = document.querySelector('.idcard');
  document.body.classList.add('glitch-ready');
  if (!reduceMotion && finePointer) {
    document.body.classList.add('cyber-cursor');
    const core = document.createElement('div'); core.className = 'cursor-core'; core.setAttribute('aria-hidden','true');
    const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.setAttribute('aria-hidden','true');
    document.body.append(core, ring);
    window.addEventListener('pointermove', e => { core.style.left = `${e.clientX}px`;core.style.top = `${e.clientY}px`;ring.style.left = `${e.clientX}px`;ring.style.top = `${e.clientY}px`;core.classList.add('active');ring.classList.add('active'); }, {passive:true});
    document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('hovering'));el.addEventListener('pointerleave',()=>ring.classList.remove('hovering'));});
    if(heroVisual && idCard){heroVisual.addEventListener('pointermove',e=>{const r=heroVisual.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;idCard.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*8}deg) translateZ(5px)`;});heroVisual.addEventListener('pointerleave',()=>idCard.style.transform='');}
  }
})();


// Lightweight cyber particle network background and staggered project reveals.
(() => {
  const canvas = document.getElementById('cyber-network');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  let w=0,h=0,dpr=1,particles=[],raf=0;
  const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(85,Math.max(28,Math.round(w*h/18000)));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.5}));};
  const draw=()=>{ctx.clearRect(0,0,w,h);for(let i=0;i<particles.length;i++){const a=particles[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;ctx.fillStyle='rgba(0,229,255,.55)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();for(let j=i+1;j<particles.length;j++){const b=particles[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);if(dist<115){ctx.strokeStyle=`rgba(0,229,255,${.12*(1-dist/115)})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}raf=requestAnimationFrame(draw);};
  resize();draw();window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});
})();

(() => {
  const cards=document.querySelectorAll('#projects .project');
  cards.forEach((card,i)=>card.style.setProperty('--reveal-delay',`${(i%3)*90}ms`));
})();
