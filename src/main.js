import * as THREE from 'three';
import './style.css';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Set background color to Black Pearl (#050A14)
scene.background = new THREE.Color(0x050A14);

// Add subtle starfield nebula backdrop
function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Random positions in a large sphere
    const radius = 50 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.3
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// Camera starting position - floating above ocean
camera.position.set(0, 2, 8);

// VOLUMETRIC LIGHTING SYSTEM
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Main directional light for god rays effect
const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 1.2);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Emotional glow lights
const emotionalLights = {
  calm: new THREE.PointLight(0x1E7FCB, 0.8, 20),
  wonder: new THREE.PointLight(0x9A6BFF, 1.0, 20),
  comfort: new THREE.PointLight(0xF7D774, 0.7, 20),
  anxiety: new THREE.PointLight(0xFF4F5E, 1.2, 20),
  connection: new THREE.PointLight(0x6EE7E0, 0.9, 20)
};

// Position emotional lights around scene
Object.values(emotionalLights).forEach((light, index) => {
  const angle = (index / Object.keys(emotionalLights).length) * Math.PI * 2;
  light.position.set(
    Math.cos(angle) * 15,
    5,
    Math.sin(angle) * 15
  );
  scene.add(light);
});

// EMOTIONAL COLOR SYSTEM - Exact from design
const emotionColors = {
  calm: new THREE.Color(0x1E7FCB),        // Deep blue - CALM
  wonder: new THREE.Color(0x9A6BFF),      // Violet pulse - WONDER
  comfort: new THREE.Color(0xF7D774),     // Golden calm - COMFORT
  anxiety: new THREE.Color(0xFF4F5E),     // Crimson disturbance - ANXIETY
  connection: new THREE.Color(0x6EE7E0)   // Soft cyan glow - CONNECTION
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
    gainNode.gain.value = 0.1;
    
    playEmotionSound('calm');
    console.log('Audio system initialized');
  } catch (error) {
    console.log('Audio not supported:', error);
  }
}

function playEmotionSound(emotion) {
  if (!audioContext || !emotionSounds[emotion]) return;
  
  if (oscillator) {
    oscillator.stop();
  }
  
  oscillator = audioContext.createOscillator();
  oscillator.connect(gainNode);
  
  const soundConfig = emotionSounds[emotion];
  oscillator.type = soundConfig.type;
  oscillator.frequency.setValueAtTime(soundConfig.freq, audioContext.currentTime);
  
  gainNode.gain.linearRampToValueAtTime(soundConfig.volume, audioContext.currentTime + 1);
  oscillator.start();
}

// Create the OCEAN PLANE - LIQUID CRYSTAL SURFACE
const planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: emotionColors.calm, // Start with calm blue
  metalness: 0.9,           // METALLIC REFLECTIONS
  roughness: 0.1,           // LIQUID CRYSTAL smoothness
  wireframe: false,
  transparent: true,
  opacity: 0.9
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

// === UNIVERSE BALLS SYSTEM - BIOLUMINESCENT ORBS ===
let universeBalls = null;
let ballPositions = null;
let ballColors = null;
let ballSizes = null;
let ballOrbitData = null;
const ballCount = 200; // 200 FLOATING BIOLUMINESCENT ORBS

