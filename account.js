document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    document.body.innerHTML = `
      <h2>You are not logged in</h2>
      <a href="index.html">Go to Login</a>
    `;
    return;
  }

  try {
    const res = await fetch("http://localhost:10000/users/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load profile");
    }

    const data = await res.json();


    document.getElementById("user-id").textContent = `ID: ${data.id}`;
    document.getElementById("user-login").textContent = `Login: ${data.username}`;
    
 
    if (data.created_at) {
      const created = new Date(data.created_at).toLocaleDateString();
      const createdEl = document.createElement("p");
      createdEl.textContent = `Registered: ${created}`;
      document.body.insertBefore(createdEl, document.getElementById("logout-btn"));
    }

  } catch (err) {
    document.body.innerHTML = `
      <h2>Error: ${err.message}</h2>
      <a href="login.html">Go to Login</a>
    `;
  }


  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      window.location.href = "index.html";
    });
  }
});
