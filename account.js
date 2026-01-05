/* =========================
   ACCOUNT PAGE LOGIC
========================= */

const ACCOUNT_KEY = "flixAccount";

function getAccount() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY));
}

function saveAccount(account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

document.addEventListener("DOMContentLoaded", () => {

  const account = getAccount();
  if (!account?.loggedIn) {
    window.location.href = "signin.html";
    return;
  }

  /* ELEMENTS */
  const avatarImg = document.getElementById("avatarImg");
  const avatarInput = document.getElementById("avatarInput");
  const nameInput = document.getElementById("nameInput");
  const nameEl = document.getElementById("accountName");
  const emailEl = document.getElementById("accountEmail");
  const emailStatic = document.getElementById("emailStatic");

  /* LOAD DATA */
  nameEl.textContent = account.name || "User";
  emailEl.textContent = account.email;
  emailStatic.textContent = account.email;
  nameInput.value = account.name || "";

  avatarImg.src = account.avatar || "https://via.placeholder.com/120";

  /* AVATAR UPLOAD */
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      account.avatar = reader.result;
      saveAccount(account);
      avatarImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  /* SAVE PROFILE */
  document.getElementById("saveProfile").addEventListener("click", () => {
    account.name = nameInput.value.trim() || "User";
    saveAccount(account);
    nameEl.textContent = account.name;
    alert("Profile updated");
  });

  /* LOGOUT */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Log out from FLIX?")) {
      localStorage.removeItem(ACCOUNT_KEY);
      window.location.href = "index.html";
    }
  });

  /* DELETE ACCOUNT */
  document.getElementById("deleteAccount").addEventListener("click", () => {
    if (confirm("Delete account permanently?")) {
      localStorage.removeItem(ACCOUNT_KEY);
      window.location.href = "signin.html";
    }
  });

});

//WEATHER EFFECT//
const weatherToggle = document.getElementById("weatherToggle");

if (weatherToggle) {
  // Load saved state
  weatherToggle.checked = localStorage.getItem("weather") === "on";

  weatherToggle.addEventListener("change", () => {
    if (weatherToggle.checked) {
      localStorage.setItem("weather", "on");
    } else {
      localStorage.setItem("weather", "off");
    }
  });
}
