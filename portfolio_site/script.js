// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.classList.toggle('dark', savedTheme === 'dark');
themeToggle.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch projects
const grid = document.getElementById('projectGrid');
const chips = document.querySelectorAll('.chip, .nav a[data-filter]');

let activeFilter = 'all';

function render(projects) {
  grid.innerHTML = '';
  const filtered = projects.filter(p => activeFilter === 'all' ? true : p.category === activeFilter);
  filtered.forEach(p => {
    const a = document.createElement('a');
    a.href = p.url || '#';
    a.className = 'card';
    a.target = p.url ? '_blank' : '';
    a.rel = 'noopener';
    a.innerHTML = `
      <img class="thumb" src="${p.thumb || 'assets/placeholder.webp'}" alt="${p.title} thumbnail" loading="lazy" />
      <div class="card-body">
        <h3>${p.shortCode || ''} ${p.title}</h3>
        <div class="meta">${p.tags?.join(', ') || ''} ${p.year ? '· ' + p.year : ''}</div>
        <div class="tags">${(p.category ? [`<span class="tag">${p.category}</span>`] : []).join('')}</div>
      </div>`;
    grid.appendChild(a);
  });
}

function setActive(filter) {
  activeFilter = filter;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.filter === filter || (filter === 'all' && c.dataset.filter === 'all')));
  // if coming from nav link with data-filter, also update chips
  render(window.__PROJECTS__ || []);
}

fetch('projects.json')
  .then(r => r.json())
  .then(data => {
    window.__PROJECTS__ = data.projects || [];
    render(window.__PROJECTS__);
  });

// Filter handlers
document.querySelectorAll('[data-filter]').forEach(el => {
  el.addEventListener('click', (e) => {
    const f = el.dataset.filter || 'all';
    setActive(f);
    // scroll to projects
    document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
  });
});
