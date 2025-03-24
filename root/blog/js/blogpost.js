document.addEventListener("DOMContentLoaded", async function () {
  // Get the post ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    showError("No blog post ID specified");
    return;
  }

  try {
    // Fetch blog posts data from json folder
    const response = await fetch("/root/blog/json/blogposts.json");
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const blogPosts = await response.json();
    const post = blogPosts.find((post) => post.id.toString() === postId);

    if (!post) {
      showError("Blog post not found");
      return;
    }

    // Render the blog post after translations are loaded
    if (Object.keys(pagetranslations).length > 0) {
      renderBlogPost(post);
    } else {
      // Wait for translations to load if they haven't yet
      const checkTranslations = setInterval(() => {
        if (Object.keys(pagetranslations).length > 0) {
          clearInterval(checkTranslations);
          renderBlogPost(post);
        }
      }, 100);
    }

    // Override language switching behavior for this page
    document
      .getElementById("nl-language")
      .addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("preferredLanguage", "nl");
        window.location.reload();
      });

    document
      .getElementById("en-language")
      .addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("preferredLanguage", "en");
        window.location.reload();
      });
  } catch (error) {
    console.error("Error loading blog post:", error);
    showError("Error loading blog post");
  }
});

function renderBlogPost(post) {
  const blogpostContent = document.getElementById("blogpost-content");
  const currentLang = localStorage.getItem("preferredLanguage") || "nl";

  // Remove loading indicator
  document.getElementById("loading").remove();

  // Check if the post has content in the current language
  const postTitle = post[`title ${currentLang}`] || post["title nl"];
  const postCategory = post[`category ${currentLang}`] || post["category nl"];
  const postText = post[`text ${currentLang}`] || post["text nl"];

  // Create a new element to check if the image is portrait or landscape
  const img = new Image();
  img.onload = function () {
    const isPortrait = this.height > this.width;
    const imageClass = isPortrait ? "portrait" : "landscape";

    // Create the content structure with title, category and date above the image
    blogpostContent.innerHTML = `
      <div class="clearfix">
        <div class="blogpost-header">
          <h3 class="blogpost-title">${postTitle}</h3>
          <div class="blogpost-category">${postCategory}</div>
          <span class="blogpost-date">${formatDate(post.date)}</span>
        </div>
        <div class="blogpost-image-container ${imageClass}">
          <img src="/root/blog/img/${
            post.image
          }" alt="${postTitle}" class="blogpost-image">
        </div>
        <div class="blogpost-text">${postText}</div>
        <div class="blogpost-sharing">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}" target="_blank" title="Share on Facebook">
            <img src="../../common/img/facebook-icon.avif" alt="Share on Facebook">
          </a>
          <a href="https://www.instagram.com/" target="_blank" title="Share on Instagram">
            <img src="../../common/img/instagram-icon.avif" alt="Share on Instagram">
          </a>
        </div>
      </div>
    `;
  };

  // Load the image from the img folder
  img.src = `/root/blog/img/${post.image}`;

  // Update the document title
  document.title = `${postTitle} | Cabin Robin | Blog`;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  const currentLang = localStorage.getItem("preferredLanguage") || "nl";
  return date.toLocaleDateString(
    currentLang === "nl" ? "nl-NL" : "en-US",
    options
  );
}

function showError(message) {
  const blogpostContent = document.getElementById("blogpost-content");
  document.getElementById("loading").remove();

  blogpostContent.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
    <div class="text-center">
      <a href="/root/blog/html/blog.html" class="btn btn-primary">Back to Blog</a>
    </div>
  `;
}
