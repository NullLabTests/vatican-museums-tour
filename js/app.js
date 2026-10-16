let allArtworks = [];

function scrollToCollection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadData() {
  try {
    const res = await fetch('data/artworks.json');
    const data = await res.json();
    allArtworks = data.collections;
    renderCollections(allArtworks);
    renderTimeline();
  } catch (e) {
    console.error('Failed to load data:', e);
  }
}

function renderCollections(collections) {
  const container = document.getElementById('collections-container');
  container.innerHTML = collections.map(col => `
    <section class="collection-section" id="${col.id}">
      <div class="container">
        <div class="collection-header">
          <h2>${col.name}</h2>
          ${col.italian_name ? `<span class="italian-name">${col.italian_name}</span>` : ''}
        </div>
        <div class="collection-meta">
          ${col.period ? `<span>Period: ${col.period}</span>` : ''}
          ${col.room_number ? `<span>Room: ${col.room_number}</span>` : ''}
          <span>Artworks: ${col.artworks.length}</span>
        </div>
        ${col.description ? `<p class="collection-description">${col.description}</p>` : ''}
        <div class="artwork-grid">
          ${col.artworks.map(art => `
            <div class="artwork-card${art.highlight ? ' highlight' : ''}" data-search="${(art.title + ' ' + art.artist + ' ' + art.description + ' ' + art.location).toLowerCase()}">
              <div class="image-wrapper">
                <div class="image-placeholder">
                  <span>${art.title}<br>${art.artist}</span>
                </div>
              </div>
              <div class="card-body">
                ${art.highlight ? '<span class="badge-highlight">Highlight</span>' : ''}
                <h3>${art.title}</h3>
                <div class="artist">${art.artist}</div>
                <div class="date">${art.date}</div>
                ${art.medium ? `<div class="medium">${art.medium}</div>` : ''}
                <div class="description">${art.description}</div>
                <div class="location">Location: ${art.location}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `).join('');
}

function renderTimeline() {
  const container = document.getElementById('timeline-container');
  const routeSteps = [
    { name: 'Entrance', desc: 'Viale Vaticano — ticketing, security, cloakroom' },
    { name: 'Cortile della Pigna', desc: 'Open-air courtyard with the bronze Pinecone and Pomodoro\'s Sphere', id: 'sfera-con-sfera' },
    { name: 'Egyptian Museum', desc: 'Nine rooms of mummies, sarcophagi, and ancient Egyptian artifacts', id: 'museo-gregoriano-egizio' },
    { name: 'Chiaramonti Museum', desc: 'Long loggia with ~1,000 Roman portrait busts', id: 'museo-chiaramonti' },
    { name: 'Braccio Nuovo', desc: '68m neoclassical gallery with Augustus of Prima Porta', id: 'braccio-nuovo' },
    { name: 'Pio-Clementino Museum', desc: 'Laocoön, Apollo Belvedere, Belvedere Torso, Sleeping Ariadne', id: 'museo-pio-clementino' },
    { name: 'Etruscan Museum', desc: '22 rooms of Etruscan gold, bronzes, and vases', id: 'museo-gregoriano-etrusco' },
    { name: 'Gallery of the Candelabra', desc: '~80m corridor with ancient statues and marble candelabra', id: 'galleria-candelabri' },
    { name: 'Gallery of the Tapestries', desc: 'Raphael tapestries and ancient pontifical weavings', id: 'galleria-arazzi' },
    { name: 'Gallery of the Maps', desc: '120m corridor with 40 frescoed maps of Italy', id: 'galleria-carte-geografiche' },
    { name: 'Raphael Rooms', desc: 'Four stanze frescoed by Raphael — School of Athens', id: 'stanze-raffaello' },
    { name: 'Sistine Chapel', desc: 'Michelangelo\'s ceiling and Last Judgment — the culmination', id: 'sistine-chapel' },
    { name: 'Exit — Bramante Staircase', desc: 'Giuseppe Momo\'s double-helix spiral staircase', id: 'bramante-staircase' }
  ];

  container.innerHTML = routeSteps.map((step, i) => `
    <div class="timeline-item">
      <div class="step-num">Step ${i + 1}</div>
      <h4>${step.name}</h4>
      <p>${step.desc}</p>
      ${step.id ? `<a href="#${step.id}" onclick="scrollToCollection('${step.id}'); return false;">View Collection &rarr;</a>` : ''}
    </div>
  `).join('');
}

function filterArtworks() {
  const q = document.getElementById('search-input').value.toLowerCase().trim();
  if (!q) {
    renderCollections(allArtworks);
    return;
  }

  const filtered = allArtworks.map(col => ({
    ...col,
    artworks: col.artworks.filter(art =>
      (art.title + ' ' + art.artist + ' ' + art.description + ' ' + art.location).toLowerCase().includes(q)
    )
  })).filter(col => col.artworks.length > 0);

  renderCollections(filtered);
  if (filtered.length > 0) {
    document.getElementById(filtered[0].id).scrollIntoView({ behavior: 'smooth' });
  }
}

document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') filterArtworks();
});

window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  btn.classList.toggle('visible', window.scrollY > 500);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

loadData();
