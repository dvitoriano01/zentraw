const typingText = document.getElementById("typing-text");
const textToType = "Typing Effect";
let index = 0;

function type() {
  if (index <= textToType.length) {
    typingText.textContent = textToType.substring(0, index);
    index++;
    setTimeout(type, 150);
  } else {
    index = 0;
    setTimeout(type, 1500);
  }
}
type();