function createUniverseBalls() {
  // COSMIC COLORS from design
  const cosmicColors = [
    new THREE.Color(0x9A6BFF), // Purple Nebula
    new THREE.Color(0x6EE7E0), // Cyan Gas Giant
    new THREE.Color(0xFF6B9D), // Pink Star
    new THREE.Color(0x4DFFDF), // Aqua World
    new THREE.Color(0xFFD166), // Golden Sun
    new THREE.Color(0xB967FF), // Deep Space Violet
    new THREE.Color(0x6BFFB8), // Alien Green
    new THREE.Color(0xFF8E6B)  // Cosmic Coral
  ];
  
  universeBalls = new THREE.Group();
  ballPositions = [];
  ballSizes = [];
  ballOrbitData = [];
  
  // Create 200 orbs with cosmic distribution
  for (let i = 0; i < ballCount; i++) {
    // PERFECT SPHERICAL PLANETS with smooth 16-segment geometry
    const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
    
    // Random cosmic color
    const color = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
    
    // INTERNAL ILLUMINATION material
    const ballMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8, // PULSATING OPACITY base
      blending: THREE.AdditiveBlending // MAGICAL GLOW
    });
    
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // Different orbital patterns for natural distribution
    const orbitType = Math.floor(Math.random() * 4);
    let x, y, z;
    
    switch(orbitType) {
      case 0: // Close orbit near ocean
        const radius1 = 3 + Math.random() * 12;
        const angle1 = Math.random() * Math.PI * 2;
        x = Math.cos(angle1) * radius1;
        y = 1 + Math.random() * 3;
        z = Math.sin(angle1) * radius1;
        break;
        
      case 1: // Medium orbital ring
        const radius2 = 8 + Math.random() * 15;
        const angle2 = Math.random() * Math.PI * 2;
        x = Math.cos(angle2) * radius2;
        y = 2 + Math.random() * 5;
        z = Math.sin(angle2) * radius2;
        break;
        
      case 2: // High scattered
        x = (Math.random() - 0.5) * 25;
        y = 4 + Math.random() * 8;
        z = (Math.random() - 0.5) * 25;
        break;
        
      case 3: // Spiral formation
        const spiralRadius = 5 + Math.random() * 10;
        const spiralAngle = Math.random() * Math.PI * 4;
        const spiralHeight = (Math.random() - 0.5) * 8;
        x = Math.cos(spiralAngle) * spiralRadius;
        y = 3 + spiralHeight;
        z = Math.sin(spiralAngle) * spiralRadius;
        break;
    }
    
    ball.position.set(x, y, z);
    
    // SIZE VARIATION: 0.1-0.4 scale units
    const size = 0.1 + Math.random() * 0.3;
    ball.scale.setScalar(size);
    
    universeBalls.add(ball);
    ballPositions.push({x, y, z});
    ballSizes.push(size);
    
    // ORBITAL DATA for planetary motion
    ballOrbitData.push({
      orbitSpeed: 0.1 + Math.random() * 0.4, // GENTLE ORBITAL MOTION
      orbitRadius: 0.5 + Math.random() * 2,
      timeOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 2.0, // BREATHING PULSE
      rotationSpeed: (Math.random() - 0.5) * 0.02, // SLOW ROTATION
      verticalFloat: Math.random() * 0.5
    });
  }
  
  scene.add(universeBalls);
}

// UNIVERSE BALLS ANIMATION - Cosmic Motion
function animateUniverseBalls(time) {
  if (!universeBalls) return;
  
  universeBalls.children.forEach((ball, index) => {
    const orbit = ballOrbitData[index];
    const originalPos = ballPositions[index];
    
    // GENTLE ORBITAL MOTION around central points
    const orbitX = Math.cos(time * orbit.orbitSpeed + orbit.timeOffset) * orbit.orbitRadius;
    const orbitZ = Math.sin(time * orbit.orbitSpeed + orbit.timeOffset) * orbit.orbitRadius;
    
    // Vertical floating motion
    const floatY = Math.sin(time * 0.3 + orbit.timeOffset) * orbit.verticalFloat;
    
    // Update position with orbital motion
    ball.position.x = originalPos.x + orbitX * 0.1;
    ball.position.y = originalPos.y + floatY;
    ball.position.z = originalPos.z + orbitZ * 0.1;
    
    // PULSATING OPACITY (0.7-1.0 range) creating breathing effect
    const pulse = Math.sin(time * orbit.pulseSpeed) * 0.15 + 0.85;
    ball.material.opacity = 0.7 + pulse * 0.3;
    
    // SLOW ROTATION on multiple axes
    ball.rotation.y += orbit.rotationSpeed;
    ball.rotation.x += orbit.rotationSpeed * 0.7;
    
    // Gentle scale pulsing with breath
    ball.scale.setScalar(ballSizes[index] * (0.9 + pulse * 0.1));
  });
}

// Emotion state system
let currentEmotion = 'calm';
let emotionTimer = null;

