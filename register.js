if (localStorage.getItem("accessToken")) {
  window.location.href = "home.html";
}
const input1 = document.querySelector("#username1");
const input2 = document.querySelector("#password1");
const submit = document.querySelector("#submit-register");
submit.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    const username = input1.value.trim();
    const password = input2.value.trim();

    if (username.length <= 3 || password.length <= 3) {
      throw new Error("Username and password must be longer than 3 characters");
    }

    const res = await fetch("http://localhost:10000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.message);
}
const data = await res.json();

localStorage.setItem("accessToken", data.accessToken);

window.location.href = "home.html";

  } catch (err) {
    console.error("Register error:", err.message);
  }
});