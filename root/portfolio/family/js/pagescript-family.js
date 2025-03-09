document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  const galleryElement = document.getElementById("masonry-grid");
  const MAX_IMAGES = 50; // Maximum number of images to load
  const GAP = 15; // Gap between images in pixels
  const CONTAINER_WIDTH = galleryElement.clientWidth; // Width of the gallery container

  // Function to check if an image exists
  async function imageExists(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        resolve({
          exists: true,
          img: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        });
      };
      img.onerror = function () {
        console.log(`Failed to load image: ${imageUrl}`);
        resolve({ exists: false });
      };
      img.src = imageUrl;
    });
  }

  // Function to determine if an image is landscape orientation
  function isLandscapeOrientation(aspectRatio) {
    return aspectRatio > 1;
  }

  // Function to create a gallery row with images that preserve their aspect ratios
  function createGalleryRow(imageInfoArray, targetHeight = null) {
    // Create row element
    const row = document.createElement("div");
    row.className = "gallery-row";

    // Calculate total width for all images to have the same height
    // If no target height provided, calculate optimal height
    if (!targetHeight) {
      // For portrait images, use a reasonable default height
      // For landscapes, scale them appropriately
      const totalAspectRatio = imageInfoArray.reduce(
        (sum, img) => sum + img.aspectRatio,
        0
      );
      const availableWidth =
        CONTAINER_WIDTH - (imageInfoArray.length - 1) * GAP;
      targetHeight = availableWidth / totalAspectRatio;
    }

    // Calculate widths based on target height and aspect ratios
    const widths = imageInfoArray.map((img) => img.aspectRatio * targetHeight);

    // Distribute any rounding errors to maintain exact container width
    const totalCalculatedWidth = widths.reduce((sum, width) => sum + width, 0);
    const gapsWidth = (imageInfoArray.length - 1) * GAP;
    const adjustmentRatio =
      (CONTAINER_WIDTH - gapsWidth) / totalCalculatedWidth;

    const adjustedWidths = widths.map((width) => width * adjustmentRatio);

    // Create gallery items with calculated widths
    imageInfoArray.forEach((imgInfo, index) => {
      const galleryItem = imgInfo.element;
      const width = adjustedWidths[index];

      // Set the width for the gallery item
      galleryItem.style.width = `${width}px`;

      // Add margin between items (except for the last one)
      if (index < imageInfoArray.length - 1) {
        galleryItem.style.marginRight = `${GAP}px`;
      }

      // Special case for single item in row - ONLY if it's landscape
      if (imageInfoArray.length === 1 && imgInfo.isLandscape) {
        imgInfo.element.classList.add("full-width");
        imgInfo.element.style.width = "100%";
      }

      // Add to row
      row.appendChild(galleryItem);
    });

    // Add row to gallery
    galleryElement.appendChild(row);

    return targetHeight; // Return the height used for this row
  }

  // Main function to load and arrange gallery
  async function loadGalleryImages() {
    let imageCount = 0;
    let pendingImages = []; // Array to hold images before arrangement
    let counter = 0; // Counter to track position for every third image check

    console.log(
      "Looking for images at path pattern: /root/portfolio/family/img/familyX.jpeg"
    );

    // Try loading images
    for (let i = 1; i <= MAX_IMAGES; i++) {
      const imagePath = `/root/portfolio/family/img/family${i}.jpeg`;
      console.log(`Checking for image: ${imagePath}`);

      const result = await imageExists(imagePath);

      if (result.exists) {
        imageCount++;
        console.log(
          `Found image: ${imagePath} - Aspect ratio: ${result.aspectRatio}`
        );

        // Create gallery item
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";

        // Create image element
        const imgElement = document.createElement("img");
        imgElement.src = imagePath;
        imgElement.alt = `Foto uit het portfolio family`;

        // Add image to gallery item
        galleryItem.appendChild(imgElement);

        // Save image info for later processing
        pendingImages.push({
          element: galleryItem,
          aspectRatio: result.aspectRatio,
          isLandscape: isLandscapeOrientation(result.aspectRatio),
          index: counter++,
        });

        // Process images when we have enough or at the end
        if (pendingImages.length >= 3 || i === MAX_IMAGES || i === 1) {
          processImages();
        }
      } else {
        // Process any remaining images
        if (pendingImages.length > 0) {
          processImages(true); // true indicates final processing
        }
        console.log(`Image not found at index ${i}, stopping search`);
        break;
      }
    }

    console.log(`Loaded ${imageCount} images for the gallery.`);

    // Function to process pending images following the required pattern
    function processImages(isFinal = false) {
      // If we have less than 3 images and not final processing, wait for more
      if (pendingImages.length < 3 && !isFinal) return;

      // Log the current state for debugging
      console.log(
        "Processing images:",
        pendingImages
          .map(
            (img) =>
              `Image ${img.index} - Landscape: ${
                img.isLandscape
              }, Ratio: ${img.aspectRatio.toFixed(2)}`
          )
          .join(", ")
      );

      while (pendingImages.length > 0) {
        // Check if we have at least 3 images and the third is landscape
        if (pendingImages.length >= 3 && pendingImages[2].isLandscape) {
          // Create a row with the first two images
          console.log("Creating row with first two images");
          createGalleryRow(pendingImages.slice(0, 2));

          // Create a full-width row with just the third (landscape) image
          console.log("Creating full-width row with third landscape image");
          createGalleryRow([pendingImages[2]]);

          // Remove processed images
          pendingImages = pendingImages.slice(3);
        }
        // If we have at least 2 images (and third is not landscape or we don't have a third)
        else if (pendingImages.length >= 2) {
          // Create a row with first two images
          console.log("Creating row with next two images");
          createGalleryRow(pendingImages.slice(0, 2));

          // Remove processed images
          pendingImages = pendingImages.slice(2);
        }
        // Handle single remaining image
        else if (pendingImages.length === 1) {
          // If the last image is portrait, we shouldn't show it alone
          // Instead, try to pair it with the next image we might get
          if (!pendingImages[0].isLandscape && !isFinal) {
            console.log(
              "Single portrait image remaining, waiting for more images"
            );
            break; // Keep it in pending for next batch
          }

          // For landscape or if this is final processing, create a row
          console.log("Creating row with last image");
          createGalleryRow([pendingImages[0]]);
          pendingImages = [];
        } else {
          // No more images to process
          break;
        }
      }
    }

    // Make images clickable after they're all arranged
    makeImagesClickable();
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

  // Handle window resize to recalculate layout
  window.addEventListener("resize", function () {
    // Only recalculate if width has changed significantly
    const newWidth = galleryElement.clientWidth;
    if (Math.abs(CONTAINER_WIDTH - newWidth) > 50) {
      // Refresh the page to recalculate all image dimensions
      location.reload();
    }
  });
});
