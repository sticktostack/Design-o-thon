const submissionsContainer = document.getElementById("submissionsContainer");
const logoutBtn = document.getElementById("logoutBtn");


// Load All Submissions
async function loadSubmissions() {
  const response = await fetch("http://localhost:5000/api/submission/all");
  const submissions = await response.json();

  submissionsContainer.innerHTML = "";

  submissions.forEach(sub => {
    submissionsContainer.innerHTML += `
      <div class="submission-card">
        <h3>${sub.team?.teamName || "Unknown Team"}</h3>

        <p><strong>College:</strong> ${sub.team?.collegeName || "-"}</p>
        <p><strong>Round:</strong> ${sub.roundNumber}</p>
        <p><strong>Notes:</strong> ${sub.notes || "-"}</p>
        <p><strong>Submitted At:</strong>
          ${new Date(sub.submittedAt).toLocaleString("en-IN")}
        </p>

        ${
          sub.figmaLink
            ? `<a href="${sub.figmaLink}" target="_blank" class="link-btn">
                Open Design
              </a>`
            : ""
        }

        ${
          sub.canvaLink
            ? `<a href="${sub.canvaLink}" target="_blank" class="link-btn">
                Open Design
              </a>`
            : ""
        }

        ${
          sub.pdfFile
            ? `<a
                href="http://localhost:5000/uploads/${sub.pdfFile}"
                target="_blank"
                class="link-btn pdf-btn"
              >
                Open Design
              </a>`
            : ""
        }
      </div>
    `;
  });
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});

loadSubmissions();