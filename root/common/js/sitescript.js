/*
 * WEBSITE-WIDE JAVASCRIPT
 * Used on every page for the hamburger icon on mobile (custom icon) and responsiveness
 */

document.addEventListener("DOMContentLoaded", () => {
  // Create custom hamburger icon (only for mobile)
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
    if (navbarNav) {
      navbarNav.classList.toggle("show");

      // Transform hamburger to X when menu is open
      const lines = hamburgerContainer.querySelectorAll(
        ".custom-hamburger-line"
      );

      if (navbarNav.classList.contains("show")) {
        lines[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        lines[1].style.opacity = "0";
        lines[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        lines[0].style.transform = "none";
        lines[1].style.opacity = "1";
        lines[2].style.transform = "none";
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navbarNav &&
      !navbarNav.contains(e.target) &&
      !hamburgerContainer.contains(e.target) &&
      navbarNav.classList.contains("show")
    ) {
      navbarNav.classList.remove("show");

      // Reset hamburger icon
      const lines = hamburgerContainer.querySelectorAll(
        ".custom-hamburger-line"
      );
      lines[0].style.transform = "none";
      lines[1].style.opacity = "1";
      lines[2].style.transform = "none";
    }
  });

  // Handle window resize - hide custom hamburger on desktop
  function handleResize() {
    if (window.innerWidth >= 768) {
      // Bootstrap md breakpoint
      hamburgerContainer.style.display = "none";

      // If the menu was open on mobile and user switches to desktop
      if (navbarNav && navbarNav.classList.contains("show")) {
        navbarNav.classList.remove("show");

        // Reset hamburger icon
        const lines = hamburgerContainer.querySelectorAll(
          ".custom-hamburger-line"
        );
        lines[0].style.transform = "none";
        lines[1].style.opacity = "1";
        lines[2].style.transform = "none";
      }
    } else {
      hamburgerContainer.style.display = "flex";
    }
  }

  // Initial check
  handleResize();

  // Listen for window resize
  window.addEventListener("resize", handleResize);

  // Initialize dropdowns for portfolio items
  function initializePortfolioDropdown() {
    if (typeof bootstrap !== "undefined") {
      // Get all dropdown toggles
      const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

      // Initialize each dropdown
      dropdownToggles.forEach(function (toggle) {
        new bootstrap.Dropdown(toggle);
      });
    }
  }

  // Initialize dropdowns after a delay
  setTimeout(initializePortfolioDropdown, 500);

  // Add fade-in animation to elements as they appear in viewport
  const animatedElements = document.querySelectorAll(
    ".card, .portfolio-item, h2, .hero-section .row"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
});

// Additional initialization when page finishes loading
window.addEventListener("load", function () {
  if (typeof bootstrap !== "undefined") {
    // Initialize dropdowns again after everything is loaded
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach(function (toggle) {
      new bootstrap.Dropdown(toggle);
    });
  }
});

