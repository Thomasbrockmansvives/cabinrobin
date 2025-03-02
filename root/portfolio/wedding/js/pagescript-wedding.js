console.log("javascript for the page is loaded");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  const galleryElement = document.getElementById("masonry-grid");
  const MAX_IMAGES = 50; // Maximum number of images to load

  // Check if Masonry and imagesLoaded are available
  if (typeof Masonry === "undefined") {
    console.error("Masonry library is not loaded!");
  }

  if (typeof imagesLoaded === "undefined") {
    console.error("imagesLoaded library is not loaded!");
  }

  // Function to check if an image exists
  async function imageExists(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        resolve(true);
      };
      img.onerror = function () {
        console.log(`Failed to load image: ${imageUrl}`);
        resolve(false);
      };
      img.src = imageUrl;
    });
  }

  // Function to load images dynamically
  async function loadGalleryImages() {
    let imageCount = 0;

    // Log the path we're trying to use
    console.log(
      "Looking for images at path pattern: /root/portfolio/wedding/img/weddingX.jpeg"
    );

    // Try loading images from img1.jpg to the maximum limit
    for (let i = 1; i <= MAX_IMAGES; i++) {
      // Fix the path - try a relative path instead of absolute
      // If your images are in the img folder relative to your HTML file
      const imagePath = `/root/portfolio/wedding/img/wedding${i}.jpeg`;
      console.log(`Checking for image: ${imagePath}`);

      const exists = await imageExists(imagePath);

      if (exists) {
        imageCount++;
        console.log(`Found image: ${imagePath}`);

        // Create gallery item
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";

        // Create image element
        const imgElement = document.createElement("img");
        imgElement.src = imagePath;
        imgElement.alt = `Foto uit het portfolio wedding`;

        // Append image to gallery item
        galleryItem.appendChild(imgElement);

        // Append gallery item to the grid
        galleryElement.appendChild(galleryItem);
      } else {
        // Stop checking if an image is not found
        console.log(`Image not found at index ${i}, stopping search`);
        break;
      }
    }

    console.log(`Loaded ${imageCount} images for the gallery.`);

    // Initialize Masonry layout once all images are loaded
    // Check if libraries are available before using them
    if (typeof imagesLoaded !== "undefined" && typeof Masonry !== "undefined") {
      try {
        imagesLoaded(galleryElement, function () {
          console.log("All images loaded, initializing Masonry");
          new Masonry(galleryElement, {
            itemSelector: ".gallery-item",
            columnWidth: ".gallery-item",
            percentPosition: true,
            gutter: 10,
          });

          // Make images clickable after Masonry is initialized
          makeImagesClickable();
        });
      } catch (error) {
        console.error("Error initializing Masonry:", error);
      }
    } else {
      console.error(
        "Cannot initialize Masonry - required libraries are missing"
      );
    }
  }

  // Start loading images
  loadGalleryImages();

  // Image Popup Functionality
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImage");
  const closeButton = document.querySelector(".close-button");

  // Function to make all gallery images clickable
  function makeImagesClickable() {
    const galleryImages = document.querySelectorAll(".gallery-item img");
    galleryImages.forEach((img) => {
      img.addEventListener("click", function () {
        popup.style.display = "block";
        popupImg.src = this.src;
        popupImg.alt = this.alt;

        // Prevent body scrolling when popup is open
        document.body.style.overflow = "hidden";
      });
    });
    console.log("All gallery images are now clickable");
  }

  // Close the modal
  closeButton.addEventListener("click", function () {
    popup.style.display = "none";
    // Restore body scrolling
    document.body.style.overflow = "auto";
  });

  // Close the modal when clicking outside the image
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Close popup with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && popup.style.display === "block") {
      popup.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});
