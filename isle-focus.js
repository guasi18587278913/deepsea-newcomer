/* ============================================================
   深海圈 · 「神奇移动」岛屿聚焦层（IsleFocus）
   —— 大航海图点岛后的聚焦态：被点的岛在「一排」里就地放大成主角、
      其余岛缩小压暗仍留在这一排（不洗牌）；岛底边对齐一条水位线再
      高低错落，航线顺着岛脚画成蜿蜒弧（走过实线 / 没到虚线）；小船
      按真实等级成长并泊在真实所在岛旁。主区铺真课程内容（mountContent）。
      布局自适应任意岛数（2~4+），默认全量图与 12 条专属路线共用本引擎。
   配套 isle-focus.css。地图页用法见文件尾 window.IsleFocus。

   用法：
     IsleFocus.open({
       root, islands, focusStage, tier, shipStage, progress, fromRects,
       mountContent, onClose, onSwitch
     });
     IsleFocus.switchTo(stage);  IsleFocus.close();  IsleFocus.isOpen();  IsleFocus.current();
   ============================================================ */
(function () {
'use strict';

const DUR = 620, EASE = 'cubic-bezier(.45,.05,.25,1)';
/* 聚焦布局（一排·选中放大）：N 个岛按顺序横排靠左、底边对齐一条水位线再高低错落；
   被点中的岛就地放大、其余缩小；右半边留给课程卡。参数随手可调，自适应任意岛数。*/
const LAY = { wSel:16, wOth:7.5, gap:2, startX:2, baseBottom:30, amp:9 };   // 选中宽/其余宽/间距/起点x/底边水位/错落幅度（% of 浮层）
function offsetFor(i, N){ return N <= 1 ? 0 : Math.round(LAY.amp * Math.sin(i/(N-1)*Math.PI)); }   // 高低错落：中间偏高两头低（单峰），随岛数自适应
const SHIPS = [
  { img:'assets/ship-1.png', name:'竹筏',     emoji:'🛶', w:6   },
  { img:'assets/ship-2.png', name:'木帆船',   emoji:'⛵', w:7.6 },
  { img:'assets/ship-3.png', name:'战舰',     emoji:'🚢', w:9.4 },
  { img:'assets/ship-4.png', name:'航空母舰', emoji:'🛳️', w:11  },
];

let _cfg = null, _root = null, _focus = null, _animating = false, _open = false, _contentInst = null, _layout = null, _openRects = null;

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function clampTier(t){ return Math.min(4, Math.max(1, t||1)); }
function val(x){ return typeof x === 'function' ? x() : x; }   // tier/progress 可传函数 → 标课后能取最新
function isleCenter(p){ return { x: p.l + p.w/2, y: 100 - p.b }; }   // 岛脚（底边中点）：航线/小船都贴水面走（viewBox 0-100）

function targetLayout(focusStage){
  const ids = _cfg.islands.map(it => it.stage);            // 按 stage 升序的一排
  const N = ids.length; let sIdx = ids.indexOf(focusStage);
  if (sIdx < 0) sIdx = 0;                                   // focusStage 万一不在本路线，退让第一岛当主角，避免全员缩小
  const out = {}; let x = LAY.startX;
  ids.forEach((st, i) => {
    const w = (i === sIdx) ? LAY.wSel : LAY.wOth;          // 被点中的就地放大、其余缩小
    out[st] = { l: x, b: LAY.baseBottom + offsetFor(i, N), w: w };   // 横排：left 累加；底边水位 + 高低错落
    x += w + LAY.gap;
  });
  return out;
}

function build(){
  _root.classList.add('isle-focus');
  const isleHtml = _cfg.islands.map(it =>
    `<div class="if-isle" data-stage="${it.stage}" tabindex="0" role="button" title="${esc((it.zone ? it.zone + ' · ' : '') + (it.name || ''))}">`+
    `<img src="${esc(it.img)}" alt="">`+
    `<span class="if-nm"><span class="if-zone">${esc(it.zone||'')}</span>${esc(it.name||'')}</span></div>`
  ).join('');
  _root.innerHTML =
    `<svg class="if-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="seg-rest" d=""/><path class="seg-done" d=""/></svg>`+
    `<button class="if-back" type="button"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 5 8l5 5"/></svg>升回海面</button>`+
    isleHtml +
    `<img class="if-ship" alt="">`+
    `<div class="if-sheet"><div class="if-title"></div><div class="if-content"></div></div>`;
  _root.querySelectorAll('.if-isle').forEach(el=>{
    const go = e => { e.stopPropagation(); const s = parseInt(el.dataset.stage,10); if (s!==_focus) switchTo(s); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(e); } });
  });
  _root.querySelector('.if-back').addEventListener('click', e=>{ e.stopPropagation(); close(); });
}

