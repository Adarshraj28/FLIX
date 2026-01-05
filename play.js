get("/movie/popular").then(data => {
  const box = document.getElementById("movies");

  data.results.forEach(m => {
    if (!m.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${IMG + m.poster_path}">

      <div class="card-overlay">
        <button class="play-btn">▶</button>
        <button class="save-btn">❤️</button>
      </div>

      <div class="card-title">${m.title}</div>
    `;

    const playBtn = card.querySelector(".play-btn");
    const saveBtn = card.querySelector(".save-btn");

    /* ▶ PLAY → DETAILS PAGE */
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `details.html?id=${m.id}`;
    });

    /* ❤️ SAVE → MY LIST */
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToMyList(m);
    });

    box.appendChild(card);
  });
});