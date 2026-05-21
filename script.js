/* ============================================================
   ONLINE EVENT TICKETING SYSTEM — script.js
   All application logic: auth, events, tickets, charts
   ============================================================ */

/* ──────────────────────────────────────────
   CONSTANTS & DATA
────────────────────────────────────────── */

// Hardcoded credentials
const VALID_USER = 'admin';
const VALID_PASS = '1234';

// Events dataset
const EVENTS_DATA = [
  {
    id: 'EVT001',
    name: 'Neon Horizon Music Festival',
    category: 'Music',
    emoji: '🎵',
    bannerColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    date: '2026-08-15',
    displayDate: 'Aug 15, 2026',
    time: '6:00 PM',
    location: 'Axiata Arena, Kuala Lumpur',
    price: 150,
    seatsLeft: 42,
    totalSeats: 500
  },
  {
    id: 'EVT002',
    name: 'Tech Summit 2026',
    category: 'Technology',
    emoji: '💻',
    bannerColor: 'linear-gradient(135deg, #0a0c10 0%, #1c2130 50%, #0d2137 100%)',
    date: '2026-09-03',
    displayDate: 'Sep 3, 2026',
    time: '9:00 AM',
    location: 'KL Convention Centre',
    price: 280,
    seatsLeft: 120,
    totalSeats: 300
  },
  {
    id: 'EVT003',
    name: 'International Food Expo',
    category: 'Food & Drink',
    emoji: '🍜',
    bannerColor: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #3d1c00 100%)',
    date: '2026-08-28',
    displayDate: 'Aug 28, 2026',
    time: '10:00 AM',
    location: 'Pavilion KL, Bukit Bintang',
    price: 45,
    seatsLeft: 200,
    totalSeats: 400
  },
  {
    id: 'EVT004',
    name: 'National Art Exhibition',
    category: 'Arts & Culture',
    emoji: '🎨',
    bannerColor: 'linear-gradient(135deg, #1a001a 0%, #2d0033 50%, #1a0024 100%)',
    date: '2026-10-10',
    displayDate: 'Oct 10, 2026',
    time: '11:00 AM',
    location: 'National Visual Arts Gallery',
    price: 25,
    seatsLeft: 80,
    totalSeats: 200
  },
  {
    id: 'EVT005',
    name: 'Champions League Final',
    category: 'Sports',
    emoji: '⚽',
    bannerColor: 'linear-gradient(135deg, #001a05 0%, #00330a 50%, #004d0e 100%)',
    date: '2026-11-22',
    displayDate: 'Nov 22, 2026',
    time: '8:00 PM',
    location: 'Bukit Jalil National Stadium',
    price: 350,
    seatsLeft: 15,
    totalSeats: 1000
  },
  {
    id: 'EVT006',
    name: 'Stand-Up Comedy Night',
    category: 'Entertainment',
    emoji: '🎤',
    bannerColor: 'linear-gradient(135deg, #1a1400 0%, #2d2400 50%, #3d3000 100%)',
    date: '2026-08-20',
    displayDate: 'Aug 20, 2026',
    time: '8:30 PM',
    location: 'The Bee, Publika',
    price: 80,
    seatsLeft: 60,
    totalSeats: 150
  },
  {
    id: 'EVT007',
    name: 'KPOP Fest Malaysia 2026',
    category: 'Music',
    emoji: '🎤',
    bannerColor: 'linear-gradient(135deg, #4a0030 0%, #8b0057 50%, #c2185b 100%)',
    date: '2026-07-19',
    displayDate: 'Jul 19, 2026',
    time: '7:00 PM',
    location: 'Stadium Merdeka, Kuala Lumpur',
    price: 199,
    seatsLeft: 28,
    totalSeats: 800
  },
  {
    id: 'EVT008',
    name: 'GameCon KL 2026',
    category: 'Gaming',
    emoji: '🎮',
    bannerColor: 'linear-gradient(135deg, #0d0d2b 0%, #1a1a6e 50%, #0a3d6b 100%)',
    date: '2026-10-03',
    displayDate: 'Oct 3, 2026',
    time: '10:00 AM',
    location: 'MITEC, Kuala Lumpur',
    price: 60,
    seatsLeft: 350,
    totalSeats: 600
  }
];

