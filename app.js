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

/* =========================
   HERO BUTTON ACTIONS (FIXED)
========================= */

const heroPlayBtn = document.getElementById("heroPlayBtn");
const heroInfoBtn = document.getElementById("heroInfoBtn");

function getCurrentHeroMovie() {
  return heroMovies[heroIndex];
}

/* PLAY NOW */
if (heroPlayBtn) {
  heroPlayBtn.addEventListener("click", () => {
    const movie = getCurrentHeroMovie();
    if (!movie) return;

    window.location.href = `details.html?id=${movie.id}`;
  });
}

/* MORE INFO */
if (heroInfoBtn) {
  heroInfoBtn.addEventListener("click", () => {
    const movie = getCurrentHeroMovie();
    if (!movie) return;

    window.location.href = `details.html?id=${movie.id}`;
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
   MY LIST BUTTON
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
   MY LIST PAGE RENDER
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("mylist-grid");
  const emptyMsg = document.getElementById("empty-msg");
  if (!grid) return;

  function renderMyList() {
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    grid.innerHTML = "";

    if (!list.length) {
      emptyMsg.style.display = "block";
      return;
    }

    emptyMsg.style.display = "none";

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <img src="${IMG}${item.poster_path}">
        <div class="card-overlay">
          <button class="play-btn">▶</button>
          <button class="remove-btn">✕</button>
        </div>
        <div class="movie-info">
          <div>${item.title}</div>
        </div>
      `;

      // PLAY
      card.querySelector(".play-btn").onclick = e => {
        e.stopPropagation();
        window.location.href = `details.html?id=${item.id}`;
      };

      // REMOVE (FIXED)
      card.querySelector(".remove-btn").onclick = e => {
        e.stopPropagation();

        card.classList.add("shrink-out");

        setTimeout(() => {
          removeFromMyList(item.id);
          renderMyList(); // ✅ FORCE REBUILD GRID
        }, 300);
      };

      grid.appendChild(card);
    });
  }

  renderMyList();
});

// REMOVE FROM MYLIST//
function removeFromMyList(id) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];
  list = list.filter(item => String(item.id) !== String(id));
  localStorage.setItem("myList", JSON.stringify(list));
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


/* =========================
   NAV SEARCH (TMDB)
========================= */

const navSearch = document.getElementById("navSearch");
const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("navSearchInput");
const searchResults = document.getElementById("navSearchResults");

if (
  navSearch &&
  searchToggle &&
  searchPanel &&
  searchInput &&
  searchResults
) {

let searchTimer = null;

/* Toggle search panel */
searchToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  searchPanel.classList.toggle("active");
  searchInput.focus();
});

/* Close search on outside click */
document.addEventListener("click", (e) => {
  if (!navSearch.contains(e.target)) {
    searchPanel.classList.remove("active");
  }
});

/* Live search input */
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);

  const query = searchInput.value.trim();
  if (query.length < 2) {
    searchResults.innerHTML = "";
    return;
  }

  searchTimer = setTimeout(() => {
    tmdbSearch(query);
  }, 400);
});
}

/* TMDB search */
async function tmdbSearch(query) {
  searchResults.innerHTML = `
    <div style="padding:8px;font-size:12px;color:#aaa">
      Searching...
    </div>
  `;

  try {
    const data = await get(
      `/search/multi?query=${encodeURIComponent(query)}`
    );

    searchResults.innerHTML = "";

    data.results.forEach(item => {
      if (!item.poster_path) return;
      if (!["movie", "tv"].includes(item.media_type)) return;

      const title = item.title || item.name;
      const year =
        item.release_date?.slice(0,4) ||
        item.first_air_date?.slice(0,4) ||
        "";

      const div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w92${item.poster_path}">
        <div>
          <div class="search-item-title">${title}</div>
          <div class="search-item-year">${year}</div>
        </div>
      `;

      div.addEventListener("click", () => {
        window.location.href =
          `details.html?id=${item.id}&type=${item.media_type}`;
      });

      searchResults.appendChild(div);
    });

    if (!searchResults.children.length) {
      searchResults.innerHTML = `
        <div style="padding:8px;font-size:12px;color:#aaa">
          No results found
        </div>
      `;
    }

  } catch (err) {
    console.error("Search failed", err);
    searchResults.innerHTML = `
      <div style="padding:8px;font-size:12px;color:red">
        Error loading search
      </div>
    `;
  }
}