function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    
    // Smooth color transition for ocean
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
    
    // EMOTIONAL AURA SYSTEM - Update lighting
    Object.keys(emotionalLights).forEach(key => {
      emotionalLights[key].intensity = key === emotion ? 1.0 : 0.3;
    });
    
    // Play emotion sound
    playEmotionSound(emotion);
    
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
  
  // Audio start button
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
  
  // Instructions
  const focusHelper = document.createElement('div');
  focusHelper.innerHTML = '<p style="color: white; margin: 5px; font-size: 12px; opacity: 0.8;">🎮 Click anywhere, then use WASD/Arrows for 360° camera<br>🌌 200 cosmic orbs orbit in emotional harmony</p>';
  focusHelper.style.cursor = 'pointer';
  focusHelper.onclick = () => window.focus();
  container.appendChild(focusHelper);
  
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

  renderer.domElement.addEventListener('touchstart', () => {
    window.focus();
  });
}

function handleKeyboardInput() {
  const rotationSpeed = 0.08;
  
  // 360° FREEDOM OF MOVEMENT
  if (keys['arrowup'] || keys['w']) targetRotation.x -= rotationSpeed;
  if (keys['arrowdown'] || keys['s']) targetRotation.x += rotationSpeed;
  if (keys['arrowleft'] || keys['a']) targetRotation.y -= rotationSpeed;
  if (keys['arrowright'] || keys['d']) targetRotation.y += rotationSpeed;
  
  // Reset camera with Spacebar
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

// Animation loop with BREATHING PULSE
let pulseTime = 0;
let globalBreathTime = 0;
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  const delta = clock.getDelta();
  globalBreathTime += delta;
  
  // === CAMERA DRIFT MOTION - FLOATING CINEMATIC CAMERA ===
  const driftX = Math.sin(time * 0.2) * 0.02;
  const driftY = Math.cos(time * 0.15) * 0.02;
  
  // Handle keyboard input
  handleKeyboardInput();
  
  // "CURIOSITY LAG" smooth follow system
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
  
  // Apply 360° rotation with drift
  camera.rotation.x = currentRotation.y + driftY;
  camera.rotation.y = currentRotation.x + driftX;
  camera.rotation.z = 0;
  
  // Gentle vertical float (breathing motion)
  camera.position.y = Math.sin(time * 0.5) * 0.1 + 2;
  
  // === UNIVERSE BALLS ANIMATION ===
  animateUniverseBalls(time);
  
  // === OCEAN WAVES - EMOTION-RESPONSIVE ===
  const oceanPositions = planeGeometry.attributes.position.array;
  
  // EMOTION-RESPONSIVE WAVE HEIGHT (0.2-0.8 intensity)
  let waveIntensity = 0.3;
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
  
  // MULTI-FREQUENCY WAVE PATTERNS
  for (let i = 0; i < oceanPositions.length; i += 3) {
    const x = oceanPositions[i];
    const z = oceanPositions[i + 2];
    
    const wave1 = Math.sin(x * 0.3 + time * waveSpeed) * waveIntensity;
    const wave2 = Math.sin(z * 0.2 + time * 1.5 * waveSpeed) * (waveIntensity * 0.7);
    const wave3 = Math.sin(x * 0.1 + z * 0.1 + time * 0.5 * waveSpeed) * (waveIntensity * 0.3);
    
    oceanPositions[i + 1] = originalY[i / 3] + wave1 + wave2 + wave3;
  }
  
  planeGeometry.attributes.position.needsUpdate = true;
  
  // GLOBAL BREATHING PULSE (3-second cycle)
  pulseTime += delta;
  if (pulseTime >= 3) {
    // Subtle scene-wide pulse
    directionalLight.intensity = 1.5;
    setTimeout(() => {
      directionalLight.intensity = 1.0;
    }, 300);
    pulseTime = 0;
  }
  
  renderer.render(scene, camera);
}

// Initialize everything
createStarfield(); // Add starfield nebula backdrop
createUniverseBalls(); // Create 200 cosmic orbs
createEmotionButtons();
setupKeyboardControls();
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Auto-trigger wonder after 3 seconds
setTimeout(() => {
  setEmotion('wonder');
}, 3000);
