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

// TEST: Add a basic object to ensure the scene is working.
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x00CED1), // Soft Cyan Glow
    metalness: 0.7,
    roughness: 0.2
});
const testCube = new THREE.Mesh(geometry, material);
scene.add(testCube);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Basic rotation for our test cube
    testCube.rotation.x += 0.01;
    testCube.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
