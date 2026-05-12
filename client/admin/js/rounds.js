const roundForm = document.getElementById("roundForm");
const roundsContainer = document.getElementById("roundsContainer");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");


// Countdown Function
function getTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);

  const diff = end - now;

  if (diff <= 0) {
    return "Deadline Closed";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (diff % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  return `${days} Days ${hours} Hours ${minutes} Minutes Left`;
}


// Load Rounds
async function loadRounds() {
  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/round/all");
  const rounds = await response.json();

  roundsContainer.innerHTML = "";

  rounds.forEach(round => {
    const countdown = getTimeLeft(round.deadline);

    roundsContainer.innerHTML += `
      <div class="round-card">
        <h3>Round ${round.roundNumber}</h3>

        <p><strong>Title:</strong> ${round.title}</p>

        <p><strong>Deadline:</strong>
          ${new Date(round.deadline).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          })}
        </p>

        <p><strong>Status:</strong> ${round.status}</p>

        <p>
          <strong>Countdown:</strong>
          ${countdown}
        </p>

        <button
          class="delete-btn"
          onclick="deleteRound('${round._id}')"
        >
          Delete Round
        </button>
      </div>
    `;
  });
}


// Add Round
roundForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newRound = {
    roundNumber: document.getElementById("roundNumber").value,
    title: document.getElementById("title").value,
    deadline: document.getElementById("deadline").value,
    status: document.getElementById("status").value
  };

  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/round/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newRound)
  });

  const data = await response.json();
  message.innerText = data.message;

  if (response.ok) {
    roundForm.reset();
    loadRounds();
  }
});


// Delete Round
async function deleteRound(id) {
  await fetch(`http://https://api-design-o-thon.onrender.com/api/round/delete/${id}`, {
    method: "DELETE"
  });

  loadRounds();
}


// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});

// Auto-refresh countdown every 1 minute
setInterval(loadRounds, 60000);

loadRounds();