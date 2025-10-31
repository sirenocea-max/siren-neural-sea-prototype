import * as THREE from 'three';
import './style.css';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Set background color to Black Pearl
scene.background = new THREE.Color(0x050a14);

// Camera starting position - floating above ocean
camera.position.set(0, 2, 8);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Emotional Color System
const emotionColors = {
  calm: new THREE.Color(0x1E7FCB),        // SIREN Azure - Default
  wonder: new THREE.Color(0x9A6BFF),      // Violet Pulse
  comfort: new THREE.Color(0xF7D774),     // Golden Calm
  anxiety: new THREE.Color(0xFF4F5E),     // Crimson Disturbance
  connection: new THREE.Color(0x6EE7E0)   // Soft Cyan Glow
};

// Emotional Sound System
const emotionSounds = {
  calm: { freq: 110, type: 'sine', volume: 0.1 },      // Deep hum (A2)
  wonder: { freq: 440, type: 'sine', volume: 0.2 },    // A4 - curiosity tone
  comfort: { freq: 330, type: 'triangle', volume: 0.15 }, // E4 - warm tone
  anxiety: { freq: 880, type: 'sawtooth', volume: 0.3 },  // A5 - sharp tone
  connection: { freq: 554, type: 'sine', volume: 0.2 } // C#5 - connection tone
};

// Audio Context and Setup
let audioContext = null;
let oscillator = null;
let gainNode = null;

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.1; // Start with calm volume
    
    // Start with calm sound
    playEmotionSound('calm');
    
    console.log('Audio system initialized');
  } catch (error) {
    console.log('Audio not supported:', error);
  }
}

function playEmotionSound(emotion) {
  if (!audioContext || !emotionSounds[emotion]) return;
  
  // Stop previous sound
  if (oscillator) {
    oscillator.stop();
  }
  
  // Create new oscillator for this emotion
  oscillator = audioContext.createOscillator();
  oscillator.connect(gainNode);
  
  const soundConfig = emotionSounds[emotion];
  oscillator.type = soundConfig.type;
  oscillator.frequency.setValueAtTime(soundConfig.freq, audioContext.currentTime);
  
  // Smooth volume transition
  gainNode.gain.linearRampToValueAtTime(soundConfig.volume, audioContext.currentTime + 1);
  
  oscillator.start();
}

// Create the Ocean Plane
const planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: emotionColors.calm, // Start with calm blue
  metalness: 0.9,
  roughness: 0.1,
  wireframe: false
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Store original vertex positions
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
  originalY.push(positions[i + 1]);
}

// === GALAXY PLANTS SYSTEM ===
let galaxyPlants = null;
let plantGeometry = null;
let plantPositions = null;
let plantColors = null;
let plantOffsets = null; // For individual plant movement
let plantScales = null; // For individual plant sizes
const plantCount = 100; // Reduced count for better performance with complex shapes

function createGalaxyPlants() {
  const plants = new THREE.Group();
  
  // Galaxy plant colors - cosmic flora palette
  const plantColorPalette = [
    new THREE.Color(0x9A6BFF), // Cosmic Violet
    new THREE.Color(0x6EE7E0), // Nebula Cyan
    new THREE.Color(0xFF6B9D), // Star Pink
    new THREE.Color(0x4DFFDF), // Aqua Glow
    new THREE.Color(0xFFD166), // Starlight Gold
    new THREE.Color(0xB967FF), // Deep Purple
    new THREE.Color(0x6BFFB8), // Alien Green
    new THREE.Color(0xFF8E6B)  // Cosmic Coral
  ];
  
  plantOffsets = [];
  plantScales = [];
  
  // Create different types of galaxy plants
  for (let i = 0; i < plantCount; i++) {
    const plantType = Math.floor(Math.random() * 3); // 3 different plant types
    let plant;
    
    switch(plantType) {
      case 0:
        plant = createSpiralPlant();
        break;
      case 1:
        plant = createTendrilPlant();
        break;
      case 2:
        plant = createCrystalPlant();
        break;
    }
    
    // Random position on the ocean floor
    const x = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 40;
    const y = 0.1; // Just above the ocean surface
    
    plant.position.set(x, y, z);
    
    // Random rotation
    plant.rotation.y = Math.random() * Math.PI * 2;
    
    // Random scale for variety
    const scale = 0.3 + Math.random() * 0.4;
    plant.scale.set(scale, scale, scale);
    
    // Random color from galaxy palette
    const color = plantColorPalette[Math.floor(Math.random() * plantColorPalette.length)];
    plant.material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    plants.add(plant);
    
    // Store individual plant data for animation
    plantOffsets.push({
      timeOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 1.0,
      pulseSpeed: 1.0 + Math.random() * 2.0,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      heightOffset: Math.random() * 0.5
    });
    
    plantScales.push(scale);
  }
  
  scene.add(plants);
  galaxyPlants = plants;
}