/* =========================
   GLOBAL LOADER CONTROL
========================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("globalLoader");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hide");
  }, 600); // smooth delay
});

/* =========================
   MOVIES PAGE SEARCH (FINAL FIX)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const movieSearchInput = document.getElementById("movie-search");
  const moviesGrid = document.getElementById("movies-grid");
  const movieGenreLabel = document.getElementById("movieGenreLabel");

  if (!movieSearchInput || !moviesGrid) return;

  let searchTimer = null;

  movieSearchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    const query = movieSearchInput.value.trim();

    // RESET → Popular movies
    if (query.length === 0) {
      activeMovieGenre = null;
      movieGenreLabel.textContent = "Popular Movies";
      moviePage = 1;
      moviesGrid.innerHTML = "";
      loadMovies(true);
      return;
    }

    if (query.length < 2) return;

    searchTimer = setTimeout(() => {
      searchMovies(query);
    }, 400);
  });

});

/* SEARCH MOVIES */
async function searchMovies(query) {
  if (!moviesGrid) return;

  moviesGrid.innerHTML = "";
  movieLoading = true;

  try {
    const data = await get(`/search/movie?query=${encodeURIComponent(query)}`);

    movieGenreLabel.textContent = `Results for "${query}"`;

    if (!data.results.length) {
      moviesGrid.innerHTML = `
        <div style="color:#aaa;font-size:16px;padding:40px">
          No movies found
        </div>
      `;
      movieLoading = false;
      return;
    }

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
          <div class="year">${movie.release_date?.slice(0,4) || ""}</div>
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

  } catch (err) {
    console.error("Movie search failed", err);
  }

  movieLoading = false;
}


/* =========================
   SERIES PAGE SEARCH (FINAL FIX)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const seriesSearchInput = document.getElementById("series-search");
  const seriesGrid = document.getElementById("series-grid");
  const seriesGenreLabel = document.getElementById("seriesGenreLabel");

  if (!seriesSearchInput || !seriesGrid) return;

  let searchTimer = null;

  seriesSearchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    const query = seriesSearchInput.value.trim();

    // RESET → Popular Series
    if (query.length === 0) {
      activeSeriesGenre = null;
      seriesGenreLabel.textContent = "Popular Series";
      seriesPage = 1;
      seriesGrid.innerHTML = "";
      loadSeries(true);
      return;
    }

    if (query.length < 2) return;

    searchTimer = setTimeout(() => {
      searchSeries(query);
    }, 400);
  });

});

/* SEARCH SERIES */
async function searchSeries(query) {
  if (!seriesGrid) return;

  seriesGrid.innerHTML = "";
  seriesLoading = true;

  try {
    const data = await get(
      `/search/tv?query=${encodeURIComponent(query)}`
    );

    seriesGenreLabel.textContent = `Results for "${query}"`;

    if (!data.results.length) {
      seriesGrid.innerHTML = `
        <div style="color:#aaa;font-size:16px;padding:40px">
          No series found
        </div>
      `;
      seriesLoading = false;
      return;
    }

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
        location.href =
          `details.html?id=${show.id}&type=tv`;
      };

      card.querySelector(".save-btn").onclick = e => {
        e.stopPropagation();
        addToMyList(show);
      };

      seriesGrid.appendChild(card);
    });

  } catch (err) {
    console.error("Series search failed", err);
  }

  seriesLoading = false;
}
