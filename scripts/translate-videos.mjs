import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INPUT_FILE = path.resolve("content/videos-es.json");
const OUTPUT_FILE = path.resolve("content/videos.json");
const TARGET_LANGUAGE = "English";

/**
 * Recursively translates any string in arrays/objects.
 * Keeps keys unchanged and only translates string values.
 */
async function translateDeep(value, language = TARGET_LANGUAGE) {
  if (value == null) return value;

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return value;
    return translateText(text, language);
  }

  if (Array.isArray(value)) {
    const results = [];
    for (const item of value) {
      results.push(await translateDeep(item, language));
    }
    return results;
  }

  if (typeof value === "object") {
    const output = {};
    for (const [key, val] of Object.entries(value)) {
      output[key] = await translateDeep(val, language);
    }
    return output;
  }

  return value;
}

/**
 * Translate a single string.
 */
async function translateText(text, language = TARGET_LANGUAGE) {
  const prompt = `
Translate the following text from Spanish to ${language}.

Rules:
- Return only the translated text.
- Do not add quotes.
- Do not explain anything.
- Preserve meaning and tone.
- Localize cooking measurements, units, and formatting so they sound natural in the target language.

Text:
${text}
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return (response.output_text || text).trim();
}

async function main() {
  const raw = await fs.readFile(INPUT_FILE, "utf8");
  const sourceData = JSON.parse(raw);

  const translated = await translateDeep(sourceData, TARGET_LANGUAGE);

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(translated, null, 2) + "\n", "utf8");

  console.log(`Translated file written to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});