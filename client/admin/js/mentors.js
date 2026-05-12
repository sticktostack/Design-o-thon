const mentorForm = document.getElementById("mentorForm");
const mentorsContainer = document.getElementById("mentorsContainer");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let allTeams = [];


// Load Teams
async function loadTeams() {
  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/team/all");
  allTeams = await response.json();
}


// Load Mentors
async function loadMentors() {
  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/mentor/all");
  const mentors = await response.json();

  mentorsContainer.innerHTML = "";

  mentors.forEach(mentor => {
    let teamOptions = "";
    let assignedTeamsHTML = "";

    allTeams.forEach(team => {
      teamOptions += `
        <option value="${team._id}">
          ${team.teamName}
        </option>
      `;
    });

    if (mentor.assignedTeams.length > 0) {
      mentor.assignedTeams.forEach(team => {
        assignedTeamsHTML += `
          <p class="assigned-team">
            → ${team.teamName}
          </p>
        `;
      });
    } else {
      assignedTeamsHTML = `
        <p class="assigned-team">
          No teams assigned yet
        </p>
      `;
    }

    mentorsContainer.innerHTML += `
      <div class="mentor-card">
        <h3>${mentor.name}</h3>
        <p><strong>Email:</strong> ${mentor.email}</p>
        <p><strong>Expertise:</strong> ${mentor.expertise}</p>

        <div class="assigned-section">
          <h4>Assigned Teams</h4>
          ${assignedTeamsHTML}
        </div>

        <div class="assign-box">
          <select id="team-${mentor._id}">
            <option value="">Select Team</option>
            ${teamOptions}
          </select>

          <button onclick="assignTeam('${mentor._id}')">
            Assign Team
          </button>
        </div>

        <button
          class="delete-btn"
          onclick="deleteMentor('${mentor._id}')"
        >
          Delete Mentor
        </button>
      </div>
    `;
  });
}


// Add Mentor
mentorForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newMentor = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    expertise: document.getElementById("expertise").value,
    password: document.getElementById("password").value
  };

  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/mentor/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newMentor)
  });

  const data = await response.json();
  message.innerText = data.message;

  if (response.ok) {
    mentorForm.reset();
    loadMentors();
  }
});


// Assign Mentor
async function assignTeam(mentorId) {
  const teamId = document.getElementById(`team-${mentorId}`).value;

  if (!teamId) {
    alert("Please select a team");
    return;
  }

  const response = await fetch("http://https://api-design-o-thon.onrender.com/api/mentor/assign-team", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mentorId,
      teamId
    })
  });

  const data = await response.json();
  alert(data.message);
}


// Delete Mentor
async function deleteMentor(id) {
  await fetch(`http://https://api-design-o-thon.onrender.com/api/mentor/delete/${id}`, {
    method: "DELETE"
  });

  loadMentors();
}


// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});


async function init() {
  await loadTeams();
  await loadMentors();
}

init();