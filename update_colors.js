const fs = require('fs');

const pageFile = 'c:/Users/shihe/Desktop/esraPFE/frontend/src/app/[locale]/tounesna/page.tsx';
let page = fs.readFileSync(pageFile, 'utf8');

// Global changes
page = page.replace(/bg-\[\#6a0d2e\]/g, 'bg-[#fff9e6]');
page = page.replace(/text-\[\#fff9e6\]/g, 'text-[#6a0d2e]');

// Selection
page = page.replace(/selection:text-\[\#6a0d2e\]/g, 'selection:text-[#fff9e6]');

// Overlays and Gradients
page = page.replace(/via-\[\#6a0d2e\]\/80 to-\[\#6a0d2e\]/g, 'via-[#fff9e6]/80 to-[#fff9e6]');
page = page.replace(/bg-\[\#6a0d2e\]\/80 backdrop-blur-\[3px\]/g, 'bg-[#fff9e6]/80 backdrop-blur-[3px]');
page = page.replace(/from-\[\#6a0d2e\] via-\[\#6a0d2e\]\/50 to-\[\#6a0d2e\]/g, 'from-[#fff9e6] via-[#fff9e6]/50 to-[#fff9e6]');

// SVG Texture
page = page.replace(/stroke='%23ffcc1a'/g, "stroke='%236a0d2e'");

// Inputs and Glassmorphism
page = page.replace(/bg-\[\#6a0d2e\]\/50/g, 'bg-[#fff9e6]/50');
page = page.replace(/border-\[\#ffcc1a\]\/20/g, 'border-[#6a0d2e]/20');
page = page.replace(/bg-white\/5/g, 'bg-[#6a0d2e]/5');
page = page.replace(/bg-white\/10/g, 'bg-[#6a0d2e]/10');
page = page.replace(/border-\[\#ffcc1a\]\/30/g, 'border-[#6a0d2e]/30');
page = page.replace(/focus:border-\[\#ffcc1a\]\/60/g, 'focus:border-[#6a0d2e]/60');
page = page.replace(/focus:ring-\[\#ffcc1a\]\/20/g, 'focus:ring-[#6a0d2e]/20');

// Typography opacities
page = page.replace(/text-\[\#fff9e6\]\/50/g, 'text-[#6a0d2e]/60');
page = page.replace(/text-\[\#fff9e6\]\/40/g, 'text-[#6a0d2e]/50');
page = page.replace(/text-\[\#ffcc1a\]\/80/g, 'text-[#6a0d2e]');

fs.writeFileSync(pageFile, page);
console.log('Updated page.tsx');


const heroFile = 'c:/Users/shihe/Desktop/esraPFE/frontend/src/app/[locale]/tounesna/components/TounesnaHero.tsx';
let hero = fs.readFileSync(heroFile, 'utf8');

hero = hero.replace(/bg-\[\#6a0d2e\]/g, 'bg-[#fff9e6]');
hero = hero.replace(/rgba\(106, 13, 46, 0\.15\)/g, 'rgba(255, 249, 230, 0.45)');
hero = hero.replace(/rgba\(106,13,46,0\.55\)/g, 'rgba(255, 249, 230, 0.75)');
hero = hero.replace(/rgba\(106,13,46,0\.95\)/g, 'rgba(255, 249, 230, 0.95)');
hero = hero.replace(/rgba\(106, 13, 46, 0\)/g, 'rgba(255, 249, 230, 0)');
hero = hero.replace(/rgba\(31,58,95,0\.5\)/g, 'rgba(106, 13, 46, 0.1)'); // subtle maroon tint

hero = hero.replace(/text-\[\#fff9e6\]/g, 'text-[#6a0d2e]');
hero = hero.replace(/text-\[\#fff9e6\]\/70/g, 'text-[#6a0d2e]/80');
hero = hero.replace(/text-\[\#fff9e6\]\/60/g, 'text-[#6a0d2e]/70');
hero = hero.replace(/text-\[\#fff9e6\]\/50/g, 'text-[#6a0d2e]/60');
hero = hero.replace(/text-\[\#fff9e6\]\/40/g, 'text-[#6a0d2e]/50');

hero = hero.replace(/bg-white\/20/g, 'bg-[#6a0d2e]/10');
hero = hero.replace(/border-\[\#fff9e6\]\/20/g, 'border-[#6a0d2e]/20');
hero = hero.replace(/bg-white\/5/g, 'bg-[#6a0d2e]/5');

fs.writeFileSync(heroFile, hero);
console.log('Updated TounesnaHero.tsx');


const mapFile = 'c:/Users/shihe/Desktop/esraPFE/frontend/src/app/[locale]/tounesna/components/InteractiveMap.tsx';
let mapc = fs.readFileSync(mapFile, 'utf8');

mapc = mapc.replace(/#ffcc1a 1px/g, '#6a0d2e 1px'); // background texture dots

mapc = mapc.replace(/fill="#6a0d2e" opacity="0\.3"/g, 'fill="#fff9e6" opacity="0.4"');

mapc = mapc.replace(/let fillStyle = "#550a24";/g, 'let fillStyle = "rgba(106, 13, 46, 0.08)";');
mapc = mapc.replace(/let strokeStyle = "#ffcc1a";/g, 'let strokeStyle = "rgba(106, 13, 46, 0.2)";');
mapc = mapc.replace(/let strokeOpacity = "0\.3";/g, 'let strokeOpacity = "1";');

mapc = mapc.replace(/strokeStyle = "#fff9e6";/g, 'strokeStyle = "#6a0d2e";'); // active stroke
mapc = mapc.replace(/"rgba\(255, 204, 26, 0\.9\)"/g, '"#6a0d2e"'); // active empty fill
mapc = mapc.replace(/"rgba\(255, 204, 26, 0\.5\)"/g, '"rgba(106, 13, 46, 0.2)"'); // hover empty fill
mapc = mapc.replace(/strokeStyle = "#ffcc1a";/g, 'strokeStyle = "#6a0d2e";'); // hover stroke

fs.writeFileSync(mapFile, mapc);
console.log('Updated InteractiveMap.tsx');
