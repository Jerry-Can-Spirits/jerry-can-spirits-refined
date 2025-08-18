// Admin Dashboard functionality
async function initDashboard() {
  // Mock data - replace with actual API calls
  const mockData = {
    totalAuth: 42,
    failedAttempts: 7,
    uniqueVisitors: 156,
    recentActivity: [
      { event: 'auth_success', ip: '192.168.1.1', email: 'user@example.com', timestamp: Date.now() - 3600000 },
      { event: 'auth_failed', ip: '10.0.0.1', email: 'test@example.com', timestamp: Date.now() - 7200000 }
    ]
  };
  
  // Update stats
  document.getElementById('totalAuth').textContent = mockData.totalAuth;
  document.getElementById('failedAttempts').textContent = mockData.failedAttempts;
  document.getElementById('uniqueVisitors').textContent = mockData.uniqueVisitors;
  
  // Render activity log
  const activityContainer = document.getElementById('activity-log');
  if (activityContainer && mockData.recentActivity) {
    activityContainer.innerHTML = mockData.recentActivity.map(activity => `
      <div class="activity-item">
        <div class="activity-event ${activity.event === 'auth_success' ? 'success' : 'failed'}">
          ${activity.event.replace('_', ' ').toUpperCase()}
        </div>
        <div class="activity-details">
          <div>IP: ${activity.ip}</div>
          <div>Email: ${activity.email}</div>
          <div>Time: ${new Date(activity.timestamp).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initDashboard);