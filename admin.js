firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const lockedEl = document.getElementById('adminLocked');
const panelEl = document.getElementById('adminPanel');
const adminError = document.getElementById('adminError');
const adminSigninBtn = document.getElementById('adminSigninBtn');
const adminSignoutBtn = document.getElementById('adminSignout');
const adminEmailEl = document.getElementById('adminEmail');

const pendingList = document.getElementById('pendingList');
const approvedList = document.getElementById('approvedList');
const rejectedList = document.getElementById('rejectedList');

adminSigninBtn.addEventListener('click', () => {
  adminError.textContent = '';
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => {
    adminError.textContent = 'Sign-in failed: ' + err.message;
  });
});

adminSignoutBtn.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged((user) => {
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    panelEl.style.display = 'none';
    lockedEl.style.display = 'block';
    if (user && !ADMIN_EMAILS.includes(user.email)) {
      adminError.textContent = 'Signed in as ' + user.email + ', which is not an admin account.';
    }
    return;
  }
  lockedEl.style.display = 'none';
  panelEl.style.display = 'block';
  adminEmailEl.textContent = user.email;
  loadRequests();
});

function loadRequests() {
  db.collection('accessRequests').orderBy('requestedAt', 'desc').onSnapshot((snap) => {
    const pending = [], approved = [], rejected = [];
    snap.forEach(doc => {
      const data = { id: doc.id, ...doc.data() };
      if (data.status === 'approved') approved.push(data);
      else if (data.status === 'rejected') rejected.push(data);
      else pending.push(data);
    });
    renderList(pendingList, pending, ['approve', 'reject']);
    renderList(approvedList, approved, ['revoke']);
    renderList(rejectedList, rejected, ['approve']);
  }, (err) => {
    pendingList.innerHTML = '<p class="empty-note">Error loading requests: ' + err.message + '</p>';
  });
}

function renderList(container, items, actions) {
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-note">Nothing here yet.</p>';
    return;
  }
  container.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'req-row';
    row.innerHTML = `
      <div class="req-info">
        <div class="req-name">${escapeHtml(item.name || '(no name)')}</div>
        <div class="req-email">${escapeHtml(item.email || '')}</div>
      </div>
      <div class="req-actions"></div>
    `;
    const actionsEl = row.querySelector('.req-actions');
    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = action;
      btn.textContent = action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Revoke';
      btn.addEventListener('click', () => setStatus(item.id, action === 'revoke' ? 'rejected' : action + 'd'));
      actionsEl.appendChild(btn);
    });
    container.appendChild(row);
  });
}

function setStatus(id, status) {
  db.collection('accessRequests').doc(id).update({ status }).catch(err => {
    alert('Could not update: ' + err.message);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
