const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

if (!movieId) {
  alert("Movie not found");
}

/* Fetch movie details */
fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(movie => {
    // Hero background
    document.getElementById("details-hero").style.backgroundImage =
      `url(${IMG.replace("w500","original")}${movie.backdrop_path})`;

    document.getElementById("title").textContent = movie.title;
    document.getElementById("overview").textContent = movie.overview;
    document.getElementById("rating").textContent = "⭐ " + movie.vote_average.toFixed(1);
    document.getElementById("year").textContent = movie.release_date.slice(0,4);
    document.getElementById("genres").textContent =
      movie.genres.map(g => g.name).join(", ");

    // Save button
    document.querySelector(".save").onclick = () => addToMyList(movie);
  });
