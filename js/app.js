const supportedLangs = ["es", "en", "hi", "de", "fr", "pt"];
let currentLang = "es";
let siteData = null;
let selectedVideoId = null;

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
    libraryTitle: "Biblioteca",
    librarySubtitle: "Cada tarjeta carga el video y su receta.",
    loading: "Cargando videos...",
    error: "No se pudieron cargar los videos."
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
    libraryTitle: "Library",
    librarySubtitle: "Each card loads the video and its recipe.",
    loading: "Loading videos...",
    error: "Videos could not be loaded."
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
    libraryTitle: "लाइब्रेरी",
    librarySubtitle: "हर कार्ड वीडियो और उसकी रेसिपी लोड करता है।",
    loading: "वीडियो लोड हो रहे हैं...",
    error: "वीडियो लोड नहीं हो सके।"
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
    libraryTitle: "Bibliothek",
    librarySubtitle: "Jede Karte lädt das Video und das Rezept.",
    loading: "Videos werden geladen...",
    error: "Die Videos konnten nicht geladen werden."
  },
  fr: {
    heroEyebrow: "Cooking with Anita",
    heroTitle: "Des vidéos de cuisine relaxantes avec une recette dans chaque vidéo",
    heroBody: "La langue est détectée automatiquement et vous pouvez la changer à tout moment.",
    featuredLabel: "Vidéo mise en avant",
    published: "Publié",
    category: "Catégorie",
    recipe: "Recette",
    ingredients: "Ingrédients",
    steps: "Étapes",
    adLabel: "Publicité",
    libraryTitle: "Bibliothèque",
    librarySubtitle: "Chaque carte charge la vidéo et sa recette.",
    loading: "Chargement des vidéos...",
    error: "Les vidéos n'ont pas pu être chargées."
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
    libraryTitle: "Biblioteca",
    librarySubtitle: "Cada cartão carrega o vídeo e sua receita.",
    loading: "Carregando vídeos...",
    error: "Não foi possível carregar os vídeos."
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
  if (video?.translations?.[lang]) return video.translations[lang];
  if (video?.translations?.es) return video.translations.es;

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

function getSelectedVideo() {
  if (!siteData?.videos?.length) return null;

  const found = siteData.videos.find(video => video.id === selectedVideoId);
  return found || siteData.videos[0];
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
        <ul>${(tr.ingredients || []).map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="subcard">
        <h3>${t.steps}</h3>
        <ol>${(tr.steps || []).map(item => `<li>${item}</li>`).join("")}</ol>
      </div>
    </div>
  `;
}

function renderLibrary(videos) {
  const t = ui[currentLang];
  const library = document.getElementById("library");

  document.getElementById("library-title").textContent = t.libraryTitle;
  document.getElementById("library-subtitle").textContent = t.librarySubtitle;
  document.getElementById("side-ad-left-label").textContent = t.adLabel;
  document.getElementById("side-ad-right-label").textContent = t.adLabel;
  document.getElementById("bottom-ad-label").textContent = t.adLabel;

  library.innerHTML = videos.map(video => {
    const tr = getText(video, currentLang);
    const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
    const isActive = video.id === selectedVideoId;

    return `
      <article class="video-card ${isActive ? "active" : ""}" data-id="${video.id}">
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
      selectedVideoId = card.dataset.id;
      const selected = getSelectedVideo();
      if (!selected) return;

      renderFeatured(selected);
      renderRecipe(selected);
      renderLibrary(siteData.videos);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

function renderError() {
  const t = ui[currentLang];

  document.getElementById("hero").innerHTML = `
    <div class="hero-inner">
      <div class="eyebrow">${t.heroEyebrow}</div>
      <h1>${t.error}</h1>
      <p>${t.loading}</p>
    </div>
  `;

  document.getElementById("featured").innerHTML = "";
  document.getElementById("recipe").innerHTML = "";
  document.getElementById("library").innerHTML = "";
}

function render() {
  if (!siteData?.videos?.length) {
    renderError();
    return;
  }

  if (!selectedVideoId) {
    selectedVideoId = siteData.videos[0].id;
  }

  const selected = getSelectedVideo();
  if (!selected) {
    renderError();
    return;
  }

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

  try {
    const response = await fetch("content/videos.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    siteData = await response.json();

    if (!siteData?.videos || !Array.isArray(siteData.videos)) {
      throw new Error("Invalid videos.json format");
    }

    render();
  } catch (error) {
    console.error("Error loading content/videos.json:", error);
    renderError();
  }
}

init();