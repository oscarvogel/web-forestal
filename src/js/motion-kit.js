// Shared motion vocabulary for Home and interior pages (Premium archetype): entrances decelerate,
// on-screen moves ease both ends. Curves mirror --ease-fg / --dur-* in styles.css.
import { CustomEase } from 'gsap/CustomEase';

export const desktopMotion = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
export const lightMotion = '(prefers-reduced-motion: no-preference) and (max-width: 1023px), (prefers-reduced-motion: no-preference) and (pointer: coarse)';
export const EASE_IN = 'fgOut';
export const EASE_MOVE = 'fg';
export const LINE_STAGGER = 0.09;

let registered = false;
export function registerEases(gsap) {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(CustomEase);
  CustomEase.create('fgOut', '.05,.7,.1,1');
  CustomEase.create('fg', '.4,0,.2,1');
}

// Wraps each <br>-separated line of a heading in a mask so it can rise into place; text stays one heading.
export function splitLines(heading) {
  if (heading.dataset.split) return [...heading.querySelectorAll('.reveal-line-inner')];
  const groups = [[]];
  [...heading.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') groups.push([]);
    else groups[groups.length - 1].push(node);
  });
  heading.textContent = '';
  const inners = groups.filter((group) => group.length).map((group) => {
    const line = document.createElement('span');
    const inner = document.createElement('span');
    line.className = 'reveal-line';
    inner.className = 'reveal-line-inner';
    group.forEach((node) => inner.append(node));
    line.append(inner);
    heading.append(line);
    return inner;
  });
  heading.dataset.split = 'true';
  return inners;
}

// Scroll-triggered reveals, each played once.
export function createReveal(gsap) {
  const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true });
  const rise = (targets, trigger, { start, ...vars } = {}) => gsap.from(targets, { y: 22, autoAlpha: 0, duration: .6, ease: EASE_IN, clearProps: 'all', scrollTrigger: once(trigger, start), ...vars });
  const lines = (heading, trigger = heading, start) => gsap.from(splitLines(heading), { yPercent: 110, duration: .7, ease: EASE_IN, stagger: LINE_STAGGER, scrollTrigger: once(trigger, start) });
  const mask = (figure, trigger = figure) => {
    const image = figure.querySelector('img');
    gsap.fromTo(figure, { clipPath: 'inset(14% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: EASE_MOVE, clearProps: 'clipPath', scrollTrigger: once(trigger) });
    if (image) gsap.fromTo(image, { scale: 1.12 }, { scale: 1, duration: 1.2, ease: EASE_IN, clearProps: 'transform', scrollTrigger: once(trigger) });
  };
  // Items that share a row enter together with a small stagger.
  const batch = (ScrollTrigger, selector, enter) => {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;
    items.forEach((item) => gsap.set(item, { autoAlpha: 0, y: 24 }));
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (group) => group.forEach((item, index) => enter(item, index * .09)),
    });
  };
  return { once, rise, lines, mask, batch };
}

// Phones, tablets and coarse pointers: one quiet fade-up, no scroll engine.
export function setupLightReveal(gsap, selector) {
  gsap.matchMedia().add(lightMotion, () => {
    const targets = document.querySelectorAll(selector);
    if (!targets.length || !('IntersectionObserver' in window)) return undefined;
    document.body.classList.add('has-light-reveal');
    targets.forEach((node) => node.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.body.classList.remove('has-light-reveal');
      targets.forEach((node) => { node.removeAttribute('data-reveal'); node.classList.remove('is-in'); });
    };
  });
}

// Page opening: eyebrow, headline by line, then the rest.
export function introSequence(gsap, intro) {
  const heading = intro.querySelector('h1');
  const parts = [...intro.children].filter((part) => part !== heading);
  const timeline = gsap.timeline({ defaults: { ease: EASE_IN } });
  const first = parts.filter((part) => heading && (part.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING));
  const after = parts.filter((part) => !first.includes(part));
  if (first.length) timeline.from(first, { y: 14, autoAlpha: 0, duration: .6, clearProps: 'all' }, 0);
  if (heading) timeline.from(splitLines(heading), { yPercent: 110, duration: .9, stagger: LINE_STAGGER }, .1);
  if (after.length) timeline.from(after, { y: 18, autoAlpha: 0, duration: .6, stagger: .1, clearProps: 'all' }, heading ? .5 : 0);
}
