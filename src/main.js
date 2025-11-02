import * as THREE from 'three';
import './style.css';

// Simple setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// Load YOUR images directly
const textureLoader = new THREE.TextureLoader();

// Use your FIRST image as background
textureLoader.load('./Whisk_b4c97d76ca012368ec740649b13beb9bdr.jpeg', (texture) => {
  scene.background = texture;
  console.log('✅ Your background image loaded!');
});

// Use your SECOND image as ocean texture
const planeGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x1E7FCB,
  transparent: true,
  opacity: 0.9
});

textureLoader.load('./Whisk_0ca49e8aa43c869a93042f3c4bb837aadr.jpeg', (texture) => {
  planeMaterial.map = texture;
  planeMaterial.needsUpdate = true;
  console.log('✅ Your ocean image loaded!');
});

const ocean = new THREE.Mesh(planeGeometry, planeMaterial);
ocean.rotation.x = -Math.PI / 2;
scene.add(ocean);

// Use your THIRD image for particles
const particles = new THREE.Group();

textureLoader.load('./Whisk_9cf0303d8ececc485ea4ea7436ad9d4fdr.jpeg', (texture) => {
  for (let i = 0; i < 30; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
    
    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(
      (Math.random() - 0.5) * 15,
      1 + Math.random() * 5,
      (Math.random() - 0.5) * 15
    );
    
    particles.add(ball);
  }
  scene.add(particles);
  console.log('✅ Your particle image loaded!');
});

// Simple camera
camera.position.set(0, 3, 10);

// Simple animation
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate particles
  particles.rotation.y += 0.01;
  
  // Move camera slightly
  camera.position.x = Math.sin(Date.now() * 0.001) * 2;
  
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('🚀 SIREN running with YOUR images!');
