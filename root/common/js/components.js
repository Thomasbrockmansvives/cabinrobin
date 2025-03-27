document.addEventListener('DOMContentLoaded', function() {
    // Function to load HTML components
    function loadComponent(url, targetSelector) {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(html => {
          document.querySelector(targetSelector).innerHTML = html;
          
          // Handle active navigation links based on current page
          if (targetSelector === '#nav-placeholder') {
            setActiveNavLink();
          }
          
          // Re-initialize any scripts that might depend on these components
          // This is important for Bootstrap dropdowns and other interactive elements
          if (typeof bootstrap !== 'undefined') {
            // Re-initialize dropdowns
            var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
            dropdownElementList.map(function (dropdownToggleEl) {
              return new bootstrap.Dropdown(dropdownToggleEl);
            });
          }
          
          // If you have language translation functionality, re-apply it
          if (typeof updatePageLanguage === 'function') {
            updatePageLanguage(getCurrentLanguage());
          }
        })
        .catch(error => {
          console.error('Error loading component:', error);
          document.querySelector(targetSelector).innerHTML = '<p>Error loading component</p>';
        });
    }
    
    // Set active navigation link based on current page URL
    function setActiveNavLink() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('#nav-placeholder .nav-link');
      
      navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Check if the link's href matches the current page path
        if (link.getAttribute('href') === currentPath || 
            (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '#')) {
          link.classList.add('active');
        }
      });
    }
    
    // Helper function to get current language (if you have language switching functionality)
    function getCurrentLanguage() {
      // This should be adapted to your language handling mechanism
      return localStorage.getItem('selectedLanguage') || 'nl';
    }
    
    // Load components if placeholders exist
    if (document.querySelector('#nav-placeholder')) {
      loadComponent('../../common/components/nav.html', '#nav-placeholder');
    }
    
    if (document.querySelector('#footer-placeholder')) {
      loadComponent('../../common/components/footer.html', '#footer-placeholder');
    }
  });