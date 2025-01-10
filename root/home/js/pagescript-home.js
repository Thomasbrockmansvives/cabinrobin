/* PAGE-SCRIPT
 * HOME
 *
 * This is the javascript, specific for this page, containing variables and methods only specifically used on this page
 *
 */

let pagetranslations = {};

async function loadTranslations() {
  try {
    const response = await fetch("../json/translation-home.json");
    pagetranslations = await response.json();
    // Set initial language after translations are loaded
    const preferredLanguage = localStorage.getItem("preferredLanguage") || "nl";
    setLanguage(preferredLanguage);
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (pagetranslations[key] && pagetranslations[key][lang]) {
      element.textContent = pagetranslations[key][lang];
    }
  });
  localStorage.setItem("preferredLanguage", lang);
}

// Load translations when the DOM is ready
document.addEventListener("DOMContentLoaded", loadTranslations);
