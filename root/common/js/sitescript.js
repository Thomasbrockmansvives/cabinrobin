/* SITE-SCRIPT
 * COMMON
 *
 * This is the javascript for the website, containing variables and methods that are used website-wide, so shared by all pages
 *
 */

document.addEventListener("DOMContentLoaded", () => {
  // Create custom hamburger icon
  const navbarNav = document.getElementById("navbarNav");
  const hamburgerContainer = document.createElement("div");
  hamburgerContainer.classList.add("custom-hamburger");

  // Create three lines for hamburger
  for (let i = 0; i < 3; i++) {
    const line = document.createElement("div");
    line.classList.add("custom-hamburger-line");
    hamburgerContainer.appendChild(line);
  }

  // Insert the hamburger into the page
  document.body.appendChild(hamburgerContainer);

  // Hamburger click event to toggle navbar
  hamburgerContainer.addEventListener("click", () => {
    navbarNav.classList.toggle("show");
  });

  // Scroll handling
  let lastScrollTop = 0;
  const headerContainer = document.querySelector(".header-container");

  window.addEventListener("scroll", () => {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    // Always show the hamburger when at the top of the page
    if (currentScrollTop <= headerContainer.offsetHeight) {
      hamburgerContainer.style.display = "block";
      return;
    }
  });
});
