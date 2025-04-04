/*
 * BLOG(LIST) JAVASCRIPT
 * fetching posts, filtering, creating filters, language adaptation, creating html structure for posts, mobile filter toggle
 */

document.addEventListener("DOMContentLoaded", function () {
  let allBlogPosts = [];
  let selectedCategories = new Set();
  const currentDate = new Date();

  // Set up mobile filter toggle
  const filterToggle = document.getElementById("filter-toggle");
  const filterOptions = document.getElementById("filter-options");

  if (filterToggle) {
    filterToggle.addEventListener("click", function () {
      filterOptions.classList.toggle("show");
    });
  }

  // Get blog posts from JSON
  fetch("/root/blog/json/blogposts.json")
    .then((response) => response.json())
    .then((data) => {
      allBlogPosts = data;
      setupCategoryFilters(data);
      displayBlogPosts(data);
    })
    .catch((error) => {
      console.error("Error fetching blog posts:", error);
      document.querySelector(".blog-posts").innerHTML =
        '<div class="no-posts">Error loading blog posts</div>';
    });

  // Set up category filters based on available categories in the posts JSON
  function setupCategoryFilters(posts) {
    const filterContainer = document.querySelector(".blog-filter-options");
    const categories = new Set();

    // Get current language
    const currentLang = localStorage.getItem("preferredLanguage") || "nl";

    // Extract unique categories
    posts.forEach((post) => {
      const categoryKey = `category ${currentLang}`;
      if (post[categoryKey]) {
        categories.add(post[categoryKey]);
      }
    });

    // Create filter checkboxes
    categories.forEach((category) => {
      const checkboxId = `category-${category
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      const checkboxDiv = document.createElement("div");
      checkboxDiv.className = "form-check form-check-inline";

      const checkbox = document.createElement("input");
      checkbox.className = "form-check-input";
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      checkbox.value = category;
      checkbox.addEventListener("change", updateFilters);

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = checkboxId;
      label.textContent = category;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      filterContainer.appendChild(checkboxDiv);
    });

    // Update filter toggle text with language
    if (filterToggle) {
      filterToggle.textContent = currentLang === "nl" ? "Filter" : "Filter";
    }
  }

  // Update selected filters and refresh posts display
  function updateFilters(e) {
    const checkbox = e.target;
    const category = checkbox.value;

    if (checkbox.checked) {
      selectedCategories.add(category);
    } else {
      selectedCategories.delete(category);
    }

    filterAndDisplayPosts();
  }

  // Filter posts based on selected categories and display them
  function filterAndDisplayPosts() {
    let filteredPosts = [...allBlogPosts];

    // Get current language
    const currentLang = localStorage.getItem("preferredLanguage") || "nl";
    const categoryKey = `category ${currentLang}`;

    // Apply category filter if any categories are selected
    if (selectedCategories.size > 0) {
      filteredPosts = filteredPosts.filter((post) => {
        return selectedCategories.has(post[categoryKey]);
      });
    }

    displayBlogPosts(filteredPosts);
  }

  // Display blog posts in the container
  function displayBlogPosts(posts) {
    const postsContainer = document.querySelector(".blog-posts");
    postsContainer.innerHTML = "";

    // Get current language
    const currentLang = localStorage.getItem("preferredLanguage") || "nl";

    // Filter out future posts
    const publishedPosts = posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate <= currentDate;
    });

    // Sort posts by date (newest first)
    publishedPosts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // if none found
    if (publishedPosts.length === 0) {
      postsContainer.innerHTML = `<div class="no-posts">${
        currentLang === "nl" ? "Geen blogposts gevonden" : "No blog posts found"
      }</div>`;
      return;
    }

    // Create HTML for each post
    publishedPosts.forEach((post) => {
      const titleKey = `title ${currentLang}`;
      const categoryKey = `category ${currentLang}`;
      const textKey = `text ${currentLang}`;

      // Format date to localized string
      const postDate = new Date(post.date);
      const formattedDate = postDate.toLocaleDateString(
        currentLang === "nl" ? "nl-NL" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      // Extract first two sentences for excerpt
      const fullText = post[textKey];
      const sentences = fullText.split(/(?<=[.!?])\s+/);
      const excerpt = sentences.slice(0, 2).join(" ");

      // Create post element
      const postElement = document.createElement("article");
      postElement.className = "blog-post";

      // Create HTML structure for the post
      postElement.innerHTML = `
        <div class="blog-post-image">
          <a href="blogpost.html?id=${post.id}">
            <img src="/root/blog/img/${post.image}" alt="${post[titleKey]}">
          </a>
        </div>
        <div class="blog-post-content">
          <div class="blog-post-date">${formattedDate}</div>
          <h3 class="blog-post-title">
            <a href="blogpost.html?id=${post.id}">${post[titleKey]}</a>
          </h3>
          <div class="blog-post-category">${post[categoryKey]}</div>
          <div class="blog-post-excerpt">
            ${excerpt}
            <a href="blogpost.html?id=${post.id}" class="read-more">${
        currentLang === "nl" ? "Lees meer" : "Read more"
      }</a>
          </div>
        </div>
      `;

      postsContainer.appendChild(postElement);
    });
  }

  // Handle language changes
  document.addEventListener("languageChanged", function () {
    // Refresh the category filters
    document.querySelector(".blog-filter-options").innerHTML = "";
    setupCategoryFilters(allBlogPosts);

    // Refresh the posts display
    filterAndDisplayPosts();
  });

  // This will be called by the language switching code
  const originalSetLanguage = window.setLanguage;
  if (typeof originalSetLanguage === "function") {
    window.setLanguage = function (lang) {
      originalSetLanguage(lang);
      document.dispatchEvent(new CustomEvent("languageChanged"));
    };
  }
});
