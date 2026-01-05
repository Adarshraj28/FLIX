/* =====================================================
   SETTINGS SYNC (GLOBAL)
   Loaded on all pages
===================================================== */

const SETTINGS_KEY = "flixSettings";

/* DEFAULT SETTINGS */
const DEFAULT_SETTINGS = {
  darkMode: true,
  heroBlur: true,
  animations: true,
  autoplay: true,
  quality: "auto",
  notifyNew: true,
  notifyRec: false,
  watchHistory: true
};

/* LOAD SETTINGS */
function loadSettings() {
  return {
    ...DEFAULT_SETTINGS,
    ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")
  };
}

/* APPLY SETTINGS */
function applySettings(settings) {

  /* Dark / Light Mode */
  document.body.classList.toggle("light-mode", !settings.darkMode);

  /* Hero blur */
  document.documentElement.style.setProperty(
    "--hero-blur",
    settings.heroBlur ? "1" : "0"
  );

  /* Animations */
  document.documentElement.style.setProperty(
    "--animations",
    settings.animations ? "1" : "0"
  );

  /* Global runtime flags */
  window.FLIX_AUTOPLAY = settings.autoplay;
  window.FLIX_QUALITY = settings.quality;
}

/* INITIAL APPLY */
document.addEventListener("DOMContentLoaded", () => {
  applySettings(loadSettings());
});

/* 🔄 LIVE SYNC ACROSS TABS */
window.addEventListener("storage", (e) => {
  if (e.key === SETTINGS_KEY) {
    applySettings(loadSettings());
  }
});


/* =========================
   NAVBAR AVATAR SYNC
========================= */

const ACCOUNT_KEY = "flixAccount";

function syncNavbarAvatar() {
  const avatarImg = document.getElementById("navAvatar");
  if (!avatarImg) return;

  const account = JSON.parse(localStorage.getItem(ACCOUNT_KEY));

  if (account?.loggedIn && account.avatar) {
    avatarImg.src = account.avatar;
  } else {
    avatarImg.removeAttribute("src");
  }
}

document.addEventListener("DOMContentLoaded", syncNavbarAvatar);

/* Live update across tabs */
window.addEventListener("storage", (e) => {
  if (e.key === ACCOUNT_KEY) {
    syncNavbarAvatar();
  }
});
