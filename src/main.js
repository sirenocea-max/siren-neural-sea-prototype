import * as THREE from 'three';
import './style.css';

// ========== 🎨 YOUR DESIGN CUSTOMIZATION AREA ==========
// ⬇️ ⬇️ ⬇️ CHANGE THESE VALUES TO MATCH YOUR 3D DESIGN ⬇️ ⬇️ ⬇️

// COLORS - Replace with colors from YOUR design
const YOUR_COLORS = {
  primary: 0x00BFFF,     // Main ocean color
  secondary: 0x9A6BFF,   // Secondary elements  
  accent1: 0xFFD166,     // First accent color
  accent2: 0x4DFFDF,     // Second accent color
  background: 0x050A14   // Background color
};

// PARTICLE SETTINGS - Adjust to match your sphere arrangements
const YOUR_PARTICLE_SETUP = {
  count: 80,             // Number of spheres
  sizeRange: [0.1, 0.4], // Min/Max sphere sizes [smallest, largest]
  heightRange: [1, 8],   // Vertical placement [lowest, highest]
  spread: 25,            // How far spheres spread horizontally
  colors: [              // Color palette for spheres
    0x00BFFF,  // Turquoise
    0x9A6BFF,  // Purple  
    0xFFD166,  // Gold
    0x4DFFDF,  // Aqua
    0xFF6B9D   // Pink
  ]
};

// OCEAN SETTINGS - Match your ocean/wave design
const YOUR_OCEAN = {
  width: 35,             // Ocean plane size
  waveIntensity: 0.4,    // How dramatic the waves are (0.1 = calm, 1.0 = stormy)
  waveSpeed: 1.2,        // Wave animation speed
  metalness: 0.9,        // How reflective (0.0 = matte, 1.0 = mirror)
  transparency: 0.8      // How see-through (0.0 = solid, 1.0 = invisible)
};

// LIGHTING - Match the mood of your design
const YOUR_LIGHTING = {
  ambientColor: 0x404040,
  ambientIntensity: 0.4,
  mainLightColor: 0x6EE7E0,
  mainLightIntensity: 1.0
};

// ⬆️ ⬆️ ⬆️ CHANGE THE ABOVE VALUES TO MATCH YOUR DESIGN ⬆️ ⬆️ ⬆️
// ========== END CUSTOMIZATION AREA ==========

// Scene setup (don't change this)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Set YOUR background color
scene.background = new THREE.Color(YOUR_COLORS.background);

// Camera position
camera.position.set(0, 4, 12);

// Apply YOUR lighting
const ambientLight = new THREE.AmbientLight(YOUR_LIGHTING.ambientColor, YOUR_LIGHTING.ambientIntensity);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(YOUR_LIGHTING.mainLightColor, YOUR_LIGHTING.mainLightIntensity);
directionalLight.position.set(3, 8, 4);
scene.add(directionalLight);

// Create ocean with YOUR settings
const planeGeometry = new THREE.PlaneGeometry(YOUR_OCEAN.width, YOUR_OCEAN.width, 80, 80);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: YOUR_COLORS.primary,
  metalness: YOUR_OCEAN.metalness,
  roughness: 0.1,
  transparent: true,
  opacity: YOUR_OCEAN.transparency
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Store original positions for waves
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
  originalY.push(positions[i + 1]);
}

// Create particles with YOUR arrangement
let universeBalls = new THREE.Group();

function createUniverseBalls() {
  for (let i = 0; i < YOUR_PARTICLE_SETUP.count; i++) {
    const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
    const color = YOUR_PARTICLE_SETUP.colors[Math.floor(Math.random() * YOUR_PARTICLE_SETUP.colors.length)];
    
    const ballMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // Position based on YOUR settings
    const x = (Math.random() - 0.5) * YOUR_PARTICLE_SETUP.spread;
    const y = YOUR_PARTICLE_SETUP.heightRange[0] + Math.random() * (YOUR_PARTICLE_SETUP.heightRange[1] - YOUR_PARTICLE_SETUP.heightRange[0]);
    const z = (Math.random() - 0.5) * YOUR_PARTICLE_SETUP.spread;
    
    ball.position.set(x, y, z);
    
    // Size based on YOUR range
    const minSize = YOUR_PARTICLE_SETUP.sizeRange[0];
    const maxSize = YOUR_PARTICLE_SETUP.sizeRange[1];
    const size = minSize + Math.random() * (maxSize - minSize);
    ball.scale.setScalar(size);
    
    // Store animation data
    ball.userData = {
      originalPos: { x, y, z },
      floatSpeed: 0.5 + Math.random() * 1.0,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      pulseSpeed: 1.0 + Math.random() * 2.0,
      timeOffset: Math.random() * Math.PI * 2
    };
    
    universeBalls.add(ball);
  }
  
  scene.add(universeBalls);
}

