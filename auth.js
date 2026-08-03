// Access gate: sign in with Google, check approval status in Firestore,
// show the site only once an admin has approved this user.

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const gateEl = document.getElementById('accessGate');
const siteEl = document.getElementById('siteContent');
const gateError = document.getElementById('gateError');
const signinBtn = document.getElementById('googleSigninBtn');
const signoutBtn = document.getElementById('gateSignout');
const signoutRejectedBtn = document.getElementById('gateSignoutRejected');

signinBtn.addEventListener('click', () => {
  gateError.textContent = '';
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => {
    gateError.textContent = 'Sign-in failed: ' + err.message;
  });
});

signoutBtn?.addEventListener('click', () => auth.signOut());
signoutRejectedBtn?.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    showGateState('signedout');
    return;
  }

  const ref = db.collection('accessRequests').doc(user.uid);
  let snap;
  try {
    snap = await ref.get();
  } catch (err) {
    gateError.textContent = 'Could not check access status: ' + err.message;
    showGateState('signedout');
    return;
  }

  if (!snap.exists) {
    // First time this user has signed in — log a pending request for the admin.
    try {
      await ref.set({
        name: user.displayName || '',
        email: user.email,
        status: 'pending',
        requestedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      gateError.textContent = 'Could not submit your request: ' + err.message;
      showGateState('signedout');
      return;
    }
    showGateState('pending', user);
    return;
  }

  const data = snap.data();
  if (data.status === 'approved') {
    showSite();
  } else if (data.status === 'rejected') {
    showGateState('rejected', user);
  } else {
    showGateState('pending', user);
  }
});

function showGateState(state, user) {
  siteEl.style.display = 'none';
  gateEl.style.display = 'flex';
  document.querySelectorAll('.gate-state').forEach(el => el.hidden = true);
  document.getElementById('gate-' + state).hidden = false;
  if (user) {
    document.querySelectorAll('.gate-user-email').forEach(el => el.textContent = user.email);
  }
}

function showSite() {
  gateEl.style.display = 'none';
  siteEl.style.display = '';
}
