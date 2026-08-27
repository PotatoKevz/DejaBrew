// js/nav.js — hamburger + drawer a11y
export function initNav() {
  const nav = document.querySelector('.navbar');
  const btn = document.getElementById('nav-toggle');
  const links = document.getElementById('navbar-links');
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const cartTrigger = document.getElementById('cart-trigger');

  // scroll effect
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });
  }

  // hamburger
  if (btn && links) {
    const closeNav = () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };
    const openNav = () => {
      links.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    };
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    });
    // close on link click
    links.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeNav));
    // ESC closes nav
    document.addEventListener('keydown', (e)=>{
      if (e.key==='Escape' && links.classList.contains('open')) closeNav();
    });
  }

  // drawer a11y
  if (drawer) {
    const focusableSel = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocus = null;

    const openDrawer = () => {
      lastFocus = document.activeElement;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden','false');
      if (backdrop) backdrop.style.display='block';
      // focus first focusable
      const first = drawer.querySelector(focusableSel);
      if (first) first.focus();
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
      if (backdrop) backdrop.style.display='none';
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    // expose globally for cart.js callers and inline onclick
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;

    if (cartTrigger) cartTrigger.addEventListener('click', (e)=>{ e.preventDefault(); openDrawer(); });
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e)=>{
      if (e.key==='Escape' && drawer.classList.contains('open')) closeDrawer();
    });
    // focus trap
    drawer.addEventListener('keydown', (e)=>{
      if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
      const focusable = Array.from(drawer.querySelectorAll(focusableSel));
      if (focusable.length===0) return;
      const first = focusable[0], last = focusable[focusable.length-1];
      if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
  }
}
