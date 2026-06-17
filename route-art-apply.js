/* 路线地图 · 生态皮肤应用层（route-art-apply.js）—— 运行时叠加，零侵入 routes-ui.js。
   选了路线 → 柔化专属海 + 生态岛 + 手调错落布局(对标全量图) + 平滑虚线串圆点 + 船校准。
   加载顺序：routes.js → routes-ui.js → route-art.js → route-art-apply.js（本文件最后）。
   做法：包住 window.render（routes-ui 已包过一层），其后对 DOM 做后处理。 */
(function () {
  if (typeof ROUTE_ART === 'undefined') { console.warn('[route-art-apply] 缺 ROUTE_ART，确认 route-art.js 已引入'); return; }

  /* 8 条路线的岛 2026-06-09 重画（发灰/糊海/空心/雷同四类毛病全治 → distinct+实心+鲜亮+小到大递进），画幅变了 →
     就近覆盖 route-isle-fit.js 的旧值（不改那份数据文件，零对撞）；schema 与之一致 {fw,fh,cb,ar} */
  var FIT_OVERRIDE = {
    'aiwebsite-1': { fw: 0.759, fh: 0.818, cb: 0.091, ar: 1.39 },
    'aiwebsite-2': { fw: 0.865, fh: 0.765, cb: 0.124, ar: 1.41 },
    'aiwebsite-3': { fw: 0.895, fh: 0.852, cb: 0.060, ar: 1.58 },
    'aiwebsite-4': { fw: 0.905, fh: 0.871, cb: 0.053, ar: 1.30 },
    'spec-1': { fw: 0.774, fh: 0.776, cb: 0.103, ar: 1.25 },
    'spec-2': { fw: 0.961, fh: 0.861, cb: 0.075, ar: 1.67 },
    'app-1': { fw: 0.731, fh: 0.810, cb: 0.082, ar: 1.35 },
    'app-2': { fw: 0.841, fh: 0.831, cb: 0.085, ar: 1.52 },
    'app-3': { fw: 0.870, fh: 0.801, cb: 0.094, ar: 1.63 },
    'minigame-1': { fw: 0.717, fh: 0.886, cb: 0.062, ar: 1.21 },
    'minigame-2': { fw: 0.878, fh: 0.867, cb: 0.060, ar: 1.52 },
    'minigame-3': { fw: 0.753, fh: 0.808, cb: 0.099, ar: 1.40 },
    'minigame-4': { fw: 0.916, fh: 0.873, cb: 0.064, ar: 0.88 },
    'automedia-1': { fw: 0.816, fh: 0.796, cb: 0.088, ar: 1.54 },
    'automedia-2': { fw: 0.839, fh: 0.870, cb: 0.051, ar: 1.45 },
    'automedia-3': { fw: 0.854, fh: 0.879, cb: 0.055, ar: 1.46 },
    'workflow-1': { fw: 0.755, fh: 0.820, cb: 0.083, ar: 1.15 },
    'workflow-2': { fw: 0.905, fh: 0.894, cb: 0.048, ar: 1.33 },
    'workflow-3': { fw: 0.853, fh: 0.893, cb: 0.052, ar: 1.19 },
    'claudecode-1': { fw: 0.849, fh: 0.786, cb: 0.084, ar: 1.35 },
    'claudecode-2': { fw: 0.902, fh: 0.882, cb: 0.037, ar: 1.28 },
    'mcp-1': { fw: 0.686, fh: 0.773, cb: 0.123, ar: 1.33 },
    'mcp-2': { fw: 0.795, fh: 0.910, cb: 0.041, ar: 1.31 },
    'mcp-3': { fw: 0.803, fh: 0.931, cb: 0.032, ar: 1.29 }
  };
  if (window.ISLE_FIT) { for (var _ko in FIT_OVERRIDE) window.ISLE_FIT[_ko] = FIT_OVERRIDE[_ko]; }

  /* 手调布局表：每种岛数一套坐标，对标全量图（由小到大 + 由近及远爬升 + 末岛留边给标签/船）。
     {x:中心 left%, b:bottom%, w:宽%}。N>4 兜底走线性公式。 */
  /* w = 目标「主导视觉维度」%（经下方画幅归一后，即各岛真实视觉大小）；按 ISLE_FIT 的 fw/ar 反算图宽消除画幅参差 */
  /* 对齐主路线比例：岛偏小 + 拉开间距 + 清晰递增（疏朗不拥挤；"越来越大"靠岛本身的丰富度，尺寸只温和放大）*/
  var LAYOUTS = {
    1: [{ x: 50, b: 20, w: 23 }],
    2: [{ x: 31, b: 17, w: 20 }, { x: 71, b: 24, w: 28 }],
    3: [{ x: 18, b: 15, w: 18 }, { x: 50, b: 20, w: 23 }, { x: 82, b: 26, w: 28 }],
    4: [{ x: 16, b: 14, w: 16 }, { x: 38, b: 17, w: 20 }, { x: 60, b: 22, w: 24 }, { x: 83, b: 27, w: 28 }]
  };
  var SHIP_SRC = 'assets/ship-2.png', SHIP_W = 6.5;    /* 木帆船高瘦(宽高比0.89)；6.5% 视口宽，停锚点不压岛 */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function layoutFor(N) {
    if (LAYOUTS[N]) return LAYOUTS[N];
    var a = []; for (var i = 0; i < N; i++) { var t = N > 1 ? i / (N - 1) : 0.5; a.push({ x: 14 + t * 70, b: 14 + t * 14, w: 16 + t * 7 }); } return a;
  }
  /* 由 img src 取该岛画幅；fw=内容宽占图比，用于把「目标内容宽」反算成 img 的图宽% */
  function isleFit(src) {
    try { var m = src.match(/([a-z]+-\d+)\.(?:png|webp)/); return (m && window.ISLE_FIT && window.ISLE_FIT[m[1]]) ? window.ISLE_FIT[m[1]] : null; } catch (e) { return null; }
  }

  /* 注入样式：点亮滤镜 + 继续学习卡(右下角缩小) + 圆点(对标 km-dot) + 海统一柔化 */
  var css =
    '.km-wrap .island.route-isle{transition:left .4s cubic-bezier(.4,0,.2,1),bottom .4s cubic-bezier(.4,0,.2,1),width .4s cubic-bezier(.4,0,.2,1),transform .18s}' +
    '.km-wrap .island.route-isle.locked>img{filter:saturate(.85) brightness(1) contrast(1) drop-shadow(0 8px 12px rgba(30,80,90,.16));opacity:.86}' +
    '.km-wrap .island.route-isle.cur>img{filter:saturate(1.05) brightness(1.02) drop-shadow(0 0 14px rgba(255,226,150,.4)) drop-shadow(0 8px 12px rgba(30,80,90,.22));opacity:1}' +
    '.km-wrap .island.route-isle.done>img{filter:saturate(1.04) brightness(1.01) drop-shadow(0 8px 12px rgba(30,80,90,.2));opacity:1}' +
    /* "继续学习"卡：沿用原样式，缩小 + 挪到右下角、不占地方 */
    '#homeHero{left:auto !important;right:2.4% !important;top:auto !important;bottom:7% !important;max-width:210px !important;z-index:9}' +
    '#homeHero.home-hero{max-width:210px;padding:6px 11px 7px 13px;border-radius:9px}' +
    '#homeHero .hh-eyebrow{font-size:8px;margin-bottom:2px}' +
    '#homeHero .hh-title{font-size:11.5px}' +
    '#homeHero .hh-btn{width:23px;height:23px}' +
    '#homeHero .hh-btn::after{font-size:12px}' +
    /* 圆点：对标全量图 .km-dot（done 实金 / cur 金+光环 / locked 白灰边）*/
    '.route-dot{position:absolute;width:17px;height:17px;border-radius:50%;background:#fff;border:3px solid var(--gold);transform:translate(-50%,-50%);box-shadow:0 2px 8px rgba(150,110,40,.6);z-index:5;pointer-events:none;transition:left .4s cubic-bezier(.4,0,.2,1),top .4s cubic-bezier(.4,0,.2,1)}' +
    '.route-dot.done{background:var(--gold);border-color:var(--gold)}' +
    '.route-dot.cur{background:var(--gold);box-shadow:0 0 0 7px rgba(194,137,47,.22)}' +
    '.route-dot.locked{background:#fff;border-color:#bcc8cf}' +
    /* 深度刻度 .route-depth 已删除（纯装饰、无含义）*/
    /* 海：干净生态海如实显示（不再降饱和、不再淡青蒙版）*/
    '';
  var st = document.createElement('style'); st.id = 'routeArtStyle'; st.textContent = css; document.head.appendChild(st);

  function curKey() {
    try { var k = localStorage.getItem('ds_route'); return (k && ROUTE_ART[k]) ? k : null; } catch (e) { return null; }
  }

  /* Catmull-Rom → 三次贝塞尔，平滑穿过所有点（参考全量图那条手绘曲线的质感）*/
  function smoothPath(p) {
    if (p.length < 2) return '';
    var f = function (n) { return n.toFixed(1); };
    if (p.length === 2) return 'M' + f(p[0][0]) + ' ' + f(p[0][1]) + ' L' + f(p[1][0]) + ' ' + f(p[1][1]);
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p[i + 1];
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + f(c1x) + ' ' + f(c1y) + ',' + f(c2x) + ' ' + f(c2y) + ',' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d;
  }

  function svgEl(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
  function clearArt() {
    ['routeLine', 'routeDots'].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
  }

  function apply() {
    var seaLayer = document.querySelector('.sea-layer');
    var wrap = document.getElementById('kmWrap');
    var key = curKey();
    clearArt();
    if (!key) {
      document.body.classList.remove('route-sea');
      /* 默认全量图的主海 sea-i 改由此处设（CSS 已移除写死的 url，避免选了专属航线时白下载这 208KB）；filter 清空 → 回落 CSS 的默认调色 */
      if (seaLayer) { seaLayer.style.backgroundImage = "url('assets/sea-i.webp')"; seaLayer.style.filter = ''; }
      return;
    }
    var art = ROUTE_ART[key];
    /* 1) 海：按路线换「淡底生态海」(gen_seas_designed.py 重做, 2026-06-09)。
       早前因旧 gpt 海质感差曾暂统一用 sea-i；本版海已调淡 + 对岛配色、逐条配岛验证 → 重新启用按路线换海。
       回退单海: 把下面一行换成  seaLayer.style.backgroundImage="url('assets/sea-i.webp')"; seaLayer.style.filter=''; */
    document.body.classList.add('route-sea');
    if (seaLayer && art.sea) { seaLayer.style.backgroundImage = "url('" + art.sea + "')"; seaLayer.style.filter = 'saturate(1.04)'; }
    var isles = wrap ? Array.prototype.slice.call(wrap.querySelectorAll('.route-isle')) : [];
    if (!isles.length) return;
    var pool = art.isles || [], N = isles.length, pos = layoutFor(N);

    /* 2) 岛：手调坐标错落布局 + 换生态岛图 */
    isles.forEach(function (el, i) {
      var P = pos[i] || pos[pos.length - 1];
      var src = pool.length ? pool[i % pool.length] : null;
      var fit = src ? isleFit(src) : null;
      /* 画幅感知归一：E = fw·max(1, 1/ar) 取「主导视觉维度」占图比（ar=内容宽/高，<1 即高瘦岛按其高度封顶），
         imgW = P.w/E 让岛的主维度严格 = P.w。比只按内容宽归一更准——宽归一会把高瘦灯塔越放越高 */
      var imgW = P.w;
      if (fit && fit.fw) { var E = fit.fw * (fit.ar && fit.ar < 1 ? 1 / fit.ar : 1); imgW = P.w / E; }
      el.style.left = P.x.toFixed(1) + '%';
      el.style.bottom = P.b.toFixed(1) + '%';
      el.style.width = imgW.toFixed(1) + '%';
      var img = el.querySelector('img');
      if (img && src && img.getAttribute('src') !== src) img.src = src;
    });

    /* 当前岛索引（没有 cur 则停最后一座）*/
    var ci = isles.findIndex(function (el) { return el.classList.contains('cur'); });
    if (ci < 0) ci = N - 1;

    /* 3) 船：停当前岛右下海面，校准不压岛、不出血；中心定位(.km-ship transform translate(-50%,-50%)) */
    var ship = document.getElementById('kmShip');
    if (ship) {
      var sx = clamp(pos[ci].x, SHIP_W * 0.5 + 2, 98 - SHIP_W * 0.5);   /* 船心对齐当前岛锚点(圆点)x → 正坐在锚点上 */
      ship.src = SHIP_SRC; ship.style.width = SHIP_W + '%';
      ship.style.left = sx.toFixed(1) + '%';
      ship.style.top = Math.min(88, (100 - pos[ci].b) + 2.5).toFixed(1) + '%';   /* 上限 88%：竖高木帆船中心定位，太低会沉出屏底 */
      ship.style.display = '';
    }

    /* "继续学习"卡：沿用原样式（位置/大小由上面注入的 CSS 覆盖到右下角、缩小），这里只确保显示 */
    var hh = document.getElementById('homeHero'); if (hh) hh.style.display = '';

    /* 4) 虚线：平滑曲线穿过各岛脚水线（在水面、岛之下 z2）*/
    if (N >= 2) {
      /* 锚点：左下起笔 → 各岛脚水线 → 右侧收笔（圆点落在这些锚点上）*/
      var anchors = [[pos[0].x - pos[0].w * 0.55, (100 - pos[0].b) + 5]];
      pos.slice(0, N).forEach(function (p) { anchors.push([p.x, (100 - p.b) + 2.5]); });
      var _lst = pos[N - 1]; anchors.push([_lst.x + _lst.w * 0.5, (100 - _lst.b) + 4]);
      /* 岛与岛之间插「交替上下」的波浪中点 → 航线蜿蜒不笔直；起笔→岛1 那段不加波浪，入口干净、船清楚停在岛1锚点上 */
      var pts = [anchors[0]];
      for (var _i = 0; _i < anchors.length - 1; _i++) {
        var _a = anchors[_i], _b = anchors[_i + 1];
        if (_i === 0) { pts.push(_b); continue; }   /* 起笔→岛1：直连，别在船头拱包 */
        var _my = Math.min((_a[1] + _b[1]) / 2 + (_i % 2 === 0 ? -5.5 : 3.5), 95.5);
        pts.push([(_a[0] + _b[0]) / 2, _my]);
        pts.push(_b);
      }
      var svg = svgEl('svg');
      svg.setAttribute('id', 'routeLine');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2');
      var path = svgEl('path');
      path.setAttribute('d', smoothPath(pts));
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#bf842a');
      path.setAttribute('stroke-width', '1'); path.setAttribute('stroke-dasharray', '2 1.7');
      path.setAttribute('stroke-linecap', 'round'); path.setAttribute('opacity', '0.92');
      svg.appendChild(path);
      wrap.insertBefore(svg, wrap.firstChild);
    }

    /* 5) 圆点：每岛一个，落在虚线节点上，状态跟随岛(done/cur/locked) */
    var dots = document.createElement('div'); dots.id = 'routeDots';
    isles.forEach(function (el, i) {
      var P = pos[i] || pos[pos.length - 1];
      var s = el.classList.contains('done') ? 'done' : (el.classList.contains('cur') ? 'cur' : 'locked');
      var d = document.createElement('div'); d.className = 'route-dot ' + s;
      d.style.left = P.x.toFixed(1) + '%'; d.style.top = ((100 - P.b) + 2.5).toFixed(1) + '%';
      dots.appendChild(d);
    });
    wrap.appendChild(dots);
    /* 深度刻度（10m/30m/60m/100m）已删除：纯装饰、无含义，避免干扰 */
  }

  /* 包住 render（routes-ui 已包一层）→ 每次渲染后叠生态皮肤 */
  var _r = window.render;
  window.render = function () {
    var ret = _r ? _r.apply(this, arguments) : undefined;
    try { apply(); } catch (e) { console.warn('[route-art-apply]', e); }
    return ret;
  };

  /* 深链 ?route=key：自动选中该路线（便于演示 / QA 截图）*/
  function boot() {
    try {
      var m = location.search.match(/[?&]route=([a-z]+)/);
      if (m && ROUTE_ART[m[1]] && (typeof ROUTES === 'undefined' || ROUTES[m[1]])) {
        localStorage.setItem('ds_route', m[1]);
        if (window.render) window.render(); return;
      }
    } catch (e) {}
    try { apply(); } catch (e) {}   /* routes-ui 初始 render 在本文件加载前已跑过 → 补一次 */
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
