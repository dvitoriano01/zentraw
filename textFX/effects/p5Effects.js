function sketch(p) {
  p.setup = function () {
    const canvas = p.createCanvas(400, 200);
    canvas.parent("p5-canvas");
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(20);
    p.fill(255);
    p.text("p5.js Text", p.width / 2, p.height / 2);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("p5-canvas")) {
    new p5(sketch);
  }
});