function applyStyle(el, p){ el.style.left = p.l+'%'; el.style.bottom = p.b+'%'; el.style.top = 'auto'; el.style.width = p.w+'%'; }

function setClasses(){
  const progAll = val(_cfg.progress) || {};
  _root.querySelectorAll('.if-isle').forEach(el=>{
    const s = parseInt(el.dataset.stage,10);
    const pr = progAll[s];
    el.classList.toggle('is-hero', s===_focus);
    el.classList.toggle('is-mini', s!==_focus);
    el.classList.toggle('is-done', !!(pr && pr.total>0 && pr.done>=pr.total));   // 真·通关才打 ✓（不再按左右位置误标）
  });
}

/* FLIP：岛位置+大小一起平滑插值。fromRects（{stage:屏幕矩形}）给定时，每座岛从它在大地图上的真实位置出发 → 无缝衔接 */
function flip(layout, fromRects){
  const isles = Array.from(_root.querySelectorAll('.if-isle'));
  const first = isles.map(el => { const s = parseInt(el.dataset.stage, 10); return (fromRects && fromRects[s]) ? fromRects[s] : el.getBoundingClientRect(); });
  isles.forEach(el => { const s = parseInt(el.dataset.stage,10); el.style.transition='none'; el.style.transform='none'; if (layout[s]) applyStyle(el, layout[s]); });
  const last = isles.map(el => el.getBoundingClientRect());
  isles.forEach((el,i) => {
    const f = first[i], l = last[i];
    const dx = f.left - l.left, dy = f.top - l.top, sx = l.width ? f.width/l.width : 1, sy = l.height ? f.height/l.height : 1;
    el.style.transformOrigin = 'top left';
    el.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
  });
  _animating = true;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    isles.forEach(el => { el.style.transition = `transform ${DUR}ms ${EASE}`; el.style.transform = 'none'; });
    setTimeout(() => { _animating = false; }, DUR + 30);
  }));
}

