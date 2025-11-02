import * as THREE from 'three';
import './style.css';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// ========== 🎨 DIRECT IMAGE USAGE ==========
// Using your EXACT image files from GitHub
const textureLoader = new THREE.TextureLoader();

// Load and use your background image immediately
textureLoader.load(
  './Whisk_b4c97d76ca012368ec740649b13beb9bdr.jpeg', 
  (texture) => {
    console.log('✅ Background image loaded!');
    scene.background = texture;
  },
  undefined,
  (error) => {
    console.log('❌ Background image error:', error);
  }
);

// Camera starting position
camera.position.set(0, 3, 10);

// Simple lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Emotional Color System
const emotionColors = {
  calm: new THREE.Color(0x1E7FCB),
  wonder: new THREE.Color(0x9A6BFF),
  comfort: new THREE.Color(0xF7D774),
  anxiety: new THREE.Color(0xFF4F5E),
  connection: new THREE.Color(0x6EE7E0)
};

// Create Ocean Plane - WILL use your ocean image
const planeGeometry = new THREE.PlaneGeometry(30, 30, 50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: emotionColors.calm,
  metalness: 0.8,
  roughness: 0.2
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Load and apply your ocean image
textureLoader.load(
  './Whisk_0ca49e8aa43c869a93042f3c4bb837aadr.jpeg',
  (texture) => {
    console.log('✅ Ocean image loaded!');
    planeMaterial.map = texture;
    planeMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.log('❌ Ocean image error:', error);
  }
);

// Store original vertex positions for wave animation
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
  originalY.push(positions[i + 1]);
}

// Particle System - WILL use your particle image
let universeBalls = null;
const ballCount = 50;

function createUniverseBalls() {
  universeBalls = new THREE.Group();
  
  const cosmicColors = [
    new THREE.Color(0x9A6BFF),
    new THREE.Color(0x6EE7E0), 
    new THREE.Color(0xFF6B9D),
    new THREE.Color(0x4DFFDF),
    new THREE.Color(0xFFD166),
  ];
  
  // Load your particle image once
  textureLoader.load(
    './Whisk_9cf0303d8ececc485ea4ea7436ad9d4fdr.jpeg',
    (particleTexture) => {
      console.log('✅ Particle image loaded!');
      
      for (let i = 0; i < ballCount; i++) {
        const ballGeometry = new THREE.SphereGeometry(1, 12, 12);
        const color = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
        
        const ballMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.8,
          map: particleTexture, // USING YOUR IMAGE
          blending: THREE.AdditiveBlending
        });
        
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        
        const x = (Math.random() - 0.5) * 20;
        const y = 1 + Math.random() * 5;
        const z = (Math.random() - 0.5) * 20;
        
        ball.position.set(x, y, z);
        
        const size = 0.1 + Math.random() * 0.3;
        ball.scale.setScalar(size);
        
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
      console.log('🎉 All particles created with YOUR image!');
    },
    undefined,
    (error) => {
      console.log('❌ Particle image error:', error);
    }
  );
}

// Animation
function animateUniverseBalls(time) {
  if (!universeBalls) return;
  
  universeBalls.children.forEach((ball) => {
    const data = ball.userData;
    
    ball.position.y = data.originalPos.y + Math.sin(time * 0.7 + data.timeOffset) * 0.3;
    ball.rotation.y += data.rotationSpeed;
    ball.rotation.x += data.rotationSpeed * 0.5;
    
    const pulse = Math.sin(time * data.pulseSpeed) * 0.15 + 0.85;
    ball.material.opacity = 0.7 + pulse * 0.25;
  });
}

// Emotion system
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
    button.style.backgroundColor = getColorHex(emotion.key);
    button.style.color = emotion.key === 'comfort' ? 'black' : 'white';
    button.style.border = 'none';
    button.style.borderRadius = '20px';
    button.style.cursor = 'pointer';
    
    button.onclick = () => setEmotion(emotion.key);
    container.appendChild(button);
  });
  
  document.body.appendChild(container);
}

function getColorHex(emotion) {
  const hexMap = {
    calm: '#1E7FCB',
    wonder: '#9A6BFF',
    comfort: '#F7D774', 
    anxiety: '#FF4F5E',
    connection: '#6EE7E0'
  };
  return hexMap[emotion] || '#1E7FCB';
}

// Camera controls
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
  const rotationSpeed = 0.05;
  
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
  
  camera.position.y = Math.sin(time * 0.3) * 0.1 + 3;
  
  animateUniverseBalls(time);
  
  // Ocean waves
  const oceanPositions = planeGeometry.attributes.position.array;
  let waveIntensity = 0.3;
  
  for (let i = 0; i < oceanPositions.length; i += 3) {
    const x = oceanPositions[i];
    const z = oceanPositions[i + 2];
    
    const wave = Math.sin(x * 0.2 + z * 0.1 + time) * waveIntensity;
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

console.log('🚀 SIREN starting with YOUR images...');
