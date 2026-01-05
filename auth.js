/* =========================
   FRONTEND ACCOUNT AUTH
========================= */

const ACCOUNT_KEY = "flixAccount";

/* SIGN IN */
function signIn(email) {
  localStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify({
      email,
      loggedIn: true
    })
  );
}

/* GET ACCOUNT */
function getAccount() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY));
}

/* LOG OUT */
function logout() {
  localStorage.removeItem(ACCOUNT_KEY);
  window.location.href = "index.html";
}
