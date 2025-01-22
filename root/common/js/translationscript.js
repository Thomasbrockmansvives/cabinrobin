/* TRANSLATION-SCRIPT
 * COMMON
 *
 * This is the javascript, managing translations for the whole website
 *
 */

let pagetranslations = {};

async function loadTranslations() {
  try {
    const response = await fetch("../../common/json/translations.json");
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
      // Use innerHTML instead of textContent
      element.innerHTML = pagetranslations[key][lang].replace(/\n/g, "<br>");
    }
  });
  localStorage.setItem("preferredLanguage", lang);
}

// Load translations when the DOM is ready
document.addEventListener("DOMContentLoaded", loadTranslations);
