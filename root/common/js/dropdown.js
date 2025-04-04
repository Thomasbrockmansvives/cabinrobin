document.addEventListener("DOMContentLoaded", function () {
  // Function to manually handle dropdown toggle
  function setupPortfolioDropdown() {
    // Get the portfolio dropdown toggle element
    const portfolioToggle = document.querySelector(
      ".nav-item.dropdown .dropdown-toggle"
    );
    const dropdownMenu = document.querySelector(
      ".nav-item.dropdown .dropdown-menu"
    );

    if (portfolioToggle && dropdownMenu) {
      // Add click event to manually toggle dropdown
      portfolioToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Toggle the 'show' class on both the toggle and menu
        portfolioToggle.classList.toggle("show");
        dropdownMenu.classList.toggle("show");

        // Set aria-expanded attribute
        const isExpanded = dropdownMenu.classList.contains("show");
        portfolioToggle.setAttribute("aria-expanded", isExpanded);
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (e) {
        if (
          !portfolioToggle.contains(e.target) &&
          !dropdownMenu.contains(e.target)
        ) {
          portfolioToggle.classList.remove("show");
          dropdownMenu.classList.remove("show");
          portfolioToggle.setAttribute("aria-expanded", "false");
        }
      });

      // Prevent dropdown from closing when clicking inside it
      dropdownMenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  }

  // Try setting up dropdown immediately
  setupPortfolioDropdown();

  // And also try after a short delay to ensure DOM is fully loaded
  setTimeout(setupPortfolioDropdown, 500);
});

// Additional attempt when window is fully loaded
window.addEventListener("load", function () {
  // Try setting up dropdown after window load
  const portfolioToggle = document.querySelector(
    ".nav-item.dropdown .dropdown-toggle"
  );
  const dropdownMenu = document.querySelector(
    ".nav-item.dropdown .dropdown-menu"
  );

  if (portfolioToggle && dropdownMenu) {
    portfolioToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      portfolioToggle.classList.toggle("show");
      dropdownMenu.classList.toggle("show");
    });
  }

  // Try one more time after a delay
  setTimeout(function () {
    // Final attempt to set up dropdown after everything is loaded
    const toggle = document.querySelector(
      ".nav-item.dropdown .dropdown-toggle"
    );
    const menu = document.querySelector(".nav-item.dropdown .dropdown-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle.classList.toggle("show");
        menu.classList.toggle("show");
      });
    }
  }, 1000);
});
