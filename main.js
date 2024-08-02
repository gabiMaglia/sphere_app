import gsap from "gsap"; // Importa la librería GSAP para animaciones
import * as THREE from "three"; // Importa todo de la librería THREE.js
import { OrbitControls } from "three/examples/jsm/Addons.js"; // Importa los controles de órbita para la cámara

// Scene
// Crea una nueva escena
const scene = new THREE.Scene();

// Sphere
// Crea la geometría de una esfera con radio 3 y 64 segmentos
const geometry = new THREE.SphereGeometry(3, 64, 64);

// Crea un material estándar con un color y rugosidad específicos
const material = new THREE.MeshStandardMaterial({
  color: "#F378C9", // Color inicial del material
  roughness: 0.2, // Rugosidad del material
});

// Crea una malla combinando la geometría y el material
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); // Añade la malla a la escena

// Sizes
// Obtiene el tamaño de la ventana para configurar el renderizador
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
// Crea una luz puntual blanca
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 15, 10); // Posiciona la luz en (0, 10, 10)
light.intensity = 145; // Establece la intensidad de la luz
scene.add(light); // Añade la luz a la escena

// Camera
// Crea una cámara de perspectiva con un campo de visión de 25 grados
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 25; // Posiciona la cámara a 20 unidades en el eje Z
scene.add(camera); // Añade la cámara a la escena

// Renderer
// Configura el renderizador para el canvas en el HTML
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio); // Ajusta el renderizado para pantallas de alta densidad
renderer.setSize(sizes.width, sizes.height); // Establece el tamaño del renderizador

// CONTROLS
// Añade controles de órbita para la cámara
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Activa el amortiguamiento para un movimiento suave
controls.enablePan = true; // Permite mover la cámara en el plano
controls.autoRotate = true; // Activa la rotación automática de la cámara
controls.autoRotateSpeed = 5; // Establece la velocidad de rotación automática

// Ajusta el renderizador y la cámara cuando se redimensiona la ventana
window.addEventListener("resize", () => {
  // update Sizes
  // Actualiza los tamaños
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  // Actualiza la relación de aspecto de la cámara y recalcula su proyección
  camera.aspect = sizes.width / sizes.height;
  renderer.setPixelRatio(window.devicePixelRatio);

  // updateProjectionMatrix();
  // Debes llamar a esta función cada vez que modifiques
  // alguno de los parámetros de la cámara que afectan su
  // proyección, como:
  // FOV (Field of View)
  // Aspect Ratio:
  // Near y Far Clipping Planes

  /*
    /Cuando llamas a camera.updateProjectionMatrix(), estás diciendo a Three.js que recalcule la matriz 
    /de proyección de la cámara basada en sus propiedades actuales. 
    */
  camera.updateProjectionMatrix();
  requestAnimationFrame(loop); // Solicita el próximo cuadro de animación
  controls.update(); // Actualiza los controles para reflejar los cambios
  renderer.setSize(sizes.width, sizes.height); // Actualiza el tamaño del renderizador
});

// Lo que da vida a la animacion
function loop() {
  // Esta funcion se utiliza para crear bucles de animacion, recibe como
  // argumento la funcion que se llamara antes de que el navegador vuelva
  // a repintar la pantalla
  requestAnimationFrame(loop); // Solicita el próximo cuadro de animación

  // Actualizamos controles de la cámara (en este caso, los OrbitControls)
  controls.update(); // Aplica la rotación automática y el amortiguamiento

  // renderer.render(scene, camera) es la llamada que le dice a Three.js
  // que renderice la escena desde la perspectiva de la cámara especificada.
  renderer.render(scene, camera); // Renderiza la escena desde la perspectiva de la cámara
  // window.requestAnimationFrame(loop)
}

loop(); // Inicia el bucle de animación

// TimelineAnimation
// Crea una línea de tiempo para animaciones, con una duración por defecto de 1 segundo
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Anima la escala de la malla desde 0 hasta 1

// MouseAnimationColor
let mouseDown = false; // Variable para rastrear si el mouse está presionado
let rgb = []; // Array para almacenar valores de color RGB

// Marca el mouse como presionado cuando se hace clic
window.addEventListener("mousedown", () => {
  mouseDown = true;
});

// Vuelve el color de la malla al original cuando se suelta el mouse
const resetColor = new THREE.Color("#F378C9");
window.addEventListener("mouseup", () => {
  mouseDown = false; // Marca el mouse como no presionado
  gsap.to(mesh.material.color, {
    r: resetColor.r,
    g: resetColor.g,
    b: resetColor.b,
  }); // Anima el color de vuelta al original
});

// Cambia el color de la malla basado en la posición del mouse cuando está presionado
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    // Solo cambia el color si el mouse está presionado
    rgb = [
      Math.round((e.pageX / sizes.width) * 255), // Calcula el componente rojo basado en la posición X del mouse
      Math.round((e.pageY / sizes.height) * 255), // Calcula el componente verde basado en la posición Y del mouse
      150, // Establece un valor fijo para el componente azul
    ];

    // AnimationTime
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`); // Crea un nuevo color RGB

    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    }); // Anima el color de la malla al nuevo color
  }

  // Animación de la luz
  gsap.to(light, {
    decay: 2, // Animar la propiedad de decaimiento de la luz a 2
    duration: 12, // Duración de la animación
    repeat: -1, // Repetir indefinidamente
    yoyo: true, // Revertir la animación al final de cada ciclo
    ease: "power1.inOut", // Efecto de suavizado
  });
});
