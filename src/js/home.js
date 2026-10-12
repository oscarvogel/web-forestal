import { desktopMotion, EASE_IN, EASE_MOVE, LINE_STAGGER, splitLines, registerEases, createReveal, setupLightReveal } from './motion-kit';

export function setupHomeVideo() {
  const hero = document.querySelector('[data-home-hero]');
  if (!hero) return;
  const video = hero.querySelector('[data-home-video-element]');
  const toggle = hero.querySelector('[data-home-video-toggle]');
  const label = hero.querySelector('[data-home-video-label]');
  const status = hero.querySelector('[data-home-video-status]');
  const header = document.querySelector('[data-site-header]');
  const eligibility = window.matchMedia(desktopMotion);
  let visible = true;
  let userPaused = false;
  let enabled = false;
  let failed = false;
  let revision = 0;

  const updateControl = () => {
    const paused = video.paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', `${paused ? 'Reproducir' : 'Pausar'} video de la operación forestal`);
    label.textContent = paused ? 'Reproducir video' : 'Pausar video';
  };
  const fallback = (reason = 'media-error') => {
    failed = true;
    video.dataset.fallbackReason = reason;
    video.dataset.mediaError = video.error ? `${video.error.code}: ${video.error.message}` : '';
    video.pause();
    video.hidden = true;
    if (document.activeElement === toggle) hero.querySelector('.home-scroll-link').focus();
    toggle.hidden = true;
    status.textContent = 'La imagen de la operación sigue visible. El video no está disponible.';
    video.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
    video.load();
  };
  const reconcilePlayback = async () => {
    if (!enabled || failed || userPaused || !visible || document.hidden) {
      video.pause();
      updateControl();
      return;
    }
    const currentRevision = revision;
    try {
      await video.play();
      if (currentRevision !== revision || !enabled || userPaused || !visible || document.hidden) video.pause();
    } catch (error) {
      // Pause during a visibility/size change can abort an outstanding play.
      if (currentRevision === revision && enabled && visible && !document.hidden && !userPaused && error.name !== 'AbortError') fallback(`play-${error.name}`);
    }
    updateControl();
  };
  const configure = () => {
    const nextEnabled = eligibility.matches && !navigator.connection?.saveData;
    if (enabled === nextEnabled) return;
    enabled = nextEnabled;
    revision += 1;
    if (enabled) {
      failed = false;
      video.muted = true;
      video.hidden = false;
      delete video.dataset.ready;
      video.querySelectorAll('source').forEach((source) => { source.src = source.dataset.src; });
      video.load();
      reconcilePlayback();
    } else {
      video.pause();
      delete video.dataset.ready;
      video.hidden = true;
      if (document.activeElement === toggle) hero.querySelector('.home-scroll-link').focus();
      toggle.hidden = true;
      video.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
      video.load();
    }
  };
  video.addEventListener('playing', () => {
    if (!enabled || failed) return;
    video.hidden = false;
    video.dataset.ready = 'true';
    toggle.hidden = false;
    updateControl();
  });
  video.addEventListener('pause', updateControl);
  video.addEventListener('error', () => {
    if (!enabled || failed) return;
    fallback();
  });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    reconcilePlayback();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    reconcilePlayback();
  }, { threshold: 0 }).observe(hero);
  // Header behavior stays independent of the animation engine.
  // Transparent only at the very top: once the hero copy scrolls, it would run under the logo and nav.
  const updateHeader = () => { header.dataset.overHero = String(window.scrollY < 8 && hero.getBoundingClientRect().bottom > header.offsetHeight); };
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  document.addEventListener('visibilitychange', reconcilePlayback);
  eligibility.addEventListener('change', configure);
  navigator.connection?.addEventListener('change', configure);
  updateHeader();
  configure();
}

const HOME_LIGHT_TARGETS = '.home-section-heading, .home-company-top, .home-company-bottom, .home-regional > *, .home-sgc-moments li, .operation-chapter, .home-contact-title, .home-contact-layout, .home-proof .home-section-heading, .home-facts li, .home-clients';

