const apiKey = "a44824e4"; 
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const movieResults = document.getElementById("movieResults");
const modal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeModalBtn = document.querySelector(".close");
const background = document.getElementById("background");
const modeToggle = document.getElementById("modeToggle");
const modeIcon = document.getElementById("modeIcon");

searchBtn.addEventListener("click", searchMovies);
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovies();
});
closeModalBtn.addEventListener("click", () => hideModal());
window.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});
modeToggle.addEventListener("click", toggleMode);

// Dark/Light Mode Toggle
function toggleMode() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  modeIcon.textContent = isLight ? "☀️" : "🌙";
  modeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
}

// Movie Search
async function searchMovies() {
  const query = movieInput.value.trim();
  if (!query) {
    movieResults.innerHTML = "<p>Please enter a movie name.</p>";
    return;
  }

  movieResults.innerHTML = "<p>Searching...</p>";
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      movieResults.innerHTML = `<p>No results found for "${query}".</p>`;
      return;
    }

    displayMovies(data.Search);
    updateBackground(data.Search[0]?.Poster);
  } catch (error) {
    movieResults.innerHTML = "<p>Error fetching data.</p>";
    console.error(error);
  }
}

// Display Movie Cards
function displayMovies(movies) {
  movieResults.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
        <img src="${
          movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/220x330"
        }" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `
    )
    .join("");
}

// Movie Details Popup
async function showMovieDetails(id) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`;
  try {
    const response = await fetch(url);
    const movie = await response.json();

    modal.style.display = "flex";
    modalDetails.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400"
      }" alt="${movie.Title}">
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>IMDB Rating:</strong> ⭐ ${movie.imdbRating}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
    `;

    updateBackground(movie.Poster);
  } catch (err) {
    console.error("Error fetching movie details:", err);
  }
}

// Hide Modal
function hideModal() {
  modal.style.display = "none";
}

// Update Background
function updateBackground(posterUrl) {
  if (!posterUrl || posterUrl === "N/A") return;
  background.style.backgroundImage = `url(${posterUrl})`;
}