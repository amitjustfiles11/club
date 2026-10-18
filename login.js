/**
 * ==========================================================================
 * ClubSphere — MSOT Club Activities Tracker
 * Complete Interactive Application Engine (script.js)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initConstellation();
  initTheme();
  initFormListeners();
  fillSelectedRoleCredentials();
});

/* --------------------------------------------------------------------------
   1. State & Demo Persona Profiles
   -------------------------------------------------------------------------- */
let currentRole = 'student';
let isLightMode = false;
let qrTimeLeft = 45;
let qrTimerInterval = null;
let toastTimeout = null;

const profiles = {
  student: {
    roleId: 'student',
    roleLabel: 'Student',
    name: 'Alex Chen',
    title: 'Sophomore • B.S. Computer Science',
    id: 'alex.chen@msot.edu',
    studentCode: 'MSOT-2024-8192',
    pass: 'StudentPulse2026!',
    badge: 'Student ID: MSOT-2024-8192',
    avatar: 'AC',
    stats: [
      { label: 'Active Clubs', value: '3', trend: 'Joined Fall 2026' },
      { label: 'Verified Hours', value: '42 hrs', trend: '+6 hrs this month' },
      { label: 'Certificates', value: '2', trend: 'Official E-Signed' },
      { label: 'Attendance Rate', value: '98%', trend: 'Top 5% Campus' }
    ],
    clubs: [
      { name: 'MSOT Robotics Club', role: 'Hardware Team Member', tag: 'Next Meet: Friday 4 PM', icon: '🤖' },
      { name: 'AI & Machine Learning Society', role: 'Project Contributor', tag: 'Hackathon Oct 24', icon: '🧠' },
      { name: 'Collegiate Debate Forum', role: 'Active Debater', tag: 'Tournament Nov 2', icon: '🎙️' }
    ],
    upcomingEvent: 'Annual Campus Club Day — Booth 14 (Robotics Arena)'
  },
  lead: {
    roleId: 'lead',
    roleLabel: 'Club Lead',
    name: 'Maya Lin',
    title: 'President • MSOT Robotics Club',
    id: 'president.robotics@msot.edu',
    studentCode: 'LEAD-MSOT-7701',
    pass: 'RoboticsLeader2026#',
    badge: 'Executive Key: LEAD-7701',
    avatar: 'ML',
    stats: [
      { label: 'Club Members', value: '54', trend: '+12 this term' },
      { label: 'Allocated Budget', value: '$2,400', trend: '64% Remaining' },
      { label: 'Approved Events', value: '4', trend: 'Spring Calendar' },
      { label: 'Member Check-ins', value: '320', trend: 'Verified live' }
    ],
    clubs: [
      { name: 'MSOT Robotics Club', role: 'President & Executive Lead', tag: 'Executive Board', icon: '👑' },
      { name: 'Engineering Student Council', role: 'Club Representative', tag: 'Monthly Meeting', icon: '📐' }
    ],
    upcomingEvent: 'Autonomous Rover Demo Day & Workshop — Innovation Lab'
  },
  admin: {
    roleId: 'admin',
    roleLabel: 'Campus Admin',
    name: 'Dr. Arthur Vance',
    title: 'Dean of Student Activities & Governance',
    id: 'dean.activities@msot.edu',
    studentCode: 'ADM-MSOT-ROOT',
    pass: 'DeanCampusSecure99$',
    badge: 'Admin Token: ADM-MSOT-ROOT',
    avatar: 'AV',
    stats: [
      { label: 'Registered Clubs', value: '48', trend: 'All Verified' },
      { label: 'Active Students', value: '4,280', trend: '88% Campus-wide' },
      { label: 'Pending Charters', value: '3', trend: 'Review Queue' },
      { label: 'Compliance Audit', value: '100%', trend: 'FERPA Certified' }
    ],
    clubs: [
      { name: 'Student Activities Oversight Board', role: 'Chairperson', tag: 'Governance', icon: '🏛️' },
      { name: 'Campus Safety & Venue Permits', role: 'Approval Officer', tag: 'Administration', icon: '📋' }
    ],
    upcomingEvent: 'Fall Quarter Club Leadership Summit & Budget Allocations'
  }
};

/* --------------------------------------------------------------------------
   2. View Navigation (Login Page <-> Dashboard Page)
   -------------------------------------------------------------------------- */
