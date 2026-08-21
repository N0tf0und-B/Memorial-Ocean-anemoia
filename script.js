/* =========================================================
   잠기는가 — anemoia
   interactive log / html+css+js only
   ========================================================= */

const CONFIG = {
  // 비밀번호. 빈 문자열('')로 두면 게이트를 건너뜁니다.
  password: 'anemoia',

  // 에셋 경로 — 파일 구하신 뒤 여기만 바꾸시면 됩니다
  video:  'assets/night_sea.mp4',
  waves:  'assets/waves_loop.mp3',
  page:   'assets/page_turn.mp3',
  tear:   'assets/paper_tear.mp3',
  step:   'assets/sand_step.mp3',
  pickup: 'assets/pickup.mp3',
  heart:  'assets/heartbeat.mp3',

  typeSpeed: 42,      // ms/글자
  autoDelay: 1500,
  bgmVolume: 0.55,
  seVolume:  0.70,
};

/* ---------------------------------------------------------
   본문 데이터
   narr  : 하단 텍스트박스 나레이션
   page  : 수첩 페이지
   --------------------------------------------------------- */

const SCENARIO = [
  { c:'curtain', open:true, ms:2600 },
  { c:'video',   play:true },
  { c:'bgm',     play:'waves', fade:4000 },
  { c:'wait',    ms:3400 },

  { c:'narr', t:'쏴아아—' },
  { c:'narr', t:'쏴아아—' },
  { c:'wait', ms:600 },
  { c:'narr', t:'파도가 밀려왔다가, 물러났다.\n같은 소리를 몇 번이나 반복하는데도 지겹지 않았다.' },
  { c:'narr', t:'새카만 밤바다였다. 달빛이 물결 위에서 부서지며 흰 선을 그었다가, 다음 파도에 지워졌다.' },
  { c:'narr', t:'8월. 낮의 열기가 아직 모래 밑에 남아 있어서, 발바닥이 미지근했다.\n바람만은 서늘했다.' },
  { c:'se',   play:'step' },
  { c:'narr', t:'발을 옮길 때마다 젖은 모래가 발목까지 무너져 내렸다.' },
  { c:'narr', t:'인적은 없었다. 피서철이 지난 해변은 텅 비어 있고, 저 멀리 방파제 위 가로등 하나가 깜빡이다 꺼졌다.' },
  { c:'wait', ms:900 },
  { c:'narr', t:'…그때, 파도가 물러난 자리에 무언가 남아 있는 게 보였다.' },

  { c:'obj', add:'notebook' },
  { c:'narr', t:'수첩이었다.', speaker:null },
  { c:'narr', t:'모래사장에 반쯤 파묻힌 채로 엎어져 있었다.\n표지가 물을 먹어 짙게 변색되어 있었다.' },
  { c:'narr', t:'(…줍는다.)', cls:'whisper', clickObj:'notebook' },

  /* --- 1인칭 줍기 --- */
  { c:'pickup' },
  { c:'se', play:'pickup' },
  { c:'wait', ms:1500 },
  { c:'bgm', play:'heart', vol:.35, fade:1200 },
  { c:'narr', t:'축축하다.' },
  { c:'narr', t:'손바닥에 닿는 표지가 차갑고 물컹했다. 바닷물을 먹은 종이가 부풀어 두께가 두 배쯤 되어 있었다.' },
  { c:'narr', t:'가죽을 흉내낸 겉장은 소금기로 하얗게 얼룩졌고, 모서리가 죄다 닳아 있었다. 오래 들고 다닌 물건이었다.' },
  { c:'narr', t:'쭈글쭈글해졌지만—' },
  { c:'narr', t:'읽을 수 있을 것 같다.' },
  { c:'wait', ms:800 },

  /* --- 수첩 진입 --- */
  { c:'openNotebook' },
  { c:'se', play:'tear' },

  { c:'page', torn:true, stain:.5, lines:[
    '<span class="small">앞장이 몇 장 뜯겨져 있다. 찢긴 자리가 톱니처럼 남았다.</span>',
  ]},

  { c:'page', stain:.7, lines:[
    '<span class="date">— 월 — 일</span>',
    '좋은 사람들을 만났다.',
  ]},

  { c:'page', stain:.4, lines:[
    '<span class="date">같은 날</span>',
    '이름을 세 번 물었다. 세 번 다 다르게 대답해줬다.',
    '거짓말을 하는 게 아니라, 셋 다 진짜라고 했다.',
    '적어둔다. 잊지 않게.',
  ]},

  { c:'page', stain:.55, lines:[
    '수집하는 습관이 나쁜 거라고 누가 말했다.',
    '<span class="scratched">아니. 그건 틀렸다.</span>',
    '…아니, 어쩌면 맞을지도.',
    '<span class="indent small">적는 걸 그만두면 사라지니까 적는 거다.</span>',
  ]},

  { c:'page', stain:.85, blur:true, lines:[
    '<span class="date">— 월 — 일 · 새벽</span>',
    '<span class="bleed">바다는 위험하다. 알고 있다.</span>',
    '<span class="bleed">그런데도 매번 여기까지 걸어와버린다.</span>',
    '<span class="bleed">가장 아름다운 것과 가장 위험한 것이 같은 얼굴을 하고 있으면,</span>',
    '<span class="bleed">둘 중 하나를 접어야 하는데—</span>',
    '<span class="bleed">나는 접지 않기로 했다.</span>',
  ]},

  { c:'page', torn:true, stain:.6, lines:[
    '<span class="small">여기서 또 한 장이 뜯겨 있다.</span>',
    '<span class="small">뜯다가 손이 미끄러진 듯, 다음 장 상단이 함께 찢겨 나갔다.</span>',
  ]},

  { c:'page', gaegu:true, stain:.75, lines:[
    '모르겠어. 타인과 나의 의지를 구분할 수 없을 정도로,',
    '그들과 똑같은 생각을 하게 돼. 둘 다인 것 같아.',
    '<span class="indent small">갇힌다. 그 말이 맞는 걸까?</span>',
    '<span class="indent small">하루에도 몇 번씩 스스로를 집 안에 감옥처럼 처박아두고 잠근다.</span>',
    '<span class="indent small">나아가는가, 잠기는가—</span>',
  ]},

  { c:'page', gaegu:true, stain:.9, blur:true, lines:[
    '구하고 싶다는 생각은 머릿속에 가득 차 있는데,',
    '어떻게 구해야 할지를 모르겠어.',
    '<span class="bleed">이미 죽은 사람을 구할 수 있을까?</span>',
    '<span class="scratched">그저 단 한 명의 존재 때문에 내가 이렇게 되어버렸다는 게</span>',
    '<span class="bleed">억울해.</span>',
    '<span class="bleed">억울하다는 감정이 들어서, 그런 내 자신이</span>',
    '<span class="small">— 여기서 글씨가 끊긴다. 펜이 종이를 긁고 멈춘 흔적만 남았다.</span>',
  ]},

  { c:'page', gaegu:true, stain:1, blur:true, lines:[
    '그런데도 잊고 싶지 않아.',
    '속이 곯아가는 느낌이야.',
    '<span class="bleed">당신은 이해하지.</span>',
    '<span class="bleed">응?</span>',
    '<span class="bleed">날 이해해줘….</span>',
  ]},

  { c:'page', stain:.35, lines:[
    '<span class="small">이후 장은 모두 백지다.</span>',
    '<span class="small">물에 젖어 서로 들러붙어, 억지로 떼면 찢어질 것 같다.</span>',
  ]},

  /* --- 수첩 이탈 --- */
  { c:'closeNotebook' },
  { c:'bgm', stop:'heart', fade:2400 },
  { c:'narr', t:'수첩을 덮었다.' },
  { c:'narr', t:'표지 뒷면에, 매직으로 눌러 쓴 글자가 있었다.' },
  { c:'narr', t:'404 not found', cls:'em' },
  { c:'wait', ms:1200 },
  { c:'narr', t:'파도가 다시 밀려와 발목을 적셨다. 물이 차가웠다.' },
  { c:'narr', t:'모래 위에 발자국은—' },
  { c:'narr', t:'…한 사람 분밖에 없었다.' },
  { c:'wait', ms:1600 },
  { c:'bgm', stop:'waves', fade:5000 },
  { c:'curtain', open:false, ms:4000 },
  { c:'ending' },
];