function createSpiralPlant() {
  const group = new THREE.Group();
  
  // Create spiral stem
  const stemGeometry = new THREE.CylinderGeometry(0.02, 0.05, 1.5, 8);
  const stem = new THREE.Mesh(stemGeometry);
  stem.rotation.x = Math.PI / 2;
  group.add(stem);
  
  // Create spiral leaves
  const leafCount = 6;
  for (let i = 0; i < leafCount; i++) {
    const leafGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const leaf = new THREE.Mesh(leafGeometry);
    
    const angle = (i / leafCount) * Math.PI * 2;
    const radius = 0.3;
    const height = (i / leafCount) * 1.2;
    
    leaf.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    
    leaf.scale.set(1, 2, 1);
    group.add(leaf);
  }
  
  return group;
}

function createTendrilPlant() {
  const group = new THREE.Group();
  
  // Main stem
  const stemGeometry = new THREE.CylinderGeometry(0.03, 0.06, 1.2, 6);
  const stem = new THREE.Mesh(stemGeometry);
  group.add(stem);
  
  // Tendrils
  const tendrilCount = 4;
  for (let i = 0; i < tendrilCount; i++) {
    const tendrilGeometry = new THREE.CylinderGeometry(0.01, 0.02, 0.8, 4);
    const tendril = new THREE.Mesh(tendrilGeometry);
    
    const angle = (i / tendrilCount) * Math.PI * 2;
    const bend = Math.PI / 4;
    
    tendril.position.y = 0.6;
    tendril.rotation.x = bend;
    tendril.rotation.y = angle;
    
    // Add glowing tips
    const tipGeometry = new THREE.SphereGeometry(0.05, 6, 6);
    const tip = new THREE.Mesh(tipGeometry);
    tip.position.y = 0.4;
    tendril.add(tip);
    
    group.add(tendril);
  }
  
  return group;
}

function createCrystalPlant() {
  const group = new THREE.Group();
  
  // Crystal clusters
  const clusterCount = 3;
  for (let i = 0; i < clusterCount; i++) {
    const crystalCount = 3 + Math.floor(Math.random() * 4);
    
    for (let j = 0; j < crystalCount; j++) {
      const height = 0.3 + Math.random() * 0.7;
      const crystalGeometry = new THREE.CylinderGeometry(0.02, 0.04, height, 4);
      const crystal = new THREE.Mesh(crystalGeometry);
      
      const angle = (j / crystalCount) * Math.PI * 2;
      const radius = 0.1 + Math.random() * 0.2;
      
      crystal.position.set(
        Math.cos(angle) * radius,
        height * 0.5,
        Math.sin(angle) * radius
      );
      
      crystal.rotation.x = Math.PI / 2;
      crystal.rotation.z = Math.random() * Math.PI;
      
      group.add(crystal);
    }
  }
  
  return group;
}

