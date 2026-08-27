#!/usr/bin/env node
// tools/check-catalog.js — compare menu-catalog.md item counts to data/catalog.js
import fs from 'fs';
const catalogPath = 'data/catalog.js';
const menuPath = '_bmad-output/specs/spec-enhanced-deja-brew/menu-catalog.md';
try {
  const js = fs.readFileSync(catalogPath, 'utf8');
  const countJs = (js.match(/id:'M-/g)||[]).length;
  let countMd = 0;
  if (fs.existsSync(menuPath)) {
    const md = fs.readFileSync(menuPath,'utf8');
    countMd = (md.match(/M-[CP]-\d+/g)||[]).length;
    console.log(`[check:catalog] catalog.js=${countJs} menu-catalog.md mentions=${countMd}`);
    if (countMd && countJs !== countMd) console.warn(`[check:catalog] WARN counts differ — sync needed`);
  } else {
    console.log(`[check:catalog] catalog.js=${countJs} (menu-catalog.md not found, skipping)`);
  }
  console.log('[check:catalog] ok');
} catch(e){ console.error('[check:catalog] failed', e.message); process.exit(1); }
