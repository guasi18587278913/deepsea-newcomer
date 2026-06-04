/* ==========================================================
   🎭 演示身份切换器 · 仅原型演示用
   ----------------------------------------------------------
   单文件、零依赖、自动挂载：<script src="demo-switcher.js"></script>
   屏幕左下角小开关，一键在「新人 / 老用户·有idea / 老用户·无idea」之间切换，
   省去手动改网址 ?fresh=1，且切换不怕丢真实思路 —— 灌的是演示用 demo 数据。

   ⚠️ 仅供原型演示。交付真实产品时，删掉各页这行 <script> 引用（或删本文件）即彻底消失，
      绝不影响真实用户的入口行为（老用户照常被 welcome 闸门放进各自主页）。
   ========================================================== */
(function () {
  if (document.getElementById('ds-demo-switcher')) return; // 防重复挂载

  /* ---- 16 节完成进度：让「老用户」首页看起来已经学了一阵（对应日历 16/77、阶段 2）---- */
  var PROGRESS_16 = ['M1.1','M1.2','M1.3','M2.1','M2.2','M2.3','M2.4','M2.5','M2.6','M2.7','M2.8','M2.9','M3.1','M3.2','M3.3','M3.4'];

  /* ---- 示例项目：「有 idea」老用户，roadmap 顶栏「你的项目」状态条会读它 ---- */
  var DEMO_PROJECT = {
    name: 'AI 面试教练',
    ideaText: '帮求职者用 AI 模拟面试、即时点评表现的小工具',
    audience: '准备跳槽的职场人',
    form: 'teach',
    goal: '做产品赚钱',
    timeEstimate: '约 6 周',
    stage: '原型',
    createdAt: '2026-05-04'
  };

  /* ---- 工具：清掉本机所有 ds_ 开头的 demo 数据 ---- */
  function clearDs() {
    Object.keys(localStorage)
      .filter(function (k) { return k.indexOf('ds_') === 0; })
      .forEach(function (k) { localStorage.removeItem(k); });
  }
  /* ---- 工具：灌一套老用户公共上下文 ---- */
  function seedCommon(hasIdea) {
    localStorage.setItem('ds_onboarded', 'true');
    localStorage.setItem('ds_experience', hasIdea ? '有基础' : '零基础');
    localStorage.setItem('ds_goal', hasIdea ? '做产品赚钱' : '提升技术');
    localStorage.setItem('ds_daily_minutes', '60');
    localStorage.setItem('ds_enrolled_at', '2026-05-04');
    localStorage.setItem('ds_completed_demo', JSON.stringify(PROGRESS_16));
  }

  /* ---- 三种演示身份 ---- */
  var IDENTITIES = [
    { id: 'fresh', icon: '🆕', label: '新人（未填问卷）',
      apply: function () {
        clearDs();
        location.href = 'welcome.html';          // 没数据 → 闸门放行 → 走问卷
      } },
    { id: 'old-idea', icon: '🧭', label: '老用户 · 有 idea',
      apply: function () {
        clearDs(); seedCommon(true);
        localStorage.setItem('ds_has_idea', 'has');
        localStorage.setItem('ds_project', JSON.stringify(DEMO_PROJECT));
        location.href = 'roadmap.html';          // 有 idea → 学习路线
      } },
    { id: 'old-noidea', icon: '📅', label: '老用户 · 无 idea',
      apply: function () {
        clearDs(); seedCommon(false);
        localStorage.setItem('ds_has_idea', 'no');
        location.href = 'calendar.html';         // 无 idea → 学习日历
      } }
  ];

  /* ---- 判断当前处于哪种身份（用于高亮 + pill 显示）---- */
  function currentId() {
    var onboarded = localStorage.getItem('ds_onboarded') === 'true'
                 || !!localStorage.getItem('ds_enrolled_at');
    if (!onboarded) return 'fresh';
    return localStorage.getItem('ds_has_idea') === 'has' ? 'old-idea' : 'old-noidea';
  }

  /* ---------------- CSS ---------------- */
  var css = ''
    + '#ds-demo-switcher{position:fixed;z-index:9998;bottom:22px;left:22px;'
    + "font-family:'PingFang SC',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}"
    + '#ds-demo-switcher *{box-sizing:border-box;}'
    + '.dsx-pill{display:inline-flex;align-items:center;gap:8px;background:#1a2942;color:#fff;'
    + 'border:none;border-radius:999px;padding:9px 13px;cursor:pointer;font-size:13px;font-weight:600;'
    + 'box-shadow:0 4px 14px rgba(26,41,66,.28);transition:transform .15s,box-shadow .15s;}'
    + '.dsx-pill:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(26,41,66,.34);}'
    + '.dsx-pill .dsx-emoji{font-size:15px;line-height:1;}'
    + '.dsx-pill .dsx-cur{opacity:.95;white-space:nowrap;}'
    + '.dsx-pill .dsx-caret{font-size:9px;opacity:.65;transition:transform .2s;}'
    + '#ds-demo-switcher.open .dsx-pill .dsx-caret{transform:rotate(180deg);}'
    + '.dsx-panel{position:absolute;bottom:calc(100% + 10px);left:0;width:236px;background:#fff;'
    + 'border-radius:14px;border:1px solid rgba(26,41,66,.10);box-shadow:0 12px 32px rgba(26,41,66,.18);'
    + 'overflow:hidden;opacity:0;transform:translateY(8px) scale(.98);pointer-events:none;'
    + 'transition:opacity .18s,transform .18s;}'
    + '#ds-demo-switcher.open .dsx-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}'
    + '.dsx-head{padding:11px 14px 9px;border-bottom:1px solid rgba(26,41,66,.07);'
    + 'display:flex;align-items:center;justify-content:space-between;}'
    + '.dsx-head .dsx-title{font-size:12.5px;font-weight:700;color:#1a2942;}'
    + '.dsx-head .dsx-tag{font-size:10px;font-weight:700;color:#b9762a;background:rgba(200,152,84,.14);'
    + 'padding:2px 7px;border-radius:6px;letter-spacing:.03em;}'
    + '.dsx-opt{display:flex;align-items:center;gap:10px;padding:11px 14px;cursor:pointer;border:none;'
    + 'background:none;width:100%;text-align:left;font-size:13.5px;color:#1a2942;transition:background .12s;}'
    + '.dsx-opt:hover{background:#f1f7f6;}'
    + '.dsx-opt .dsx-ic{font-size:16px;width:20px;text-align:center;line-height:1;}'
    + '.dsx-opt .dsx-lb{flex:1;font-weight:500;}'
    + '.dsx-opt.cur{background:#e8f6f5;}'
    + '.dsx-opt.cur .dsx-lb{color:#0d9488;font-weight:700;}'
    + '.dsx-opt .dsx-dot{width:8px;height:8px;border-radius:50%;border:1.5px solid #c2ccd6;flex:none;}'
    + '.dsx-opt.cur .dsx-dot{border-color:#0d9488;background:#0d9488;box-shadow:0 0 0 3px rgba(13,148,136,.16);}'
    + '.dsx-foot{padding:9px 14px 11px;font-size:11px;color:#8a96a3;line-height:1.5;'
    + 'border-top:1px solid rgba(26,41,66,.06);}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- DOM ---------------- */
  var cur = currentId();
  var curLabel = (IDENTITIES.filter(function (x) { return x.id === cur; })[0] || IDENTITIES[0]).label;

  var root = document.createElement('div');
  root.id = 'ds-demo-switcher';
  root.innerHTML = ''
    + '<div class="dsx-panel" role="menu">'
    +   '<div class="dsx-head"><span class="dsx-title">🎭 演示身份</span><span class="dsx-tag">仅原型演示</span></div>'
    +   IDENTITIES.map(function (it) {
          return '<button class="dsx-opt' + (it.id === cur ? ' cur' : '') + '" data-id="' + it.id + '" role="menuitem">'
            + '<span class="dsx-ic">' + it.icon + '</span>'
            + '<span class="dsx-lb">' + it.label + '</span>'
            + '<span class="dsx-dot"></span>'
            + '</button>';
        }).join('')
    +   '<div class="dsx-foot">切换会重置本机 demo 数据，模拟对应用户视角。交付产品删掉本脚本即消失。</div>'
    + '</div>'
    + '<button class="dsx-pill" aria-label="切换演示身份">'
    +   '<span class="dsx-emoji">🎭</span><span class="dsx-cur">' + curLabel + '</span><span class="dsx-caret">▲</span>'
    + '</button>';
  document.body.appendChild(root);

  /* ---------------- 交互 ---------------- */
  var pill = root.querySelector('.dsx-pill');
  pill.addEventListener('click', function (e) {
    e.stopPropagation();
    root.classList.toggle('open');
  });
  root.querySelectorAll('.dsx-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var it = IDENTITIES.filter(function (x) { return x.id === btn.dataset.id; })[0];
      if (it) it.apply();
    });
  });
  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) root.classList.remove('open');
  });
})();
