import * as THREE from 'three';
import './style.css';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Set background color to deep cosmic black
scene.background = new THREE.Color(0x050A14);

// Add starfield for cosmic atmosphere
function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 800;
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 40 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.4
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// Camera starting position
camera.position.set(0, 4, 12);

// LIGHTING SYSTEM - Matching design lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

// Main directional light for god rays
const directionalLight = new THREE.DirectionalLight(0x6EE7E0, 1.0);
directionalLight.position.set(3, 8, 4);
scene.add(directionalLight);

// Central energy burst light (from design 3)
const centralLight = new THREE.PointLight(0xFFD166, 1.5, 30);
centralLight.position.set(0, 2, 0);
scene.add(centralLight);

// Emotional Color System - EXACT colors from your designs
const emotionColors = {
  calm: new THREE.Color(0x1E7FCB),        // Electric blue
  wonder: new THREE.Color(0x9A6BFF),      // Vibrant magenta/pink
  comfort: new THREE.Color(0xFFD166),     // Golden yellow/amber
  anxiety: new THREE.Color(0xFF4F5E),     // Hot pink
  connection: new THREE.Color(0x4DFFDF)   // Bright aqua/cyan
};

// Create the DIGITAL OCEAN - Particle grid surface
const planeGeometry = new THREE.PlaneGeometry(35, 35, 80, 80);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: emotionColors.calm,
  metalness: 0.9,
  roughness: 0.1,
  transparent: true,
  opacity: 0.8,
  emissive: new THREE.Color(0x00BFFF),
  emissiveIntensity: 0.3
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Store original vertex positions for wave animation
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
  originalY.push(positions[i + 1]);
}

