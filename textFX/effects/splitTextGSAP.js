document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.getElementById("gsap-text");
  if (!textEl || typeof SplitText === "undefined") return;

  const split = new SplitText(textEl, { type: "chars" });
  gsap.from(split.chars, {
    duration: 0.8,
    opacity: 0,
    y: 50,
    stagger: 0.05,
    ease: "back.out(1.7)"
  });
});
