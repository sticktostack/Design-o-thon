const leaderboardBody = document.getElementById("leaderboardBody");
const podiumContainer = document.getElementById("podiumContainer");
const logoutBtn = document.getElementById("logoutBtn");

/*
==================================================
LOAD LIVE LEADERBOARD + TOP 3 PODIUM
==================================================
*/
async function loadLeaderboard() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/score/leaderboard"
    );

    const leaderboard = await response.json();

    leaderboardBody.innerHTML = "";
    podiumContainer.innerHTML = "";

    /*
    ==========================================
    NO DATA STATE
    ==========================================
    */
    if (!leaderboard.length) {
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center;">
            No scores available yet
          </td>
        </tr>
      `;

      podiumContainer.innerHTML = `
        <div class="podium-card">
          <h3>No rankings yet</h3>
          <p>Waiting for judge scores...</p>
        </div>
      `;
      return;
    }

    /*
    ==========================================
    TOP 3 PODIUM CARDS
    ==========================================
    */
    const topThree = leaderboard.slice(0, 3);

    const labels = [
      "🥇 1st Place",
      "🥈 2nd Place",
      "🥉 3rd Place"
    ];

    const classes = [
      "first",
      "second",
      "third"
    ];

    topThree.forEach((team, index) => {
      podiumContainer.innerHTML += `
        <div class="podium-card ${classes[index]}">
          <h3>${labels[index]}</h3>

          <p><strong>${team.teamName}</strong></p>
          <p>${team.collegeName}</p>

          <p>
            Final Score:
            <strong>${team.totalScore}</strong>
          </p>
        </div>
      `;
    });

    /*
    ==========================================
    FULL TABLE
    ==========================================
    */
    leaderboard.forEach((team, index) => {
      leaderboardBody.innerHTML += `
        <tr>
          <td class="rank">#${index + 1}</td>

          <td>${team.teamName || "N/A"}</td>

          <td>${team.collegeName || "N/A"}</td>

          <td>${team.round1 || 0}</td>

          <td>${team.round2 || 0}</td>

          <td>${team.round3 || 0}</td>

          <td>
            <strong>${team.totalScore || 0}</strong>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.log(error);

    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center;">
          Failed to load leaderboard
        </td>
      </tr>
    `;

    podiumContainer.innerHTML = `
      <div class="podium-card">
        <h3>Failed to load podium</h3>
      </div>
    `;
  }
}

/*
==================================================
AUTO REFRESH
==================================================
*/
setInterval(() => {
  loadLeaderboard();
}, 10000);

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
loadLeaderboard();