/* =========================================================
   엔진
   ========================================================= */

const $ = id => document.getElementById(id);
const state = {
  idx:0, typing:false, ff:false, auto:false, skip:false,
  waiter:null, running:false, log:[],
  timers:[],
};

/* ---- 유틸 ---- */
function sleep(ms){
  return new Promise(res=>{
    const t = setTimeout(res, ms);
    state.timers.push(t);
  });
}
function clearTimers(){ state.timers.forEach(clearTimeout); state.timers=[]; }

function waitAdvance(){
  return new Promise(res=>{
    if(state.skip){ res(); return; }
    state.waiter = res;
    if(state.auto){
      const t = setTimeout(()=>{ if(state.waiter===res){ state.waiter=null; res(); } }, CONFIG.autoDelay);
      state.timers.push(t);
    }
  });
}
function doAdvance(){
  if(state.typing){ state.ff = true; return; }
  if(state.waiter){ const w = state.waiter; state.waiter=null; w(); }
}

/* ---- 오디오 ---- */
const AUD = {
  waves:  $('a-waves'),
  page:   $('a-page'),
  tear:   $('a-tear'),
  step:   $('a-step'),
  pickup: $('a-pickup'),
  heart:  $('a-heart'),
};
function bindAudio(){
  AUD.waves.src  = CONFIG.waves;
  AUD.page.src   = CONFIG.page;
  AUD.tear.src   = CONFIG.tear;
  AUD.step.src   = CONFIG.step;
  AUD.pickup.src = CONFIG.pickup;
  AUD.heart.src  = CONFIG.heart;
  applyVolumes();
}
function applyVolumes(){
  AUD.waves.volume = CONFIG.bgmVolume;
  AUD.heart.volume = Math.min(CONFIG.bgmVolume * .6, 1);
  ['page','tear','step','pickup'].forEach(k=> AUD[k].volume = CONFIG.seVolume);
}
function se(key){
  const a = AUD[key];
  if(!a || !a.src) return;
  try{ a.currentTime = 0; a.play().catch(()=>{}); }catch(e){}
}
function fadeAudio(a, to, ms){
  if(!a || !a.src) return;
  const from = a.volume;
  const start = performance.now();
  if(to > 0 && a.paused){ a.volume = 0; a.play().catch(()=>{}); }
  function step(now){
    const p = Math.min((now-start)/ms, 1);
    a.volume = from + (to-from)*p;
    if(p < 1) requestAnimationFrame(step);
    else if(to === 0) a.pause();
  }
  requestAnimationFrame(step);
}

