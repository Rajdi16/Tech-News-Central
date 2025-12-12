// ====================================================================
// === TECH NEWS CENTRAL - JAVASCRIPT ===
// ====================================================================

// WARNING: In a real app, use a proxy to hide this key!
const API_KEY = "";

// --- CONSTANTS ---
const CONTAINER = document.getElementById("news-container");
const SOURCE_CONTAINER = document.getElementById("source-filters");
const MAX_ARCHIVE_DAYS = 60;

const BANNED_KEYWORDS = [
  "football",
  "soccer",
  "baseball",
  "nba",
  "nfl",
  "dating",
  "horoscope",
  "recipe",
  "diet",
  "kardashian",
  "royal family",
  "celebrity",
  "gossip",
  "stock market",
  "dow jones",
  "election polls",
];

// --- STATE ---
let state = {
  offsetDays: 0, // How far back we are currently looking
  articles: [],
  isLoading: false,
  query: "",
  mode: "LATEST",
  activeSource: "All",
  pageSize: 25,
};

let observer = null;
let sensor = null;

// --- VALIDATION & NORMALIZATION ---
function validateTechContent(article) {
  const text = (
    article.title +
    " " +
    (article.description || "")
  ).toLowerCase();
  if (BANNED_KEYWORDS.some((word) => text.includes(word))) return false;
  if (!article.title || article.title === "[Removed]") return false;
  return true;
}

function normalizeArticle(article) {
  let source = article.source?.name || "Tech Source";
  source = source.replace(/.com|The | Inc.| Media/g, "").trim();

  return {
    title: article.title,
    desc: article.description || "Click to read the full story.",
    url: article.url,
    img: article.urlToImage,
    date: new Date(article.publishedAt),
    source: source,
    isGold: article.title.toLowerCase().includes("quantum"),
  };
}

