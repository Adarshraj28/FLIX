// HERO SECTION
get("/trending/movie/week").then(data=>{
  const m = data.results[0];
  document.getElementById("hero").style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${m.backdrop_path})`;
  heroTitle.innerText = m.title;
  heroDesc.innerText = m.overview.slice(0,130)+"...";
});

// TRENDING GRID
get("/trending/movie/week").then(data=>{
  const box = document.getElementById("trending");
  data.results.forEach(m=>{
    box.innerHTML += `
      <div class="card">
        <img src="${IMG+m.poster_path}">
        <div class="card-title">${m.title}</div>
      </div>`;
  });
});

get("/trending/movie/week").then(data=>{
  const m = data.results[0];

  document.getElementById("hero").style.backgroundImage =
    `url(${IMG_ORIGINAL}${m.backdrop_path})`;

  heroTitle.innerText = m.title;
  heroDesc.innerText = m.overview.slice(0,150) + "...";
});

get("/trending/movie/week").then(data=>{
  const box = document.getElementById("trending");
  data.results.forEach(m=>{
    box.innerHTML += `
      <div class="card">
        <img src="${IMG+m.poster_path}">
        <div class="card-title">${m.title}</div>
      </div>`;
  });
});


// SIDE ARROW FUNCTIONALITY
const row = document.getElementById("trending-container");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

if (row && leftBtn && rightBtn) {
  leftBtn.addEventListener("click", () => {
    row.scrollLeft -= 400;
  });

  rightBtn.addEventListener("click", () => {
    row.scrollLeft += 400;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("trending-container");
  if (!container) return;

  const data = await fetchTrending();

  data.results.forEach(movie => {
    if (!movie.poster_path) return;

    const img = document.createElement("img");
    img.src = IMG_URL + movie.poster_path;
    img.alt = movie.title;
    container.appendChild(img);
  });
});


const grid = document.getElementById("movies-grid");

async function loadMovies() {
  if (!grid) return;

  const data = await fetchTrendingMovies();
  renderMovies(data.results);
}

function renderMovies(movies) {
  grid.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
      <div class="movie-info">
        <div>${movie.title}</div>
        <div class="year">
          ${movie.release_date?.slice(0,4)}
          <span class="hd">HD</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

loadMovies();

// MYLIST//
function addToMyList(movie) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];

  if (list.some(item => item.id === movie.id)) return;

  list.push(movie);
  localStorage.setItem("myList", JSON.stringify(list));
}
const myListGrid = document.getElementById("mylist-grid");
const emptyMsg = document.getElementById("empty-msg");

function loadMyList() {
  if (!myListGrid) return;

  const list = JSON.parse(localStorage.getItem("myList")) || [];

  if (list.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";
  myListGrid.innerHTML = "";

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <div class="movie-info">
        <div>${movie.title || movie.name}</div>
        <div class="year">
          ${(movie.release_date || movie.first_air_date || "").slice(0,4)}
          <span class="hd">HD</span>
        </div>
      </div>
    `;

    myListGrid.appendChild(card);
  });
}

loadMyList();


//Play Button//
function playMovie(id) {
  window.location.href = `details.html?id=${id}`;
}

//Mylist Button//
function addToMyList(movie) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];

  if (!list.some(item => item.id === movie.id)) {
    list.push(movie);
    localStorage.setItem("myList", JSON.stringify(list));
    alert("Added to My List ❤️");
  }
}
