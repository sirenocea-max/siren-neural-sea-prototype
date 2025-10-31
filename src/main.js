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

// === UNIVERSE BALLS SYSTEM ===
let universeBalls = null;
let ballPositions = null;
let ballVelocities = null;
let ballColors = null;
let ballSizes = null;
let ballOrbitData = null;
const ballCount = 50;

function createUniverseBalls() {
  // Create ball geometry
  const ballGeometry = new THREE.SphereGeometry(1, 16, 16); // Smooth spheres
  const ballMaterials = [];
  
  ballPositions = new Float32Array(ballCount * 3);
  ballColors = new Float32Array(ballCount * 3);
  ballSizes = new Float32Array(ballCount);
  ballVelocities = [];
  ballOrbitData = [];
  
  // Universe ball colors - planetary colors
  const universeColors = [
    new THREE.Color(0x9A6BFF), // Purple Nebula
    new THREE.Color(0x6EE7E0), // Cyan Gas Giant
    new THREE.Color(0xFF6B9D), // Pink Star
    new THREE.Color(0x4DFFDF), // Aqua World
    new THREE.Color(0xFFD166), // Golden Sun
    new THREE.Color(0xB967FF), // Deep Space Violet
    new THREE.Color(0x6BFFB8), // Alien Green
    new THREE.Color(0xFF8E6B), // Red Giant
    new THREE.Color(0x1E7FCB), // Blue Ocean World
    new THREE.Color(0xF7D774)  // Yellow Dwarf
  ];
  
  // Create balls in orbital positions
  for (let i = 0; i < ballCount; i++) {
    const i3 = i * 3;
    
    // Different orbital patterns
    const orbitType = Math.floor(Math.random() * 3);
    let x, y, z;
    
    switch(orbitType) {
      case 0: // Close orbit near ocean
        const radius1 = 5 + Math.random() * 15;
        const angle1 = Math.random() * Math.PI * 2;
        x = Math.cos(angle1) * radius1;
        y = 1 + Math.random() * 4;
        z = Math.sin(angle1) * radius1;
        break;
        
      case 1: // Medium orbit
        const radius2 = 10 + Math.random() * 20;
        const angle2 = Math.random() * Math.PI * 2;
        const height2 = Math.random() * Math.PI;
        x = Math.cos(angle2) * radius2 * Math.cos(height2);
        y = 3 + Math.random() * 6;
        z = Math.sin(angle2) * radius2 * Math.cos(height2);
        break;
        
      case 2: // Far scattered orbit
        x = (Math.random() - 0.5) * 40;
        y = 2 + Math.random() * 8;
        z = (Math.random() - 0.5) * 40;
        break;
    }
    
    ballPositions[i3] = x;
    ballPositions[i3 + 1] = y;
    ballPositions[i3 + 2] = z;
    
    // Random color from universe palette
    const color = universeColors[Math.floor(Math.random() * universeColors.length)];
    ballColors[i3] = color.r;
    ballColors[i3 + 1] = color.g;
    ballColors[i3 + 2] = color.b;
    
    // Random size (planets have different sizes)
    const size = 0.1 + Math.random() * 0.3;
    ballSizes[i] = size;
    
    // Gentle floating velocity
    ballVelocities.push({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.005
    });
    
    // Orbital data for planetary movement
    ballOrbitData.push({
      orbitSpeed: 0.1 + Math.random() * 0.3,
      orbitRadius: 1 + Math.random() * 3,
      timeOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });
  }
  
  // Create individual balls for better control
  universeBalls = new THREE.Group();
  
  for (let i = 0; i < ballCount; i++) {
    const ballMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(ballColors[i * 3], ballColors[i * 3 + 1], ballColors[i * 3 + 2]),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(ballPositions[i * 3], ballPositions[i * 3 + 1], ballPositions[i * 3 + 2]);
    ball.scale.setScalar(ballSizes[i]);
    
    universeBalls.add(ball);
  }
  
  scene.add(universeBalls);
}

// === UNIVERSE BALLS ANIMATION ===
function animateUniverseBalls(time) {
  if (!universeBalls) return;
  
  universeBalls.children.forEach((ball, index) => {
    const orbit = ballOrbitData[index];
    const originalPos = {
      x: ballPositions[index * 3],
      y: ballPositions[index * 3 + 1],
      z: ballPositions[index * 3 + 2]
    };
    
    // Planetary orbital motion
    const orbitX = Math.cos(time * orbit.orbitSpeed + orbit.timeOffset) * orbit.orbitRadius;
    const orbitZ = Math.sin(time * orbit.orbitSpeed + orbit.timeOffset) * orbit.orbitRadius;
    
    // Gentle floating
    const floatY = Math.sin(time * 0.3 + orbit.timeOffset) * 0.5;
    
    // Update position with orbital motion
    ball.position.x = originalPos.x + orbitX * 0.1;
    ball.position.y = originalPos.y + floatY * 0.2;
    ball.position.z = originalPos.z + orbitZ * 0.1;
    
    // Pulsating glow (like stars twinkling)
    const pulse = Math.sin(time * orbit.pulseSpeed) * 0.2 + 0.8;
    ball.material.opacity = 0.7 + pulse * 0.3;
    
    // Slow rotation (planets spinning)
    ball.rotation.y += orbit.rotationSpeed;
    ball.rotation.x += orbit.rotationSpeed * 0.5;
    
    // Gentle scale pulsing
    ball.scale.setScalar(ballSizes[index] * (0.9 + pulse * 0.2));
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
  focusHelper.innerHTML = '<p style="color: white; margin: 5px; font-size: 12px; opacity: 0.8;">🎮 Click anywhere, then use WASD/Arrows for 360° camera movement<br>🪐 Universe balls orbit in cosmic harmony</p>';
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
  
  // === UNIVERSE BALLS ANIMATION ===
  animateUniverseBalls(time);
  
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
createUniverseBalls(); // Create beautiful universe balls/planets
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