// === GALAXY PLANTS ANIMATION ===
function animateGalaxyPlants(time) {
  if (!galaxyPlants) return;
  
  galaxyPlants.children.forEach((plant, index) => {
    const offset = plantOffsets[index];
    
    // Gentle swaying motion
    const sway = Math.sin(time * offset.swaySpeed + offset.timeOffset) * 0.1;
    plant.rotation.z = sway;
    
    // Pulsating glow
    const pulse = Math.sin(time * offset.pulseSpeed + offset.timeOffset) * 0.2 + 0.8;
    plant.scale.setScalar(plantScales[index] * pulse);
    
    // Slow rotation
    plant.rotation.y += offset.rotationSpeed;
    
    // Gentle floating motion
    const float = Math.sin(time * 0.5 + offset.timeOffset) * 0.1;
    plant.position.y = 0.1 + float + offset.heightOffset * 0.3;
  });
}

// Emotion state
let currentEmotion = 'calm';
let emotionTimer = null;

// Function to change emotion
function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    
    // Smooth color transition
    const targetColor = emotionColors[emotion];
    const startColor = planeMaterial.color.clone();
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function updateColor() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      planeMaterial.color.lerpColors(startColor, targetColor, easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(updateColor);
      }
    }
    
    updateColor();
    
    // Play emotion sound
    playEmotionSound(emotion);
    
    // Reset timer - return to calm after 15 seconds
    if (emotionTimer) clearTimeout(emotionTimer);
    emotionTimer = setTimeout(() => {
      setEmotion('calm');
    }, 15000);
  }
}

// Add emotion buttons to test the system
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
  
  // Add audio start button (required for browser autoplay)
  const audioButton = document.createElement('button');
  audioButton.textContent = '🔊 Start Audio';
  audioButton.style.margin = '5px';
  audioButton.style.padding = '8px 12px';
  audioButton.style.backgroundColor = '#333';
  audioButton.style.color = 'white';
  audioButton.style.border = 'none';
  audioButton.style.borderRadius = '20px';
  audioButton.style.cursor = 'pointer';
  audioButton.onclick = () => {
    initAudio();
    audioButton.style.display = 'none';
  };
  container.appendChild(audioButton);
  
  // Add keyboard focus helper
  const focusHelper = document.createElement('div');
  focusHelper.innerHTML = '<p style="color: white; margin: 5px; font-size: 12px; opacity: 0.8;">🎮 Click anywhere, then use WASD/Arrows for 360° camera movement<br>🌿 Galaxy plants sway gently in cosmic currents</p>';
  focusHelper.style.cursor = 'pointer';
  focusHelper.onclick = () => {
    window.focus();
  };
  container.appendChild(focusHelper);
  
  document.body.appendChild(container);
}

// Helper function to get color hex for buttons
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

// === KEYBOARD CAMERA CONTROL SYSTEM ===
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let keys = {};

// Enhanced keyboard event handlers
function setupKeyboardControls() {
  // Global keyboard listeners
  window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
    // Prevent default only for our control keys
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  });

  window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
    // Prevent default only for our control keys
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  });

  // Click anywhere to focus
  document.addEventListener('click', (event) => {
    // Only focus if clicking on the canvas or UI elements
    if (event.target.tagName !== 'BUTTON' && !event.target.closest('button')) {
      window.focus();
      // Create and focus a hidden input for mobile/touch devices
      let hiddenInput = document.getElementById('siren-hidden-input');
      if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.id = 'siren-hidden-input';
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.opacity = '0';
        hiddenInput.style.pointerEvents = 'none';
        hiddenInput.style.top = '-100px';
        document.body.appendChild(hiddenInput);
      }
      hiddenInput.focus();
    }
  });

  // Also focus when touching the canvas
  renderer.domElement.addEventListener('touchstart', () => {
    window.focus();
  });
}

