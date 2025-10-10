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

// Create the base Ocean Plane with vertex manipulation
const planeGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x0a5c8a),
    metalness: 0.8,
    roughness: 0.1,
    wireframe: true // Temporary: helps us see the waves clearly
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Store the original vertex positions for wave calculations
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
    originalY.push(positions[i + 1]); // Store original y positions
function animate() {
    requestAnimationFrame(animate);
    
    // Basic breathing wave animation
    const time = Date.now() * 0.001; // Convert to seconds
    const positions = planeGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        // Simple wave formula from our technical spec
        const wave1 = Math.sin(x * 0.5 + time) * 0.1;
        const wave2 = Math.sin(z * 0.2 + time * 1.3) * 0.05;
        
        // Apply wave to Y position
        positions[i + 1] = originalY[i / 3] + wave1 + wave2;
    }
    
    planeGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
