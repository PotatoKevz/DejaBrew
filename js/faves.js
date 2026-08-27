// js/faves.js — sole owner for favorites (AD-3 like cart)
const KEY = 'deja-brew-faves';
function safeParse(){
  try{ const v=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(v)?v:[];}catch(e){ try{localStorage.removeItem(KEY);}catch(_){} console.warn('[faves] corrupted cleared'); return [];}
}
function persist(arr){
  try{ localStorage.setItem(KEY, JSON.stringify(arr)); window.dispatchEvent(new CustomEvent('favorite:updated', {detail:{faves:arr}})); }catch(e){ console.warn('[faves] persist failed', e); }
}
export const faves = {
  get(){ return safeParse(); },
  isFave(id){ return safeParse().includes(id); },
  toggle(id){
    if(!id || typeof id!=='string'){ console.warn('[faves] bad id',id); return; }
    const cur = safeParse();
    const idx = cur.indexOf(id);
    if(idx>=0) cur.splice(idx,1); else cur.push(id);
    persist(cur);
  },
  clear(){ persist([]); }
};
