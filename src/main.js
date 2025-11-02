import * as THREE from 'three';
import './style.css';

console.log('🚀 Starting SIREN with YOUR design images...');

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('app').appendChild(renderer.domElement);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// ========== 🎨 YOUR DESIGN IMAGES ==========
let designTextures = {
  ocean: null,
  particles: null, 
  background: null
};

// Load all your design images
function loadDesignTextures() {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalTextures = 3;

    function onLoad() {
      loadedCount++;
      console.log(`✅ Image ${loadedCount}/${totalTextures} loaded`);
      if (loadedCount === totalTextures) {
        console.log('🎉 All YOUR design images loaded successfully!');
        resolve();
      }
    }

    // Load Ocean Image
    textureLoader.load(
      './Whisk_0ca49e8aa43c869a93042f3c4bb837aadr.jpeg',
      (texture) => {
        designTextures.ocean = texture;
        designTextures.ocean.wrapS = THREE.RepeatWrapping;
        designTextures.ocean.wrapT = THREE.RepeatWrapping;
        designTextures.ocean.repeat.set(1.5, 1.5);
        onLoad();
      },
      undefined,
      (error) => {
        console.error('❌ Ocean image failed:', error);
        onLoad();
      }
    );

    // Load Particles Image
    textureLoader.load(
      './Whisk_9cf0303d8ececc485ea4ea7436ad9d4fdr.jpeg',
      (texture) => {
        designTextures.particles = texture;
        onLoad();
      },
      undefined,
      (error) => {
        console.error('❌ Particles image failed:', error);
        onLoad();
      }
    );

    // Load Background Image
    textureLoader.load(
      './Whisk_b4c97d76ca012368ec740649b13beb9bdr.jpeg',
      (texture) => {
        designTextures.background = texture;
        scene.background = designTextures.background;
        onLoad();
      },
      undefined,
      (error) => {
        console.error('❌ Background image failed:', error);
        onLoad();
      }
    );
  });
}

// Camera setup
camera.position.set(0, 3, 12);

// Lighting - Enhanced for your design
const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 1.2);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Emotional Color System
const emotionColors = {
  calm: new THREE.Color(0x1E7FCB),
  wonder: new THREE.Color(0x9A6BFF),
  comfort: new THREE.Color(0xF7D774),
  anxiety: new THREE.Color(0xFF4F5E),
  connection: new THREE.Color(0x6EE7E0)
};

// Create Ocean with YOUR Design
const planeGeometry = new THREE.PlaneGeometry(40, 40, 128, 128);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: emotionColors.calm,
  metalness: 0.9,
  roughness: 0.1,
  transparent: true,
  opacity: 0.95
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
oceanPlane.position.y = -0.5;
scene.add(oceanPlane);

// Apply ocean texture when loaded
loadDesignTextures().then(() => {
  if (designTextures.ocean) {
    planeMaterial.map = designTextures.ocean;
    planeMaterial.needsUpdate = true;
    console.log('🌊 Your ocean design applied!');
  }
});

// Store wave data
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
  originalY.push(positions[i + 1]);
}

// Particle System with YOUR Design
let universeBalls = new THREE.Group();
const ballCount = 80;

function createUniverseBalls() {
  universeBalls = new THREE.Group();
  
  const cosmicColors = [
    new THREE.Color(0x9A6BFF), // Purple
    new THREE.Color(0x6EE7E0), // Cyan
    new THREE.Color(0xFF6B9D), // Pink
    new THREE.Color(0x4DFFDF), // Aqua
    new THREE.Color(0xFFD166), // Gold
    new THREE.Color(0x1E7FCB), // Blue
  ];

  for (let i = 0; i < ballCount; i++) {
    const ballGeometry = new THREE.SphereGeometry(1, 16, 16);
    const color = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
    
    const ballMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    // Apply your particle design when available
    if (designTextures.particles) {
      ballMaterial.map = designTextures.particles;
    }

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);

    // Strategic placement
    const angle = (i / ballCount) * Math.PI * 2;
    const radius = 5 + Math.random() * 15;
    const height = 2 + Math.random() * 6;
    
    const x = Math.cos(angle) * radius;
    const y = height;
    const z = Math.sin(angle) * radius;

    ball.position.set(x, y, z);

    // Size variation
    const size = 0.15 + Math.random() * 0.4;
    ball.scale.setScalar(size);

    // Animation data
    ball.userData = {
      originalPos: { x, y, z },
      floatSpeed: 0.3 + Math.random() * 0.7,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      pulseSpeed: 0.8 + Math.random() * 1.5,
      timeOffset: Math.random() * Math.PI * 2,
      orbitRadius: 0.8 + Math.random() * 2
    };

    universeBalls.add(ball);
  }

  scene.add(universeBalls);
  console.log('✨ Particles created with YOUR design!');
}

