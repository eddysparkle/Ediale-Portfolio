document.addEventListener("DOMContentLoaded", () => {
  /* MOBILE NAVIGATION */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();

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
      }
    });
  }

  /* THEME TOGGLE */
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

      themeToggle.setAttribute(
        "aria-pressed",
        String(theme === "light")
      );
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("edialeTheme") || "dark";
  } catch (_) {
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
      } catch (_) {
        // Saving the theme is optional.
      }
    });
  }

  /* AUTOMATIC COPYRIGHT YEAR */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* CONTACT FORM */
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  const contactSubmit = document.getElementById("contact-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const originalText = contactSubmit
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
      } catch (_) {
        if (contactStatus) {
          contactStatus.textContent =
            "Sorry, your message could not be sent. Please try again.";
        }
      } finally {
        if (contactSubmit) {
          contactSubmit.disabled = false;
          contactSubmit.textContent = originalText;
        }
      }
    });
  }

  /* EDIALE AI CHATBOT */
  const widget = document.getElementById("ediale-ai-widget");
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

  /*
    Move the widget directly under body if it has been placed
    inside another element. This avoids transformed ancestors
    interfering with fixed positioning.
  */
  if (widget && widget.parentElement !== document.body) {
    document.body.appendChild(widget);
  }

  /*
    Position the button and chat window independently.
    This is important: the outer widget is not used as the
    positioning container for the fixed button or chat window.
  */
  function positionChat() {
    if (!chatButton || !chatBox) return;

    const mobile = window.matchMedia("(max-width: 680px)").matches;

    Object.assign(chatButton.style, {
      position: "fixed",
      right: "max(12px, env(safe-area-inset-right))",
      bottom: "max(12px, env(safe-area-inset-bottom))",
      left: "auto",
      top: "auto",
      zIndex: "2147483000",
      maxWidth: "calc(100vw - 24px)",
      transform: "none"
    });

    Object.assign(chatBox.style, {
      position: "fixed",
      right: "max(12px, env(safe-area-inset-right))",
      left: "auto",
      top: "auto",
      bottom: mobile
        ? "calc(max(12px, env(safe-area-inset-bottom)) + 60px)"
        : "calc(max(16px, env(safe-area-inset-bottom)) + 70px)",
      zIndex: "2147482999",
      maxWidth: "calc(100vw - 24px)"
    });
  }

  positionChat();

  window.addEventListener("resize", positionChat);
  window.addEventListener("orientationchange", positionChat);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", positionChat);
  }

  function openChat() {
    if (!chatBox) return;

    chatBox.classList.add("is-open");
    chatBox.setAttribute("aria-hidden", "false");

    if (chatButton) {
      chatButton.setAttribute("aria-expanded", "true");
    }

    positionChat();

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
    if (!chatMessages) return null;

    const element = document.createElement("div");

    element.className = `chat-message ${sender}`;
    element.textContent = message;

    chatMessages.appendChild(element);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return element;
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
    const cleaned = message.trim();

    if (!cleaned) return;

    addChatMessage(cleaned, "user");

    if (chatInput) {
      chatInput.value = "";
    }

    if (chatSend) {
      chatSend.disabled = true;
    }

    const loading = addChatMessage(
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
          message: cleaned
        })
      });

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await response.json();
      const reply = getAIReply(data);

      if (loading) {
        loading.textContent =
          reply ||
          "I received your message, but couldn't find a response. Please try again.";
      }
    } catch (_) {
      if (loading) {
        loading.textContent =
          "Sorry, Ediale AI couldn't connect. Please try again in a moment.";
      }
    } finally {
      if (chatSend) {
        chatSend.disabled = false;
      }

      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      if (
        chatInput &&
        chatBox &&
        chatBox.classList.contains("is-open")
      ) {
        chatInput.focus();
      }
    }
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (chatInput) {
        sendChatMessage(chatInput.value);
      }
    });
  }

  if (chatSuggestions) {
    chatSuggestions.addEventListener("click", (event) => {
      const button = event.target.closest("button");

      if (!button) return;

      const message =
        button.dataset.message || button.textContent.trim();

      if (message) {
        openChat();
        sendChatMessage(message);
      }
    });
  }
});
