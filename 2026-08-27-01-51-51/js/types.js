/* ============ 16 种人格类型页面逻辑 ============ */
const ORDER = [
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'
];

function renderGrid() {
  const grid = document.getElementById('typesGrid');
  grid.innerHTML = '';
  ORDER.forEach(code => {
    const t = TYPES[code];
    const card = document.createElement('div');
    card.className = 'type-card';
    card.style.borderTopColor = t.color;
    card.innerHTML = `
      <div class="tc-code" style="color:${t.color}">${t.code}</div>
      <div class="tc-name">${t.name}</div>
      <div class="tc-tag">${t.tagline}</div>`;
    card.onclick = () => showDetail(code);
    grid.appendChild(card);
  });
}

function showDetail(code, unlocked) {
  const t = TYPES[code];
  if (!t) return;
  document.getElementById('detail').classList.add('show');
  document.getElementById('detail').style.borderTopColor = t.color;

  document.getElementById('dCode').textContent = `${t.code} · ${t.name}`;
  document.getElementById('dCode').style.color = t.color;
  document.getElementById('dTag').textContent = t.tagline;

  const overview = document.getElementById('dOverview');
  overview.innerHTML = unlocked
    ? `<div class="unlock-banner">🎉 你已解锁专属深度解读</div>${t.overview}`
    : t.overview;

  fillList('dStrength', t.strength);
  fillList('dWatchout', t.watchout);
  fillList('dCareer', t.career);
  document.getElementById('dRelation').textContent = t.relation;

  document.getElementById('detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fillList(id, arr) {
  const ul = document.getElementById(id);
  ul.innerHTML = '';
  arr.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

// 初始化 + 支持 #INTJ 深链跳转（来自测试结果页）
window.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  const unlocked = new URLSearchParams(location.search).get('unlocked') === '1';
  const hash = decodeURIComponent(location.hash.replace('#', '')).toUpperCase();
  if (TYPES[hash]) {
    setTimeout(() => showDetail(hash, unlocked), 200);
  }
});
