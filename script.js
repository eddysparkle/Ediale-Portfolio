/* =========================================
   EDIALE PORTFOLIO — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. MOBILE NAVIGATION MENU
     ========================================= */

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

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
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }


  /* =========================================
     2. LIGHT AND DARK THEME TOGGLE
     ========================================= */

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

      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
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
    themeToggle.addEventListener("click", (event) => {
      event.preventDefault();

      const nextTheme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("edialeTheme", nextTheme);
      } catch (error) {
        // Theme switching still works if storage is unavailable.
      }
    });
  }


  /* =========================================
     3. AUTOMATIC FOOTER YEAR
     ========================================= */

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =========================================
     4. CONTACT FORM
     ========================================= */

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
          throw new Error("Message could not be sent.");
        }

        if (contactStatus) {
          contactStatus.textContent =
            "Thank you! Your message has been sent successfully.";
        }

        contactForm.reset();

      } catch (error) {
        if (contactStatus) {
          contactStatus.textContent =
            "Sorry, your message could not be sent. Please try again.";
        }
      } finally {
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = originalButtonText;
        }
      }
    });
  }


  /* =========================================
     5. EDIALE AI CHAT
     ========================================= */

  const chatButton = document.getElementById("ediale-chat-button");
  const chatBox = document.getElementById("ediale-chat-box");
  const chatClose = document.getElementById("ediale-chat-close");
  const chatForm = document.getElementById("ediale-chat-form");
  const chatInput = document.getElementById("ediale-chat-input");
  const chatMessages = document.getElementById("ediale-chat-messages");
  const chatSend = document.getElementById("ediale-chat-send");
  const chatSuggestions = document.getElementById("chat-suggestions");

  const AI_ENDPOINT =
    "https://ediale-portfolio-ai.edialeeghonghon.workers.dev";

  function openChat() {
    if (!chatBox) return;

    chatBox.classList.add("is-open");
    chatBox.setAttribute("aria-hidden", "false");

    if (chatButton) {
      chatButton.setAttribute("aria-expanded", "true");
    }

    if (chatInput) {
      setTimeout(() => chatInput.focus(), 100);
    }
  }

  function closeChat() {
    if (!chatBox) return;

    chatBox.classList.remove("is-open");
    chatBox.setAttribute("aria-hidden", "true");

    if (chatButton) {
      chatButton.setAttribute("aria-expanded", "false");
      chatButton.focus();
    }
  }

  if (chatButton && chatBox) {
    chatButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (chatBox.classList.contains("is-open")) {
        closeChat();
      } else {
        openChat();
      }
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", closeChat);
  }

  function addChatMessage(message, sender) {
    if (!chatMessages) return;

    const messageElement = document.createElement("div");

    messageElement.className = `chat-message ${sender}`;
    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageElement;
  }

  function getAIReply(data) {
    if (typeof data === "string") {
      return data;
    }

    if (!data || typeof data !== "object") {
      return "";
    }

    for (const key of ["response", "reply", "message", "result"]) {
      if (typeof data[key] === "string" && data[key].trim()) {
        return data[key].trim();
      }
    }

    return "";
  }

  async function sendChatMessage(message) {
    const cleanedMessage = message.trim();

    if (!cleanedMessage) return;

    addChatMessage(cleanedMessage, "user");

    if (chatInput) {
      chatInput.value = "";
    }

    if (chatSend) {
      chatSend.disabled = true;
    }

    const loadingMessage = addChatMessage(
      "Ediale AI is thinking...",
      "assistant"
    );

    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: cleanedMessage
        })
      });

      if (!response.ok) {
        throw new Error("AI service is temporarily unavailable.");
      }

      const data = await response.json();
      const reply = getAIReply(data);

      if (loadingMessage) {
        loadingMessage.textContent = reply ||
          "I received your message, but couldn't find a response. Please try again.";
      }

    } catch (error) {
      if (loadingMessage) {
        loadingMessage.textContent =
          "Sorry, Ediale AI couldn't connect. Please try again in a moment.";
      }
    } finally {
      if (chatSend) {
        chatSend.disabled = false;
      }

      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      if (chatInput && chatBox && chatBox.classList.contains("is-open")) {
        chatInput.focus();
      }
    }
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!chatInput) return;

      sendChatMessage(chatInput.value);
    });
  }

  if (chatSuggestions) {
    chatSuggestions.addEventListener("click", (event) => {
      const suggestion = event.target.closest("button");

      if (!suggestion) return;

      const message =
        suggestion.dataset.message ||
        suggestion.textContent.trim();

      if (message) {
        openChat();
        sendChatMessage(message);
      }
    });
  }

});
