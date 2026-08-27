// js/progress.js — thin amber scroll bar
export function initProgress(selector = '#progress-bar') {
  const bar = document.querySelector(selector);
  if (!bar) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const d = h.scrollHeight - h.clientHeight;
      const pct = d > 0 ? (h.scrollTop / d) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
