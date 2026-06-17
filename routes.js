/* ============================================================
   定制学习路线 · 数据（routes.js）— 11 条专属航线（+ 全量主线 = 共 12 条）
   来源：① 现有 4 条「5 天体验课」教学方案（小程序/网站/AI员工/找方向，已并成 4 岛）；
        ② 第三期《实战手册》77 节（新方向，取真实节名）。
   设计依据：docs/plans/2026-06-08-学习路线文本框架-design.md

   - type 三种，对应已写好的渲染器：
       course → 图文（需 code / t / mins）
       live   → 直播（需 title / date / time）
       task   → 作业（需 title / desc）
   - 每岛 flow 是「显式顺序」：图文 → 直播 → 图文 → 作业。
   - 解锁口径：只数 type==='course'（图文）；直播 / 作业不计入。courseCount = 该路线图文总数。
   - ⚠️ 原则：flow 里每个 course = 一个真实课节（不把一节拆成假小节）；实战手册类方向手册节较粗，故图文数偏少，是真实情况、非遗漏。
   - ⚠️ 所有 live 的 date/time/title 为占位，等真实直播场次给到再替换。
   - ⚠️ mins：体验课方向沿用教学方案估时；实战手册方向取卡片「预估耗时」。项目周期型节（如实战）以说明为准。
   - 货架分类见 routes-ui.js 的 OPTS 分组。
   ============================================================ */
