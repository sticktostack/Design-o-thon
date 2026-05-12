const tracker = document.querySelector('.cursor-tracker');
const judgeLoginForm = document.getElementById("judgeLoginForm");
const message = document.getElementById("message");

judgeLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const response = await fetch("https://api-design-o-thon.onrender.com/api/judge/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  });

  const data = await response.json();

  message.innerText = data.message;

  if (response.ok) {
    localStorage.setItem("judgeToken", data.token);
    localStorage.setItem("judgeName", data.judge.name);

    setTimeout(() => {
      window.location.href = "score.html";
    }, 1000);
  }
});


document.addEventListener('mousemove', (e) => {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    tracker.style.left = `${e.clientX}px`;
    tracker.style.top = `${e.clientY}px`;
  });
});

const card = document.querySelector('.login-box');
const container = document.querySelector('.login-page');

container.addEventListener('mousemove', (e) => {
    // Calculate rotation based on cursor position relative to center
    let xAxis = (window.innerWidth / 2 - e.pageX) / 20; 
    let yAxis = (window.innerHeight / 2 - e.pageY) / 20;
    
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
});

// Reset position when mouse leaves the area
container.addEventListener('mouseleave', () => {
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});