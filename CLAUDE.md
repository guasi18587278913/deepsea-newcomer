# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目性质

深海圈「AI 编程课程」新人常态化运营的**静态原型站**。纯 HTML/CSS/JS，无构建、无依赖、无后端、无包管理器。每个页面是一个单文件 demo，状态用 `localStorage` 模拟，所有"AI / 推荐 / 评测"都是 mock。

## 预览 / 调试

没有 dev server / 测试 / lint。直接在浏览器打开 HTML 即可：

```
open welcome.html      # 入口（首次访问走 6 步问卷）
open welcome.html?fresh=1   # 清空 localStorage 重置 demo
open welcome.html?step=5    # 跳到指定步骤
open learn.html?code=A1     # 路由到具体课程
open toolbox.html?t=stack   # 路由到具体工具
open diagnosis.html?from=welcome  # 诊断完返回 welcome step 5
```

`.qa-screenshots/` 存放视觉 QA 截图（不是测试产物）。

## 页面与跳转

| 页面 | 作用 | 关键路由参数 |
|------|------|-------------|
| `welcome.html` | 6 步新人引导问卷 | `?fresh=1` 重置 / `?step=N` 跳步骤 |
| `diagnosis.html` | AI 刘小排 项目诊断（独立页） | `?from=welcome` 决定完成后回 welcome 还是 roadmap |
| `roadmap.html` | 学习路线 / 知识地图 / 阶段作业提交 | — |
| `learn.html` | 单节课程页（侧边栏 = 当前阶段所有课） | `?code=A1` |
| `isle.html` | 单岛特写页（calendar 的二级「岛内闯关」：课程蛇形主线 + 直播/作业旁挂） | `?stage=A\|B\|C\|D` |
| `toolbox.html` | AI 工具箱聚合页（5 个 mock 工具） | `?t=idea-explore\|idea-validate\|stack\|landing\|cold-start` |
| `discuss.html` | 讨论区（"编辑室"） | — |
| `community.html` | 社区动态 | — |
| `showcase.html` | 成果墙（含用户公开提交） | — |
| `profile.html` | 个人中心 / 作业历史 | — |

顶栏导航在大多数页面手写复制了一份；改导航需要逐文件编辑。

## 共享脚本

`assistant.js` 是**唯一**的跨页面脚本（"AI 刘小排"右下角浮窗）：

- 自动挂载，不需要初始化调用；只用 `<script src="assistant.js"></script>` 引入。
- 读 `localStorage.ds_project` 给上下文化欢迎语。
- `mockReply()` 是占位关键词匹配，**接入真实 AI API 时只替换这一个函数**。
- 已引入的页面：community / learn / roadmap / profile / toolbox / showcase。welcome 和 diagnosis 没引（流程内）；discuss(广场) 也已移除——聊天页有真人 + 助教答疑，不再挂 AI 浮窗。

## localStorage 数据契约

所有 demo 状态都用 `ds_` 前缀，跨页面共享。**改任何键都要全局搜索**：

| Key | 写入方 | 读取方 | 内容 |
|-----|--------|--------|------|
| `ds_experience` | welcome、calendar（找航线问卷·routes-ui） | profile（身份标签） | 零基础 / 有基础 / 有产品经验 |
| `ds_goal` | welcome | profile（身份标签） | 做产品赚钱 / 提升技术 / 产品出海 |
| `ds_motive` | calendar（找航线问卷·routes-ui） | —（用户分层备用，暂无读取方） | 新人诉求编码：stuck / biz / keepup / try |
| `ds_daily_minutes` | welcome、calendar（找航线问卷·routes-ui） | roadmap | 20 / 30 / 60 / 120 / 0 |
| `ds_enrolled_at` | welcome | roadmap | `YYYY-MM-DD` 默认 `2026-05-04` |
| `ds_has_idea` | welcome, diagnosis | — | `has` / `no` |
| `ds_project` | diagnosis | roadmap, assistant.js | 完整项目对象（含 `name`、`stage`、`diagnosis` 等） |
| `ds_completed_demo` | learn, roadmap | learn, roadmap | 完成课程 code 数组，如 `["A1","A2",...]` |
| `ds_ship_level` | calendar (setShipLevel) | calendar | 航海图小船已庆祝过的最高船级 1-4（只增不减）：① 防升级仪式重复弹窗 ② 船形态封底——撤销标记/退回前面阶段也不降级 |
| `ds_map_seen` | calendar（首次落地置 `'1'`） | calendar | 是否已进过大航海图；第二次起进 calendar 自动 `location.replace` 到当前所在岛的 `isle.html`（`?view=all` / 演示态 `?demo=` / 专属航线 `ds_route`≠full 时不跳） |
| `ds_submissions` | roadmap (submit modal) | roadmap, profile, showcase | 阶段作业数组 `[{stage, title, url, repo, desc, public, submittedAt}]` |
| `ds_started` | learn | — | `'true'` |
| `ds_dm_open` | discuss (openDM/发消息) | discuss | 已开私聊的人名数组，最近聊的在前，如 `["赵薇薇","王大锤"]` |
| `ds_dm_unread` | discuss | discuss | 私聊未读数 `{name: count}`，打开该私聊后清零 |
| `ds_chat_dm:<名字>` | discuss (send + 对方自动回) | discuss | 单个私聊的消息数组，复用 `ds_chat_` 机制（id 为 `dm:名字`） |

## 课程数据

**单一来源是 `roadmap.html` 里的 `COURSES` 数组**（约 1395 行起，77 节，code 形如 `A1`-`D19`）。`learn.html` 单独维护了一份 `COURSES`（约 380 行起），如果新增/改课节要**两边都改**，否则路由会断。

阶段定义：`A=快速入门 / B=实战进阶 / C=商业化 / D=增长`，对应 `STAGE_NAMES`。

项目阶段（独立于课程进度）：`PROJECT_STAGES = ['需求定义','原型','开发','部署','上线']`，由阶段作业提交触发推进，映射见 `STAGE_TO_PROJECT_IDX`（roadmap.html 约 2274 行）。

## 设计系统

每个页面在 `<style>` 顶部各自定义 `:root` CSS 变量（**没有共享 CSS**）。主色板基本一致：

- `--teal: #0d9488` / `--teal-bg: #e8f6f5`（主品牌色）
- `--deep-blue: #1a2942` / `#1e3a52`（文字 / 锚点）
- `--gold: #c89854`（稀疏使用，credentials 强调）
- `--bg-gradient`: porcelain teal 渐变

字体：Google Fonts CDN — Noto Serif SC（中文衬线大标题）、Sora / Inter（西文 sans）、JetBrains Mono、Fraunces（roadmap 用衬线变体）。

`roadmap.html` 注释提到 `DESIGN.md`，但仓库里没有该文件。

## 已归档 / 忽略

`_archive/` 是设计变体存档（welcome-a/b/c、roadmap-a..e、discuss-variant-A/B/C 等），已在 `.gitignore`。`mockups/` 也不入库。

## 提交规范

Conventional Commits + 中文描述。最近样例：
- `feat: V1.5 — 独立诊断页 + 全程清晰返回`
- `style(design): FINDING-004 — code-style indentation for replies`
- `fix: 修复消息列表无法滚动 + 提升文字可读性`
