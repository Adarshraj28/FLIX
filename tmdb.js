const TMDB_KEY = "779977e535b881dcdd84b8f778778481";
const IMG = "https://image.tmdb.org/t/p/w500";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

async function get(path){
  const url = `https://api.themoviedb.org/3${path}${
    path.includes("?") ? "&" : "?"
  }api_key=${TMDB_KEY}`;

  console.log("Request →", url); // debug log

  const res = await fetch(url);
  if(!res.ok){
    console.error("TMDB Error:", res.status);
  }
  return res.json();
}

async function fetchTrendingMovies() {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  return res.json();
}

async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return res.json();
}
