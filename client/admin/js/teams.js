const teamForm = document.getElementById("teamForm");
const teamsContainer = document.getElementById("teamsContainer");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");


// Load Teams
async function loadTeams() {
  const response = await fetch("http://localhost:5000/api/team/all");
  const teams = await response.json();

  teamsContainer.innerHTML = "";

  teams.forEach(team => {
    teamsContainer.innerHTML += `
      <div class="team-card">
        <h3>Team : ${team.teamName}</h3>
        <p><strong>College:</strong> ${team.collegeName}</p>
        <p><strong>Leader:</strong> ${team.teamLeader}</p>
        <p><strong>Email:</strong> ${team.email}</p>
        

        <button
          class="delete-btn"
          onclick="deleteTeam('${team._id}')"
        >
          Delete Team
        </button>
      </div>
    `;
  });
}


// Add Team
teamForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTeam = {
    teamName: document.getElementById("teamName").value,
    collegeName: document.getElementById("collegeName").value,
    teamLeader: document.getElementById("teamLeader").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const response = await fetch("http://localhost:5000/api/team/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newTeam)
  });

  const data = await response.json();

  message.innerText = data.message;

  if (response.ok) {
    teamForm.reset();
    loadTeams();
  }
});


// Delete Team
async function deleteTeam(id) {
  await fetch(`http://localhost:5000/api/team/delete/${id}`, {
    method: "DELETE"
  });

  loadTeams();
}


// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});


loadTeams();