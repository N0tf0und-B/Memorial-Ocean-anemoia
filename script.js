/* =========================================================
   script.js — 엔진
   본문 수정은 scenario.js 에서 하십시오.
   ========================================================= */

const $ = id => document.getElementById(id);

const state = {
  idx: 0,
  typing: false,
  ff: false,
  auto: false,
  skip: false,
  waiter: null,
  log: [],
  timers: [],
};


/* ---------------------------------------------------------
   유틸
   --------------------------------------------------------- */

function sleep(ms){
  return new Promise(res=>{
    state.timers.push(setTimeout(res, ms));
  });
}

function clearTimers(){
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

function waitAdvance(){
  return new Promise(res=>{
    if(state.skip){ res(); return; }
    state.waiter = res;
    if(state.auto){
      state.timers.push(setTimeout(()=>{
        if(state.waiter === res){ state.waiter = null; res(); }
      }, CONFIG.autoDelay));
    }
  });
}

function doAdvance(){
  if(state.typing){ state.ff = true; return; }
  if(state.waiter){
    const w = state.waiter;
    state.waiter = null;
    w();
  }
}


/* ---------------------------------------------------------
   오디오
   --------------------------------------------------------- */

const AUD = {
  waves: $('a-waves'),
  step:  $('a-step'),
};

const AUDIO_DEBUG = true;        // 배포하실 때 false 로 바꾸십시오
const pendingPlay = new Set();   // 자동재생 차단으로 밀린 것들

function alog(...a){ if(AUDIO_DEBUG) console.log('[audio]', ...a); }

function bindAudio(){
  const map = { waves: CONFIG.waves, step: CONFIG.step };

  Object.entries(map).forEach(([key, path])=>{
    const a = AUD[key];
    if(!a){ alog(key, '오디오 엘리먼트가 없습니다'); return; }
    if(!path){ alog(key, 'CONFIG 경로가 비어 있습니다'); return; }
    if(a.src) return;

    a.src = path;

    a.addEventListener('error', ()=>{
      const codes = {
        1:'중단됨', 2:'네트워크 오류',
        3:'디코딩 실패', 4:'파일 없음 또는 미지원 포맷'
      };
      console.error(`[audio] ${key} 로드 실패 → ${path}`, codes[a.error?.code] || a.error);
    }, { once:true });

    a.addEventListener('canplay', ()=> alog(key, '준비 완료', path), { once:true });
    a.load();
  });

  applyVolumes();
}

function applyVolumes(){
  if(AUD.waves) AUD.waves.volume = CONFIG.bgmVolume;
  if(AUD.step)  AUD.step.volume  = CONFIG.seVolume;
}

function se(key){
  const a = AUD[key];
  if(!a || !a.src){ alog('효과음 재생 불가:', key); return; }
  a.currentTime = 0;
  a.play().catch(err=>{
    alog(key, '재생 거부:', err.name);
    pendingPlay.add(a);
  });
}

function fadeAudio(a, to, ms){
  if(!a || !a.src) return;

  const from = a.volume;
  const start = performance.now();

  if(to > 0 && a.paused){
    a.volume = 0;
    a.play().catch(err=>{
      alog(a.id, '재생 거부:', err.name, '— 첫 클릭 때 재시도합니다');
      pendingPlay.add(a);
    });
  }

  (function tick(now){
    const p = Math.min((now - start) / ms, 1);
    a.volume = Math.max(0, Math.min(1, from + (to - from) * p));
    if(p < 1) requestAnimationFrame(tick);
    else if(to === 0) a.pause();
  })(performance.now());
}

/* 자동재생 차단 해제 — 클릭이나 키 입력 한 번이면 밀린 것들이 살아납니다 */
function unlockAudio(){
  pendingPlay.forEach(a=>{
    a.play().then(()=>{
      alog('잠금 해제 후 재생', a.id);
      pendingPlay.delete(a);
    }).catch(()=>{});
  });
  const v = $('bg-video');
  if(v && v.src && v.paused) v.play().catch(()=>{});
}
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);


/* ---------------------------------------------------------
   타이핑
   --------------------------------------------------------- */

async function typeInto(node, html){
  node.innerHTML = '';

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

  for(let i = 0; i < chars.length; i++){
    chars[i].style.visibility = 'visible';

    if(state.ff || state.skip){
      for(let j = i; j < chars.length; j++) chars[j].style.visibility = 'visible';
      break;
    }

    const ch = chars[i].textContent;
    let d = CONFIG.typeSpeed;
    if('.,…—?!'.includes(ch)) d *= 5;
    if(ch === '\n') d *= 3;
    await sleep(d);
  }

  state.typing = false;
  state.ff = false;
}


/* ---------------------------------------------------------
   로그
   --------------------------------------------------------- */

function pushLog(text, who){
  state.log.push({ t: text.replace(/<[^>]+>/g, ''), who: who || null });
  if(state.log.length > 300) state.log.shift();
}

function renderLog(){
  const box = $('backlog-list');
  box.innerHTML = '';
  state.log.forEach(e=>{
    const p = document.createElement('p');
    p.textContent = e.who ? `${e.who} : ${e.t}` : e.t;
    if(e.who) p.className = 'said';
    box.appendChild(p);
  });
  box.scrollTop = box.scrollHeight;
}


/* ---------------------------------------------------------
   화면
   --------------------------------------------------------- */

