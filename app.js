/* =====================================================
   APP.JS – FINAL CLEAN (MOVIES + SERIES GENRE + INFINITE)
===================================================== */

///HERO///
/* =========================
   HERO SLIDER (FIXED)
========================= */

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroDots = document.getElementById("heroDots");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");


let heroMovies = [];
let heroIndex = 0;
let heroTimer = null;
const HERO_INTERVAL = 7000;

if (hero) {
  get("/trending/movie/week").then(data => {
    heroMovies = data.results
      .filter(m => m.backdrop_path)
      .slice(0, 6);

    if (!heroMovies.length) return;

    renderHeroDots();
    setHeroSlide(0);
    startHeroAuto();
  });
}

function setHeroSlide(index) {
  const movie = heroMovies[index];
  if (!movie) return;

  hero.style.backgroundImage =
    `url(${IMG_ORIGINAL}${movie.backdrop_path})`;

  heroTitle.textContent = movie.title;
  heroDesc.textContent = movie.overview
    ? movie.overview.slice(0, 160) + "…"
    : "";

  heroIndex = index;
  updateHeroDots();
}

function startHeroAuto() {
  stopHeroAuto();
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroMovies.length;
    setHeroSlide(heroIndex);
  }, HERO_INTERVAL);
}

function stopHeroAuto() {
  if (heroTimer) clearInterval(heroTimer);
}

function renderHeroDots() {
  heroDots.innerHTML = "";
  heroMovies.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "hero-dot";
    dot.onclick = () => {
      stopHeroAuto();
      setHeroSlide(i);
      startHeroAuto();
    };
    heroDots.appendChild(dot);
  });
}

function updateHeroDots() {
  document.querySelectorAll(".hero-dot").forEach((d, i) =>
    d.classList.toggle("active", i === heroIndex)
  );
}

/* =========================
   HERO ARROWS 
========================= */

function goPrevHero() {
  if (!heroMovies.length) return;

  stopHeroAuto();
  heroIndex = (heroIndex - 1 + heroMovies.length) % heroMovies.length;
  setHeroSlide(heroIndex);
  startHeroAuto();
}

function goNextHero() {
  if (!heroMovies.length) return;

  stopHeroAuto();
  heroIndex = (heroIndex + 1) % heroMovies.length;
  setHeroSlide(heroIndex);
  startHeroAuto();
}

if (prevBtn) {
  prevBtn.addEventListener("click", goPrevHero);
}

if (nextBtn) {
  nextBtn.addEventListener("click", goNextHero);
}


/* =========================
   HERO BUTTON ACTIONS
========================= */

const playBtn = document.querySelector(".btn-red");
const infoBtn = document.querySelector(".btn-dark");

if (playBtn) {
  playBtn.addEventListener("click", () => {
    const movie = heroMovies[heroIndex];
    if (!movie) return;

    // Go to details page
    window.location.href = `details.html?id=${movie.id}`;
  });
}

if (infoBtn) {
  infoBtn.addEventListener("click", () => {
    const movie = heroMovies[heroIndex];
    if (!movie) return;

    // Simple info popup (safe)
    alert(movie.overview || "No description available");
  });
}


/* =========================
   GLOBAL STATE
========================= */

let activeMovieGenre = null;
let activeSeriesGenre = null;

/* =========================
   MOVIES – GENRE + INFINITE
========================= */

const moviesGrid = document.getElementById("movies-grid");
const genreBtn = document.getElementById("genreBtn");
const genreDropdown = document.getElementById("genreDropdown");
const movieGenreLabel = document.getElementById("movieGenreLabel");

let moviePage = 1;
let movieLoading = false;

