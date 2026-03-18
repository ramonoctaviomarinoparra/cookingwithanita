const supportedLangs = ["en", "es", "hi", "de"];
let currentLang = "en";
let siteData = null;
let currentVideoId = null;

function detectLanguage() {
  const saved = localStorage.getItem("cwa-lang");
  if (saved && supportedLangs.includes(saved)) return saved;

  const browserLangs = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "en"];

  for (const lang of browserLangs) {
    const short = String(lang).toLowerCase().split("-")[0];
    if (supportedLangs.includes(short)) return short;
  }

  return "en";
}

function persistLanguage(lang) {
  localStorage.setItem("cwa-lang", lang);
}

function getTranslation(video, lang) {
  return video.translations[lang] || video.translations[video.sourceLanguage] || video.translations.en || Object.values(video.translations)[0];
}

function fmtDate(dateString) {
  try {
    const localeMap = { en: "en-US", es: "es-ES", hi: "hi-IN", de: "de-DE" };
    return new Date(dateString).toLocaleDateString(localeMap[currentLang] || "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

function getUiText() {
  return {
    en: {
      heroKicker: "Relaxing cooking channel",
      heroTitle: "Slow cooking videos with a recipe for every video.",
      heroBody: "Watch the featured video, open the recipe instantly, and browse your cooking library in a clean Netflix-style layout.",
      watchNow: "Watch featured video",
      browse: "Browse videos",
      featured: "Featured video",
      ingredients: "Ingredients",
      steps: "Steps",
      recipe: "Recipe",
      ads: "Advertisement",
      aboutTitle: "About the channel",
      aboutBody: "Cooking with Anita combines relaxing kitchen visuals, simple homemade meals, and easy recipes that can be read in multiple languages.",
      nextTitle: "How to add a new video",
      nextSteps: [
        "Open content/videos.json",
        "Copy one video block",
        "Paste your new YouTube ID, title, ingredients, and steps",
        "Commit to GitHub and Cloudflare publishes automatically"
      ],
      shelvesTitle: "More videos",
      published: "Published",
      category: "Category",
      openRecipe: "Click any card to load its recipe"
    },
    es: {
      heroKicker: "Canal relajante de cocina",
      heroTitle: "Videos de cocina lenta con receta en cada video.",
      heroBody: "Mira el video destacado, abre la receta al instante y explora tu biblioteca en una estructura limpia tipo Netflix.",
      watchNow: "Ver video destacado",
      browse: "Ver biblioteca",
      featured: "Video destacado",
      ingredients: "Ingredientes",
      steps: "Pasos",
      recipe: "Receta",
      ads: "Publicidad",
      aboutTitle: "Sobre el canal",
      aboutBody: "Cooking with Anita mezcla cocina relajante, comidas caseras simples y recetas fáciles de leer en varios idiomas.",
      nextTitle: "Cómo subir un nuevo video",
      nextSteps: [
        "Abre content/videos.json",
        "Copia un bloque de video",
        "Pega tu nuevo ID de YouTube, título, ingredientes y pasos",
        "Haz commit en GitHub y Cloudflare publica automáticamente"
      ],
      shelvesTitle: "Más videos",
      published: "Publicado",
      category: "Categoría",
      openRecipe: "Haz clic en una tarjeta para cargar su receta"
    },
    hi: {
      heroKicker: "आरामदायक कुकिंग चैनल",
      heroTitle: "हर वीडियो के साथ पूरी रेसिपी।",
      heroBody: "फ़ीचर्ड वीडियो देखें, तुरंत रेसिपी खोलें, और अपनी कुकिंग लाइब्रेरी को नेटफ्लिक्स जैसी साफ़ लेआउट में ब्राउज़ करें।",
      watchNow: "फ़ीचर्ड वीडियो देखें",
      browse: "वीडियो ब्राउज़ करें",
      featured: "फ़ीचर्ड वीडियो",
      ingredients: "सामग्री",
      steps: "स्टेप्स",
      recipe: "रेसिपी",
      ads: "विज्ञापन",
      aboutTitle: "चैनल के बारे में",
      aboutBody: "Cooking with Anita आरामदायक किचन वीडियो, आसान घर के खाने और कई भाषाओं में पढ़ी जाने वाली रेसिपी को जोड़ता है।",
      nextTitle: "नया वीडियो कैसे जोड़ें",
      nextSteps: [
        "content/videos.json खोलें",
        "एक वीडियो ब्लॉक कॉपी करें",
        "नया YouTube ID, शीर्षक, सामग्री और स्टेप्स पेस्ट करें",
        "GitHub पर commit करें और Cloudflare अपने आप publish करेगा"
      ],
      shelvesTitle: "और वीडियो",
      published: "प्रकाशित",
      category: "श्रेणी",
      openRecipe: "किसी कार्ड पर क्लिक करके उसकी रेसिपी खोलें"
    },
    de: {
      heroKicker: "Entspannter Kochkanal",
      heroTitle: "Langsame Kochvideos mit Rezept zu jedem Video.",
      heroBody: "Sieh dir das Hauptvideo an, öffne sofort das Rezept und durchsuche deine Videobibliothek in einem klaren Netflix-Stil.",
      watchNow: "Hauptvideo ansehen",
      browse: "Videos durchsuchen",
      featured: "Hauptvideo",
      ingredients: "Zutaten",
      steps: "Schritte",
      recipe: "Rezept",
      ads: "Werbung",
      aboutTitle: "Über den Kanal",
      aboutBody: "Cooking with Anita verbindet entspannte Küchenvideos, einfache Hausmannskost und Rezepte, die in mehreren Sprachen gelesen werden können.",
      nextTitle: "So fügst du ein neues Video hinzu",
      nextSteps: [
        "Öffne content/videos.json",
        "Kopiere einen Videoblock",
        "Füge deine neue YouTube-ID, Titel, Zutaten und Schritte ein",
        "Commit zu GitHub und Cloudflare veröffentlicht automatisch"
      ],
      shelvesTitle: "Weitere Videos",
      published: "Veröffentlicht",
      category: "Kategorie",
      openRecipe: "Klicke auf eine Karte, um das Rezept zu laden"
    }
  }[currentLang];
}

function setActiveLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

function renderHero(video) {
  const t = getTranslation(video, currentLang);
  const ui = getUiText();

  document.getElementById("hero").innerHTML = `
    <div class="hero-inner">
      <div class="hero-kicker">${ui.heroKicker}</div>
      <h1>${ui.heroTitle}</h1>
      <p>${ui.heroBody}</p>
      <div class="hero-actions">
        <a class="btn-primary" href="https://www.youtube.com/watch?v=${video.youtubeId}" target="_blank" rel="noopener noreferrer">${ui.watchNow}</a>
        <a class="btn-secondary" href="#shelves">${ui.browse}</a>
      </div>
    </div>
  `;
}

function renderFeatured(video) {
  const t = getTranslation(video, currentLang);
  const ui = getUiText();

  document.getElementById("featured-video").innerHTML = `
    <h2 class="panel-title">${ui.featured}: ${t.title}</h2>
    <div class="meta-line">${ui.published}: ${fmtDate(video.publishedAt)} · ${ui.category}: ${t.category}</div>
    <div class="player-wrap">
      <iframe
        src="https://www.youtube.com/embed/${video.youtubeId}"
        title="${t.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <p class="copy">${t.description}</p>
  `;
}

function renderRecipe(video) {
  const t = getTranslation(video, currentLang);
  const ui = getUiText();

  document.getElementById("recipe-panel").innerHTML = `
    <h2 class="panel-title">${ui.recipe}: ${t.title}</h2>
    <div class="recipe-layout">
      <div class="subcard">
        <h3>${ui.ingredients}</h3>
        <ul class="clean">
          ${t.ingredients.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="subcard">
        <h3>${ui.steps}</h3>
        <ol class="clean">
          ${t.steps.map(item => `<li>${item}</li>`).join("")}
        </ol>
      </div>
    </div>
  `;
}

function renderSidePanels() {
  const ui = getUiText();
  document.getElementById("about-panel").innerHTML = `
    <h3 class="panel-title">${ui.aboutTitle}</h3>
    <p class="copy">${ui.aboutBody}</p>
  `;

  document.getElementById("next-panel").innerHTML = `
    <h3 class="panel-title">${ui.nextTitle}</h3>
    <div class="side-list">
      ${ui.nextSteps.map(step => `<div class="side-item">${step}</div>`).join("")}
    </div>
  `;
}

function uniqueCategories(videos) {
  return [...new Set(videos.map(v => v.categoryKey))];
}

function humanCategory(video) {
  const t = getTranslation(video, currentLang);
  return t.category || video.categoryKey;
}

function renderShelves(videos) {
  const ui = getUiText();
  const container = document.getElementById("shelves");
  const categories = uniqueCategories(videos);

  container.innerHTML = categories.map(cat => {
    const list = videos.filter(v => v.categoryKey === cat);
    return `
      <section class="shelf">
        <h2 class="shelf-title">${ui.shelvesTitle}: ${humanCategory(list[0])}</h2>
        <div class="shelf-row">
          ${list.map(video => {
            const t = getTranslation(video, currentLang);
            const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
            return `
              <article class="video-card" data-video-id="${video.id}">
                <div class="thumb" style="background-image:url('${thumb}')"></div>
                <div class="video-body">
                  <h3 class="video-title">${t.title}</h3>
                  <p class="video-meta">${fmtDate(video.publishedAt)}</p>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("") || `<p class="empty-note">${ui.openRecipe}</p>`;

  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      currentVideoId = card.dataset.videoId;
      const chosen = siteData.videos.find(v => v.id === currentVideoId);
      renderFeatured(chosen);
      renderRecipe(chosen);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderPage() {
  if (!siteData || !siteData.videos || !siteData.videos.length) return;
  const video = siteData.videos.find(v => v.id === currentVideoId) || siteData.videos[0];
  currentVideoId = video.id;

  renderHero(video);
  renderFeatured(video);
  renderRecipe(video);
  renderSidePanels();
  renderShelves(siteData.videos);
  setActiveLangButtons();
  document.documentElement.lang = currentLang;
}

async function loadData() {
  const response = await fetch("content/videos.json");
  siteData = await response.json();
  renderPage();
}

function setLang(lang) {
  currentLang = supportedLangs.includes(lang) ? lang : "en";
  persistLanguage(currentLang);
  renderPage();
}

document.addEventListener("DOMContentLoaded", () => {
  currentLang = detectLanguage();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  loadData();
});