/* ──────────────────────────────────────────
   LOCAL STORAGE HELPERS
────────────────────────────────────────── */

/**
 * Get booked tickets from localStorage
 * @returns {Array} tickets array
 */
function getTickets() {
  const raw = localStorage.getItem('ets_tickets');
  return raw ? JSON.parse(raw) : [];
}

/**
 * Save tickets array to localStorage
 * @param {Array} tickets
 */
function saveTickets(tickets) {
  localStorage.setItem('ets_tickets', JSON.stringify(tickets));
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
  return localStorage.getItem('ets_auth') === 'true';
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

/**
 * Log out user and redirect
 */
function logout() {
  localStorage.removeItem('ets_auth');
  window.location.href = 'index.html';
}

/* ──────────────────────────────────────────
   TOAST NOTIFICATIONS
────────────────────────────────────────── */

/**
 * Show a toast notification
 * @param {string} title
 * @param {string} message
 */
function showToast(title, message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-body">${message}</div>`;
  container.appendChild(toast);

  // Auto-remove after animation (3.3s)
  setTimeout(() => toast.remove(), 3400);
}

/* ──────────────────────────────────────────
   NAVBAR: MOBILE DRAWER
────────────────────────────────────────── */

/**
 * Initialise mobile nav toggle
 */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  // Close drawer when a link is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => drawer.classList.remove('open'));
  });
}

/* ──────────────────────────────────────────
   PAGE: LOGIN (index.html)
────────────────────────────────────────── */

/**
 * Initialise login page
 */
function initLogin() {
  // Redirect if already logged in
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form   = document.getElementById('loginForm');
  const errMsg = document.getElementById('loginError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btn      = document.getElementById('loginBtn');

    // Loading state
    btn.innerHTML = '<span class="spin">⏳</span> Signing in…';
    btn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      if (username === VALID_USER && password === VALID_PASS) {
        // Success
        localStorage.setItem('ets_auth', 'true');
        localStorage.setItem('ets_user', username);
        btn.innerHTML = '✓ Success! Redirecting…';
        errMsg.classList.remove('show');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
      } else {
        // Failure
        errMsg.classList.add('show');
        btn.innerHTML = 'Login';
        btn.disabled = false;
        // Shake effect
        const card = document.querySelector('.login-card');
        if (card) {
          card.style.animation = 'none';
          card.style.transform = 'translateX(-8px)';
          setTimeout(() => { card.style.transform = 'translateX(8px)'; }, 80);
          setTimeout(() => { card.style.transform = 'translateX(0)';   }, 160);
        }
      }
    }, 700);
  });

  // Clear error on input
  ['username', 'password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => errMsg.classList.remove('show'));
  });
}

/* ──────────────────────────────────────────
   PAGE: DASHBOARD (dashboard.html)
────────────────────────────────────────── */

/**
 * Initialise dashboard page
 */
function initDashboard() {
  requireAuth();
  initNavToggle();

  const tickets = getTickets();

  // ── Stat cards ──
  const confirmedTickets = tickets.filter(t => t.status === 'Confirmed').length;
  const upcomingEvents   = EVENTS_DATA.filter(e => new Date(e.date) > new Date()).length;
  const totalRevenue     = tickets
    .filter(t => t.status === 'Confirmed')
    .reduce((sum, t) => sum + (t.price || 0), 0);

  setInner('statTotalEvents',  EVENTS_DATA.length);
  setInner('statTicketsSold',  confirmedTickets);
  setInner('statUpcoming',     upcomingEvents);
  setInner('statRevenue',      'RM ' + totalRevenue.toLocaleString());

  // ── Bar chart: ticket sales per event ──
  renderSalesChart(tickets);

  // ── Doughnut chart: category breakdown ──
  renderCategoryChart();

  // ── Recent activity ──
  renderRecentActivity(tickets);

  // Set username
  const u = localStorage.getItem('ets_user') || 'Admin';
  const el = document.getElementById('navUsername');
  if (el) el.textContent = u.charAt(0).toUpperCase() + u.slice(1);
}

