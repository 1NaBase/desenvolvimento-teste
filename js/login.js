async function handleLogin(event) {
  event.preventDefault();

  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha })
    });

    const data = await res.json();

    if (data.success) {
      sessionStorage.setItem("loggedIn", "true");
      window.location.href = "pages/index.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err); // aqui você consegue ver detalhes do erro
    alert("Erro no servidor, tente novamente!");
  }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);

if (sessionStorage.getItem("loggedIn") === "true") {
  window.location.href = "pages/index.html";
}

