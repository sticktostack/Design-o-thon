const notificationsContainer = document.getElementById("notificationsContainer");
const logoutBtn = document.getElementById("logoutBtn");


// Load Notifications
async function loadNotifications() {
  const response = await fetch(
    "http://https://api-design-o-thon.onrender.com/api/notification/all"
  );

  const notifications = await response.json();

  notificationsContainer.innerHTML = "";

  notifications.forEach(note => {
    notificationsContainer.innerHTML += `
      <div class="notification-card">
        <h3>${note.title}</h3>

        <p>${note.message}</p>

        <p>
          <strong>Type:</strong> ${note.type}
        </p>

        <p class="notification-time">
          ${new Date(note.createdAt).toLocaleString("en-IN")}
        </p>

        ${
          !note.isRead
            ? `
              <button
                class="read-btn"
                onclick="markAsRead('${note._id}')"
              >
                Mark as Read
              </button>
            `
            : `<p><strong>Status:</strong> Read</p>`
        }
      </div>
    `;
  });
}


// Mark Notification Read
async function markAsRead(id) {
  await fetch(
    `http://https://api-design-o-thon.onrender.com/api/notification/read/${id}`,
    {
      method: "PUT"
    }
  );

  loadNotifications();
}


// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});


// Auto refresh every 15 sec
setInterval(loadNotifications, 15000);

loadNotifications();