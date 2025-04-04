document.addEventListener("DOMContentLoaded", function () {
  /*
   * COMPONENT JAVASCRIPT
   * to load shared components, such as Navigation and Footer
   */

  // Function to load HTML components
  function loadComponent(url, targetSelector) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        document.querySelector(targetSelector).innerHTML = html;

        // Handle navigation links based on current page
        if (targetSelector === "#nav-placeholder") {
          setActiveNavLink();

          // Initialize Bootstrap dropdowns after navigation is loaded
          initializeBootstrapDropdowns();

          // Connect hamburger menu if it exists
          connectHamburgerMenu();
        }

        // Re-apply translation
        if (typeof updatePageLanguage === "function") {
          updatePageLanguage(getCurrentLanguage());
        }
      })
      .catch((error) => {
        console.error("Error loading component:", error);
        document.querySelector(targetSelector).innerHTML =
          "<p>Error loading component</p>";
      });
  }

  // Initialize Bootstrap dropdowns
  function initializeBootstrapDropdowns() {
    if (typeof bootstrap !== "undefined") {
      // Get all dropdown toggles
      const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

      // Initialize each dropdown
      dropdownToggles.forEach(function (toggle) {
        new bootstrap.Dropdown(toggle);
      });
    }
  }

  // Connect hamburger menu to navbar collapse
  function connectHamburgerMenu() {
    const hamburgerContainer = document.querySelector(".custom-hamburger");
    const navbarNav = document.getElementById("navbarNav");

    if (hamburgerContainer && navbarNav) {
      hamburgerContainer.addEventListener("click", function () {
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
      });
    }
  }

  // Set active navigation link based on current page URL
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll("#nav-placeholder .nav-link");

    navLinks.forEach((link) => {
      // Remove active class from all links
      link.classList.remove("active");

      // Check if the link's href matches the current page path
      if (
        link.getAttribute("href") === currentPath ||
        (currentPath.includes(link.getAttribute("href")) &&
          link.getAttribute("href") !== "#")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Helper function to get current language
  function getCurrentLanguage() {
    return localStorage.getItem("selectedLanguage") || "nl";
  }

  // Load components if placeholders exist
  if (document.querySelector("#nav-placeholder")) {
    loadComponent("/root/common/components/nav.html", "#nav-placeholder");
  }

  if (document.querySelector("#footer-placeholder")) {
    loadComponent("/root/common/components/footer.html", "#footer-placeholder");
  }

  // Initialize dropdowns again after window finishes loading
  window.addEventListener("load", function () {
    setTimeout(initializeBootstrapDropdowns, 500);
  });
});
