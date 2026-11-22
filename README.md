# Muhammad Younus — Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step, no dependencies.
Live: https://younasahmad782.github.io/portfolio/

## Structure

```
index.html                  Hero, About, Skills, Projects, Services, Experience, Contact
case-studies/bizflow.html   BizFlow case study
assets/css/styles.css       Design tokens (dark default + light), layout, components
assets/js/main.js           Theme toggle, menu, scroll spy, reveals, contact form, copy email
assets/img/                 Portrait (WebP + JPG), BizFlow screenshots (WebP), OG image
assets/resume/              Resume PDF
404.html  sitemap.xml  favicon.svg  .nojekyll
```

## Run locally

```
python -m http.server 8000
# open http://localhost:8000
```

## Contact form

The form works out of the box by opening the visitor's email app with the message pre-filled.
To receive messages directly in your inbox without that step:

1. Create a free form at https://formspree.io and copy its endpoint URL.
2. Open `assets/js/main.js` and set `FORM_ENDPOINT = 'https://formspree.io/f/your-id'`.

The form then sends a JSON POST and shows a success or error message on the page.

## Add project screenshots

The COD landing page, Everyday Calculator and Blog Dashboard cards use typographic covers because
no real screenshots were in the ZIP. To add one, capture a 1366x576 screenshot, save it as WebP in
`assets/img/`, and replace the `.card-visual` div at the top of the card with:

```html
<img src="assets/img/your-shot.webp" width="1366" height="576" loading="lazy" alt="Describe the screen">
```

## Update links when you deploy BizFlow

Search `index.html` for "public demo not deployed yet" and add a "Live demo" button next to the GitHub button.

## Deploy (GitHub Pages)

Repo Settings > Pages > Source: "Deploy from a branch" > Branch: `main`, folder `/ (root)`.
Commit these files to the root of the `portfolio` repository and push. The same folder also deploys
unchanged to Netlify, Vercel or Cloudflare Pages (publish directory: the repo root, no build command).