/* ---- 타이핑 ---- */
async function typeInto(node, html){
  node.innerHTML = '';
  // 태그를 보존하며 글자 단위로 노출
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const chars = [];
  (function walk(src, dest){
    src.childNodes.forEach(n=>{
      if(n.nodeType === 3){
        [...n.textContent].forEach(ch=>{
          const s = document.createElement('span');
          s.textContent = ch;
          s.style.visibility = 'hidden';
          dest.appendChild(s);
          chars.push(s);
        });
      }else{
        const clone = n.cloneNode(false);
        dest.appendChild(clone);
        walk(n, clone);
      }
    });
  })(tmp, node);

  state.typing = true;
  state.ff = false;
  const speed = CONFIG.typeSpeed;
  for(let i=0;i<chars.length;i++){
    chars[i].style.visibility = 'visible';
    if(state.ff || state.skip){
      for(let j=i;j<chars.length;j++) chars[j].style.visibility='visible';
      break;
    }
    const ch = chars[i].textContent;
    let d = speed;
    if('.,…—?!'.includes(ch)) d = speed * 5;
    if(ch === '\n') d = speed * 3;
    await sleep(d);
  }
  state.typing = false;
  state.ff = false;
}

/* ---- 로그 ---- */
function pushLog(text, isNb){
  const plain = text.replace(/<[^>]+>/g,'');
  state.log.push({t:plain, nb:!!isNb});
  if(state.log.length > 200) state.log.shift();
}
function renderLog(){
  const box = $('backlog-list');
  box.innerHTML = '';
  state.log.forEach(e=>{
    const p = document.createElement('p');
    if(e.nb) p.className = 'nb';
    p.textContent = e.t;
    box.appendChild(p);
  });
  box.scrollTop = box.scrollHeight;
}

/* ---- 화면 조작 ---- */
async function narr(step){
  $('textbox').classList.remove('hidden');
  const sp = $('speaker');
  if(step.speaker){ sp.textContent = step.speaker; sp.classList.remove('hidden'); }
  else sp.classList.add('hidden');

  const d = $('dialogue');
  d.className = step.cls ? step.cls : '';
  const html = step.cls ? `<span class="${step.cls}">${step.t}</span>` : step.t;
  pushLog(step.t);

  $('next-arrow').classList.add('hidden');
  await typeInto(d, html);
  $('next-arrow').classList.remove('hidden');

  if(step.clickObj){
    await waitObjClick(step.clickObj);
  }else{
    await waitAdvance();
  }
  $('next-arrow').classList.add('hidden');
}

function waitObjClick(name){
  return new Promise(res=>{
    if(state.skip){ res(); return; }
    const node = document.querySelector(`.obj-${name}`);
    if(!node){ res(); return; }
    const handler = e=>{
      e.stopPropagation();
      node.removeEventListener('click', handler);
      res();
    };
    node.addEventListener('click', handler);
    // 클릭 대기 중에는 일반 진행도 허용
    state.waiter = ()=>{ node.removeEventListener('click', handler); res(); };
  });
}