// Animation
function animateUniverseBalls(time) {
  universeBalls.children.forEach((ball) => {
    const data = ball.userData;
    
    // Floating motion
    const floatY = Math.sin(time * 0.7 + data.timeOffset) * 0.3;
    ball.position.y = data.originalPos.y + floatY;
    
    // Rotation
    ball.rotation.y += data.rotationSpeed;
    ball.rotation.x += data.rotationSpeed * 0.5;
    
    // Pulsing glow
    const pulse = Math.sin(time * data.pulseSpeed) * 0.15 + 0.85;
    ball.material.opacity = 0.7 + pulse * 0.25;
  });
}

// Simple emotion system
const emotionColors = {
  calm: new THREE.Color(YOUR_COLORS.primary),
  wonder: new THREE.Color(YOUR_COLORS.secondary),
  comfort: new THREE.Color(YOUR_COLORS.accent1),
  anxiety: new THREE.Color(0xFF4F5E),
  connection: new THREE.Color(YOUR_COLORS.accent2)
};

let currentEmotion = 'calm';

function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    planeMaterial.color = emotionColors[emotion];
  }
}

// UI
function createEmotionButtons() {
  const emotions = [
    { name: 'Calm', key: 'calm' },
    { name: 'Wonder', key: 'wonder' },
    { name: 'Comfort', key: 'comfort' },
    { name: 'Anxiety', key: 'anxiety' },
    { name: 'Connection', key: 'connection' }
  ];
  
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.zIndex = '100';
  container.style.background = 'rgba(5, 10, 20, 0.8)';
  container.style.padding = '15px';
  container.style.borderRadius = '10px';
  container.style.border = '1px solid rgba(30, 127, 203, 0.3)';
  container.style.backdropFilter = 'blur(10px)';
  
  emotions.forEach(emotion => {
    const button = document.createElement('button');
    button.textContent = emotion.name;
    button.style.margin = '5px';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = `#${emotionColors[emotion.key].getHexString()}`;
    button.style.color = emotion.key === 'comfort' ? 'black' : 'white';
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.cursor = 'pointer';
    
    button.onclick = () => setEmotion(emotion.key);
    container.appendChild(button);
  });
  
  document.body.appendChild(container);
}

// Camera controls (keep this)
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let keys = {};

function setupKeyboardControls() {
  window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
  });

  document.addEventListener('click', () => {
    window.focus();
  });
}

function handleKeyboardInput() {
  const rotationSpeed = 0.06;
  
  if (keys['w'] || keys['arrowup']) targetRotation.x -= rotationSpeed;
  if (keys['s'] || keys['arrowdown']) targetRotation.x += rotationSpeed;
  if (keys['a'] || keys['arrowleft']) targetRotation.y -= rotationSpeed;
  if (keys['d'] || keys['arrowright']) targetRotation.y += rotationSpeed;
  if (keys[' ']) { targetRotation.x = 0; targetRotation.y = 0; }
}

// Animation loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  handleKeyboardInput();
  
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
  
  camera.rotation.x = currentRotation.y;
  camera.rotation.y = currentRotation.x;
  
  camera.position.y = Math.sin(time * 0.4) * 0.2 + 4;
  
  animateUniverseBalls(time);
  
  // Ocean waves with YOUR intensity
  const oceanPositions = planeGeometry.attributes.position.array;
  for (let i = 0; i < oceanPositions.length; i += 3) {
    const x = oceanPositions[i];
    const z = oceanPositions[i + 2];
    
    const wave = Math.sin(x * 0.2 + z * 0.1 + time * YOUR_OCEAN.waveSpeed) * YOUR_OCEAN.waveIntensity;
    oceanPositions[i + 1] = originalY[i / 3] + wave;
  }
  
  planeGeometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

// Initialize
createUniverseBalls();
createEmotionButtons();
setupKeyboardControls();
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
