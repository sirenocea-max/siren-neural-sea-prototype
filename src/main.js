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

// === PARTICLE SYSTEM ===
let particles = null;
let particlePositions = null;
let particleVelocities = null;
let particleColors = null;

function createParticles() {
  const particleCount = 200;
  
  // Create particle geometry
  const particleGeometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  particleColors = new Float32Array(particleCount * 3);
  particleVelocities = [];
  
  // Create particles in random positions above the ocean
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Random position above ocean
    particlePositions[i3] = (Math.random() - 0.5) * 40;     // x
    particlePositions[i3 + 1] = Math.random() * 5 + 1;      // y (height)
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 40; // z
    
    // Random color from emotional palette
    const colorKeys = Object.keys(emotionColors);
    const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const color = emotionColors[randomColorKey];
    
    particleColors[i3] = color.r;
    particleColors[i3 + 1] = color.g;
    particleColors[i3 + 2] = color.b;
    
    // Random velocity
    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.02
    });
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  
  // Create particle material
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

// Emotion state
let currentEmotion = 'calm';
let emotionTimer = null;

// Function to change emotion
function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    planeMaterial.color = emotionColors[emotion];
    
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
  
  emotions.forEach(emotion => {
    const button = document.createElement('button');
    button.textContent = emotion.name;
    button.style.margin = '5px';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = getColorHex(emotion.key);
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
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
  audioButton.style.borderRadius = '4px';
  audioButton.style.cursor = 'pointer';
  audioButton.onclick = () => {
    initAudio();
    audioButton.style.display = 'none';
  };
  container.appendChild(audioButton);
  
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

// === TIDAL DRIFT CAMERA SYSTEM ===
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let mouseX = 0;
let mouseY = 0;

// Mouse movement handler
document.addEventListener('mousemove', (event) => {
  // Convert mouse position to normalized coordinates (-1 to 1)
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  
  // Set target rotation with limits (±30° horizontal, ±15° vertical)
  targetRotation.x = mouseX * 0.5; // 0.5 radians ≈ 30 degrees
  targetRotation.y = mouseY * 0.25; // 0.25 radians ≈ 15 degrees
});

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
  
  // Smooth follow (lerp) - SIREN's "curiosity lag"
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
  
  // Apply rotation with drift
  camera.rotation.x = currentRotation.y + driftY;
  camera.rotation.y = currentRotation.x + driftX;
  
  // Gentle vertical float (breathing motion)
  camera.position.y = Math.sin(time * 0.5) * 0.1 + 2;
  
  // === PARTICLE ANIMATION ===
  if (particles) {
    const positions = particles.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      const velocity = particleVelocities[i];
      
      // Update position
      positions[i3] += velocity.x;
      positions[i3 + 1] += velocity.y;
      positions[i3 + 2] += velocity.z;
      
      // Bounce off boundaries
      if (positions[i3] < -20 || positions[i3] > 20) velocity.x *= -1;
      if (positions[i3 + 1] < 0.5 || positions[i3 + 1] > 8) velocity.y *= -1;
      if (positions[i3 + 2] < -20 || positions[i3 + 2] > 20) velocity.z *= -1;
      
      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time + i) * 0.002;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
  }
  
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

// Initialize
createParticles(); // Create the magical particles
createEmotionButtons();
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
