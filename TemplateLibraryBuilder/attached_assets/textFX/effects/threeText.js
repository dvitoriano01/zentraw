document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("three-canvas");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 200);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 3;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
});