// Create CENTRAL ENERGY SPIKE (from design 3)
function createCentralEnergySpike() {
  const spikeGeometry = new THREE.ConeGeometry(0.3, 4, 8);
  const spikeMaterial = new THREE.MeshBasicMaterial({
    color: 0x4DFFDF,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
  spike.position.set(0, 2, 0);
  scene.add(spike);
  
  // Add light rays around spike
  const rayCount = 12;
  for (let i = 0; i < rayCount; i++) {
    const rayGeometry = new THREE.PlaneGeometry(0.1, 8);
    const rayMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD166,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    const angle = (i / rayCount) * Math.PI * 2;
    ray.position.set(Math.cos(angle) * 1.5, 4, Math.sin(angle) * 1.5);
    ray.rotation.y = angle;
    scene.add(ray);
  }
  
  return spike;
}

// === UNIVERSE BALLS SYSTEM - Matching design arrangements ===
let universeBalls = null;
const ballCount = 60; // Balanced number for performance

function createUniverseBalls() {
  universeBalls = new THREE.Group();
  
  // EXACT color palette from your designs
  const cosmicColors = [
    new THREE.Color(0x00BFFF), // Turquoise blue/cyan
    new THREE.Color(0x1E7FCB), // Electric blue
    new THREE.Color(0x9A6BFF), // Vibrant magenta/pink
    new THREE.Color(0xFFD166), // Golden yellow/amber
    new THREE.Color(0x4DFFDF), // Bright aqua
    new THREE.Color(0xFF6B9D)  // Hot pink
  ];
  
  // Create different sphere types matching your designs
  for (let i = 0; i < ballCount; i++) {
    const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
    
    // Color distribution matching design harmony
    let color;
    if (i % 6 === 0) color = cosmicColors[0]; // Turquoise - most prominent
    else if (i % 6 === 1) color = cosmicColors[1]; // Electric blue
    else if (i % 6 === 2) color = cosmicColors[2]; // Magenta/pink
    else if (i % 6 === 3) color = cosmicColors[3]; // Golden yellow
    else if (i % 6 === 4) color = cosmicColors[4]; // Bright aqua
    else color = cosmicColors[5]; // Hot pink
    
    const ballMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // HARMONIC ARRANGEMENT - balanced but organic (from design 1)
    let x, y, z;
    const arrangementType = i % 4;
    
    switch(arrangementType) {
      case 0: // Gentle arc formation (left to right)
        const arcRadius = 8 + Math.random() * 10;
        const arcAngle = (Math.random() * 0.8 + 0.1) * Math.PI;
        x = Math.cos(arcAngle) * arcRadius;
        y = 2 + Math.random() * 5;
        z = Math.sin(arcAngle) * arcRadius;
        break;
        
      case 1: // Midground scattered
        x = (Math.random() - 0.5) * 20;
        y = 3 + Math.random() * 4;
        z = (Math.random() - 0.5) * 20;
        break;
        
      case 2: // Background depth layers
        const depthRadius = 12 + Math.random() * 8;
        const depthAngle = Math.random() * Math.PI * 2;
        x = Math.cos(depthAngle) * depthRadius;
        y = 1 + Math.random() * 3;
        z = Math.sin(depthAngle) * depthRadius;
        break;
        
      case 3: // Foreground focal points
        x = (Math.random() - 0.5) * 15;
        y = 4 + Math.random() * 2;
        z = (Math.random() - 0.5) * 15;
        break;
    }
    
    ball.position.set(x, y, z);
    
    // SIZE VARIATION - different sphere sizes (small moons to large planets)
    const size = 0.15 + Math.random() * 0.35;
    ball.scale.setScalar(size);
    
    // Store individual animation data
    ball.userData = {
      originalPos: { x, y, z },
      floatSpeed: 0.5 + Math.random() * 1.0,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      pulseSpeed: 1.0 + Math.random() * 2.0,
      timeOffset: Math.random() * Math.PI * 2,
      orbitRadius: 0.5 + Math.random() * 1.5
    };
    
    universeBalls.add(ball);
  }
  
  scene.add(universeBalls);
}

// UNIVERSE BALLS ANIMATION - Cosmic floating motion
function animateUniverseBalls(time) {
  if (!universeBalls) return;
  
  universeBalls.children.forEach((ball) => {
    const data = ball.userData;
    const originalPos = data.originalPos;
    
    // Gentle orbital motion around original position
    const orbitX = Math.cos(time * data.floatSpeed + data.timeOffset) * data.orbitRadius;
    const orbitZ = Math.sin(time * data.floatSpeed + data.timeOffset) * data.orbitRadius;
    
    // Vertical floating motion
    const floatY = Math.sin(time * 0.7 + data.timeOffset) * 0.3;
    
    // Update position with smooth motion
    ball.position.x = originalPos.x + orbitX * 0.1;
    ball.position.y = originalPos.y + floatY;
    ball.position.z = originalPos.z + orbitZ * 0.1;
    
    // Pulsating glow (bioluminescent effect)
    const pulse = Math.sin(time * data.pulseSpeed) * 0.15 + 0.85;
    ball.material.opacity = 0.7 + pulse * 0.25;
    
    // Slow rotation on multiple axes
    ball.rotation.y += data.rotationSpeed;
    ball.rotation.x += data.rotationSpeed * 0.5;
    
    // Gentle scale pulsing with breath
    ball.scale.setScalar((0.15 + Math.random() * 0.35) * (0.95 + pulse * 0.1));
  });
}

// Emotion state system
let currentEmotion = 'calm';
let emotionTimer = null;

function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    
    // Smooth ocean color transition
    const targetColor = emotionColors[emotion];
    const startColor = planeMaterial.color.clone();
    const duration = 2000;
    const startTime = Date.now();
    
    function updateColor() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      planeMaterial.color.lerpColors(startColor, targetColor, easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(updateColor);
      }
    }
    
    updateColor();
    
    // Update central light color based on emotion
    switch(emotion) {
      case 'wonder':
        centralLight.color = new THREE.Color(0x9A6BFF);
        centralLight.intensity = 1.8;
        break;
      case 'comfort':
        centralLight.color = new THREE.Color(0xFFD166);
        centralLight.intensity = 1.5;
        break;
      case 'anxiety':
        centralLight.color = new THREE.Color(0xFF4F5E);
        centralLight.intensity = 2.0;
        break;
      case 'connection':
        centralLight.color = new THREE.Color(0x4DFFDF);
        centralLight.intensity = 1.6;
        break;
      default:
        centralLight.color = new THREE.Color(0x1E7FCB);
        centralLight.intensity = 1.5;
    }
    
    // Auto-return to calm after 15 seconds
    if (emotionTimer) clearTimeout(emotionTimer);
    emotionTimer = setTimeout(() => {
      setEmotion('calm');
    }, 15000);
  }
}

