const totalTeams = document.getElementById("totalTeams");
const totalJudges = document.getElementById("totalJudges");
const totalSubmissions = document.getElementById("totalSubmissions");
const activeRounds = document.getElementById("activeRounds");

const recentActivities = document.getElementById("recentActivities");
const topTeams = document.getElementById("topTeams");

const logoutBtn = document.getElementById("logoutBtn");


/*
==================================================
LOAD ANALYTICS DASHBOARD
==================================================
*/
async function loadDashboard() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/analytics"
    );

    const data = await response.json();

    /*
    ==========================================
    STATS CARDS
    ==========================================
    */
    totalTeams.innerText =
      data.totalTeams || 0;

    totalJudges.innerText =
      data.totalJudges || 0;

    totalSubmissions.innerText =
      data.totalSubmissions || 0;

    activeRounds.innerText =
      data.activeRounds || 0;

    /*
    ==========================================
    RECENT ACTIVITIES
    ==========================================
    */
    recentActivities.innerHTML = "";

    if (
      !data.recentActivities ||
      !data.recentActivities.length
    ) {
      recentActivities.innerHTML = `
        <div class="activity-card">
          <p>No recent activities found</p>
        </div>
      `;
    } else {
      data.recentActivities.forEach(activity => {
        recentActivities.innerHTML += `
          <div class="activity-card">
            <p>
              <strong>${activity.title || "Activity"}</strong>
            </p>

            <p>
              ${activity.message || "No details available"}
            </p>
          </div>
        `;
      });
    }

    /*
    ==========================================
    TOP PERFORMING TEAMS
    ==========================================
    */
    topTeams.innerHTML = "";

    if (
      !data.topTeams ||
      !data.topTeams.length
    ) {
      topTeams.innerHTML = `
        <div class="team-rank-card">
          <p>No team rankings available yet</p>
        </div>
      `;
    } else {
      data.topTeams.forEach((team, index) => {
        topTeams.innerHTML += `
          <div class="team-rank-card">
            <p>
              #${index + 1}
              <strong>
                ${team._id?.teamName || "Unknown Team"}
              </strong>
            </p>

            <p>
              ${team._id?.collegeName || ""}
            </p>

            <p>
              Total Score:
              <strong>
                ${team.totalScore || 0}
              </strong>
            </p>
          </div>
        `;
      });
    }

  } catch (error) {
    console.log("Dashboard Error:", error);

    recentActivities.innerHTML = `
      <div class="activity-card">
        <p>Failed to load recent activities</p>
      </div>
    `;

    topTeams.innerHTML = `
      <div class="team-rank-card">
        <p>Failed to load top teams</p>
      </div>
    `;
  }
}


/*
==================================================
AUTO REFRESH EVERY 15 SECONDS
==================================================
*/
setInterval(() => {
  loadDashboard();
}, 15000);


/*
==================================================
LOGOUT
==================================================
*/
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");

  window.location.href = "login.html";
});


/*
==================================================
INITIAL LOAD
==================================================
*/
loadDashboard();