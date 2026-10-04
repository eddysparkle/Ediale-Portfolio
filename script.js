// =========================
// SCROLL REVEAL
// =========================
const elements = document.querySelectorAll(
  ".section, .project, .skill, .contact"
);

function revealOnScroll() {
  const screenHeight = window.innerHeight;

  elements.forEach(function (element) {
    const position = element.getBoundingClientRect().top;

    if (position < screenHeight - 50) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
revealOnScroll();

setTimeout(function () {
  elements.forEach(function (element) {
    element.classList.add("show");
  });
}, 1200);


// =========================
// THEME TOGGLE (brightness)
// =========================
const themeButton = document.querySelector("#theme-toggle");

if (themeButton) {
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      themeButton.textContent = "🌙";
    } else {
      themeButton.textContent = "☀️";
    }
  });
}


// =========================
// CONTACT FORM
// =========================
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameField = document.querySelector("#name");
    const emailField = document.querySelector("#email");
    const messageField = document.querySelector("#message");

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";

    if (name === "" || email === "" || message === "") {
      formMessage.textContent = "Please complete all fields.";
      formMessage.style.color = "#f87171";
      return;
    }

    formMessage.textContent = "Sending...";
    formMessage.style.color = "#a78bfa";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        formMessage.textContent =
          "Message sent successfully! I'll get back to you soon.";
        formMessage.style.color = "#86efac";
        contactForm.reset();

        setTimeout(function () {
          formMessage.textContent = "";
        }, 4000);
      } else {
        formMessage.textContent = "Something went wrong. Please try again.";
        formMessage.style.color = "#f87171";
      }
    } catch (error) {
      formMessage.textContent =
        "Unable to send the message. Please try again.";
      formMessage.style.color = "#f87171";
    }
  });
}


// =========================
// MOBILE NAV MENU
// =========================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  function closeMenu() {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }

  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();

    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  document.addEventListener("click", function (event) {
    if (!navLinks.classList.contains("active")) return;

    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedButton = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  });
}


// =========================
// SCRIPT SAMPLE TOGGLE
// (needed for onclick="toggleScript(...)")
// =========================
function toggleScript(id) {
  const script = document.getElementById(id);
  if (!script) return;

  if (script.classList.contains("open")) {
    script.classList.remove("open");
  } else {
    document.querySelectorAll(".script-full.open").forEach(function (item) {
      item.classList.remove("open");
    });

    script.classList.add("open");

    setTimeout(function () {
      script.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
}
