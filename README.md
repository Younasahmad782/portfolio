# Muhammad Younus — Portfolio

Static portfolio site (HTML, CSS, vanilla JS). No build step, no dependencies.
Live: https://younasahmad782.github.io/portfolio/

## Structure

```
index.html                  Home: hero, BizFlow, projects, skills, about, contact
case-studies/bizflow.html   BizFlow case study
assets/css/styles.css       Design tokens (light + dark), layout, components
assets/js/main.js           Theme toggle, mobile menu, scroll highlight, copy email
assets/img/                 Real BizFlow screenshots (WebP, 720w + 1440w), OG image
404.html  sitemap.xml  favicon.svg  .nojekyll
```

## Run locally

```
python -m http.server 8000
# open http://localhost:8000
```

## Add your resume

1. Save the PDF as `assets/resume/Muhammad-Younus-Resume.pdf`
2. In `assets/js/main.js` change `var RESUME_AVAILABLE = false;` to `true`

The Resume links (nav, hero, contact) stay hidden until then.

## Add more project screenshots

Cards for Noor, Everyday Calculator and Blog Dashboard currently have no image.
Capture 1440x900 screenshots, convert to WebP, and add an `<img>` (with `width`, `height`,
meaningful `alt`, `loading="lazy"`) at the top of each `.card`.

## Deploy (GitHub Pages)

Repo Settings > Pages > Source: "Deploy from a branch" > Branch: `main`, folder `/ (root)`.
Commit these files to the root of the `portfolio` repository and push.
