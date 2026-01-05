const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

/* Elements */
const hero = document.getElementById("detailsHero");
const titleEl = document.getElementById("detailsTitle");
const overviewEl = document.getElementById("detailsOverview");
const yearEl = document.getElementById("detailsYear");
const runtimeEl = document.getElementById("detailsRuntime");
const ratingEl = document.getElementById("detailsRating");
const typeBadge = document.getElementById("detailsType");
const castGrid = document.getElementById("castGrid");
const similarGrid = document.getElementById("similarGrid");

/* Trailer */
const trailerModal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailerFrame");
const playBtn = document.getElementById("playBtn");
const closeTrailer = document.getElementById("closeTrailer");

/* =========================
   LOAD DETAILS
========================= */

async function loadDetails() {
  const data = await get(`/${type}/${id}`);

  hero.style.backgroundImage =
    `url(${IMG_ORIGINAL}${data.backdrop_path})`;

  titleEl.textContent = data.title || data.name;
  overviewEl.textContent = data.overview || "No description available.";

  yearEl.textContent =
    (data.release_date || data.first_air_date || "").slice(0, 4);

  runtimeEl.textContent =
    data.runtime
      ? `${data.runtime} min`
      : data.episode_run_time?.[0]
      ? `${data.episode_run_time[0]} min`
      : "";

  ratingEl.innerHTML =
    `<i class="fa-solid fa-star"></i> ${data.vote_average.toFixed(1)}`;

  typeBadge.textContent = type.toUpperCase();

  loadCast();
  loadSimilar();
}

loadDetails();

/* =========================
   CAST
========================= */

async function loadCast() {
  const data = await get(`/${type}/${id}/credits`);
  castGrid.innerHTML = "";

  data.cast.slice(0, 10).forEach(actor => {
    if (!actor.profile_path) return;

    castGrid.innerHTML += `
      <div class="cast-card">
        <img src="${IMG}${actor.profile_path}">
        <div class="cast-name">${actor.name}</div>
        <div class="cast-role">${actor.character}</div>
      </div>
    `;
  });
}

/* =========================
   SIMILAR
========================= */

async function loadSimilar() {
  const data = await get(`/${type}/${id}/similar`);
  similarGrid.innerHTML = "";

  data.results.slice(0, 12).forEach(item => {
    if (!item.poster_path) return;

    similarGrid.innerHTML += `
      <div class="movie-card" onclick="location.href='details.html?id=${item.id}&type=${type}'">
        <img src="${IMG}${item.poster_path}">
        <div class="movie-info">
          <div>${item.title || item.name}</div>
        </div>
      </div>
    `;
  });
}

/* =========================
   TRAILER
========================= */

playBtn.addEventListener("click", async () => {
  const data = await get(`/${type}/${id}/videos`);
  const trailer = data.results.find(v => v.type === "Trailer");

  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  trailerFrame.src =
    `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

  trailerModal.classList.add("active");
});

closeTrailer.addEventListener("click", () => {
  trailerFrame.src = "";
  trailerModal.classList.remove("active");
});

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
