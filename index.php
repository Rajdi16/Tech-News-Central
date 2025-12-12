<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚡ Tech News Central</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
</head>

<body>

    <header>
        <div class="header-inner">
            <div class="logo-area">
                <h1> <span>Tech News</span> Central</h1>
            </div>

            <div class="controls-area">
                <select id="page-size" class="page-select">
                    <option value="25" selected>25 per load</option>
                    <option value="50">50 per load</option>
                    <option value="100">100 per load (Max)</option>
                </select>

                <div class="search-group">
                    <input type="text" id="search-input" placeholder="Search (e.g., AI, Cyber)...">
                    <button class="btn-search" id="btn-search">Search</button>
                    <button class="btn-search btn-reset" id="btn-reset">Reset</button>
                </div>
                <button class="btn-archive" id="btn-archive">▶ Archive</button>
            </div>
        </div>

        <div class="scroll-container">
            <div id="source-filters" class="source-filters">
            </div>
        </div>
    </header>

    <main id="news-container">
    </main>

    <footer>
        <div class="footer-inner">
            <div class="footer-col">
                <h3>⚡ Tech News Central</h3>
                <p>Curating the most relevant stories in technology, AI, and software development. Stay informed, stay ahead.</p>
            </div>

            <div class="footer-col">
                <h4>Quick Links</h4>
                <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;">↑ Back to Top</a>
                <a href="https://newsapi.org/" target="_blank">Powered by NewsAPI</a>
            </div>

            <div class="footer-col">
                <h4>Connect</h4>
                <div class="social-links">
                    <a href="https://github.com/Rajdi16">GitHub</a>
                    <a href="https://www.linkedin.com/in/rajdi-mucanji-b6076a30b/">LinkedIn</a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2024 Tech News Central. All rights reserved.</p>
        </div>
    </footer>
    <script src="script.js?v=<?php echo time(); ?>"></script>
</body>

</html>