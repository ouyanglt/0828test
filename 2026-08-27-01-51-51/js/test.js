/* ============ MBTI 测试逻辑 ============ */
let current = 0;            // 当前题号
let answers = new Array(QUESTIONS.length).fill(null); // 每题选择：'a' | 'b' | null

document.getElementById('totalQ').textContent = QUESTIONS.length;

function startTest() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  current = 0;
  renderQ();
}

function renderQ() {
  const q = QUESTIONS[current];
  document.getElementById('qIndex').textContent = `第 ${current + 1} 题`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('progText').textContent = `${current + 1} / ${QUESTIONS.length}`;
  document.getElementById('progFill').style.width = ((current) / QUESTIONS.length * 100) + '%';

  const optBox = document.getElementById('qOptions');
  optBox.innerHTML = '';
  [['a', q.a], ['b', q.b]].forEach(([key, text]) => {
    const div = document.createElement('div');
    div.className = 'option' + (answers[current] === key ? ' sel' : '');
    div.innerHTML = `<span class="dot"></span><span>${text}</span>`;
    div.onclick = () => selectOpt(key);
    optBox.appendChild(div);
  });

  document.getElementById('prevBtn').disabled = current === 0;
  const last = current === QUESTIONS.length - 1;
  document.getElementById('nextBtn').textContent = last ? '查看结果' : '下一题';
  document.getElementById('nextBtn').disabled = answers[current] === null;
}

function selectOpt(key) {
  answers[current] = key;
  renderQ();
}

function nextQ() {
  if (answers[current] === null) return;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQ();
  } else {
    showResult();
  }
}

function prevQ() {
  if (current > 0) { current--; renderQ(); }
}

/* ---------- 计分：得出四字母人格类型 ---------- */
function computeType() {
  const score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  QUESTIONS.forEach((q, i) => {
    if (answers[i] === 'a') {
      if (q.dim === 'EI') score.E++;
      if (q.dim === 'SN') score.S++;
      if (q.dim === 'TF') score.T++;
      if (q.dim === 'JP') score.J++;
    } else if (answers[i] === 'b') {
      if (q.dim === 'EI') score.I++;
      if (q.dim === 'SN') score.N++;
      if (q.dim === 'TF') score.F++;
      if (q.dim === 'JP') score.P++;
    }
  });
  // 平局时取第一个字母（E/S/T/J）作为默认倾向
  const EI = score.E >= score.I ? 'E' : 'I';
  const SN = score.S >= score.N ? 'S' : 'N';
  const TF = score.T >= score.F ? 'T' : 'F';
  const JP = score.J >= score.P ? 'J' : 'P';
  return EI + SN + TF + JP;
}

function showResult() {
  const code = computeType();
  const t = TYPES[code];
  currentCode = code;

  document.getElementById('quiz').style.display = 'none';
  const r = document.getElementById('result');
  r.style.display = 'block';

  const codeEl = document.getElementById('rCode');
  codeEl.textContent = code;
  codeEl.style.color = t.color;
  document.getElementById('rName').textContent = t.name;
  document.getElementById('rTag').textContent = t.tagline;
  document.getElementById('rOverview').textContent = t.overview;

  const btn = document.getElementById('rDetailBtn');
  btn.textContent = `查看您的「${t.name}（${code}）」人格类型介绍 →`;
}

/* ---------- 付费墙（本地演示） ---------- */
let currentCode = '';

function openPaywall() {
  const t = TYPES[currentCode];
  document.getElementById('payTitle').textContent = `解锁你的「${t.name}（${currentCode}）」专属解读`;
  document.getElementById('payModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePaywall() {
  document.getElementById('payModal').style.display = 'none';
  document.body.style.overflow = '';
}

// 支付方式切换
document.querySelectorAll('.pay-method').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('sel'));
    el.classList.add('sel');
  });
});

function doPay() {
  const btn = document.getElementById('payConfirm');
  btn.classList.add('pay-loading');
  btn.textContent = '支付处理中…';
  // 演示：模拟 1.2s 后支付成功，再跳转解读页
  setTimeout(() => {
    const modal = document.getElementById('payModal');
    modal.querySelector('.modal-card').innerHTML = `
      <div class="pay-success-ico">✅</div>
      <h3>支付成功</h3>
      <p class="modal-desc">正在为你打开专属人格解读…</p>`;
    setTimeout(() => { location.href = `types.html#${currentCode}?unlocked=1`; }, 900);
  }, 1200);
}
