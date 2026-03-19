const supportedLangs = ["es", "en", "hi", "de", "fr", "pt"];
let currentLang = "es";
let siteData = null;

const ui = {
  es: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Videos relajantes de cocina con receta en cada video",
    heroBody: "El idioma se detecta automáticamente y puedes cambiarlo cuando quieras.",
    featuredLabel: "Video destacado",
    published: "Publicado",
    category: "Categoría",
    recipe: "Receta",
    ingredients: "Ingredientes",
    steps: "Pasos",
    adLabel: "Publicidad",
    sideAdText: "Espacio publicitario lateral",
    bottomAdText: "Espacio publicitario inferior",
    libraryTitle: "Biblioteca",
    librarySubtitle: "Cada tarjeta carga el video y su receta."
  },
  en: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Relaxing cooking videos with a recipe in every video",
    heroBody: "The language is detected automatically and you can change it anytime.",
    featuredLabel: "Featured video",
    published: "Published",
    category: "Category",
    recipe: "Recipe",
    ingredients: "Ingredients",
    steps: "Steps",
    adLabel: "Advertisement",
    sideAdText: "Side ad space",
    bottomAdText: "Bottom ad space",
    libraryTitle: "Library",
    librarySubtitle: "Each card loads the video and its recipe."
  },
  hi: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "हर वीडियो के साथ रेसिपी वाले आरामदायक कुकिंग वीडियो",
    heroBody: "भाषा अपने आप पहचानी जाती है और आप चाहें तो बदल सकते हैं।",
    featuredLabel: "फ़ीचर्ड वीडियो",
    published: "प्रकाशित",
    category: "श्रेणी",
    recipe: "रेसिपी",
    ingredients: "सामग्री",
    steps: "स्टेप्स",
    adLabel: "विज्ञापन",
    sideAdText: "साइड विज्ञापन स्थान",
    bottomAdText: "नीचे विज्ञापन स्थान",
    libraryTitle: "लाइब्रेरी",
    librarySubtitle: "हर कार्ड वीडियो और उसकी रेसिपी लोड करता है।"
  },
  de: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Entspannte Kochvideos mit Rezept in jedem Video",
    heroBody: "Die Sprache wird automatisch erkannt und du kannst sie jederzeit ändern.",
    featuredLabel: "Hauptvideo",
    published: "Veröffentlicht",
    category: "Kategorie",
    recipe: "Rezept",
    ingredients: "Zutaten",
    steps: "Schritte",
    adLabel: "Werbung",
    sideAdText: "Seitlicher Werbeplatz",
    bottomAdText: "Unterer Werbeplatz",
    libraryTitle: "Bibliothek",
    librarySubtitle: "Jede Karte lädt das Video und das Rezept."
  },
  fr: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Des vidéos de cuisine relaxantes con una recette dans chaque vidéo",
    heroBody: "La langue est détectée automatiquement et vous pouvez la changer à tout moment.",
    featuredLabel: "Vidéo mise en avant",
    published: "Publié",
    category: "Catégorie",
    recipe: "Recette",
    ingredients: "Ingrédients",
    steps: "Étapes",
    adLabel: "Publicité",
    sideAdText: "Espace publicitaire latéral",
    bottomAdText: "Espace publicitaire inférieur",
    libraryTitle: "Bibliothèque",
    librarySubtitle: "Chaque carte charge la vidéo et sa recette."
  },
  pt: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Vídeos relaxantes de culinária com uma receita em cada vídeo",
    heroBody: "O idioma é detectado automaticamente e você pode alterá-lo a qualquer momento.",
    featuredLabel: "Vídeo em destaque",
    published: "Publicado",
    category: "Categoria",
    recipe: "Receita",
    ingredients: "Ingredientes",
    steps: "Passos",
    adLabel: "Publicidade",
    sideAdText: "Espaço publicitário lateral",
    bottomAdText: "Espaço publicitário inferior",
    libraryTitle: "Biblioteca",
    librarySubtitle: "Cada cartão carrega o vídeo e sua receita."
  }
};

