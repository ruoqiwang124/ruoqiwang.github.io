export function qs(sel){ return document.querySelector(sel); }

export function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k === 'class') n.className = v;
    else if(k === 'text') n.textContent = v;
    else if(k === 'html') n.innerHTML = v;
    else if(k === 'target' || k === 'rel' || k === 'href' || k === 'src' || k === 'alt' || k === 'title' || k === 'allow'){
      n.setAttribute(k, v);
    } else {
      try { n[k] = v; } catch { n.setAttribute(k, v); }
    }
  }
  (children || []).forEach(c => n.appendChild(c));
  return n;
}

export function getParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

export function setThemeFromStorage(){
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
  updateToggleIcon(theme);
}

export function toggleTheme(){
  const cur = document.documentElement.dataset.theme || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme){
  const btn = document.querySelector('#themeToggle');
  if(!btn) return;
  btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}
