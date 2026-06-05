
  
  

  const defaultProjects = [
    {
      title: "To-Do App",
      stack: "React · LocalStorage",
      desc: "Application de gestion de tâches avec CRUD complet, filtres et persistance locale.",
      github: "#", demo: "#"
    },
    {
      title: "API REST Blog",
      stack: "Node.js · Express · MongoDB",
      desc: "Back-end d'un blog : authentification JWT, routes CRUD pour articles et commentaires.",
      github: "#", demo: "#"
    },
    {
      title: "Weather App",
      stack: "JavaScript · Fetch API",
      desc: "Application météo connectée à une API externe avec affichage des prévisions sur 5 jours.",
      github: "#", demo: "#"
    }
  ];

  
  function renderProjects() {
    const projects = JSON.parse(localStorage.getItem('portfolio_projects') || 'null') || defaultProjects;
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(p => `
      <div class="project-card reveal">
        <div class="project-stack">${p.stack}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-links">
          <a href="${p.github}">GitHub →</a>
          <a href="${p.demo}">Live →</a>
        </div>
      </div>
    `).join('');
    observeReveal();
  }

  
  function openLoginModal() {
    document.getElementById('login-modal').classList.add('open');
    setTimeout(() => document.getElementById('admin-pw').focus(), 300);
  }
  function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('open');
    document.getElementById('admin-pw').value = '';
    document.getElementById('login-err').style.display = 'none';
  }
  async function tryLogin() {
  const pw = document.getElementById('admin-pw').value;
  
  try {
    const response = await fetch('https://portfolio-vp43.vercel.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      closeLoginModal();
      openAdmin();
    } else {
      document.getElementById('login-err').style.display = 'block';
      document.getElementById('admin-pw').value = '';
    }
  } catch (err) {
    document.getElementById('login-err').style.display = 'block';
  }
}

  function openAdmin() {
    
    const name = document.getElementById('hero-name');
    document.getElementById('e-name').value = name.innerHTML.replace(/<br\/?>/g,'').replace(/<em>/g,'').replace(/<\/em>/g,'').trim().split(/\s+/).join(' ');
    document.getElementById('e-sub').value = document.getElementById('hero-sub').textContent;
    document.getElementById('e-p1').value = document.getElementById('about-p1').innerHTML.replace(/<[^>]+>/g,'');
    document.getElementById('e-p2').value = document.getElementById('about-p2').innerHTML.replace(/<[^>]+>/g,'');
    document.getElementById('e-p3').value = document.getElementById('about-p3').innerHTML.replace(/<[^>]+>/g,'');
    document.getElementById('e-o1t').value = document.getElementById('obj-1-title').textContent;
    document.getElementById('e-o1d').value = document.getElementById('obj-1-desc').textContent;
    document.getElementById('e-o2t').value = document.getElementById('obj-2-title').textContent;
    document.getElementById('e-o2d').value = document.getElementById('obj-2-desc').textContent;
    document.getElementById('e-o3t').value = document.getElementById('obj-3-title').textContent;
    document.getElementById('e-o3d').value = document.getElementById('obj-3-desc').textContent;

    const panel = document.getElementById('admin-panel');
    panel.style.display = 'block';
    setTimeout(() => panel.classList.add('open'), 10);
  }
  function closeAdmin() {
    const panel = document.getElementById('admin-panel');
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 300);
  }

  function saveChanges() {
    const nameParts = document.getElementById('e-name').value.trim().split(' ');
    const last = nameParts.pop();
    document.getElementById('hero-name').innerHTML = nameParts.join(' ') + '<br/><em>' + last + '</em>';
    document.getElementById('hero-sub').textContent = document.getElementById('e-sub').value;
    document.getElementById('about-p1').textContent = document.getElementById('e-p1').value;
    document.getElementById('about-p2').textContent = document.getElementById('e-p2').value;
    document.getElementById('about-p3').textContent = document.getElementById('e-p3').value;
    document.getElementById('obj-1-title').textContent = document.getElementById('e-o1t').value;
    document.getElementById('obj-1-desc').textContent = document.getElementById('e-o1d').value;
    document.getElementById('obj-2-title').textContent = document.getElementById('e-o2t').value;
    document.getElementById('obj-2-desc').textContent = document.getElementById('e-o2d').value;
    document.getElementById('obj-3-title').textContent = document.getElementById('e-o3t').value;
    document.getElementById('obj-3-desc').textContent = document.getElementById('e-o3d').value;

    
    localStorage.setItem('portfolio_content', JSON.stringify({
      name: document.getElementById('e-name').value,
      sub: document.getElementById('e-sub').value
    }));

    const c = document.getElementById('save-confirm');
    c.style.display = 'block';
    setTimeout(() => c.style.display = 'none', 2500);
  }
  function submitContact() {
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const msg = document.getElementById('c-msg').value.trim();
    const el = document.getElementById('form-msg');

    if (!name || !email || !msg) {
      el.className = 'err';
      el.textContent = '✗ Merci de remplir tous les champs obligatoires.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      el.className = 'err';
      el.textContent = '✗ Adresse email invalide.';
      return;
    }

    
    el.className = 'ok';
    el.textContent = '✓ Message reçu ! Je vous réponds sous 24h.';
    ['c-name','c-email','c-subject','c-msg'].forEach(id => document.getElementById(id).value = '');
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  function observeReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  renderProjects();
  observeReveal();

  document.getElementById('login-modal').addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });
