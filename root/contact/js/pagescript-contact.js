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

  // Track if form has been submitted
  let formSubmitAttempted = false;

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
    // Only validate if form submission has been attempted
    if (formSubmitAttempted) {
      validateForm(true);
    } else {
      // Still check if form is valid to enable/disable submit button
      validateForm(false);
    }
  }

  // Validate name (no numbers allowed)
  function validateName(showValidation) {
    const nameRegex = /^[^0-9]*$/;
    const isValid = nameInput.value && nameRegex.test(nameInput.value);

    if (showValidation) {
      if (!isValid) {
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
      } else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
      }
    } else {
      nameInput.classList.remove("is-invalid");
      nameInput.classList.remove("is-valid");
    }

    return isValid;
  }

  // Validate email
  function validateEmail(showValidation) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailInput.value && emailRegex.test(emailInput.value);

    if (showValidation) {
      if (!isValid) {
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
      } else {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
      }
    } else {
      emailInput.classList.remove("is-invalid");
      emailInput.classList.remove("is-valid");
    }

    return isValid;
  }

  // Validate date
  function validateDate(showValidation) {
    if (photoshootToggle.checked) {
      const selectedDate = new Date(dateInput.value);
      const isValid = dateInput.value && selectedDate >= nextWeek;

      if (showValidation) {
        if (!isValid) {
          dateInput.classList.add("is-invalid");
          dateInput.classList.remove("is-valid");
        } else {
          dateInput.classList.remove("is-invalid");
          dateInput.classList.add("is-valid");
        }
      } else {
        dateInput.classList.remove("is-invalid");
        dateInput.classList.remove("is-valid");
      }

      return isValid;
    }
    return true;
  }

  // Validate location
  function validateLocation(showValidation) {
    if (photoshootToggle.checked) {
      const isValid = locationInput.value.trim() !== "";

      if (showValidation) {
        if (!isValid) {
          locationInput.classList.add("is-invalid");
          locationInput.classList.remove("is-valid");
        } else {
          locationInput.classList.remove("is-invalid");
          locationInput.classList.add("is-valid");
        }
      } else {
        locationInput.classList.remove("is-invalid");
        locationInput.classList.remove("is-valid");
      }

      return isValid;
    }
    return true;
  }

  // Validate form and toggle submit button
  function validateForm(showValidation = false) {
    const isNameValid = validateName(showValidation);
    const isEmailValid = validateEmail(showValidation);
    const isDateValid = validateDate(showValidation);
    const isLocationValid = validateLocation(showValidation);

    if (isNameValid && isEmailValid && isDateValid && isLocationValid) {
      submitButton.removeAttribute("disabled");
      submitButton.classList.add("active");
    } else {
      submitButton.setAttribute("disabled", "");
      submitButton.classList.remove("active");
    }

    return isNameValid && isEmailValid && isDateValid && isLocationValid;
  }

  // Event listeners for form validation (without showing validation errors)
  photoshootToggle.addEventListener("change", togglePhotoshootFields);
  nameInput.addEventListener("input", () => validateForm(formSubmitAttempted));
  emailInput.addEventListener("input", () => validateForm(formSubmitAttempted));
  dateInput.addEventListener("input", () => validateForm(formSubmitAttempted));
  locationInput.addEventListener("input", () =>
    validateForm(formSubmitAttempted)
  );

  // Form submission with EmailJS
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Set flag to indicate form submission was attempted
    formSubmitAttempted = true;

    // Validate form before submission (and show validation errors)
    if (validateForm(true)) {
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

          // Reset form submission attempt flag
          formSubmitAttempted = false;
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