// Enhanced Animation
function animateUniverseBalls(time) {
  if (!universeBalls) return;
  
  universeBalls.children.forEach((ball, index) => {
    const data = ball.userData;
    
    // Orbital motion
    const orbitX = Math.cos(time * data.floatSpeed + data.timeOffset) * data.orbitRadius;
    const orbitZ = Math.sin(time * data.floatSpeed + data.timeOffset) * data.orbitRadius;
    
    // Floating
    const floatY = Math.sin(time * 0.5 + data.timeOffset) * 0.4;
    
    // Update position
    ball.position.x = data.originalPos.x + orbitX * 0.1;
    ball.position.y = data.originalPos.y + floatY;
    ball.position.z = data.originalPos.z + orbitZ * 0.1;
    
    // Rotation
    ball.rotation.y += data.rotationSpeed;
    ball.rotation.x += data.rotationSpeed * 0.3;
    
    // Pulsing glow
    const pulse = Math.sin(time * data.pulseSpeed + index * 0.1) * 0.2 + 0.8;
    ball.material.opacity = 0.7 + pulse * 0.3;
    
    // Gentle scale breathing
    ball.scale.setScalar((0.15 + Math.random() * 0.4) * (0.95 + pulse * 0.1));
  });
}

// Emotion System
let currentEmotion = 'calm';
let emotionTimer = null;

function setEmotion(emotion) {
  if (emotionColors[emotion]) {
    currentEmotion = emotion;
    
    // Smooth transition
    const targetColor = emotionColors[emotion];
    const startColor = planeMaterial.color.clone();
    const duration = 1800;
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
    
    // Auto return to calm
    if (emotionTimer) clearTimeout(emotionTimer);
    emotionTimer = setTimeout(() => setEmotion('calm'), 12000);
  }
}

// UI Controls
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
  container.style.top = '20px';
  container.style.left = '20px';
  container.style.zIndex = '100';
  container.style.background = 'rgba(5, 10, 20, 0.9)';
  container.style.padding = '15px';
  container.style.borderRadius = '10px';
  container.style.border = '1px solid rgba(30, 127, 203, 0.5)';
  container.style.backdropFilter = 'blur(10px)';
  
  emotions.forEach(emotion => {
    const button = document.createElement('button');
    button.textContent = emotion.name;
    button.style.margin = '5px';
    button.style.padding = '10px 16px';
    button.style.backgroundColor = getColorHex(emotion.key);
    button.style.color = emotion.key === 'comfort' ? 'black' : 'white';
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.transition = 'all 0.3s ease';
    
    button.onmouseenter = () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    };
    
    button.onmouseleave = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    };
    
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

// Camera Controls
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
  const rotationSpeed = 0.04;
  
  if (keys['w'] || keys['arrowup']) targetRotation.x -= rotationSpeed;
  if (keys['s'] || keys['arrowdown']) targetRotation.x += rotationSpeed;
  if (keys['a'] || keys['arrowleft']) targetRotation.y -= rotationSpeed;
  if (keys['d'] || keys['arrowright']) targetRotation.y += rotationSpeed;
  if (keys[' ']) { 
    targetRotation.x = 0; 
    targetRotation.y = 0; 
  }
}

// Main Animation Loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  handleKeyboardInput();
  
  // Smooth camera
  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.03;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.03;
  
  camera.rotation.x = currentRotation.y;
  camera.rotation.y = currentRotation.x;
  
  // Camera floating
  camera.position.y = Math.sin(time * 0.3) * 0.15 + 3;
  
  // Animate particles
  animateUniverseBalls(time);
  
  // Ocean waves
  const oceanPositions = planeGeometry.attributes.position.array;
  let waveIntensity = 0.4;
  let waveSpeed = 1.0;
  
  switch(currentEmotion) {
    case 'wonder': waveIntensity = 0.6; waveSpeed = 0.8; break;
    case 'comfort': waveIntensity = 0.2; waveSpeed = 0.6; break;
    case 'anxiety': waveIntensity = 0.8; waveSpeed = 2.0; break;
    case 'connection': waveIntensity = 0.5; waveSpeed = 1.3; break;
  }
  
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

// Initialize Everything
createUniverseBalls();
createEmotionButtons();
setupKeyboardControls();
animate();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Auto emotion
setTimeout(() => setEmotion('wonder'), 2000);

console.log('🌟 SIREN ready with YOUR design!');
