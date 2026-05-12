const teamsContainer = document.getElementById("teamsContainer");
const logoutBtn = document.getElementById("logoutBtn");

const judgeName = localStorage.getItem("judgeName");
document.querySelector(".judge").innerHTML = `welcome ${judgeName}`
/*
==================================================
GET ROUND LIMITS
==================================================
*/
function getRoundLimits(roundNumber) {
  if (roundNumber === 1 || roundNumber === 2) {
    return {
      total: 25,
      uxLogic: 8,
      uiAesthetics: 8,
      innovation: 5,
      feasibilityAccessibility: 2,
      presentation: 2,
    };
  }

  if (roundNumber === 3) {
    return {
      total: 50,
      uxLogic: 15,
      uiAesthetics: 15,
      innovation: 10,
      feasibilityAccessibility: 5,
      presentation: 5,
    };
  }

  return null;
}

/*
==================================================
LOAD ASSIGNED TEAMS
==================================================
*/
async function loadAssignedTeams() {
  try {
    if (!judgeName) {
      alert("Judge session expired. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch(
      `https://api-design-o-thon.onrender.com/api/judge/assigned-teams/${encodeURIComponent(judgeName)}`,
    );

    const data = await response.json();

    teamsContainer.innerHTML = "";

    if (!response.ok) {
      teamsContainer.innerHTML = `
        <div class="team-card">
          <h3>${data.message || "Failed to load assigned teams"}</h3>
        </div>
      `;
      return;
    }

    if (!data.length) {
      teamsContainer.innerHTML = `
        <div class="team-card">
          <h3>No Teams Assigned Yet</h3>
        </div>
      `;
      return;
    }

    data.forEach((item) => {
      const team = item.team;
      const assignedRound = Number(item.assignedRound) || 1;

      let limits;

      if (assignedRound === 1 || assignedRound === 2) {
        limits = {
          ux: 8,
          ui: 8,
          innovation: 5,
          feasibility: 2,
          presentation: 2,
        };
      } else {
        limits = {
          ux: 15,
          ui: 15,
          innovation: 10,
          feasibility: 5,
          presentation: 5,
        };
      }

      teamsContainer.innerHTML += `
        <div class="team-card">

          <h2>${team.teamName}</h2>

          <p><strong>College:</strong> ${team.collegeName || "-"}</p>

          <p><strong>Round:</strong> ${assignedRound}</p>

          ${
            item.submission
              ? `
              <div class="submission-box">
                <p><strong>Submission Available</strong></p>

                ${
                  item.submission.figmaLink
                    ? `<a href="${item.submission.figmaLink}" target="_blank">View Design</a>`
                    : ""
                }

                ${
                  item.submission.canvaLink
                    ? `<a href="${item.submission.canvaLink}" target="_blank">View Canva</a>`
                    : ""
                }

                ${
                  item.submission.pdfFile
                    ? `<a href="https://api-design-o-thon.onrender.com/${item.submission.pdfFile}" target="_blank">View PDF</a>`
                    : ""
                }
              </div>
            `
              : `<p style="color:red;">No submission yet</p>`
          }

          ${
            item.alreadyScored
              ? `
      <div class="submitted-badge">
        SCORE SUBMITTED
      </div>
    `
              : `
<form onsubmit="submitScore(event, '${team.teamName}', 'Round ${assignedRound}')">

  <input type="hidden" class="roundName" value="Round ${assignedRound}">

  <div class="criteria-box">
  <label>UX & Logic (/${limits.ux})</label>
  <input type="number" class="uxLogic" min="0" max="${limits.ux}" required>
</div>

<div class="criteria-box">
  <label>UI Aesthetics (/${limits.ui})</label>
  <input type="number" class="uiAesthetics" min="0" max="${limits.ui}" required>
</div>

<div class="criteria-box">
  <label>Innovation (/${limits.innovation})</label>
  <input type="number" class="innovation" min="0" max="${limits.innovation}" required>
</div>

<div class="criteria-box">
  <label>Feasibility (/${limits.feasibility})</label>
  <input type="number" class="feasibilityAccessibility" min="0" max="${limits.feasibility}" required>
</div>

<div class="criteria-box">
  <label>Presentation (/${limits.presentation})</label>
  <input type="number" class="presentation" min="0" max="${limits.presentation}" required>
</div>

  <textarea class="feedbackInput"></textarea>

  <button type="submit">Submit Score</button>
</form>
`
          }

        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

/*
==================================================
SUBMIT SCORE
==================================================
*/
async function submitScore(event, teamName, autoRoundName) {
  event.preventDefault();

  try {
    const form = event.target;

    const roundName =
      autoRoundName || form.querySelector(".roundName")?.value || "";

    const uxLogic = Number(form.querySelector(".uxLogic").value);
    const uiAesthetics = Number(form.querySelector(".uiAesthetics").value);
    const innovation = Number(form.querySelector(".innovation").value);
    const feasibilityAccessibility = Number(
      form.querySelector(".feasibilityAccessibility").value,
    );
    const presentation = Number(form.querySelector(".presentation").value);

    const feedback = form.querySelector(".feedbackInput").value;

    /*
    ==========================================
    ✅ CALCULATE TOTAL (NO DOM DEPENDENCY)
    ==========================================
    */
    const total =
      uxLogic +
      uiAesthetics +
      innovation +
      feasibilityAccessibility +
      presentation;

    /*
    ==========================================
    ROUND LIMIT LOGIC
    ==========================================
    */
    let maxAllowed = 100;

    if (roundName.includes("1")) maxAllowed = 25;
    if (roundName.includes("2")) maxAllowed = 25;
    if (roundName.includes("3")) maxAllowed = 50;

    if (total > maxAllowed) {
      alert(`Max score for ${roundName} is ${maxAllowed}`);
      return;
    }

    /*
    ==========================================
    BASIC VALIDATION
    ==========================================
    */
    if (!judgeName || !teamName || !roundName) {
      alert("Judge name, Team name or Round name missing");
      return;
    }

    /*
    ==========================================
    API CALL
    ==========================================
    */
    const response = await fetch("https://api-design-o-thon.onrender.com/api/score/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        judgeName,
        teamName,
        roundName,
        uxLogic,
        uiAesthetics,
        innovation,
        feasibilityAccessibility,
        presentation,
        feedback,
      }),
    });

    const data = await response.json();

    alert(data.message);

    /*
    ==========================================
    ✅ UI UPDATE AFTER SCORE
    ==========================================
    */
    if (response.ok) {
      const card = form.closest(".team-card");

      card.querySelector("form").remove();

      card.innerHTML += `
        <p style="color:#22c55e; font-weight:bold;">
          SCORE SUBMITTED
        </p>
      `;
    }
  } catch (error) {
    console.log(error);
    alert("Failed to submit score");
  }
}

/*
==================================================
LOGOUT
==================================================
*/
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
}

loadAssignedTeams();
