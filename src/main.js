import * as THREE from 'three';
import './style.css';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('app').appendChild(renderer.domElement);

// Initial Camera Position
camera.position.z = 5;

// Basic Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 0.5); // Iridescent Violet light
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create the base Ocean Plane
const planeGeometry = new THREE.PlaneGeometry(20, 20, 50, 50); // Large plane with many segments for waves
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x0a5c8a), // Deep Ocean color from our palette
    metalness: 0.8,
    roughness: 0.1
});
const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
scene.add(oceanPlane);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
