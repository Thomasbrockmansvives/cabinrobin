// Auth credentials
const AUTH_USERNAME = "admin";
const AUTH_PASSWORD = "roodborstje";

// Global variables
let posts = [];
let currentLanguage = "en";
let isAuthenticated = false;

// DOM Elements - Login
const loginContainer = document.getElementById("login-container");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

// DOM Elements - Admin Panel
const adminContainer = document.getElementById("admin-container");
const logoutBtn = document.getElementById("logout-btn");
const postList = document.getElementById("post-list");
const postForm = document.getElementById("post-form");
const formTitle = document.getElementById("form-title");
const postIdInput = document.getElementById("post-id");
const titleEnInput = document.getElementById("title-en");
const titleNlInput = document.getElementById("title-nl");
const categoryEnInput = document.getElementById("category-en");
const categoryNlInput = document.getElementById("category-nl");
const dateInput = document.getElementById("date");
const imageInput = document.getElementById("image");
const textEnInput = document.getElementById("text-en");
const textNlInput = document.getElementById("text-nl");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const deleteBtn = document.getElementById("delete-btn");
const newPostBtn = document.getElementById("new-post-btn");
const loadPostsBtn = document.getElementById("load-posts-btn");
const langEnBtn = document.getElementById("lang-en");
const langNlBtn = document.getElementById("lang-nl");

// JSON Output Elements
const jsonOutputSection = document.getElementById("json-output-section");
const jsonPreview = document.getElementById("json-preview");
const copyJsonBtn = document.getElementById("copy-json-btn");

// Toast notification elements
const toast = document.getElementById("notification-toast");
const bsToast = new bootstrap.Toast(toast);
const toastTitle = document.getElementById("toast-title");
const toastMessage = document.getElementById("toast-message");

// Check if user is already authenticated (using session storage)
function checkAuthentication() {
  isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  if (isAuthenticated) {
    showAdminPanel();
    loadPosts();
  } else {
    showLoginForm();
  }
}

// Show login form
function showLoginForm() {
  loginContainer.classList.remove("d-none");
  adminContainer.classList.add("d-none");
}

// Show admin panel
function showAdminPanel() {
  loginContainer.classList.add("d-none");
  adminContainer.classList.remove("d-none");
  adminContainer.classList.add("auth-animation");
}

// Handle login submission
function handleLogin(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    isAuthenticated = true;
    sessionStorage.setItem("isAuthenticated", "true");
    showAdminPanel();
    loadPosts();
    loginError.classList.add("d-none");
  } else {
    loginError.classList.remove("d-none");
    passwordInput.value = "";
    passwordInput.focus();
  }
}

// Handle logout
function handleLogout() {
  isAuthenticated = false;
  sessionStorage.removeItem("isAuthenticated");
  showLoginForm();
  loginForm.reset();
}

/**
 * Load posts from JSON file
 */
