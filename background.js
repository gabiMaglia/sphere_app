import * as THREE from 'three';

// Function to generate random particle positions
const getRandomParticlePos = (particleCount) => {
  const arr = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    arr[i] = (Math.random() - 0.5) * 10;
  }
  return arr;
};

// Function to resize renderer to match display size
const resizeRendererToDisplaySize = (renderer) => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

// Mouse movement tracking
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const main = () => {
  const canvas = document.querySelector(".c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(new THREE.Color("#3c1970"));
  const scene = new THREE.Scene();

  // Light source
  const light = new THREE.DirectionalLight(0xffffff, 11);
  light.position.set(-1, 22, 100);
  scene.add(light);

  // Camera setup
  const fov = 105;
  const aspect = 2;  // the canvas default
  const near = 1.5;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  // Create geometries for particles
  const geometries = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

  geometries[0].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticlePos(350), 8)
  );
  geometries[1].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticlePos(1500), 3)
  );

  // Load textures
  const loader = new THREE.TextureLoader();
  const materials = [
    new THREE.PointsMaterial({
      size: 0.07,
      map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp1.png"),
      transparent: true
    }),
    new THREE.PointsMaterial({
      size: 0.105,
      map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"),
      transparent: true
    })
  ];

  // Create particle systems
  const starsT1 = new THREE.Points(geometries[0], materials[0]);
  const starsT2 = new THREE.Points(geometries[1], materials[1]);
  scene.add(starsT1);
  scene.add(starsT2);

  // Render loop
  const render = (time) => {
    // Adjust time for animation if needed
    // time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Update particle positions based on mouse
    starsT1.position.x = mouseX * 0.0011;
    starsT1.position.y = mouseY * -0.0001;

    starsT2.position.x = mouseX * 0.0001;
    starsT2.position.y = mouseY * -0.0001;

    // Render the scene
    renderer.render(scene, camera);

    // Loop
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

main();