// Create emotion buttons UI
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
    button.style.transition = 'all 0.3s ease';
    
    button.onclick = () => setEmotion(emotion.key);
    container.appendChild(button);
  });
  
  // Instructions
  const focusHelper = document.createElement('div');
  focusHelper.innerHTML = '<p style="color: white; margin: 5px; font-size: 12px; opacity: 0.8;">🎮 Click anywhere, then use WASD/Arrows for 360° camera<br>🌌 Digital cosmos with harmonic sphere arrangements</p>';
  focusHelper.style.cursor = 'pointer';
  focusHelper.onclick = () => window.focus();
  container.appendChild(focusHelper);
  
  document.body.appendChild(container);
}

function getColorHex(emotion) {
  const hexMap = {
    calm: '#1E7FCB',
    wonder: '#9A6BFF',
    comfort: '#FFD166', 
    anxiety: '#FF4F5E',
    connection: '#4DFFDF'
  };
  return hexMap[emotion] || '#1E7FCB';
}

// === 360° CAMERA CONTROL SYSTEM ===
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let keys = {};

function setupKeyboardControls() {
  window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  });

  window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON' && !event.target.closest('button')) {
      window.focus();
    }
  });
}

function handleKeyboardInput() {
  const rotationSpeed = 0.06;
  
  if (keys['arrowup'] || keys['w']) targetRotation.x -= rotationSpeed;
  if (keys['arrowdown'] || keys['s']) targetRotation.x += rotationSpeed;
  if (keys['arrowleft'] || keys['a']) targetRotation.y -= rotationSpeed;
  if (keys['arrowright'] || keys['d']) targetRotation.y += rotationSpeed;
  
  if (keys[' ']) {
    targetRotation.x = 0;
    targetRotation.y = 0;
  }
  
  // Keep rotations manageable
  if (targetRotation.x > Math.PI * 2) targetRotation.x -= Math.PI * 2;
  if (targetRotation.x < -Math.PI * 2) targetRotation.x += Math.PI * 2;
  if (targetRotation.y > Math.PI * 2) targetRotation.y -= Math.PI * 2;
  if (targetRotation.y < -Math.PI * 2) targetRotation.y += Math.PI * 2;
}

// Animation loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Handle keyboard input
  handleKeyboardInput();
  
  // Smooth camera rotation with "curiosity lag"
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
  
  camera.rotation.x = currentRotation.y;
  camera.rotation.y = currentRotation.x;
  
  // Gentle camera floating motion
  camera.position.y = Math.sin(time * 0.4) * 0.2 + 4;
  
  // Animate universe balls
  animateUniverseBalls(time);
  
  // DIGITAL OCEAN WAVES - Particle grid motion
  const oceanPositions = planeGeometry.attributes.position.array;
  
  let waveIntensity = 0.4;
  let waveSpeed = 1.2;
  
  switch(currentEmotion) {
    case 'wonder':
      waveIntensity = 0.6;
      waveSpeed = 1.0;
      break;
    case 'comfort':
      waveIntensity = 0.3;
      waveSpeed = 0.8;
      break;
    case 'anxiety':
      waveIntensity = 0.8;
      waveSpeed = 2.0;
      break;
    case 'connection':
      waveIntensity = 0.5;
      waveSpeed = 1.4;
      break;
  }
  
  // Multi-frequency wave patterns for digital ocean
  for (let i = 0; i < oceanPositions.length; i += 3) {
    const x = oceanPositions[i];
    const z = oceanPositions[i + 2];
    
    const wave1 = Math.sin(x * 0.25 + time * waveSpeed) * waveIntensity;
    const wave2 = Math.sin(z * 0.15 + time * 1.7 * waveSpeed) * (waveIntensity * 0.6);
    const wave3 = Math.sin((x + z) * 0.1 + time * 0.5 * waveSpeed) * (waveIntensity * 0.3);
    
    oceanPositions[i + 1] = originalY[i / 3] + wave1 + wave2 + wave3;
  }
  
  planeGeometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

// Initialize everything
createStarfield();
createCentralEnergySpike(); // From design 3
createUniverseBalls();
createEmotionButtons();
setupKeyboardControls();
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Auto-trigger wonder after 3 seconds
setTimeout(() => {
  setEmotion('wonder');
}, 3000);
