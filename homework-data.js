/* ============================================================
   homework-data.js · 作业 / 助教工作台 共享数据契约（原型 · localStorage）
   三处存储，按「作业 id」串起来：
     ds_submissions  学员提交  [{id,stage,title,desc,images[],link,public,submittedAt}]
     ds_ta_claims    教练认领  {[id]:{by,at}}                                  → 学员看到「评阅中」
     ds_ta_handled   批改结果  {[id]:{type,reply,shots[],resolver,resolvedAt}} → 学员看到「已完成」
   状态优先级：已完成 > 评阅中 > 待批改（已提交未认领）；待提交 = 还没交（无 submission）
   接真实后端时：把这里的 load/save 换成接口，页面与工作台都不用动。
   ============================================================ */
(function (global) {
  var K = { sub: 'ds_submissions', claim: 'ds_ta_claims', handled: 'ds_ta_handled', seeded: 'ds_hw_seeded' };

  function rd(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function nowStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  var STAGES = { 1: '第一岛 · 新手起航', 2: '第二岛 · AI 编程进阶', 3: '第三岛 · 智能体实战', 4: '第四岛 · 商业化与增长' };

  /* 四态徽标（cls 对应 shared.css 的 .st--*）*/
  var STATUS = {
    todo:   { key: 'todo',   label: '待提交', cls: 'st--todo' },
    review: { key: 'review', label: '待批改', cls: 'st--review' },
    doing:  { key: 'doing',  label: '评阅中', cls: 'st--doing' },   /* 教练已认领、批改中 */
    done:   { key: 'done',   label: '已完成', cls: 'st--done' }
  };

  /* 各岛作业题（提交页页头 + 个人中心「待提交」占位都用它）*/
  var ASSIGNMENTS = {
    1: { stage: 1, title: '写一段你与 AI 协作的小故事', optional: true, brief: '记录一次你和 AI 配合做成一件事的经过，文字为主、可附图。可暂不做，不计入解锁。' },
    2: { stage: 2, title: '做一个属于你的 AI 产品 Landing Page', brief: '用本阶段学到的 Prompt 拆解与组件化思路，做一个能跑通的产品落地页；写下思路、贴关键截图与线上作品链接即可。可暂不做。' },
    3: { stage: 3, title: '做一个能跑通的智能体 / Agent', brief: '用知识库 + 工具调用，做一个能解决具体场景的小 Agent，贴上体验链接与截图。可暂不做。' },
    4: { stage: 4, title: '你的产品增长实验', brief: '给已上线的产品做一次增长动作，展示前后的数据变化与复盘。可暂不做。' }
  };

  function subId(s) { return s.id || ('real-' + s.stage); }
  function loadSubs() { return rd(K.sub, []); }
  function saveSubs(a) { return wr(K.sub, a); }
  function loadClaims() { return rd(K.claim, {}); }
  function saveClaims(c) { return wr(K.claim, c); }
  function loadHandled() { return rd(K.handled, {}); }
  function saveHandled(h) { return wr(K.handled, h); }

  /* 由三处存储推导某条提交的状态 key */
  function statusKey(s) {
    var id = subId(s);
    if (loadHandled()[id]) return 'done';
    if (loadClaims()[id]) return 'doing';
    return 'review';
  }
  function handledOf(s) { return loadHandled()[subId(s)] || null; }
  function claimOf(s) { return loadClaims()[subId(s)] || null; }

  function addSubmission(sub) {
    var a = loadSubs();
    sub.id = sub.id || ('hw-' + Date.now());
    if (!sub.submittedAt) sub.submittedAt = nowStr();
    var i = -1;
    for (var k = 0; k < a.length; k++) { if (subId(a[k]) === subId(sub)) { i = k; break; } }
    if (i >= 0) a[i] = sub; else a.unshift(sub);
    saveSubs(a);
    return sub;
  }
  function getSub(id) { var a = loadSubs(); for (var i = 0; i < a.length; i++) { if (subId(a[i]) === id) return a[i]; } return null; }

  /* 个人中心列表：真实提交（含推导状态，按提交时间倒序）+ 未交作业（待提交占位）*/
  function profileList() {
    var subs = loadSubs().slice().sort(function (a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); });
    var items = subs.map(function (s) { return { kind: 'sub', sub: s, status: statusKey(s), stage: s.stage }; });
    var hasStage = {};
    subs.forEach(function (s) { hasStage[s.stage] = true; });
    Object.keys(ASSIGNMENTS).forEach(function (k) {
      if (!hasStage[k]) items.push({ kind: 'todo', assignment: ASSIGNMENTS[k], status: 'todo', stage: +k });
    });
    return items;
  }

  /* 演示种子：给「我」几条覆盖 已完成 / 评阅中 / 待批改 的作业（待提交由空缺的岛自然产生）*/
  function seedOnce() {
    if (rd(K.seeded, false)) return;
    if (loadSubs().length) { wr(K.seeded, true); return; }   /* 用户已有真实数据则不塞种子 */
    var subs = [
      { id: 'hw-seed-1', stage: 2, title: '我的第一个 AI 落地页：HabitOcean', public: false, submittedAt: '2026-06-04 21:08',
        desc: '这个落地页用 Claude 拆了 3 个核心模块：Hero、功能区、价格表。先让模型按「价值主张 → 证据 → 行动」生成文案骨架，再手动收敛了用词。',
        images: ['https://picsum.photos/seed/ocean1/480/320', 'https://picsum.photos/seed/ocean2/480/320'], link: 'https://habitocean.deepsea.app' },
      { id: 'hw-seed-2', stage: 2, title: '用 Prompt 工作流重写我的简历', public: true, submittedAt: '2026-06-05 08:40',
        desc: '把简历拆成「岗位匹配 - 量化结果 - 关键词」三层，让模型逐层改写，再人工定稿。', images: [], link: 'https://resume.deepsea.app' },
      { id: 'hw-seed-3', stage: 3, title: '给小区做了个垃圾分类问答 Agent', public: true, submittedAt: '2026-06-05 09:30',
        desc: '用知识库 + 工具调用，接了本地的分类规则，附上了体验链接和截图。', images: ['https://picsum.photos/seed/agent1/480/320'], link: 'https://trash-agent.deepsea.app' }
    ];
    saveSubs(subs);
    var handled = loadHandled();
    handled['hw-seed-1'] = { type: 'a', reply: '整体结构很清晰，Hero 的价值主张一句话就立住了，价格表三档划分也合理。两个建议：① 功能区三段文案句式太接近，挑一段用「场景化」写法增加节奏；② 首屏大图压一下，加载会更快。继续保持，下个岛见 ⚓', shots: ['https://picsum.photos/seed/fbshot/640/300'], resolver: '林助教', resolvedAt: '2026-06-05 10:22' };
    saveHandled(handled);
    var claims = loadClaims();
    claims['hw-seed-2'] = { by: '林助教', at: '2026-06-05' };
    saveClaims(claims);
    wr(K.seeded, true);
  }

  /* ?reset=1 / ?fresh=1：清空作业演示数据并重置种子（学员页与工作台共用）*/
  function maybeReset() {
    var p = new URLSearchParams(location.search);
    if (p.get('reset') === '1' || p.get('fresh') === '1') {
      [K.sub, K.claim, K.handled, K.seeded].forEach(function (k) { localStorage.removeItem(k); });
    }
  }

  global.HW = {
    STAGES: STAGES, STATUS: STATUS, ASSIGNMENTS: ASSIGNMENTS,
    subId: subId, loadSubs: loadSubs, saveSubs: saveSubs, loadClaims: loadClaims, saveClaims: saveClaims, loadHandled: loadHandled, saveHandled: saveHandled,
    statusKey: statusKey, handledOf: handledOf, claimOf: claimOf,
    addSubmission: addSubmission, getSub: getSub, profileList: profileList,
    seedOnce: seedOnce, maybeReset: maybeReset, esc: esc, nowStr: nowStr
  };
})(window);