// --- FETCHING LOGIC ---
async function fetchNews(isInitial = false) {
  if (state.isLoading) return;
  state.isLoading = true;

  state.pageSize = document.getElementById("page-size").value;

  if (isInitial) {
    state.articles = [];
    state.activeSource = "All";

    // --- KEY FIX: DISTINCT DATE RANGES ---
    if (state.mode === "ARCHIVE") {
      // Archive starts from 7 days ago, going backwards
      state.offsetDays = 7;
    } else {
      // Latest starts from Today (0 days ago)
      state.offsetDays = 0;
    }

    CONTAINER.innerHTML = `<div class="loader-box"><div class="spinner"></div><p>Loading ${
      state.mode === "ARCHIVE" ? "Archive" : "Latest"
    } Stories...</p></div>`;
    SOURCE_CONTAINER.innerHTML = "";
    cleanupObserver();
  } else {
    // Load more: go further back in time
    state.offsetDays += 7;
    addLoaderBottom();
  }

  // Calculate Dates
  const today = new Date();

  // "To" date is where we start looking backwards from
  const toDate = new Date();
  toDate.setDate(today.getDate() - state.offsetDays);

  // "From" date is a 7-day chunk before that
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - 7);

  let q =
    state.query ||
    'technology OR "artificial intelligence" OR gadget OR software';
  const apiExclude = "-sports -recipe -horoscope";

  // Note: We use the explicit dates to create the "Window" of time
  const url = `https://newsapi.org/v2/everything?q=(${q}) ${apiExclude}&language=en&sortBy=publishedAt&from=${
    fromDate.toISOString().split("T")[0]
  }&to=${toDate.toISOString().split("T")[0]}&pageSize=${
    state.pageSize
  }&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.querySelectorAll(".loader-box").forEach((el) => el.remove());

    if (data.status === "error") throw new Error(data.message);

    const rawArticles = data.articles || [];
    const cleanArticles = rawArticles
      .filter(validateTechContent)
      .map(normalizeArticle);

    if (cleanArticles.length === 0) {
      if (isInitial)
        CONTAINER.innerHTML = `<div class="loader-box"><p>No articles found for this period.</p></div>`;
      else addMessage("No more older articles found.");
    } else {
      // Filter out duplicates
      const ids = new Set(state.articles.map((a) => a.title));
      const newUnique = cleanArticles.filter((a) => !ids.has(a.title));

      state.articles = [...state.articles, ...newUnique];
      // Sort: If in Archive, we still usually want newest-of-the-oldest at top
      state.articles.sort((a, b) => b.date - a.date);

      renderSourceFilters();
      render();
    }
  } catch (err) {
    console.error(err);
    document.querySelectorAll(".loader-box").forEach((el) => el.remove());
    if (isInitial)
      CONTAINER.innerHTML = `<div class="loader-box"><p>Error: ${err.message}</p></div>`;
  }
  state.isLoading = false;
}

// --- SOURCE FILTER RENDERING ---
function renderSourceFilters() {
  const sources = new Set(state.articles.map((a) => a.source));
  const sortedSources = ["All", ...Array.from(sources).sort()];

  SOURCE_CONTAINER.innerHTML = "";

  sortedSources.forEach((sourceName) => {
    const btn = document.createElement("button");
    btn.className = `filter-chip ${
      state.activeSource === sourceName ? "active" : ""
    }`;
    btn.textContent = sourceName;
    btn.onclick = () => {
      state.activeSource = sourceName;
      render();
      updateFilterVisuals();
    };
    SOURCE_CONTAINER.appendChild(btn);
  });
}

function updateFilterVisuals() {
  const buttons = SOURCE_CONTAINER.querySelectorAll(".filter-chip");
  buttons.forEach((btn) => {
    if (btn.textContent === state.activeSource) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

// --- MAIN RENDER LOGIC ---
function render() {
  CONTAINER.innerHTML = "";

  const filteredList =
    state.activeSource === "All"
      ? state.articles
      : state.articles.filter((a) => a.source === state.activeSource);

  if (filteredList.length === 0) {
    CONTAINER.innerHTML = `<div class="loader-box"><p>No articles from "${state.activeSource}" loaded yet.</p></div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  filteredList.forEach((article) => {
    const card = document.createElement("div");
    card.className = `news-card ${article.isGold ? "card-gold" : ""}`;
    card.onclick = () => window.open(article.url, "_blank");

    const imgUrl = article.img
      ? article.img
      : "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

    // Better Time Display
    const timeAgo = Math.floor((new Date() - article.date) / 3600000);
    let timeStr;
    if (timeAgo < 24) timeStr = `${timeAgo}h ago`;
    else {
      const d = article.date;
      timeStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    card.innerHTML = `
            <div class="image-wrapper"><img class="article-img" src="${imgUrl}" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'"></div>
            <div class="content">
                <h2>${article.title}</h2>
                <p>${article.desc}</p>
                <div class="meta">
                    <span class="source-tag ${
                      article.isGold ? "tag-gold" : ""
                    }">${article.source}</span>
                    <span class="time-tag">${timeStr}</span>
                </div>
            </div>`;
    frag.appendChild(card);
  });
  CONTAINER.appendChild(frag);

  // Always setup observer for infinite scroll
  setupObserver();
}

// --- OBSERVERS & UTILS ---
function setupObserver() {
  cleanupObserver();
  sensor = document.createElement("div");
  sensor.style.height = "10px";
  CONTAINER.appendChild(sensor);
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !state.isLoading) fetchNews(false);
  });
  observer.observe(sensor);
}
function cleanupObserver() {
  if (observer) observer.disconnect();
  if (sensor) sensor.remove();
}
function addLoaderBottom() {
  if (sensor)
    sensor.insertAdjacentHTML(
      "beforebegin",
      `<div class="loader-box"><div class="spinner"></div></div>`
    );
}
function addMessage(msg) {
  CONTAINER.insertAdjacentHTML(
    "beforeend",
    `<div class="loader-box"><p>${msg}</p></div>`
  );
}

// --- EVENTS ---
document.getElementById("btn-search").onclick = () => {
  state.query = document.getElementById("search-input").value;
  fetchNews(true);
};
document.getElementById("btn-reset").onclick = () => {
  document.getElementById("search-input").value = "";
  state.query = "";
  fetchNews(true);
};
document.getElementById("btn-archive").onclick = (e) => {
  state.mode = state.mode === "LATEST" ? "ARCHIVE" : "LATEST";
  e.target.classList.toggle("active");
  e.target.textContent = state.mode === "ARCHIVE" ? "◀ Latest" : "▶ Archive";
  fetchNews(true);
};

// RELOAD FEED WHEN PAGE SIZE CHANGES
document.getElementById("page-size").onchange = () => {
  fetchNews(true);
};

// --- INIT ---
fetchNews(true);
