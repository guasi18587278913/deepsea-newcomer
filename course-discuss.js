/* =========================================================================
   course-discuss.js — 课旁讨论数据 + 视图
   -------------------------------------------------------------------------
   数据层（按课节 code 存 threads/replies/promoted，可回复、可「发到广场」）保留。
   视图升级为「本节问答(沉淀·锚课节) + 本章动态(活水·锚阶段)」两区 + 意图式发布框：
     · learn.html   → CourseDiscuss.initLesson()       渲染整块面板到 #cdWrap
     · discuss.html → CourseDiscuss.renderPlaza(el,opt) 跨课节聚合（被「发到广场」的精选）
   依赖：course-data.js 的全局 COURSES（由 code 反查标题/阶段；缺失则降级显示 code）。

   localStorage（ds_course_discuss）：
     { threads:{[code]:[{id,user,role,kind,text,at,promoted}]},
       replies:{[tid]:[{user,role,text,at}]}, promoted:{[tid]:true} }
   本章动态：种子(SEED_FLOW 按阶段) + 本会话内追加(flowAppend，不跨课节持久化)。
   ========================================================================= */
(function (global) {
  'use strict';

  var LS_KEY = 'ds_course_discuss';
  var ME = { user: '瓜哥', role: '我' };
  var STAGE_NAME = { 1: '快速入门', 2: '实战进阶', 3: '商业化', 4: '增长' };

  /* 角色 → tag 行内样式（讲师紫 / 助教 teal-bg / 我 teal-solid；其它无 tag）*/
  var ROLE_STYLE = {
    '讲师': 'background:#f5f2ff;color:#7c5cbf',
    '助教': 'background:var(--teal-light,#e6f7f5);color:var(--teal-dark,#0b7c71)',
    '我':   'background:var(--teal,#14b8a6);color:#fff'
  };

  /* 种子：每条挂在真实课节 code 上。promoted=true 的会进广场「课程讨论」。kind:'q' 渲染成提问。*/
  var SEED = [
    /* ── M1.1 · 这套课程有什么不同？ ── */
    { id: 's101', code: 'M1.1', user: '陈小飞', kind: 'q', mins: 35, promoted: true,
      text: '完全零基础，光看介绍就觉得差距好大，怕自己跟不上怎么办？',
      replies: [{ user: '刘小排', role: '讲师', mins: 30, text: '放心，案例里 58 岁的钢铁的铁、纯文科的良辰美都做到了。课程第一周就让你做出第一个网站，一步一步来，跟不上随时在这儿问' }] },
    { id: 's102', code: 'M1.1', user: '李航', kind: 'q', mins: 80, promoted: false,
      text: '老师您的 Raphael 上线第一个月是怎么冷启动的？很好奇',
      replies: [{ user: '助教小安', role: '助教', mins: 72, text: '冷启动在「增长篇」会专门拆，这节先建立全局认知。可以先记下来，学到那儿再回看' }] },
    { id: 's103', code: 'M1.1', user: '张小鱼', mins: 15, promoted: false,
      text: '看完被治愈了 😄 之前一直觉得"我不是技术的料"，现在有点信心了', replies: [] },
    { id: 's104', code: 'M1.1', user: '韩梅', kind: 'add', mins: 50, promoted: false,
      text: '建议先把这 12 节标题快速过一遍，心里有张地图再开始，不容易迷路',
      replies: [{ user: '赵一一', role: '', mins: 44, text: '好主意，刚这么做了，确实清晰多了' }] },

    /* ── M1.2 · 我祖上十八代都不会编程 ── */
    { id: 's121', code: 'M1.2', user: '老周', kind: 'q', mins: 120, promoted: true,
      text: '我 55 了，记性差、英语也忘光了，真的能学会编程吗？有点虚',
      replies: [{ user: '王大锤', role: '助教', mins: 110, text: '能。这门课是"指挥 AI 干活"，不是让你背语法。英语不用担心，全程中文也能跟 AI 沟通。慢一点没关系，社区里很多大龄同学' }] },
    { id: 's122', code: 'M1.2', user: '阿强', kind: 'q', mins: 40, promoted: false,
      text: '要不要先去别处学点 Python 基础再回来学这门？',
      replies: [{ user: '助教小安', role: '助教', mins: 33, text: '不需要，反而容易劝退。直接跟着做，遇到不懂的概念课程和 AI 会随时解释' }] },
    { id: 's123', code: 'M1.2', user: '小美', mins: 18, promoted: false,
      text: '文科生表示这节看得有点想哭，原来不是我笨，是以前的门槛太高了', replies: [] },

    /* ── M1.3 · 开挂式学习：用AI来学AI ── */
    { id: 's131', code: 'M1.3', user: '林木', kind: 'q', mins: 60, promoted: true,
      text: '学习时用哪个 AI 比较好？ChatGPT、Claude、还是国内的？',
      replies: [{ user: '周杰', role: '高手', mins: 52, text: '写代码 Claude 系列体感最好，日常答疑 ChatGPT 也够用，国内通义/豆包也行。先用顺手的，别纠结工具' }] },
    { id: 's132', code: 'M1.3', user: '何丽', kind: 'add', mins: 25, promoted: false,
      text: '补充个习惯：不懂的直接截图丢给 AI 问，比自己 Google 快十倍', replies: [] },

    /* ── M2.1 · AI到底是什么？超级实习生 ── */
    { id: 's201', code: 'M2.1', user: '小白', kind: 'q', mins: 30, promoted: false,
      text: '"超级实习生"这个比喻好懂！那它会不会经常犯错？我咋知道它说的对不对？',
      replies: [{ user: '王大锤', role: '助教', mins: 24, text: '会犯错，尤其它"自信地胡说"的时候。原则：越重要的信息越要自己核对一遍。后面会教怎么让它少犯错' }] },
    { id: 's202', code: 'M2.1', user: '大壮', mins: 12, promoted: false,
      text: '听完豁然开朗，以前总把 AI 当搜索引擎用，难怪用不好', replies: [] },

    /* ── M2.2 · 初体验：10分钟做出第一个网站 ── */
    { id: 's221', code: 'M2.2', user: '陈晨', kind: 'q', mins: 22, promoted: true, img: true,
      text: '跟着做到第 3 步，双击 index.html 浏览器一片空白，啥都没有 😭（附截图）',
      replies: [{ user: '周杰', role: '高手', mins: 18, text: '大概率文件存成了 index.html.txt。打开"显示文件扩展名"，把后面的 .txt 去掉就好' },
                { user: '陈晨', role: '', mins: 12, text: '真的是！改完就出来了，太感谢 🙏' }] },
    { id: 's222', code: 'M2.2', user: '林浩', kind: 'q', mins: 45, promoted: false,
      text: '中文显示成乱码了，一堆问号方块，咋办？',
      replies: [{ user: '王大锤', role: '助教', mins: 40, text: '文件第一行加 <meta charset="UTF-8"> 就好，是编码问题' }] },
    { id: 's223', code: 'M2.2', user: '何丽', kind: 'q', mins: 70, promoted: false,
      text: '想让标题居中，问 AI 给了一段 CSS 但不知道贴哪儿 😅',
      replies: [{ user: '赵薇薇', role: '', mins: 64, text: '最笨的办法：在 <h1> 里加 style="text-align:center"，先跑通再说优雅' }] },
    { id: 's224', code: 'M2.2', user: '周杰', kind: 'add', mins: 90, promoted: true,
      text: '提效补充：装个 VS Code 的 Live Server 插件，改完自动刷新，不用反复双击，跟这节配合超顺',
      replies: [{ user: '黄小美', role: '', mins: 80, text: '学到了！这个比双击爽多了' }] },
    { id: 's225', code: 'M2.2', user: '马飞', mins: 8, promoted: false, img: true,
      text: '做出来了！第一次看到浏览器里出现自己写的字，鸡皮疙瘩起来了 🎉', replies: [] },

    /* ── M2.3 · 跟AI讨论需求 ── */
    { id: 's231', code: 'M2.3', user: '小琳', kind: 'q', mins: 55, promoted: true,
      text: '给 AI 的指令我总觉得说清楚了，但它做出来的总不对，是我的问题吗？',
      replies: [{ user: '刘小排', role: '讲师', mins: 48, text: '是表达问题，不是你的问题 😄 把"我想要个 X"换成"做一个 X，包含 A、B、C，风格像 D"，越具体它越准。多练几次就顺了' }] },
    { id: 's232', code: 'M2.3', user: '阿May', kind: 'add', mins: 30, promoted: false,
      text: '土办法：先让 AI 帮我把需求列成 1234 点，我改完再让它做，返工少很多', replies: [] },

    /* ── M2.5 · 预制菜思维 + 积木思维 ── */
    { id: 's251', code: 'M2.5', user: '老李', kind: 'q', mins: 40, promoted: false,
      text: '积木思维具体咋拆？能再举个例子吗，有点抽象',
      replies: [{ user: '助教小安', role: '助教', mins: 34, text: '比如"用户登录"就是一块标准积木——几乎每个产品都要、做法成熟，直接拿现成的拼上，不用自己造。下节实战你会反复用到' }] },
    { id: 's252', code: 'M2.5', user: '小鹿', mins: 16, promoted: false,
      text: '"预制菜思维"这比喻绝了，瞬间不焦虑了，原来不用啥都自己从零写', replies: [] },

    /* ── M3.5 · Next.js（实战进阶）── */
    { id: 's351', code: 'M3.5', user: '郑涛', kind: 'q', mins: 70, promoted: true,
      text: 'npm install 一堆红色报错，engine Unsupported… 我 Node 是 16，课程要 18 以上是吗？不知道咋升级 😭',
      replies: [{ user: '王大锤', role: '助教', mins: 64, text: '对，升级到 18+。用 nvm：nvm install 18 && nvm use 18，再 node -v 确认' }] },
    { id: 's352', code: 'M3.5', user: '周宁', kind: 'add', mins: 30, promoted: false,
      text: '补充：Next.js 的"页面即文件"一开始很懵，把 app 目录下的文件夹名当成网址路径理解就通了', replies: [] },

    /* ── M4.3（实战进阶）── */
    { id: 's431', code: 'M4.3', user: '孙大伟', kind: 'q', mins: 95, promoted: true,
      text: '调 OpenAI 一直 401，key 我贴进 .env 了本地还是不认。是要重启服务、还是变量名写错了？',
      replies: [{ user: '王大锤', role: '助教', mins: 88, text: '.env 改了必须重启 dev 服务，热更新不会重读环境变量。变量名也核对下大小写' }] }
  ];

  /* 本章动态种子（按阶段）：evt=自动学习事件(含作业提交/完成节) · good=报喜 · chat=闲聊。text 为可信 HTML。*/
  var SEED_FLOW = {
    1: [
      { user: '赵薇薇', kind: 'evt',  mins: 3,  text: '提交了 <b>快速入门</b> 阶段作业 <span class="cd-link">「我的待办清单」›</span>' },
      { user: '孙大伟', kind: 'good', mins: 9,  text: '把第一个网页部署上线了，激动 🚀' },
      { user: '陈晨',   kind: 'evt',  mins: 14, text: '学完了《初体验：10 分钟做出第一个网站》· 解锁下一节' },
      { user: '黄小美', kind: 'good', mins: 22, text: '人生第一个网页跑出来了，截图留念 📸' },
      { user: '马飞',   kind: 'chat', mins: 34, text: '刚开始啃这一章，有一起的同学吗？' },
      { user: '周宁',   kind: 'evt',  mins: 48, text: '连续打卡 5 天 🔥 拿到「坚持之星」徽章' },
      { user: '郑涛',   kind: 'chat', mins: 65, text: '求个这一章的学习节奏建议，每天多久合适？' }
    ],
    2: [
      { user: '林浩',   kind: 'good', mins: 8,  text: '实战进阶第一个项目跑通了，成就感拉满 🎉' },
      { user: '周宁',   kind: 'evt',  mins: 22, text: '提交了 <b>实战进阶</b> 阶段作业 <span class="cd-link">「AI 翻译小工具」›</span>' },
      { user: '王悦',   kind: 'good', mins: 35, text: '第一次把数据库接通，数据真的存进去了！' },
      { user: '何丽',   kind: 'chat', mins: 50, text: '这一章难度上来了，大家都怎么安排时间的？' }
    ],
    3: [
      { user: '孙大伟', kind: 'good', mins: 15, text: '收到第一笔付费 💰 虽然只有 $5 但意义重大' },
      { user: '赵薇薇', kind: 'evt',  mins: 40, text: '提交了 <b>商业化</b> 阶段作业 <span class="cd-link">「AI 邮件润色器」›</span>' },
      { user: '李航',   kind: 'chat', mins: 70, text: 'Stripe 收款有踩过坑的吗？想提前避个雷' }
    ],
    4: [
      { user: '王悦',   kind: 'good', mins: 18, text: '产品上线一周，第一个自然流量用户来了 🌱' },
      { user: '周杰',   kind: 'chat', mins: 30, text: '增长篇有一起做冷启动的吗？组个队' }
    ]
  };
  var flowAppend = [];  // {user,kind,text(已转义),at,stage} · 本会话内，不跨课节持久化

  var IC_REPLY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 11.5a8.4 8.4 0 0 1-7.6 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>';
  var IC_IMG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function relTime(at) {
    var m = Math.floor((Date.now() - at) / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return m + ' 分钟前';
    var h = Math.floor(m / 60);
    if (h < 24) return h + ' 小时前';
    return Math.floor(h / 24) + ' 天前';
  }
  function getCode() { return new URLSearchParams(location.search).get('code') || 'M1.1'; }
  function uid() { return 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
  /* course-data.js 用 `const COURSES` 声明 —— 词法全局，不挂 window，所以读裸标识符 */
  function course(code) {
    var list = (typeof COURSES !== 'undefined' && COURSES) ? COURSES : [];
    return list.filter(function (c) { return c.code === code; })[0] || null;
  }
  function stageOf(code) { var c = course(code); return c ? (c.s || c.stage || 0) : 0; }

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      o.threads = o.threads || {}; o.replies = o.replies || {}; o.promoted = o.promoted || {};
      return o;
    } catch (e) { return { threads: {}, replies: {}, promoted: {} }; }
  }
  function save(o) { localStorage.setItem(LS_KEY, JSON.stringify(o)); }

  /* ---------- 读：种子 + 本地用户数据 → 某课节的楼层数组（旧→新）---------- */
  function threadsForCode(code) {
    var st = load(), now = Date.now();
    function mergeReplies(id, seedReplies) {
      var rs = (seedReplies || []).concat(st.replies[id] || []).slice();
      rs.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
      return rs;
    }
    var seed = SEED.filter(function (s) { return s.code === code; }).map(function (s) {
      return {
        id: s.id, code: s.code, user: s.user, role: '', kind: s.kind || 'done',
        text: s.text, img: !!s.img, at: now - s.mins * 60000, promoted: !!(s.promoted || st.promoted[s.id]),
        replies: mergeReplies(s.id, (s.replies || []).map(function (r) {
          return { user: r.user, role: r.role || '', text: r.text, at: now - r.mins * 60000 };
        }))
      };
    });
    var users = (st.threads[code] || []).map(function (t) {
      return {
        id: t.id, code: code, user: t.user, role: t.role || '我', kind: t.kind || 'q',
        text: t.text, img: !!t.img, at: t.at, promoted: !!(t.promoted || st.promoted[t.id]),
        replies: mergeReplies(t.id, [])
      };
    });
    var all = seed.concat(users);
    all.sort(function (a, b) { return a.at - b.at; });
    return all;
  }

  /* 广场聚合：所有「被发到广场」的楼（种子 promoted + 用户 promoted），新→旧 */
  function promotedThreads(stageFilter) {
    var st = load(), now = Date.now(), out = [];
    SEED.forEach(function (s) {
      if (!(s.promoted || st.promoted[s.id])) return;
      out.push({
        id: s.id, code: s.code, user: s.user, role: '', text: s.text, at: now - s.mins * 60000,
        replyCount: (s.replies ? s.replies.length : 0) + ((st.replies[s.id] || []).length)
      });
    });
    Object.keys(st.threads).forEach(function (code) {
      (st.threads[code] || []).forEach(function (t) {
        if (!(t.promoted || st.promoted[t.id])) return;
        out.push({
          id: t.id, code: code, user: t.user, role: t.role || '我', text: t.text, at: t.at,
          replyCount: (st.replies[t.id] || []).length
        });
      });
    });
    if (stageFilter) out = out.filter(function (t) { return stageOf(t.code) === stageFilter; });
    out.sort(function (a, b) { return b.at - a.at; });
    return out;
  }

  /* ---------- 写 ---------- */
  function addThread(code, text, kind, img) {
    text = (text || '').trim(); if (!text && !img) return false;
    var st = load();
    (st.threads[code] = st.threads[code] || []).push({ id: uid(), user: ME.user, role: '我', kind: kind || 'q', text: text, img: !!img, at: Date.now(), promoted: false });
    save(st); return true;
  }
  function addReply(threadId, text) {
    text = (text || '').trim(); if (!text) return false;
    var st = load();
    (st.replies[threadId] = st.replies[threadId] || []).push({ user: ME.user, role: '我', text: text, at: Date.now() });
    save(st); return true;
  }
  function setPromoted(threadId) { var st = load(); st.promoted[threadId] = true; save(st); }

  function roleTag(role) {
    if (!role) return '';
    var style = ROLE_STYLE[role] || '';
    return '<span class="cd-tag"' + (style ? ' style="' + style + '"' : '') + '>' + esc(role) + '</span>';
  }
  var AV_COLORS = ['#14b8a6', '#0e7490', '#2f8f6e', '#3a7d8c', '#b9863f', '#52708a'];
  function avColor(seed) { var h = 0, s = String(seed || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return AV_COLORS[h % AV_COLORS.length]; }
  function avi(name) { return '<span class="cd-av" style="background:' + avColor(name) + '">' + esc(String(name).slice(0, 1)) + '</span>'; }

  /* =====================================================================
     视图 1 · 课旁讨论面板（learn.html → #cdWrap）
     ===================================================================== */
  var INTENT = {
    'q':    { label: '提问',     ph: '卡在哪一步？贴上报错和你试过的', zone: 'qa',   land: '本节问答', kind: 'q' },
    'add':  { label: '补充经验', ph: '分享个技巧或踩过的坑',          zone: 'qa',   land: '本节问答', kind: 'add' },
    'good': { label: '报喜',     ph: '做出来了？晒一下',              zone: 'flow', land: '本章动态' }
  };
  var INTENT_ORDER = ['q', 'add', 'good'];
  var curIntent = 'q';

  /* 精华：本节里第一条带 讲师/助教 回复的种子答案 */
  function starAnswer(code) {
    var seeds = SEED.filter(function (s) { return s.code === code; });
    for (var i = 0; i < seeds.length; i++) {
      var rep = (seeds[i].replies || []).filter(function (r) { return r.role === '讲师' || r.role === '助教'; })[0];
      if (rep) return rep;
    }
    return null;
  }
  function starHtml(code) {
    var a = starAnswer(code); if (!a) return '';
    return '<div class="cd-star">' +
      '<span class="cd-star-tag">★ 精华</span>' +
      '<div class="cd-star-row">' + avi(a.user) + '<span class="cd-star-nm">' + esc(a.user) + roleTag(a.role) + '</span></div>' +
      '<div class="cd-star-tx">' + esc(a.text) + '</div></div>';
  }

  function qaSolved(t) { return (t.replies || []).some(function (r) { return r.role === '讲师' || r.role === '助教'; }); }

  function replyHtml(r) {
    return '<div class="cd-reply"><span class="cd-reply-user">' + esc(r.user) + '</span>' + roleTag(r.role) +
      '<span class="cd-reply-text"> ' + esc(r.text) + '</span>' +
      '<span class="cd-reply-time">' + relTime(r.at) + '</span></div>';
  }
  function qaHtml(t) {
    var typeTag = t.kind === 'q' ? '<span class="cd-type q">求助</span>'
      : (t.kind === 'add' ? '<span class="cd-type add">补充</span>' : '');
    var status = t.kind === 'q' ? (qaSolved(t) ? '<span class="cd-st ok">已解决</span>' : '<span class="cd-st wait">待解决</span>') : '';
    var replies = (t.replies || []).map(replyHtml).join('');
    return '<div class="cd-qa" data-tid="' + esc(t.id) + '">' +
      '<div class="cd-qa-top">' + avi(t.user) +
        '<div class="cd-qa-id"><span class="cd-qa-nm">' + esc(t.user) + roleTag(t.role) +
        '</span><span class="cd-qa-tm">' + relTime(t.at) + '</span></div>' + typeTag + '</div>' +
      (t.text ? '<div class="cd-qa-tx">' + esc(t.text) + '</div>' : '') +
      (t.img ? '<div class="cd-qa-img">' + IC_IMG + '<span>我的截图</span></div>' : '') +
      '<div class="cd-qa-foot">' +
        '<a class="cd-act" onclick="CourseDiscuss.toggleReply(\'' + esc(t.id) + '\')">' + IC_REPLY + ' ' + (t.replies || []).length + ' 回复</a>' +
        status +
        (t.promoted ? '<span class="cd-promoted">已在广场</span>'
                    : '<a class="cd-act cd-right" onclick="CourseDiscuss.promote(\'' + esc(t.id) + '\')">发到广场</a>') +
      '</div>' +
      (replies ? '<div class="cd-replies">' + replies + '</div>' : '') +
      '<div class="cd-reply-box" id="cd-rb-' + esc(t.id) + '" style="display:none">' +
        '<input class="cd-reply-input" id="cd-ri-' + esc(t.id) + '" placeholder="回复 ' + esc(t.user) + '…" onkeydown="CourseDiscuss.replyKey(event,\'' + esc(t.id) + '\')">' +
        '<button class="cd-reply-send" onclick="CourseDiscuss.sendReply(\'' + esc(t.id) + '\')">回复</button>' +
      '</div>' +
    '</div>';
  }
  function qaZoneHtml(code) {
    var all = threadsForCode(code);
    if (!all.length) return starHtml(code) + '<div class="cd-empty">这一节还没人聊。<br>卡住了？做出来了？<b>开个头 ›</b></div>';
    return starHtml(code) + all.map(qaHtml).join('');
  }

  function flowItems() {
    var st = stageOf(getCode()) || 1, now = Date.now();
    var seed = (SEED_FLOW[st] || []).map(function (f) { return { user: f.user, kind: f.kind, text: f.text, at: now - f.mins * 60000 }; });
    var mine = flowAppend.filter(function (f) { return f.stage === st; });
    return mine.concat(seed);  // 本会话追加的在最上
  }
  function flowHtml() {
    var rows = flowItems().map(function (f) {
      var body = f.kind === 'good' ? '<span class="cd-good">' + f.text + '</span>' : f.text;  // f.text 已是可信/已转义
      var tag = f.kind === 'evt' ? ' · 自动播报' : (f.kind === 'good' ? ' · 报喜' : '');
      return '<div class="cd-fl">' + avi(f.user) + '<div class="cd-fl-bd"><div class="cd-fl-l1"><b>' + esc(f.user) + '</b> ' + body + '</div>' +
        (f.img ? '<div class="cd-fl-img">' + IC_IMG + '<span>截图</span></div>' : '') +
        '<div class="cd-fl-tm">' + relTime(f.at) + tag + '</div></div></div>';
    }).join('');
    return '<div class="cd-flow-head"><span class="cd-live"></span> 本章此刻 <b>8 人</b>在学</div>' + rows;
  }

  function panelHtml() {
    var qn = threadsForCode(getCode()).length;
    var chips = INTENT_ORDER.map(function (k) {
      return '<button class="cd-intent' + (k === curIntent ? ' on' : '') + '" data-i="' + k + '" onclick="CourseDiscuss.selectIntent(this)">' + INTENT[k].label + '</button>';
    }).join('');
    return '' +
      '<div class="cd-tabs">' +
        '<button class="cd-tab on" data-zone="qa" onclick="CourseDiscuss.switchZone(this)">本节问答<span class="cd-badge">' + qn + '</span></button>' +
        '<button class="cd-tab" data-zone="flow" onclick="CourseDiscuss.switchZone(this)">本章动态<span class="cd-badge">实时</span></button>' +
      '</div>' +
      '<div class="cd-body">' +
        '<div class="cd-zone on" id="cd-zone-qa">' + qaZoneHtml(getCode()) + '</div>' +
        '<div class="cd-zone" id="cd-zone-flow">' + flowHtml() + '</div>' +
      '</div>' +
      '<div class="cd-comp">' +
        '<div class="cd-intents">' + chips + '</div>' +
        '<textarea class="cd-ta" id="cdTa" placeholder="' + INTENT[curIntent].ph + '"></textarea>' +
        '<div class="cd-thumbs" id="cdThumbs"></div>' +
        '<div class="cd-comp-bar">' +
          '<button class="cd-img" onclick="CourseDiscuss.addImg()" title="贴图 / 截图">' + IC_IMG + '</button>' +
          '<button class="cd-send" onclick="CourseDiscuss.send()">发布</button>' +
        '</div>' +
      '</div>';
  }

  function mount() {
    var wrap = document.getElementById('cdWrap'); if (!wrap) return;
    wrap.innerHTML = panelHtml();
    var ta = document.getElementById('cdTa');
    if (ta) ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); send(); }
    });
  }
  function initLesson() { curIntent = 'q'; mount(); }
  function renderQa() {
    var z = document.getElementById('cd-zone-qa'); if (z) z.innerHTML = qaZoneHtml(getCode());
    var b = document.querySelector('.cd-tab[data-zone="qa"] .cd-badge'); if (b) b.textContent = threadsForCode(getCode()).length;
  }
  function renderFlow() { var z = document.getElementById('cd-zone-flow'); if (z) z.innerHTML = flowHtml(); }

  function switchZone(btn) {
    var z = btn.dataset.zone;
    var tabs = document.querySelectorAll('.cd-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i] === btn);
    document.getElementById('cd-zone-qa').classList.toggle('on', z === 'qa');
    document.getElementById('cd-zone-flow').classList.toggle('on', z === 'flow');
    var body = document.querySelector('.cd-body'); if (body) body.scrollTop = 0;
  }
  function selectIntent(btn) {
    var k = btn.dataset.i, m = INTENT[k]; if (!m) return;
    curIntent = k;
    var chips = document.querySelectorAll('.cd-intent');
    for (var i = 0; i < chips.length; i++) chips[i].classList.toggle('on', chips[i] === btn);
    var ta = document.getElementById('cdTa'); if (ta) ta.placeholder = m.ph;
  }
  function send() {
    var ta = document.getElementById('cdTa'); if (!ta) return;
    var text = (ta.value || '').trim();
    var thumbs = document.getElementById('cdThumbs');
    var hasImg = !!(thumbs && thumbs.children.length);
    if (!text && !hasImg) return;
    var m = INTENT[curIntent];
    if (m.zone === 'qa') {
      addThread(getCode(), text, m.kind, hasImg);
      var qaTab = document.querySelector('.cd-tab[data-zone="qa"]'); if (qaTab) switchZone(qaTab);
      renderQa();
    } else {
      flowAppend.unshift({ user: ME.user, kind: 'good', text: esc(text), img: hasImg, at: Date.now(), stage: stageOf(getCode()) || 1 });
      var flowTab = document.querySelector('.cd-tab[data-zone="flow"]'); if (flowTab) switchZone(flowTab);
      renderFlow();
    }
    ta.value = ''; if (thumbs) thumbs.innerHTML = '';
    ta.focus();
  }
  function addImg() {
    var wrap = document.getElementById('cdThumbs'); if (!wrap || wrap.children.length >= 2) return;
    var d = document.createElement('div'); d.className = 'cd-thumb';
    d.innerHTML = IC_IMG + '<span class="x" onclick="this.parentElement.remove()">×</span>';
    wrap.appendChild(d);
  }
  function toggleReply(id) {
    var box = document.getElementById('cd-rb-' + id); if (!box) return;
    var open = box.style.display !== 'none';
    box.style.display = open ? 'none' : 'flex';
    if (!open) { var i = document.getElementById('cd-ri-' + id); if (i) i.focus(); }
  }
  function sendReply(id) { var i = document.getElementById('cd-ri-' + id); if (i && addReply(id, i.value)) renderQa(); }
  function replyKey(e, id) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); sendReply(id); }
  }
  function promote(id) { setPromoted(id); renderQa(); toast('已发到广场 · 课程讨论'); }

  function toast(text) {
    var t = document.getElementById('cdToast');
    if (!t) {
      t = document.createElement('div'); t.id = 'cdToast';
      t.style.cssText = 'position:fixed;top:72px;left:50%;transform:translateX(-50%);background:var(--teal,#14b8a6);color:#fff;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:300;opacity:0;transition:opacity .25s;box-shadow:0 6px 22px rgba(20,184,166,.3)';
      document.body.appendChild(t);
    }
    t.textContent = text; requestAnimationFrame(function () { t.style.opacity = '1'; });
    clearTimeout(t._h); t._h = setTimeout(function () { t.style.opacity = '0'; }, 1800);
  }

  /* =====================================================================
     视图 2 · 广场「课程讨论」聚合（discuss.html）— 保留
     ===================================================================== */
  var lastPlazaEl = null;
  function clearStage() { if (lastPlazaEl) renderPlaza(lastPlazaEl, {}); }
  function plazaCardHtml(t) {
    var c = course(t.code), title = c ? c.t : t.code, stg = stageOf(t.code), stageName = STAGE_NAME[stg] || '';
    return '<article class="cdx-card">' +
      '<div class="cdx-head"><div class="cdx-av">' + esc(t.user.slice(0, 1)) + '</div>' +
        '<div><div class="cdx-name">' + esc(t.user) + roleTag(t.role) + '</div>' +
        '<div class="cdx-time">' + relTime(t.at) + '</div></div></div>' +
      '<div class="cdx-text">' + esc(t.text) + '</div>' +
      '<div class="cdx-foot">' +
        '<span class="cdx-lesson">' + (stageName ? esc(stageName) + ' · ' : '') + esc(title) + '</span>' +
        '<span class="cdx-meta">💬 ' + t.replyCount + '</span>' +
        '<a class="cdx-go" href="learn.html?code=' + encodeURIComponent(t.code) + '">去这节课 →</a>' +
      '</div>' +
    '</article>';
  }
  function renderPlaza(el, opt) {
    if (!el) return;
    lastPlazaEl = el;
    opt = opt || {};
    var list = promotedThreads(opt.stage || 0), banner = '';
    if (opt.stage) {
      banner = '<div class="cdx-banner">只看 <b>' + esc(STAGE_NAME[opt.stage] || ('阶段' + opt.stage)) +
        '</b> 的课程讨论 · <a onclick="CourseDiscuss.clearStage && CourseDiscuss.clearStage()">看全部</a></div>';
    }
    el.innerHTML = banner + (list.length
      ? list.map(plazaCardHtml).join('')
      : '<div class="cdx-empty">还没有被「发到广场」的课程讨论。<br>学员在课旁讨论里点「发到广场」，就会出现在这里。</div>');
  }

  /* ---------- 样式（注入一次）---------- */
  function injectCSS() {
    if (document.getElementById('cd-style')) return;
    var css =
      '#cdWrap{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}' +
      '.cd-tag{font-size:10px;font-weight:600;padding:1px 6px;border-radius:3px;margin-left:4px;vertical-align:middle;white-space:nowrap}' +
      '.cd-av{width:26px;height:26px;border-radius:50%;background:var(--teal,#14b8a6);color:#fff;display:inline-grid;place-items:center;font-size:11px;font-weight:600;flex:none;vertical-align:middle}' +
      /* 头 + tabs */
      '.cd-tabs{display:flex;gap:18px;padding:13px 16px 0;border-bottom:1px solid var(--border,#e8eaed)}' +
      '.cd-tab{position:relative;background:none;border:none;font-family:inherit;font-size:13px;color:var(--text2,#666);padding:7px 1px;cursor:pointer;font-weight:500}' +
      '.cd-tab .cd-badge{font-size:11px;color:var(--text3,#999);margin-left:4px}' +
      '.cd-tab.on{color:var(--teal-dark,#0d9488);font-weight:700}.cd-tab.on .cd-badge{color:var(--teal,#14b8a6)}' +
      '.cd-tab.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2.5px;border-radius:2px;background:var(--teal,#14b8a6)}' +
      '.cd-body{flex:1;min-height:0;overflow-y:auto;padding:6px 16px 8px}' +
      '.cd-zone{display:none}.cd-zone.on{display:block}' +
      /* 精华 */
      '.cd-star{background:linear-gradient(180deg,#fbf3e2,#fffdf9);border:1px solid #e3c98f;border-radius:11px;padding:11px 14px;margin:8px 0 6px}' +
      '.cd-star-tag{display:inline-block;font-size:10.5px;font-weight:700;color:#fff;background:linear-gradient(135deg,#c89854,#b9863f);padding:2px 8px;border-radius:5px}' +
      '.cd-star-row{display:flex;align-items:center;gap:8px;margin-top:8px}' +
      '.cd-star-nm{font-size:12.5px;font-weight:600;color:var(--text1,#1a1a2e)}' +
      '.cd-star-tx{font-size:13.5px;line-height:1.62;color:#2b3a47;margin-top:7px}' +
      /* 问答 */
      '.cd-qa{padding:12px 2px;border-bottom:1px solid var(--border,#eef1f3)}' +
      '.cd-qa-top{display:flex;align-items:center;gap:8px}' +
      '.cd-qa-id{flex:1;min-width:0;line-height:1.25}' +
      '.cd-qa-nm{font-size:12.5px;font-weight:600;color:var(--text1,#1a1a2e)}' +
      '.cd-qa-tm{font-size:11px;color:var(--text3,#999);margin-left:6px}' +
      '.cd-type{font-size:11px;font-weight:600;color:var(--text3,#9aa6b2);background:none;padding:0;flex:none}' +
      '.cd-qa-tx{font-size:13px;line-height:1.6;color:#55606b;margin:7px 0 0;word-break:break-word}' +
      '.cd-qa-foot{display:flex;align-items:center;gap:12px;margin-top:8px;font-size:11.5px;color:var(--text3,#999)}' +
      '.cd-st{font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:5px}' +
      '.cd-st.ok{color:var(--teal-dark,#0b7c71);background:var(--teal-light,#e6f7f5)}.cd-st.wait{color:#c2742a;background:#fbe9da}' +
      '.cd-act{color:var(--teal,#14b8a6);cursor:pointer;display:inline-flex;align-items:center;gap:4px;text-decoration:none}.cd-act:hover{text-decoration:underline}' +
      '.cd-act svg{width:13px;height:13px}.cd-right{margin-left:auto;color:var(--text3,#9aa6b2)}.cd-right:hover{color:var(--teal,#14b8a6)}' +
      '.cd-promoted{margin-left:auto;color:var(--teal,#14b8a6);opacity:.6}' +
      '.cd-empty{text-align:center;color:var(--text3,#999);font-size:13px;line-height:1.8;padding:30px 16px}.cd-empty b{color:var(--teal,#14b8a6)}' +
      /* 回复 */
      '.cd-replies{margin:8px 0 2px 12px;border-left:2px solid var(--border,#e8eaed);padding-left:11px}' +
      '.cd-reply{font-size:12.5px;line-height:1.5;margin:5px 0}' +
      '.cd-reply-user{font-weight:600;color:var(--text1,#1a1a2e)}.cd-reply-text{color:var(--text2,#666)}.cd-reply-time{color:var(--text3,#999);font-size:11px;margin-left:6px}' +
      '.cd-reply-box{display:flex;gap:6px;margin:8px 0 2px 12px}' +
      '.cd-reply-input{flex:1;min-width:0;border:1px solid var(--border,#e8eaed);border-radius:7px;padding:6px 10px;font-size:12.5px;font-family:inherit;outline:none}.cd-reply-input:focus{border-color:var(--teal,#14b8a6)}' +
      '.cd-reply-send{background:var(--teal,#14b8a6);color:#fff;border:none;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;flex:none}' +
      /* 本章动态 */
      '.cd-flow-head{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2,#666);background:var(--bg,#f7f8fa);border-radius:9px;padding:8px 12px;margin:8px 0 4px}' +
      '.cd-live{width:7px;height:7px;border-radius:50%;background:#22c55e;flex:none;animation:cdBeat 2s infinite}' +
      '@keyframes cdBeat{0%,100%{opacity:1}50%{opacity:.35}}' +
      '.cd-flow-head b{color:var(--text1,#1a1a2e);font-weight:600}' +
      '.cd-fl{display:flex;gap:9px;padding:9px 2px;border-bottom:1px solid var(--border,#eef1f3)}' +
      '.cd-fl-bd{flex:1;min-width:0}' +
      '.cd-fl-l1{font-size:12.5px;line-height:1.5;color:var(--text1,#1a1a2e)}.cd-fl-l1 b{font-weight:600}' +
      '.cd-good{color:var(--teal-dark,#0d9488)}.cd-link{color:var(--teal,#14b8a6);font-weight:600;cursor:pointer}' +
      '.cd-fl-tm{font-size:10.5px;color:var(--text3,#999);margin-top:2px}' +
      /* 发布框 */
      '.cd-comp{flex:none;border-top:1px solid var(--border,#e8eaed);padding:9px 14px 11px;background:var(--white,#fff)}' +
      '.cd-intents{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px}' +
      '.cd-intent{font-size:11.5px;color:var(--text2,#666);background:var(--bg,#f7f8fa);border:1px solid var(--border,#e8eaed);border-radius:7px;padding:4px 9px;cursor:pointer;font-family:inherit;transition:.14s}' +
      '.cd-intent:hover{border-color:var(--teal,#14b8a6);color:var(--teal-dark,#0d9488)}' +
      '.cd-intent.on{background:var(--teal,#14b8a6);color:#fff;border-color:var(--teal,#14b8a6);font-weight:600}' +
      '.cd-ta{width:100%;border:1px solid var(--border,#e8eaed);background:var(--bg,#f7f8fa);border-radius:9px;padding:8px 11px;font-family:inherit;font-size:12.5px;color:var(--text1,#1a1a2e);outline:none;resize:none;height:34px;line-height:1.4;transition:.15s}' +
      '.cd-ta:focus{background:#fff;border-color:var(--teal,#14b8a6);height:52px}' +
      '.cd-comp-bar{display:flex;align-items:center;gap:9px;margin-top:8px}' +
      '.cd-img{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border,#e8eaed);background:var(--bg,#f7f8fa);border-radius:8px;color:var(--text2,#666);cursor:pointer;flex:none;padding:0}' +
      '.cd-img:hover{border-color:var(--teal,#14b8a6);color:var(--teal-dark,#0d9488)}.cd-img svg{width:16px;height:16px}' +
      '.cd-thumbs{display:flex;gap:6px;flex-wrap:wrap;margin:7px 0 0}' +
      '.cd-thumb{position:relative;width:46px;height:46px;border-radius:7px;background:var(--bg,#f7f8fa);border:1px solid var(--border,#e8eaed);display:grid;place-items:center;color:var(--text3,#999)}.cd-thumb svg{width:18px;height:18px}' +
      '.cd-thumb .x{position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:#1a1a2e;color:#fff;font-size:11px;line-height:1;display:grid;place-items:center;cursor:pointer}' +
      '.cd-qa-img{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:8px 12px;background:var(--bg,#f7f8fa);border:1px solid var(--border,#e8eaed);border-radius:8px;font-size:11.5px;color:var(--text3,#999)}.cd-qa-img svg{width:15px;height:15px}' +
      '.cd-fl-img{display:inline-flex;align-items:center;gap:5px;margin-top:5px;padding:4px 9px;background:var(--bg,#f7f8fa);border:1px solid var(--border,#e8eaed);border-radius:7px;font-size:11px;color:var(--text3,#999)}.cd-fl-img svg{width:13px;height:13px}' +
      '.cd-send{margin-left:auto;background:var(--teal,#14b8a6);color:#fff;border:none;font-size:12.5px;font-weight:600;padding:7px 16px;border-radius:8px;cursor:pointer}.cd-send:hover{background:var(--teal-dark,#0d9488)}' +
      /* 广场聚合卡片（discuss.html）*/
      '.cdx-banner{font-size:13px;color:var(--deep-blue,#1a2942);background:rgba(13,148,136,.07);border:1px solid rgba(13,148,136,.3);border-radius:10px;padding:9px 14px;margin-bottom:12px}' +
      '.cdx-banner a{color:var(--teal,#0d9488);cursor:pointer;margin-left:2px}' +
      '.cdx-card{background:#fff;border:1px solid var(--border,#e6ebee);border-radius:12px;padding:15px 18px;margin-bottom:12px}' +
      '.cdx-head{display:flex;align-items:center;gap:10px;margin-bottom:9px}' +
      '.cdx-av{width:34px;height:34px;border-radius:50%;background:var(--teal,#0d9488);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:600;flex:none}' +
      '.cdx-name{font-size:13.5px;font-weight:600;color:var(--text1,#1a2230)}' +
      '.cdx-time{font-size:11.5px;color:var(--text3,#9aa6b2)}' +
      '.cdx-text{font-size:14px;line-height:1.6;color:var(--text2,#41505e);margin-bottom:11px}' +
      '.cdx-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:12.5px}' +
      '.cdx-lesson{background:var(--teal-light,#e8f6f5);color:var(--teal-dark,#0b7c71);padding:3px 9px;border-radius:6px}' +
      '.cdx-meta{color:var(--text3,#9aa6b2)}' +
      '.cdx-go{margin-left:auto;color:var(--teal,#0d9488);text-decoration:none;font-weight:600;white-space:nowrap}.cdx-go:hover{text-decoration:underline}' +
      '.cdx-empty{text-align:center;color:var(--text3,#9aa6b2);font-size:13.5px;line-height:1.7;padding:44px 20px}';
    var s = document.createElement('style'); s.id = 'cd-style'; s.textContent = css; document.head.appendChild(s);
  }
  injectCSS();

  /* ---------- 导出 ---------- */
  global.CourseDiscuss = {
    ME: ME,
    initLesson: initLesson,
    renderQa: renderQa,
    renderFlow: renderFlow,
    renderPlaza: renderPlaza,
    clearStage: clearStage,
    switchZone: switchZone,
    selectIntent: selectIntent,
    send: send,
    addImg: addImg,
    toggleReply: toggleReply,
    sendReply: sendReply,
    replyKey: replyKey,
    promote: promote,
    promotedThreads: promotedThreads,
    threadsForCode: threadsForCode
  };
})(window);