function loadPosts() {
  fetch("/root/blog/json/blogposts.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    })
    .then((data) => {
      posts = data;
      displayPosts();
      showNotification("Success", "Posts loaded successfully");
    })
    .catch((error) => {
      console.error("Error loading posts:", error);
      showNotification("Error", "Failed to load posts: " + error.message, true);
      postList.innerHTML = `<li class="list-group-item text-danger">Error loading posts: ${error.message}</li>`;
    });
}

/**
 * Display posts in the list
 */
function displayPosts() {
  if (posts.length === 0) {
    postList.innerHTML = '<li class="list-group-item">No posts available</li>';
    return;
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  postList.innerHTML = "";
  posts.forEach((post) => {
    const title =
      currentLanguage === "en" ? post["title en"] : post["title nl"];
    const category =
      currentLanguage === "en" ? post["category en"] : post["category nl"];

    const li = document.createElement("li");
    li.className = "list-group-item post-list-item";
    li.dataset.id = post.id;
    li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="badge bg-secondary">ID: ${post.id}</span>
                <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <div>
                <strong>${title}</strong>
            </div>
            <div class="post-category">${category}</div>
        `;
    li.addEventListener("click", () => displayPostDetails(post.id));
    postList.appendChild(li);
  });

  resetForm();
}

/**
 * Format date to be more readable
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLanguage === "en" ? "en-US" : "nl-NL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Display post details in the form
 */
function displayPostDetails(postId) {
  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) return;

  // Highlight selected post in the list
  document.querySelectorAll(".post-list-item").forEach((item) => {
    item.classList.remove("active");
    if (parseInt(item.dataset.id) === post.id) {
      item.classList.add("active");
    }
  });

  // Fill the form with post details
  postIdInput.value = post.id;
  titleEnInput.value = post["title en"];
  titleNlInput.value = post["title nl"];
  categoryEnInput.value = post["category en"];
  categoryNlInput.value = post["category nl"];
  dateInput.value = post.date;
  imageInput.value = post.image;
  textEnInput.value = post["text en"];
  textNlInput.value = post["text nl"];

  // Update form title and button states
  formTitle.textContent = `Editing Post #${post.id}`;
  deleteBtn.style.display = "block";

  // Make the ID field readonly when editing existing posts
  postIdInput.setAttribute("readonly", "readonly");
}

/**
 * Generate next available post ID
 */
function getNextAvailableId() {
  if (posts.length === 0) return 1;

  // Find the maximum ID currently in use
  const maxId = Math.max(...posts.map((post) => post.id));
  return maxId + 1;
}

/**
 * Setup form for creating a new post
 */
function setupNewPost() {
  resetForm();
  formTitle.textContent = "Create New Post";

  // Set default date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${yyyy}-${mm}-${dd}`;

  // Automatically set the next available ID
  const nextId = getNextAvailableId();
  postIdInput.value = nextId;

  // Make the ID field editable for new posts
  postIdInput.removeAttribute("readonly");

  // Focus on the first content field
  titleEnInput.focus();
}

/**
 * Reset the form
 */
function resetForm() {
  postForm.reset();
  postIdInput.value = "";
  formTitle.textContent = "Post Details";
  deleteBtn.style.display = "none";

  // Remove active class from all list items
  document.querySelectorAll(".post-list-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Hide JSON output section if it's visible
  // Don't hide it completely - just minimize if needed
  if (jsonOutputSection.classList.contains("show-json")) {
    jsonOutputSection.classList.remove("show-json");
  }

  // Make the ID field editable by default
  postIdInput.removeAttribute("readonly");
}

/**
 * Save post (create or update)
 */
function savePost(event) {
  event.preventDefault();

  const postId = parseInt(postIdInput.value);
  if (!postId) {
    showNotification("Error", "Invalid post ID", true);
    return;
  }

  // Check if ID is already in use for a new post
  const existingPostIndex = posts.findIndex((p) => p.id === postId);
  const isNewPost = !postIdInput.hasAttribute("readonly");

  if (isNewPost && existingPostIndex !== -1) {
    showNotification(
      "Error",
      `Post ID ${postId} is already in use. Choose a different ID.`,
      true
    );
    return;
  }

  const updatedPost = {
    id: postId,
    "title en": titleEnInput.value,
    "title nl": titleNlInput.value,
    date: dateInput.value,
    "category en": categoryEnInput.value,
    "category nl": categoryNlInput.value,
    "text en": textEnInput.value,
    "text nl": textNlInput.value,
    image: imageInput.value,
  };

  if (existingPostIndex !== -1) {
    // Update existing post
    posts[existingPostIndex] = updatedPost;
    showNotification("Success", "Post updated successfully");
  } else {
    // Create new post
    posts.push(updatedPost);
    showNotification("Success", "New post created successfully");
  }

  // Generate and display the JSON immediately
  updateJsonOutput();

  // Refresh the display
  displayPosts();
}

/**
 * Delete post
 */
function deletePost() {
  const postId = parseInt(postIdInput.value);
  if (!postId) {
    showNotification("Error", "No post selected for deletion", true);
    return;
  }

  if (!confirm(`Are you sure you want to delete post #${postId}?`)) {
    return;
  }

  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    updateJsonOutput();
    displayPosts();
    showNotification("Success", "Post deleted successfully");
  } else {
    showNotification("Error", "Post not found", true);
  }
}

/**
 * Update JSON output section
 */
function updateJsonOutput() {
  // Sort posts by ID before displaying JSON
  posts.sort((a, b) => a.id - b.id);

  // Generate the JSON string
  const jsonString = JSON.stringify(posts, null, 2);

  // Update the preview element
  jsonPreview.textContent = jsonString;

  // Make sure the JSON output section is visible and expanded
  jsonOutputSection.classList.remove("d-none");
  jsonOutputSection.classList.add("show-json");

  // Make the copy button more visible
  copyJsonBtn.classList.add("pulse-animation");

  // Scroll to the JSON section
  jsonOutputSection.scrollIntoView({ behavior: "smooth" });
}

/**
 * Copy JSON to clipboard
 */
function copyJsonToClipboard() {
  const jsonString = JSON.stringify(posts, null, 2);

  navigator.clipboard
    .writeText(jsonString)
    .then(() => {
      showNotification("Success", "JSON copied to clipboard");

      // Provide visual feedback on the button
      const copyBtn = document.getElementById("copy-json-btn");
      copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
      copyBtn.classList.remove("btn-primary");
      copyBtn.classList.add("btn-success");
      copyBtn.classList.remove("pulse-animation");

      // Reset button after 2 seconds
      setTimeout(() => {
        copyBtn.innerHTML =
          '<i class="bi bi-clipboard"></i> Copy JSON to Clipboard';
        copyBtn.classList.remove("btn-success");
        copyBtn.classList.add("btn-primary");
      }, 2000);
    })
    .catch((err) => {
      console.error("Error copying to clipboard:", err);
      showNotification("Error", "Failed to copy JSON to clipboard", true);

      // Fallback method for browsers that don't support clipboard API
      try {
        // Create a temporary textarea
        const textarea = document.createElement("textarea");
        textarea.value = jsonString;
        document.body.appendChild(textarea);

        // Select and copy
        textarea.select();
        document.execCommand("copy");

        // Remove the textarea
        document.body.removeChild(textarea);

        showNotification(
          "Success",
          "JSON copied to clipboard (fallback method)"
        );

        // Provide visual feedback on the button
        const copyBtn = document.getElementById("copy-json-btn");
        copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
        copyBtn.classList.remove("btn-primary");
        copyBtn.classList.add("btn-success");
        copyBtn.classList.remove("pulse-animation");

        // Reset button after 2 seconds
        setTimeout(() => {
          copyBtn.innerHTML =
            '<i class="bi bi-clipboard"></i> Copy JSON to Clipboard';
          copyBtn.classList.remove("btn-success");
          copyBtn.classList.add("btn-primary");
        }, 2000);
      } catch (e) {
        showNotification(
          "Error",
          "Failed to copy JSON. Please select and copy manually.",
          true
        );
      }
    });
}

/**
 * Change the interface language
 */
function changeLanguage(lang) {
  currentLanguage = lang;

  if (lang === "en") {
    langEnBtn.classList.add("active");
    langNlBtn.classList.remove("active");
  } else {
    langEnBtn.classList.remove("active");
    langNlBtn.classList.add("active");
  }

  displayPosts();
}

/**
 * Show a notification toast
 */
function showNotification(title, message, isError = false) {
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  // Change toast color based on message type
  toast.classList.remove("bg-danger", "text-white");
  if (isError) {
    toast.classList.add("bg-danger", "text-white");
  }

  bsToast.show();
}

// Initialize event handlers after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Make sure the JSON section and copy button are visible
  if (jsonOutputSection) {
    jsonOutputSection.classList.remove("d-none");
  }

  // Event Listeners
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
  postForm.addEventListener("submit", savePost);
  cancelBtn.addEventListener("click", resetForm);
  deleteBtn.addEventListener("click", deletePost);
  newPostBtn.addEventListener("click", setupNewPost);
  loadPostsBtn.addEventListener("click", loadPosts);
  langEnBtn.addEventListener("click", () => changeLanguage("en"));
  langNlBtn.addEventListener("click", () => changeLanguage("nl"));
  copyJsonBtn.addEventListener("click", copyJsonToClipboard);

  // Check authentication
  checkAuthentication();
});
