# ⚡ Tech News Central

**Tech News Central** is a dynamic, responsive web application that aggregates the latest technology news from around the globe. Built with vanilla JavaScript, PHP, and CSS, it offers a clean, user-friendly interface to browse, search, and filter tech stories in real-time.

---

## ✨ Key Features

* **Real-Time News Aggregation:** Fetches the latest articles using the [NewsAPI](https://newsapi.org/).
* **Dynamic Source Filtering:** Automatically extracts news sources from the loaded articles and creates clickable filter chips (e.g., "The Verge", "Wired", "TechCrunch").
* **Smart Search:** Allows users to search for specific topics (e.g., "AI", "Cybersecurity") with a reset functionality.
* **Archive Mode:** Toggle between "Latest News" and an "Archive" mode to fetch older stories automatically.
* **Infinite Scroll / Load More:** Automatically loads more articles as you scroll down (in Archive mode) or fetches larger batches based on user settings.
* **Customizable Page Size:** Users can choose to load 25, 50, or 100 articles per request.
* **Content Filtering:** Automatically filters out irrelevant topics (sports, gossip, recipes) to ensure the feed stays focused on technology.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Technologies Used

* **Frontend:** HTML5, CSS3 (Custom Properties/Variables, Grid, Flexbox), JavaScript (ES6+).
* **Backend:** PHP (Used primarily for serving the `index.php` entry point).
* **API:** [NewsAPI](https://newsapi.org/) (External service for fetching news data).
* **Fonts:** Inter (via Google Fonts).

---

## 📂 Project Structure

```text
├── index.php       # Main entry point (HTML structure)
├── style.css       # All styling (Variables, Grid layout, Responsive media queries)
├── script.js       # Core logic (Fetching API, DOM manipulation, Event listeners)
└── README.md       # Project documentation