const ROUTES = {

  /* ============ 产品类 ============ */

  /* ===== 开发一个小程序（小程序体验课 · 4 岛）===== */
  miniprogram: {
    key: 'miniprogram', name: '开发一个小程序',
    promise: '从 0 到一个能上线、能变现的微信小程序',
    courseCount: 18,
    /* 往期直播回放（小鹅通真实场次）；按内容归到本路线 */
    lives: [
      { t:'小程序制作与流量经验分享', date:'2026-05-18', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a0acc80e4b0694c350aaad7?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'用扣子 5 分钟做出 demo', title:'用扣子 5 分钟做出 demo',
        output:'1 个扣子 demo + 一张"小程序方向卡"',
        flow:[
          { type:'course', code:'MP1.1', t:'为什么现在该做小程序', mins:8 },
          { type:'course', code:'MP1.2', t:'小程序的钱从哪来', mins:7 },
          { type:'course', code:'MP1.3', t:'实操：用扣子编程 5 分钟跑出一个 demo', mins:20 },
          { type:'task',   title:'交一张"小程序方向卡"', desc:'写下你的方向 + 核心功能一句话' },
        ] },
      { day:2, zone:'开账号、配齐开发工位', title:'开账号 · 领羊毛 · 配工位',
        output:'微信账号 + AI 计划资格 + 云开发 三项激活',
        flow:[
          { type:'course', code:'MP2.1', t:'进阶篇前言：从扣子毕业、上手 TRAE CN', mins:6 },
          { type:'course', code:'MP2.2', t:'注册微信小程序账号（个人主体最快路径）', mins:12 },
          { type:'course', code:'MP2.3', t:'白嫖"微信 AI 小程序成长计划"', mins:8 },
          { type:'live',   title:'直播营地 · 小程序冷启动 & 配工位答疑', date:'2026-06-18', time:'20:00' },
          { type:'course', code:'MP2.4', t:'开通微信云开发（你的免费后端）', mins:12 },
          { type:'task',   title:'发 3 张激活凭证截图', desc:'账号 / AI 计划 / 云开发，各一张' },
        ] },
      { day:3, zone:'用 AI 写核心功能、真机调试', title:'用 AI 写核心 + 真机调优',
        output:'一个真机能跑、体验通顺的小程序',
        flow:[
          { type:'course', code:'MP3.1', t:'TRAE CN + Taro 是什么、怎么配合', mins:10 },
          { type:'course', code:'MP3.2', t:'创建 Taro 项目 + 跑通本地预览', mins:15 },
          { type:'course', code:'MP3.3', t:'让 AI 开发你的核心功能（如 SBTI 测试逻辑）', mins:25 },
          { type:'course', code:'MP4.1', t:'用微信开发者工具做真机预览（手机扫码）', mins:15 },
          { type:'course', code:'MP4.2', t:'测核心流程：首页 → 核心功能 → 结果页', mins:15 },
          { type:'live',   title:'直播营地 · 上线前体验优化必改', date:'2026-06-25', time:'20:00' },
          { type:'course', code:'MP4.3', t:'从 SBTI 出发，做更多测试类小程序', mins:15 },
          { type:'task',   title:'真机录屏走一遍核心流程', desc:'手机实拍，证明能跑' },
        ] },
      { day:4, zone:'备案、上线、接广告与订阅', title:'启动备案 + 规划上线变现',
        output:'备案启动 + 一份 30 天上线行动清单',
        flow:[
          { type:'course', code:'MP5.1', t:'备案要 7-21 天 + 审核流程 + 变现路径', mins:10 },
          { type:'course', code:'MP5.2', t:'启动微信小程序备案（提交主体信息）', mins:20 },
          { type:'course', code:'MP5.3', t:'审核上线全流程', mins:12 },
          { type:'live',   title:'直播营地 · 变现与增长 0→500 UV', date:'2026-07-02', time:'20:00' },
          { type:'course', code:'MP5.4', t:'变现：广告 + 订阅双引擎', mins:12 },
          { type:'course', code:'MP5.5', t:'增长：从 0 到 500 UV + 避坑指南', mins:15 },
          { type:'task',   title:'交备案截图 + 你的 30 天上线行动清单', desc:'含审核跟进、广告/订阅开通时机、增长动作' },
        ] },
    ],
  },

  /* ===== 上线你的第一个网站（AI 网站体验课 · 4 岛）===== */
  aiwebsite: {
    key: 'aiwebsite', name: '上线你的第一个网站',
    promise: '从认识 AI 到上线一个真正的 AI 网页工具',
    courseCount: 13,
    /* 往期直播回放（小鹅通真实场次，spu_id → /v4/course/alive/）；按内容归到本路线 */
    lives: [
      { t:'刘小排：高强度学习期开营直播', date:'2025-10-30', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69031d42e4b0694ca137af19?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'刘小排：内功篇导学', date:'2025-11-03', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69087d4ae4b0694c5b487adb?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'刘小排：订阅支付的原理 & 使用脚手架加快开发', date:'2025-11-11', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69130af7e4b0694ca140acae?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'刘小排：流量篇导读', date:'2025-11-26', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69266b93e4b0694ca14b27fa?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'章晗：0 基础使用刘小排课程的最佳攻略', date:'2025-12-03', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_692ff8e1e4b0694ca150d723?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'陈江河：0 基础 131 天跑通闭环，我做了些什么', date:'2025-12-29', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69523754e4b0694ca1625eaa?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'小辉：拆解竞品 + 跑通模板，从分析到动手', date:'2026-02-04', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6982b851e4b0694c34d70595?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'小辉：让网站能登录、能存图、能接更多模型', date:'2026-02-05', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69843f9ae4b0694c34d7b609?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'刘小排：快速入门串讲 + 答疑', date:'2026-03-30', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69ca24dbe4b0694c5ba4a959?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'井然：土木哥 AI 出海实录，从 0 到月入几万刀', date:'2026-04-07', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69d4da09e4b0694c34f5a573?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'刘小排：核心技术概念密集输入', date:'2026-04-13', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69dce299e4b0694c5bae870a?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'发布正式产品', date:'2026-05-11', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a017c5ae4b0694c3506d86e?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'从个人到 3-5 人小工作室：搭建流程及避坑', date:'2026-05-12', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a02c882e4b0694c35076610?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'商单入门：怎么接、怎么定价、怎么谈', date:'2026-06-08', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a262256e4b0694c5bd25a34?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'认识 AI：把它当超级实习生', title:'认识你的"超级实习生"',
        output:'一张"我和 AI 的关系卡" + 你的北极星目标',
        flow:[
          { type:'course', code:'AW1.1', t:'AI 到底是什么？它就是个超级实习生', mins:15 },
          { type:'course', code:'AW1.2', t:'这个实习生的特点 + 能干什么 / 不能干什么', mins:15 },
          { type:'task',   title:'写一张"我和 AI 的关系卡"', desc:'再写下"我想做出什么"当北极星' },
        ] },
      { day:2, zone:'用扣子做出第一个网页', title:'10 分钟做出你的第一个网站',
        output:'一个上线的网站 + 朋友的第一条反馈',
        flow:[
          { type:'course', code:'AW2.1', t:'扣子编程是什么 / 为什么用它入门', mins:10 },
          { type:'course', code:'AW2.2', t:'实操：想一个 idea，让扣子编程做出来', mins:20 },
          { type:'live',   title:'直播营地 · 第一个网站打磨答疑', date:'2026-06-13', time:'20:00' },
          { type:'course', code:'AW2.3', t:'继续打磨：文案 / 配色 / 加功能，分享给朋友', mins:20 },
          { type:'task',   title:'贴出你的网站链接 + 朋友的第一条反馈', desc:'真实分享给至少 1 个朋友' },
        ] },
      { day:3, zone:'学会给 AI 写需求（SPEC）', title:'跟 AI 讨论需求 · 写出第一份 SPEC',
        output:'一份打磨过、可复用的 SPEC 文档',
        flow:[
          { type:'course', code:'AW3.1', t:'不是聊天，是管理实习生 + 一份好 SPEC 长什么样', mins:15 },
          { type:'course', code:'AW3.2', t:'信息不是越多越好 + 歧义是最贵的 Bug', mins:10 },
          { type:'course', code:'AW3.3', t:'实操：选个小产品，写出第 1 版 SPEC', mins:20 },
          { type:'task',   title:'交一份打磨过的 SPEC 文档', desc:'标清目标用户 / 核心功能 / 边界' },
        ] },
      { day:4, zone:'用积木思维做出并装修网页工具', title:'积木思维 + 实战做出网页工具',
        output:'一个上线的"黑话翻译器"（或同类小产品）',
        flow:[
          { type:'course', code:'AW4.1', t:'三种产品三个时代 + 用 AI 做 ≠ AI 产品', mins:15 },
          { type:'course', code:'AW4.2', t:'4 块 8 的酸菜鱼为什么卖 48 + AI 能力积木', mins:15 },
          { type:'live',   title:'直播营地 · 积木拆解工作坊', date:'2026-06-17', time:'20:00' },
          { type:'course', code:'AW4.3', t:'实操：用积木思维拆解 3 个常见 AI 产品', mins:20 },
          { type:'course', code:'AW5.1', t:'实操：用 SPEC + 积木思维让 AI 做出"黑话翻译器"', mins:30 },
          { type:'course', code:'AW5.2', t:'给产品装修：配色 / 文案 / 配图 / 域名', mins:15 },
          { type:'task',   title:'交你的"黑话翻译器"上线链接', desc:'能打开、能用即可' },
        ] },
    ],
  },

  /* ===== 做出一个小游戏（实战手册 M2+M9 · 4 岛；M9 深课按内部真实阶段拆成岛②③④）===== */
  minigame: {
    key: 'minigame', name: '做出一个小游戏',
    promise: '做一个能在群里疯传的微信小游戏（难度偏高，建议有点底子）',
    courseCount: 5,
    islands: [
      { day:1, zone:'前置：用扣子做两个产品练手', title:'用扣子做两个 AI 产品打手感',
        output:'两个扣子做的小产品',
        flow:[
          { type:'course', code:'MG1.1', t:'动手开发第一个 AI 产品：互联网黑话翻译器', mins:30 },
          { type:'course', code:'MG1.2', t:'难度升级：第二个 AI 产品：哄哄模拟器（代入感增强版）', mins:45 },
          { type:'task',   title:'交一个扣子做出来的小产品', desc:'能打开、能玩即可' },
        ] },
      { day:2, zone:'拆透爆款、HTML5 验玩法', title:'拆解爆款 + 单文件原型验玩法',
        output:'一个 HTML5 单文件玩法原型',
        flow:[
          { type:'course', code:'MG2.1', t:'做个能群传的 AI 小游戏①：拆透"羊了个羊"的成瘾设计，用 HTML5 单文件原型快速验玩法', mins:80 },
          { type:'task',   title:'交一个 HTML5 玩法原型', desc:'核心玩法能玩、自己验证好不好玩' },
        ] },
      { day:3, zone:'搬进 Cocos 正式开发', title:'搬进 Cocos、调手感与数值',
        output:'一个 Cocos 正式开发的小游戏',
        flow:[
          { type:'course', code:'MG2.2', t:'做个能群传的 AI 小游戏②：搬进 Cocos Creator 正式开发，调手感 / 数值 / 美术', mins:100 },
          { type:'live',   title:'直播营地 · 小游戏玩法打磨答疑', date:'2026-07-05', time:'20:00' },
          { type:'task',   title:'交 Cocos 开发版小游戏', desc:'手感、数值调到能玩' },
        ] },
      { day:4, zone:'导出、接广告、审核上架', title:'导出小游戏 + 接广告 + 上架',
        output:'一个上架、能群传的小游戏',
        flow:[
          { type:'course', code:'MG2.3', t:'做个能群传的 AI 小游戏③：一键导出微信小游戏、接激励视频广告、资质审核 + 备案上架', mins:60 },
          { type:'task',   title:'交你的小游戏上架链接', desc:'通过审核、能在微信里玩' },
        ] },
    ],
  },

  /* ===== 开发一款手机 App（实战手册 M9 · 3 岛；M9 深课按"做出 / 上架 / 变现"拆开；前置需 React）===== */
  app: {
    key: 'app', name: '开发一款手机 App',
    promise: '把产品搬上手机、上架商店（前置：会 React / 走过"网站"）',
    courseCount: 3,
    islands: [
      { day:1, zone:'用 Expo 做出 App', title:'用 AI 做出你的手机 App',
        output:'一个真机能跑起来的 App',
        flow:[
          { type:'course', code:'APP1.1', t:'用 AI 开发手机 App①：三条路取舍（PWA / 扣子 / Expo）→ Expo 建项目 + 真机预览 + AI 写界面', mins:70 },
          { type:'task',   title:'真机跑通你的 App 界面', desc:'核心界面能在手机上跑' },
        ] },
      { day:2, zone:'云打包、提交应用商店', title:'云打包 + 提交应用商店',
        output:'一个提交了商店审核的 App',
        flow:[
          { type:'course', code:'APP1.2', t:'用 AI 开发手机 App②：EAS Build 云打包、注册开发者账号、提交 App Store / Google Play', mins:50 },
          { type:'live',   title:'直播营地 · App 上架 & 商店配置答疑', date:'2026-07-08', time:'20:00' },
          { type:'task',   title:'截图你的商店提交记录', desc:'走完云打包 + 提交流程' },
        ] },
      { day:3, zone:'接内购订阅与广告变现', title:'App 变现的三条路',
        output:'App 内接通一条变现路径',
        flow:[
          { type:'course', code:'APP2.1', t:'用户付了钱，你怎么收？App 变现的三条路（RevenueCat 内购订阅 + AdMob 激励视频 + 外部支付）', mins:90 },
          { type:'task',   title:'接通内购订阅或激励视频之一', desc:'能跑通一次付费 / 看广告即可' },
        ] },
    ],
  },

  /* ============ AI 员工类 ============ */

  /* ===== 搭建你的 AI 员工（AI 员工体验课 · 4 岛 · 总纲）===== */
  aiemployee: {
    key: 'aiemployee', name: '搭建你的 AI 员工',
    promise: '从"用 AI 工具"升级到"让 AI 替你自动干活"',
    courseCount: 15,
    /* 往期直播回放（小鹅通真实场次）；按内容归到本路线 */
    lives: [
      { t:'把 AI 当员工', date:'2026-05-26', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a156747e4b0694c5bca5bd2?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'认知：把 AI 当员工，不是工具', title:'认知升级 · AI 是员工',
        output:'一份"AI 员工岗位清单"',
        flow:[
          { type:'course', code:'AE1.1', t:'反直觉场景：你关电脑后 AI 在做什么', mins:10 },
          { type:'course', code:'AE1.2', t:'带员工的 3 种方式 + 你属于哪一种', mins:10 },
          { type:'course', code:'AE1.3', t:'三层配置 + AI 员工和人类员工的关键区别', mins:15 },
          { type:'task',   title:'交一份"AI 员工岗位清单"', desc:'列 3 件能托管给 AI 的重复事 + 优先级' },
        ] },
      { day:2, zone:'用桌面工具不写代码让 AI 交付', title:'Cowork/Codex · 不看代码让 AI 干活',
        output:'1 次"不写代码让 AI 完成任务"的真实记录',
        flow:[
          { type:'course', code:'AE2.1', t:'这一节核心就一句话：不看代码、直接交付结果', mins:10 },
          { type:'course', code:'AE2.2', t:'4 个工具站：Codex Desktop / Claude Cowork / Computer Use / 国产替代', mins:15 },
          { type:'live',   title:'直播营地 · 工具选型 & 装机答疑', date:'2026-06-12', time:'20:00' },
          { type:'course', code:'AE2.3', t:'实操：用选定工具让 AI 完成 1 件主线小事（不写代码）', mins:25 },
          { type:'task',   title:'交 1 次"不写代码让 AI 完成任务"的截图/录屏', desc:'证明 AI 真的替你干成了' },
        ] },
      { day:3, zone:'配浏览器自动化、写 AI 的 SOP', title:'浏览器自动化 + 写第一份 SKILL.md',
        output:'1 个跑通的浏览器自动化任务 + 一份 SKILL.md',
        flow:[
          { type:'course', code:'AE3.1', t:'别人用浏览器自动化在干啥 + 推荐三个工具', mins:15 },
          { type:'course', code:'AE3.2', t:'什么工作适合浏览器自动化 + 上手路径', mins:10 },
          { type:'course', code:'AE3.3', t:'实操：用浏览器自动化完成 1 个浏览器场景任务', mins:25 },
          { type:'course', code:'AE4.1', t:'认识了零件，还没学会开车 + Hook 长什么样', mins:10 },
          { type:'course', code:'AE4.2', t:'一份真在跑的 SKILL.md 范例 + 黄金模板', mins:15 },
          { type:'live',   title:'直播营地 · SKILL.md 共写工作坊', date:'2026-06-19', time:'20:00' },
          { type:'course', code:'AE4.3', t:'实操：基于主线任务，写出你的第一份 SKILL.md', mins:25 },
          { type:'task',   title:'交一份属于自己的 SKILL.md', desc:'让 AI 照着就能复现你的工作方式' },
        ] },
      { day:4, zone:'组队：多个 AI 协作端到端跑通', title:'从一个员工到一支团队',
        output:'一次端到端跑通的 AI 员工任务 + 完整配置包',
        flow:[
          { type:'course', code:'AE5.1', t:'把任务拆成链：4 个 SKILL 协作 + AGENTS.md 一份通三家', mins:10 },
          { type:'course', code:'AE5.2', t:'一个万能框架 + 8 个电商自动化方向参考', mins:6 },
          { type:'course', code:'AE5.3', t:'实操：Cowork + 浏览器自动化 + SKILL.md 组合，端到端跑一次', mins:25 },
          { type:'task',   title:'交一次端到端跑通的 AI 员工任务 + 配置包', desc:'三个产物组合成一条能自动跑的链' },
        ] },
    ],
  },

  /* ===== 让 AI 替你跑自媒体（实战手册 M10+M5 · 3 岛；小龙虾=OpenClaw）===== */
  automedia: {
    key: 'automedia', name: '让 AI 替你跑自媒体',
    promise: '把公众号 / Twitter 内容运营托管给 AI，自动发、自动涨粉',
    courseCount: 5,
    islands: [
      { day:1, zone:'打地基：浏览器自动化 + 写 SOP', title:'先让 AI 会"上手干"',
        output:'1 个跑通的浏览器自动化 + 一份 SKILL',
        flow:[
          { type:'course', code:'AM1.1', t:'浏览器自动化专项', mins:35 },
          { type:'course', code:'AM1.2', t:'怎么教 AI 学会你的工作方式？Skills 和 SOP 的正确用法', mins:80 },
          { type:'task',   title:'交 1 个跑通的浏览器自动化任务', desc:'端到端能自动跑完' },
        ] },
      { day:2, zone:'认识并配好小龙虾（OpenClaw）', title:'在飞书里指挥 AI 干活',
        output:'一个配好独立工位的小龙虾',
        flow:[
          { type:'course', code:'AM2.1', t:'OpenClaw：用飞书指挥 AI 干活，像使唤真人一样', mins:100 },
          { type:'live',   title:'直播营地 · 小龙虾配置 & 内容托管答疑', date:'2026-07-10', time:'20:00' },
          { type:'task',   title:'配好你的小龙虾（独立账号 / 权限 / 日报）', desc:'飞书里 @ 它能干活即可' },
        ] },
      { day:3, zone:'让 AI 托管账号、定时自动发', title:'实战托管 + 定时自动跑',
        output:'一个自动跑你自媒体的 AI',
        flow:[
          { type:'course', code:'AM3.1', t:'实战：真正拥有自己的 AI 员工（自媒体内容托管方向）', mins:180 },
          { type:'course', code:'AM3.2', t:'定时任务：你睡了，产品还能自己干活', mins:60 },
          { type:'task',   title:'让 AI 自动跑你的自媒体一周', desc:'记录它发了什么、数据如何' },
        ] },
    ],
  },

  /* ===== 搭一套自动化工作流（实战手册 M10+M5 · 3 岛）===== */
  workflow: {
    key: 'workflow', name: '搭一套自动化工作流',
    promise: '把一件多步骤的重复活，做成 AI 全自动流水线',
    courseCount: 4,
    islands: [
      { day:1, zone:'拆流程、配自动化工具', title:'先自己走一遍、拆成最小步骤',
        output:'一条拆好的流程 + 配好的工具',
        flow:[
          { type:'course', code:'WF1.1', t:'先自己走一遍流程、拆成最小步骤', mins:35 },
          { type:'task',   title:'拆解你要自动化的一条流程', desc:'写出最小步骤清单' },
        ] },
      { day:2, zone:'把流程封装成可复用 Skill', title:'封装成可触发的 Skill',
        output:'一个可复用的 Skill',
        flow:[
          { type:'course', code:'WF2.1', t:'怎么教 AI 学会你的工作方式？Skills 和 SOP 的正确用法', mins:80 },
          { type:'task',   title:'把流程封装成一个 Skill', desc:'换参数就能复用' },
        ] },
      { day:3, zone:'串成链、定时无人值守跑', title:'串链 + 定时自动跑',
        output:'一条无人值守、自动跑的工作流',
        flow:[
          { type:'course', code:'WF3.1', t:'AI 团队架构进阶：从 1 个 AI 到一支编队（多 Agent 编排）', mins:25 },
          { type:'course', code:'WF3.2', t:'定时任务：无人值守自动跑', mins:60 },
          { type:'task',   title:'跑通一条端到端自动化链', desc:'定时触发、无人值守跑完' },
        ] },
    ],
  },

  /* ============ 技能武器类 ============ */

  /* ===== 学习 Claude Code（实战手册 M6 · 2 岛；M6 深课按"认识 / 搭配置"拆开）===== */
  claudecode: {
    key: 'claudecode', name: '学习 Claude Code',
    promise: '从"AI 住在编辑器"升级到"AI 住在终端"，用对话驱动写码 / 部署',
    courseCount: 2,
    /* 往期直播回放（小鹅通真实场次）；按内容归到本路线 */
    lives: [
      { t:'码叔编程：新手编程避坑指南', date:'2026-01-12', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6964b03fe4b0694ca16b4232?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'智昊：如何用 Skills 提效 vibe coding', date:'2026-02-05', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_698446c8e4b0694c5b8443ab?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'找到真需求、Claude Code 学习指南', date:'2026-04-27', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69ef2800e4b0694c5bb89791?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'认识 Claude Code（终端里的 AI）', title:'为什么要用这个"黑窗口"',
        output:'搞懂 Claude Code 是什么、强在哪，并装好它',
        flow:[
          { type:'course', code:'CC1.1', t:'Claude Code①：TRAE/Cursor 已经够好了，为什么还要用这个黑窗口？（认识终端里的 AI + 装好 CLI）', mins:35 },
          { type:'task',   title:'装好 Claude Code、跑通第一条命令', desc:'CLI 能启动、能对话即可' },
        ] },
      { day:2, zone:'搭齐你的配置（命令 / 记忆 / Skill / Hook）', title:'把 Claude Code 配成你的工作流',
        output:'一套配好命令 / 记忆 / Skill / Hook 的工作流',
        flow:[
          { type:'course', code:'CC1.2', t:'Claude Code②：克隆开源框架、搭齐斜杠命令 / CLAUDE.md / Skill / Hook / 子代理 / 插件', mins:85 },
          { type:'task',   title:'配好你自己的 Claude Code 工作流', desc:'命令 / CLAUDE.md / Skill / Hook 至少各一个' },
        ] },
    ],
  },

  /* ===== 解锁 MCP 和 Skills（实战手册 M6+M10 · 3 岛）===== */
  mcp: {
    key: 'mcp', name: '解锁 MCP 和 Skills',
    promise: '给 AI 装上"连接一切的万能插头"和"上岗 SOP"',
    courseCount: 3,
    /* 往期直播回放（小鹅通真实场次）；按内容归到本路线 */
    lives: [
      { t:'钱塘江鲤：如何用 Skills 控制 AI 自动帮你干活', date:'2026-02-04', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6982b9a6e4b0694c5b834a9a?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'成峰：用 Skills 做一个越用越聪明的剪辑 Agent', date:'2026-02-09', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_698941e9e4b0694c5b8699c7?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'用 MCP 给 AI 连上各种工具', title:'MCP：AI 的万能插头',
        output:'装好一个能用的 MCP',
        flow:[
          { type:'course', code:'MS1.1', t:'MCP：AI 的万能插头 — 让 AI 连上一切工具', mins:75 },
          { type:'task',   title:'给 AI 装好一个 MCP 并验证可用', desc:'如看浏览器 / 查文档 / 连数据库' },
        ] },
      { day:2, zone:'用 Skill 给 AI 写长期 SOP', title:'Skill：给 AI 写一份上岗 SOP',
        output:'一个可触发的自定义 Skill',
        flow:[
          { type:'course', code:'MS2.1', t:'Skill：给 AI 写一份上岗 SOP', mins:70 },
          { type:'task',   title:'为自己项目写一个可触发的 Skill', desc:'写一次、AI 永久遵守' },
        ] },
      { day:3, zone:'进阶：瘦身 SKILL + Hook + 子代理', title:'Skills 和 SOP 的进阶写法',
        output:'一套瘦身 SKILL + Hook + Subagent 配置',
        flow:[
          { type:'course', code:'MS3.1', t:'怎么教 AI 学会你的工作方式？Skills 和 SOP 的正确用法', mins:80 },
          { type:'task',   title:'给项目配好 SKILL + Hook + Subagent', desc:'多步任务拆成可追溯流水线' },
        ] },
    ],
  },

  /* ===== 学会和 AI 提需求（实战手册 M2+M11 · 2 岛）===== */
  spec: {
    key: 'spec', name: '学会和 AI 提需求',
    promise: '把模糊想法，说成 AI 能一次做对的"任务书"',
    courseCount: 2,
    islands: [
      { day:1, zone:'写出你的第一份 SPEC', title:'跟 AI 讨论需求 · SPEC = 新的源代码',
        output:'一份能让 AI 一次做对的 SPEC',
        flow:[
          { type:'course', code:'SP1.1', t:'跟 AI 讨论需求：从模糊想法到清晰指令（SPEC = 新源代码 + 五条检查清单）', mins:18 },
          { type:'task',   title:'写出你的第一份 SPEC', desc:'含问题 / 方案 / 约束 / 红线 / 交付标准' },
        ] },
      { day:2, zone:'用 SPEC 驱动复杂需求', title:'SPEC 驱动复杂需求',
        output:'用 SPEC 驱动做出一个复杂需求',
        flow:[
          { type:'course', code:'SP2.1', t:'SPEC 驱动开发 · 进阶篇：用规格驱动做出复杂需求', mins:25 },
          { type:'task',   title:'用 SPEC 驱动做出一个复杂需求', desc:'先写规格再让 AI 实现' },
        ] },
    ],
  },

  /* ============ Stage 0 · 还没想好做啥 ============ */

  /* ===== 找方向（找方向体验课 · 4 岛）===== */
  idea: {
    key: 'idea', name: '找方向',
    promise: '从一堆模糊念头里，选出 1 个最该先做的 idea',
    courseCount: 14,
    /* 往期直播回放（小鹅通真实场次）；按内容归到本路线 */
    lives: [
      { t:'刘小排：优秀产品案例拆解', date:'2025-11-18', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_691c64cee4b0694ca14597d0?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'邬轼：如何判断一个词值不值得做', date:'2026-02-04', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6982b925e4b0694c5b8349ff?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'前行：1 小时从 0 到上线，建站全流程实操', date:'2026-02-05', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69844633e4b0694c34d7bcfc?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'前行：找新词玩法 · 直播答疑', date:'2026-02-09', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69894d15e4b0694c34d964ae?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'小耳朵：我从完全不懂到做出产品，中间经历了什么', date:'2026-03-24', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69c2325fe4b0694c5ba06bf3?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'droidHZ：如何找到需求，并加速网站变现', date:'2026-05-06', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_69faed86e4b0694c5bbd1216?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
      { t:'我的产品怎么拿到前 100 个用户', date:'2026-06-01', url:'https://appamvpb5mq9834.h5.xiaoeknow.com/v4/course/alive/l_6a1d5c1ee4b0694c5bce5c7b?app_id=appamvpb5mq9834&alive_mode=0&type=2' },
    ],
    islands: [
      { day:1, zone:'找 idea：去差评 / 产品里翻机会', title:'找 idea 是"打猎"不是"灵感"',
        output:'一份"产品方向诊断报告"',
        flow:[
          { type:'course', code:'ID1.1', t:'思想实验：什么叫"做产品生意"、从起心动念到编程的鸿沟', mins:12 },
          { type:'course', code:'ID1.2', t:'能赚钱的 AI 产品长什么样？去哪儿找（信息源清单）', mins:15 },
          { type:'course', code:'ID1.3', t:'每天 15 分钟翻产品的方法', mins:6 },
          { type:'task',   title:'交一份"产品方向诊断报告"', desc:'写下 3 个老 idea，标出各自卡在哪一步' },
        ] },
      { day:2, zone:'像素级拆解一个对标产品', title:'像素级模仿 · 找你的"对标产品"',
        output:'一份"像素级模仿笔记"',
        flow:[
          { type:'course', code:'ID2.1', t:'为什么先模仿不创新 +"守"的训练 + AI 时代为何更要模仿', mins:15 },
          { type:'course', code:'ID2.2', t:'模仿到底在模仿什么（4 个维度）', mins:10 },
          { type:'live',   title:'直播营地 · 对标拆解实战答疑', date:'2026-06-12', time:'20:00' },
          { type:'course', code:'ID2.3', t:'实操：挑 1 个对标做"像素级拆解"（定位/功能/文案/定价/流量）', mins:25 },
          { type:'task',   title:'交一份"像素级模仿笔记"', desc:'5 维度完整拆解 1 个对标产品' },
        ] },
      { day:3, zone:'从真实抱怨里挖需求', title:'从抱怨里挖需求 · 幸福的方式',
        output:'一份"5 条真实抱怨 + 需求提炼表"',
        flow:[
          { type:'course', code:'ID3.1', t:'找需求第一性原理 = 收集抱怨；去哪些差评区翻石头', mins:15 },
          { type:'course', code:'ID3.2', t:'实操：去 3 个源头采集至少 5 条真实抱怨', mins:30 },
          { type:'course', code:'ID3.3', t:'把 5 条抱怨背后的"真实需求"提炼成一句话', mins:10 },
          { type:'task',   title:'交"5 条真实抱怨 + 需求提炼表"', desc:'抱怨原文 + 背后的真实需求' },
        ] },
      { day:4, zone:'跑出候选、打分选定主线', title:'5 种功利方法 + Alpha 验证选主线',
        output:'一份"我的产品方向 1.0"',
        flow:[
          { type:'course', code:'ID4.1', t:'5 种功利方法概览（搜索/新闻/新技术/暗影复刻/服务产品化）', mins:15 },
          { type:'live',   title:'直播营地 · 选对方法 & 候选 idea 评审', date:'2026-06-16', time:'20:00' },
          { type:'course', code:'ID4.2', t:'实操：按选定方法跑一遍，产出至少 3 个候选 idea', mins:30 },
          { type:'course', code:'ID5.1', t:'Alpha 窗口是真实存在的 + Alpha 意识是一种过滤器', mins:15 },
          { type:'course', code:'ID5.2', t:'用 Alpha 分 + 筛选系统给候选 idea 综合打分、选出主线', mins:15 },
          { type:'course', code:'ID5.3', t:'给选定 idea 写出"验证下一步"的 5 个最小动作', mins:10 },
          { type:'task',   title:'交"我的产品方向 1.0"', desc:'最终选定 1 个 idea + 验证方案' },
        ] },
    ],
  },

};
if (typeof window !== 'undefined') window.ROUTES = ROUTES;
