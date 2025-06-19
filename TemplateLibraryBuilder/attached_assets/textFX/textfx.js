// textfx.js
const textFX = {
  glitch(selector) {
    const el = document.querySelector(selector);
    el.classList.add("glitch");
  },

  typing(selector, text, speed = 60) {
    const el = document.querySelector(selector);
    el.innerHTML = "";
    let i = 0;
    function type() {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }
};

window.textFX = textFX;
