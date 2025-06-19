window.initGlitch = function () {
  const text = document.querySelector('.glitch-text');
  if (!text) return;

  // Atualiza o data-text (necessário para pseudo-elementos)
  text.setAttribute('data-text', text.textContent);

  // Reinicia a animação
  text.classList.remove('glitch-active');
  void text.offsetWidth; // força reflow
  text.classList.add('glitch-active');
};