function addObject(name){
  const wrap = $('objects');
  const div = document.createElement('div');
  div.className = `obj obj-${name}`;
  if(name === 'notebook'){
    div.innerHTML = `<div class="obj-glow"></div><div class="nb-body"></div>`;
  }
  wrap.appendChild(div);
  requestAnimationFrame(()=> div.classList.add('on'));
}

async function pickupSequence(){
  const nb = document.querySelector('.obj-notebook');
  $('textbox').classList.add('hidden');
  $('stage').classList.add('pickup');
  if(nb) nb.classList.add('rise');
  await sleep(1700);
  if(nb) nb.remove();
}

function randomStains(intensity){
  const box = $('paper-stains');
  box.innerHTML = '';
  const count = Math.round(4 + intensity * 9);
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    const edge = Math.random() < .45;
    s.className = 'stain' + (edge ? ' edge' : '');
    const size = (edge ? 120 : 70) + Math.random() * 240 * intensity;
    s.style.width  = size + 'px';
    s.style.height = size * (.6 + Math.random()*.7) + 'px';
    if(edge){
      const side = Math.floor(Math.random()*4);
      const pos  = Math.random()*80;
      if(side===0){ s.style.top='-8%';   s.style.left=pos+'%'; }
      if(side===1){ s.style.bottom='-8%';s.style.left=pos+'%'; }
      if(side===2){ s.style.left='-8%';  s.style.top=pos+'%'; }
      if(side===3){ s.style.right='-8%'; s.style.top=pos+'%'; }
    }else{
      s.style.left = Math.random()*85 + '%';
      s.style.top  = Math.random()*85 + '%';
    }
    s.style.opacity = (.35 + Math.random()*.55*intensity).toFixed(2);
    box.appendChild(s);
  }
}

async function openNotebook(){
  $('stage').classList.remove('pickup');
  $('textbox').classList.add('hidden');
  $('notebook').classList.remove('hidden');
  await sleep(900);
}
async function closeNotebook(){
  const paper = $('notebook-paper');
  paper.classList.add('flip');
  se('page');
  await sleep(520);
  $('notebook').classList.add('hidden');
  paper.classList.remove('flip');
  await sleep(500);
}

async function showPage(step){
  const paper = $('notebook-paper');
  const text  = $('paper-text');
  const torn  = $('paper-tornedge');

  // 넘기는 연출
  paper.classList.add('flip');
  se(step.torn ? 'tear' : 'page');
  await sleep(480);

  randomStains(step.stain ?? .5);
  text.className = step.gaegu ? 'gaegu' : '';
  text.innerHTML = step.lines.map(l=>`<p${step.blur?' class="bleed"':''}>${l}</p>`).join('');
  torn.classList.toggle('hidden', !step.torn);

  step.lines.forEach(l=> pushLog(l, true));

  paper.classList.remove('flip');
  await sleep(560);
  await waitAdvance();
}

async function setCurtain(open, ms){
  const c = $('curtain');
  c.style.transition = `opacity ${ms}ms ease`;
  c.classList.toggle('clear', open);
  await sleep(ms);
}

async function startVideo(){
  const v = $('bg-video');
  if(!v.src) v.src = CONFIG.video;
  try{ await v.play(); }catch(e){}
  v.classList.add('on');
}

/* ---- 인터프리터 ---- */
async function run(){
  state.running = true;
  while(state.idx < SCENARIO.length){
    const step = SCENARIO[state.idx];
    state.idx++;
    switch(step.c){
      case 'curtain':      await setCurtain(step.open, step.ms ?? 1200); break;
      case 'video':        await startVideo(); break;
      case 'bgm':
        if(step.play) fadeAudio(AUD[step.play], step.vol ?? CONFIG.bgmVolume, step.fade ?? 2000);
        if(step.stop) fadeAudio(AUD[step.stop], 0, step.fade ?? 2000);
        break;
      case 'se':           se(step.play); break;
      case 'wait':         if(!state.skip) await sleep(step.ms); break;
      case 'narr':         await narr(step); break;
      case 'obj':          addObject(step.add); break;
      case 'pickup':       await pickupSequence(); break;
      case 'openNotebook': await openNotebook(); break;
      case 'closeNotebook':await closeNotebook(); break;
      case 'page':         await showPage(step); break;
      case 'ending':       showEnding(); state.running=false; return;
    }
    saveProgress();
  }
  state.running = false;
}