async function showText(step){
  $('textbox').classList.remove('hidden');

  const sp = $('speaker');
  if(step.who){
    sp.textContent = step.who;
    sp.classList.remove('hidden');
  }else{
    sp.classList.add('hidden');
  }

  const d = $('dialogue');
  const html = step.cls ? `<span class="${step.cls}">${step.t}</span>` : step.t;
  pushLog(step.t, step.who);

  $('next-arrow').classList.add('hidden');
  await typeInto(d, html);
  $('next-arrow').classList.remove('hidden');
  await waitAdvance();
  $('next-arrow').classList.add('hidden');
}

async function setCurtain(open, ms){
  const c = $('curtain');
  c.style.transition = `opacity ${ms}ms ease`;
  c.classList.toggle('clear', open);
  await sleep(ms);
}

async function startVideo(){
  const v = $('bg-video');
  if(!v.src && CONFIG.video) v.src = CONFIG.video;
  try{ await v.play(); }catch(e){ pendingPlay.add(v); }
  v.classList.add('on');
}

async function shake(){
  const w = $('bg-wrap');
  w.classList.add('shake');
  await sleep(420);
  w.classList.remove('shake');
}

function showEnding(){
  $('stage').classList.add('hidden');
  $('ending').classList.remove('hidden');
}


/* ---------------------------------------------------------
   인터프리터
   --------------------------------------------------------- */

async function run(){
  while(state.idx < SCENARIO.length){
    const step = SCENARIO[state.idx];
    state.idx++;

    switch(step.c){
      case 'curtain':
        await setCurtain(step.open, step.ms ?? 1200);
        break;

      case 'video':
        await startVideo();
        break;

      case 'bgm':
        if(step.play) fadeAudio(AUD[step.play], step.vol ?? CONFIG.bgmVolume, step.fade ?? 2000);
        if(step.stop) fadeAudio(AUD[step.stop], 0, step.fade ?? 2000);
        break;

      case 'se':
        se(step.play);
        break;

      case 'wait':
        if(!state.skip) await sleep(step.ms);
        break;

      case 'narr':
      case 'say':
        await showText(step);
        break;

      case 'shake':
        await shake();
        break;

      case 'hold':
        return;

      case 'ending':
        showEnding();
        return;

      default:
        console.warn('[scenario] 알 수 없는 명령:', step.c);
    }

    saveProgress();
  }
}


/* ---------------------------------------------------------
   저장
   --------------------------------------------------------- */

function saveProgress(){
  try{ localStorage.setItem('anemoia_idx', String(state.idx)); }catch(e){}
}

function loadProgress(){
  try{ return parseInt(localStorage.getItem('anemoia_idx') || '0', 10) || 0; }
  catch(e){ return 0; }
}


/* ---------------------------------------------------------
   초기화
   --------------------------------------------------------- */

$('t-main').textContent = CONFIG.titleMain;
$('t-sub').textContent  = CONFIG.titleSub;
$('t-note').textContent = CONFIG.titleNote;

$('cfg-speed').value = 100 - CONFIG.typeSpeed;
$('cfg-auto').value  = CONFIG.autoDelay;
$('cfg-bgm').value   = CONFIG.bgmVolume * 100;
$('cfg-se').value    = CONFIG.seVolume  * 100;

function startGame(fromIdx){
  bindAudio();
  clearTimers();

  $('title').classList.add('hidden');
  $('ending').classList.add('hidden');
  $('stage').classList.remove('hidden');
  $('textbox').classList.add('hidden');
  $('curtain').classList.remove('clear');

  state.idx  = fromIdx || 0;
  state.log  = [];
  state.skip = false;
  state.auto = false;

  document.querySelectorAll('#controls button').forEach(b=> b.classList.remove('active'));
  run();
}


/* 게이트 */
function tryGate(){
  const v = $('gate-input').value.trim();
  if(!CONFIG.password || v === CONFIG.password){
    $('gate').classList.add('hidden');
    $('title').classList.remove('hidden');
  }else{
    $('gate-error').textContent = '해당 리소스에 접근할 수 없습니다.';
    $('gate-input').value = '';
  }
}
$('gate-submit').addEventListener('click', tryGate);
$('gate-input').addEventListener('keydown', e=>{ if(e.key === 'Enter') tryGate(); });


/* 타이틀 */
$('title').addEventListener('click', e=>{
  const act = e.target.dataset.act;
  if(act === 'start')    startGame(0);
  if(act === 'continue') startGame(loadProgress());
  if(act === 'config')   $('config').classList.remove('hidden');
});


/* 진행 */
$('stage').addEventListener('click', e=>{
  if(e.target.closest('#controls')) return;
  doAdvance();
});

window.addEventListener('keydown', e=>{
  if($('stage').classList.contains('hidden')) return;
  if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); doAdvance(); }
  if(e.key === 'Control') state.ff = true;
  if(e.key === 'Escape')  closePanels();
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

  if(act === 'backlog'){
    renderLog();
    $('backlog').classList.remove('hidden');
  }

  if(act === 'config'){
    $('config').classList.remove('hidden');
  }

  if(act === 'quit'){
    clearTimers();
    fadeAudio(AUD.waves, 0, 900);
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
$('backlog').addEventListener('click', e=>{ if(e.target.id === 'backlog') closePanels(); });
$('config').addEventListener('click',  e=>{ if(e.target.id === 'config')  closePanels(); });


/* 슬라이더 */
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
