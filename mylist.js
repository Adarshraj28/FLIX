function addToMyList(movie) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];

  if (list.some(item => item.id === movie.id)) {
    alert("Already in My List ❤️");
    return;
  }

  list.push({
    id: movie.id,
    title: movie.title || movie.name,
    poster_path: movie.poster_path,
    release_date: movie.release_date || movie.first_air_date || ""
  });

  localStorage.setItem("myList", JSON.stringify(list));
  alert("Added to My List ❤️");
}

function removeFromMyList(id) {
  let list = JSON.parse(localStorage.getItem("myList")) || [];
  list = list.filter(movie => movie.id !== id);
  localStorage.setItem("myList", JSON.stringify(list));
}