function detectLanguage() {
  const saved = localStorage.getItem("cwa-lang");
  if (saved && supportedLangs.includes(saved)) return saved;

  const langs = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "es"];

  for (const lang of langs) {
    const short = String(lang).toLowerCase().split("-")[0];
    if (supportedLangs.includes(short)) return short;
  }

  return "es";
}

function setLang(lang) {
  currentLang = supportedLangs.includes(lang) ? lang : "es";
  localStorage.setItem("cwa-lang", currentLang);
  render();
}

function getText(video, lang) {
  if (video.translations && video.translations[lang]) return video.translations[lang];
  if (video.translations && video.translations.es) return video.translations.es;

  return {
    title: "",
    description: "",
    category: "",
    ingredients: [],
    steps: []
  };
}

function formatDate(dateString) {
  const locale = {
    es: "es-ES",
    en: "en-US",
    hi: "hi-IN",
    de: "de-DE",
    fr: "fr-FR",
    pt: "pt-BR"
  }[currentLang] || "es-ES";

  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

function renderHero() {
  const t = ui[currentLang];

  document.getElementById("hero").innerHTML = `
    <div class="hero-inner">
      <div class="eyebrow">${t.heroEyebrow}</div>
      <h1>${t.heroTitle}</h1>
      <p>${t.heroBody}</p>
    </div>
  `;
}

function renderFeatured(video) {
  const t = ui[currentLang];
  const tr = getText(video, currentLang);

  document.getElementById("featured").innerHTML = `
    <h2 class="section-title">${t.featuredLabel}: ${tr.title}</h2>
    <div class="meta">${t.published}: ${formatDate(video.publishedAt)} · ${t.category}: ${tr.category}</div>
    <div class="player">
      <iframe
        src="https://www.youtube.com/embed/${video.youtubeId}"
        title="${tr.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <p class="description">${tr.description}</p>
  `;
}

function renderRecipe(video) {
  const t = ui[currentLang];
  const tr = getText(video, currentLang);

  document.getElementById("recipe").innerHTML = `
    <h2 class="section-title">${t.recipe}</h2>
    <div class="recipe-grid">
      <div class="subcard">
        <h3>${t.ingredients}</h3>
        <ul>${tr.ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="subcard">
        <h3>${t.steps}</h3>
        <ol>${tr.steps.map(item => `<li>${item}</li>`).join("")}</ol>
      </div>
    </div>
  `;
}

function renderLibrary(videos) {
  const t = ui[currentLang];

  document.getElementById("library-title").textContent = t.libraryTitle;
  document.getElementById("library-subtitle").textContent = t.librarySubtitle;

  document.getElementById("side-ad-left-label").textContent = t.adLabel;
  document.getElementById("side-ad-right-label").textContent = t.adLabel;
  document.getElementById("bottom-ad-label").textContent = t.adLabel;

  document.getElementById("side-ad-left").textContent = t.sideAdText;
  document.getElementById("side-ad-right").textContent = t.sideAdText;
  document.getElementById("bottom-ad").textContent = t.bottomAdText;

  const library = document.getElementById("library");

  library.innerHTML = videos.map(video => {
    const tr = getText(video, currentLang);
    const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

    return `
      <article class="video-card" data-id="${video.id}">
        <div class="thumb" style="background-image:url('${thumb}')"></div>
        <div class="video-card-body">
          <h3 class="video-card-title">${tr.title}</h3>
          <p class="video-card-meta">${formatDate(video.publishedAt)}</p>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      const selected = siteData.videos.find(v => v.id === card.dataset.id);
      if (!selected) return;
      renderFeatured(selected);
      renderRecipe(selected);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

function render() {
  if (!siteData || !siteData.videos || !siteData.videos.length) return;

  const selected = siteData.videos[0];
  renderHero();
  renderFeatured(selected);
  renderRecipe(selected);
  renderLibrary(siteData.videos);

  document.documentElement.lang = currentLang;
}

async function init() {
  currentLang = detectLanguage();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const response = await fetch("content/videos.json");
  siteData = await response.json();
  render();
}

init();