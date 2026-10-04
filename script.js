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

    // Show element when it enters (or is near) the viewport
    if (position < screenHeight - 50) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
