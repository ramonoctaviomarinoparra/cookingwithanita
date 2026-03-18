# Cooking with Anita - sitio completo con traducción automática

## Qué hace este paquete
- Mantiene tu logo como `logo.png` en la raíz.
- Detecta idioma automáticamente.
- Permite cambiar idioma con botones.
- Usa un diseño oscuro tipo catálogo.
- Muestra video + receta.
- Tú escribes **solo en español**.
- GitHub Actions traduce automáticamente a:
  - inglés (`en`)
  - hindi (`hi`)
  - alemán (`de`)

## Archivos importantes
- `index.html`
- `styles.css`
- `js/app.js`
- `content/videos-es.json` -> aquí escribes solo en español
- `content/videos.json` -> este lo genera la acción
- `scripts/translate-videos.mjs`
- `.github/workflows/translate-recipes.yml`

## Cómo se usa
### 1. Reemplaza en tu repo
Copia estos archivos al repo y conserva tu `logo.png`.

### 2. Crea el secret en GitHub
En tu repo:
- Settings
- Secrets and variables
- Actions
- New repository secret

Nombre:
`OPENAI_API_KEY`

Valor:
tu API key

## Cómo subir un video nuevo
Abre `content/videos-es.json` y copia uno de los bloques dentro de `videos`.

Cambia:
- `id`
- `youtubeId`
- `publishedAt`
- `title`
- `description`
- `category`
- `ingredients`
- `steps`

Haz commit y push.
GitHub Action traducirá `content/videos.json`.
Cloudflare publicará el cambio.

## Importante
La web lee `content/videos.json`.
Por eso el primer push puede disparar:
1. tu commit en español
2. el commit automático con traducciones

Eso es normal.

## Ejemplo de bloque nuevo
```json
{
  "id": "anita-002",
  "youtubeId": "ID_DEL_VIDEO",
  "publishedAt": "2026-03-18",
  "sourceLanguage": "es",
  "translations": {
    "es": {
      "title": "Mi receta nueva",
      "description": "Descripción breve",
      "category": "Cena",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "steps": ["paso 1", "paso 2"]
    }
  }
}
```
