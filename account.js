document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    window.location.href = "index.html";
    return;
  }
  try {
    const res = await fetch("http://localhost:10000/users/profile", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load profile");

    const data = await res.json();
    document.getElementById("user-id").textContent = data.id;
    document.getElementById("user-login").textContent = data.username;
    document.getElementById("user-created").textContent = new Date(data.created_at).toLocaleDateString();

  } catch (err) {
    window.location.href = "index.html";
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    window.location.href = "index.html";
  });
});