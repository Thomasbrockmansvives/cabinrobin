/* TRANSLATION-SCRIPT
 * COMMON
 *
 * This is the javascript, managing translations for the whole website
 *
 */

let pagetranslations = {};

async function loadTranslations() {
  try {
    const response = await fetch("/root/common/json/translations.json");
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

  // Apply translations to all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (pagetranslations[key] && pagetranslations[key][lang]) {
      // Use innerHTML instead of textContent
      element.innerHTML = pagetranslations[key][lang].replace(/\n/g, "<br>");
    }
  });

  // Update language selector styling
  const nlLink = document.getElementById("nl-language");
  const enLink = document.getElementById("en-language");

  if (nlLink && enLink) {
    if (lang === "nl") {
      nlLink.classList.add("active");
      enLink.classList.remove("active");
    } else {
      enLink.classList.add("active");
      nlLink.classList.remove("active");
    }
  }

  localStorage.setItem("preferredLanguage", lang);
}

// Load translations when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();

  // Ensure language links have the correct initial state
  const currentLang = localStorage.getItem("preferredLanguage") || "nl";
  const nlLink = document.getElementById("nl-language");
  const enLink = document.getElementById("en-language");

  if (nlLink && enLink) {
    if (currentLang === "nl") {
      nlLink.classList.add("active");
    } else {
      enLink.classList.add("active");
    }
  }
});
