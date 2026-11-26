// Usage: node scripts/set-domain.mjs https://your-site.vercel.app
// Rewrites canonical, Open Graph and sitemap URLs from the old domain to yours.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const OLD = 'https://younasahmad782.github.io/portfolio';
const next = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[^/\s]+/.test(next)) { console.error('Pass your site URL, e.g. https://muhammad-younus.vercel.app'); process.exit(1); }
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { if (n === 'node_modules' || n.startsWith('.git')) continue; const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.(html|xml|txt)$/.test(p) && files.push(p); } })('.');
let count = 0;
for (const f of files) { const s = readFileSync(f, 'utf8'); if (s.includes(OLD)) { writeFileSync(f, s.split(OLD).join(next)); count++; } }
console.log(`Updated ${count} file(s) to ${next}`);
