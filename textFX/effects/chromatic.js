document.addEventListener("DOMContentLoaded", () => {
  const chromaText = document.querySelector(".chromatic-text");
  if (chromaText) {
    chromaText.setAttribute("data-text", chromaText.textContent);
  }
});