function showEnding(){
  $('stage').classList.add('hidden');
  $('ending').classList.remove('hidden');
}

/* ---- 저장 ---- */
function saveProgress(){
  try{ localStorage.setItem('anemoia_idx', String(state.idx)); }catch(e){}
}
function loadProgress(){
  try{ return parseInt(localStorage.getItem('anemoia_idx') || '0', 10) || 0; }catch(e){ return 0; }
}

/* =========================================================
   초기화 / 이벤트
   ========================================================= */

function enterTitle(){
  $('gate').classList.add('hidden');
  $('title').classList.remove('hidden');
}

function startGame(fromIdx){
  bindAudio();
  $('title').classList.add('hidden');
  $('ending').classList.add('hidden');
  $('stage').classList.remove('hidden');
  $('objects').innerHTML = '';
  $('textbox').classList.add('hidden');
  $('notebook').classList.add('hidden');
  $('curtain').classList.remove('clear');
  clearTimers();
  state.idx = fromIdx || 0;
  state.log = [];
  state.skip = false;
  state.auto = false;
  document.querySelectorAll('#controls button').forEach(b=>b.classList.remove('active'));
  run();
}

/* 게이트 */
function tryGate(){
  const v = $('gate-input').value.trim();
  if(!CONFIG.password || v === CONFIG.password){
    enterTitle();
  }else{
    $('gate-error').textContent = '해당 리소스에 접근할 수 없습니다.';
    $('gate-input').value = '';
  }
}
$('gate-submit').addEventListener('click', tryGate);
$('gate-input').addEventListener('keydown', e=>{ if(e.key==='Enter') tryGate(); });

/* 타이틀 메뉴 */
$('title').addEventListener('click', e=>{
  const act = e.target.dataset.act;
  if(act === 'start')    startGame(0);
  if(act === 'continue') startGame(loadProgress());
  if(act === 'config')   $('config').classList.remove('hidden');
});

/* 진행 클릭 */
$('stage').addEventListener('click', e=>{
  if(e.target.closest('#controls')) return;
  if(e.target.closest('.obj')) return;
  doAdvance();
});
window.addEventListener('keydown', e=>{
  if($('stage').classList.contains('hidden')) return;
  if(e.key===' ' || e.key==='Enter'){ e.preventDefault(); doAdvance(); }
  if(e.key==='Control'){ state.ff = true; }
  if(e.key==='Escape'){ closePanels(); }
});

/* 컨트롤 */
$('controls').addEventListener('click', e=>{
  const act = e.target.dataset.act;
  if(!act) return;
  if(act === 'auto'){
    state.auto = !state.auto;
    e.target.classList.toggle('active', state.auto);
    if(state.auto) doAdvance();
  }
  if(act === 'skip'){
    state.skip = true;
    state.ff = true;
    doAdvance();
    setTimeout(()=>{ state.skip = false; }, 120);
  }
  if(act === 'backlog'){ renderLog(); $('backlog').classList.remove('hidden'); }
  if(act === 'config'){  $('config').classList.remove('hidden'); }
  if(act === 'quit'){
    clearTimers();
    fadeAudio(AUD.waves, 0, 900);
    fadeAudio(AUD.heart, 0, 900);
    $('stage').classList.add('hidden');
    $('title').classList.remove('hidden');
  }
});

/* 패널 */
function closePanels(){
  $('backlog').classList.add('hidden');
  $('config').classList.add('hidden');
}
document.querySelectorAll('.panel-close').forEach(b=> b.addEventListener('click', closePanels));
$('backlog').addEventListener('click', e=>{ if(e.target.id==='backlog') closePanels(); });
$('config').addEventListener('click',  e=>{ if(e.target.id==='config')  closePanels(); });

/* 설정 슬라이더 */
$('cfg-speed').addEventListener('input', e=>{ CONFIG.typeSpeed = 100 - Number(e.target.value); });
$('cfg-auto').addEventListener('input',  e=>{ CONFIG.autoDelay = Number(e.target.value); });
$('cfg-bgm').addEventListener('input',   e=>{ CONFIG.bgmVolume = Number(e.target.value)/100; applyVolumes(); });
$('cfg-se').addEventListener('input',    e=>{ CONFIG.seVolume  = Number(e.target.value)/100; applyVolumes(); });

/* 엔딩 */
$('ending-replay').addEventListener('click', ()=>{
  $('ending').classList.add('hidden');
  $('title').classList.remove('hidden');
});

/* 게이트 미사용 시 바로 타이틀 */
if(!CONFIG.password){
  $('gate').classList.add('hidden');
  $('title').classList.remove('hidden');
}else{
  $('gate-input').focus();
}