function switchView(viewId) {
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update top utility visibility
  const topNav = document.getElementById('topNavUtilities');
  if (topNav) {
    topNav.style.display = viewId === 'loginView' ? 'flex' : 'none';
  }
}

// Log in as current or specific persona
function performLogin(roleKey) {
  if (roleKey && profiles[roleKey]) {
    currentRole = roleKey;
  }
  const user = profiles[currentRole];

  // Update Dashboard Profile Details
  updateDashboardUI(user);
  updateLeaderEnrollmentVisibility();

  // Switch to Dashboard
  switchView('dashboardView');
  showToast('Welcome back, ' + user.name + '!', 'Logged into ' + user.roleLabel + ' portal');
}

// Log out and return to Login Screen
function performSignOut() {
  switchView('loginView');
  showToast('Signed Out', 'You have been safely logged out of ClubSphere.');
}

/* --------------------------------------------------------------------------
   3. Dashboard UI Population
   -------------------------------------------------------------------------- */
function updateDashboardUI(user) {
  // User Header Info
  const nameEl = document.getElementById('dashUserName');
  const roleEl = document.getElementById('dashUserRole');
  const avatarEl = document.getElementById('dashUserAvatar');
  const bannerName = document.getElementById('dashBannerUserName');
  const bannerRole = document.getElementById('dashBannerUserRole');

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.roleLabel + ' • ' + user.studentCode;
  if (avatarEl) avatarEl.textContent = user.avatar;
  if (bannerName) bannerName.textContent = user.name;
  if (bannerRole) bannerRole.textContent = user.title;

  // Stats Metrics
  const statsContainer = document.getElementById('dashStatsContainer');
  if (statsContainer && user.stats) {
    statsContainer.innerHTML = user.stats.map(s => `
      <div class="metric-card">
        <span class="metric-card-label">${s.label}</span>
        <span class="metric-card-number">${s.value}</span>
        <span class="metric-trend">${s.trend}</span>
      </div>
    `).join('');
  }

  // Enrolled / Managed Clubs List
  const clubsContainer = document.getElementById('dashClubsList');
  if (clubsContainer && user.clubs) {
    clubsContainer.innerHTML = user.clubs.map(c => `
      <div class="item-row">
        <div class="item-row-info">
          <div class="item-icon">${c.icon}</div>
          <div class="item-row-text">
            <h4>${c.name}</h4>
            <p>${c.role} • <span style="color: var(--accent-teal);">${c.tag}</span></p>
          </div>
        </div>
        <button type="button" class="btn-secondary-action" onclick="openClubDetailModal('${c.name}')">View Club</button>
      </div>
    `).join('');
  }

  // Next Event Notice
  const eventNotice = document.getElementById('dashUpcomingEventText');
  if (eventNotice) eventNotice.textContent = user.upcomingEvent;
}

/* --------------------------------------------------------------------------
   4. Persona / Role Selection
   -------------------------------------------------------------------------- */
