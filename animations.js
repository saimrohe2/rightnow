// animations.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Spotlight Cursor Effect ---
  // This effect doesn't work well on touch devices, so we check for that.
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const spotlight = document.createElement('div');
    spotlight.classList.add('spotlight');
    document.body.appendChild(spotlight);

    window.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        spotlight.style.setProperty('--x', e.clientX + 'px');
        spotlight.style.setProperty('--y', e.clientY + 'px');
      });
    });
  }


  // --- Advanced "Reveal" on Scroll ---
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.animationDelay || '0';
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  }
});