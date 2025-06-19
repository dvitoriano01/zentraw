document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("effect-select");

  if (!select) return;

  const sections = [
    "glitch",
    "chromatic",
    "scanlines",
    "typing",
    "stretch",
    "morphing",
    "gsap",
    "p5",
    "three",
    "blotter",
    "zdog",
  ];

  // Função para limpar canvas ou estados se necessário (pode ser expandida)
  function resetEffects() {
    if (window.resetP5) window.resetP5();
    if (window.resetThree) window.resetThree();
    if (window.resetBlotter) window.resetBlotter();
    if (window.resetZdog) window.resetZdog();
  }

  function showSection(selected) {
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = id === selected ? "block" : "none";
      }
    });

    resetEffects();

    // Ativar efeito específico
    switch (selected) {
      case "glitch":
        if (window.initGlitch) initGlitch();
        break;
      case "chromatic":
        if (window.initChromatic) initChromatic();
        break;
      case "scanlines":
        if (window.initScanlines) initScanlines();
        break;
      case "typing":
        if (window.initTyping) initTyping();
        break;
      case "stretch":
        if (window.initStretchBounce) initStretchBounce();
        break;
      case "morphing":
        if (window.initMorphing) initMorphing();
        break;
      case "gsap":
        if (window.initGSAP) initGSAP();
        break;
      case "p5":
        if (window.initP5) initP5();
        break;
      case "three":
        if (window.initThree) initThree();
        break;
      case "blotter":
        if (window.initBlotter) initBlotter();
        break;
      case "zdog":
        if (window.initZdog) initZdog();
        break;
    }
  }

  // Mostrar efeito inicial
  showSection(select.value);

  // Atualizar ao mudar
  select.addEventListener("change", () => {
    showSection(select.value);
  });
});
