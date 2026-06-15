/* ============================================================
   定制学习路线 · UI 层（routes-ui.js）— 运行时挂载，零侵入
   ------------------------------------------------------------
   它做什么：
   1) 注入「生成我的专属航线」按钮（船舵图标）+ 问卷弹窗 + 样式；
   2) 在外层包住页面已有的 render() / _fillCalloutContent()：
      选了方向(ds_route) → 进 route-mode，按 routes.js 的显式 flow 渲染岛 + 抽屉；
      没选 → 原样走默认全量航海图，逻辑完全不动。
   依赖：routes.js（ROUTES）、calendar.html 的全局函数（render/openCallout/
        getCompleted/escapeHtml/toInput/startOfDay/gotoLive/renderHero/COURSES…）
   原型说明：点路线图文 = 切换「已学」，让解锁/船/进度肉眼动起来（真实场景跳 learn 页）。
   ============================================================ */
(function () {
  if (typeof ROUTES === 'undefined') { console.warn('[routes-ui] 未找到 ROUTES，确认 routes.js 已先于本文件引入'); return; }

  const SHORT = { idea:'找产品需求', miniprogram:'小程序', aiwebsite:'AI 网站', aiemployee:'AI 员工',
    minigame:'小游戏', app:'手机 App', automedia:'自媒体', workflow:'工作流', claudecode:'Claude Code', mcp:'MCP+Skills', spec:'提需求' };
  const I_COURSE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h8a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V4z"/><path d="M4 4v12a2 2 0 0 0 2 2h8"/><path d="M7 8h4M7 11h3"/></svg>';
  const I_LIVE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7.6"/><path d="M8.2 6.7l5.3 3.3-5.3 3.3z" fill="currentColor" stroke="none"/></svg>';
  const I_TASK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="12" height="14" rx="1.5"/><path d="M7 8l2 2 4-4M7 13h6"/></svg>';
  const ARROW = '<svg class="kd-fi-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>';
  const PIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  /* 船舵图标 = 复用顶栏「深海圈」logo 的舵，前后呼应、入航海世界 */
  const HELM = '<svg class="rg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>';
  const GEN_LABEL = HELM + '<span>生成你的专属航线</span>' + '<svg class="rg-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>';

  /* ---------- 状态 ---------- */
  function getRoute() { try { const k = localStorage.getItem('ds_route'); return (k && ROUTES[k]) ? ROUTES[k] : null; } catch (e) { return null; } }
  /* 路线进度单独存，绝不碰默认全量图的 ds_completed_demo */
  function routeDone() { try { return new Set(JSON.parse(localStorage.getItem('ds_route_completed') || '[]')); } catch (e) { return new Set(); } }
  function setRouteDone(set) { localStorage.setItem('ds_route_completed', JSON.stringify(Array.from(set))); }
  function routeCourseCodes(r) { const o = []; r.islands.forEach(is => is.flow.forEach(f => { if (f.type === 'course') o.push(f.code); })); return o; }
  function islandCourses(is) { return is.flow.filter(f => f.type === 'course'); }
  function currentDay(r, done) { for (let i = 0; i < r.islands.length; i++) { if (islandCourses(r.islands[i]).some(f => !done.has(f.code))) return i + 1; } return r.islands.length + 1; }
  function nextCode(r, done) { const c = routeCourseCodes(r); for (let i = 0; i < c.length; i++) if (!done.has(c[i])) return c[i]; return null; }

  /* ---------- 注入样式 ---------- */
  const css = `
.route-gen-btn{margin-top:12px;display:inline-flex;align-items:center;gap:8px;background:linear-gradient(180deg,rgba(253,250,240,.96),rgba(245,238,218,.96));color:var(--deep-blue);border:1px solid rgba(200,152,84,.7);font-family:var(--font-sans);font-size:13.5px;font-weight:600;padding:9px 17px;border-radius:999px;cursor:pointer;box-shadow:0 6px 16px -8px rgba(120,90,30,.4);backdrop-filter:blur(2px);transition:all .16s}
.route-gen-btn:hover{border-color:var(--gold);background:linear-gradient(180deg,#fdfaf0,#f3e9cf);box-shadow:0 9px 20px -7px rgba(120,90,30,.5);transform:translateY(-1px)}
.route-gen-btn .rg-ico{width:16px;height:16px;color:var(--gold);flex:none}
.route-gen-btn.reselect{background:none;color:#6f8a86;border:1px solid var(--border);box-shadow:none;font-weight:500;font-size:12.5px;padding:6px 14px}
.route-gen-btn.reselect:hover{border-color:var(--teal);color:var(--teal);transform:none}
.km-wrap.route-mode>.island,.km-wrap.route-mode>.km-route,.km-wrap.route-mode>.km-dot,.km-wrap.route-mode .km-depth{display:none}
.km-wrap:not(.route-mode) #routeIslands{display:none}
/* 「继续学习」= 右下角米白描金长方条：实色暖卡 + 金竖条 + 青圆箭头，只留课程标题 */
#homeHero{position:absolute;left:0;top:2%;z-index:8;margin:0;max-width:340px}
#homeHero.home-hero{display:block;min-width:0;max-width:340px;padding:8px 11px 9px 17px;background:linear-gradient(180deg,#fffdf7,#fbf4e3);border:1px solid #e6d4a8;border-radius:11px;box-shadow:0 14px 30px -14px rgba(120,90,30,.55),inset 0 1px 0 rgba(255,255,255,.75);overflow:visible}
#homeHero.home-hero::before{content:"";display:block;position:absolute;left:0;top:8px;bottom:8px;width:3.5px;border-radius:0 3px 3px 0;background:linear-gradient(180deg,#d8b35f,#c89854)}
#homeHero.home-hero::after{display:none}
#homeHero .hh-eyebrow{margin:0 0 3px;padding:0;background:none;font-size:9px;font-weight:700;letter-spacing:.07em;color:#a07a2e;text-transform:none;display:inline-flex;align-items:center;gap:4px}
#homeHero .hh-eyebrow::before{content:"⚓";font-size:10px;opacity:.9;color:#c89854}
#homeHero .hh-row{display:flex;align-items:center;gap:10px;flex-wrap:nowrap;margin:0}
#homeHero .hh-lh{display:none}
#homeHero .hh-code{display:none}
#homeHero .hh-next{flex:1 1 auto;min-width:0;overflow:hidden;display:block}
#homeHero .hh-title{display:block;font-family:var(--font-sans);font-size:13px;font-weight:700;color:#33291a;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#homeHero .hh-btn{flex:none;margin:0;width:27px;height:27px;min-width:0;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;gap:0;background:linear-gradient(180deg,#1ba093,#0c6f66);border:none;color:#fff;font-size:0;box-shadow:0 5px 12px -5px rgba(13,148,136,.6);text-shadow:none}
#homeHero .hh-btn::before{display:none}
#homeHero .hh-btn::after{content:"→";font-size:14px;font-weight:700;line-height:1;color:#fff}
#homeHero .hh-btn:hover{background:linear-gradient(180deg,#23b0a1,#0e7a70);transform:translateY(-1px);box-shadow:0 8px 16px -6px rgba(13,148,136,.7)}
/* ===== 航线下拉（替代整页弹窗）===== */
.route-gen-btn .rg-caret{width:13px;height:13px;color:#9a7a3a;flex:none;margin-left:1px;transition:transform .18s}
.route-gen-btn.dd-open .rg-caret{transform:rotate(180deg)}
.route-dd{position:fixed;z-index:60;width:316px;max-height:70vh;overflow-y:auto;padding:7px;display:none;background:#fffdf9;border:1px solid #e6d8ba;border-radius:14px;box-shadow:0 24px 54px -22px rgba(46,32,10,.5),0 8px 20px -14px rgba(46,32,10,.3)}
.route-dd.show{display:block;animation:ddIn .16s ease both}
@keyframes ddIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.route-dd .dd-cap{font-family:var(--font-mono,monospace);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#a8956a;padding:6px 11px 4px}
.route-dd .dd-sep{height:1px;margin:6px 9px;background:linear-gradient(90deg,transparent,rgba(165,128,60,.22),transparent)}
.route-dd .dd-item{display:flex;align-items:center;gap:11px;width:100%;text-align:left;font-family:inherit;cursor:pointer;padding:9px 11px;border:none;background:none;border-radius:9px;color:var(--deep-blue);transition:background .14s}
.route-dd .dd-item:hover{background:rgba(13,148,136,.07)}
.route-dd .dd-item .di-ic{width:30px;height:30px;border-radius:8px;flex:none;display:grid;place-items:center;color:#0c7a70;background:rgba(13,148,136,.09)}
.route-dd .dd-item:hover .di-ic{background:rgba(13,148,136,.16)}
.route-dd .dd-item .di-ic svg{width:17px;height:17px}
.route-dd .dd-item .di-t{flex:1;min-width:0;font-size:13.5px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.route-dd .dd-item .di-chk{width:16px;height:16px;flex:none;color:var(--teal);opacity:0}
.route-dd .dd-item.cur{background:rgba(13,148,136,.1)}
.route-dd .dd-item.cur .di-chk{opacity:1}
.route-dd .dd-item.cur .di-ic{color:#fff;background:var(--teal)}
.route-dd .dd-item.full .di-ic{color:#9a7a3a;background:rgba(200,152,84,.13)}
/* ===== 切换确认框 ===== */
.route-cfm-mask{position:fixed;inset:0;z-index:70;display:none;place-items:center;background:rgba(26,40,46,.34);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);padding:20px}
.route-cfm-mask.show{display:grid}
.route-cfm{position:relative;width:min(380px,92vw);padding:24px 24px 18px;border-radius:15px;color:#33291a;text-align:left;background:linear-gradient(180deg,#fffdf9,#fbf4e6);border:1px solid #e6d8ba;box-shadow:0 30px 70px -24px rgba(46,32,10,.5);animation:cfmIn .22s cubic-bezier(.22,1,.36,1) both}
@keyframes cfmIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
.route-cfm::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;border-radius:15px 15px 0 0;background:linear-gradient(90deg,transparent,rgba(200,152,84,.55) 30%,rgba(200,152,84,.55) 70%,transparent)}
.route-cfm .cf-ic{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;color:#a8742a;background:rgba(200,152,84,.14);margin-bottom:13px}
.route-cfm .cf-ic svg{width:22px;height:22px}
.route-cfm .cf-t{font-family:var(--font-display,serif);font-size:19px;font-weight:700;color:var(--deep-blue);margin:0 0 7px}
.route-cfm .cf-d{font-size:13px;color:#5e5132;line-height:1.65;margin:0 0 20px}
.route-cfm .cf-d b{color:var(--teal-deep);font-weight:600}
.route-cfm .cf-d .cf-keep{color:#9a7a3a}
.route-cfm .cf-act{display:flex;justify-content:flex-end;gap:10px}
.route-cfm .cf-btn{font-family:var(--font-sans);font-size:13px;font-weight:600;cursor:pointer;padding:9px 18px;border-radius:999px;border:1px solid transparent}
.route-cfm .cf-cancel{color:#7a6b4a;background:none;border-color:rgba(165,128,60,.4)}
.route-cfm .cf-cancel:hover{background:rgba(165,128,60,.08)}
.route-cfm .cf-ok{color:#fff;background:linear-gradient(180deg,#15a89a,#0c7268);border-color:rgba(200,152,84,.5);box-shadow:0 8px 18px -9px rgba(13,148,136,.6)}`;
  const st = document.createElement('style'); st.id = 'routeUiStyle'; st.textContent = css; document.head.appendChild(st);

  /* ---------- 注入「航线总览」整页浮层（12 条 · 3 类货架 + Stage 0）---------- */
  const RICN = {
    mp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="3" width="12" height="18" rx="3"/><path d="M10.5 18h3"/></svg>',
    web:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    game:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="7" width="19" height="10" rx="5"/><path d="M7 11v2M6 12h2M15.5 11.5h.01M18 13.5h.01"/></svg>',
    app:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M9.5 5h5M11 18.5h2"/></svg>',
    robot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4.5M9.5 4.5h5M8.5 13v1.4M15.5 13v1.4"/></svg>',
    media:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    flow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="6" height="5" rx="1.2"/><rect x="15" y="9" width="6" height="5" rx="1.2"/><rect x="3" y="15" width="6" height="5" rx="1.2"/><path d="M9 6.5h3a2 2 0 0 1 2 2v3M9 17.5h3a2 2 0 0 0 2-2V14"/></svg>',
    code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 10l2.5 2L7 14M12.5 14h4"/></svg>',
    mcp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 2v5M15 2v5M7 7h10v3a5 5 0 0 1-10 0z"/><path d="M12 15v5"/></svg>',
    spec:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M8.5 12l1.5 1.5 3-3M8.5 17h7"/></svg>',
    compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z" fill="currentColor" stroke="none"/></svg>'
  };
  const RMETA = [
    { cat:'product', key:'miniprogram', icon:'mp',  t:'开发一个小程序', p:'从 0 到一个能上线、能变现的微信小程序', fit:'想做微信生态轻应用、靠广告 / 订阅变现', out:'一个上线的小程序 + 30 天变现清单' },
    { cat:'product', key:'aiwebsite',   icon:'web', t:'上线第一个网站', p:'从一句话需求，到一个有域名、能注册、能收费的真网站', fit:'想做网页工具 / 出海 SaaS', out:'一个有域名、能登录（能收费）的上线网站', tag:'主干 · 最厚', tagc:'gold' },
    { cat:'product', key:'minigame',    icon:'game',t:'做出一个小游戏', p:'做一个能在群里疯传的微信小游戏', fit:'想靠社交玩法 + 激励视频广告变现', out:'一个上架、能群传的小游戏', tag:'难度 ★★★★★', tagc:'warm' },
    { cat:'product', key:'app',         icon:'app', t:'开发一款手机 App', p:'把产品搬上手机，上架 App Store / Google Play', fit:'已会网页技术（React）、想做 App', out:'一个上架商店、能内购变现的 App', tag:'前置 React', tagc:'warm' },
    { cat:'employee', key:'aiemployee', icon:'robot',   t:'搭建你的 AI 员工', p:'从「用 AI 工具」升级到「让 AI 替你自动干活」', fit:'想把重复工作整体托管给 AI', out:'一个会长期自动干活的 AI 员工', tag:'总纲', tagc:'teal' },
    { cat:'employee', key:'automedia',  icon:'media',   t:'让 AI 跑自媒体', p:'把公众号 / Twitter 内容运营托管给 AI，自动发、自动涨粉', fit:'做自媒体、想用 OpenClaw 解放双手', out:'一个自动跑你自媒体的 AI（小龙虾）' },
    { cat:'employee', key:'workflow',   icon:'flow',    t:'搭自动化工作流', p:'把一件多步骤的重复活，做成 AI 全自动流水线', fit:'有明确重复流程想自动化', out:'一条无人值守、自动跑的工作流' },
    { cat:'skill', key:'claudecode', icon:'code', t:'学习 Claude Code', p:'从「AI 住编辑器」升级到「AI 住终端」，对话驱动写码 / 部署', fit:'已做过几个项目、想提速', out:'一套配好命令 / 记忆 / Skill 的工作流' },
    { cat:'skill', key:'mcp',        icon:'mcp',  t:'解锁 MCP 和 Skills', p:'给 AI 装上「连接一切的万能插头」和「上岗 SOP」', fit:'想让 AI 稳定干活、突破截图复制', out:'装好 MCP + 一份可触发的 SKILL.md' },
    { cat:'skill', key:'spec',       icon:'spec', t:'学会和 AI 提需求', p:'把模糊想法，说成 AI 能一次做对的「任务书」', fit:'所有人 —— 用好 AI 编程的地基', out:'一份能让 AI 一次做对的 SPEC', tag:'地基 · 人人', tagc:'teal' },
    { cat:'start', key:'idea', icon:'compass', t:'找产品需求', p:'还没想好做啥？先从一堆模糊念头里，选出 1 个最该先做的产品需求' },
  ];
  /* ---------- 航线下拉菜单（替代整页弹窗）---------- */
  const DD_FULL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>';
  const DD_CHK = '<svg class="di-chk" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 4"/></svg>';
  const ddMenu = document.createElement('div'); ddMenu.id = 'routeDD'; ddMenu.className = 'route-dd';
  ddMenu.innerHTML = '<div class="dd-cap">默认</div>'
    + `<button class="dd-item full" data-key="full"><span class="di-ic">${DD_FULL}</span><span class="di-t">全量航海图 · 全部课程</span>${DD_CHK}</button>`
    + `<div class="dd-sep"></div><div class="dd-cap">${RMETA.length} 条专属航线</div>`
    + RMETA.map(o => `<button class="dd-item" data-key="${o.key}"><span class="di-ic">${RICN[o.icon]}</span><span class="di-t">${o.t}</span>${DD_CHK}</button>`).join('');
  document.body.appendChild(ddMenu);
  /* ---------- 切换确认框（覆盖学习记录前确认）---------- */
  const cfm = document.createElement('div'); cfm.id = 'routeCfm'; cfm.className = 'route-cfm-mask';
  cfm.innerHTML = `<div class="route-cfm"><div class="cf-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 16.5v.5"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg></div><h3 class="cf-t">换一条航线？</h3><p class="cf-d">切到「<b id="cfName"></b>」会把<b>当前航线的学习进度清空、从头来过</b>；<span class="cf-keep">但你已提交的作业会保留。</span></p><div class="cf-act"><button class="cf-btn cf-cancel" id="cfCancel">取消</button><button class="cf-btn cf-ok" id="cfOk">确定切换</button></div></div>`;
  document.body.appendChild(cfm);

  /* ---------- 副标题已删：运行时兜底移除写死的副标题 + 把「生成」按钮挂到标题块末尾 ---------- */
  const oldSub = document.querySelector('.km-head .km-head-sub'); if (oldSub) oldSub.remove();
  const headL = document.querySelector('.km-head .km-head-l');
  let genBtn = null;
  if (headL) {
    genBtn = document.createElement('button');
    genBtn.id = 'routeGenBtn'; genBtn.className = 'route-gen-btn'; genBtn.innerHTML = GEN_LABEL;
    genBtn.addEventListener('click', e => { e.stopPropagation(); ddMenu.classList.contains('show') ? closeDD() : openRouteModal(); });
    headL.appendChild(genBtn);
  }
  /* 「继续学习」卡 = 右下角米白描金长方条（样式见上方注入 CSS）：放进地图层(kmWrap) 绝对定位 */
  const hhCard = document.getElementById('homeHero'), kmw0 = document.getElementById('kmWrap');
  if (hhCard && kmw0) kmw0.appendChild(hhCard);

  /* ---------- 下拉选择 + 切换确认（覆盖学习记录前拦截）---------- */
  let _pending = null;
  function curRoute() { return localStorage.getItem('ds_route') || null; }
  function routeName(key) { if (key === 'full') return '全量航海图'; const m = RMETA.find(x => x.key === key); return m ? m.t : (SHORT[key] || key); }
  function markDD() { const c = curRoute(); ddMenu.querySelectorAll('.dd-item').forEach(b => { const k = b.dataset.key; b.classList.toggle('cur', (k === 'full' && !c) || k === c); }); }
  function openRouteModal() { markDD(); const r = genBtn.getBoundingClientRect(); ddMenu.style.left = Math.round(r.left) + 'px'; ddMenu.style.top = Math.round(r.bottom + 8) + 'px'; ddMenu.style.maxHeight = Math.max(220, Math.round(window.innerHeight - r.bottom - 24)) + 'px'; ddMenu.classList.add('show'); genBtn.classList.add('dd-open'); }
  function closeDD() { ddMenu.classList.remove('show'); genBtn.classList.remove('dd-open'); }
  function closeRouteModal() { closeDD(); }
  function closeCfm() { cfm.classList.remove('show'); _pending = null; }
  function applyRoute(key) {
    if (key === 'full') { localStorage.removeItem('ds_route'); localStorage.removeItem('ds_route_completed'); }
    else { const changed = curRoute() !== key; localStorage.setItem('ds_route', key); if (changed) localStorage.removeItem('ds_route_completed'); }
    closeDD(); closeCfm(); if (window.closeCallout) closeCallout(); render();
    if (window.showToast) showToast(key === 'full' ? '已切到全量航海图' : '已切到「' + routeName(key) + '」航线');
  }
  function pickRoute(key) {
    closeDD();
    const c = curRoute(); if ((key === 'full' && !c) || key === c) return;   /* 已是当前，不动 */
    if (c) { _pending = key; document.getElementById('cfName').textContent = routeName(key); cfm.classList.add('show'); return; }   /* 在某条路线上切走 → 一律确认（A②）*/
    applyRoute(key);
  }
  ddMenu.querySelectorAll('.dd-item').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); pickRoute(b.dataset.key); }));
  document.getElementById('cfCancel').addEventListener('click', closeCfm);
  document.getElementById('cfOk').addEventListener('click', () => { if (_pending != null) applyRoute(_pending); });
  cfm.addEventListener('click', e => { if (e.target === cfm) closeCfm(); });
  document.addEventListener('click', e => { if (ddMenu.classList.contains('show') && !ddMenu.contains(e.target) && !genBtn.contains(e.target) && e.target !== genBtn) closeDD(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDD(); closeCfm(); } });
  window.addEventListener('scroll', e => { if (ddMenu.classList.contains('show') && !(e.target === ddMenu || (e.target && e.target.nodeType === 1 && ddMenu.contains(e.target)))) closeDD(); }, true);
  window.addEventListener('resize', () => { if (ddMenu.classList.contains('show')) closeDD(); });

  /* ---------- 路线地图（复用现有岛屿样式 + isle PNG，沿上升航线铺 N 座岛）---------- */
  function renderRouteMap(r, done) {
    const wrap = document.getElementById('kmWrap'); wrap.classList.add('route-mode');
    let host = document.getElementById('routeIslands');
    if (!host) { host = document.createElement('div'); host.id = 'routeIslands'; wrap.appendChild(host); }
    const cur = currentDay(r, done), N = r.islands.length;
    const L = i => N > 1 ? 12 + i * (70 / (N - 1)) : 50;
    const B = i => N > 1 ? 9 + i * (14 / (N - 1)) : 14;
    host.innerHTML = r.islands.map((is, i) => {
      const day = i + 1, state = day < cur ? 'done' : (day === cur ? 'cur' : 'locked'), cc = islandCourses(is).length;
      return `<div class="island route-isle ${state}" data-day="${day}" style="left:${L(i).toFixed(1)}%;bottom:${B(i).toFixed(1)}%;width:17%">
        <div class="lbl"><span class="pin">你在这里 ${PIN}</span>
          <div class="zone">岛 · <b>${day < 10 ? '0' + day : day}</b></div>
          <div class="nm"><span class="lk">🔒 </span>${escapeHtml(is.zone || is.title)}</div>
          <div class="dt">共 ${cc} 节</div></div>
        <img alt="${escapeHtml(is.zone || '')}岛">
      </div>`;
    }).join('');
    const ship = document.getElementById('kmShip');
    /* 专属航线沿用单船(木帆船 ship-2)，不随阶段进化，避免承接默认图的航母图 */
    if (ship) { ship.src = 'assets/ship-2.png'; ship.style.width = '9.5%'; const ai = Math.min(cur, N) - 1; ship.style.left = (L(ai) - 9) + '%'; ship.style.top = (100 - B(ai) - 3) + '%'; ship.style.display = ''; }
    host.querySelectorAll('.route-isle').forEach(el => {
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
      el.addEventListener('click', e => { e.stopPropagation(); _openDay = parseInt(el.dataset.day, 10); openCallout(_openDay, el, null); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    });
  }

  let _openDay = 1;

  /* ---------- 路线抽屉：按岛的显式 flow 渲染（图文/视频/作业），视频&作业未学到则灰显 ---------- */
  function fillRouteCallout(r, day) {
    const done = routeDone(), is = r.islands[day - 1]; if (!is) return;
    const cur = currentDay(r, done), state = day < cur ? 'done' : (day === cur ? 'current' : 'locked');
    const badge = document.getElementById('kdBadge'); badge.textContent = '岛 ' + day; badge.className = 'kd-badge ' + state;
    document.getElementById('kdStageNum').textContent = SHORT[r.key] + ' · 岛 ' + day;
    document.getElementById('kdTitle').textContent = is.zone || is.title;   /* 弹窗大标题 = 地图岛名，保持统一 */
    document.getElementById('kdPromise').textContent = is.output ? ('今日产出 · ' + is.output) : (r.promise || '');
    document.getElementById('kdClicked').style.display = 'none';
    const nc = nextCode(r, done), todayStr = toInput(startOfDay(new Date()));
    let blocked = false;
    /* 第一岛（Day1）开头：出航前检查 = 出海第一件事，点击带当前路线 key 进自检页 */
    const setupItem = day === 1 ? `<li class="kd-flow-item is-course current clickable" style="background:linear-gradient(180deg,rgba(31,111,106,.08),var(--surface));border-color:rgba(31,111,106,.3)" onclick="location.href='preflight.html?track=${r.key}'" title="出航前 · 环境自检"><span class="kd-fi-tag" style="background:rgba(31,111,106,.14);color:#1f6f6a"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="4" r="2"/><path d="M10 6v11M4 10H2.6a7.4 7.4 0 0 0 14.8 0H16M7 9.5h6"/></svg>出航前</span><span class="kd-fi-title" style="color:var(--deep-blue);font-weight:600">出航前检查 · 看看装备齐不齐</span><span class="kd-fi-dur">约 10min</span>${ARROW}</li>` : '';
    document.getElementById('kdFlow').innerHTML = setupItem + is.flow.map(f => {
      if (f.type === 'course') {
        const d = done.has(f.code), isCur = f.code === nc, st = d ? 'done' : (isCur ? 'current' : 'locked'), mark = d ? '✓' : (isCur ? '▸' : '');
        if (!d) blocked = true;
        return `<li class="kd-flow-item is-course ${st} clickable" data-code="${f.code}" onclick="toggleRouteCourse('${f.code}')"><span class="kd-fi-tag">${I_COURSE}图文</span><span class="kd-fi-mark">${mark}</span><span class="kd-fi-title">${escapeHtml(f.t)}</span><span class="kd-fi-dur">${f.mins}min</span>${ARROW}</li>`;
      }
      const reached = !blocked;
      if (f.type === 'live') {
        if (!reached) return `<li class="kd-flow-item is-live locked" onclick="showToast('学到这里就能看视频了')"><span class="kd-fi-tag">${I_LIVE}视频</span><span class="kd-fi-title">${escapeHtml(f.title)}</span><span class="kd-fi-state">未学到</span></li>`;
        const past = f.date < todayStr, p = f.date.split('-');
        const dt = past ? '看回放 ▶' : ((+p[1]) + '/' + (+p[2]) + ' ' + f.time);
        return `<li class="kd-flow-item is-live clickable" onclick="gotoLive()"><span class="kd-fi-tag">${I_LIVE}视频</span><span class="kd-fi-title">${escapeHtml(f.title)}</span><span class="kd-fi-state">${dt}</span>${ARROW}</li>`;
      }
      /* task */
      const subm = getRouteSubmission(r.key, day);
      const lockCls = reached ? '' : ' locked';
      const btn = subm
        ? `<button class="kd-fi-submit submitted" onclick="openRouteSubmit('${r.key}',${day})">已提交 ✓</button>`
        : (reached ? `<button class="kd-fi-submit" onclick="openRouteSubmit('${r.key}',${day})">提交</button>` : `<button class="kd-fi-submit locked" onclick="showToast('学到这里就能交作业了')">提交</button>`);
      return `<li class="kd-flow-item is-task${lockCls}"><span class="kd-fi-tag">${I_TASK}作业</span><div class="kd-fi-task-body"><div class="kd-fi-task-title">${escapeHtml(subm ? subm.title : f.title)}</div><div class="kd-fi-task-sub">可选 · 不计入解锁${subm ? ' · 已提交，待评审' : ''}</div></div>${btn}</li>`;
    }).join('');
  }

  /* 原型：点路线图文 = 切换已学，刷新地图 + 抽屉 */
  window.toggleRouteCourse = function (code) {
    const d = routeDone(); d.has(code) ? d.delete(code) : d.add(code);
    setRouteDone(d);
    render();
    if (document.getElementById('kmCallout').classList.contains('show')) fillRouteCallout(getRoute(), _openDay);
  };

  /* ---------- 路线作业：复用提交 modal，按 route+day 单独存 ---------- */
  function getRouteSubmission(key, day) { try { return (JSON.parse(localStorage.getItem('ds_submissions') || '[]')).find(s => s.routeKey === key && s.routeDay === day) || null; } catch (e) { return null; } }
  let _rsub = null;
  window.openRouteSubmit = function (key, day) {
    const r = ROUTES[key]; if (!r) return; const is = r.islands[day - 1]; const task = is && is.flow.find(f => f.type === 'task'); if (!task) return;
    _rsub = { key, day };
    document.getElementById('submitModalTitle').textContent = SHORT[key] + ' · 岛 ' + day + ' 作业';
    document.getElementById('submitModalSubtitle').textContent = task.title;
    document.getElementById('submitForm').reset();
    const ex = getRouteSubmission(key, day);
    if (ex) { document.getElementById('sfTitle').value = ex.title || ''; document.getElementById('sfDesc').value = ex.desc || ''; document.getElementById('sfImage').value = ex.image || ''; document.getElementById('sfUrl').value = ex.url || ''; if (window.setSubmitVisibility) setSubmitVisibility(ex.public ? 'public' : 'self'); }
    else { if (window.setSubmitVisibility) setSubmitVisibility('self'); document.getElementById('sfTitle').value = task.title; }
    document.getElementById('submitModal').classList.add('show');
  };

  /* ---------- 包住已有函数（零侵入：有路线走路线层，否则回落原逻辑）---------- */
  const _render = window.render;
  window.render = function () {
    const r = getRoute();
    if (r) { const done = routeDone(); const _hh = document.getElementById('homeHero'); if (_hh) _hh.style.display = ''; renderRouteMap(r, done); renderRouteHero(r, done); updateRouteHead(r); return; }
    const wrap = document.getElementById('kmWrap'); if (wrap) wrap.classList.remove('route-mode');
    const host = document.getElementById('routeIslands'); if (host) host.innerHTML = '';  /* 退出 route 态：清掉 route 岛，避免与写死岛重叠 + bindInteractions 误绑崩溃 */
    if (genBtn) { genBtn.innerHTML = GEN_LABEL; genBtn.classList.remove('reselect'); }
    return _render.apply(this, arguments);
  };

  const _fill = window._fillCalloutContent;
  window._fillCalloutContent = function (stageNum, clickedComp) {
    const r = getRoute();
    if (r) { fillRouteCallout(r, stageNum); return; }
    return _fill.apply(this, arguments);
  };

  const _submit = window.submitAssignment;
  window.submitAssignment = function () {
    if (!_rsub) return _submit.apply(this, arguments);
    const { key, day } = _rsub;
    const visEl = document.querySelector('input[name="sfVis"]:checked');
    const s = { id: 's-' + Date.now(), routeKey: key, routeDay: day, routeLabel: SHORT[key] + ' · 岛 ' + day, stage: null,
      title: document.getElementById('sfTitle').value.trim(), desc: document.getElementById('sfDesc').value.trim(),
      image: document.getElementById('sfImage').value.trim(), url: document.getElementById('sfUrl').value.trim(),
      public: visEl ? visEl.value === 'public' : false, submittedAt: toInput(startOfDay(new Date())) };
    let arr; try { arr = JSON.parse(localStorage.getItem('ds_submissions') || '[]'); } catch (e) { arr = []; }
    const idx = arr.findIndex(x => x.routeKey === key && x.routeDay === day);
    if (idx >= 0) arr[idx] = s; else arr.push(s);
    localStorage.setItem('ds_submissions', JSON.stringify(arr));
    _rsub = null;
    if (window.closeSubmitModal) closeSubmitModal();
    if (window.openSubmitDone) openSubmitDone(s, null);
    render();
    if (document.getElementById('kmCallout').classList.contains('show')) fillRouteCallout(getRoute(), _openDay);
  };

  const _closeSub = window.closeSubmitModal;
  window.closeSubmitModal = function () { _rsub = null; return _closeSub ? _closeSub.apply(this, arguments) : undefined; };

  /* ---------- 路线态：标题副文案 + 今日该学卡 ---------- */
  function updateRouteHead(r) {
    if (genBtn) { genBtn.innerHTML = GEN_LABEL; genBtn.classList.remove('reselect'); }  /* 触发器恒为「生成你的专属航线」，当前路线由下拉 ✓ 体现 */
  }
  function renderRouteHero(r, done) {
    const codes = routeCourseCodes(r), d = codes.filter(c => done.has(c)).length, total = r.courseCount || codes.length, nc = nextCode(r, done);
    const btn = document.getElementById('hhBtn');
    if (!nc) {
      document.getElementById('hhEyebrow').textContent = '🎓 走完这条路线';
      document.getElementById('hhTitle').textContent = '恭喜！「' + SHORT[r.key] + '」路线全部走完 🎉';
      btn.textContent = '重选方向 →'; btn.href = 'javascript:void(0)'; btn.onclick = e => { e.preventDefault(); openRouteModal(); };
      return;
    }
    let dIdx = 1, nTitle = '';
    for (let i = 0; i < r.islands.length; i++) { const f = r.islands[i].flow.find(x => x.type === 'course' && x.code === nc); if (f) { dIdx = i + 1; nTitle = f.t; break; } }
    document.getElementById('hhEyebrow').textContent = '继续学习';
    document.getElementById('hhTitle').textContent = nTitle;
    btn.textContent = '继续学习 →'; btn.href = 'javascript:void(0)';
    btn.onclick = e => { e.preventDefault(); const el = document.querySelector('#routeIslands .route-isle.cur'); if (el) el.click(); };
  }

  /* ---------- 暴露给注入按钮 + 应用当前状态 ---------- */
  window.openRouteModal = openRouteModal;
  window.closeRouteModal = closeRouteModal;
  /* 深链 ?route=key：首屏 render 前先把 ds_route 落地，避免首屏先按默认全量图渲染（白下载默认岛/船）再被 route-art-apply 切回路线 */
  try { var _rq = location.search.match(/[?&]route=([a-z]+)/); if (_rq && ROUTES[_rq[1]]) localStorage.setItem('ds_route', _rq[1]); } catch (e) {}
  try { render(); } catch (e) { console.warn('[routes-ui] 初次渲染失败', e); }
  /* 深链：calendar.html#route 直接打开问卷（便于演示 / 分享）*/
  if (location.hash === '#route') { try { openRouteModal(); } catch (e) {} }
})();
