# Cooking with Anita - Multilingual starter

## What this version does
- Keeps your logo in `logo.png`
- Detects the user's language automatically
- Lets the user switch language manually
- Remembers the selected language
- Shows a featured video with a full recipe
- Uses a dark Netflix-style layout
- Keeps ad placeholders in safe positions

## Files
- `index.html`
- `styles.css`
- `js/app.js`
- `content/videos.json`

## How to add a new video
Open `content/videos.json` and copy one existing block inside `videos`.

Change:
- `id`
- `youtubeId`
- `publishedAt`
- `categoryKey`
- translations for `es`, `en`, `hi`, `de`

## Very important
Keep your real logo file in the root as:

`logo.png`

## Local test
Run:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/`
