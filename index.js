function displayLastUpdated() {
    var date = new Date(document.lastModified);
    document.getElementById("lastUpdated").textContent = date.toLocaleDateString();
}


const airplane = document.querySelector('.paper-airplane');
let t = 0;
const dt = 0.01;

function animate() {
  t -= dt;
  
  const centerX = window.innerWidth/2;
  const centerY = window.innerHeight / 16;
  const radius = Math.min(window.innerWidth, window.innerHeight)/1.5 ;
  
  // Figure-eight path (Lissajous-type)
  const x = centerX + radius * Math.sin(t);
  const y = centerY + (radius / 2) * Math.sin(2 * t);
  
  // Compute tangent for rotation (direction of travel)
  const dx = radius * Math.cos(t);
  const dy = radius * Math.cos(2 * t);
  const angle = Math.atan2(dy, dx);
  
  // 3D tilt and scaling for perspective effect
  const maxTilt = Math.PI/2; 
  const tilt = maxTilt * Math.sin(t);
  const scale = 1 + 0.1* Math.sin(2 * t);
  
  airplane.style.transform =
    `translate(-50%, -50%) translate(${x}px, ${y}px) ` +
    `rotate(${angle}rad) rotateX(${tilt}rad) scale(${scale})`;
    
  requestAnimationFrame(animate);
}

animate();
