/* =========================================
   EDIALE PORTFOLIO — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------
     1. MOBILE NAVIGATION
  ----------------------------------------- */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }


  /* -----------------------------------------
     2. LIGHT AND DARK THEME
  ----------------------------------------- */

  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");

    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "☀" : "◐";

      themeToggle.setAttribute(
        "aria-label",
        theme === "light"
          ? "Switch to dark theme"
          : "Switch to light theme"
      );
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("edialeTheme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("edialeTheme", nextTheme);
      } catch (error) {
        // The theme still works if browser storage is unavailable.
      }
    });
  }


  /* -----------------------------------------
     3. AUTOMATIC FOOTER YEAR
  ----------------------------------------- */

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* -----------------------------------------
     4. CONTACT FORM
  ----------------------------------------- */

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  const contactSubmit = document.getElementById("contact-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const originalButtonText = contactSubmit
        ? contactSubmit.textContent
        : "Send Message";

      if (contactSubmit) {
        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
      }

      if (contactStatus) {
        contactStatus.textContent = "Sending your message...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("The message could not be sent.");
        }

        if (contactStatus) {
          contactStatus.textContent =
            "Thank you! Your message has been sent successfully.";
        }

        contactForm.reset();

      } catch (error) {
        if (contactStatus) {
          contactStatus.textContent =
            "Sorry, the message could not be sent. Please try again later.";
        }

      } finally {
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = originalButtonText;
        }
      }
    });
  }


  /* -----------------------------------------
     5. EDIALE AI CHAT ELEMENTS
  ----------------------------------------- */

  const chatButton = document.getElementById("ediale-chat-button");
  const chatBox = document.getElementById("ediale-chat-box");
  const chatClose = document.getElementById("ediale-chat-close");
  const chatForm = document.getElementById("ed