/* 经过给定点的平滑曲线（Catmull-Rom → 三次贝塞尔）*/
function catmull(P){
  if (P.length < 2) return P.length ? `M ${P[0].x} ${P[0].y}` : '';
  let d = `M ${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`;
  for (let i=0;i<P.length-1;i++){ const p0=P[i-1]||P[i], p1=P[i], p2=P[i+1], p3=P[i+2]||P[i+1];
    const c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6, c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`; }
  return d;
}
function drawRoute(layout){
  const rest = _root.querySelector('.if-route .seg-rest'), done = _root.querySelector('.if-route .seg-done');
  if (!rest) return;
  const ids = _cfg.islands.map(it=>it.stage).filter(st=>layout[st]);   // 按顺序、有布局的岛
  const feet = ids.map(st=>isleCenter(layout[st]));                    // 各岛脚（已按 left 升序）
  if (feet.length < 1){ rest.setAttribute('d',''); if(done) done.setAttribute('d',''); return; }
  const start = { x: feet[0].x - 6, y: feet[0].y };                    // 航线从第一岛左侧海面起
  rest.setAttribute('d', catmull([start, ...feet]));                   // 全程 · 金色虚线
  if (done){                                                           // 已航行段（起点 → 真实所在岛）· 实线高亮
    const ss = val(_cfg.shipStage); const si = ids.indexOf(ss);
    done.setAttribute('d', si >= 0 ? catmull([start, ...feet.slice(0, si+1)]) : '');
  }
}

function placeShip(layout){
  const ship = _root.querySelector('.if-ship'); if (!ship) return;
  const s = SHIPS[clampTier(val(_cfg.tier)) - 1];
  ship.src = s.img; ship.style.width = s.w + '%';
  const ss = val(_cfg.shipStage); const dock = (ss && layout[ss]) ? ss : _focus;   // 船泊"你真实所在的岛"，不是当前浏览的岛 → 翻看别的岛时船偏到一侧
  const p = layout[dock]; if (!p) return; const c = isleCenter(p);                 // c = 岛脚
  ship.style.left = Math.max(s.w/2, c.x - p.w*0.5) + '%';   // 泊在岛左侧水面；贴左缘时夹住，别漂出浮层
  ship.style.bottom = (p.b - 4) + '%';
  ship.style.top = 'auto';
}

function renderTitle(){
  const it = _cfg.islands.find(i=>i.stage===_focus) || {};
  const tier = clampTier(val(_cfg.tier)), s = SHIPS[tier-1];
  const progAll = val(_cfg.progress) || {};
  const prog = progAll[_focus] || { done:0, total:0 };
  const pct = prog.total ? Math.round(prog.done/prog.total*100) : 0;
  const shipLine = tier >= 4
    ? `${s.emoji} 你的船：<b>航空母舰</b>（Lv4）· 已满级 🏆`
    : `${s.emoji} 你的船：<b>${s.name}</b>（Lv${tier}）· 再打通 1 岛升${SHIPS[tier].name}`;
  const elT = _root.querySelector('.if-title');
  elT.innerHTML =
    `<div class="tc-no">${esc(it.zone||'')}</div>`+
    `<div class="tc-name">${esc(it.name||'')}</div>`+
    `<div class="tc-meta"><span class="tc-prog"><b>${prog.done}/${prog.total}</b><span class="tc-bar"><i style="width:${pct}%"></i></span></span>`+
    (it.badge ? `<span class="tc-badge">${esc(it.badge)}</span>` : '') + `</div>`+
    `<div class="tc-ship">${shipLine}</div>`;
}

function mountContent(){
  const slot = _root.querySelector('.if-content'); if (!slot) return;
  if (_contentInst && _contentInst.destroy) { _contentInst.destroy(); _contentInst = null; }
  slot.innerHTML = '';
  if (typeof _cfg.mountContent === 'function') _contentInst = _cfg.mountContent(slot, _focus) || null;
}

function paint(layout, fromRects){
  _layout = layout;
  setClasses();
  flip(layout, fromRects);
  drawRoute(layout);
  placeShip(layout);
  renderTitle();
  mountContent();
}

function open(cfg){
  _cfg = cfg; _root = cfg.root; _focus = cfg.focusStage;
  if (!_root || !_cfg.islands || !_cfg.islands.length) return;
  build();
  _openRects = cfg.fromRects || null;       // 各岛在大地图上的真实位置：入场从这儿长出、收起飞回去
  paint(targetLayout(_focus), _openRects);
  _open = true;
  requestAnimationFrame(() => { if (_root) _root.classList.add('shown'); if (_contentInst && _contentInst.relayout) _contentInst.relayout(); });
}

function switchTo(stage){
  if (_animating || !_open || stage === _focus) return;
  _focus = stage;
  paint(targetLayout(_focus));               // 焦点平滑"神奇移动"过去
  if (typeof _cfg.onSwitch === 'function') _cfg.onSwitch(stage);
}

function close(){
  if (!_open) return;
  _open = false;
  if (_root) _root.classList.remove('shown');                 // 卡片 / 标题先淡出
  if (_contentInst && _contentInst.destroy) { _contentInst.destroy(); _contentInst = null; }
  /* 反向 FLIP：聚焦的岛飞回大地图上的真实位置（真实屏幕矩形换算成本浮层 %），到位后再交还给真岛 */
  if (_openRects && _root) {
    const o = _root.getBoundingClientRect();
    if (o.width && o.height) {
      const rev = {};
      Object.keys(_openRects).forEach(k => { const r = _openRects[k]; rev[k] = { l:(r.left-o.left)/o.width*100, b:((o.top+o.height)-(r.top+r.height))/o.height*100, w:r.width/o.width*100 }; });
      flip(rev); drawRoute(rev); placeShip(rev);   // 收起只把岛/航线/船飞回，不重建内容（内容已 destroy）
    }
  }
  const cb = _cfg && _cfg.onClose, root = _root;
  setTimeout(() => { if (cb) cb(); if (root) root.innerHTML = ''; }, DUR);   // 飞回到位后，才淡出浮层 + 真岛重现
}

function refresh(){   // 数据变了（如标完一节课）后，原地刷新内容/头牌/船，不重播 FLIP
  if (!_open) return;
  renderTitle();
  placeShip(_layout || targetLayout(_focus));
  mountContent();
}

window.IsleFocus = { open, switchTo, close, refresh, isOpen: () => _open, current: () => _focus };
})();
