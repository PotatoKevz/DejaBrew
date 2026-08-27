// js/cart.js — sole owner for cart state (AD-3)
// LocalStorage key: deja-brew-cart: [{id, qty}]
const KEY = 'deja-brew-cart';

function safeParse() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch (e) {
    try { localStorage.removeItem(KEY); } catch (_) {}
    console.warn('[cart] corrupted storage cleared');
    return [];
  }
}

function persist(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
    // dispatch event for badge listeners
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: arr } }));
  } catch (e) {
    console.warn('[cart] persist failed', e);
  }
}

export const cart = {
  get() { return safeParse(); },
  count() { return safeParse().reduce((a,b)=>a+(Number(b.qty)||0),0); },
  clear() { persist([]); },
  add(id) {
    if (!id || typeof id !== 'string') { console.warn('[cart] bad id', id); return; }
    const c = safeParse();
    const f = c.find(x=>x.id===id);
    if (f) f.qty = Math.max(1, (Number(f.qty)||1)+1);
    else c.push({ id, qty: 1 });
    persist(c);
  },
  update(id, delta) {
    delta = Number(delta);
    if (!id || !Number.isFinite(delta)) { console.warn('[cart] bad update', id, delta); return; }
    let c = safeParse();
    const f = c.find(x=>x.id===id);
    if (!f) { console.warn('[cart] update unknown id', id); return; }
    f.qty = Math.max(0, Math.trunc(Number(f.qty)||0) + Math.trunc(delta));
    if (f.qty <= 0) c = c.filter(x=>x.id!==id);
    persist(c);
  }
};

// helpers for non-module callers (legacy)
export function getCart(){ return cart.get(); }
export function getCount(){ return cart.count(); }
