const socket = io("https://api-design-o-thon.onrender.com");

const judgeForm = document.getElementById("judgeForm");
const judgesContainer = document.getElementById("judgesContainer");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let allTeams = [];

/*
==================================================
LOAD ALL TEAMS
==================================================
*/
async function loadTeams() {
  try {
    const response = await fetch(
      "https://api-design-o-thon.onrender.com/api/team/all"
    );

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    allTeams = data || [];

  } catch (error) {
    console.log("Load Teams Error:", error);
  }
}


/*
==================================================
LOAD ALL JUDGES + ASSIGNMENTS
==================================================
*/
async function loadJudges() {
  try {
    const judgeResponse = await fetch(
      "https://api-design-o-thon.onrender.com/api/judge/all"
    );

    const judges = await judgeResponse.json();

    const assignmentResponse = await fetch(
      "https://api-design-o-thon.onrender.com/api/judge-assignment/all"
    );

    const assignments = await assignmentResponse.json();

    judgesContainer.innerHTML = "";

    if (!judges.length) {
      judgesContainer.innerHTML = `
        <div class="judge-card">
          <h3>No Judges Found</h3>
          <p>Please add judges first.</p>
        </div>
      `;
      return;
    }

    judges.forEach((judge) => {
      let teamOptions = "";
      let assignedTeamsHTML = "";

      /*
      ==========================================
      TEAM DROPDOWN
      IMPORTANT:
      value must be TEAM ID
      not teamName
      ==========================================
      */
      allTeams.forEach((team) => {
        teamOptions += `
          <option value="${team._id}">
            ${team.teamName}
          </option>
        `;
      });

      /*
      ==========================================
      FILTER ASSIGNMENTS FOR CURRENT JUDGE
      ==========================================
      */
      const judgeAssignments = assignments.filter(
        (item) =>
          item.judge &&
          item.judge._id === judge._id
      );

      /*
      ==========================================
      ASSIGNED TEAMS HTML
      ==========================================
      */
      if (judgeAssignments.length > 0) {
        judgeAssignments.forEach((item) => {
          assignedTeamsHTML += `
            <div class="assigned-team">

              <p>
                → <strong>${item.team?.teamName || "-"}</strong>
              </p>

              <p>
                Round ${item.roundNumber || "-"}
              </p>

              <button
                class="remove-small-btn"
                onclick="deleteAssignment('${item._id}')"
              >
                Remove
              </button>

            </div>
          `;
        });
      } else {
        assignedTeamsHTML = `
          <p class="assigned-team">
            No teams assigned yet
          </p>
        `;
      }

      /*
      ==========================================
      JUDGE CARD UI
      ==========================================
      */
      judgesContainer.innerHTML += `
        <div class="judge-card">

          <h3>${judge.name}</h3>

          <p>
            <strong>Email:</strong>
            ${judge.email}
          </p>

          <p>
            <strong>Expertise:</strong>
            ${judge.expertise}
          </p>

          <div class="assigned-section">
            <h4>Assigned Teams (Round-wise)</h4>
            ${assignedTeamsHTML}
          </div>

          <div class="assign-box">

            <select id="team-${judge._id}">
              <option value="">
                Select Team
              </option>
              ${teamOptions}
            </select>

            <input
              type="number"
              id="round-${judge._id}"
              placeholder="Round Number"
              min="1"
            >

            <button
              onclick="assignTeam('${judge._id}')"
            >
              Assign Team
            </button>

          </div>

          <button
            class="delete-btn"
            onclick="deleteJudge('${judge._id}')"
          >
            Delete Judge
          </button>

        </div>
      `;
    });

  } catch (error) {
    console.log("Load Judges Error:", error);

    judgesContainer.innerHTML = `
      <div class="judge-card">
        <h3>Error</h3>
        <p>Failed to load judges</p>
      </div>
    `;
  }
}


/*
==================================================
ADD NEW JUDGE
==================================================
*/
if (judgeForm) {
  judgeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const newJudge = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        expertise: document.getElementById("expertise").value,
        password: document.getElementById("password").value
      };

      const response = await fetch(
        "https://api-design-o-thon.onrender.com/api/judge/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newJudge)
        }
      );

      const data = await response.json();

      message.innerText = data.message;

      if (response.ok) {
        judgeForm.reset();
        loadJudges();
      }

    } catch (error) {
      console.log("Add Judge Error:", error);
    }
  });
}


/*
==================================================
ASSIGN TEAM + ROUND
FINAL FIX:
Send judgeId + teamId + roundNumber
NOT judgeName + teamName
==================================================
*/
async function assignTeam(judgeId) {
  const teamId =
    document.getElementById(`team-${judgeId}`).value;

  const roundNumber =
    document.getElementById(`round-${judgeId}`).value;

  if (!teamId || !roundNumber) {
    alert("Please select team and round number");
    return;
  }

  try {
    const response = await fetch(
      "https://api-design-o-thon.onrender.com/api/judge-assignment/assign",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          judgeId,
          teamId,
          roundNumber: Number(roundNumber)
        })
      }
    );

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      loadJudges();
    }

  } catch (error) {
    console.log("Assign Error:", error);
    alert("Failed to assign judge");
  }
}


/*
==================================================
DELETE ASSIGNMENT
==================================================
*/
async function deleteAssignment(id) {
  const confirmDelete = confirm(
    "Remove this assignment?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://api-design-o-thon.onrender.com/api/judge-assignment/delete/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    alert(data.message);
    loadJudges();

  } catch (error) {
    console.log("Delete Assignment Error:", error);
  }
}


/*
==================================================
DELETE JUDGE
==================================================
*/
async function deleteJudge(id) {
  const confirmDelete = confirm(
    "Delete this judge?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(
      `https://api-design-o-thon.onrender.com/api/judge/delete/${id}`,
      {
        method: "DELETE"
      }
    );

    loadJudges();

  } catch (error) {
    console.log("Delete Judge Error:", error);
  }
}


/*
==================================================
LOGOUT
==================================================
*/
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
  });
}


/*
==================================================
INITIAL LOAD
==================================================
*/
async function init() {
  await loadTeams();
  await loadJudges();
}

init();


/*
==================================================
SOCKET AUTO REFRESH
==================================================
*/
socket.on("judgeUpdated", async () => {
  await loadJudges();
});