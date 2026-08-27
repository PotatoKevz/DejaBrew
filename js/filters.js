// js/filters.js — pure filter logic + DOM binder (no localStorage)
export function filterCatalog(list, { activeFilter='all', mood='all', query='', pastryFirst=false, priceMax=null, roast='all', sortBy='none', origin=null, favesOnly=false, faveIds=[] }={}) {
  let out = [...list];
  if (activeFilter !== 'all') {
    out = out.filter(x => x.type === activeFilter || x.tag === activeFilter);
  }
  if (mood === 'bold') {
    out = out.filter(x => ['M-C-01','M-C-02','M-P-03'].includes(x.id));
  }
  if (origin) {
    out = out.filter(x => (x.origin||'').toLowerCase() === origin.toLowerCase());
  }
  if (favesOnly) {
    const set = new Set(faveIds);
    out = out.filter(x => set.has(x.id));
  }
  if (query) {
    const q = query.toLowerCase();
    out = out.filter(x => {
      const tast = Array.isArray(x.tasting) ? x.tasting.join(' ') : '';
      return (x.name + ' ' + x.sensory + ' ' + tast + ' ' + (x.origin||'')).toLowerCase().includes(q);
    });
  }
  if (priceMax !== null && priceMax !== '' && Number.isFinite(Number(priceMax))) {
    const max = Number(priceMax);
    out = out.filter(x => Number(x.price) <= max);
  }
  if (roast !== 'all') {
    out = out.filter(x => (x.roast||'').toLowerCase() === roast.toLowerCase());
  }
  if (sortBy === 'price-asc') out = [...out].sort((a,b)=> Number(a.price)-Number(b.price));
  else if (sortBy === 'price-desc') out = [...out].sort((a,b)=> Number(b.price)-Number(a.price));
  if (pastryFirst) {
    out = [...out].sort((a,b)=> Number(b.type==='pastry') - Number(a.type==='pastry'));
  }
  return out;
}
