function displayLastUpdated() {
    var date = new Date(document.lastModified);
    document.getElementById("lastUpdated").textContent = date.toLocaleDateString();
}


const airplane = document.querySelector('.paper-airplane');
let t = 0;
const dt = 0.02;

function getAnchorRect() {
  const header = airplane?.closest('header');
  if (!header) {
    return { width: window.innerWidth, height: window.innerHeight, left: 0 };
  }
  const rect = header.getBoundingClientRect();
  // Width comes from viewport; left/height come from the header's actual position.
  return { width: window.innerWidth, height: rect.height, left: rect.left };
}

function animate() {
  if (!airplane) {
    return;
  }

  t -= dt;

  // Anchor to the page header so the airplane feels "attached".
  const { width, height, left } = getAnchorRect();
  // Convert viewport coordinates into the header's local coordinate system.
  const centerX = width / 2 - left;
  const centerY = height  * 1.8;
  const radius = Math.min(width, height) * 2.5;
  
  // Figure-eight path (Lissajous-type)
  const x = centerX + radius * Math.sin(t);
  const y = centerY + (radius / 2) * Math.sin(2 * t);
  
  // Compute tangent for rotation (direction of travel)
  const dx = radius * Math.cos(t)*20;
  const dy = radius * Math.cos(2 * t)*20;
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
