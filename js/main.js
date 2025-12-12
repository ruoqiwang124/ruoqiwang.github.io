import { projects } from '../data/projects.js?v=20251211';
import { setThemeFromStorage, toggleTheme, qs, el } from './utils.js';

setThemeFromStorage();
qs('#themeToggle')?.addEventListener('click', toggleTheme);

qs('#year').textContent = String(new Date().getFullYear());

const grid = qs('#projectGrid');

function renderProjectCard(p){
  const card = el('article', { class: 'project-card' });

  const thumb = el('img', {
    class: 'project-thumb',
    src: p.thumbnail,
    alt: `${p.title} cover`
  });
  card.appendChild(thumb);

  const body = el('div', { class: 'project-body' });

  const titleRow = el('div', { class: 'project-title' });
  const h3 = el('h3');
  h3.textContent = p.title;

  const badge = el('div', { class: 'badge' });
  badge.textContent = p.badge;

  titleRow.append(h3, badge);

  const desc = el('p', { class: 'project-desc' });
  desc.textContent = p.shortDescription;

  const tags = el('div', { class: 'tags' });
  (p.tags || []).slice(0,6).forEach(t => tags.appendChild(el('span', { class: 'tag', text: t })));

  const actions = el('div', { class: 'card-actions' });
  const more = el('a', {
    class: 'btn',
    href: `project.html?id=${encodeURIComponent(p.id)}`,
    text: 'View details'
  });

  const demo = p.links?.demo
    ? el('a', { class: 'btn ghost', href: p.links.demo, text: 'Demo', target:'_blank', rel:'noopener' })
    : null;

  actions.appendChild(more);
  if(demo) actions.appendChild(demo);

  body.append(titleRow, desc, tags, actions);
  card.appendChild(body);

  return card;
}

if(grid){
  projects.forEach(p => grid.appendChild(renderProjectCard(p)));
}
