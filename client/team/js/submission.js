const submissionForm = document.getElementById("submissionForm");
const message = document.getElementById("message");

const logoutBtn = document.getElementById("logoutBtn");
document.getElementById("teamName").value =
  localStorage.getItem("teamName");

// Submit Design
submissionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

formData.append("teamName", document.getElementById("teamName").value);
  formData.append("roundNumber", document.getElementById("roundNumber").value);
  formData.append("figmaLink", document.getElementById("figmaLink").value);
  formData.append("canvaLink", document.getElementById("canvaLink").value);
  formData.append("notes", document.getElementById("notes").value);

  const pdfFile = document.getElementById("pdfFile").files[0];

  if (pdfFile) {
    formData.append("pdfFile", pdfFile);
  }

  const response = await fetch("https://api-design-o-thon.onrender.com/api/submission/add", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  message.innerText = data.message;

  if (response.ok) {
    submissionForm.reset();
  }
});


// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("teamToken");
  window.location.href = "login.html";
});

// ANIMATION 

const submissionBtn = document.querySelector('#submissionForm button');

submissionBtn.addEventListener('click', (e) => {
    // Optional: Prevent immediate form submission to see the animation
    // e.preventDefault(); 

    createParticles(e.clientX, e.clientY);
});

function createParticles(x, y) {
    const particleCount = 20; // Number of "pixels" in the burst

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomly choose between green and cyan for the "dual-glow" look
        const isCyan = Math.random() > 0.5;
        if (isCyan) {
            particle.style.background = '#95ff00';
            particle.style.boxShadow = '0 0 10px #ff8400';
        }

        document.body.appendChild(particle);

        // Position particle at click coordinates
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Generate random trajectory
        const destinationX = (Math.random() - 0.5) * 300; // Spread width
        const destinationY = (Math.random() - 0.5) * 300; // Spread height
        
        particle.style.setProperty('--dx', `${destinationX}px`);
        particle.style.setProperty('--dy', `${destinationY}px`);

        // Randomize duration for a more organic feel
        const duration = Math.random() * 0.5 + 0.5;
        particle.style.animation = `particleFade ${duration}s ease-out forwards`;

        // Clean up DOM after animation finishes
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
}

// TILT EFFECT 
document.addEventListener('mousemove', (e) => {
    const formCard = document.querySelector('.submission-form-section');
    if (!formCard) return;

    // Get dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate mouse position relative to center (-0.5 to 0.5)
    const moveX = (e.clientX - width / 2) / (width / 2);
    const moveY = (e.clientY - height / 2) / (height / 2);

    // Max rotation in degrees
    const rotateX = moveY * -10; // Tilting up/down
    const rotateY = moveX * 10;  // Tilting left/right

    // FORCE the transform: 
    // We add !important via setProperty to override the 'forwards' animation state
    formCard.style.setProperty(
        'transform', 
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, 
        'important'
    );
});

// Reset when mouse leaves
document.addEventListener('mouseleave', () => {
    const formCard = document.querySelector('.submission-form-section');
    if (formCard) {
        formCard.style.setProperty(
            'transform', 
            `rotateX(0deg) rotateY(0deg)`, 
            'important'
        );
        formCard.style.transition = "transform 0.6s ease";
    }
});

// CURSOR TRACKER 
document.addEventListener('mousemove', (e) => {
    // --- 1. CURSOR TRACKER LOGIC ---
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        // Offset by 300px to center the 600px circle on the cursor
        const glowX = e.clientX - 300;
        const glowY = e.clientY - 300;
        glow.style.setProperty('--x', `${glowX}px`);
        glow.style.setProperty('--y', `${glowY}px`);
    }

    // --- 2. 3D TILT LOGIC ---
    const formCard = document.querySelector('.submission-form-section');
    if (formCard) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Calculate normalized position (-0.5 to 0.5)
        const moveX = (e.clientX - width / 2) / (width / 2);
        const moveY = (e.clientY - height / 2) / (height / 2);

        // Max rotation intensity
        const rotateX = moveY * -8; // Tilted slightly less for better usability
        const rotateY = moveX * 8;

        // Use setProperty with !important to override the CSS animation lock
        formCard.style.setProperty(
            'transform', 
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, 
            'important'
        );
    }
});

// Reset tilt when mouse leaves window
document.addEventListener('mouseleave', () => {
    const formCard = document.querySelector('.submission-form-section');
    if (formCard) {
        formCard.style.setProperty('transform', 'rotateX(0deg) rotateY(0deg)', 'important');
        formCard.style.transition = "transform 0.6s ease";
    }
});