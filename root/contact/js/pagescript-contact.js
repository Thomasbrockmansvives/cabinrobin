document.addEventListener("DOMContentLoaded", function () {
  /*
   * CONTACT PAGE-SPECIFIC JAVASCRIPT
   * form-control, validations and email-sending using emailjs
   */
  emailjs.init("r6pBsYE9tXesbdZ0B");

  // Get form elements
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const photoshootToggle = document.getElementById("photoshootToggle");
  const photoshootFields = document.getElementById("photoshootFields");
  const dateInput = document.getElementById("dateInput");
  const locationInput = document.getElementById("locationInput");
  const messageTextarea = document.getElementById("messageTextarea");
  const submitButton = document.getElementById("submitButton");
  const formFields = document.getElementById("formFields");
  const thankYouMessage = document.getElementById("thankYouMessage");

  // Create loading overlay
  const loadingOverlay = document.createElement("div");
  loadingOverlay.classList.add("loading-overlay");
  loadingOverlay.innerHTML = '<div class="spinner"></div>';
  loadingOverlay.style.display = "none";
  document.body.appendChild(loadingOverlay);

  // Show loading spinner
  function showLoading() {
    loadingOverlay.style.display = "flex";
  }

  // Hide loading spinner
  function hideLoading() {
    loadingOverlay.style.display = "none";
  }

  // Calculate minimum date (1 week from today)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const minDate = nextWeek.toISOString().split("T")[0];
  dateInput.setAttribute("min", minDate);

  // Show/hide photoshoot fields based on toggle
  function togglePhotoshootFields() {
    if (photoshootToggle.checked) {
      photoshootFields.style.display = "block";
      dateInput.setAttribute("required", "");
      locationInput.setAttribute("required", "");
    } else {
      photoshootFields.style.display = "none";
      dateInput.removeAttribute("required");
      locationInput.removeAttribute("required");
    }
    validateForm();
  }

  // Validate name (no numbers allowed)
  function validateName() {
    const nameRegex = /^[^0-9]*$/;
    const isValid = nameInput.value && nameRegex.test(nameInput.value);
    if (!isValid) {
      nameInput.classList.add("is-invalid");
      nameInput.classList.remove("is-valid");
    } else {
      nameInput.classList.remove("is-invalid");
      nameInput.classList.add("is-valid");
    }
    return isValid;
  }

  // Validate email
  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailInput.value && emailRegex.test(emailInput.value);
    if (!isValid) {
      emailInput.classList.add("is-invalid");
      emailInput.classList.remove("is-valid");
    } else {
      emailInput.classList.remove("is-invalid");
      emailInput.classList.add("is-valid");
    }
    return isValid;
  }

  // Validate date
  function validateDate() {
    if (photoshootToggle.checked) {
      const selectedDate = new Date(dateInput.value);
      const isValid = dateInput.value && selectedDate >= nextWeek;
      if (!isValid) {
        dateInput.classList.add("is-invalid");
        dateInput.classList.remove("is-valid");
      } else {
        dateInput.classList.remove("is-invalid");
        dateInput.classList.add("is-valid");
      }
      return isValid;
    }
    return true;
  }

  // Validate location
  function validateLocation() {
    if (photoshootToggle.checked) {
      const isValid = locationInput.value.trim() !== "";
      if (!isValid) {
        locationInput.classList.add("is-invalid");
        locationInput.classList.remove("is-valid");
      } else {
        locationInput.classList.remove("is-invalid");
        locationInput.classList.add("is-valid");
      }
      return isValid;
    }
    return true;
  }

  // Validate form and toggle submit button
  function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isDateValid = validateDate();
    const isLocationValid = validateLocation();

    if (isNameValid && isEmailValid && isDateValid && isLocationValid) {
      submitButton.removeAttribute("disabled");
      submitButton.classList.add("active");
    } else {
      submitButton.setAttribute("disabled", "");
      submitButton.classList.remove("active");
    }
  }

  // Event listeners for form validation
  photoshootToggle.addEventListener("change", togglePhotoshootFields);
  nameInput.addEventListener("input", validateForm);
  emailInput.addEventListener("input", validateForm);
  dateInput.addEventListener("input", validateForm);
  locationInput.addEventListener("input", validateForm);

  // Form submission with EmailJS
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate form before submission
    if (
      validateName() &&
      validateEmail() &&
      validateDate() &&
      validateLocation()
    ) {
      // Prepare EmailJS template parameters
      const templateParams = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        reply_to: emailInput.value,
        message: messageTextarea.value || "** Geen extra bericht",
        // Conditional photoshoot details
        photoshoot_date: photoshootToggle.checked
          ? dateInput.value
          : "** Er werd geen concrete fotoshoot aangevraagd",
        photoshoot_location: photoshootToggle.checked
          ? locationInput.value
          : "** Er werd geen concrete fotoshoot aangevraagd",
      };

      // Disable submit button and show loading state
      submitButton.setAttribute("disabled", "true");
      submitButton.textContent = "Sending...";

      // Show loading spinner
      showLoading();

      console.log("Sending email with parameters:", templateParams);

      // Send email using EmailJS
      emailjs.send("service_6e6ihrj", "template_d12nk6h", templateParams).then(
        function (response) {
          console.log("EMAIL SENT SUCCESS!", response.status, response.text);

          // Hide loading spinner
          hideLoading();

          // Hide form fields and show thank you message
          formFields.style.display = "none";
          thankYouMessage.style.display = "block";

          // Reset submit button
          submitButton.removeAttribute("disabled");
          submitButton.textContent = "Verstuur";
        },
        function (error) {
          console.error("EMAIL SEND FAILED:", error);

          // Hide loading spinner
          hideLoading();

          // Show error message
          alert(
            "Er is een fout opgetreden bij het verzenden van het bericht. Probeer het opnieuw of neem rechtstreeks contact op."
          );

          // Re-enable submit button
          submitButton.removeAttribute("disabled");
          submitButton.textContent = "Verstuur";
        }
      );
    } else {
      console.error("Form validation failed");
    }
  });

  // Initialize the form
  togglePhotoshootFields();
});