async function loadMovies(reset = false) {
  if (!moviesGrid || movieLoading) return;

  if (reset) {
    moviesGrid.innerHTML = "";
    moviePage = 1;
  }

  movieLoading = true;

  const endpoint = activeMovieGenre
    ? `/discover/movie?with_genres=${activeMovieGenre}&page=${moviePage}`
    : `/movie/popular?page=${moviePage}`;

  try {
    const data = await get(endpoint);

    data.results.forEach(movie => {
      if (!movie.poster_path) return;

      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <span class="rating">
          <i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)}
        </span>

        <img src="${IMG}${movie.poster_path}">

        <div class="card-overlay">
          <button class="play-btn">▶</button>
          <button class="save-btn">＋</button>
        </div>

        <div class="movie-info">
          <div>${movie.title}</div>
        </div>
      `;

      card.querySelector(".play-btn").onclick = e => {
        e.stopPropagation();
        location.href = `details.html?id=${movie.id}`;
      };

      card.querySelector(".save-btn").onclick = e => {
        e.stopPropagation();
        addToMyList(movie);
      };

      moviesGrid.appendChild(card);
    });

    moviePage++;
  } catch (err) {
    console.error("Movie load failed", err);
  }

  movieLoading = false;
}

/* INIT + SCROLL */
if (moviesGrid) {
  loadMovies();

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
      loadMovies();
    }
  });
}

/* MOVIE GENRE DROPDOWN */
if (genreBtn && genreDropdown) {
  genreBtn.onclick = () => genreDropdown.classList.toggle("active");

  get("/genre/movie/list").then(data => {
    genreDropdown.innerHTML = "";

    const all = document.createElement("div");
    all.className = "genre-item active";
    all.textContent = "Popular";

    all.onclick = () => {
      activeMovieGenre = null;
      movieGenreLabel.textContent = "Popular Movies";
      setActiveGenre(genreDropdown, all);
      genreDropdown.classList.remove("active");
      loadMovies(true);
    };

    genreDropdown.appendChild(all);

    data.genres.forEach(g => {
      const item = document.createElement("div");
      item.className = "genre-item";
      item.textContent = g.name;

      item.onclick = () => {
        activeMovieGenre = g.id;
        movieGenreLabel.textContent = `${g.name} Movies`;
        setActiveGenre(genreDropdown, item);
        genreDropdown.classList.remove("active");
        loadMovies(true);
      };

      genreDropdown.appendChild(item);
    });
  });
}

/* =========================
   SERIES – GENRE + INFINITE
========================= */

const seriesGrid = document.getElementById("series-grid");
const seriesGenreBtn = document.getElementById("seriesGenreBtn");
const seriesGenreDropdown = document.getElementById("seriesGenreDropdown");
const seriesGenreLabel = document.getElementById("seriesGenreLabel");

let seriesPage = 1;
let seriesLoading = false;

async function loadSeries(reset = false) {
  if (!seriesGrid || seriesLoading) return;

  if (reset) {
    seriesGrid.innerHTML = "";
    seriesPage = 1;
  }

  seriesLoading = true;

  const endpoint = activeSeriesGenre
    ? `/discover/tv?with_genres=${activeSeriesGenre}&page=${seriesPage}`
    : `/tv/popular?page=${seriesPage}`;

  try {
    const data = await get(endpoint);

    data.results.forEach(show => {
      if (!show.poster_path) return;

      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <span class="rating">
          <i class="fa-solid fa-star"></i> ${show.vote_average.toFixed(1)}
        </span>

        <img src="${IMG}${show.poster_path}">

        <div class="card-overlay">
          <button class="play-btn">▶</button>
          <button class="save-btn">＋</button>
        </div>

        <div class="movie-info">
          <div>${show.name}</div>
          <div class="year">
            ${show.first_air_date?.slice(0,4) || ""}
          </div>
        </div>
      `;

      card.querySelector(".play-btn").onclick = e => {
        e.stopPropagation();
        location.href = `details.html?id=${show.id}&type=tv`;
      };

      card.querySelector(".save-btn").onclick = e => {
        e.stopPropagation();
        addToMyList(show);
      };

      seriesGrid.appendChild(card);
    });

    seriesPage++;
  } catch (err) {
    console.error("Series load failed", err);
  }

  seriesLoading = false;
}

/* INIT + SCROLL */
if (seriesGrid) {
  loadSeries();

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
      loadSeries();
    }
  });
}

/* SERIES GENRE DROPDOWN */
if (seriesGenreBtn && seriesGenreDropdown) {
  seriesGenreBtn.onclick = () =>
    seriesGenreDropdown.classList.toggle("active");

  get("/genre/tv/list").then(data => {
    seriesGenreDropdown.innerHTML = "";

    const all = document.createElement("div");
    all.className = "genre-item active";
    all.textContent = "Popular";

    all.onclick = () => {
      activeSeriesGenre = null;
      seriesGenreLabel.textContent = "Popular Series";
      setActiveGenre(seriesGenreDropdown, all);
      seriesGenreDropdown.classList.remove("active");
      loadSeries(true);
    };

    seriesGenreDropdown.appendChild(all);

    data.genres.forEach(g => {
      const item = document.createElement("div");
      item.className = "genre-item";
      item.textContent = g.name;

      item.onclick = () => {
        activeSeriesGenre = g.id;
        seriesGenreLabel.textContent = `${g.name} Series`;
        setActiveGenre(seriesGenreDropdown, item);
        seriesGenreDropdown.classList.remove("active");
        loadSeries(true);
      };

      seriesGenreDropdown.appendChild(item);
    });
  });
}

/* =========================
   HELPERS
========================= */

function setActiveGenre(dropdown, activeItem) {
  dropdown.querySelectorAll(".genre-item").forEach(i =>
    i.classList.remove("active")
  );
  activeItem.classList.add("active");
}

/* =========================
   MY LIST
========================= */

function addToMyList(item) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];

  if (list.some(i => i.id === item.id)) {
    alert("Already in My List ❤️");
    return;
  }

  list.push({
    id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path
  });

  localStorage.setItem("myList", JSON.stringify(list));
  alert("Added to My List ❤️");
}

/* =========================
   NOTIFICATION DROPDOWN LOGIC
========================= */

const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationCount = document.getElementById("notificationCount");

if (notificationBtn && notificationDropdown) {
  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle("active");
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    notificationDropdown.classList.remove("active");
  });
}

const updates = [
  "🎬 New action movies released",
  "🔥 Trending series updated",
  "❤️ Your list has new suggestions"
];

const dropdown = document.getElementById("notificationDropdown");
dropdown.innerHTML = `
  <div class="notification-header">Notifications</div>
  ${updates.map(u => `<div class="notification-item">${u}</div>`).join("")}
  <div class="notification-footer">View all updates</div>
`;

notificationCount.textContent = updates.length;
