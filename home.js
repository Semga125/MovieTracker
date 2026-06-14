const API = "http://localhost:10000/users";
const token = localStorage.getItem("accessToken");

if (!token) window.location.href = "index.html";

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}
async function loadMovies() {
  try {
    const res = await fetch(`${API}/movies`, { headers: authHeaders() });
    const movies = await res.json();
    renderMovies(movies);
  } catch (err) {
    console.error("loadMovies error:", err);
  }
}

function renderMovies(movies) {
  const list = document.getElementById("movies-list");

  if (!movies.length) {
    list.innerHTML = `<p class="text-gray-400 col-span-full">No movies yet.</p>`;
    return;
  }

  list.innerHTML = movies.map(m => `
    <div class="bg-white rounded-xl shadow overflow-hidden flex flex-col">
      ${m.poster_url
        ? `<img src="${m.poster_url}" alt="${m.title}" class="w-full h-48 object-cover">`
        : `<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">🎬</div>`
      }
      <div class="p-3 flex flex-col gap-1">
        <h3 class="font-bold text-lg">${m.title}</h3>
        <p class="text-sm text-gray-500">${m.year || ""} ${m.genre ? "· " + m.genre : ""}</p>
        ${m.description ? `<p class="text-sm text-gray-600">${m.description}</p>` : ""}
        <p class="text-xs text-gray-400 mt-1">Added by: ${m.added_by || "unknown"}</p>
      </div>
    </div>
  `).join("");
}

const modal = document.getElementById("modal");
const modalError = document.getElementById("modal-error");

function openModal() {
  modal.classList.remove("hidden");
  modalError.classList.add("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  ["m-title", "m-year", "m-genre", "m-poster", "m-desc"].forEach(id => {
    document.getElementById(id).value = "";
  });
}

async function submitFilm() {
  const title       = document.getElementById("m-title").value.trim();
  const year        = document.getElementById("m-year").value;
  const genre       = document.getElementById("m-genre").value.trim();
  const poster_url  = document.getElementById("m-poster").value.trim();
  const description = document.getElementById("m-desc").value.trim();

  if (!title) {
    modalError.textContent = "Title is required.";
    modalError.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(`${API}/movies`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, year: year ? Number(year) : null, genre, poster_url, description }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to add film");
    }

    closeModal();
    alert("Film added!");
  } catch (err) {
    modalError.textContent = err.message;
    modalError.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("account").addEventListener("click", () => {
    window.location.href = "account.html";
  });
  document.getElementById("addFilm").addEventListener("click", openModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("modal-submit").addEventListener("click", submitFilm);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  loadMovies();
});