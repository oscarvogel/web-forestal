// Animación al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-animation');
            entry.target.classList.remove('section-hidden');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-hidden').forEach((element) => {
    observer.observe(element);
});

(function initHeroVideo(){
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const playHeroVideo = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.setAttribute('data-autoplay-blocked', 'true');
      });
    }
  };

  playHeroVideo();
  video.addEventListener('loadeddata', playHeroVideo, { once: true });
  video.addEventListener('canplay', playHeroVideo, { once: true });
  window.setTimeout(playHeroVideo, 250);
  window.setTimeout(playHeroVideo, 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused) {
      playHeroVideo();
    }
  });
})();

(function showContactStatus(){
  const params = new URLSearchParams(window.location.search);
  const status = params.get('contacto');
  const box = document.getElementById('contact-status');
  if (!status || !box) return;

  const ok = status === 'enviado';
  box.textContent = ok
    ? 'Gracias. Tu consulta fue enviada correctamente.'
    : 'No pudimos enviar la consulta. Por favor, revisa los datos o escribinos a secretaria@forestalgaruhape.com.ar.';
  box.classList.remove('hidden');
  box.classList.add('text-white');
  box.style.backgroundColor = ok ? '#059669' : '#dc2626';
})();

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    // update accessible attributes
    if(btn) btn.setAttribute('aria-expanded', String(isHidden));
    mobileMenu.setAttribute('aria-hidden', String(!isHidden));
  }

  // Cierra el menú móvil al hacer clic fuera
  document.addEventListener('click', function(event) {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu || !mobileMenuButton) return;
    if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Open/close with keyboard on the toggle button (Enter / Space)
  document.addEventListener('keydown', function(e){
    const btn = document.getElementById('mobile-menu-button');
    if(!btn) return;
    if(document.activeElement === btn && (e.key === 'Enter' || e.key === ' ')){
      e.preventDefault();
      toggleMobileMenu();
    }
  });

// Header remains transparent by design (no scroll toggling)

  // Simple gallery slider (autoplay + controls)
  (function initGallerySliders(){
    const sliders = document.querySelectorAll('.gallery-slider');
    if(!sliders.length) return;

    sliders.forEach(slider => {
      const viewport = slider.querySelector('.slider-viewport');
      const slidesEl = slider.querySelector('.slides');
      const slides = Array.from(slider.querySelectorAll('.slide'));
      const prev = slider.querySelector('.slider-prev');
      const next = slider.querySelector('.slider-next');
      const dotsContainer = slider.querySelector('.slider-dots');

      const visibleCount = 4;
      const total = slides.length;
      const pages = Math.max(1, Math.ceil(total / visibleCount));
      let pageIndex = 0;
      let interval = null;

      function setupSizes(){
        const viewportWidth = viewport.clientWidth;
        const computed = getComputedStyle(slidesEl);
        const gap = parseFloat(computed.gap) || 0;
        const slideWidth = Math.floor((viewportWidth - gap * (visibleCount - 1)) / visibleCount);
        slides.forEach(s => { s.style.width = `${slideWidth}px`; });
        const totalWidth = (slideWidth * total) + (gap * (total - 1));
        slidesEl.style.width = `${totalWidth}px`;
        // store pageWidth for translations
        slider._pageWidth = (slideWidth * visibleCount) + (gap * (visibleCount - 1));
      }

      function renderDots(){
        dotsContainer.innerHTML = '';
        for(let i=0;i<pages;i++){
          const btn = document.createElement('button');
          btn.className = 'dot w-3 h-3 rounded-full bg-slate-300';
          btn.setAttribute('aria-label', `Página ${i+1}`);
          btn.addEventListener('click', ()=>{ go(i); start(); });
          dotsContainer.appendChild(btn);
        }
      }

      function go(page){
        pageIndex = (page % pages + pages) % pages;
        const x = slider._pageWidth * pageIndex || 0;
        slidesEl.style.transform = `translateX(-${x}px)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d,di)=> d.classList.toggle('bg-blue-600', di === pageIndex));
      }

      function start(){ stop(); interval = setInterval(()=> go(pageIndex + 1), 3500); }
      function stop(){ if(interval) clearInterval(interval); interval = null; }

      prev?.addEventListener('click', ()=>{ go(pageIndex - 1); start(); });
      next?.addEventListener('click', ()=>{ go(pageIndex + 1); start(); });
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);

      // init
      renderDots();
      setupSizes();
      window.addEventListener('resize', ()=> { setupSizes(); go(pageIndex); });
      go(0);
      start();
    });
  })();
