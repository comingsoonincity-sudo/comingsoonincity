// City + category filtering (combined)
  const cityChips = document.querySelectorAll('.city-chip:not(.disabled)');
  const catChips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');

  let currentCity = 'all';
  let currentCat = 'all';

  function applyFilters(){
    cards.forEach(card => {
      const cityMatch = (currentCity === 'all' || card.dataset.city === currentCity);
      const catMatch = (currentCat === 'all' || card.dataset.cat === currentCat);
      card.style.display = (cityMatch && catMatch) ? '' : 'none';
    });
  }

  cityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCity = chip.dataset.city;
      applyFilters();
    });
  });

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCat = chip.dataset.filter;
      applyFilters();
    });
  });

  // Connect assistant modal (gated by admin approval)
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  const startButtons = document.querySelectorAll('.start-btn');
  const chatOverlay = document.getElementById('chatOverlay');
  const chatClose = document.getElementById('chatClose');

  const gateStates = ['chatGateSignedout', 'chatGatePending', 'chatGateRejected', 'chatApproved']
    .map(id => document.getElementById(id));

  const chatBizNameA = document.getElementById('chatBizNameA');
  const chatSigninBtn = document.getElementById('chatSigninBtn');
  const chatGateError = document.getElementById('chatGateError');
  const chatGateSignout = document.getElementById('chatGateSignout');
  const chatGateSignoutRejected = document.getElementById('chatGateSignoutRejected');

  const chatBizName = document.getElementById('chatBizName');
  const chatYoutube = document.getElementById('chatYoutube');
  const chatInstagram = document.getElementById('chatInstagram');
  const chatWhatsappBtn = document.getElementById('chatWhatsappBtn');
  const chatWaJoin = document.getElementById('chatWaJoin');
  const chatWaBuy = document.getElementById('chatWaBuy');
  const chatMainOptions = document.getElementById('chatMainOptions');
  const chatWaOptions = document.getElementById('chatWaOptions');
  const chatBack = document.getElementById('chatBack');

  let selectedBtn = null;
  let unsubscribeRequest = null;

  function showGateState(id) {
    gateStates.forEach(el => el.hidden = (el.id !== id));
  }

  function openChat(btn) {
    selectedBtn = btn;
    chatOverlay.classList.add('open');
    chatOverlay.setAttribute('aria-hidden', 'false');
    refreshGate();
  }

  function closeChat() {
    chatOverlay.classList.remove('open');
    chatOverlay.setAttribute('aria-hidden', 'true');
    chatMainOptions.hidden = false;
    chatWaOptions.hidden = true;
    if (unsubscribeRequest) { unsubscribeRequest(); unsubscribeRequest = null; }
  }

  function refreshGate() {
    if (unsubscribeRequest) { unsubscribeRequest(); unsubscribeRequest = null; }

    const user = auth.currentUser;
    if (!user) {
      chatBizNameA.textContent = (selectedBtn && selectedBtn.dataset.name) || 'this business';
      showGateState('chatGateSignedout');
      return;
    }

    document.querySelectorAll('.chat-user-email').forEach(el => el.textContent = user.email);

    const ref = db.collection('accessRequests').doc(user.uid);
    unsubscribeRequest = ref.onSnapshot(async (snap) => {
      if (!snap.exists) {
        try {
          await ref.set({
            name: user.displayName || '',
            email: user.email,
            status: 'pending',
            requestedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (err) {
          chatGateError.textContent = 'Could not submit request: ' + err.message;
        }
        return; // onSnapshot will fire again once the doc exists
      }
      const data = snap.data();
      if (data.status === 'approved') {
        showApprovedOptions();
      } else if (data.status === 'rejected') {
        showGateState('chatGateRejected');
      } else {
        showGateState('chatGatePending');
      }
    }, (err) => {
      chatGateError.textContent = 'Could not check access: ' + err.message;
    });
  }

  function showApprovedOptions() {
    if (!selectedBtn) return;
    chatBizName.textContent = selectedBtn.dataset.name || 'this business';
    chatYoutube.href = selectedBtn.dataset.youtube || '#';
    chatInstagram.href = selectedBtn.dataset.instagram || '#';
    chatWaJoin.href = selectedBtn.dataset.waJoin || '#';
    chatWaBuy.href = selectedBtn.dataset.waBuy || '#';
    chatMainOptions.hidden = false;
    chatWaOptions.hidden = true;
    showGateState('chatApproved');
  }

  startButtons.forEach(btn => {
    btn.addEventListener('click', () => openChat(btn));
  });

  chatClose.addEventListener('click', closeChat);
  chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) closeChat();
  });

  chatSigninBtn.addEventListener('click', () => {
    chatGateError.textContent = '';
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
      chatGateError.textContent = 'Sign-in failed: ' + err.message;
    });
  });

  chatGateSignout?.addEventListener('click', () => auth.signOut());
  chatGateSignoutRejected?.addEventListener('click', () => auth.signOut());

  auth.onAuthStateChanged(() => {
    if (chatOverlay.classList.contains('open')) refreshGate();
  });

  chatWhatsappBtn.addEventListener('click', () => {
    chatMainOptions.hidden = true;
    chatWaOptions.hidden = false;
  });

  chatBack.addEventListener('click', () => {
    chatWaOptions.hidden = true;
    chatMainOptions.hidden = false;
  });

  // Notify form (front-end only demo)
  const form = document.getElementById('notifyForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.style.display = 'block';
    form.reset();
  });