/**
 * Set innerHTML safely
 */
function setInner(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

/**
 * Render bar chart: tickets sold per event
 */
function renderSalesChart(tickets) {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  // Count tickets per event
  const counts = {};
  EVENTS_DATA.forEach(e => { counts[e.id] = 0; });
  tickets.forEach(t => {
    if (t.status === 'Confirmed' && counts[t.eventId] !== undefined) {
      counts[t.eventId]++;
    }
  });

  // Merge with some demo data so chart looks populated on first load
  const demoBase = [12, 8, 20, 5, 3, 14, 18, 10];
  const labels   = EVENTS_DATA.map(e => e.name.length > 20 ? e.name.slice(0, 18) + '…' : e.name);
  const data     = EVENTS_DATA.map((e, i) => (counts[e.id] || 0) + (demoBase[i] || 0));

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tickets Sold',
        data,
        backgroundColor: [
          'rgba(167,139,250,0.75)',
          'rgba(236,72,153,0.75)',
          'rgba(96,165,250,0.75)',
          'rgba(251,146,60,0.75)',
          'rgba(74,222,128,0.75)',
          'rgba(250,204,21,0.75)',
          'rgba(244,63,94,0.75)',
          'rgba(34,211,238,0.75)'
        ],
        borderColor: [
          'rgba(167,139,250,1)',
          'rgba(236,72,153,1)',
          'rgba(96,165,250,1)',
          'rgba(251,146,60,1)',
          'rgba(74,222,128,1)',
          'rgba(250,204,21,1)',
          'rgba(244,63,94,1)',
          'rgba(34,211,238,1)'
        ],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#7c3aed',
          bodyColor: '#6b7280',
          padding: 12
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', font: { size: 11 } },
          grid:  { color: 'rgba(0,0,0,0.05)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#9ca3af', stepSize: 5 },
          grid:  { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
}

/**
 * Render doughnut chart: event categories
 */
function renderCategoryChart() {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;

  const categories = [...new Set(EVENTS_DATA.map(e => e.category))];
  const counts = categories.map(cat => EVENTS_DATA.filter(e => e.category === cat).length);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: counts,
        backgroundColor: [
          'rgba(232,255,71,0.75)',
          'rgba(255,107,53,0.75)',
          'rgba(96,165,250,0.75)',
          'rgba(167,139,250,0.75)',
          'rgba(74,222,128,0.75)',
          'rgba(250,204,21,0.75)',
          'rgba(34,211,238,0.75)'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9ca3af',
            font: { size: 12 },
            padding: 14,
            boxWidth: 12,
            borderRadius: 3
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#7c3aed',
          bodyColor: '#6b7280',
          padding: 12
        }
      }
    }
  });
}

/**
 * Render recent activity list
 */
function renderRecentActivity(tickets) {
  const list = document.getElementById('activityList');
  if (!list) return;

  const dotColors  = ['green', 'blue', 'orange'];
  const activities = [];

  // Real tickets (latest 3)
  tickets.slice(-3).reverse().forEach((t, i) => {
    activities.push({
      name:  t.eventName,
      time:  'Recently booked',
      badge: t.status.toLowerCase(),
      dot:   dotColors[i % 3]
    });
  });

  // Fill with demo data if not enough tickets
  const demo = [
    { name: 'Neon Horizon Music Festival', time: '2 hours ago',   badge: 'sold',      dot: 'green'  },
    { name: 'Tech Summit 2026',            time: '5 hours ago',   badge: 'pending',   dot: 'orange' },
    { name: 'Champions League Final',      time: 'Yesterday',     badge: 'sold',      dot: 'green'  },
    { name: 'KPOP Fest Malaysia 2026',     time: '1 day ago',     badge: 'sold',      dot: 'blue'   },
    { name: 'GameCon KL 2026',             time: '2 days ago',    badge: 'confirmed', dot: 'green'  }
  ];

  const combined = [...activities, ...demo].slice(0, 5);

  list.innerHTML = combined.map(a => `
    <li>
      <span class="a-dot ${a.dot}"></span>
      <div class="a-info">
        <div class="a-name">${a.name}</div>
        <div class="a-time">${a.time}</div>
      </div>
      <span class="a-badge ${a.badge}">${a.badge}</span>
    </li>
  `).join('');
}

