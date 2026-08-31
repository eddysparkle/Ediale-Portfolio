const elements = document.querySelectorAll(
  ".section, .project, .skill, .contact"
);

function revealOnScroll() {
  elements.forEach(function(element) {

    const position = element.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (position < screenHeight - 100) {
      element.classList.add("show");
    }

  });
}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

const themeButton = document.querySelector("#theme-toggle");

themeButton.addEventListener("click", function() {

  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    themeButton.textContent = "🌙";
  } else {
    themeButton.textContent = "☀️";
  }

});
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

contactForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

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
      headers: {
        "Accept": "application/json"
      }
    });

    if (response.ok) {

      formMessage.textContent =
        "Message sent successfully! I'll get back to you soon.";

      formMessage.style.color = "#86efac";

      contactForm.reset();

    } else {

      formMessage.textContent =
        "Something went wrong. Please try again.";

      formMessage.style.color = "#f87171";

    }

  } catch (error) {

    formMessage.textContent =
      "Unable to send the message. Please try again.";

    formMessage.style.color = "#f87171";

  }

});