export function setupHomeMotion(gsap, ScrollTrigger, Lenis) {
  registerEases(gsap);
  setupLightReveal(gsap, HOME_LIGHT_TARGETS);
  const operation = document.querySelector('[data-home-operation]');
  if (!operation) return;
  const track = operation.querySelector('[data-operation-track]');
  const frames = [...operation.querySelectorAll('[data-operation-frame]')];
  const chapters = [...operation.querySelectorAll('[data-operation-chapter]')];
  const caption = operation.querySelector('[data-operation-caption]');
  const counter = operation.querySelector('[data-operation-num]');
  const fill = operation.querySelector('[data-operation-fill]');
  if (frames.length < 2 || chapters.length !== frames.length) return;
  gsap.matchMedia().add(desktopMotion, () => {
    let lenis;
    const context = gsap.context(() => {});
    const tick = (time) => lenis.raf(time * 1000);
    try {
      lenis = new Lenis({ smoothWheel: true, syncTouch: false, anchors: { immediate: true }, respectReducedMotion: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.body.classList.add('has-home-motion');
      context.add(() => {
        // Each frame rises over the previous one behind a mask; the previous image keeps drifting underneath.
        gsap.set(frames, { autoAlpha: 1 });
        gsap.set(frames.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
        const sequence = gsap.timeline({
          onUpdate() {
            const index = Math.min(chapters.length - 1, Math.floor(this.time()));
            counter.textContent = String(index + 1).padStart(2, '0');
            caption.textContent = chapters[index].dataset.operationTitle;
            gsap.set(fill, { scaleX: this.progress() });
          },
          scrollTrigger: { trigger: track, start: 'top center', end: 'bottom center', scrub: .6, invalidateOnRefresh: true },
        });
        // A full unit per scene keeps transitions aligned with semantic text blocks.
        sequence.to({}, { duration: chapters.length }, 0);
        frames.forEach((frame, index) => {
          if (index === 0) return;
          const start = index - 1 / 6;
          sequence.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 / 3, ease: EASE_MOVE }, start);
          sequence.fromTo(frame.querySelector('img'), { yPercent: 12 }, { yPercent: 0, duration: 1 / 3, ease: EASE_MOVE }, start);
          sequence.to(frames[index - 1].querySelector('img'), { yPercent: -8, duration: 1 / 3, ease: EASE_MOVE }, start);
        });
        setupHeroEntrance(gsap);
        setupDesktopReveal(gsap, ScrollTrigger, chapters);
        const refresh = () => { if (document.body.classList.contains('has-home-motion')) ScrollTrigger.refresh(); };
        document.fonts?.ready.then(refresh);
        // Lazy photos change the page height after the triggers were measured.
        if (document.readyState === 'complete') refresh(); else window.addEventListener('load', refresh, { once: true });
      });
    } catch (error) {
      context.revert();
      document.body.classList.remove('has-home-motion');
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      console.warn('La operación se presenta en su versión estática.', error);
    }
    return () => {
      context.revert();
      document.body.classList.remove('has-home-motion');
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  });
}

function setupHeroEntrance(gsap) {
  const copy = document.querySelector('[data-home-hero-copy]');
  if (!copy) return;
  const lines = splitLines(copy.querySelector('h1'));
  const meta = copy.querySelector('.home-meta');
  const rest = copy.querySelectorAll('.home-hero-description, .home-hero-actions');
  const base = document.querySelectorAll('.home-hero-base > *');
  gsap.timeline({ defaults: { ease: EASE_IN } })
    .from(meta, { y: 14, autoAlpha: 0, duration: .6, clearProps: 'all' }, 0)
    .from(lines, { yPercent: 110, duration: .9, stagger: LINE_STAGGER }, .1)
    .from(rest, { y: 18, autoAlpha: 0, duration: .6, stagger: .1, clearProps: 'all' }, .5)
    .from(base, { y: 12, autoAlpha: 0, duration: .6, stagger: .06, clearProps: 'all' }, .8);
}

function setupDesktopReveal(gsap, ScrollTrigger, chapters) {
  const $ = (selector) => document.querySelector(selector);
  const { once, rise, lines, mask } = createReveal(gsap);
  // Services
  lines($('#capabilities-heading'));
  rise($('.home-capabilities .home-section-heading > div:last-child'), '#capabilities-heading');
  const cards = gsap.utils.toArray('.home-service');
  cards.forEach((card) => {
    gsap.set(card.querySelector('.home-service-copy'), { y: 18, autoAlpha: 0 });
    gsap.set(card.querySelector('.home-service-image'), { clipPath: 'inset(14% 0% 0% 0%)' });
    gsap.set(card.querySelector('.home-service-image img'), { scale: 1.12 });
  });
  ScrollTrigger.batch(cards, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => batch.forEach((card, index) => {
      const delay = index * .09;
      gsap.to(card.querySelector('.home-service-image'), { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, delay, ease: EASE_MOVE, clearProps: 'clipPath' });
      gsap.to(card.querySelector('.home-service-image img'), { scale: 1, duration: 1.2, delay, ease: EASE_IN, clearProps: 'transform' });
      gsap.to(card.querySelector('.home-service-copy'), { y: 0, autoAlpha: 1, duration: .6, delay: delay + .15, ease: EASE_IN, clearProps: 'all' });
    }),
  });

  // Operation: intro, then each chapter's copy arrives as its scene settles
  lines($('#process-heading'));
  rise($('.home-process-intro > p'), '#process-heading');
  chapters.forEach((chapter) => {
    const trigger = { trigger: chapter, start: 'top 72%', once: true };
    gsap.from(splitLines(chapter.querySelector('h3')), { yPercent: 110, duration: .9, ease: EASE_IN, stagger: LINE_STAGGER, scrollTrigger: trigger });
    gsap.from(chapter.querySelectorAll('.operation-index, .operation-description, .operation-links'), { y: 18, autoAlpha: 0, duration: .6, delay: .1, stagger: .1, ease: EASE_IN, clearProps: 'all', scrollTrigger: trigger });
  });

  // Company: the year counts up; the fleet photo is unveiled and then drifts slowly
  const year = $('.home-year');
  const finalYear = Number(year.textContent);
  if (finalYear) {
    const counter = { value: finalYear - 63 };
    gsap.to(counter, { value: finalYear, duration: 1.4, ease: EASE_IN, onUpdate: () => { year.textContent = String(Math.round(counter.value)); }, onComplete: () => { year.textContent = String(finalYear); }, scrollTrigger: once(year, 'top 85%') });
  }
  lines($('#company-heading'), '.home-company-top');
  const fleet = $('.home-company figure');
  mask(fleet);
  gsap.fromTo(fleet.querySelector('img'), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fleet, start: 'top bottom', end: 'bottom top', scrub: true } });
  rise($('.home-company-bottom > div'), fleet, { delay: .2 });

  // Proof band: figures count up, logos arrive as one row
  lines($('#proof-heading'));
  rise($('.home-proof .home-section-heading > p'), '#proof-heading');
  document.querySelectorAll('.home-fact-number').forEach((node) => {
    const target = Number(node.dataset.count);
    if (!target) return;
    const counter = { value: 0 };
    gsap.to(counter, { value: target, duration: 1.4, ease: EASE_IN, onUpdate: () => { node.textContent = String(Math.round(counter.value)); }, onComplete: () => { node.textContent = String(target); }, scrollTrigger: once(node, 'top 88%') });
  });
  rise(gsap.utils.toArray('.home-facts li'), '.home-facts', { stagger: .1, start: 'top 88%' });
  rise($('.home-clients'), '.home-clients', { start: 'top 92%' });

  // Region
  lines($('#regional-heading'));
  rise(document.querySelectorAll('.home-regional > div > :not(h2)'), '#regional-heading', { stagger: .1, delay: .2 });
  mask($('.home-regional figure'));

  // Quality system
  lines($('#sgc-heading'));
  rise($('.home-sgc-subtitle'), '#sgc-heading', { delay: .2 });
  rise(gsap.utils.toArray('[data-sgc-moment]'), '.home-sgc-moments', { stagger: .12, start: 'top 85%' });

  // Contact
  lines($('#contact-heading'), '#contact-heading', 'top 88%');
  rise($('.home-contact-layout'), '#contact-heading', { delay: .25 });
}