// Keyboard control function - FULL 360° FREEDOM!
function handleKeyboardInput() {
  const rotationSpeed = 0.08;
  
  // REMOVED ALL ROTATION LIMITS - FULL 360° FREEDOM!
  
  // Arrow keys and WASD for camera control (case insensitive)
  if (keys['arrowup'] || keys['w']) {
    targetRotation.x -= rotationSpeed;
  }
  if (keys['arrowdown'] || keys['s']) {
    targetRotation.x += rotationSpeed;
  }
  if (keys['arrowleft'] || keys['a']) {
    targetRotation.y -= rotationSpeed;
  }
  if (keys['arrowright'] || keys['d']) {
    targetRotation.y += rotationSpeed;
  }
  
  // Reset camera with Spacebar
  if (keys[' ']) {
    targetRotation.x = 0;
    targetRotation.y = 0;
  }
  
  // Keep rotations within reasonable bounds to prevent extreme values
  // But still allow full 360° movement
  if (targetRotation.x > Math.PI * 2) targetRotation.x -= Math.PI * 2;
  if (targetRotation.x < -Math.PI * 2) targetRotation.x += Math.PI * 2;
  if (targetRotation.y > Math.PI * 2) targetRotation.y -= Math.PI * 2;
  if (targetRotation.y < -Math.PI * 2) targetRotation.y += Math.PI * 2;
}

// Animation loop
let pulseTime = 0;
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  const delta = clock.getDelta();
  
  // === CAMERA DRIFT MOTION ===
  // Gentle sine-based drift (breathing effect)
  const driftX = Math.sin(time * 0.2) * 0.02;
  const driftY = Math.cos(time * 0.15) * 0.02;
  
  // Handle keyboard input
  handleKeyboardInput();
  
  // Smooth follow (lerp) - SIREN's "curiosity lag"
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
  
  // Apply FULL 360° rotation with drift - NO LIMITS!
  camera.rotation.x = currentRotation.y + driftY;
  camera.rotation.y = currentRotation.x + driftX;
  camera.rotation.z = 0; // Keep upright
  
  // Gentle vertical float (breathing motion)
  camera.position.y = Math.sin(time * 0.5) * 0.1 + 2;
  
  // === GALAXY PLANTS ANIMATION ===
  animateGalaxyPlants(time);
  
  // === OCEAN WAVES ===
  const oceanPositions = planeGeometry.attributes.position.array;
  
  // Emotional wave behavior
  let waveIntensity = 0.3; // Default for calm
  let waveSpeed = 1.0;
  
  switch(currentEmotion) {
    case 'wonder':
      waveIntensity = 0.5;
      waveSpeed = 0.8;
      break;
    case 'comfort':
      waveIntensity = 0.2;
      waveSpeed = 0.6;
      break;
    case 'anxiety':
      waveIntensity = 0.8;
      waveSpeed = 2.0;
      break;
    case 'connection':
      waveIntensity = 0.4;
      waveSpeed = 1.2;
      break;
  }
  
  // Apply waves based on emotion
  for (let i = 0; i < oceanPositions.length; i += 3) {
    const x = oceanPositions[i];
    const z = oceanPositions[i + 2];
    
    const wave1 = Math.sin(x * 0.3 + time * waveSpeed) * waveIntensity;
    const wave2 = Math.sin(z * 0.2 + time * 1.5 * waveSpeed) * (waveIntensity * 0.7);
    const wave3 = Math.sin(x * 0.1 + z * 0.1 + time * 0.5 * waveSpeed) * (waveIntensity * 0.3);
    
    oceanPositions[i + 1] = originalY[i / 3] + wave1 + wave2 + wave3;
  }
  
  planeGeometry.attributes.position.needsUpdate = true;
  
  // Micro pulse effect (heartbeat every 5 seconds)
  pulseTime += delta;
  if (pulseTime >= 5) {
    // Add a subtle glow effect
    directionalLight.intensity = 1.5;
    setTimeout(() => {
      directionalLight.intensity = 1.0;
    }, 500);
    pulseTime = 0;
  }
  
  renderer.render(scene, camera);
}

// Initialize everything
createGalaxyPlants(); // Create beautiful galaxy plants instead of particles
createEmotionButtons();
setupKeyboardControls(); // Initialize keyboard controls
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Test: Auto-trigger wonder after 3 seconds
setTimeout(() => {
  setEmotion('wonder');
}, 3000);
