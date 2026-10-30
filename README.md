# ParaIQ site

The public website for **ParaIQ**, a paraplanning co-pilot: documents in, advice out.
It is a plain static site (HTML, CSS and JavaScript). There is no build step and nothing to install.

## Structure

```
index.html              Page markup, including the Privacy and Terms views (shown with #privacy and #terms)
assets/css/styles.css   All styles
assets/js/main.js       Scroll stages, app-window tiles, intro, try-it demo, routing
assets/video/           Intro clips (clip1.mp4, clip2.mp4)
vercel.json             Vercel settings (headers and caching)
```

## Run it locally

Open a terminal in this folder and start any static server, for example:

```
python -m http.server 8080
```

Then open http://localhost:8080. (Opening index.html by double-click works for most things,
but a server is the closest match to the live site.)

## Deploy

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New, Project**, import the repository and press **Deploy**.
   Framework preset: **Other**. Leave the build command and output directory empty.
3. Every push to the main branch then goes live on its own.

## Common edits

- **Intro videos:** replace the two files in `assets/video/` keeping the names. The text that changes during
  the intro is timed to the clips: in `assets/js/main.js`, search for `BEATS` (when each line appears)
  and `D=[6.43,11.45]` (clip lengths in seconds).
- **Intro once per session:** stored in the browser as `paraiq-intro`. Open the site in a private window to see it again.
- **Contact address:** search for `paraiq.app@gmail.com` in `index.html` and `assets/js/main.js`.
- **Sample data:** the "Try it" demo and the app screens use invented sample data only.
- **Fonts:** loaded from Google Fonts in `index.html`.

## Before going public

- Have the Privacy and Terms text reviewed by a lawyer. The effective date appears in square brackets in the source policy.
- Make sure you have the rights to the two intro clips, or swap in your own footage.
