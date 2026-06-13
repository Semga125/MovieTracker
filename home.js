
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("account");

  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "account.html";
    });
  }
});

