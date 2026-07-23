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

  // Connect assistant modal
  const startButtons = document.querySelectorAll('.start-btn');
  const chatOverlay = document.getElementById('chatOverlay');
  const chatClose = document.getElementById('chatClose');
  const chatBizName = document.getElementById('chatBizName');
  const chatYoutube = document.getElementById('chatYoutube');
  const chatInstagram = document.getElementById('chatInstagram');
  const chatWhatsappBtn = document.getElementById('chatWhatsappBtn');
  const chatWaJoin = document.getElementById('chatWaJoin');
  const chatWaBuy = document.getElementById('chatWaBuy');
  const chatMainOptions = document.getElementById('chatMainOptions');
  const chatWaOptions = document.getElementById('chatWaOptions');
  const chatBack = document.getElementById('chatBack');

  function openChat(btn){
    chatBizName.textContent = btn.dataset.name || 'this business';
    chatYoutube.href = btn.dataset.youtube || '#';
    chatInstagram.href = btn.dataset.instagram || '#';
    chatWaJoin.href = btn.dataset.waJoin || '#';
    chatWaBuy.href = btn.dataset.waBuy || '#';
    chatMainOptions.hidden = false;
    chatWaOptions.hidden = true;
    chatOverlay.classList.add('open');
    chatOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeChat(){
    chatOverlay.classList.remove('open');
    chatOverlay.setAttribute('aria-hidden', 'true');
  }

  startButtons.forEach(btn => {
    btn.addEventListener('click', () => openChat(btn));
  });

  chatClose.addEventListener('click', closeChat);
  chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) closeChat();
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