/* ──────────────────────────────────────────
   PAGE: EVENTS (events.html)
────────────────────────────────────────── */

/**
 * Initialise events page
 */
function initEvents() {
  requireAuth();
  initNavToggle();

  // Set username in nav
  const u = localStorage.getItem('ets_user') || 'Admin';
  const el = document.getElementById('navUsername');
  if (el) el.textContent = u.charAt(0).toUpperCase() + u.slice(1);

  renderEventCards(EVENTS_DATA);

  // Search
  const searchEl = document.getElementById('eventSearch');
  if (searchEl) {
    searchEl.addEventListener('input', filterEvents);
  }

  // Category filter
  const catEl = document.getElementById('categoryFilter');
  if (catEl) {
    catEl.addEventListener('change', filterEvents);
  }
}

/**
 * Filter events based on search + category
 */
function filterEvents() {
  const query    = (document.getElementById('eventSearch')?.value || '').toLowerCase();
  const category = document.getElementById('categoryFilter')?.value || '';

  const filtered = EVENTS_DATA.filter(e => {
    const matchSearch = !query ||
      e.name.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query);
    const matchCat = !category || e.category === category;
    return matchSearch && matchCat;
  });

  renderEventCards(filtered);
}

/**
 * Render event cards into the grid
 * @param {Array} events
 */
