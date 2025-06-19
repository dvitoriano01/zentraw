document.addEventListener("DOMContentLoaded", () => {
  const blotterEl = document.getElementById("blotter-text");
  if (!blotterEl || typeof Blotter === "undefined") return;

  const text = new Blotter.Text("BLOTTER FX", {
    family: "serif",
    size: 60,
    fill: "#fff"
  });

  const material = new Blotter.LiquidDistortMaterial();
  material.uniforms.uSpeed.value = 0.3;
  material.uniforms.uVolatility.value = 0.1;

  const blotter = new Blotter(material, { texts: text });
  const scope = blotter.forText(text);
  blotterEl.innerHTML = "";
  scope.appendTo(blotterEl);
});
