/* ============================================================
   定制学习路线 · UI 层（routes-ui.js）— 运行时挂载，零侵入
   ------------------------------------------------------------
   它做什么：
   1) 注入「找到适合你的航线」按钮（船舵图标）+ 引导问卷弹窗（4 步：基础→诉求→产品分流→时间→结果页，顺带存 ds_experience(中文)/ds_motive/ds_daily_minutes）+ 全部方向下拉 + 样式；
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
  const GEN_LABEL = HELM + '<span>切换航线</span>' + '<svg class="rg-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>';

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
.km-wrap.route-mode>.island,.km-wrap.route-mode>.km-route,.km-wrap.route-mode>.km-dot{display:none}
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
.route-dd .dd-item.custom .di-ic{color:#0c7a70;background:rgba(13,148,136,.12)}
.rec-dd-spark{width:17px;height:17px;color:#0c7a70}
/* 刘小排定制 · 推荐清单卡（替代画岛，浮在海图中央）*/
.rec-list{position:absolute;left:50%;top:18px;transform:translateX(-50%);width:min(640px,92%);max-height:calc(100% - 34px);overflow:auto;background:rgba(255,255,255,.97);border:1px solid var(--border);border-radius:16px;box-shadow:0 18px 44px -20px rgba(30,58,82,.42);padding:17px 18px 13px;z-index:6;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
.rec-head{display:flex;align-items:center;gap:11px;padding-bottom:12px;margin-bottom:4px;border-bottom:1px solid var(--border-soft)}
.rec-av{width:38px;height:38px;border-radius:50%;flex:none;background:#fff center/cover no-repeat;background-image:url('assets/liuxiaopai-avatar.png');box-shadow:0 0 0 1.5px rgba(13,148,136,.4)}
.rec-t{font-size:16px;font-weight:700;color:var(--deep-blue);font-family:var(--font-display,serif)}
.rec-sub{font-size:12px;color:#5c7a8a;margin-top:2px}
.rec-items{list-style:none;margin:2px 0 0;padding:0}
.rec-item{display:flex;align-items:flex-start;gap:10px;padding:11px 2px;border-bottom:1px solid var(--border-soft)}
.rec-item:last-child{border-bottom:none}
.rec-mark{flex:none;width:22px;height:22px;margin-top:1px;border-radius:50%;border:1.6px solid #cdd9da;background:#fff;color:#fff;font-size:12.5px;line-height:1;cursor:pointer;display:grid;place-items:center;transition:all .15s;padding:0}
.rec-item.done .rec-mark{background:var(--teal);border-color:var(--teal)}
.rec-item.cur .rec-mark{border-color:var(--teal)}
.rec-main{flex:1;min-width:0;display:flex;align-items:flex-start;gap:10px;text-decoration:none;color:inherit}
.rec-code{flex:none;font-family:var(--font-mono,monospace);font-size:11.5px;font-weight:600;color:var(--teal);background:var(--teal-bg);padding:2px 7px;border-radius:6px;margin-top:1px}
.rec-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.rec-ttl{font-size:14px;font-weight:600;color:var(--deep-blue);line-height:1.4}
.rec-item.done .rec-ttl{color:#8aa0a6;text-decoration:line-through}
.rec-why{font-size:12px;color:#5c7a8a;line-height:1.5}
.rec-arr{flex:none;color:var(--teal);font-size:14px;opacity:0;transition:all .15s;margin-top:1px}
.rec-main:hover .rec-arr{opacity:1;transform:translateX(2px)}
.rec-main:hover .rec-ttl{color:var(--teal)}
.rec-foot{margin-top:11px;padding-top:10px;border-top:1px solid var(--border-soft);font-size:12px;color:#94a3b8}
.rec-foot a{color:var(--teal);font-weight:600;text-decoration:none}
/* ===== 刘小排定制 · 点状航线（桌面：复用海图背景 + 蜿蜒航线，章节串成一个个站点）===== */
.rec-path-svg{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:visible}
.rec-path-svg path{fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
.rec-path-svg .rp-rest{stroke:#bf842a;stroke-width:2;stroke-dasharray:5 6;opacity:.82}
.rec-path-svg .rp-done{stroke:#15b3a1;stroke-width:2.6;filter:drop-shadow(0 0 2px rgba(40,200,180,.6))}
/* 站点卡（全展开：编号/标题/为什么/去学/打勾常驻；等高·顶端对齐成一排，航线串过卡顶圆点）*/
.rec-card{position:absolute;transform:translateX(-50%);width:clamp(150px,13.5vw,182px);min-height:162px;display:flex;flex-direction:column;z-index:5;background:#fff;border:1px solid #e5ebe8;border-radius:16px;box-shadow:0 14px 32px -20px rgba(20,50,60,.5),0 2px 5px -3px rgba(20,50,60,.1);padding:15px 15px 24px;animation:recCardIn .5s cubic-bezier(.2,.8,.2,1) both}
.rec-card:hover{box-shadow:0 24px 46px -22px rgba(20,50,60,.55),0 3px 8px -3px rgba(20,50,60,.14);z-index:7}
.rec-card:hover .rc-ttl{color:var(--teal)}
@keyframes recCardIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.rec-card .rc-dot{position:absolute;bottom:0;left:50%;transform:translate(-50%,50%);width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-family:var(--font-mono,monospace);font-size:13px;font-weight:700;background:#fff;border:2px solid #cdb277;color:#9a7a3a;box-shadow:0 4px 10px -4px rgba(120,90,30,.5)}
.rec-card.done{background:linear-gradient(180deg,#f3faf8,#fff)}
.rec-card.done .rc-dot{background:var(--teal);border-color:var(--teal);color:#fff}
.rec-card.cur{border-color:rgba(13,148,136,.42);box-shadow:0 20px 42px -18px rgba(13,148,136,.5),0 2px 6px -3px rgba(13,148,136,.18)}
.rec-card.cur .rc-dot{width:36px;height:36px;font-size:15px;border-color:var(--teal);color:var(--teal-deep,#0c7268);box-shadow:0 0 0 4px rgba(13,148,136,.16),0 6px 16px -6px rgba(13,148,136,.5);animation:recPulse 1.9s ease-in-out infinite}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 4px rgba(13,148,136,.16),0 6px 16px -6px rgba(13,148,136,.5)}50%{box-shadow:0 0 0 7px rgba(13,148,136,.07),0 6px 16px -6px rgba(13,148,136,.5)}}
.rec-card .rc-code{display:inline-block;font-family:var(--font-mono,monospace);font-size:10px;font-weight:600;letter-spacing:.04em;color:var(--teal);background:var(--teal-bg);padding:1px 7px;border-radius:5px;margin-bottom:8px}
.rec-card .rc-body{display:block;text-decoration:none;color:inherit}
.rec-card .rc-ttl{font-size:13.5px;font-weight:700;color:var(--deep-blue);line-height:1.36;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:calc(1.36em * 2)}
.rec-card.done .rc-ttl{color:#93a6aa}
.rec-card .rc-why{font-size:11.5px;color:#647c86;line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:calc(1.55em * 2)}
.rec-card .rc-foot{margin-top:auto;padding-top:11px;display:flex;align-items:center;justify-content:space-between;gap:6px;border-top:1px solid #eef2f0}
.rec-card .rc-go{font-size:11.5px;font-weight:600;color:var(--teal);text-decoration:none;white-space:nowrap}
.rec-card .rc-go:hover{color:var(--teal-deep,#0c7268)}
.rec-card .rc-mark{flex:none;width:23px;height:23px;border-radius:50%;border:1.5px solid #cdd9da;background:#fff;color:#fff;font-size:11.5px;cursor:pointer;display:grid;place-items:center;padding:0;transition:all .14s}
.rec-card .rc-mark:hover{border-color:var(--teal);transform:scale(1.08)}
.rec-card.done .rc-mark{background:var(--teal);border-color:var(--teal)}
.rec-banner{position:absolute;left:16px;top:14px;z-index:6;display:flex;align-items:center;gap:10px;max-width:60%;padding:9px 14px 9px 10px;background:rgba(255,255,255,.95);border:1px solid var(--border);border-radius:13px;box-shadow:0 10px 26px -14px rgba(30,58,82,.4);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
.rec-banner .rb-av{width:34px;height:34px;border-radius:50%;flex:none;background:#fff center/cover no-repeat;background-image:url('assets/liuxiaopai-avatar.png');box-shadow:0 0 0 1.5px rgba(13,148,136,.4)}
.rec-banner .rb-t{font-size:13.5px;font-weight:700;color:var(--deep-blue);font-family:var(--font-display,serif);line-height:1.2}
.rec-banner .rb-sub{font-size:11.5px;color:#5c7a8a;margin-top:2px}
.rec-banner .rb-sub a{color:var(--teal);font-weight:600;text-decoration:none}
/* ===== 切换确认框 ===== */
.route-cfm-mask{position:fixed;inset:0;z-index:70;display:none;place-items:center;background:rgba(18,38,44,.46);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:20px}
.route-cfm-mask.show{display:grid}
.route-cfm{position:relative;width:min(380px,92vw);padding:26px 24px 18px;border-radius:20px;color:#33414d;text-align:left;background:linear-gradient(180deg,#ffffff,#f6fbfb);border:1px solid #e6eef0;box-shadow:0 30px 70px -26px rgba(30,58,82,.42),0 8px 22px -16px rgba(13,148,136,.14);animation:cfmIn .22s cubic-bezier(.22,1,.36,1) both}
@keyframes cfmIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
.route-cfm .cf-ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:#c08a2e;background:rgba(200,152,84,.16);margin-bottom:13px}
.route-cfm .cf-ic svg{width:22px;height:22px}
.route-cfm .cf-t{font-family:var(--font-display,serif);font-size:19px;font-weight:700;color:var(--deep-blue);margin:0 0 7px}
.route-cfm .cf-d{font-size:13px;color:#54636b;line-height:1.65;margin:0 0 20px}
.route-cfm .cf-d b{color:var(--teal-deep);font-weight:600}
.route-cfm .cf-d .cf-keep{color:#8aa0a8}
.route-cfm .cf-act{display:flex;justify-content:flex-end;gap:10px}
.route-cfm .cf-btn{font-family:var(--font-sans);font-size:13px;font-weight:600;cursor:pointer;padding:9px 18px;border-radius:999px;border:1px solid transparent;transition:all .14s}
.route-cfm .cf-cancel{color:#64798a;background:none;border-color:#d6e0e2}
.route-cfm .cf-cancel:hover{background:rgba(30,58,82,.05);border-color:#c2d0d2}
.route-cfm .cf-ok{color:#fff;background:linear-gradient(180deg,#15a89a,#0c7268);border-color:transparent;box-shadow:0 8px 18px -9px rgba(13,148,136,.6)}
.route-cfm .cf-ok:hover{background:linear-gradient(180deg,#19b3a4,#0e7d72);box-shadow:0 11px 22px -9px rgba(13,148,136,.7)}
/* ===== 找航线 · 引导问卷弹窗（C 杂志编排 · 双栏）===== */
.route-quiz-mask{position:fixed;inset:0;z-index:70;display:none;place-items:center;background:rgba(18,38,44,.46);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:20px}
.route-quiz-mask.show{display:grid}
.route-quiz{position:relative;width:min(540px,94vw);max-height:88vh;overflow:hidden;display:grid;grid-template-columns:152px 1fr;border-radius:22px;color:#33414d;background:#fff;border:1px solid #e6eef0;box-shadow:0 44px 90px -38px rgba(30,58,82,.42),0 10px 28px -18px rgba(13,148,136,.18);animation:cfmIn .26s cubic-bezier(.22,1,.36,1) both}
.rq-close{position:absolute;top:16px;right:16px;width:30px;height:30px;border:none;border-radius:50%;background:rgba(30,58,82,.05);color:#9aabb2;font-size:14px;cursor:pointer;display:grid;place-items:center;transition:all .14s;z-index:4}
.rq-close:hover{background:rgba(13,148,136,.12);color:var(--teal)}
/* 左栏 · 序号 + 步骤清单 + 罗盘 */
.rq-rail{padding:28px 22px;background:linear-gradient(170deg,#f2f9f8,#e9f4f2);border-right:1px solid #e6eef0;position:relative}
.rq-idx{font-family:var(--font-display,serif);font-weight:700;color:var(--deep-blue);line-height:1;font-size:50px}
.rq-idx small{font-size:19px;color:#9fb3b2;font-weight:600}
.rq-idx .rq-fin{display:inline-grid;place-items:center;width:54px;height:54px;border-radius:50%;background:linear-gradient(155deg,#15a89a,#0c7268);color:#fff;font-size:27px;box-shadow:0 10px 22px -8px rgba(13,148,136,.6)}
.rq-railline{width:26px;height:2px;background:#c89854;border-radius:2px;margin:15px 0 18px}
.rq-steps{display:flex;flex-direction:column;gap:13px}
.rq-s{display:flex;align-items:center;gap:9px;font-size:12.5px;color:#9fb0af;font-weight:500;transition:color .2s}
.rq-s .d{width:8px;height:8px;border-radius:50%;background:#cfdedc;flex:none;transition:all .2s}
.rq-s.done{color:#62807c}
.rq-s.done .d{background:var(--teal-deep,#1f6f6a)}
.rq-s.on{color:var(--deep-blue);font-weight:600}
.rq-s.on .d{background:var(--teal);box-shadow:0 0 0 3px rgba(13,148,136,.16)}
.rq-compass{position:absolute;bottom:20px;left:22px;color:#bcd0ce}
/* 右栏 · 问答 */
.rq-main{padding:30px 30px 22px;position:relative;min-width:0;max-height:88vh;overflow-y:auto}
.rq-eyebrow{font-family:var(--font-mono,monospace);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#a8b8bb;margin-bottom:11px}
.rq-title{font-family:var(--font-display,serif);font-size:23px;font-weight:700;line-height:1.32;color:var(--deep-blue);letter-spacing:-.01em;margin:0 0 18px}
.rq-opts{display:flex;flex-direction:column}
.rq-opt{display:flex;align-items:center;gap:13px;width:100%;text-align:left;cursor:pointer;padding:14px 4px;background:none;border:none;border-bottom:1px solid #eef3f4;font-family:inherit;transition:padding .16s;animation:rqOptIn .34s cubic-bezier(.16,1,.3,1) both}
.rq-opt:last-child{border-bottom:none}
.rq-opt:nth-child(1){animation-delay:.04s}
.rq-opt:nth-child(2){animation-delay:.1s}
.rq-opt:nth-child(3){animation-delay:.16s}
.rq-opt:nth-child(4){animation-delay:.22s}
.rq-opt:nth-child(5){animation-delay:.28s}
.rq-opt:nth-child(6){animation-delay:.34s}
.rq-opt:nth-child(7){animation-delay:.4s}
@keyframes rqOptIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.rq-opt:hover{padding-left:11px}
.rq-mk{flex:none;display:grid;place-items:center;transition:all .16s}
.rq-num{font-family:var(--font-display,serif);font-size:15px;font-weight:600;color:#bcccca;width:18px}
.rq-opt:hover .rq-num{color:var(--teal)}
.rq-ic{width:32px;height:32px;border-radius:9px;color:#0c7a70;background:rgba(13,148,136,.1)}
.rq-ic svg{width:19px;height:19px}
.rq-opt:hover .rq-ic{color:#fff;background:linear-gradient(155deg,#15a89a,#0c7268)}
.rq-av{width:32px;height:32px;border-radius:50%;background:#fff center/cover no-repeat;box-shadow:0 0 0 1.5px rgba(13,148,136,.4)}
.rq-opt:hover .rq-av{box-shadow:0 0 0 2px var(--teal)}
.rq-otxt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.rq-ot{font-size:14.5px;font-weight:600;color:var(--deep-blue);line-height:1.35}
.rq-od{font-size:12px;color:#7c939c;line-height:1.4}
.rq-arr{width:15px;height:15px;flex:none;color:var(--teal);opacity:0;transition:all .16s}
.rq-opt:hover .rq-arr{opacity:1;transform:translateX(2px)}
.rq-foot{display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid #eef3f4}
.rq-back,.rq-all{font-family:var(--font-sans);font-size:12.5px;font-weight:600;cursor:pointer;background:none;border:none;padding:6px 4px;border-radius:7px;transition:color .14s}
.rq-back{color:#8aa0a8}
.rq-back:hover{color:var(--deep-blue)}
.rq-all{color:var(--teal-deep,#1f6f6a);margin-left:auto}
.rq-all:hover{color:var(--teal)}
.rq-result{padding-top:2px}
.rr-cap{font-family:var(--font-mono,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#9aabb2;margin-bottom:12px}
@media(max-width:560px){.route-quiz{grid-template-columns:1fr}.rq-rail{display:none}.rq-main{max-height:88vh}}
.rr-route{display:flex;align-items:center;gap:14px;padding:16px;border-radius:15px;background:linear-gradient(180deg,#f5fbfa,#ecf6f4);border:1px solid rgba(13,148,136,.2);margin-bottom:13px}
.rr-ic{width:46px;height:46px;border-radius:13px;flex:none;display:grid;place-items:center;color:#fff;background:linear-gradient(155deg,#15a89a,#0c7268);box-shadow:0 8px 18px -8px rgba(13,148,136,.6)}
.rr-ic svg{width:26px;height:26px}
.rr-rtxt{flex:1;min-width:0}
.rr-name{font-family:var(--font-display,serif);font-size:19px;font-weight:700;color:var(--deep-blue);line-height:1.3}
.rr-promise{font-size:12.5px;color:#5e6b66;line-height:1.5;margin-top:3px}
.rr-pace{font-size:13px;color:#5c7a8a;text-align:center;padding:9px 12px;border-radius:10px;background:rgba(13,148,136,.08);margin-bottom:11px}
.rr-first{font-size:12.5px;color:#54636b;line-height:1.6;padding:0 2px}
.rr-first-k{font-weight:600;color:var(--teal-deep,#0c7268);margin-right:6px}
.rr-go{width:100%;margin-top:17px;padding:14px;border:none;border-radius:12px;font-family:var(--font-sans);font-size:15px;font-weight:600;color:#fff;cursor:pointer;background:linear-gradient(180deg,#15a89a,#0c7268);box-shadow:0 12px 24px -10px rgba(13,148,136,.6);transition:all .15s}
.rr-go:hover{background:linear-gradient(180deg,#19b3a4,#0e7d72);transform:translateY(-1px);box-shadow:0 15px 30px -10px rgba(13,148,136,.7)}
.km-route-eb{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.02em;color:#b88a3a;margin-bottom:-9px;display:inline-flex;align-items:center;gap:5px}`;
  const st = document.createElement('style'); st.id = 'routeUiStyle'; st.textContent = css; document.head.appendChild(st);

  /* ---------- 航线总览数据（11 条专属 · 3 类货架 + Stage 0；全量主线另算，合计 12）---------- */
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
  /* ===== 刘小排定制清单 · 把问诊结果当一条「路线」注册（渲染成清单，不画岛）=====
     问诊页写入 ds_route_custom = { name, promise, items:[{code,t,why}] }，并把 ds_route 置为 'diagnosis'。
     这里包成 route 形状，复用进度 / 切换 / 标题 等现成管道；渲染时由 render() 分支成清单卡。 */
  function _esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  const SPARK = '<svg class="rec-dd-spark" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/></svg>';
  try {
    const _cr = JSON.parse(localStorage.getItem('ds_route_custom') || 'null');
    if (_cr && _cr.items && _cr.items.length) {
      ROUTES['diagnosis'] = {
        key:'diagnosis', name:_cr.name || '刘小排定制', promise:_cr.promise || '按你的想法挑的重点章节',
        courseCount:_cr.items.length, custom:true, items:_cr.items,
        islands:[{ zone:'刘小排为你挑的重点', title:'刘小排为你挑的重点', output:'',
          flow:_cr.items.map(function (it) { return { type:'course', code:it.code, t:it.t, mins:0 }; }) }]
      };
      SHORT['diagnosis'] = '刘小排定制';
    }
  } catch (e) {}

  /* ---------- 引导问卷数据：4 步（基础→诉求→产品分流→时间）→ 结果页 ---------- */
  const QUIZ = {
    q1: { step:1, title:'你现在大概是什么基础？', key:'level',
      opts:[
        { t:'零基础，还没正式写过代码', v:'零基础' },
        { t:'用过 ChatGPT / 扣子，但还没真正做出过东西', v:'有基础' },
        { t:'自己做出过小作品，想更系统地进阶', v:'有产品经验' },
      ] },
    q2: { step:2, title:'你来这里，最想解决的是什么？', key:'goal',
      opts:[
        { t:'有想法，但不知道从哪里开始', v:'stuck' },
        { t:'手上有业务或项目，想尽快把它做出来', v:'biz' },
        { t:'想跟上 AI 的节奏，系统补齐自己的能力', v:'keepup' },
        { t:'先做出一个能用的小东西练手', v:'try' },
      ] },
    q3: { step:3, title:'先帮你做出第一个能用的产品。你最想做哪一种？', key:'route',
      opts:[
        { icon:'web',     t:'一个网页 / 网站工具', note:'最稳妥，适合起步', route:'aiwebsite' },
        { icon:'mp',      t:'一个微信小程序',                          route:'miniprogram' },
        { icon:'game',    t:'一个小游戏',          note:'挑战性较高',     route:'minigame' },
        { icon:'app',     t:'一个手机 App',        note:'需要一点 React 基础', route:'app' },
        { icon:'robot',   t:'让 AI 自动替我处理工作',                   route:'aiemployee' },
        { icon:'compass', t:'还没想好 —— 先带我做个最简单的', note:'先上线一个网页，拿到第一个成果',               route:'aiwebsite' },
        { avatar:'assets/liuxiaopai-avatar.png', diag:true, t:'我的想法比较特别，这些都对不上', note:'让刘小排陪你一对一问诊，挑出该补的课' },
      ] },
    q4: { step:4, title:'你每天大概能投入多少时间？', key:'minutes',
      opts:[
        { t:'20 分钟左右', v:20 },
        { t:'1 小时左右', v:60 },
        { t:'2 小时以上', v:120 },
        { t:'不太固定', v:0 },
      ] },
  };
  const Q_ORDER = ['q1','q2','q3','q4'];
  const TOTAL_STEPS = 4;
  const RAIL_STEPS = [
    { label: '基础', eb: 'BACKGROUND' },
    { label: '目标', eb: 'OBJECTIVE' },
    { label: '方向', eb: 'DIRECTION' },
    { label: '时间', eb: 'CADENCE' },
  ];
  /* ---------- 航线下拉菜单（替代整页弹窗）---------- */
  const DD_FULL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>';
  const DD_CHK = '<svg class="di-chk" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 4"/></svg>';
  const ddMenu = document.createElement('div'); ddMenu.id = 'routeDD'; ddMenu.className = 'route-dd';
  ddMenu.innerHTML = '<div class="dd-cap">默认</div>'
    + `<button class="dd-item full" data-key="full"><span class="di-ic">${DD_FULL}</span><span class="di-t">全量航海图 · 全部课程</span>${DD_CHK}</button>`
    + '<div class="dd-sep"></div><div class="dd-cap">为你定制</div>'
    + (ROUTES['diagnosis']
        ? `<button class="dd-item custom" data-key="diagnosis"><span class="di-ic">${SPARK}</span><span class="di-t">${_esc(ROUTES['diagnosis'].name)}</span>${DD_CHK}</button>`
        : `<button class="dd-item dd-diag" data-key="__diag__"><span class="di-ic">${SPARK}</span><span class="di-t">拿不准？让刘小排帮你挑一条 →</span></button>`)
    + `<div class="dd-sep"></div><div class="dd-cap">${RMETA.length} 条航线</div>`
    + RMETA.map(o => `<button class="dd-item" data-key="${o.key}"><span class="di-ic">${RICN[o.icon]}</span><span class="di-t">${o.t}</span>${DD_CHK}</button>`).join('');
  document.body.appendChild(ddMenu);
  /* ---------- 切换确认框（覆盖学习记录前确认）---------- */
  const cfm = document.createElement('div'); cfm.id = 'routeCfm'; cfm.className = 'route-cfm-mask';
  cfm.innerHTML = `<div class="route-cfm"><div class="cf-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 16.5v.5"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg></div><h3 class="cf-t">换一条航线？</h3><p class="cf-d">切到「<b id="cfName"></b>」会把<b>当前航线的学习进度清空、从头来过</b>；<span class="cf-keep">但你已提交的作业会保留。</span></p><div class="cf-act"><button class="cf-btn cf-cancel" id="cfCancel">取消</button><button class="cf-btn cf-ok" id="cfOk">确定切换</button></div></div>`;
  document.body.appendChild(cfm);

  /* ---------- 引导问卷弹窗（点「找到适合你的航线」弹出）：4 步问答 + 结果页 ---------- */
  const quiz = document.createElement('div'); quiz.id = 'routeQuiz'; quiz.className = 'route-quiz-mask';
  quiz.innerHTML = '<div class="route-quiz" role="dialog" aria-modal="true">'
    + '<button class="rq-close" id="rqClose" aria-label="关闭">✕</button>'
    + '<aside class="rq-rail">'
    +   '<div class="rq-idx" id="rqIdx">01<small>／04</small></div>'
    +   '<div class="rq-railline"></div>'
    +   '<div class="rq-steps" id="rqSteps"></div>'
    +   '<svg class="rq-compass" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z" fill="currentColor" stroke="none"/></svg>'
    + '</aside>'
    + '<div class="rq-main">'
    +   '<div id="rqQuestion">'
    +     '<div class="rq-eyebrow" id="rqEyebrow"></div>'
    +     '<h3 class="rq-title" id="rqTitle"></h3>'
    +     '<div class="rq-opts" id="rqOpts"></div>'
    +     '<div class="rq-foot"><button class="rq-back" id="rqBack" style="display:none">← 上一步</button><button class="rq-all" id="rqAll">直接浏览全部方向 →</button></div>'
    +   '</div>'
    +   '<div class="rq-result" id="rqResult" style="display:none"></div>'
    + '</div>'
    + '</div>';
  document.body.appendChild(quiz);
  const RQ_ARR = '<svg class="rq-arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>';
  let _ans = {};
  function dailyLabel(m) { return m === 20 ? '20 分钟' : m === 60 ? '1 小时' : m === 120 ? '2 小时以上' : '不固定'; }
  function setRail(activeIdx) {
    var idxEl = document.getElementById('rqIdx');
    var stepsEl = document.getElementById('rqSteps');
    if (idxEl) idxEl.innerHTML = activeIdx < 0
      ? '<span class="rq-fin">✓</span>'
      : ('0' + (activeIdx + 1)).slice(-2) + '<small>／0' + TOTAL_STEPS + '</small>';
    if (stepsEl) stepsEl.innerHTML = RAIL_STEPS.map(function (rs, i) {
      var cls = activeIdx < 0 ? 'done' : (i === activeIdx ? 'on' : (i < activeIdx ? 'done' : ''));
      return '<div class="rq-s ' + cls + '"><span class="d"></span>' + rs.label + '</div>';
    }).join('');
  }
  function renderQuiz(stepKey) {
    const s = QUIZ[stepKey]; if (!s) return;
    document.getElementById('rqResult').style.display = 'none';
    document.getElementById('rqQuestion').style.display = '';
    const idx = Q_ORDER.indexOf(stepKey), back = document.getElementById('rqBack');
    setRail(idx);
    document.getElementById('rqEyebrow').textContent = (RAIL_STEPS[idx] && RAIL_STEPS[idx].eb) || '';
    document.getElementById('rqTitle').textContent = s.title;
    if (idx > 0) { back.style.display = ''; back.onclick = function () { renderQuiz(Q_ORDER[idx - 1]); }; }
    else { back.style.display = 'none'; back.onclick = null; }
    const host = document.getElementById('rqOpts');
    host.innerHTML = s.opts.map(function (o, i) {
      const mk = o.avatar
        ? '<span class="rq-mk rq-av" style="background-image:url(' + o.avatar + ')"></span>'
        : o.icon
        ? '<span class="rq-mk rq-ic">' + (RICN[o.icon] || '') + '</span>'
        : '<span class="rq-mk rq-num">' + (i + 1) + '</span>';
      const note = o.note ? '<span class="rq-od">' + o.note + '</span>' : '';
      return '<button class="rq-opt" data-i="' + i + '">' + mk
        + '<span class="rq-otxt"><span class="rq-ot">' + o.t + '</span>' + note + '</span>' + RQ_ARR + '</button>';
    }).join('');
    host.querySelectorAll('.rq-opt').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        const o = s.opts[+b.dataset.i];
        if (o.diag) { closeQuiz(); location.href = 'diagnosis.html'; return; }   /* 问诊出口：不选路线，直接进刘小排问诊页 */
        _ans[s.key] = (o.route != null) ? o.route : o.v;
        const ni = Q_ORDER.indexOf(stepKey) + 1;
        if (ni < Q_ORDER.length) renderQuiz(Q_ORDER[ni]); else renderResult();
      });
    });
  }
  function renderResult() {
    const key = _ans.route, r = ROUTES[key];
    if (!r) { renderQuiz('q3'); return; }
    const stations = r.islands.length;
    let totalMins = 0; r.islands.forEach(function (is) { is.flow.forEach(function (f) { if (f.type === 'course') totalMins += (f.mins || 0); }); });
    const daily = +_ans.minutes || 0;
    const days = daily > 0 ? Math.max(stations, Math.ceil(totalMins / daily)) : 0;
    const meta = RMETA.find(function (x) { return x.key === key; }), ic = meta ? RICN[meta.icon] : '';
    const first = (r.islands[0] && r.islands[0].output) ? r.islands[0].output : '第一个小成果';
    const pace = days > 0
      ? '共 ' + stations + ' 站 · 预计 ' + days + ' 天走完 · 每天 ' + dailyLabel(daily)
      : '共 ' + stations + ' 站 · 按你自己的节奏推进';
    document.getElementById('rqQuestion').style.display = 'none';
    setRail(-1);
    const box = document.getElementById('rqResult'); box.style.display = '';
    box.innerHTML = '<div class="rr-cap">已为你匹配学习路线</div>'
      + '<div class="rr-route"><span class="rr-ic">' + ic + '</span><div class="rr-rtxt"><div class="rr-name">' + r.name + '</div><div class="rr-promise">' + (r.promise || '') + '</div></div></div>'
      + '<div class="rr-pace">' + pace + '</div>'
      + '<div class="rr-first"><span class="rr-first-k">第一站就能拿到</span>' + first + '</div>'
      + '<button class="rr-go" id="rqGo">出发 →</button>';
    document.getElementById('rqGo').onclick = function (e) {
      e.stopPropagation();
      try {
        if (_ans.level) localStorage.setItem('ds_experience', _ans.level);   /* 用 profile 认得的中文值（零基础/有基础/有产品经验）*/
        if (_ans.goal) localStorage.setItem('ds_motive', _ans.goal);         /* 诉求另存新键，不污染旧 ds_goal（值不兼容）*/
        if (_ans.minutes != null) localStorage.setItem('ds_daily_minutes', String(_ans.minutes));
      } catch (err) {}
      closeQuiz(); pickRoute(key);
    };
  }
  function openQuiz() { closeDD(); _ans = {}; renderQuiz('q1'); quiz.classList.add('show'); }
  function closeQuiz() { quiz.classList.remove('show'); }
  document.getElementById('rqClose').addEventListener('click', closeQuiz);
  document.getElementById('rqAll').addEventListener('click', function (e) { e.stopPropagation(); closeQuiz(); openRouteModal(); });
  quiz.addEventListener('click', function (e) { if (e.target === quiz) closeQuiz(); });

  /* ---------- 副标题已删：运行时兜底移除写死的副标题 + 把「生成」按钮挂到标题块末尾 ---------- */
  const oldSub = document.querySelector('.km-head .km-head-sub'); if (oldSub) oldSub.remove();
  const headL = document.querySelector('.km-head .km-head-l');
  let genBtn = null;
  if (headL) {
    genBtn = document.createElement('button');
    genBtn.id = 'routeGenBtn'; genBtn.className = 'route-gen-btn'; genBtn.innerHTML = GEN_LABEL;
    genBtn.addEventListener('click', e => { e.stopPropagation(); openRouteModal(); });
    headL.appendChild(genBtn);
  }
  /* 「继续学习」卡 = 右下角米白描金长方条（样式见上方注入 CSS）：放进地图层(kmWrap) 绝对定位 */
  const hhCard = document.getElementById('homeHero'), kmw0 = document.getElementById('kmWrap');
  if (hhCard && kmw0) kmw0.appendChild(hhCard);

  /* ---------- 路线态标题：大标题换成路线名 + 上方加「你正在走的航线」小字（默认全量图自动还原）---------- */
  const titleEl = document.querySelector('.km-head .plan-title');
  const STAR = (titleEl && titleEl.querySelector('.title-star')) ? titleEl.querySelector('.title-star').outerHTML : '';
  let routeEb = null;
  if (titleEl) {
    routeEb = document.createElement('div'); routeEb.id = 'kmRouteEb'; routeEb.className = 'km-route-eb'; routeEb.style.display = 'none';
    routeEb.textContent = '⚓ 你正在走的航线';
    titleEl.parentNode.insertBefore(routeEb, titleEl);
  }

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
  ddMenu.querySelectorAll('.dd-item').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); if (b.dataset.key === '__diag__') { closeDD(); location.href = 'diagnosis.html'; return; } pickRoute(b.dataset.key); }));
  document.getElementById('cfCancel').addEventListener('click', closeCfm);
  document.getElementById('cfOk').addEventListener('click', () => { if (_pending != null) applyRoute(_pending); });
  cfm.addEventListener('click', e => { if (e.target === cfm) closeCfm(); });
  document.addEventListener('click', e => { if (ddMenu.classList.contains('show') && !ddMenu.contains(e.target) && !genBtn.contains(e.target) && e.target !== genBtn) closeDD(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDD(); closeCfm(); closeQuiz(); } });
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
      el.addEventListener('click', e => {
        e.stopPropagation(); const day = parseInt(el.dataset.day, 10); _openDay = day;
        if (window.IsleFocus && window.openFocusOverlay && !window.matchMedia('(max-width: 639px)').matches) enterRouteFocus(day, el);   /* 桌面：神奇移动聚焦 */
        else openCallout(day, el, null);   /* 手机端 / 兜底：抽屉 */
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    });
  }

  /* ---------- 刘小排定制：把推荐章节渲染成一张清单卡（替代画岛）---------- */
  function renderRecList(r, done) {
    const wrap = document.getElementById('kmWrap'); wrap.classList.add('route-mode');
    const ship = document.getElementById('kmShip'); if (ship) ship.style.display = 'none';
    let host = document.getElementById('routeIslands');
    if (!host) { host = document.createElement('div'); host.id = 'routeIslands'; wrap.appendChild(host); }
    const items = r.items || [], nc = nextCode(r, done);
    const rows = items.map(function (it) {
      const d = done.has(it.code), isCur = it.code === nc, st = d ? 'done' : (isCur ? 'cur' : '');
      return '<li class="rec-item ' + st + '">'
        + '<button class="rec-mark" data-code="' + _esc(it.code) + '" title="' + (d ? '已学完 · 点击撤销' : '标记已学完') + '" onclick="event.stopPropagation();toggleRouteCourse(this.dataset.code)">' + (d ? '✓' : '') + '</button>'
        + '<a class="rec-main" href="learn.html?code=' + encodeURIComponent(it.code) + '">'
        +   '<span class="rec-code">' + _esc(it.code) + '</span>'
        +   '<span class="rec-tx"><span class="rec-ttl">' + _esc(it.t) + '</span>'
        +   (it.why ? '<span class="rec-why">' + _esc(it.why) + '</span>' : '') + '</span>'
        +   '<span class="rec-arr">→</span>'
        + '</a></li>';
    }).join('');
    const dN = items.filter(function (it) { return done.has(it.code); }).length;
    host.innerHTML = '<div class="rec-list">'
      + '<div class="rec-head"><span class="rec-av" role="img" aria-label="刘小排"></span><div><div class="rec-t">刘小排为你挑的重点</div>'
      +   '<div class="rec-sub">' + _esc(r.promise || '') + ' · 共 ' + items.length + ' 章 · 已看 ' + dN + '</div></div></div>'
      + '<ol class="rec-items">' + rows + '</ol>'
      + '<div class="rec-foot">想换个方向？<a href="diagnosis.html">重新问诊</a> · 或在上方「找到适合你的航线」里切回全量航海图</div>'
      + '</div>';
  }

  /* ---------- 刘小排定制（桌面）：复用海图背景 + 蜿蜒航线，把推荐章节串成「一个个的点」---------- */
  /* 经过给定点的平滑曲线（Catmull-Rom → 三次贝塞尔），与聚焦层 isle-focus 同一套画法 */
  /* 经过给定点的平滑曲线（Catmull-Rom → 三次贝塞尔）：把上行的各站点连成一条顺滑的海路 */
  function smoothRec(P) {
    if (P.length < 2) return P.length ? 'M ' + P[0].x + ' ' + P[0].y : '';
    var d = 'M ' + P[0].x.toFixed(1) + ' ' + P[0].y.toFixed(1);
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6,
          c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
  }
  function renderRecPath(r, done) {
    var wrap = document.getElementById('kmWrap'); wrap.classList.add('route-mode');
    var host = document.getElementById('routeIslands');
    if (!host) { host = document.createElement('div'); host.id = 'routeIslands'; wrap.appendChild(host); }
    var items = r.items || [], N = items.length, nc = nextCode(r, done);
    var reached = -1; for (var k = 0; k < N; k++) { if (items[k].code === nc) { reached = k; break; } }
    if (reached < 0) reached = N - 1;   /* 全部学完 → 船停最后一站 */
    /* 航程左下→右上爬升：水位线左低右高 → 填进右上那片空海、避开左上标题，读成一段上行的海路 */
    var WL = function (i) { return N > 1 ? 82 - i * (28 / (N - 1)) : 66; };            /* 每站水线(% from top)：左 82(低) → 右 54(高) */
    var X = function (i) { return N > 1 ? 11 + i * (78 / (N - 1)) : 50; };             /* 站点横排铺开 */
    var pts = items.map(function (it, i) { return { x: X(i), y: WL(i) }; });           /* 圆点落在各自水线上(卡片底部) */
    var line = [{ x: pts[0].x - 7, y: WL(0) + 3 }].concat(pts);                        /* 航线从第一站左下侧海面起 */
    var restD = smoothRec(line);                                                       /* 全程 · 金色虚线（平滑上行）*/
    var doneD = smoothRec(line.slice(0, reached + 2));                                 /* 已走段 · 青色实线（含起点，故 +2）*/
    var dN = items.filter(function (it) { return done.has(it.code); }).length;
    var cards = items.map(function (it, i) {
      var d = done.has(it.code), st = d ? 'done' : (it.code === nc ? 'cur' : ''), href = 'learn.html?code=' + encodeURIComponent(it.code);
      return '<div class="rec-card ' + st + '" style="left:' + X(i).toFixed(1) + '%;bottom:' + (100 - WL(i)).toFixed(1) + '%;animation-delay:' + (i * 0.07).toFixed(2) + 's">'
        + '<span class="rc-dot">' + (d ? '✓' : (i + 1)) + '</span>'
        + '<a class="rc-body" href="' + href + '"><span class="rc-code">' + _esc(it.code) + '</span>'
        +   '<div class="rc-ttl">' + _esc(it.t) + '</div>'
        +   (it.why ? '<div class="rc-why">' + _esc(it.why) + '</div>' : '') + '</a>'
        + '<div class="rc-foot"><a class="rc-go" href="' + href + '">去学这一章 →</a>'
        +   '<button class="rc-mark" title="' + (d ? '已学完 · 点击撤销' : '标记学完') + '" onclick="toggleRouteCourse(\'' + _esc(it.code) + '\')">' + (d ? '✓' : '') + '</button></div>'
        + '</div>';
    }).join('');
    host.innerHTML =
      '<svg class="rec-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="rp-rest" d="' + restD + '"/><path class="rp-done" d="' + doneD + '"/></svg>'
      + '<div class="rec-banner"><span class="rb-av" role="img" aria-label="刘小排"></span><div><div class="rb-t">刘小排为你挑的重点</div>'
      + '<div class="rb-sub">共 ' + N + ' 章 · 已看 ' + dN + ' · <a href="diagnosis.html">重新问诊</a></div></div></div>'
      + cards;
    /* 船缩小、精准贴在航线上当前这一章（复用木帆船 ship-2）*/
    var ship = document.getElementById('kmShip');
    if (ship) { ship.src = 'assets/ship-2.png'; ship.style.width = '7%'; ship.style.left = (X(reached) - 4).toFixed(1) + '%'; ship.style.top = (WL(reached) - 9).toFixed(1) + '%'; ship.style.bottom = 'auto'; ship.style.display = ''; }
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
    document.getElementById('kdFlow').innerHTML = routeFlowHtml(r, day);
  }
  /* 一岛的 flow 列表 HTML —— 抽屉 + 神奇移动聚焦层 共用（onclick 走全局 toggleRouteCourse/openRouteSubmit/gotoLive）*/
  function routeFlowHtml(r, day) {
    const done = routeDone(), is = r.islands[day - 1]; if (!is) return '';
    const nc = nextCode(r, done), todayStr = toInput(startOfDay(new Date()));
    let blocked = false;
    /* 第一岛（Day1）开头：出航前检查 = 出海第一件事，点击带当前路线 key 进自检页 */
    const setupItem = day === 1 ? `<li class="kd-flow-item is-course current clickable" style="background:linear-gradient(180deg,rgba(31,111,106,.08),var(--surface));border-color:rgba(31,111,106,.3)" onclick="location.href='preflight.html?track=${r.key}'" title="出航前 · 环境自检"><span class="kd-fi-tag" style="background:rgba(31,111,106,.14);color:#1f6f6a"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="4" r="2"/><path d="M10 6v11M4 10H2.6a7.4 7.4 0 0 0 14.8 0H16M7 9.5h6"/></svg>出航前</span><span class="kd-fi-title" style="color:var(--deep-blue);font-weight:600">出航前检查 · 看看装备齐不齐</span><span class="kd-fi-dur">约 10min</span>${ARROW}</li>` : '';
    return setupItem + is.flow.map(f => {
      if (f.type === 'course') {
        const d = done.has(f.code), isCur = f.code === nc, st = d ? 'done' : (isCur ? 'current' : 'locked'), mark = d ? '✓' : (isCur ? '▸' : '');
        if (!d) blocked = true;
        return `<li class="kd-flow-item is-course ${st} clickable" data-code="${f.code}" onclick="toggleRouteCourse('${f.code}')"><span class="kd-fi-tag">${I_COURSE}图文</span><span class="kd-fi-mark clickable-mark" title="${d ? '已学完 · 点击撤销' : '标记已学完'}" onclick="event.stopPropagation();toggleRouteCourse('${f.code}')">${mark}</span><span class="kd-fi-title">${escapeHtml(f.t)}</span><span class="kd-fi-dur">${f.mins}min</span>${ARROW}</li>`;
      }
      const reached = !blocked;
      if (f.type === 'live') {
        if (!reached) return `<li class="kd-flow-item is-live locked" onclick="showToast('学到这里就能看视频了')"><span class="kd-fi-tag">${I_LIVE}视频</span><span class="kd-fi-title">${escapeHtml(f.title)}</span><span class="kd-fi-state">未学到</span></li>`;
        const past = f.date < todayStr, p = f.date.split('-');
        const dt = past ? '看回放 ▶' : ((+p[1]) + '/' + (+p[2]) + ' ' + f.time);
        return `<li class="kd-flow-item is-live clickable" onclick="gotoLive('${f.url || ''}')"><span class="kd-fi-tag">${I_LIVE}视频</span><span class="kd-fi-title">${escapeHtml(f.title)}</span><span class="kd-fi-state">${dt}</span>${ARROW}</li>`;
      }
      /* task */
      const subm = getRouteSubmission(r.key, day);
      const lockCls = reached ? '' : ' locked';
      const btn = subm
        ? `<button class="kd-fi-submit submitted" onclick="openRouteSubmit('${r.key}',${day})">已提交 ✓</button>`
        : (reached ? `<button class="kd-fi-submit" onclick="openRouteSubmit('${r.key}',${day})">提交</button>` : `<button class="kd-fi-submit locked" onclick="showToast('学到这里就能交作业了')">提交</button>`);
      return `<li class="kd-flow-item is-task${lockCls}"><span class="kd-fi-tag">${I_TASK}作业</span><div class="kd-fi-task-body"><div class="kd-fi-task-title">${escapeHtml(subm ? subm.title : f.title)}</div><div class="kd-fi-task-sub">可选 · 不计入解锁${subm ? ' · 已提交，待评审' : ''}</div></div>${btn}</li>`;
    }).join('') + routeLivesBlock(r, day);
  }

  /* ---------- 专属航线 · 神奇移动聚焦（复用 IsleFocus 引擎；内容=本岛 flow 列表）---------- */
  function routeIsleImg(r, i) {
    try { const a = (window.ROUTE_ART && ROUTE_ART[r.key] && ROUTE_ART[r.key].isles) || null; if (a && a.length) return a[i % a.length]; } catch (e) {}
    return 'assets/isle-' + ((i % 4) + 1) + '.webp';
  }
  function routeIslandsData(r) {
    return r.islands.map((is, i) => ({ stage: i + 1, zone: '岛 ' + (i + 1), name: is.zone || is.title, img: routeIsleImg(r, i), badge: '共 ' + islandCourses(is).length + ' 节' }));
  }
  function routeTier(r) { return Math.min(4, currentDay(r, routeDone())); }   // 船级 = 真实进度（到第几岛，封顶 4）
  function routeProgress(r) {
    const d = routeDone(), p = {};
    r.islands.forEach((is, i) => { const cs = islandCourses(is); p[i + 1] = { done: cs.filter(f => d.has(f.code)).length, total: cs.length }; });
    return p;
  }
  function mountRouteFlow(slot, key, day) {
    const r = ROUTES[key]; if (!r) return null;
    slot.innerHTML = '<div class="if-route-flow"><ul class="kd-flow">' + routeFlowHtml(r, day) + '</ul></div>';
    return null;
  }
  function routeIsleRects() {   // 各真路线岛当前屏幕位置（按 day）→ 聚焦岛从这儿长出 / 收起飞回
    const m = {}; document.querySelectorAll('#routeIslands .route-isle[data-day]').forEach(el => { const d = parseInt(el.dataset.day, 10); if (d) m[d] = el.getBoundingClientRect(); }); return m;
  }
  function enterRouteFocus(day, el) {
    const r = getRoute(); if (!r || !window.IsleFocus || !window.openFocusOverlay) { openCallout(day, el, null); return; }
    if (window.IsleFocus.isOpen()) { if (window.IsleFocus.current() !== day) window.IsleFocus.switchTo(day); return; }
    _openDay = day;
    const fromRects = routeIsleRects();
    window.openFocusOverlay();
    window.IsleFocus.open({
      root: document.getElementById('isleDiveRoot'),
      islands: routeIslandsData(r), focusStage: day,
      tier: function () { return routeTier(r); }, shipStage: function () { return Math.min(currentDay(r, routeDone()), r.islands.length); }, progress: function () { return routeProgress(r); }, fromRects: fromRects,
      mountContent: function (slot, d) { _openDay = d; return mountRouteFlow(slot, r.key, d); },
      onClose: window.hideFocusOverlay, onSwitch: function (d) { _openDay = d; }
    });
    try { history.pushState({ rday: day }, '', 'calendar.html?route=' + r.key); } catch (e) {}   // 压一条可回退条目：返回键先收起聚焦、且 URL 保留 ?route=
  }

  /* 往期直播回放：整条路线的真实小鹅通场次（按内容已归到该路线），挂在岛①抽屉底部 */
  function routeLivesBlock(r, day) {
    if (day !== 1 || !r.lives || !r.lives.length) return '';
    const items = r.lives.map(L =>
      `<li class="kd-flow-item is-live clickable" onclick="gotoLive('${L.url || ''}')"><span class="kd-fi-tag">${I_LIVE}回放</span><span class="kd-fi-title">${escapeHtml(L.t)}</span><span class="kd-fi-state">看回放 ▶</span>${ARROW}</li>`
    ).join('');
    return `<li class="kd-flow-sec" style="list-style:none;margin:16px 0 7px;font-size:11.5px;font-weight:700;letter-spacing:.02em;color:#0c7a70">📺 这条路线的往期直播回放 · ${r.lives.length} 场</li>` + items;
  }

  /* 原型：点路线图文 = 切换已学，刷新地图 + 抽屉 */
  window.toggleRouteCourse = function (code) {
    const d = routeDone(); d.has(code) ? d.delete(code) : d.add(code);
    setRouteDone(d);
    render();
    if (document.getElementById('kmCallout').classList.contains('show')) fillRouteCallout(getRoute(), _openDay);
    if (window.IsleFocus && window.IsleFocus.isOpen()) window.IsleFocus.refresh();   /* 聚焦层开着 → 即时刷新内容/船/进度 */
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
    if (r) {
      const done = routeDone();
      const _hh = document.getElementById('homeHero'); const _fab = document.getElementById('kmFab'); if (_fab) _fab.style.display = 'none';
      if (r.custom) {   /* 定制线：清单自带全部章节，收掉继续学习卡 */
        if (_hh) _hh.style.display = 'none';
        if (window.matchMedia && window.matchMedia('(max-width: 639px)').matches) renderRecList(r, done);   /* 手机：竖排清单卡 */
        else renderRecPath(r, done);   /* 桌面：点状航线（复用海图背景 + 蜿蜒航线，章节串成站点）*/
        updateRouteHead(r); return;
      }
      if (_hh) _hh.style.display = '';   /* 标准航线用 #homeHero 卡，收掉默认图浮窗 #kmFab，避免切路线时两张卡叠出 */
      renderRouteMap(r, done); renderRouteHero(r, done); updateRouteHead(r); return;
    }
    const wrap = document.getElementById('kmWrap'); if (wrap) wrap.classList.remove('route-mode');
    const host = document.getElementById('routeIslands'); if (host) host.innerHTML = '';  /* 退出 route 态：清掉 route 岛，避免与写死岛重叠 + bindInteractions 误绑崩溃 */
    if (genBtn) { genBtn.innerHTML = GEN_LABEL; genBtn.classList.remove('reselect'); }
    if (titleEl) titleEl.innerHTML = '你的学习地图 ' + STAR;   /* 退出 route 态：标题还原成默认 */
    if (routeEb) routeEb.style.display = 'none';
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
    if (genBtn) { genBtn.innerHTML = GEN_LABEL; genBtn.classList.remove('reselect'); }  /* 触发器恒为「切换航线」；点开即直接选路线，当前路线由下拉的 ✓ 体现 */
    if (titleEl) titleEl.innerHTML = r.name + ' ' + STAR;   /* 大标题换成路线名，让用户一眼知道「这是在做什么」 */
    if (routeEb) routeEb.style.display = '';
  }
  function renderRouteHero(r, done) {
    const codes = routeCourseCodes(r), d = codes.filter(c => done.has(c)).length, total = r.courseCount || codes.length, nc = nextCode(r, done);
    const btn = document.getElementById('hhBtn');
    if (!nc) {
      document.getElementById('hhEyebrow').textContent = '🎓 走完这条路线';
      document.getElementById('hhTitle').textContent = '恭喜！「' + SHORT[r.key] + '」路线全部走完 🎉';
      btn.textContent = '换条航线 →'; btn.href = 'javascript:void(0)'; btn.onclick = e => { e.preventDefault(); openRouteModal(); };
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
  window.openQuiz = openQuiz;
  /* 深链 ?route=key：首屏 render 前先把 ds_route 落地，避免首屏先按默认全量图渲染（白下载默认岛/船）再被 route-art-apply 切回路线 */
  try { var _rq = location.search.match(/[?&]route=([a-z]+)/); if (_rq && ROUTES[_rq[1]]) localStorage.setItem('ds_route', _rq[1]); } catch (e) {}
  /* 深链 ?quiz=1（从学习指南页「找你的航线」进来）→ 自动弹出找航线问卷 */
  try { if (new URLSearchParams(location.search).get('quiz') === '1') openQuiz(); } catch (e) {}
  try { render(); } catch (e) { console.warn('[routes-ui] 初次渲染失败', e); }
  /* 深链：calendar.html#route 直接打开问卷（便于演示 / 分享）*/
  if (location.hash === '#route') { try { openQuiz(); } catch (e) {} }
})();
