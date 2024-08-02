import * as THREE from "three";

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

  // Set background texture
  const loader = new THREE.TextureLoader();
  const backgroundTexture = loader.load("https://res.cloudinary.com/atlasair/image/upload/v1722566220/peakpx_aekzhn.png");
  scene.background = backgroundTexture;
  // Create a dark overlay to make the background darker
  const overlayGeometry = new THREE.PlaneGeometry(2, 2);
  const overlayMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.7, // Adjust this value for desired darkness
    transparent: true,
  });
  const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
  overlay.position.z = -4; // Ensure overlay is behind other objects
  scene.add(overlay);

  // Resize overlay to cover the entire screen
  const resizeOverlay = () => {
    overlay.scale.set(window.innerWidth, window.innerHeight, 1);
  };
  window.addEventListener("resize", () => {
    resizeRendererToDisplaySize(renderer);
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    resizeOverlay();
  });
  resizeOverlay();

  // Light source
  const pointLight = new THREE.PointLight(0xffffff, 10, 10, 1);
  pointLight.position.set(0, 10, 0); // Positioning the light directly above

  scene.add(pointLight);

  // Camera setup
  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;

  // Create geometries for particles
  const geometries = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

  geometries[0].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticlePos(350), 3)
  );
  geometries[1].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticlePos(1500), 3)
  );

  // Load particle textures
  const materials = [
    new THREE.PointsMaterial({
      size: 0.04,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp1.png"
      ),
      transparent: true,
    }),
    new THREE.PointsMaterial({
      size: 0.06,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"
      ),
      transparent: true,
    }),
  ];

  // Create particle systems
  const starsT1 = new THREE.Points(geometries[0], materials[0]);
  const starsT2 = new THREE.Points(geometries[1], materials[1]);
  scene.add(starsT1);
  scene.add(starsT2);

  // Render loop
  const render = (time) => {
    // Adjust time for animation if needed
  

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // Update particle positions based on mouse
    starsT1.position.x = mouseX * 0.0001;
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
