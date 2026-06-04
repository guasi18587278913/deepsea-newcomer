// 课程数据单一数据源 — 第三期《实战手册》77 节 / 12 模块 / 4 阶段
// 由 .course-cards/_gen_course_data.py 从卡片生成，请勿手改本文件。
// roadmap.html / learn.html 通过 <script src="course-data.js"></script> 共享。

const COURSE_STAGES = {
  "1": {
    "name": "快速入门",
    "modules": [
      "M1",
      "M2"
    ]
  },
  "2": {
    "name": "实战进阶",
    "modules": [
      "M3",
      "M4",
      "M5",
      "M6"
    ]
  },
  "3": {
    "name": "商业化",
    "modules": [
      "M7",
      "M8",
      "M9"
    ]
  },
  "4": {
    "name": "增长",
    "modules": [
      "M10",
      "M11",
      "M12"
    ]
  }
};

const COURSE_MODULES = {
  "M1": {
    "name": "你不需要会编程",
    "stage": 1,
    "sub": ""
  },
  "M2": {
    "name": "认识你的新伙伴",
    "stage": 1,
    "sub": ""
  },
  "M3": {
    "name": "前后端、源代码、数据库、用户认证、Next.js",
    "stage": 2,
    "sub": "1/4"
  },
  "M4": {
    "name": "IDE工具、GitHub、API、环境变量",
    "stage": 2,
    "sub": "2/4"
  },
  "M5": {
    "name": "数据库进阶、产品设计、Bug、部署、域名",
    "stage": 2,
    "sub": "3/4"
  },
  "M6": {
    "name": "Claude Code、MCP、Skills、迭代、开源",
    "stage": 2,
    "sub": "4/4"
  },
  "M7": {
    "name": "什么产品能赚钱？",
    "stage": 3,
    "sub": ""
  },
  "M8": {
    "name": "做能收钱的海外AI产品",
    "stage": 3,
    "sub": ""
  },
  "M9": {
    "name": "怎么做App/小程序？",
    "stage": 3,
    "sub": ""
  },
  "M10": {
    "name": "万事用AI：把AI变成员工",
    "stage": 4,
    "sub": ""
  },
  "M11": {
    "name": "让AI写出不翻车的代码",
    "stage": 4,
    "sub": "",
    "placeholder": true
  },
  "M12": {
    "name": "产品做出来了，然后呢？",
    "stage": 4,
    "sub": "",
    "placeholder": true
  }
};

