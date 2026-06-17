/* ============================================================
   深海圈 · 小岛闯关视图（共用积木 / IsleView）
   —— 把"蛇形寻宝路"渲染成一个可挂载组件，挂进任意容器：
        · isle.html      整页挂载（深链 / 手机端 / 兜底）
        · calendar.html  「潜入岛屿」浮层里挂载（桌面下潜动画）
   依赖宿主页已加载：course-data.js（COURSES / COURSE_STAGES）、
   homework-data.js（HW，可选）。配套样式 isle-view.css。

   用法：
     const inst = IsleView.mount(rootEl, 'A', {
       backLabel: '升回海面',          // 返回按钮文案
       onClose: () => {...},          // 点返回 / 空态返回时调用（不传则跳 calendar）
       onNextIsle: (letter) => {...}, // 「已通关·下一岛」时调用（不传则跳 isle.html）
     });
     inst.relayout();  // 容器尺寸变化后重排
     inst.destroy();   // 卸载（移除 resize 监听）
   ============================================================ */
(function () {
'use strict';

const LETTER2NUM = { A:1, B:2, C:3, D:4 };
const NUM2LETTER = { 1:'A', 2:'B', 3:'C', 4:'D' };
const STAGE_NAMES = { 1:'跑通第一个 AI 产品', 2:'做出能上线的产品', 3:'做一个能收钱的产品', 4:'让 AI 干活、把产品做大' };
const STAGE_PROMISES = {
  1: '零基础起步，做出黑话翻译器、哄哄模拟器、纸片人男友',
  2: '离开扣子，学前后端 / 数据库 / 部署 / 域名，把产品搬上线',
  3: '学会选品，做海外订阅 / 小程序 / App，让产品真正收到钱',
  4: '把 AI 变成员工替你干活、写出不翻车的代码、给产品做冷启动获客',
};
const STAGE_BADGES = { 1:{icon:'▸',text:'能跑通'}, 2:{icon:'⊡',text:'能上线'}, 3:{icon:'¥',text:'能收钱'}, 4:{icon:'↗',text:'能扩张'} };
/* afterFrac = 旁挂在课程序列的相对位置（0~1）。直播/作业可选、不计入解锁。 */
const ASSIGNMENTS = {
  1: { title:'用 AI 做出一个能在线访问的网站', desc:'提交一个部署后的 URL + 源码仓库', estDays:2, afterFrac:0.55 },
  2: { title:'完成产品部署上线 + 域名 + API + 数据库', desc:'要求：域名可访问、API 正常返回、数据库已配置', estDays:3, afterFrac:0.7 },
  3: { title:'从零搭建完整产品：落地页 + 认证 + 支付', desc:'具备用户可注册、可付费的真实 MicroSaaS', estDays:3, afterFrac:0.6 },
  4: { title:'毕业大作业 · 执行 1 个增长动作，展示产品数据变化', desc:'至少 14 天数据；展示冷启动策略 + 实测反馈', estDays:2, afterFrac:1 },
};
const LIVES = [
  { date:'2026-05-14', time:'20:00', title:'案例拆解 · 从 demo 到产品', stage:1, afterFrac:0.35 },
  { date:'2026-05-28', time:'20:00', title:'技术深水区答疑', stage:2, afterFrac:0.4 },
  { date:'2026-06-18', time:'20:00', title:'商业化方法论 · 如何挑产品', stage:3, afterFrac:0.3 },
  { date:'2026-07-08', time:'20:00', title:'增长案例复盘', stage:4, afterFrac:0.35 },
  { date:'2026-07-22', time:'20:00', title:'毕业分享会', stage:4, afterFrac:0.85 },
];
const ISLE_IMG = { 1:'assets/isle-1.webp', 2:'assets/isle-2.webp', 3:'assets/isle-3.webp', 4:'assets/isle-4.webp?v=2' };
const ICON_COURSE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h8a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V4z"/><path d="M4 4v12a2 2 0 0 0 2 2h8"/><path d="M7 8h4M7 11h3"/></svg>';
const ICON_LIVE   = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7.6"/><path d="M8.2 6.7l5.3 3.3-5.3 3.3z" fill="currentColor" stroke="none"/></svg>';
const ICON_TASK   = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="12" height="14" rx="1.5"/><path d="M7 8l2 2 4-4M7 13h6"/></svg>';
const ICON_CHECK  = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.5l3.4 3.4L15 6.4"/></svg>';
const ICON_LOCK   = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="10" height="7.6" rx="1.8"/><path d="M7.2 9V6.9a2.8 2.8 0 0 1 5.6 0V9"/></svg>';
const ICON_ARROW  = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3l5 5-5 5"/></svg>';
const ICON_BACK   = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 5 8l5 5"/></svg>';

/* —— 纯工具 —— */
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function cleanTitle(t){ return String(t).replace(/^[一二三四五六七八九十百]+、\s*/, ''); }
function startOfDay(d){ const x=new Date(d); x.setHours(0,0,0,0); return x; }
function pad(n){ return String(n).padStart(2,'0'); }
function toInput(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function getCompleted(){ try { return new Set(JSON.parse(localStorage.getItem('ds_completed_demo')||'[]')); } catch(e){ return new Set(); } }
function getCurrentStage(completed){ for(let s=1;s<=4;s++){ const sc=COURSES.filter(c=>c.stage===s); if(sc.some(c=>!completed.has(c.code))) return s; } return 4; }
function getSubmissionForStage(stageNum){
  try { if (typeof HW!=='undefined' && HW.loadSubs) return HW.loadSubs().filter(s=>s.stage===stageNum)[0] || null; } catch(e){}
  try { return (JSON.parse(localStorage.getItem('ds_submissions')||'[]')).filter(s=>s.stage===stageNum)[0] || null; } catch(e){ return null; }
}
function debounce(fn,ms){ let t; return function(){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,arguments),ms); }; }
/* 经过给定点的平滑曲线（Catmull-Rom → 三次贝塞尔）*/
function catmullRom(P){
  if (P.length<2) return P.length?`M ${P[0].x} ${P[0].y}`:'';
  let d = `M ${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`;
  for (let i=0;i<P.length-1;i++){
    const p0=P[i-1]||P[i], p1=P[i], p2=P[i+1], p3=P[i+2]||P[i+1];
    const c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6;
    const c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
/* toast 单例（挂 body，浮在最上层；独立类名不与宿主冲突）*/
function showToast(msg){
  let t = document.querySelector('.iv-toast');
  if (!t){ t=document.createElement('div'); t.className='iv-toast'; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'), 2200);
}

/* 组件骨架（注入 root；class 全部 scope 在 .isle-view 下）*/
function skeleton(backLabel, withHead){
  const head = withHead ? `<header class="iv-head">
     <div class="ih-top">
       <a class="sb-back" role="button" tabindex="0">${ICON_BACK}<span class="sb-back-lbl">${escapeHtml(backLabel)}</span></a>
       <div class="ih-prog"><span class="ih-prog-lbl">本岛进度</span><b class="ih-prog-txt">0/0</b><span class="ih-prog-bar"><i class="ih-prog-bar-i"></i></span></div>
     </div>
     <div class="ih-eyebrow"><span class="ih-no"></span><span class="ih-badge"></span><span class="ih-banner"></span></div>
     <h1 class="ih-title"></h1>
     <div class="ih-promise"></div>
   </header>` : '';
  return head + `<div class="map-wrap">
     <svg class="map-line" preserveAspectRatio="none" aria-hidden="true">
       <path class="seg-rest" d=""/>
       <path class="seg-branch" d=""/>
       <path class="seg-done" d=""/>
     </svg>
     <div class="map-spacer" aria-hidden="true"></div>
   </div>
   <div class="detail"><div class="dc"></div></div>`;   // map-wrap + detail（头牌可关）
}

/* 空态（数据缺失 / 找不到岛）—— 返回走 onClose */
function renderEmpty(root, opts, icon, title, desc){
  root.classList.add('isle-view');
  root.innerHTML = `<div class="isle-empty"><div class="em-ic">${icon}</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(desc)}</p>`+
    `<a class="em-btn" role="button" tabindex="0">${ICON_BACK}返回大航海图</a></div>`;
  const back = root.querySelector('.em-btn');
  if (back) back.addEventListener('click', e=>{ e.preventDefault(); if (opts && opts.onClose) opts.onClose(); else location.href='calendar.html?view=all'; });
}

/* ============================================================
   mount —— 把一座岛渲染进 root
   ============================================================ */
function mount(root, stageArg, opts){
  opts = opts || {};
  if (!root) return null;

  if (typeof COURSES==='undefined'){ renderEmpty(root, opts, '🧭','航海图数据没加载出来','course-data.js 没读到，刷新页面再试一次。'); return null; }

  const raw = String(stageArg==null?'':stageArg).trim().toUpperCase();
  const num = LETTER2NUM[raw] || (/^[1-4]$/.test(raw) ? parseInt(raw,10) : 0);
  if (!num){ renderEmpty(root, opts, '🧭','海图上找不到这座岛', raw ? `参数 stage=「${raw}」不是有效的岛（A / B / C / D）。` : '缺少 stage 参数。请从大航海图选择一座岛进入。'); return null; }
  const letter = NUM2LETTER[num];

  const courses = COURSES.filter(c=>c.stage===num);
  if (courses.length===0){ renderEmpty(root, opts, '🗺️','这座岛还在绘制中', `第${letter}岛暂时还没有课程节点。`); return null; }

  /* —— 实例态（闭包内）—— */
  let _courses = courses;
  let _flags = [];
  let _cci = -1;
  const _stageNum = num;
  let _coursePts = [];
  let _sel = null;

  const withHead = opts.header !== false;          // header:false → 只出内容（嵌进 isle-focus 头牌时用）
  root.classList.add('isle-view');
  root.classList.toggle('iv-no-head', !withHead);
  root.innerHTML = skeleton(opts.backLabel || '大航海图', withHead);
  const $ = sel => root.querySelector(sel);

  /* 返回按钮 */
  const backEl = $('.sb-back');
  const onBack = e => { if(e) e.preventDefault(); if (opts.onClose) opts.onClose(); else location.href='calendar.html?view=all'; };
  if (backEl){ backEl.addEventListener('click', onBack); backEl.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onBack(e); } }); }

  /* —— 计算进度 / 当前关 / 旁挂 —— */
  const completed = getCompleted();
  const currentStage = getCurrentStage(completed);
  const nextCourse = COURSES.find(c=>!completed.has(c.code));
  if (nextCourse && nextCourse.stage===num) _cci = courses.findIndex(c=>c.code===nextCourse.code);
  else if (num < currentStage) _cci = courses.length;   // 全岛已学完
  else _cci = -1;                                        // 本岛未解锁

  const len = courses.length;
  const doneInStage = courses.filter(c=>completed.has(c.code)).length;

  const atIdx = frac => Math.max(0, Math.min(len-1, Math.round((frac==null?1:frac)*len) - (frac>=1?1:0)));
  _flags = [];
  LIVES.filter(l=>l.stage===num).forEach(l=>{ const i=atIdx(l.afterFrac); _flags.push({ kind:'live', atIdx:i, reached: doneInStage>i, data:l }); });
  const assign = ASSIGNMENTS[num];
  if (assign){ const i=atIdx(assign.afterFrac); _flags.push({ kind:'task', atIdx:i, reached: doneInStage>i, data:assign }); }

  const stageState = num<currentStage ? 'done' : (num===currentStage ? 'current' : 'locked');
  const allLocked = _cci===-1;
  const allDone = doneInStage===len;

  /* —— 头部 —— */
  function fillHead(){
    const zh = ['一','二','三','四'][num-1];
    const csName = (typeof COURSE_STAGES!=='undefined' && COURSE_STAGES[num]) ? COURSE_STAGES[num].name : '';
    $('.ih-prog-txt').textContent = doneInStage+'/'+len;
    setTimeout(()=>{ const bar=$('.ih-prog-bar-i'); if(bar) bar.style.width=(len?Math.round(doneInStage/len*100):0)+'%'; }, 60);
    $('.ih-no').textContent = `第${zh}岛 · ${csName}`;
    const b = STAGE_BADGES[num], be = $('.ih-badge');
    be.textContent = `${b.icon} ${b.text}`; be.className = 'ih-badge ' + stageState;
    $('.ih-title').textContent = STAGE_NAMES[num];
    $('.ih-promise').textContent = STAGE_PROMISES[num];

    const banner = $('.ih-banner');
    if (allLocked){ banner.className='ih-banner locked show'; banner.innerHTML = `🔒 <b>未解锁</b>`; }
    else if (allDone){
      const nl=NUM2LETTER[num+1];
      banner.className='ih-banner done show';
      banner.innerHTML = `🎉 <b>已通关</b>${nl?` · <a class="iv-next" role="button" tabindex="0">下一岛</a>`:''}`;
      const nx = banner.querySelector('.iv-next');
      if (nx) nx.addEventListener('click', e=>{ e.preventDefault(); if (opts.onNextIsle) opts.onNextIsle(nl); else location.href='isle.html?stage='+nl; });
    } else banner.className='ih-banner';
  }

  /* —— 渲染节点 / 旁挂 / 端点 —— */
  function renderMap(){
    const wrap = $('.map-wrap');
    wrap.querySelectorAll('.pnode,.flag,.map-cap,.map-isle,.deco-compass').forEach(el=>el.remove());

    const isle = document.createElement('img'); isle.className='map-isle '+(allLocked?'locked':''); isle.src=ISLE_IMG[num]; isle.alt=''; wrap.appendChild(isle);
    wrap.insertAdjacentHTML('beforeend', `<svg class="deco-compass" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="rgba(250,246,233,.5)" stroke="#6f9298" stroke-width="1.4"/><circle cx="50" cy="50" r="38" fill="none" stroke="#9bbabd" stroke-width="0.7" stroke-dasharray="0.5 3.6"/><g fill="#c4dad8"><path d="M50 50 L67 33 L60 50 Z"/><path d="M50 50 L67 67 L50 60 Z"/><path d="M50 50 L33 67 L40 50 Z"/><path d="M50 50 L33 33 L50 40 Z"/></g><path d="M50 50 L54 50 L50 10 Z" fill="#39676c"/><path d="M50 50 L46 50 L50 10 Z" fill="#5a878c"/><circle cx="50" cy="50" r="3.4" fill="#2f5d62"/><text x="50" y="20.5" font-size="11" fill="#2f5d62" text-anchor="middle" font-weight="700">N</text></svg>`);

    _courses.forEach((c,i)=>{
      const state = i<_cci ? 'done' : (i===_cci ? 'current' : 'locked');
      const inner = state==='done' ? ICON_CHECK : (state==='locked' ? ICON_LOCK : ICON_COURSE);
      const here = state==='current' ? '<span class="here">你在这里</span>' : '';
      const nm = cleanTitle(c.t);
      const el = document.createElement('div');
      el.className = 'pnode '+state; el.dataset.idx=i; el.tabIndex=0; el.setAttribute('role','button');
      if (state==='locked'){ const dist = i - _cci; el.style.opacity = Math.max(.4, .92 - (dist-1)*.1).toFixed(2); }  // 远处未解锁的关逐级隐退，聚焦「当下这一关」
      el.title = nm; el.setAttribute('aria-label', `第${i+1}关 ${nm}`);
      el.innerHTML = inner + here + `<span class="pn-name">${escapeHtml(nm)}</span>`;
      el.addEventListener('click', ()=>onPick('course', i));
      el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onPick('course', i); } });
      wrap.appendChild(el);
    });

    _flags.forEach((f,i)=>{
      const meta = f.kind==='live' ? {cls:'t-live', icon:ICON_LIVE, lbl:'视频'} : {cls:'t-task', icon:ICON_TASK, lbl:'作业'};
      const el = document.createElement('div');
      el.className = 'flag '+meta.cls+(f.reached?'':' dim'); el.dataset.fi=i; el.tabIndex=0; el.setAttribute('role','button');
      el.setAttribute('aria-label', meta.lbl+'（旁挂·可选）');
      el.innerHTML = `<span class="fg-dot">${meta.icon}</span><span class="fg-stick"></span><span class="fg-lbl">${meta.lbl}</span>`;
      el.addEventListener('click', ()=>onPick(f.kind, i));
      el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onPick(f.kind, i); } });
      wrap.appendChild(el);
    });

    wrap.insertAdjacentHTML('beforeend', `<div class="map-cap cap-start"><span class="cap-dot"></span><span class="cap-lbl">启航</span></div>`);
    wrap.insertAdjacentHTML('beforeend', `<div class="map-cap cap-end"><span class="cap-flag${allDone?'':' dim'}">🚩</span><span class="cap-lbl">${allDone?'已通关':'通关'}</span></div>`);
  }

  /* —— 选择 / 详情卡 —— */
  function onPick(kind, idx){ if (kind==='course') selectCourse(idx); else selectFlag(idx); }
  function doAction(kind, idx){
    if (kind==='course'){ const c=_courses[idx]; const st=idx<_cci?'done':(idx===_cci?'current':'locked'); gotoCourse(c.code, st); }
    else if (kind==='live'){ gotoLive(); }
    else { gotoTask(_stageNum); }
  }
  function gotoCourse(code, state){
    if (state==='locked'){ const lc=COURSES.find(c=>c.code===code); showToast((lc?`《${cleanTitle(lc.t)}》`:'这一节')+' 还没解锁 · 先学完前面的'); return; }
    location.href = 'learn.html?code='+encodeURIComponent(code);
  }
  function gotoLive(){ showToast('视频 · 跳小鹅通观看（demo）'); }
  function gotoTask(stageNum){
    /* 作业提交/助教流转这期暂不开放（改 AI 批改，后端推进中）—— 入口先收起。
       homework-* / workbench 页面归档保留未删；恢复时把下面这行换回原来的 location.href 跳转即可。 */
    showToast('作业正在升级为 AI 批改 · 本期暂未开放');
  }
  function clearSel(){ root.querySelectorAll('.pnode.sel,.flag.sel').forEach(e=>e.classList.remove('sel')); }
  function selectCourse(idx){
    _sel = { kind:'course', idx };
    clearSel(); const el=root.querySelector(`.pnode[data-idx="${idx}"]`); if(el) el.classList.add('sel');
    const c=_courses[idx]; const st=idx<_cci?'done':(idx===_cci?'current':'locked');
    const stTxt = st==='done'?'已完成':st==='current'?'当前':'未解锁';
    const dc = $('.dc');
    dc.className = 'dc k-course';
    dc.innerHTML =
      `<div class="dc-icon">${ICON_COURSE}</div><div class="dc-body">`+
      `<div class="dc-tagrow"><span class="dc-tag">图文</span><span class="dc-code">${escapeHtml(c.code)}</span><span class="dc-state ${st}">${stTxt}</span></div>`+
      `<div class="dc-title">第${idx+1}关 · ${escapeHtml(cleanTitle(c.t))}</div><div class="dc-sub">约 ${c.mins} 分钟阅读</div></div>`+
      (st==='locked'
        ? `<button class="dc-btn locked" disabled>学完前面解锁</button>`
        : `<button class="dc-btn">${st==='done'?'再学一遍':'进入学习'} ${ICON_ARROW}</button>`);
    const btn = dc.querySelector('.dc-btn:not(.locked)');
    if (btn) btn.addEventListener('click', ()=>doAction('course', idx));
  }
  function selectFlag(idx){
    _sel = { kind:_flags[idx].kind, idx };
    clearSel(); const el=root.querySelector(`.flag[data-fi="${idx}"]`); if(el) el.classList.add('sel');
    const f=_flags[idx]; const dc = $('.dc');
    if (f.kind==='live'){
      const past = f.data.date < toInput(startOfDay(new Date())); const [,m,d]=f.data.date.split('-').map(Number);
      dc.className='dc k-live';
      dc.innerHTML =
        `<div class="dc-icon">${ICON_LIVE}</div><div class="dc-body">`+
        `<div class="dc-tagrow"><span class="dc-tag">视频</span><span class="dc-state opt">旁挂 · 可选</span></div>`+
        `<div class="dc-title">${escapeHtml(f.data.title)}</div><div class="dc-sub">${past?'直播已结束，可看回放':(m+'月'+d+'日 '+f.data.time+' 直播')}</div></div>`+
        `<button class="dc-btn">${past?'看回放':'去直播间'} ${ICON_ARROW}</button>`;
    } else {
      const sub = getSubmissionForStage(_stageNum);
      dc.className='dc k-task';
      dc.innerHTML =
        `<div class="dc-icon">${ICON_TASK}</div><div class="dc-body">`+
        `<div class="dc-tagrow"><span class="dc-tag">作业</span><span class="dc-state opt">旁挂 · 不计入解锁</span></div>`+
        `<div class="dc-title">${escapeHtml(sub?sub.title:f.data.title)}</div><div class="dc-sub">${sub?'已提交 · 待评审':escapeHtml(f.data.desc)}</div></div>`+
        `<button class="dc-btn">${sub?'看我的提交':'去提交'} ${ICON_ARROW}</button>`;
    }
    const btn = dc.querySelector('.dc-btn');
    if (btn) btn.addEventListener('click', ()=>doAction(f.kind, idx));
  }
  function syncSel(){ if(!_sel) return; if(_sel.kind==='course') selectCourse(_sel.idx); else selectFlag(_sel.idx); }

  /* —— 蜿蜒主航路 + 分叉支线 —— */
  function layout(){
    const wrap = $('.map-wrap');
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !_courses.length) return;
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    const N = _courses.length;
    const nodeR = isMobile?40:46;
    root.style.setProperty('--nodeR', nodeR+'px');
    root.style.setProperty('--nameW', (isMobile?98:150)+'px');

    const padX = isMobile?48:92, padTop = isMobile?86:98, padBot = isMobile?80:86;
    const minGap = isMobile?0:118;
    let areaW = isMobile ? (W - 2*padX) : Math.max(W - 2*padX, Math.round((N-1)*minGap/1.25));

    let relPts, areaH, contentH;
    if (isMobile){
      areaH = Math.max(360, N*78);
      relPts = [[0.5,0.03],[0.28,0.11],[0.32,0.22],[0.58,0.30],[0.70,0.40],[0.54,0.49],[0.30,0.57],[0.31,0.67],[0.54,0.75],[0.70,0.86],[0.5,0.97]];
      contentH = areaH + padTop + padBot;
    } else {
      areaH = Math.max(170, H - padTop - padBot);
      relPts = [[0.04,0.56],[0.13,0.30],[0.24,0.31],[0.34,0.55],[0.45,0.69],[0.55,0.57],[0.64,0.32],[0.75,0.29],[0.85,0.50],[0.93,0.63],[0.98,0.52]];
      contentH = Math.max(H, areaH + padTop + padBot);
    }
    const P = relPts.map(p=>({ x: padX + p[0]*areaW, y: padTop + p[1]*areaH }));
    const d = catmullRom(P);

    const NS = 'http://www.w3.org/2000/svg';
    const svg = $('.map-line');
    const tp = document.createElementNS(NS, 'path'); tp.setAttribute('d', d); tp.style.visibility='hidden'; svg.appendChild(tp);
    const total = tp.getTotalLength();
    _coursePts = []; const Ls = [];
    for (let i=0;i<N;i++){ const L = N>1 ? (i/(N-1))*total : total*0.5; const pt = tp.getPointAtLength(L); _coursePts[i]={x:pt.x,y:pt.y}; Ls[i]=L; }
    svg.removeChild(tp);

    const flagAt = new Set(_flags.map(f=>f.atIdx));
    const nodes = wrap.querySelectorAll('.pnode');
    const cxMid = padX + areaW/2;
    _coursePts.forEach((p,i)=>{
      const el = nodes[i]; if(!el) return;
      el.style.left = p.x+'px'; el.style.top = p.y+'px';
      el.classList.remove('name-up','name-side-l','name-side-r');
      if (isMobile){
        el.classList.add(p.x < cxMid ? 'name-side-r' : 'name-side-l');
      } else {
        let up;
        if (i===0) up = _coursePts[1] ? p.y <= _coursePts[1].y : false;
        else if (i===N-1) up = p.y <= _coursePts[i-1].y;
        else up = p.y <= (_coursePts[i-1].y + _coursePts[i+1].y)/2 - 1;
        if (i===_cci || flagAt.has(i)) up = false;
        if (up) el.classList.add('name-up');
      }
    });

    const contentW = areaW + 2*padX;
    const sp = $('.map-spacer'); if (sp) sp.style.width = isMobile ? '100%' : contentW+'px';
    svg.setAttribute('viewBox', `0 0 ${contentW} ${contentH}`);
    svg.style.width = isMobile ? '100%' : contentW+'px'; svg.style.height = contentH+'px';
    $('.seg-rest').setAttribute('d', d);
    const segDone = $('.seg-done'); segDone.setAttribute('d', d);
    const doneLen = (_cci>=N) ? total : (_cci>=0 ? Ls[_cci] : 0);
    if (doneLen>0){ segDone.style.display=''; segDone.setAttribute('stroke-dasharray', doneLen.toFixed(1)+' '+(total+10).toFixed(1)); }
    else segDone.style.display='none';

    let branchD = '';
    wrap.querySelectorAll('.flag').forEach(el=>{
      const fi = parseInt(el.dataset.fi,10); const f = _flags[fi]; const cp = _coursePts[f.atIdx] || _coursePts[N-1];
      const dx = (f.kind==='live' ? -1 : 1) * (isMobile?26:38);
      const fx = cp.x + dx, fy = cp.y - (isMobile?60:74);
      el.style.left = fx+'px'; el.style.top = fy+'px';
      branchD += `M ${cp.x.toFixed(1)} ${cp.y.toFixed(1)} Q ${cp.x.toFixed(1)} ${((cp.y+fy)/2).toFixed(1)} ${fx.toFixed(1)} ${(fy + (isMobile?13:15)).toFixed(1)} `;
    });
    $('.seg-branch').setAttribute('d', branchD);

    const cs=$('.cap-start'), ce=$('.cap-end');
    if (cs){ const p=_coursePts[0]; cs.style.left=Math.max(24, p.x-(isMobile?6:50))+'px'; cs.style.top=(p.y + (isMobile? -nodeR/2-24 : 0))+'px'; }
    if (ce){ const p=_coursePts[N-1]; ce.style.left=Math.min(W-24, p.x+(isMobile?6:50))+'px'; ce.style.top=(p.y + (isMobile? nodeR/2+24 : 0))+'px'; }

    if (isMobile) { wrap.style.minHeight = contentH+'px'; }
    else { const fi=(_cci>=0&&_cci<N)?_cci:(_cci>=N?N-1:0); const cw=wrap.clientWidth; wrap.scrollLeft = Math.max(0, Math.min(contentW-cw, _coursePts[fi].x - cw/2)); }
  }

  /* —— 启动 —— */
  if (withHead) fillHead();
  renderMap();
  const defIdx = (_cci>=0 && _cci<len) ? _cci : (allDone ? len-1 : 0);
  selectCourse(defIdx);
  layout();

  const onResize = debounce(()=>{ layout(); if(_sel) syncSel(); }, 120);
  window.addEventListener('resize', onResize);

  return {
    stage: num,
    relayout(){ layout(); if(_sel) syncSel(); },
    destroy(){ window.removeEventListener('resize', onResize); }
  };
}

window.IsleView = { mount };
})();
