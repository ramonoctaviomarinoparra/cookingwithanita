import fs from "node:fs/promises";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Falta OPENAI_API_KEY en GitHub Secrets.");
  process.exit(1);
}

const SOURCE_FILE = "content/videos-es.json";
const TARGET_FILE = "content/videos.json";
const TARGET_LANGS = ["en", "hi", "de"];

async function callOpenAI(esTranslation) {
  const prompt = `
Eres un traductor profesional de recetas de cocina.
Traduce desde español a inglés (en), hindi (hi) y alemán (de).

Reglas:
- Devuelve JSON válido solamente.
- Mantén el sentido culinario natural.
- No inventes ingredientes.
- Conserva medidas tal como vienen.
- Traduce title, description, category, ingredients y steps.
- ingredients y steps deben seguir siendo arrays de strings.
- Hindi debe estar en escritura devanagari natural.
- Alemán debe sonar natural para una web de recetas.
- Inglés debe sonar natural para una web de recetas.

Devuelve exactamente este formato:
{
  "en": {
    "title": "",
    "description": "",
    "category": "",
    "ingredients": [],
    "steps": []
  },
  "hi": {
    "title": "",
    "description": "",
    "category": "",
    "ingredients": [],
    "steps": []
  },
  "de": {
    "title": "",
    "description": "",
    "category": "",
    "ingredients": [],
    "steps": []
  }
}

Contenido en español:
${JSON.stringify(esTranslation, null, 2)}
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      store: false,
      input: prompt
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const outputText = data.output_text || "";

  try {
    return JSON.parse(outputText);
  } catch (err) {
    throw new Error("No se pudo parsear el JSON devuelto por la API. Respuesta: " + outputText);
  }
}

async function run() {
  const sourceRaw = await fs.readFile(SOURCE_FILE, "utf8");
  const source = JSON.parse(sourceRaw);

  for (const video of source.videos) {
    if (!video.translations) video.translations = {};
    if (!video.translations.es) {
      throw new Error(`El video ${video.id} no tiene translations.es`);
    }

    const missing = TARGET_LANGS.filter(lang => !video.translations[lang]);
    if (missing.length === 0) continue;

    const translated = await callOpenAI(video.translations.es);

    for (const lang of TARGET_LANGS) {
      if (translated[lang]) {
        video.translations[lang] = translated[lang];
      }
    }
  }

  await fs.writeFile(TARGET_FILE, JSON.stringify(source, null, 2), "utf8");
  console.log(`Archivo generado: ${TARGET_FILE}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
