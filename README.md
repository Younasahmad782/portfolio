# Muhammad Younus — Portfolio

Static portfolio site (HTML, CSS, vanilla JavaScript). No build step, no dependencies.

## Structure

```
index.html                  Hero, projects, services, skills, about, process, why me, certifications, contact
case-studies/bizflow.html   BizFlow case study
assets/css/site.css         Design tokens and all styles
assets/js/main.js           Menu, nav highlighting, BizFlow preview, contact form, copy email
assets/img/                 Portrait, BizFlow screenshots (WebP), Open Graph image
scripts/set-domain.mjs      Rewrites canonical / Open Graph / sitemap URLs to your domain
vercel.json                 Clean URLs, caching and security headers
404.html  sitemap.xml  robots.txt  favicon.svg
```

## Run locally

```
python -m http.server 8000
# open http://localhost:8000
```

(or `npx serve`). There is nothing to install or build.

## Deploy to Vercel

1. Push this folder to a GitHub repository (files at the repo root).
2. In Vercel choose **Add New > Project**, import the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.
4. Once you know your final URL, run `node scripts/set-domain.mjs https://your-site.vercel.app`,
   commit, and push. This updates canonical links, Open Graph tags and the sitemap.

## Contact form

The form opens the visitor's email app with the message pre-filled. To receive messages directly:
create a free form at https://formspree.io and set `FORM_ENDPOINT` at the top of `assets/js/main.js`.

## Add real screenshots for the other projects

The ProstaVibe, COD Landing and Everyday Calculator cards use styled covers because no screenshots were
available. To replace one, save a 1366x768 WebP in `assets/img/` and swap the `.cover` div in `index.html` for:

```html
<img class="cover" src="assets/img/your-shot.webp" width="1366" height="768" loading="lazy" alt="Describe the screen">
```