function renderEventCards(events) {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  if (events.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <p>No events found. Try a different search.</p>
      </div>`;
    return;
  }

  const tickets = getTickets();

  grid.innerHTML = events.map(event => {
    // Check if already booked
    const alreadyBooked = tickets.some(
      t => t.eventId === event.id && t.status === 'Confirmed'
    );
    const soldOut = event.seatsLeft === 0;

    const btnText  = soldOut ? '🚫 Sold Out' : alreadyBooked ? '✓ Booked' : 'Buy Ticket';
    const btnClass = soldOut || alreadyBooked ? 'btn-buy" disabled' : 'btn-buy';

    // Seats indicator colour
    let seatsColor = '#4ade80';
    const ratio = event.seatsLeft / event.totalSeats;
    if (ratio < 0.1) seatsColor = '#f87171';
    else if (ratio < 0.3) seatsColor = '#facc15';

    return `
      <div class="event-card page-fade-in">
        <div class="event-banner" style="background:${event.bannerColor}">
          <span style="font-size:52px;position:relative;z-index:1">${event.emoji}</span>
        </div>
        <div class="event-body">
          <div class="event-category" style="color:var(--accent)">${event.category}</div>
          <div class="event-name">${event.name}</div>
          <ul class="event-meta">
            <li>
              <span class="meta-icon">📅</span>
              <span>${event.displayDate} · ${event.time}</span>
            </li>
            <li>
              <span class="meta-icon">📍</span>
              <span>${event.location}</span>
            </li>
            <li>
              <span class="meta-icon">🎟</span>
              <span style="color:${seatsColor}">${event.seatsLeft} seats left</span>
            </li>
          </ul>
          <div class="event-footer">
            <div class="event-price">
              RM ${event.price}
              <span>/ ticket</span>
            </div>
            <button class="${btnClass}"
              onclick="buyTicket('${event.id}')"
              id="buyBtn_${event.id}">
              ${btnText}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Handle ticket purchase
 * @param {string} eventId
 */
function buyTicket(eventId) {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if (!event) return;

  const tickets = getTickets();

  // Check if already booked
  if (tickets.some(t => t.eventId === eventId && t.status === 'Confirmed')) {
    showToast('Already Booked', 'You already have a ticket for this event!');
    return;
  }

  // Generate seat number
  const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
  const seatNum    = Math.floor(Math.random() * 50) + 1;
  const seatCode   = `${seatLetter}${seatNum.toString().padStart(2, '0')}`;

  // Create ticket
  const ticket = {
    id:        'TKT' + Date.now(),
    eventId:   event.id,
    eventName: event.name,
    date:      event.displayDate,
    time:      event.time,
    location:  event.location,
    seat:      seatCode,
    price:     event.price,
    status:    'Confirmed',
    bookedAt:  new Date().toISOString()
  };

  tickets.push(ticket);
  saveTickets(tickets);

  // Update button
  const btn = document.getElementById(`buyBtn_${eventId}`);
  if (btn) {
    btn.textContent = '✓ Booked';
    btn.disabled = true;
  }

  showToast('🎟 Ticket Booked!', `${event.name} · Seat ${seatCode}`);
}

/* ──────────────────────────────────────────
   PAGE: MY TICKETS (tickets.html)
────────────────────────────────────────── */

/**
 * Initialise my tickets page
 */
function initTickets() {
  requireAuth();
  initNavToggle();

  // Set username in nav
  const u = localStorage.getItem('ets_user') || 'Admin';
  const el = document.getElementById('navUsername');
  if (el) el.textContent = u.charAt(0).toUpperCase() + u.slice(1);

  renderTicketsTable();
  updateTicketStats();
}

/**
 * Render the tickets table
 */
function renderTicketsTable() {
  const tbody = document.getElementById('ticketsBody');
  if (!tbody) return;

  const tickets = getTickets();

  if (tickets.length === 0) {
    document.getElementById('ticketsTableWrap').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎟</div>
        <p>No tickets yet. <a href="events.html">Browse events</a> to book your first ticket!</p>
      </div>`;
    return;
  }

  // Sort newest first
  const sorted = [...tickets].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

  tbody.innerHTML = sorted.map((t, i) => {
    const statusClass = t.status.toLowerCase();
    return `
      <tr>
        <td class="ticket-id">${t.id}</td>
        <td>
          <div class="ticket-event-name">${t.eventName}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
            📅 ${t.date} · 📍 ${t.location}
          </div>
        </td>
        <td><span class="seat-badge">${t.seat}</span></td>
        <td>RM ${t.price}</td>
        <td><span class="status-pill ${statusClass}">${t.status}</span></td>
        <td>
          ${t.status === 'Confirmed'
            ? `<button class="btn-cancel-ticket" onclick="cancelTicket('${t.id}')">Cancel</button>`
            : '<span style="color:var(--text-muted);font-size:12px">—</span>'
          }
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Cancel a ticket
 * @param {string} ticketId
 */
function cancelTicket(ticketId) {
  const tickets = getTickets();
  const idx = tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;

  tickets[idx].status = 'Cancelled';
  saveTickets(tickets);

  renderTicketsTable();
  updateTicketStats();

  showToast('Ticket Cancelled', 'Your booking has been cancelled.');
}

/**
 * Update ticket summary stats
 */
function updateTicketStats() {
  const tickets  = getTickets();
  const confirmed  = tickets.filter(t => t.status === 'Confirmed').length;
  const cancelled  = tickets.filter(t => t.status === 'Cancelled').length;
  const totalSpent = tickets
    .filter(t => t.status === 'Confirmed')
    .reduce((s, t) => s + (t.price || 0), 0);

  setInner('tsTotal',     tickets.length);
  setInner('tsConfirmed', confirmed);
  setInner('tsCancelled', cancelled);
  setInner('tsSpent',     'RM ' + totalSpent.toLocaleString());
}

/* ──────────────────────────────────────────
   AUTO-INIT based on current page
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '')    initLogin();
  if (page === 'dashboard.html')               initDashboard();
  if (page === 'events.html')                  initEvents();
  if (page === 'tickets.html')                 initTickets();

  // Attach logout handlers
  document.querySelectorAll('[data-logout]').forEach(el => {
    el.addEventListener('click', logout);
  });
});