const COURSES = [
  {
    "code": "M1.1",
    "module": "M1",
    "stage": 1,
    "s": 1,
    "t": "一、这套课程有什么不同？",
    "difficulty": 1,
    "mins": 8,
    "d": 8,
    "minsText": "8 分钟（含 01 前言 + 02 学完能获得什么，约 3000 字纯阅读，无实操）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "建立\"跟随一个真拿过结果的人，学从 Idea 到 Business 全链路、而非只学写代码\"的信任与预期，认清这门课覆盖找方向→做产品→上线→获客→变现的完整闭环",
    "prereqText": "无"
  },
  {
    "code": "M1.2",
    "module": "M1",
    "stage": 1,
    "s": 1,
    "t": "二、我祖上十八代都不会编程，我为什么需要会？",
    "difficulty": 1,
    "mins": 5,
    "d": 5,
    "minsText": "5 分钟（约 2000 字纯阅读，无实操）",
    "output": "认知觉醒",
    "tags": [
      "通用底层",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "分清 Vibe Coding（蒙头提示祈祷有用）与 Agentic Engineering（清晰目标、系统拆解、人类判断 AI 执行），理解非技术者反而更有优势——真正稀缺的是\"把模糊想法拆成清晰任务并指挥 AI 完成\"",
    "prereqText": "无"
  },
  {
    "code": "M1.3",
    "module": "M1",
    "stage": 1,
    "s": 1,
    "t": "三、开挂式学习：用AI来学AI",
    "difficulty": 2,
    "mins": 20,
    "d": 20,
    "minsText": "约 20 分钟（正文约 1600 字阅读 ≈ 4 分钟；作业需下载安装一款 AI 浏览器、设为默认、并完成总结/划词解释/截图提问 4 个动手挑战，约 15 分钟）",
    "output": "工具配置或环境搭建",
    "tags": [
      "通用底层",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "选定并把一款 AI 浏览器（Tabbit / Dia / 豆包电脑版）设为默认，靠\"肌肉记忆\"养成所见即所问、零切换的学习习惯，为后续全程用 AI 学 AI 打底",
    "prereqText": "无"
  },
  {
    "code": "M2.1",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "一、AI到底是什么？别怕，它就是个超级实习生",
    "difficulty": 1,
    "mins": 6,
    "d": 6,
    "minsText": "6 分钟（约 2300 字纯阅读，按 400 字/分钟）",
    "output": "认知觉醒",
    "tags": [
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "把 AI 重新定位成\"会犯错、会失忆、不背锅的超级实习生\"，从此你是老板、它是执行者——心理门槛和责任归属一次讲清。",
    "prereqText": "无"
  },
  {
    "code": "M2.2",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "二、初体验：10分钟，做出你的第一个网站",
    "difficulty": 2,
    "mins": 30,
    "d": 30,
    "minsText": "30 分钟（正文约 2000 字 5 分钟，含注册扣子编程账号 + 生成 + 部署互动故事的实操，按手册\"10分钟做网站\"并预留试错时间）",
    "output": "可上线产品",
    "tags": [
      "Web网页"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "用扣子编程从一句无歧义需求到一键部署，亲手跑通\"AI 写代码 → 云端沙箱运行 → 全球可访问 URL\"的全链路，建立\"我也能做出来\"的信心。",
    "prereqText": "一、AI到底是什么？别怕，它就是个超级实习生"
  },
  {
    "code": "M2.3",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "三、跟AI讨论需求：从模糊想法到清晰指令",
    "difficulty": 2,
    "mins": 18,
    "d": 18,
    "minsText": "18 分钟（正文约 3200 字 8 分钟，含用苏格拉底式 Prompt 与 AI 对话打磨一份 SPEC 的实操约 10 分钟）",
    "output": "认知觉醒",
    "tags": [
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "领悟\"Spec 就是新的源代码\"，学会用五条检查清单（问题陈述/方案/技术约束/红线/交付标准）和\"跟 AI 对话梳理需求\"把模糊想法变成无歧义任务书。",
    "prereqText": "二、初体验：10分钟，做出你的第一个网站"
  },
  {
    "code": "M2.4",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "四、什么是AI产品？跟普通产品到底差在哪？",
    "difficulty": 1,
    "mins": 5,
    "d": 5,
    "minsText": "5 分钟（约 1800 字纯阅读，按 400 字/分钟）",
    "output": "认知觉醒",
    "tags": [
      "通用底层",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "分清\"用 AI 做的产品\"和\"产品里跑着 AI\"——只有上线后仍有大模型在实时理解、生成、判断的，才是 AI 原生产品，这是本课要教你做的东西。",
    "prereqText": "二、初体验：10分钟，做出你的第一个网站"
  },
  {
    "code": "M2.5",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "五、开发AI产品的核心秘密：预制菜思维 + 积木思维",
    "difficulty": 2,
    "mins": 12,
    "d": 12,
    "minsText": "12 分钟（正文约 1800 字 5 分钟，含让扣子编程盘点\"你有哪些积木、能搭什么产品\"的对话实操约 7 分钟）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "建立\"AI 产品 = 大脑积木(LLM)+感官积木(图/音/视频)+外部积木(搜索/记忆)\"的组装心智——技术不是壁垒，创意和组合才是。",
    "prereqText": "四、什么是AI产品？跟普通产品到底差在哪？"
  },
  {
    "code": "M2.6",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "六、马上开始！动手开发第一个AI产品：互联网黑话翻译器",
    "difficulty": 3,
    "mins": 30,
    "d": 30,
    "minsText": "30 分钟（手册明示\"整个过程大约30分钟\"：写/改 SPEC + 扣子编程生成 + 装修 + 部署）",
    "output": "可上线产品",
    "tags": [
      "Web网页",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "用 1 块积木(LLM)亲手做出并部署第一个真正的 AI 产品，并搞懂\"开发期 LLM 帮你写代码 vs 运行期 LLM 帮用户干活\"这一关键区别。",
    "prereqText": "三、跟AI讨论需求：从模糊想法到清晰指令；五、开发AI产品的核心秘密：预制菜思维 + 积木思维"
  },
  {
    "code": "M2.7",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "七、难度升级！第二个AI产品：哄哄模拟器(代入感增强版）",
    "difficulty": 4,
    "mins": 45,
    "d": 45,
    "minsText": "45 分钟（正文与原理约 3000 字阅读，含自写粗糙版 SPEC、AI 打磨、生成复杂产品并反复纠错；附超长参考 SPEC，国产模型常需多轮修复，按实操从难加时）",
    "output": "可上线产品",
    "tags": [
      "Web网页",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "加第 2 块积木(TTS)让产品\"开口说话\"，体会感官积木如何把\"工具\"升级为有传播力的\"游戏/体验\"，并学会读懂双路（文字+语音）数据流。",
    "prereqText": "六、马上开始！动手开发第一个AI产品：互联网黑话翻译器"
  },
  {
    "code": "M2.8",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "八、难度再次升级！从零打造\"纸片人男友\"并让你的闺蜜爱上他",
    "difficulty": 5,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（入门篇最难一课：完全自写 SPEC、集齐 3 块积木、调角色一致性/发图频率/长相一致等综合问题；参考 SPEC 极长，生成更慢、纠错更多）",
    "output": "可上线产品",
    "tags": [
      "Web网页",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "集齐 3 块积木(LLM+TTS+图像生成)做出会聊、会说、会发自拍的陪伴型产品，掌握\"用自然语言让 LLM 自己决策（如何时发图、用 [IMAGE:] 标记）\"这一进阶思维。",
    "prereqText": "七、难度升级！第二个AI产品：哄哄模拟器(代入感增强版）"
  },
  {
    "code": "M2.9",
    "module": "M2",
    "stage": 1,
    "s": 1,
    "t": "九、入门篇总结：你已经不是那个只会用AI聊天的人了",
    "difficulty": 1,
    "mins": 6,
    "d": 6,
    "minsText": "6 分钟（约 2400 字纯阅读总结 + 自检清单，按 400 字/分钟）",
    "output": "认知觉醒",
    "tags": [
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "把三次认知跃迁（AI=实习生 / SPEC=新源代码 / 积木组合）和三个实战项目串成体系，并用 5 条\"毕业标准\"自检是否真正具备 Demo 级 AI 产品开发能力。",
    "prereqText": "八、难度再次升级！从零打造\"纸片人男友\"并让你的闺蜜爱上他"
  },
  {
    "code": "M3.1",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "一、前端和后端：一个管脸，一个管脑",
    "difficulty": 1,
    "mins": 8,
    "d": 8,
    "minsText": "8 分钟（正文约 2900 字，约 7 分钟纯阅读；中途回看一次自己的文件结构 +1 分钟）",
    "output": "图文理解",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "用\"餐厅大堂 vs 后厨\"看穿任何产品都由前端（管脸）和后端（管脑）两部分构成，并理解 Next.js 把两者塞进一个项目就叫\"全栈\"。",
    "prereqText": "无（以学员已做过的\"哄哄模拟器\"为例展开，但不要求理解其代码）"
  },
  {
    "code": "M3.2",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "二、源代码管理：你的代码也需要网盘",
    "difficulty": 1,
    "mins": 9,
    "d": 9,
    "minsText": "9 分钟（正文约 3300 字，约 8 分钟阅读；打开扣子编程版本控制面板看一眼时间线 +1 分钟，无实际操作）",
    "output": "图文理解",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "理解版本控制就是\"代码的时光机\"（存/看/回），它比 Ctrl+Z 强在管整个项目、永久保存、可跳任意版本——你在扣子编程里早就在用它的简化版，本质就是 Git。",
    "prereqText": "无"
  },
  {
    "code": "M3.3",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "三、数据库：你的数据存在哪？",
    "difficulty": 3,
    "mins": 22,
    "d": 22,
    "minsText": "22 分钟（正文约 4400 字约 11 分钟；含两段给 AI 的 Prompt 实操——加博客页、把文章迁到数据库——AI 生成 + 在可视化界面增删改查验证，实操约 11 分钟）",
    "output": "可运行demo",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "把\"数据库=给程序用的 Excel\"这件事吃透，学会让代码和数据分家（别把内容写死在代码里），并亲手在扣子编程可视化界面里看到/增改自己的数据。",
    "prereqText": "无（概念上承接\"前端和后端\"，但不强制）"
  },
  {
    "code": "M3.4",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "四、用户认证：怎么让用户注册登录你的产品？",
    "difficulty": 4,
    "mins": 50,
    "d": 50,
    "minsText": "50 分钟（正文约 9800 字约 25 分钟；含 4 段实操 Prompt——注册登录、登录态差异界面、游戏记录、排行榜——文中明确提示单次 AI 生成需 10 分钟以上且功能较复杂易报错，实操约 25 分钟）",
    "output": "可运行demo",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "从零给产品装上\"会员系统\"——理解注册/登录就是数据库读写、密码必须哈希加密（连开发者都看不到）、Cookie/Session 是浏览器的\"手环\"，并用 user_id 把多张表关联起来做出排行榜。",
    "prereqText": "三、数据库：你的数据存在哪？（注册=往表加行、登录=查行，全建立在数据库操作之上）"
  },
  {
    "code": "M3.5",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "五、Next.js最核心的内容：你一直在用，只是不知道而已",
    "difficulty": 2,
    "mins": 22,
    "d": 22,
    "minsText": "22 分钟（正文约 7900 字约 20 分钟阅读；文中明确\"不写任何代码\"，仅打开 page.tsx/layout.tsx/route.ts 等几个文件对照看 +2 分钟）",
    "output": "图文理解",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "看懂自己一直在写的 Next.js 项目结构——文件夹即页面（零配置路由）、page.tsx 管脸 / route.ts 管脑 / layout.tsx 是共享外壳 / components 是积木，为离开扣子编程做认知准备。",
    "prereqText": "一、前端和后端：一个管脸，一个管脑（page.tsx/route.ts 的前后端分工直接复用其餐厅比喻）"
  },
  {
    "code": "M3.6",
    "module": "M3",
    "stage": 2,
    "s": 2,
    "t": "六、离开扣子编程，进入深水区",
    "difficulty": 5,
    "mins": 70,
    "d": 70,
    "minsText": "70 分钟（正文约 9000 字约 22 分钟；含七步本地环境搭建实操——装 TRAE、导出代码、装 Node.js+依赖、配 DATABASE_URL、从扣子编程\"交涉\"套出 Coze/Supabase 密钥、启动——涉及命令行、密钥获取常受阻需多轮重试，实操约 48 分钟）",
    "output": "工具配置或环境搭建",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "完成从\"精装出租屋\"（扣子编程）到\"自己房子\"（本地 TRAE）的搬家——掌握安装 IDE、配置 Node.js 运行环境、连接远程数据库、注入 API Key，让产品在自己电脑上真正跑起来，正式进入专业开发者工作流。",
    "prereqText": "五、Next.js最核心的内容（需先认得 page.tsx/route.ts/.env 等结构）；三、数据库 + 四、用户认证（迁移时要配置数据库连接与已有功能）"
  },
  {
    "code": "M4.1",
    "module": "M4",
    "stage": 2,
    "s": 2,
    "t": "七、IDE类AI编程工具速通",
    "difficulty": 1,
    "mins": 8,
    "d": 8,
    "minsText": "8 分钟（正文约 660 字纯阅读约 2 分钟；含 8 张工具界面截图对照辨认 + 末尾\"在各工具截图里找出 4 区域\"小练习，加约 6 分钟）",
    "output": "图文理解",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "建立\"所有 AI 编程 IDE 都是文件导航+编辑区+AI聊天+终端这 4 个区域\"的统一心智，学会一个就能 5 分钟上手任何一个，从此不被五花八门的界面吓退。",
    "prereqText": "无"
  },
  {
    "code": "M4.2",
    "module": "M4",
    "stage": 2,
    "s": 2,
    "t": "八、使用GitHub做源代码管理：跟全世界程序员接轨【重要】",
    "difficulty": 3,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 7800 字阅读约 20 分钟；含注册 GitHub、在 TRAE 初始化仓库/提交/同步、装 GitHub Desktop、提交-同步-回滚全流程实操共 58 张操作截图，加约 40 分钟跟练）",
    "output": "工具配置或环境搭建",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "把 GitHub 当\"代码网盘\"用起来——会注册账号、在 TRAE/GitHub Desktop 里提交、同步、查历史、一键回滚，让代码有了云端备份和后悔药，迈出与全世界程序员接轨的第一步。",
    "prereqText": "七、IDE类AI编程工具速通（实操在 TRAE 里进行）"
  },
  {
    "code": "M4.3",
    "module": "M4",
    "stage": 2,
    "s": 2,
    "t": "九、去API超市进货：给你的产品加上现成的AI超能力【重要】",
    "difficulty": 4,
    "mins": 120,
    "d": 120,
    "minsText": "120 分钟（正文约 17000 字阅读约 43 分钟；含 Postman/Apifox 凑齐\"API 四要素\"验货、把 coze sdk 默认 API 替换成火山引擎、从零用 TRAE 做\"虚拟试衣\"完整产品三大实操，64 张截图 + 多个 Prompt 模板，加约 75 分钟动手）",
    "output": "可上线产品",
    "tags": [
      "AI员工自动化",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "掌握\"做 AI 产品 = 选 API + 调 API + 换 API\"的核心工作方式——会逛主流 API 平台、用 Postman 凑齐四要素先验货再写代码、并能随时替换底层供应商不被任何一家绑死，把现成 AI 能力像积木一样装进自己的产品。",
    "prereqText": "八、使用GitHub做源代码管理（实操涉及在已有 coze sdk 项目里改代码、提交）"
  },
  {
    "code": "M4.4",
    "module": "M4",
    "stage": 2,
    "s": 2,
    "t": "十、去哪里看模型能力：别靠感觉选，学会看公开信号",
    "difficulty": 2,
    "mins": 18,
    "d": 18,
    "minsText": "18 分钟（正文约 3000 字阅读约 8 分钟；含浏览 Artificial Analysis、Arena 两个榜单并按\"任务类型→看分差→对比价格\"做一次选型练习，23 张截图，加约 10 分钟实际操作）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "学会用 ELO 盲测榜单（AA、Arena）而不是自媒体吹捧或厂商宣传来判断模型强弱，并以\"能力够用 + 价格合理\"为标准做选型，为产品的效果和成本负责。",
    "prereqText": "九、去API超市进货（选完模型要回供应商平台对比价格、接入）"
  },
  {
    "code": "M4.5",
    "module": "M4",
    "stage": 2,
    "s": 2,
    "t": "十一、环境变量：为什么密码不能直接写在代码里？",
    "difficulty": 3,
    "mins": 40,
    "d": 40,
    "minsText": "40 分钟（正文约 4400 字阅读约 11 分钟；含理解\"前端→API Route→第三方\"链路、用 .env.local + .gitignore 改造代码、密钥泄露后 git filter-repo 清历史的实操，27 段代码示例，加约 30 分钟改造与验证）",
    "output": "工具配置或环境搭建",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解\"前端持有密钥=把银行卡密码印名片上\"，学会用 Next.js API Route 服务端中转 + .env.local 隔离密钥的标准防火墙架构，并掌握密钥一旦泄露立刻吊销、清 Git 历史的应急处理，守住钱包和职业声誉的安全红线。",
    "prereqText": "九、去API超市进货（改造的正是上一课接入的那个 API）"
  },
  {
    "code": "M5.1",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十二、数据库进阶：离开扣子后，怎么选数据库？",
    "difficulty": 4,
    "mins": 90,
    "d": 90,
    "minsText": "90 分钟（正文约 9000 字阅读约 23 分钟；含在 Neon 建项目/拿连接串、跑 CREATE/INSERT/SELECT/UPDATE/DELETE 一套 SQL、用 Drizzle 或 Prisma 配置 + 写 schema + generate/migrate、把产品数据库从扣子切到 Neon、装 TablePlus 连库，约 30 段 SQL/代码示例 + 多张截图，加约 65 分钟动手）",
    "output": "工具配置或环境搭建",
    "tags": [
      "工程内功",
      "Web网页"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "建立\"产品数据该用关系型数据库(PostgreSQL)、连接只认连接字符串、结构变更靠 Migration 管理\"的完整心智，学会脱离扣子后用 Neon 独立托管数据库、让 AI 配 Drizzle/Prisma 自动生成迁移，并用管理后台或 TablePlus 直接管数据，从此真正掌控产品的数据底盘。",
    "prereqText": "无（默认已用过扣子编程内置数据库、会改 .env、用 TRAE/Cursor 跑 Next.js 项目）"
  },
  {
    "code": "M5.2",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十三、如何迅速提升产品设计感",
    "difficulty": 3,
    "mins": 50,
    "d": 50,
    "minsText": "50 分钟（正文约 4000 字阅读约 10 分钟；含逛 21st.dev 等组件库挑组件并丢给 TRAE 套用、可选用 Stitch/Pencil MCP 出设计稿再迁回项目、可选买模板让 Claude Code \"一键穿衣服\"，多张操作截图 + Prompt 模板，加约 40 分钟挑选与替换实操）",
    "output": "图文理解",
    "tags": [
      "Web网页",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "建立\"标准 SaaS 首页都是同一套结构、设计感靠刷见识攒素材库、好看组件可直接抄来套用\"的认知，学会用 21st.dev 等开源组件库、Stitch/Pencil MCP 出图、付费模板让 AI 换肤这几条路，把草台班子的产品快速做出成熟专业的卖相。",
    "prereqText": "无（需有一个能跑的 Next.js 产品可供改造）"
  },
  {
    "code": "M5.3",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十四、Bug和报错：你的产品一定会出问题，然后呢",
    "difficulty": 2,
    "mins": 25,
    "d": 25,
    "minsText": "25 分钟（正文约 4500 字阅读约 11 分钟；含开浏览器 Console / TRAE 终端定位报错、读懂报错的类型+描述+文件行号、套用提问模板问 AI、\"故意搞坏再修好\"走一遍完整流程，多张报错截图，加约 14 分钟动手练）",
    "output": "图文理解",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "扭转\"看到红色报错就慌\"的心态——理解报错其实是好事、Next.js 客户端报错看浏览器 Console 而服务端报错看 TRAE 终端，掌握\"定位→复制核心信息→带操作上下文问 AI→修复验证\"的固定流程，并能识别依赖/环境变量/端口/Node 版本这类\"不是你写错了\"的环境问题。",
    "prereqText": "无（用哄哄模拟器等已有项目练手即可）"
  },
  {
    "code": "M5.4",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十五、服务器、部署、上线：你的产品怎么从电脑跑到全世界？【重要】",
    "difficulty": 3,
    "mins": 70,
    "d": 70,
    "minsText": "70 分钟（正文约 5500 字阅读约 14 分钟；含本地跑 pnpm build 验证、注册 Vercel 用 GitHub 登录、导入仓库 + 填环境变量 + 首次部署、验证 push 自动部署、配置/修改环境变量后 Redeploy、看 Build/Runtime 日志排查，加约 55 分钟把项目真正部署上线并做一次报错修复)",
    "output": "可上线产品",
    "tags": [
      "工程内功",
      "Web网页"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解\"localhost 只有自己能开、上线=把代码搬到永远开着的服务器\"，学会用 Vercel 把 Next.js 项目一键部署拿到公网域名、靠 GitHub Webhook 实现 push 即自动更新，并掌握\"上线后功能失灵 90% 是环境变量没配/没 Redeploy\"这个最大的坑以及去 Logs 看日志排查的方法。",
    "prereqText": "八、使用GitHub做源代码管理（Vercel 靠读 GitHub 仓库部署，代码须先 push）；十一、环境变量（线上要重填 .env 里的 Key）"
  },
  {
    "code": "M5.5",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十六、域名：给你的产品起个好记的名字",
    "difficulty": 3,
    "mins": 40,
    "d": 40,
    "minsText": "40 分钟（正文约 5400 字阅读约 14 分钟；含用 Instant Domain Search 查可用域名、在 Namecheap 下单买域名、在 Vercel 加域名拿 DNS 记录、回 Namecheap 配 CNAME/A 记录并等生效验证，多张操作截图，加约 26 分钟实际购买与配置——若仅练手则可只读不买)",
    "output": "工具配置或环境搭建",
    "tags": [
      "Web网页",
      "增长SEO"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "搞懂域名是 IP 的好记别名、TLD/主域名/子域名的区别以及 .com/.io/.ai/.app 怎么选，学会用 AI 脑暴 + 工具查重挑一个好域名、在 Namecheap 购买并通过 DNS（CNAME/A 记录）绑定到 Vercel，顺带明白海外服务器为何不用备案——把产品的对外门牌号立起来。",
    "prereqText": "十五、服务器、部署、上线（要把域名绑到已部署的 Vercel 项目上）"
  },
  {
    "code": "M5.6",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十七、人机验证：有人用机器人来薅你的产品，怎么办？",
    "difficulty": 4,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 5000 字阅读约 13 分钟；含在 Cloudflare 建 Turnstile 组件拿双 Key、配环境变量、装 @marsidev/react-turnstile 在注册页加前端组件、在注册 API 加后端 siteverify 校验、测试正常注册通过而无 token 请求被拒，多段代码 + 截图，加约 47 分钟前后端接入与验证)",
    "output": "可上线产品",
    "tags": [
      "工程内功",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "建立\"只要有免费额度就一定会被脚本薅、安全不是可选项\"的风险意识，学会用免费且无感的 Cloudflare Turnstile（Managed 模式）给注册流程加人机验证，并牢记\"前端拿 token + 后端调 Cloudflare 校验缺一不可、只做前端等于没做\"这条防绕过铁律，守住 AI 接口的钱包。",
    "prereqText": "十一、环境变量（Site Key/Secret Key 要放进 .env）；九、去API超市进货（被薅的正是花钱的 AI 接口额度）；有注册功能的产品"
  },
  {
    "code": "M5.7",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十八、云存储：AI 生成的图片链接过期了，怎么办？",
    "difficulty": 4,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 5000 字阅读约 13 分钟；含在 Cloudflare 建 R2 桶 + 开公开访问 + 建 API Token、配环境变量、装 @aws-sdk/client-s3 写 uploadToR2 工具函数、改生成图片接口做\"下载→上传→存永久链接\"、过 24h 验证图片还在，多段代码 + 截图，加约 47 分钟实操)",
    "output": "可上线产品",
    "tags": [
      "工程内功",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解\"AI 返回的多是会过期的临时链接、文件必须自己另存一份\"，掌握\"数据库存文字、云存储存文件\"的分工与 S3 协议这一行业通用语，学会用流量免费的 Cloudflare R2（兼容 S3）走\"AI 生成→后端下载→上传 R2→拿永久链接存库\"五步，让产品里的图片/音视频永不蒸发。",
    "prereqText": "十二、数据库进阶（永久链接要存进数据库）；十一、环境变量（R2 的 Key 放 .env）；有调用 AI 生成图片/文件的产品"
  },
  {
    "code": "M5.8",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "十九、邮件服务：想让产品主动联系用户，怎么办？",
    "difficulty": 4,
    "mins": 65,
    "d": 65,
    "minsText": "65 分钟（正文约 5300 字阅读约 13 分钟；含注册 Resend 拿 API Key、配环境变量、装 resend、写 sendWelcomeEmail/sendDailyLoveLetter/批量发送函数、在注册流程里 try-catch 调用、可选验证域名 + 了解 React Email，多段代码 + 截图，加约 52 分钟接入与自测)",
    "output": "可上线产品",
    "tags": [
      "AI员工自动化",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解\"网页产品不能像 App 推送、主动触达用户最高频靠发邮件\"，分清事务性邮件与营销性邮件，学会用开发者体验极佳、免费 3000 封/月的 Resend 通过 API 发送欢迎信与每日情话，并掌握\"验证域名防进垃圾箱、API Key 只在后端、发信失败用 try-catch 兜底不阻断主流程\"这几条要点。",
    "prereqText": "十一、环境变量（Resend API Key 放 .env）；十六、域名（验证域名才能用自己域名发信）；有注册功能与可调用的 AI 接口"
  },
  {
    "code": "M5.9",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "二十、定时任务：你睡了，产品还能自己干活",
    "difficulty": 4,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 5500 字阅读约 14 分钟；含写带 CRON_SECRET 校验的 /api/cron API Route、生成密钥并在本地+线上配环境变量、在 cron-job.org 建任务设时区/Cron 表达式/Authorization Header/失败通知、TEST RUN 测试并按 401/500 排错，多段代码 + 截图，加约 46 分钟搭建与验证)",
    "output": "可上线产品",
    "tags": [
      "AI员工自动化",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解 Serverless 没有常开服务器、需用\"外部闹钟(cron-job.org)定时敲你的 API\"来让产品自动干活，学会写定时 API Route、读懂 Cron 表达式（0 8 * * * = 每天 8 点）、配好时区与触发，并牢记\"无验证的定时接口就是任何人都能按的核弹按钮、必须加 CRON_SECRET\"这条安全底线。",
    "prereqText": "十九、邮件服务（要被定时触发的正是上一课写好的批量发信函数）；十五、服务器、部署、上线（CRON_SECRET 需在 Vercel 线上单独配）；十一、环境变量"
  },
  {
    "code": "M5.10",
    "module": "M5",
    "stage": 2,
    "s": 2,
    "t": "二十一、用户反馈：你的用户想吐槽，往哪儿吐？",
    "difficulty": 2,
    "mins": 45,
    "d": 45,
    "minsText": "45 分钟（正文约 5300 字阅读约 13 分钟；含 Footer 加联系邮箱、注册 Crisp 拿 Website ID + 配环境变量 + 写 CrispChat 组件挂到 layout、建 Discord 服务器与频道并放邀请链接、可选给 404 加联系入口，多段代码 + 截图，加约 32 分钟接入)",
    "output": "可上线产品",
    "tags": [
      "商业认知",
      "Web网页"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "树立\"愿意吐槽的用户最宝贵、用户反馈是产品迭代的方向盘、跟用户沟通比写代码重要 10 倍\"的认知，学会搭建邮箱(必须)、Crisp 在线聊天(体验好)、Discord 社群(粘性强)三条反馈渠道并在 Footer/报错页/欢迎邮件等关键时刻放联系入口，再用\"快速回复+分类记录+不盲从所有人\"的原则把反馈转化为迭代动力。",
    "prereqText": "十九、邮件服务（反馈邮箱建议用验证过的域名邮箱、欢迎邮件里放 Discord 链接）；有一个上线产品"
  },
  {
    "code": "M6.1",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十二、Claude Code：TRAE/Cursor 已经够好了，为什么还要用这个黑窗口？",
    "difficulty": 4,
    "mins": 120,
    "d": 120,
    "minsText": "120 分钟（正文约 1.3 万字阅读约 33 分钟；含安装 CLI、克隆框架、逐个复制并验证 10 个模块的命令与配置，实操占大头，故加约 90 分钟）",
    "output": "工具配置或环境搭建（装好 CLI 工具，并跑通 claude-howto 框架的命令/记忆/Skill/Hook/Subagent/Plugin 等十类配置）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（已用 TRAE/Cursor 做过几个项目，正文开篇即假设\"你已经做了好几个项目\"）",
    "essence": "从\"AI 住在编辑器\"升级到\"AI 住在终端\"，学会用对话式工作流驱动 CLI 自动写码/跑命令/部署，并借开源框架把斜杠命令、CLAUDE.md、Skill、Hook、子代理、插件一次性搭进自己的项目。",
    "prereqText": "无（本模块第一节，但默认已具备 TRAE/Cursor 实操经验）"
  },
  {
    "code": "M6.2",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十三、MCP：AI的万能插头 — 让AI连上一切工具【重要】",
    "difficulty": 3,
    "mins": 75,
    "d": 75,
    "minsText": "75 分钟（正文约 8 千字阅读约 20 分钟；含市场搜索安装、配置数据库连接串、跑三个验证 demo，加约 55 分钟）",
    "output": "工具配置或环境搭建（在 TRAE 装好 DevTools / Context7 / PostgreSQL 三个 MCP 并验证可用）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（需有 TRAE 项目和已配好的数据库，即前面\"哄哄模拟器\"）",
    "essence": "理解 MCP 是 AI 连外部世界的\"USB 通用插头\"，会用 Client/Server/Tool 三角色心智，给 AI 装上看浏览器、查最新文档、用中文查数据库的能力——突破\"只能靠截图和复制粘贴\"的感知边界。",
    "prereqText": "无前序章节强依赖于本模块内部；需具备早前课程的 TRAE 实操与数据库连接（哄哄模拟器 / C6）经验"
  },
  {
    "code": "M6.3",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十四、Skill：给AI写一份上岗SOP【重要】",
    "difficulty": 3,
    "mins": 70,
    "d": 70,
    "minsText": "70 分钟（正文约 9 千字阅读约 23 分钟；含安装 Skill、做\"有/无 Skill\"对比实验、动手写并调试一个自定义 Skill，加约 47 分钟）",
    "output": "工具配置或环境搭建（装好并对比 frontend-design Skill，再为自己项目写一个可触发的 SKILL.md）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（接续 MCP 一节，安装时会用到浏览器 MCP）",
    "essence": "把\"每次重新教 AI\"的一次性 Prompt，升级为\"写一次、AI 永久遵守\"的长期工作说明书，用 Skill 换来输出的稳定性与一致性，并分清它与 Prompt / MCP / Rules 的边界。",
    "prereqText": "二十三、MCP：AI的万能插头 — 让AI连上一切工具（安装 Skill 时演示用 DevTools MCP；并需分清 Skill 与 MCP 的区别）"
  },
  {
    "code": "M6.4",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十五、期中考试：使用TRAE和外部API，重做\"纸片人男友\"",
    "difficulty": 5,
    "mins": 10,
    "d": 10,
    "minsText": "一个周末（建议当黑客松：周五配环境/建仓库/写项目 Skill，周六日全力开发，周日晚必须部署上线；纯方案阅读约 10 分钟，其余为综合实战）",
    "output": "可上线产品（外部 API + 登录系统 + 角色一致性图生图 + 记忆功能，部署到 Vercel 的\"纸片人男友 2.0\"）",
    "tags": [
      "Web网页",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（综合考核，需贯通本模块及前序登录/数据库/API/部署等全部技能）",
    "essence": "用一次\"从零到上线\"的完整综合实战，把外部 API、用户系统、图生图角色一致性、对话记忆、部署全部串起来，亲手交付一个真实可访问、且具备商业化潜力的陪伴类 AI 产品。",
    "prereqText": "二十二、Claude Code；二十三、MCP；二十四、Skill（以及更早的外部 API 接入、数据库、用户登录、部署上线等课程）"
  },
  {
    "code": "M6.5",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十六、上线后，如何根据用户行为迭代产品？",
    "difficulty": 3,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 6 千字、含大量指标释义阅读约 15 分钟；含接入 GA4/Plausible 之一与 Clarity、等待数据生效、观看录像与热力图，加约 45 分钟）",
    "output": "工具配置或环境搭建（给产品装上数据统计工具 + Microsoft Clarity，并看录像/热力图）",
    "tags": [
      "增长SEO",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "有产品经验更佳（已有一个上线产品，想据真实数据迭代）",
    "essence": "建立\"看数据—提假设—改产品—再看数据\"的迭代闭环，读懂跳出率/会话时长/转化率等核心指标，并用 Clarity 录像与热力图看清用户\"为什么这么做\"，让产品靠真实行为而非猜测来打磨。",
    "prereqText": "二十五、期中考试（需要有一个已部署、可被访问的产品来接入统计与录像）"
  },
  {
    "code": "M6.6",
    "module": "M6",
    "stage": 2,
    "s": 2,
    "t": "二十七、利用开源生态，加速产品开发",
    "difficulty": 2,
    "mins": 35,
    "d": 35,
    "minsText": "35 分钟（正文约 5 千字、含大量项目链接与截图阅读约 13 分钟；含上 GitHub Trending / 高级搜索 / Vercel 模板各检索体验一遍，加约 22 分钟）",
    "output": "图文理解（掌握找开源项目、判断可改性、在其上做差异化的方法论与流程）",
    "tags": [
      "商业认知",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "不限（会写代码即可，重在思路与选品方法）",
    "essence": "不必什么都自造——学会用 GitHub Trending、高级搜索、Vercel 模板（及付费源码）快速找到可\"拿来改\"的成熟项目，把 90% 基建交给开源，把精力押在那决定胜负、最宝贵的 10% 差异化价值上。",
    "prereqText": "无"
  },
  {
    "code": "M7.1",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "一、在起心动念和开始编程之间",
    "difficulty": 1,
    "mins": 8,
    "d": 8,
    "minsText": "8 分钟（正文约 3100 字，约 8 分钟纯阅读；无实操，仅需对着\"什么人/什么场景/花多少钱/解决什么问题\"填空题在脑中自问一遍）",
    "output": "认知觉醒",
    "tags": [
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "建立全模块的总纲认知——\"产品=购买理由\"，需求只能发现不能发明，先用\"什么人在什么场景愿花多少钱解决什么问题\"这道填空题自查，再用 MVP 验证，从此拒绝写完 demo 才发现没人买单的自嗨。",
    "prereqText": "无（本模块开篇，也是后续所有找需求方法的总纲）"
  },
  {
    "code": "M7.2",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "二、能赚钱的AI产品长什么样？去哪儿找？",
    "difficulty": 1,
    "mins": 14,
    "d": 14,
    "minsText": "14 分钟（正文约 4300 字约 11 分钟；含打开 TrustMRR / Toolify / TAAFT 三个网站各点一圈、并对照看 Rezi 等案例官网，浏览约 3 分钟）",
    "output": "图文理解",
    "tags": [
      "商业认知",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "拿到三个\"必刷\"信息源（TrustMRR 看真实收入、Toolify 看全量产品、TAAFT 自然语言搜产品），并通过 Rezi、Candy AI 等真实案例看清赚钱 AI 产品的共性——高频刚需+明确付费意愿+具体场景，技术大多只是 API 套壳，还顺带理解网络效应与迁移成本为何让\"小而美\"可行。",
    "prereqText": "一、在起心动念和开始编程之间（用其\"购买理由/填空题\"框架来拆解案例）"
  },
  {
    "code": "M7.3",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "三、学习的第一步不是创新，是像素级模仿",
    "difficulty": 2,
    "mins": 18,
    "d": 18,
    "minsText": "18 分钟（正文约 7000 字约 17 分钟；含看一段 Rezi 复刻截图演示，无需亲自动手做，理解+1 分钟）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "吃透\"守破离\"学习路径与像素级模仿的真正含义——不是抄页面，而是还原\"问题→解法→结果→付费\"整条闭环（六层），并理解 AI 时代代码门槛下降、认知门槛上升，新手最大的浪费是过早追求独特。",
    "prereqText": "二、能赚钱的AI产品长什么样？去哪儿找？（需先有可拆解的真实案例与三个信息源作为模仿对象）"
  },
  {
    "code": "M7.4",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "四、产品Idea从哪里来？Part 1 - 幸福的方式",
    "difficulty": 1,
    "mins": 9,
    "d": 9,
    "minsText": "9 分钟（正文约 3500 字，约 9 分钟纯阅读；提到 GET 笔记/录音卡/每日复盘等记录工具，但属习惯建议而非课堂实操，不另计时）",
    "output": "认知觉醒",
    "tags": [
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "掌握\"收集抱怨\"这一找需求的第一性原理——去差评区翻石头、把记录成本降到最低（语音速记+录音卡+每日复盘），让源源不断、只属于你的原生 idea 从自己真实生活里自然长出来。",
    "prereqText": "一、在起心动念和开始编程之间（承接\"需求只能发现不能发明\"，本节给出具体发现方法）"
  },
  {
    "code": "M7.5",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "五、产品Idea从哪里来？Part 2 - 功利的方式",
    "difficulty": 3,
    "mins": 26,
    "d": 26,
    "minsText": "26 分钟（正文约 8500 字约 21 分钟；含上手 Semrush 查 tarot card generator 等关键词、看 Hugging Face trending / Fiverr 的演示对照，浏览约 5 分钟）",
    "output": "图文理解",
    "tags": [
      "商业认知",
      "增长SEO"
    ],
    "track": "主干必修",
    "audience": "有产品经验更佳",
    "essence": "用\"供需失衡\"这一把尺，系统掌握五种功利找需求法（Google 搜索词、新闻窗口、新技术发布、暗影复刻、服务产品化）及其适用顺序，并学会建机会池\"舍九取一\"——你不缺 idea，缺的是筛选系统。",
    "prereqText": "四、产品Idea从哪里来？Part 1（与\"幸福的方式\"互为一对，本节是主动出击的另一半）"
  },
  {
    "code": "M7.6",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "六、为什么有些人总能抢到红利？",
    "difficulty": 1,
    "mins": 9,
    "d": 9,
    "minsText": "9 分钟（正文约 3600 字，约 9 分钟纯阅读；以 DeepSeek、OpenClaw 抢红利故事为例，无实操）",
    "output": "认知觉醒",
    "tags": [
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "用金融的 Alpha/Beta 概念建立\"红利窗口意识\"——Alpha 与 Beta 的差距不在努力而在方向，靠信息差+行动速度+判断力过滤 90% 噪音，真正的竞争力是连续捕捉下一个窗口，把找需求方法变成日常工作方式。",
    "prereqText": "五、产品Idea从哪里来？Part 2（把找需求方法升格为\"持续站在窗口前\"的元意识）"
  },
  {
    "code": "M7.7",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "七、\"新词站\"是怎么回事：一个闷声发财的路子",
    "difficulty": 3,
    "mins": 18,
    "d": 18,
    "minsText": "18 分钟（正文约 7100 字约 18 分钟；含到 Google 搜 nano banana / seedance pro 2.0 翻前两页\"感受新词站长什么样\"，浏览约 1 分钟）",
    "output": "认知觉醒",
    "tags": [
      "增长SEO",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "看懂\"新词站\"这门把时间差变现金流的手艺——在新词搜索暴涨、供给未齐的窗口期抢先搭承接页（提前布局+EMD+速度+主页打内页+高质量外链），用五问判断新词价值，把它当成低成本的产品孵化器而非投机。",
    "prereqText": "五、产品Idea从哪里来？Part 2（新词站是\"新技术发布找机会+暗影复刻\"的具体落地）；六、为什么有些人总能抢到红利？（把 Alpha 窗口意识变成可操作打法）"
  },
  {
    "code": "M7.8",
    "module": "M7",
    "stage": 3,
    "s": 3,
    "t": "八、小而美：低风险创业的最佳起步方式",
    "difficulty": 2,
    "mins": 14,
    "d": 14,
    "minsText": "14 分钟（正文约 5600 字约 14 分钟；含可选看一条 Citely 抖音案例视频，约 1 分钟，文中作为练习素材）",
    "output": "认知觉醒",
    "tags": [
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "理解\"小而美=第一刀切小但切准\"而非做玩具——用 Citely、好事发生等案例看透围绕单一购买理由\"封装→强化→放大→传播\"四步打深，把大多数不确定性在起点就压缩掉，这才是普通人低风险创业的正确起步。",
    "prereqText": "一、在起心动念和开始编程之间（\"购买理由+填空题\"在本节用 Citely 等案例完整复盘收尾）"
  },
  {
    "code": "M8.1",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "一、什么是MicroSaaS？ 一个人也能做的订阅制生意",
    "difficulty": 1,
    "mins": 6,
    "d": 6,
    "minsText": "6 分钟（正文约 1900 字，纯阅读 ≈5 分钟，含 3 张配图）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "建立\"MicroSaaS = 窄人群 + 具体问题 + 小团队 + 可重复收入\"的判断框架，学会用\"重复性需求才能卖订阅、伪需求三连自查\"过滤掉假机会。",
    "prereqText": "无（衔接上一章节\"从抱怨找需求 / 供需失衡 / 新词站\"，但本节可独立读懂）"
  },
  {
    "code": "M8.2",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "二、MicroSaaS产品四件套：落地页、用户中心、核心功能、支付",
    "difficulty": 1,
    "mins": 6,
    "d": 6,
    "minsText": "6 分钟（正文约 2000 字，纯阅读 ≈5 分钟，含 5 张配图）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "拿到 MicroSaaS 的产品骨架地图——四件套各自解决\"进门/留下/掏钱/收钱\"，并理解前三块用现成方案、唯有核心功能（厨艺）才值得花三分之二以上时间。",
    "prereqText": "一、什么是MicroSaaS？"
  },
  {
    "code": "M8.3",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "三、Landing Page：你只有8秒，用8秒打动用户",
    "difficulty": 2,
    "mins": 25,
    "d": 25,
    "minsText": "25 分钟（正文约 3600 字 ≈9 分钟 + 17 张案例截图研读 + 末尾\"翻石头\"作业，需到导航站找 1 个落地页拆解 4 个问题 ≈15 分钟）",
    "output": "图文理解",
    "tags": [
      "海外SaaS",
      "增长SEO"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "用\"买时间/电梯演讲\"心智重做首屏（简洁·有力·差异化），看懂 Neon、Simplify 等案例的设计意图，并掌握首屏之下的标准结构与\"翻石头\"积累审美的方法。",
    "prereqText": "二、MicroSaaS产品四件套（落地页是四件套之一的展开）"
  },
  {
    "code": "M8.4",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "四、用户登录：别自己造轮子，用现成的认证服务",
    "difficulty": 4,
    "mins": 60,
    "d": 60,
    "minsText": "60 分钟（正文约 2800 字 ≈7 分钟，但含 7 步 BetterAuth 实操：装包、配 lib/auth.ts、迁库、API 路由、申请 Google OAuth 凭证、前端登录按钮、读取当前用户，OAuth 回调易卡需调试，含 16 张操作截图）",
    "output": "可上线产品（接通真实的注册/登录/Google OAuth 模块）",
    "tags": [
      "海外SaaS",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "学会用 BetterAuth 十几分钟接通邮箱/Google 登录（数据存自己 Neon 库），并理解匿名/免费/付费三类用户对应\"引导登录—引导付费—引导复购\"三套不同界面与策略。",
    "prereqText": "实战进阶阶段的 Next.js 基础（需已有 Next.js + Neon + Vercel 项目）；二、MicroSaaS产品四件套（用户中心一块的落地）"
  },
  {
    "code": "M8.5",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "五、海外订阅支付是怎么回事？",
    "difficulty": 5,
    "mins": 16,
    "d": 16,
    "minsText": "120+ 分钟（正文约 6400 字 ≈16 分钟 + 65 张配图；含 Creem/Dodo 后台配置、env、Webhook 路由与公网调试全流程。文中明确这是\"最大的一道门槛\"，零基础新手短时间内调不通，需反复试错，实际可能跨数天）",
    "output": "可上线产品（接通真实订阅支付链路）",
    "tags": [
      "海外SaaS",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "搞懂支付网关/Webhook/PCI 等概念与 Stripe·Paddle·Creem·Dodo·Waffo 五家的\"先审/后审\"封号风险差异，并能用测试卡跑通一条订阅支付链路（含 Webhook 签名校验与公网调试）。",
    "prereqText": "实战进阶阶段全部内容（文中明示未学完会\"看不懂、无从下手\"）；四、用户登录（付费墙绑定用户体系）"
  },
  {
    "code": "M8.6",
    "module": "M8",
    "stage": 3,
    "s": 3,
    "t": "六、极速开发指南：从零开始到正式上线，只需要1天",
    "difficulty": 5,
    "mins": 13,
    "d": 13,
    "minsText": "180+ 分钟（正文约 5200 字 ≈13 分钟 + 121 张配图；含申请 Sistine Starter、配置数据库/登录/支付、用 Codex 端到端实现 AI 试衣产品并部署的完整演练。文中以 Raphael 为例：核心功能 1 天、打磨细节 1 周）",
    "output": "可上线产品（端到端做出并部署一个可收款的 AI 产品）",
    "tags": [
      "海外SaaS",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "掌握\"用 Starter Kit 当 SaaS 底座 + 把核心功能接到现成用户/支付/权限系统\"的极速开发范式，能借助 Codex/Claude Code 从需求文档到上线，一天产出一个可收款的 MicroSaaS。",
    "prereqText": "本模块前五节（文中明示\"没法只看这一篇学会，是前面所有内容的串讲实操\"），尤其四、用户登录与五、海外订阅支付"
  },
  {
    "code": "M9.1",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "一、你的想法，该做成什么？",
    "difficulty": 1,
    "mins": 8,
    "d": 8,
    "minsText": "8 分钟（正文约 3100 字 ≈8 分钟，纯阅读，含 Nomad List/Figma/Grammarly/羊了个羊等案例图与 2 张形态决策树）",
    "output": "认知觉醒",
    "tags": [
      "商业认知",
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限",
    "essence": "动手前先用两个建模动作定方向——\"靠付费赚钱→海外Web、靠流量广告→国内微信\"选市场，\"选形态本质是选最短获客链路\"选形态，拿不准就先做 Web 原型让真实用户验证。",
    "prereqText": "无（本章开篇，独立可读）"
  },
  {
    "code": "M9.2",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "二、5 分钟做出你的第一个小程序",
    "difficulty": 2,
    "mins": 30,
    "d": 30,
    "minsText": "30 分钟（正文约 3500 字 ≈9 分钟 + 两个扣子编程实操：表情包工坊、虚拟试衣，各走\"描述需求→SPEC确认→AI生成(约3分钟)→预览→对话式调整\"，纯对话不碰代码，含约 25 张操作截图）",
    "output": "可运行demo",
    "tags": [
      "App小程序",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "纯零基础",
    "essence": "理解小程序\"13亿月活+零获客成本+30元启动+微信发钱扶持\"的窗口红利与\"广告分成批量起量 / 订阅深耕\"两条变现路，并能用扣子编程纯对话产出第一个可跑的小程序 demo（顺带搞懂 App ID 是什么）。",
    "prereqText": "一、你的想法该做成什么（已选定国内/小程序方向）；衔接前置课\"扣子编程\"与 SPEC 需求法"
  },
  {
    "code": "M9.3",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "三、用AI做一个微信小程序——进阶篇",
    "difficulty": 5,
    "mins": 30,
    "d": 30,
    "minsText": "300+ 分钟（正文约 12000 字 ≈30 分钟 + 11 步全流程实操：注册账号、领 AI 成长计划、开通云开发、TRAE 建 Taro 项目、AI 生成五个页面+计分函数、云函数/数据库联调、备案、审核上线、广告+订阅变现、增长引流。含备案等待(可达2-3周不可控)、审核被拒重提、云开发联调等卡点，跨多日，约 60+ 张截图）",
    "output": "可上线产品（端到端做出并上架一个能赚钱的 SBTI 测试小程序）",
    "tags": [
      "App小程序",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "从扣子编程\"毕业\"，用 TRAE CN + 微信云开发(免费后端)走完注册→开发→备案→审核→上线→变现→引流全链路，并掌握\"题目JSON+结果JSON+计分函数+分享裂变\"这套换套数据就能复制的测试类小程序通用架构。",
    "prereqText": "二、5分钟做出你的第一个小程序；需已装好 TRAE CN（前置课）、会基础 SPEC/AI 协作；涉及 Taro+React+TypeScript"
  },
  {
    "code": "M9.4",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "四、做个能在群里疯传的 AI 小游戏",
    "difficulty": 5,
    "mins": 20,
    "d": 20,
    "minsText": "240+ 分钟（正文约 8000 字 ≈20 分钟 + 实操：先用三条递进提示词在 TRAE 出 HTML5 单文件原型验证玩法，再搬进 Cocos Creator 正式开发、一键导出微信小游戏、接激励视频广告、走资质审核+备案上架。含手感/数值/美术需自己反复调，审核周期 3-8 周，跨多日）",
    "output": "可上线产品（做出并上架一个类羊了个羊的微信小游戏）",
    "tags": [
      "App小程序",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "先拆透羊了个羊\"死局错觉+轻/晒/瘾\"的成瘾设计，再用\"HTML5原型验玩法→Cocos正式开发→导出小游戏→接激励视频→分享裂变\"的模板化流程做出能群传的小游戏，并认清小游戏与小程序在类目/技术栈/审核/变现上的本质差异。",
    "prereqText": "三、用AI做一个微信小程序（复用账号注册/备案/审核/广告变现认知，但小游戏需另注册\"游戏\"类目账号）；涉及 Cocos Creator 引擎"
  },
  {
    "code": "M9.5",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "五、用 AI 开发手机 App，无论是安卓还是 iOS",
    "difficulty": 4,
    "mins": 13,
    "d": 13,
    "minsText": "120+ 分钟（正文约 5000 字 ≈13 分钟 + 实操：PWA 加 manifest+图标 2 分钟、Expo 建项目+Expo Go 真机预览+AI 写聊天界面、EAS Build 云打包、注册开发者账号、Google Play 创建应用/内部测试轨道/Service Account 配置提交。商店配置(尤其 Google Cloud Service Account)步骤繁琐，含约 30 张截图）",
    "output": "可上线产品（用 Expo 做出手机 App 并云打包、提交应用商店）",
    "tags": [
      "App小程序",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理清手机 App 三条路（PWA验证 / 扣子编程移动应用演示 / Expo正经做）的取舍，能复用已会的 React 技能用 Expo+EAS 把产品搬上手机、云端打包并提交 App Store / Google Play。",
    "prereqText": "实战进阶阶段 React/TypeScript/Next.js 基础（文中以已有\"纸片人男友\"Next.js 产品为起点，反复类比 React→React Native）"
  },
  {
    "code": "M9.6",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "六、用户付了钱，你怎么收？App变现的三条路",
    "difficulty": 4,
    "mins": 90,
    "d": 90,
    "minsText": "90 分钟（正文约 5000 字 ≈13 分钟 + 实操：RevenueCat 七步集成订阅(装 SDK、构建 development build、商店后台建订阅商品+Base Plan、RevenueCat 配 Entitlement/Offering/Paywall、初始化、展示付费墙、校验会员)，AdMob 六步集成激励视频。内购/广告须 development build 真机测试、不能用 Expo Go，含约 25 张截图与多段代码）",
    "output": "可上线产品（在 App 内接通内购订阅与激励视频广告）",
    "tags": [
      "App小程序",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "搞懂\"实物不抽成 / 虚拟商品必走内购\"的规则与苹果税(30%、小开发者15%、2025美国新政可绕开)，并能用 RevenueCat 接订阅、AdMob 接激励视频、Stripe 做外部支付，组合出\"免费+广告+订阅+消耗型\"四层变现模型。",
    "prereqText": "五、用 AI 开发手机 App（在 Expo 项目里集成）；实战进阶阶段 Next.js/Stripe 支付基础（外部支付一节复用）"
  },
  {
    "code": "M9.7",
    "module": "M9",
    "stage": 3,
    "s": 3,
    "t": "七、用AI开发桌面应用，无论是Windows还是Mac",
    "difficulty": 4,
    "mins": 90,
    "d": 90,
    "minsText": "90 分钟（正文约 5000 字 ≈13 分钟 + 实操：electron-vite 建项目、写 React 聊天界面、改窗口配置做透明悬浮陪伴窗、系统托盘/全局快捷键/系统通知、electron-builder 打包 .dmg/.exe、官网分发+自动更新、shell.openExternal+Deep Link 实现\"浏览器登录回跳\"。比手机 App 简单，无审核无抽成，含约 15 张截图与多段代码）",
    "output": "可上线产品（用 Electron 做出桌面应用并打包分发，接通登录与付费）",
    "tags": [
      "App小程序",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "认清桌面应用比手机 App 简单(无审核/无抽成/100%自控)且 Electron=Chrome+Node、写的还是你会的网页技术，能用 Electron+React 做出透明悬浮陪伴窗并打包分发，登录与付费走\"桌面端唤起浏览器、网站完成、Deep Link 回跳\"模式 100% 复用已有后端。",
    "prereqText": "实战进阶阶段 React 基础；前置已会 PWA(manifest)；最好已学过登录(BetterAuth)与支付(Stripe/Creem/Paddle)——本课登录付费直接复用网站那套"
  },
  {
    "code": "M10.1",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "一、AI不是工具，是员工：一次思维转变",
    "difficulty": 1,
    "mins": 13,
    "d": 13,
    "minsText": "13 分钟（约 5200 字纯阅读认知，无实操）",
    "output": "认知觉醒",
    "tags": [
      "通用底层"
    ],
    "track": "主干必修",
    "audience": "不限（需对 AI 编程有初步使用经验，理解规则文件/Skill/MCP 三个名词更佳）",
    "essence": "完成从\"使用 AI 工具\"到\"管理 AI 员工\"的心智切换，并学会用\"出错代价\"判断哪些规矩该口头叮嘱(prompt)、哪些必须代码锁死(hook)。",
    "prereqText": "无（默认已学过规则文件、Skill、MCP 的零散用法）"
  },
  {
    "code": "M10.2",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "二、浏览器自动化专项",
    "difficulty": 3,
    "mins": 35,
    "d": 35,
    "minsText": "35 分钟（约 8700 字阅读约 22 分钟 + 跟着 7 步路径自己跑通一个浏览器自动化流程约 13 分钟，调试可能更久）",
    "output": "可运行demo（把一件重复浏览器操作做成稳定 Skill）",
    "tags": [
      "AI员工自动化",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "不限（声称不用写代码也能做，但需懂 MCP 配置）",
    "essence": "学会\"先自己操作一遍→拆最小步骤→写SPEC→配浏览器工具→盯跑→封装Skill→定时任务\"七步法，把日常重复的网页操作交给 AI 自动完成。",
    "prereqText": "MCP（工位权限那一层）；建议先学过「一、AI不是工具，是员工」"
  },
  {
    "code": "M10.3",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "三、怎么教 AI 学会你的工作方式？Skills 和 SOP 的正确用法",
    "difficulty": 4,
    "mins": 80,
    "d": 80,
    "minsText": "80 分钟（约 23000 字阅读约 58 分钟 + 跟着写/改一份真实 SKILL.md 与 hook 约 20 分钟）",
    "output": "工具配置或环境搭建（一份瘦身的 SKILL.md + references/ + Hook + Subagent 的完整配置范式）",
    "tags": [
      "AI员工自动化",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（要会写 Skill / 配 MCP，能看懂 settings.json 片段）",
    "essence": "掌握 Skill(建议)/Hook(强制)/Subagent(隔离)三件套的分工与\"三问决策法\"，会用 progressive disclosure 写 100 行瘦身 SKILL.md，把多步任务拆成可追溯的流水线。",
    "prereqText": "Skill（写 SOP）、MCP；「二、浏览器自动化专项」（工位权限实操）"
  },
  {
    "code": "M10.4",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "四、Cowork/Codex：不用看代码，直接让 AI 交付结果",
    "difficulty": 3,
    "mins": 75,
    "d": 75,
    "minsText": "75 分钟（约 23000 字阅读约 58 分钟 + 装一个桌面工具并跑通一个带 hook 的 Skill 约 15-20 分钟）",
    "output": "工具配置或环境搭建（装上 Codex Desktop / Cowork / 国产替代，跑通一个 Skill + 加 Hook 兜底）",
    "tags": [
      "AI员工自动化",
      "海外SaaS"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（课程明确警告：没走完前 6 节、没写过 SKILL 的人用 GUI 工具最容易用废）",
    "essence": "理解图形化工具(Codex Desktop=给会写代码者加速 / Cowork=给不写代码者上岗)只是把命令行能力摆上桌面，按\"角色+场景\"选工具，并对 Computer Use 这把\"无撤销的手\"保持克制（删除/批量/对外发送必须人工审批）。",
    "prereqText": "「三、Skills 和 SOP 的正确用法」直接接续；并需先学过 Claude Code、MCP、Skill、预制菜/积木思维、「一、AI不是工具」共 6 节"
  },
  {
    "code": "M10.5",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "五、OpenClaw：用飞书指挥 AI 干活，像使唤真人一样",
    "difficulty": 4,
    "mins": 100,
    "d": 100,
    "minsText": "100 分钟（约 25700 字阅读约 64 分钟 + 飞书官方版跑 5 个 Demo 约 30 分钟；进阶 Lighthouse 服务器部署另需更久）",
    "output": "工具配置或环境搭建（飞书官方 OpenClaw 跑通 5 个 Demo / 腾讯云 Lighthouse 部署独立 AI 工位 + 迁移 Skill + 配 cron）",
    "tags": [
      "AI员工自动化",
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（需愿意承担服务器/API Key/权限/安全配置责任；轻量飞书官方版门槛低，严肃版需懂服务器）",
    "essence": "把调好的 Skill/Hook/Subagent 搬进飞书里的 OpenClaw，给 AI 员工配独立电脑、独立账号、最小权限和日报机制（绝不装在主力电脑），实现\"你在 IM 发一句话、AI 在自己工位上干完主动汇报\"。",
    "prereqText": "「三、Skills 和 SOP 的正确用法」、「四、Cowork/Codex」（Skill、Hook、Subagent、Scheduled Tasks 全套要先会）"
  },
  {
    "code": "M10.6",
    "module": "M10",
    "stage": 4,
    "s": 4,
    "t": "六、实战：真正拥有自己的 AI 员工，让他完成复杂真实任务",
    "difficulty": 5,
    "mins": 43,
    "d": 43,
    "minsText": "入门 3 天 / 进阶 7 天 / 挑战 14 天（约 17000 字阅读约 43 分钟，但本节是作业课，主体耗时在 3-14 天的项目执行与复盘，难度在面对真实反馈而非技术）",
    "output": "可上线产品（三选一综合实战：AI自我教练 / 私人晨报 / 14天零人公司——挑战档要面对真实付费/真粉/真订阅）",
    "tags": [
      "AI员工自动化",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（自检 4 项缺一不可：写过 SKILL.md、装过 Codex Desktop/Cowork、装过 OpenClaw）",
    "essence": "用前几节的全套能力独立交付一个会长期自动跑的 AI 员工项目，并在真实市场反馈下学会\"把'我是谁/我要什么'翻译成机器能执行的规则\"+ 双档验收(失败也算成功，只要写明下一轮假设)。",
    "prereqText": "「三、Skills 和 SOP 的正确用法」、「四、Cowork/Codex」、「五、OpenClaw」全部"
  },
  {
    "code": "M11.1",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "一、给AI定规矩",
    "difficulty": 3,
    "mins": 20,
    "d": 20,
    "minsText": "20 分钟（标题推断，正文未发布；含跟着配置规则的实操时间）",
    "output": "工具配置或环境搭建（推断：建立 AI 编码规则文件 / 约束，如 rules、AGENTS.md 类）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础（已能用 AI 写出能跑的代码，开始遇到\"翻车\"）",
    "essence": "学会在动手前给 AI 立规矩，用约束把\"自由发挥\"框进可控范围，从源头减少翻车。",
    "prereqText": "无（本模块第一节，承接前序\"能写出 demo\"的能力）",
    "placeholder": true
  },
  {
    "code": "M11.2",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "二、用AI完成复杂需求的方法：SPEC驱动",
    "difficulty": 3,
    "mins": 25,
    "d": 25,
    "minsText": "25 分钟（标题推断，正文未发布；含照着写一份 SPEC 的实操）",
    "output": "图文理解（推断：SPEC 驱动的方法论 + 写法示范）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "面对复杂需求，先写 SPEC 再让 AI 实现，用\"规格说明\"替代含糊指令，让产出可预期、可验收。",
    "prereqText": "一、给AI定规矩",
    "placeholder": true
  },
  {
    "code": "M11.3",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "三、软件工程的真谛：高内聚、低耦合",
    "difficulty": 2,
    "mins": 12,
    "d": 12,
    "minsText": "12 分钟（标题推断，正文未发布；以阅读认知为主）",
    "output": "认知觉醒（推断：软件工程核心原则的理解）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "理解\"高内聚、低耦合\"这条工程铁律，知道为什么模块化的代码 AI 改起来才不会牵一发而动全身。",
    "prereqText": "二、用AI完成复杂需求的方法：SPEC驱动",
    "placeholder": true
  },
  {
    "code": "M11.4",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "四、单元测试：让AI每次写完，自动检查",
    "difficulty": 3,
    "mins": 25,
    "d": 25,
    "minsText": "25 分钟（标题推断，正文未发布；含让 AI 写测试并跑通的实操）",
    "output": "可运行demo（推断：带单元测试的可自动校验工程）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "用单元测试给 AI 的产出加一道自动关卡，让它每写完一段就自检，把\"看起来对\"变成\"测过是对的\"。",
    "prereqText": "三、软件工程的真谛：高内聚、低耦合",
    "placeholder": true
  },
  {
    "code": "M11.5",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "五、上下文工程，不是Prompt工程",
    "difficulty": 2,
    "mins": 12,
    "d": 12,
    "minsText": "12 分钟（标题推断，正文未发布；以阅读认知为主）",
    "output": "认知觉醒（推断：从 Prompt 工程到上下文工程的范式转变）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "认识到决定 AI 表现的关键不是措辞技巧，而是喂给它的上下文——管好上下文，才是稳定产出的根本。",
    "prereqText": "无（认知类，可独立理解；建议在前四节实操基础上）",
    "placeholder": true
  },
  {
    "code": "M11.6",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "六、从Vibe Coding到Vibe Engineering：不是抽卡，不是许愿，是交付",
    "difficulty": 2,
    "mins": 13,
    "d": 13,
    "minsText": "13 分钟（标题推断，正文未发布；以阅读认知为主）",
    "output": "认知觉醒（推断：方法论升华 / 工程化交付心法）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "完成从\"凭感觉抽卡式写代码\"到\"工程化交付\"的心态跃迁——不靠运气许愿，而靠流程拿到确定的结果。",
    "prereqText": "五、上下文工程，不是Prompt工程",
    "placeholder": true
  },
  {
    "code": "M11.7",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "七、一个AI不够用？那就建一支AI团队",
    "difficulty": 4,
    "mins": 25,
    "d": 25,
    "minsText": "25 分钟（标题推断，正文未发布；含搭建多 Agent 协作的实操）",
    "output": "可运行demo（推断：多 Agent 协作配置 / 分工编排）",
    "tags": [
      "工程内功",
      "AI员工自动化"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "当单个 AI 力不从心时，把它拆成分工协作的一支 AI 团队，用多角色编排扛下更复杂的工程任务。",
    "prereqText": "六、从Vibe Coding到Vibe Engineering：不是抽卡，不是许愿，是交付",
    "placeholder": true
  },
  {
    "code": "M11.8",
    "module": "M11",
    "stage": 4,
    "s": 4,
    "t": "八、让AI输出可控：从自由发挥到结构化交付",
    "difficulty": 3,
    "mins": 18,
    "d": 18,
    "minsText": "18 分钟（标题推断，正文未发布；认知为主，含少量配置）",
    "output": "认知觉醒（推断：可控输出 / 结构化交付的综合方法）",
    "tags": [
      "工程内功"
    ],
    "track": "主干必修",
    "audience": "需要前置基础",
    "essence": "收束全模块——掌握让 AI 输出从\"自由发挥\"收敛到\"结构化交付\"的整套手段，让结果稳定可用、可复现。",
    "prereqText": "七、一个AI不够用？那就建一支AI团队（亦为全模块收束）",
    "placeholder": true
  },
  {
    "code": "M12.1",
    "module": "M12",
    "stage": 4,
    "s": 4,
    "t": "一、冷启动：找人，而不是等人",
    "difficulty": 2,
    "mins": 15,
    "d": 15,
    "minsText": "⚠️ 待定（正文未发布；按同类增长认知节估 8-15 分钟）",
    "output": "⚠️ 认知觉醒（推断：冷启动方法论，主动获客而非被动等待）",
    "tags": [
      "增长SEO",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "有产品经验更佳（已做出产品、面临 0→1 获客）",
    "essence": "⚠️ 推断——破除「东西做好用户自然会来」的幻觉，学会主动去找第一批种子用户。",
    "prereqText": "无（需已有可上线产品，但非本模块前置节）",
    "placeholder": true
  },
  {
    "code": "M12.2",
    "module": "M12",
    "stage": 4,
    "s": 4,
    "t": "二、好产品自己会长腿：在产品里种下传播的种子",
    "difficulty": 2,
    "mins": 15,
    "d": 15,
    "minsText": "⚠️ 待定（正文未发布；按同类增长认知节估 8-15 分钟）",
    "output": "⚠️ 认知觉醒（推断：产品内置传播/裂变机制的设计思路）",
    "tags": [
      "增长SEO",
      "商业认知"
    ],
    "track": "主干必修",
    "audience": "有产品经验更佳（已有产品、想做自传播增长）",
    "essence": "⚠️ 推断——学会在产品里设计自传播钩子，让用户使用即带来新用户，把增长内建进产品本身。",
    "prereqText": "一、冷启动：找人，而不是等人",
    "placeholder": true
  },
  {
    "code": "M12.3",
    "module": "M12",
    "stage": 4,
    "s": 4,
    "t": "三、一个人的生意，怎么越做越大？",
    "difficulty": 2,
    "mins": 15,
    "d": 15,
    "minsText": "⚠️ 待定（正文未发布；按同类增长认知节估 8-15 分钟）",
    "output": "⚠️ 认知觉醒（推断：单人/小团队业务的规模化路径）",
    "tags": [
      "商业认知",
      "增长SEO"
    ],
    "track": "主干必修",
    "audience": "有产品经验更佳（独立开发者 / 一人公司想规模化）",
    "essence": "⚠️ 推断——理解一人生意如何借助杠杆（自动化 / AI / 复利渠道）持续放大，而不被个人精力上限锁死。",
    "prereqText": "一、冷启动：找人，而不是等人",
    "placeholder": true
  }
];

// 架构图组件 → 课程节（点组件看课 / 按形态强调）
const COMPONENT_COURSES = {
  "demo": [
    "M2.2",
    "M2.6",
    "M2.7",
    "M2.8"
  ],
  "frontend": [
    "M3.1",
    "M3.5",
    "M5.2",
    "M8.3"
  ],
  "backend": [
    "M3.1",
    "M3.5",
    "M4.3"
  ],
  "db": [
    "M3.3",
    "M5.1"
  ],
  "auth": [
    "M3.4",
    "M8.4"
  ],
  "payment": [
    "M8.5",
    "M9.6"
  ],
  "analytics": [
    "M6.5"
  ],
  "cdn": [
    "M5.7"
  ],
  "queue": [
    "M5.9"
  ],
  "agent": [
    "M6.2",
    "M6.3",
    "M10.1",
    "M10.2",
    "M10.3",
    "M10.4",
    "M10.5",
    "M10.6"
  ]
};

// 产品形态(diagnosis.form) → 组件分级（core必备 / optional可选）
const FORM_COMPONENTS = {
  "web": {
    "core": [
      "demo",
      "frontend",
      "backend",
      "db",
      "auth",
      "payment"
    ],
    "optional": [
      "analytics",
      "cdn",
      "queue",
      "agent"
    ]
  },
  "miniprog": {
    "core": [
      "demo",
      "frontend",
      "backend",
      "db"
    ],
    "optional": [
      "auth",
      "payment",
      "analytics"
    ]
  },
  "app": {
    "core": [
      "demo",
      "frontend",
      "backend",
      "db",
      "auth",
      "payment"
    ],
    "optional": [
      "analytics",
      "cdn",
      "queue"
    ]
  },
  "desktop": {
    "core": [
      "demo",
      "frontend",
      "backend",
      "auth"
    ],
    "optional": [
      "db",
      "payment",
      "queue"
    ]
  },
  "agent": {
    "core": [
      "demo",
      "backend",
      "agent"
    ],
    "optional": [
      "db",
      "queue"
    ]
  }
};

// 诊断闸门 → 按产品形态的 5 阶段定制学习路线
const FORM_PATHS = {
  "teach": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "把想法跟 AI 聊成清晰 SPEC"
    },
    {
      "phase": "原型",
      "code": "M2.6",
      "note": "动手做出第一个 AI 产品"
    },
    {
      "phase": "开发",
      "code": "M6.4",
      "note": "用真技术重做，做成完整产品"
    },
    {
      "phase": "部署",
      "code": "M5.4",
      "note": "部署上线，全世界都能访问"
    },
    {
      "phase": "上线",
      "code": "M12.1",
      "note": "找到第一批真实用户"
    }
  ],
  "web": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "把想法跟 AI 聊成清晰 SPEC"
    },
    {
      "phase": "原型",
      "code": "M2.2",
      "note": "10 分钟跑出第一版能访问的网页"
    },
    {
      "phase": "开发",
      "code": "M8.4",
      "note": "接登录 / 支付，做成能收钱的 SaaS"
    },
    {
      "phase": "部署",
      "code": "M5.4",
      "note": "部署到线上，全世界都能访问"
    },
    {
      "phase": "上线",
      "code": "M12.1",
      "note": "找到前 100 个真实用户"
    }
  ],
  "miniprog": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "把想法跟 AI 聊成清晰 SPEC"
    },
    {
      "phase": "原型",
      "code": "M9.2",
      "note": "5 分钟做出第一个小程序 demo"
    },
    {
      "phase": "开发",
      "code": "M9.3",
      "note": "Taro + 云开发，做成完整小程序"
    },
    {
      "phase": "部署",
      "code": "M9.3",
      "note": "备案、审核、上架变现"
    },
    {
      "phase": "上线",
      "code": "M12.1",
      "note": "找到第一批用户"
    }
  ],
  "app": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "把想法跟 AI 聊成清晰 SPEC"
    },
    {
      "phase": "原型",
      "code": "M2.2",
      "note": "先用网页快速验证核心玩法"
    },
    {
      "phase": "开发",
      "code": "M9.5",
      "note": "用 Expo 做成手机 App"
    },
    {
      "phase": "部署",
      "code": "M9.6",
      "note": "上架商店 + 接入内购变现"
    },
    {
      "phase": "上线",
      "code": "M12.1",
      "note": "找到第一批用户"
    }
  ],
  "desktop": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "把想法跟 AI 聊成清晰 SPEC"
    },
    {
      "phase": "原型",
      "code": "M2.2",
      "note": "先用网页验证核心功能"
    },
    {
      "phase": "开发",
      "code": "M9.7",
      "note": "用 Electron 做成桌面应用"
    },
    {
      "phase": "部署",
      "code": "M9.7",
      "note": "打包 .dmg/.exe，官网分发"
    },
    {
      "phase": "上线",
      "code": "M12.1",
      "note": "找到第一批用户"
    }
  ],
  "agent": [
    {
      "phase": "需求定义",
      "code": "M2.3",
      "note": "想清楚要 AI 替你干什么活"
    },
    {
      "phase": "原型",
      "code": "M2.6",
      "note": "先做一个最小 AI 产品建手感"
    },
    {
      "phase": "开发",
      "code": "M10.3",
      "note": "用 Skill/SOP 教会 AI 你的工作方式"
    },
    {
      "phase": "部署",
      "code": "M10.5",
      "note": "用 OpenClaw 让 AI 员工上岗"
    },
    {
      "phase": "上线",
      "code": "M10.6",
      "note": "交给 AI 完成真实复杂任务"
    }
  ]
};
