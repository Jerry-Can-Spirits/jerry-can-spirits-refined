// Mock data generator (replace with actual API calls)
function generateMockData() {
  const events = ['auth_success', 'auth_failed', 'rate_limited', 'trusted_ip_access'];
  const countries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN'];
  const emails = ['john@company.com', 'jane@company.com', 'admin@company.com', 'test@company.com'];
  
  const data = [];
  const now = Date.now();
  
  for (let i = 0; i < 50; i++) {
    const event = events[Math.floor(Math.random() * events.length)];
    data.push({
      timestamp: now - Math.random() * 7 * 24 * 60 * 60 * 1000,
      event: event,
      email: event === 'auth_success' ? emails[Math.floor(Math.random() * emails.length)] : 'unknown',
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      userAgent: 'Mozilla/5.0...'
    });
  }
  
  return data.sort((a, b) => b.timestamp - a.timestamp);
}

// Country flag emoji mapper
function getCountryFlag(code) {
  const flags = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'IN': '🇮🇳',
    'CN': '🇨🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'ES': '🇪🇸'
  };
  return flags[code] || '🌍';
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Update stats
function updateStats(data) {
  const successCount = data.filter(d => d.event === 'auth_success').length;
  const failedCount = data.filter(d => d.event === 'auth_failed').length;
  const rateLimitedCount = data.filter(d => d.event === 'rate_limited').length;
  const uniqueIPs = new Set(data.map(d => d.ip)).size;
  
  document.getElementById('totalAuth').textContent = successCount;
  document.getElementById('failedAttempts').textContent = failedCount;
  document.getElementById('uniqueVisitors').textContent = uniqueIPs;
  document.getElementById('rateLimited').textContent = rateLimitedCount;
  
  // Calculate changes (mock)
  document.getElementById('authChange').textContent = `+${Math.floor(Math.random() * 50)}% today`;
  document.getElementById('failedChange').textContent = `+${Math.floor(Math.random() * 30)}% today`;
  document.getElementById('visitorChange').textContent = `+${Math.floor(Math.random() * 40)}% this week`;
  document.getElementById('limitedChange').textContent = `${Math.floor(Math.random() * 5)} active`;
}

// Update activity table
function updateActivityTable(data) {
  const tbody = document.getElementById('activityTableBody');
  tbody.innerHTML = '';
  
  data.slice(0, 20).forEach(item => {
    const row = document.createElement('tr');
    
    let statusBadge = '';
    let statusClass = '';
    
    switch(item.event) {
      case 'auth_success':
        statusBadge = 'Success';
        statusClass = 'success';
        break;
      case 'auth_failed':
        statusBadge = 'Failed';
        statusClass = 'failed';
        break;
      case 'rate_limited':
        statusBadge = 'Blocked';
        statusClass = 'blocked';
        break;
      default:
        statusBadge = 'Access';
        statusClass = 'success';
    }
    
    row.innerHTML = `
      <td>${formatTime(item.timestamp)}</td>
      <td>${item.event.replace(/_/g, ' ')}</td>
      <td>${item.email}</td>
      <td><span class="ip-address">${item.ip}</span></td>
      <td><span class="country-flag">${getCountryFlag(item.country)}</span>${item.country}</td>
      <td><span class="status-badge ${statusClass}">${statusBadge}</span></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Initialize chart
let activityChart;
function initChart(data, range = '24h') {
  const ctx = document.getElementById('activityChart').getContext('2d');
  
  // Process data for chart
  const now = Date.now();
  let rangeMs = 24 * 60 * 60 * 1000; // 24 hours
  let groupBy = 60 * 60 * 1000; // 1 hour
  
  if (range === '7d') {
    rangeMs = 7 * 24 * 60 * 60 * 1000;
    groupBy = 24 * 60 * 60 * 1000; // 1 day
  } else if (range === '30d') {
    rangeMs = 30 * 24 * 60 * 60 * 1000;
    groupBy = 24 * 60 * 60 * 1000; // 1 day
  }
  
  const filteredData = data.filter(d => d.timestamp > now - rangeMs);
  
  // Group by time period
  const groups = {};
  filteredData.forEach(item => {
    const key = Math.floor(item.timestamp / groupBy) * groupBy;
    if (!groups[key]) {
      groups[key] = { success: 0, failed: 0 };
    }
    if (item.event === 'auth_success') {
      groups[key].success++;
    } else if (item.event === 'auth_failed' || item.event === 'rate_limited') {
      groups[key].failed++;
    }
  });
  
  const labels = Object.keys(groups).sort().map(ts => {
    const date = new Date(parseInt(ts));
    if (range === '24h') {
      return date.getHours() + ':00';
    } else {
      return date.toLocaleDateString();
    }
  });
  
  const successData = Object.keys(groups).sort().map(ts => groups[ts].success);
  const failedData = Object.keys(groups).sort().map(ts => groups[ts].failed);
  
  if (activityChart) {
    activityChart.destroy();
  }
  
  activityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Successful',
        data: successData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }, {
        label: 'Failed',
        data: failedData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#CBD5E1'
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#334155'
          },
          ticks: {
            color: '#CBD5E1'
          }
        },
        y: {
          grid: {
            color: '#334155'
          },
          ticks: {
            color: '#CBD5E1',
            stepSize: 1
          }
        }
      }
    }
  });
}

// Update countries
function updateCountries(data) {
  const countryCounts = {};
  data.forEach(item => {
    countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
  });
  
  const sorted = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const container = document.getElementById('countriesContainer');
  container.innerHTML = sorted.map(([country, count]) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid var(--border);">
      <div>
        <span class="country-flag">${getCountryFlag(country)}</span>
        <span>${country}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="width: 100px; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
          <div style="width: ${(count / sorted[0][1]) * 100}%; height: 100%; background: var(--accent);"></div>
        </div>
        <span style="color: var(--text-secondary); font-size: 0.875rem;">${count}</span>
      </div>
    </div>
  `).join('');
}

// Initialize dashboard
function initDashboard() {
  const data = generateMockData();
  
  updateStats(data);
  updateActivityTable(data);
  initChart(data);
  updateCountries(data);
}

// Handle filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const data = generateMockData();
    initChart(data, this.dataset.range);
  });
});

// Handle refresh button
document.getElementById('refreshBtn').addEventListener('click', function() {
  this.disabled = true;
  initDashboard();
  setTimeout(() => {
    this.disabled = false;
  }, 1000);
});

// Auto-refresh every 30 seconds
setInterval(initDashboard, 30000);

// Initialize on load
initDashboard();