document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("zdog-canvas");
  if (!canvas || typeof Zdog === "undefined") return;

  const illo = new Zdog.Illustration({
    element: "#zdog-canvas",
    dragRotate: true,
    rotate: { x: -Zdog.TAU / 8, y: Zdog.TAU / 8 }
  });

  new Zdog.Box({
    addTo: illo,
    width: 80,
    height: 80,
    depth: 80,
    stroke: false,
    color: "#C25",
    leftFace: "#EA0",
    rightFace: "#E62",
    topFace: "#ED0",
    bottomFace: "#636"
  });

  function animate() {
    illo.rotate.y += 0.03;
    illo.updateRenderGraph();
    requestAnimationFrame(animate);
  }

  animate();
});
