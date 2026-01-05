/* =====================================================
   SETTINGS PAGE LOGIC (CLEAN)
===================================================== */

const SETTINGS_KEY = "flixSettings";
const ACCOUNT_KEY = "flixAccount";

/* GET SETTINGS */
function getSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
}

/* SAVE SETTINGS */
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/* GET ACCOUNT */
function getAccount() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY));
}

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ACCOUNT SECTION (REAL)
  ========================= */

  const account = getAccount();
  const emailEl = document.getElementById("accountEmail");

  if (emailEl) {
    emailEl.textContent = account?.loggedIn
      ? account.email
      : "Not signed in";
  }

  /* =========================
     SETTINGS CONTROLS
  ========================= */

  let settings = getSettings();

  const controls = {
    darkMode: document.getElementById("darkMode"),
    heroBlur: document.getElementById("heroBlur"),
    animations: document.getElementById("animations"),
    autoplay: document.getElementById("autoplay"),
    quality: document.getElementById("quality"),
    notifyNew: document.getElementById("notifyNew"),
    notifyRec: document.getElementById("notifyRec"),
    watchHistory: document.getElementById("watchHistory")
  };

  // initialize UI state
  Object.keys(controls).forEach(key => {
    const el = controls[key];
    if (!el) return;

    if (el.type === "checkbox") {
      el.checked = settings[key] ?? true;
    } else {
      el.value = settings[key] ?? "auto";
    }
  });

  // apply settings globally
  applySettings(loadSettings());

  // listen for changes
  Object.keys(controls).forEach(key => {
    const el = controls[key];
    if (!el) return;

    el.addEventListener("change", () => {
      settings[key] =
        el.type === "checkbox" ? el.checked : el.value;

      saveSettings(settings);
      applySettings(loadSettings());
    });
  });

  /* =========================
     CLEAR DATA
  ========================= */

  document.getElementById("clearHistory")?.addEventListener("click", () => {
    if (confirm("Clear watch history?")) {
      localStorage.removeItem("watchHistory");
      alert("Watch history cleared");
    }
  });

  document.getElementById("clearMyList")?.addEventListener("click", () => {
    if (confirm("Clear My List?")) {
      localStorage.removeItem("myList");
      alert("My List cleared");
    }
  });

  /* =========================
     LOG OUT (REAL)
  ========================= */

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    if (confirm("Log out from FLIX?")) {
      localStorage.removeItem(ACCOUNT_KEY);
      window.location.href = "index.html";
    }
  });

});
