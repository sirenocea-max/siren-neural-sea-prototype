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

// Better Camera Position - closer to the ocean
camera.position.set(0, 3, 8);
camera.lookAt(0, 0, 0);

// Better Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x8A2BE2, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Add a point light for sparkle effect
const pointLight = new THREE.PointLight(0x00CED1, 1, 100);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Create the Ocean Plane - SOLID SURFACE
const planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(0x0a5c8a), // Deep Ocean Blue
    metalness: 0.9,
    roughness: 0.1,
    wireframe: false // SOLID SURFACE
});

const oceanPlane = new THREE.Mesh(planeGeometry, planeMaterial);
oceanPlane.rotation.x = -Math.PI / 2;
scene.add(oceanPlane);

// Store the original vertex positions for wave calculations
const positions = planeGeometry.attributes.position.array;
const originalY = [];
for (let i = 0; i < positions.length; i += 3) {
    originalY.push(positions[i + 1]);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    const positions = planeGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        
        const wave1 = Math.sin(x * 0.3 + time) * 0.3;
        const wave2 = Math.sin(z * 0.2 + time * 1.5) * 0.2;
        const wave3 = Math.sin(x * 0.1 + z * 0.1 + time * 0.5) * 0.1;
        
        positions[i + 1] = originalY[i / 3] + wave1 + wave2 + wave3;
    }
    
    planeGeometry.attributes.position.needsUpdate = true;
    
    // Make the point light move gently
    pointLight.position.x = Math.sin(time * 0.5) * 3;
    pointLight.position.z = Math.cos(time * 0.3) * 3;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
