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
      "Looking for images at path pattern: /root/portfolio/portret/img/portretX.jpeg"
    );

    // Try loading images from img1.jpg to the maximum limit
    for (let i = 1; i <= MAX_IMAGES; i++) {
      // Fix the path - try a relative path instead of absolute
      // If your images are in the img folder relative to your HTML file
      const imagePath = `/root/portfolio/portret/img/portret${i}.jpeg`;
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
        imgElement.alt = `Foto uit het portfolio portretten`;

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
});
