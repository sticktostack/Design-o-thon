const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://api-design-o-thon.onrender.com/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("adminToken", data.token);

      message.style.color = "lightgreen";
      message.innerText = "Login Successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);

    } else {
      message.innerText = data.message;
    }

  } catch (error) {
    message.innerText = "Server Error";
  }
});


const glow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
    // We subtract 200 (half the width/height of the glow) 
    // to ensure the center of the circle is under the cursor
    const x = e.clientX - 200;
    const y = e.clientY - 200;
    
    glow.style.setProperty('--x', `${x}px`);
    glow.style.setProperty('--y', `${y}px`);
});

const btn = document.querySelector('button');
btn.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
  btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
});

btn.addEventListener('mouseleave', () => {
  btn.style.transform = `translate(0, 0) scale(1)`;
});


window.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 50;
  const y = (window.innerHeight / 2 - e.clientY) / 50;

  document.querySelector('.left-info').style.transform = `translate(${x * 2}px, ${y * 2}px)`;
  document.querySelector('.login-pod').style.transform = `translate(${-x * 2.5}px, ${-y * 2.5}px)`;
});

window.addEventListener('DOMContentLoaded', () => {
    const pod = document.querySelector('.login-pod');
    const items = [
        pod.querySelector('h2'),
        pod.querySelector('p'),
        document.getElementById('email'),
        document.getElementById('password'),
        pod.querySelector('button')
    ];

    // Wait for the main pod to start its animation
    setTimeout(() => {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('reveal-item');
            }, index * 150); // Each item arrives 150ms after the previous one
        });
    }, 400); // Start assembling contents after the pod begins to appear
});