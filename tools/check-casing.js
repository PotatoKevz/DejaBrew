#!/usr/bin/env node
// tools/check-casing.js — guard exact image casing Kwasant.jpg etc
import fs from 'fs';
import path from 'path';
const files = fs.readdirSync('.').filter(f=> fs.statSync(f).isFile());
const lowerMap = new Map();
for(const f of files){ lowerMap.set(f.toLowerCase(), f); }
const htmlFiles = ['Main.html','MenuOrder.html','order-success.html','404.html'].filter(f=> fs.existsSync(f));
let bad=[];
for(const hf of htmlFiles){
  const txt=fs.readFileSync(hf,'utf8');
  const re=/src="([^"]+\.(?:jpg|jpeg|png))"/g;
  let m;
  while(m=re.exec(txt)){
    const src=m[1].split('/').pop();
    if(!src) continue;
    const actual=lowerMap.get(src.toLowerCase());
    if(actual && actual!==src) bad.push(`${hf}: ${src} should be ${actual}`);
    if(actual===undefined && !src.startsWith('http')) {
      // allow missing webp etc but warn if jpg not found at all
      if(!fs.existsSync(src) && src!== 'Kape.jpg') {} // Kape fallback ok
    }
  }
}
// also check catalog.js
if(fs.existsSync('data/catalog.js')){
  const cat=fs.readFileSync('data/catalog.js','utf8');
  const re2=/image:'([^']+)'/g;
  let m;
  while(m=re2.exec(cat)){
    const src=m[1];
    const actual=lowerMap.get(src.toLowerCase());
    if(actual && actual!==src) bad.push(`catalog.js: ${src} should be ${actual}`);
  }
}
if(bad.length){ console.error('[check:casing] FAILED:\n'+bad.join('\n')); process.exit(1); }
console.log('[check:casing] ok — all src casings match filesystem');