function selectRole(role) {
  currentRole = role;
  const roles = ['student', 'lead', 'admin'];

  roles.forEach(r => {
    const btn = document.getElementById('roleBtn-' + r);
    if (btn) {
      if (r === role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  fillSelectedRoleCredentials();
}

function fillSelectedRoleCredentials() {
  const data = profiles[currentRole];
  const identifierInput = document.getElementById('identifierInput');
  const passwordInput = document.getElementById('passwordInput');
  const badge = document.getElementById('identifierTypeBadge');

  if (identifierInput) identifierInput.value = data.id;
  if (passwordInput) passwordInput.value = data.pass;

  if (badge) {
    badge.textContent = data.badge;
    badge.classList.add('detected');
  }

  evaluatePasswordStrength(data.pass);
  showToast('Loaded ' + data.roleLabel + ' credentials', data.name);
}

/* --------------------------------------------------------------------------
   5. Form Inputs & Live Validation
   -------------------------------------------------------------------------- */
function handleIdentifierInput(val) {
  const badge = document.getElementById('identifierTypeBadge');
  if (!badge) return;

  if (!val || val.trim() === '') {
    badge.textContent = 'e.g. MSOT-2024-8192';
    badge.classList.remove('detected');
    return;
  }

  if (val.includes('@')) {
    badge.textContent = 'Campus Email Detected ✓';
    badge.classList.add('detected');
  } else if (/^[A-Za-z0-9\-]+$/.test(val)) {
    badge.textContent = 'Student ID Detected ✓';
    badge.classList.add('detected');
  } else {
    badge.textContent = 'Standard Login';
    badge.classList.remove('detected');
  }
}

function togglePasswordVisibility() {
  const pass = document.getElementById('passwordInput');
  const eyeOpen = document.getElementById('eyeOpenIcon');
  const eyeClosed = document.getElementById('eyeClosedIcon');

  if (!pass) return;

  if (pass.type === 'password') {
    pass.type = 'text';
    if (eyeOpen) eyeOpen.style.display = 'none';
    if (eyeClosed) eyeClosed.style.display = 'block';
  } else {
    pass.type = 'password';
    if (eyeOpen) eyeOpen.style.display = 'block';
    if (eyeClosed) eyeClosed.style.display = 'none';
  }
}

function checkCapsLock(event) {
  const alertEl = document.getElementById('capsLockAlert');
  if (!alertEl) return;

  if (event.getModifierState && event.getModifierState('CapsLock')) {
    alertEl.classList.add('show');
  } else {
    alertEl.classList.remove('show');
  }
}

function evaluatePasswordStrength(val) {
  const fill = document.getElementById('strengthMeterBar');
  const text = document.getElementById('strengthMeterText');
  if (!fill || !text) return;

  if (!val || val.length === 0) {
    fill.style.width = '0%';
    text.textContent = '';
    return;
  }

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.style.backgroundColor = '#f43f5e';
    text.textContent = 'Weak';
    text.style.color = '#f43f5e';
  } else if (score <= 2) {
    fill.style.width = '50%';
    fill.style.backgroundColor = '#f59e0b';
    text.textContent = 'Fair';
    text.style.color = '#f59e0b';
  } else if (score <= 3) {
    fill.style.width = '75%';
    fill.style.backgroundColor = '#38bdf8';
    text.textContent = 'Good';
    text.style.color = '#38bdf8';
  } else {
    fill.style.width = '100%';
    fill.style.backgroundColor = '#14b8a6';
    text.textContent = 'Strong';
    text.style.color = '#14b8a6';
  }
}

/* --------------------------------------------------------------------------
   6. Form Submit Flow (Password Login)
   -------------------------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('loginSubmitBtn');
  const btnText = document.getElementById('btnText');
  const btnArrow = document.getElementById('btnArrow');
  const btnSpinner = document.getElementById('btnSpinner');

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Authenticating...';
  if (btnArrow) btnArrow.style.display = 'none';
  if (btnSpinner) btnSpinner.style.display = 'block';

  setTimeout(() => {
    if (btnText) btnText.textContent = 'Loading Dashboard...';

    setTimeout(() => {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Login';
      if (btnArrow) btnArrow.style.display = 'block';
      if (btnSpinner) btnSpinner.style.display = 'none';

      performLogin();
    }, 800);
  }, 700);
}

/* --------------------------------------------------------------------------
   7. QR Code Tab & Instant Scan Simulator
   -------------------------------------------------------------------------- */
function switchLoginMode(mode) {
  const form = document.getElementById('loginForm');
  const qr = document.getElementById('qrCodeContainer');
  const tabForm = document.getElementById('modeTab-form');
  const tabQr = document.getElementById('modeTab-qr');

  if (mode === 'form') {
    if (form) form.style.display = 'flex';
    if (qr) qr.style.display = 'none';
    if (tabForm) tabForm.classList.add('active');
    if (tabQr) tabQr.classList.remove('active');
    if (qrTimerInterval) clearInterval(qrTimerInterval);
  } else {
    if (form) form.style.display = 'none';
    if (qr) qr.style.display = 'flex';
    if (tabQr) tabQr.classList.add('active');
    if (tabForm) tabForm.classList.remove('active');
    startQrTimer();
  }
}

function startQrTimer() {
  if (qrTimerInterval) clearInterval(qrTimerInterval);
  qrTimeLeft = 45;
  const el = document.getElementById('qrTimer');
  if (el) el.textContent = qrTimeLeft + 's';

  qrTimerInterval = setInterval(() => {
    qrTimeLeft--;
    if (qrTimeLeft <= 0) {
      qrTimeLeft = 45;
      showToast('QR Token Refreshed', 'Fresh dynamic single-use token created');
    }
    if (el) el.textContent = qrTimeLeft + 's';
  }, 1000);
}

// Simulates scanning the QR with the mobile app
function simulateMobileQrScan() {
  showToast('Phone Scanner Detected', 'iPhone 15 Pro authorized via biometric Face ID...');
  setTimeout(() => {
    performLogin('student');
  }, 1000);
}

/* --------------------------------------------------------------------------
   8. SSO Handlers (Google & Campus Active Directory)
   -------------------------------------------------------------------------- */
function openGoogleSsoModal() {
  openModal('googleSsoModal');
}

function selectGoogleAccount(roleKey) {
  closeModal('googleSsoModal');
  showToast('Google OAuth 2.0 Success', 'Authenticated via Google Workspace');
  setTimeout(() => {
    performLogin(roleKey);
  }, 500);
}

function openCampusSsoModal() {
  openModal('campusSsoModal');
}

function confirmCampusSso() {
  closeModal('campusSsoModal');
  showToast('MSOT Directory Connected', 'Single Sign-On session validated');
  setTimeout(() => {
    performLogin('student');
  }, 600);
}

/* --------------------------------------------------------------------------
   9. Multi-Step Forgot Password Wizard
   -------------------------------------------------------------------------- */
function goToResetStep(stepNum) {
  document.querySelectorAll('.reset-step-pane').forEach(p => p.classList.remove('active-step'));
  const target = document.getElementById('resetStep-' + stepNum);
  if (target) target.classList.add('active-step');
}

function handleResetSendCode() {
  const input = document.getElementById('resetIdentifierInput');
  const val = input ? input.value : 'student@msot.edu';
  showToast('Security Code Dispatched', '6-digit OTP sent to ' + val);
  goToResetStep(2);
}

function handleResetVerifyCode() {
  showToast('Code Verified', 'Identity confirmed. Enter your new password.');
  goToResetStep(3);
}

function handleResetFinish() {
  const newPass = document.getElementById('resetNewPassInput').value;
  const passInput = document.getElementById('passwordInput');
  if (passInput) passInput.value = newPass;

  goToResetStep(4);
}

function closeResetAndReturn() {
  closeModal('forgotModal');
  goToResetStep(1);
  showToast('Password Updated', 'Your credentials have been updated.');
}

/* --------------------------------------------------------------------------
   10. Registration / Account Request Handler
   -------------------------------------------------------------------------- */
function handleRegistrationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regNameInput').value;
  closeModal('registerModal');
  showToast('Account Request Logged', 'Ticket #MSOT-REQ-8491 generated for ' + name);
}

/* --------------------------------------------------------------------------
   11. Feature Explorer Modal (Hero Cards Click)
   -------------------------------------------------------------------------- */
const featureDetails = {
  clubs: {
    title: 'Club Management',
    desc: 'Empower student leaders to manage rosters, designate executive roles, conduct verified voting elections, and submit annual university budget requests.',
    stat1: '48+', lbl1: 'Active Clubs',
    stat2: '1,200+', lbl2: 'Leaders',
    stat3: '100%', lbl3: 'Chartered',
    roleTarget: 'lead'
  },
  planning: {
    title: 'Club Day Planning',
    desc: 'Automated campus booth reservations, safety permits, electrical requests, and central collegiate scheduling calendar.',
    stat1: '12', lbl1: 'Yearly Events',
    stat2: '450+', lbl2: 'Booth Spaces',
    stat3: 'Oct 18', lbl3: 'Next Club Day',
    roleTarget: 'lead'
  },
  attendance: {
    title: 'Attendance Check-in',
    desc: 'Dynamic rotating QR code validation paired with campus geofencing ensures zero proxy check-ins and verified participation timestamps.',
    stat1: '45s', lbl1: 'Dynamic QR',
    stat2: '0.0%', lbl2: 'Proxy Margin',
    stat3: '3,420', lbl3: 'Monthly Scans',
    roleTarget: 'student'
  },
  submissions: {
    title: 'Submissions & Evaluation',
    desc: 'Streamlined upload portal for post-event financial receipts, attendee surveys, scorecards, and faculty advisor rubric evaluations.',
    stat1: '94%', lbl1: 'On-time Filing',
    stat2: '4.8/5', lbl2: 'Rating Rubric',
    stat3: '24h', lbl3: 'Approval Time',
    roleTarget: 'lead'
  },
  certificates: {
    title: 'Certificates & Transcript',
    desc: 'Issue official tamper-proof cryptographic PDF certificates and a verified co-curricular transcript for graduate school and job interviews.',
    stat1: '100%', lbl1: 'E-Signed',
    stat2: 'FERPA', lbl2: 'Compliant',
    stat3: 'Direct PDF', lbl3: 'Instant Export',
    roleTarget: 'student'
  },
  analytics: {
    title: 'Reports & Analytics',
    desc: 'Comprehensive oversight for campus deans and accreditation boards: track demographics, growth trends, student retention, and budget utilization.',
    stat1: '88%', lbl1: 'Participation',
    stat2: 'Real-time', lbl2: 'Live Pulse',
    stat3: 'SOC-2', lbl3: 'Certified',
    roleTarget: 'admin'
  }
};

let selectedFeatureTarget = 'student';

function openFeatureExplorer(featureKey) {
  const feat = featureDetails[featureKey];
  if (!feat) return;

  selectedFeatureTarget = feat.roleTarget;

  document.getElementById('featExpTitle').textContent = feat.title;
  document.getElementById('featExpDesc').textContent = feat.desc;
  document.getElementById('featExpStat1').textContent = feat.stat1;
  document.getElementById('featExpLbl1').textContent = feat.lbl1;
  document.getElementById('featExpStat2').textContent = feat.stat2;
  document.getElementById('featExpLbl2').textContent = feat.lbl2;
  document.getElementById('featExpStat3').textContent = feat.stat3;
  document.getElementById('featExpLbl3').textContent = feat.lbl3;

  openModal('featureDetailModal');
}

function launchFeatureDemo() {
  closeModal('featureDetailModal');
  performLogin(selectedFeatureTarget);
}

/* --------------------------------------------------------------------------
   12. Dashboard Interactive Simulators
   -------------------------------------------------------------------------- */
// Simulate student check-in
function simulateAttendanceCheckIn() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  showToast('Verified Check-In! ⚡', 'Logged 2 hours for today at ' + timeStr);
}

// Open transcript viewer
function openTranscriptModal() {
  openModal('transcriptModal');
}

function printTranscript() {
  window.print();
}

// Open club details
function openClubDetailModal(clubName) {
  document.getElementById('clubDetailTitle').textContent = clubName;
  openModal('clubDetailModal');
}

/* --------------------------------------------------------------------------
   13. Modal Management (Open, Close, Click Outside, Escape)
   -------------------------------------------------------------------------- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function initFormListeners() {
  document.querySelectorAll('.modal-layer').forEach(layer => {
    layer.addEventListener('click', (e) => {
      if (e.target === layer) {
        layer.classList.remove('open');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-layer.open').forEach(m => m.classList.remove('open'));
    }
  });
}

/* --------------------------------------------------------------------------
   14. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(title, message) {
  const toast = document.getElementById('toastNotification');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMessage');

  if (!toast) return;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* --------------------------------------------------------------------------
   15. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const saved = localStorage.getItem('clubsphere-theme');
  if (saved === 'light') {
    applyTheme(true);
  }
}

function toggleTheme() {
  applyTheme(!isLightMode);
}

function applyTheme(light) {
  isLightMode = light;
  const html = document.documentElement;
  const sun = document.getElementById('sunIcon');
  const moon = document.getElementById('moonIcon');

  if (isLightMode) {
    html.classList.add('light');
    if (sun) sun.style.display = 'none';
    if (moon) moon.style.display = 'block';
    localStorage.setItem('clubsphere-theme', 'light');
    showToast('Light Theme Active', 'Clean daylight palette applied');
  } else {
    html.classList.remove('light');
    if (sun) sun.style.display = 'block';
    if (moon) moon.style.display = 'none';
    localStorage.setItem('clubsphere-theme', 'dark');
    showToast('Dark Theme Active', 'Twilight glassmorphism palette applied');
  }
}

/* --------------------------------------------------------------------------
   16. Interactive Constellation Canvas (Connected Nodes)
   -------------------------------------------------------------------------- */
function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2.5 + 1.5;
      this.color = Math.random() > 0.4 ? 'rgba(45, 212, 191, ' : 'rgba(56, 189, 248, ';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.75)';
      ctx.fill();
    }
  }

  for (let i = 0; i < 28; i++) {
    particles.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.25 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   15. Club Lead: Verified Student Enrollment (front-end demo)
   -------------------------------------------------------------------------- */
const enrollmentStorageKey = 'clubsphere.demo.enrolledStudents';
let lastGeneratedEnrollmentCredentials = null;

function getEnrolledStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(enrollmentStorageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveEnrolledStudents(students) {
  try {
    localStorage.setItem(enrollmentStorageKey, JSON.stringify(students));
    return true;
  } catch (error) {
    showToast('Could not save student', 'Browser storage is unavailable. Please try again.');
    return false;
  }
}

function makeTemporaryPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const values = new Uint32Array(length);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(values);
    return Array.from(values, value => chars[value % chars.length]).join('');
  }
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function makeStudentId(students) {
  const year = new Date().getFullYear();
  let sequence = students.length + 1;
  let id = '';
  do {
    id = `MSOT-${year}-${String(sequence).padStart(4, '0')}`;
    sequence++;
  } while (students.some(student => student.studentId === id));
  return id;
}

function enrollVerifiedStudent(event) {
  event.preventDefault();

  // Only the Club Lead persona can use this demo action.
  if (currentRole !== 'lead') {
    showToast('Club Lead access required', 'Sign in as a Club Lead to add a verified student.');
    return;
  }

  const name = document.getElementById('enrollStudentName').value.trim();
  const email = document.getElementById('enrollStudentEmail').value.trim().toLowerCase();
  const rollNumber = document.getElementById('enrollStudentRoll').value.trim();
  const club = document.getElementById('enrollStudentClub').value.trim();
  const verified = document.getElementById('enrollStudentVerified').checked;

  if (!name || !email || !rollNumber || !club || !verified) {
    showToast('Complete verification first', 'Enter all student details and confirm verification.');
    return;
  }

  const students = getEnrolledStudents();
  const duplicate = students.some(student =>
    student.email.toLowerCase() === email || student.rollNumber.toLowerCase() === rollNumber.toLowerCase()
  );
  if (duplicate) {
    showToast('Student already added', 'That email or college roll number is already in this demo roster.');
    return;
  }

  const student = {
    name,
    email,
    rollNumber,
    club,
    studentId: makeStudentId(students),
    temporaryPassword: makeTemporaryPassword(),
    verifiedAt: new Date().toISOString(),
    createdBy: profiles.lead.name
  };

  students.unshift(student);
  if (!saveEnrolledStudents(students)) return;

  lastGeneratedEnrollmentCredentials = student;
  document.getElementById('generatedStudentId').textContent = student.studentId;
  document.getElementById('generatedStudentPassword').textContent = student.temporaryPassword;
  document.getElementById('enrollmentCredentialResult').hidden = false;
  document.getElementById('leaderEnrollmentForm').reset();
  renderEnrolledStudentRoster();
  showToast('Verified student added', `${student.name} has been added to the ${club} roster.`);
}

function renderEnrolledStudentRoster() {
  const roster = document.getElementById('enrolledStudentRoster');
  const count = document.getElementById('enrolledStudentCount');
  if (!roster || !count) return;

  const students = getEnrolledStudents();
  count.textContent = String(students.length);
  if (!students.length) {
    roster.innerHTML = '<p class="enrollment-empty">No students added yet.</p>';
    return;
  }

  roster.innerHTML = students.map(student => `
    <article class="enrolled-student-row">
      <div class="enrolled-student-avatar">${escapeEnrollmentHtml(student.name.slice(0, 1).toUpperCase())}</div>
      <div class="enrolled-student-info">
        <strong>${escapeEnrollmentHtml(student.name)}</strong>
        <span>${escapeEnrollmentHtml(student.studentId)} · ${escapeEnrollmentHtml(student.club)}</span>
      </div>
      <span class="enrolled-verified-label">✓ Verified</span>
    </article>
  `).join('');
}

function escapeEnrollmentHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

async function copyEnrollmentCredentials() {
  if (!lastGeneratedEnrollmentCredentials) return;
  const text = `ClubSphere Student ID: ${lastGeneratedEnrollmentCredentials.studentId}\nTemporary password: ${lastGeneratedEnrollmentCredentials.temporaryPassword}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Credentials copied', 'Share them with the student through a secure channel.');
  } catch (error) {
    showToast('Copy unavailable', 'Please copy the ID and temporary password manually.');
  }
}

function updateLeaderEnrollmentVisibility() {
  const panel = document.getElementById('leaderEnrollmentPanel');
  if (!panel) return;
  panel.hidden = currentRole !== 'lead';
  if (currentRole === 'lead') renderEnrolledStudentRoster();
}

document.addEventListener('DOMContentLoaded', updateLeaderEnrollmentVisibility);
