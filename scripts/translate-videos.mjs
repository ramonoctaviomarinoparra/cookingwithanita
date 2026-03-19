import fs from "node:fs/promises";
import process from "node:process";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY.");
  process.exit(1);
}

const SOURCE_FILE = "content/videos-es.json";
const TARGET_FILE = "content/videos.json";
const TARGET_LANGS = ["en", "hi", "de"];

function buildPrompt(esTranslation) {
  return `
You are a professional cooking recipe translator.

Translate this Spanish recipe content into:
- English (en)
- Hindi in natural Devanagari script (hi)
- German (de)

Rules:
- Return valid JSON only.
- Do not wrap the response in markdown.
- Keep the culinary meaning natural.
- Do not invent ingredients or steps.
- Translate title, description, category, ingredients, and steps.
- ingredients must remain an array of strings.
- steps must remain an array of strings.
- Adapt cooking measurements, units, and formatting to match the target language naturally.

Return exactly this shape:
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

Spanish content:
${JSON.stringify(esTranslation, null, 2)}
`.trim();
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (!Array.isArray(data?.output)) {
    return "";
  }

  const texts = [];

  for (const item of data.output) {
    if (!Array.isArray(item?.content)) continue;

    for (const part of item.content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        texts.push(part.text);
      }
    }
  }

  return texts.join("\n").trim();
}

function stripCodeFences(text) {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

async function callOpenAI(esTranslation) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      store: false,
      input: buildPrompt(esTranslation),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const outputText = stripCodeFences(extractOutputText(data));

  if (!outputText) {
    throw new Error(
      `OpenAI API returned no usable text. Full response:\n${JSON.stringify(data, null, 2)}`
    );
  }

  try {
    return JSON.parse(outputText);
  } catch {
    throw new Error(
      `Could not parse JSON returned by OpenAI. Raw output:\n${outputText}`
    );
  }
}

function isValidTranslationBlock(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    Array.isArray(value.ingredients) &&
    Array.isArray(value.steps) &&
    value.ingredients.every((item) => typeof item === "string") &&
    value.steps.every((item) => typeof item === "string")
  );
}

async function run() {
  const sourceRaw = await fs.readFile(SOURCE_FILE, "utf8");
  const source = JSON.parse(sourceRaw);

  if (!source || !Array.isArray(source.videos)) {
    throw new Error(`Invalid source file format in ${SOURCE_FILE}`);
  }

  for (const video of source.videos) {
    if (!video.translations || typeof video.translations !== "object") {
      video.translations = {};
    }

    if (!video.translations.es) {
      throw new Error(`Video ${video.id || "(unknown id)"} is missing translations.es`);
    }

    const missingLangs = TARGET_LANGS.filter((lang) => !video.translations[lang]);

    if (missingLangs.length === 0) {
      console.log(`Skipping ${video.id}: all target translations already exist.`);
      continue;
    }

    console.log(`Translating ${video.id} -> ${missingLangs.join(", ")}`);

    const translated = await callOpenAI(video.translations.es);

    for (const lang of TARGET_LANGS) {
      if (translated[lang] && isValidTranslationBlock(translated[lang])) {
        video.translations[lang] = translated[lang];
      } else if (missingLangs.includes(lang)) {
        throw new Error(
          `Missing or invalid translation block for "${lang}" in video ${video.id}`
        );
      }
    }
  }

  await fs.writeFile(TARGET_FILE, JSON.stringify(source, null, 2) + "\n", "utf8");
  console.log(`Generated file: ${TARGET_FILE}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});