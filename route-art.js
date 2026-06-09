/* 路线地图素材配置 — 由 prototype/stage_assets.py 生成。
   每条路线 → 生态海(sea) + 生态岛池(isles, 透明PNG, 可单独点亮)。
   岛数最终以 routes.js 的阶段数为准；岛池不够则循环复用，多出忽略。 */
const ROUTE_ART = {
  "miniprogram": {
    "biome": "热带翠岛",
    "sea": "assets/route-seas/sea-miniprogram.png",
    "isles": [
      "assets/route-isles/miniprogram-1.png",
      "assets/route-isles/miniprogram-2.png",
      "assets/route-isles/miniprogram-3.png",
      "assets/route-isles/miniprogram-4.png"
    ]
  },
  "aiwebsite": {
    "biome": "珊瑚蔚蓝",
    "sea": "assets/route-seas/sea-aiwebsite.png",
    "isles": [
      "assets/route-isles/aiwebsite-1.png",
      "assets/route-isles/aiwebsite-2.png",
      "assets/route-isles/aiwebsite-3.png",
      "assets/route-isles/aiwebsite-4.png"
    ]
  },
  "minigame": {
    "biome": "火山",
    "sea": "assets/route-seas/sea-minigame.png",
    "isles": [
      "assets/route-isles/minigame-1.png",
      "assets/route-isles/minigame-2.png",
      "assets/route-isles/minigame-3.png",
      "assets/route-isles/minigame-4.png"
    ]
  },
  "app": {
    "biome": "紫调暮光",
    "sea": "assets/route-seas/sea-app.png",
    "isles": [
      "assets/route-isles/app-1.png",
      "assets/route-isles/app-2.png",
      "assets/route-isles/app-3.png"
    ]
  },
  "aiemployee": {
    "biome": "港湾城",
    "sea": "assets/route-seas/sea-aiemployee.png",
    "isles": [
      "assets/route-isles/aiemployee-1.png",
      "assets/route-isles/aiemployee-2.png",
      "assets/route-isles/aiemployee-3.png",
      "assets/route-isles/aiemployee-4.png"
    ]
  },
  "automedia": {
    "biome": "落日金",
    "sea": "assets/route-seas/sea-automedia.png",
    "isles": [
      "assets/route-isles/automedia-1.png",
      "assets/route-isles/automedia-2.png",
      "assets/route-isles/automedia-3.png"
    ]
  },
  "briefing": {
    "biome": "晨曦薄雾",
    "sea": "assets/route-seas/sea-briefing.png",
    "isles": [
      "assets/route-isles/briefing-1.png",
      "assets/route-isles/briefing-2.png",
      "assets/route-isles/briefing-3.png"
    ]
  },
  "workflow": {
    "biome": "丛林瀑布",
    "sea": "assets/route-seas/sea-workflow.png",
    "isles": [
      "assets/route-isles/workflow-1.png",
      "assets/route-isles/workflow-2.png",
      "assets/route-isles/workflow-3.png"
    ]
  },
  "claudecode": {
    "biome": "极光松林",
    "sea": "assets/route-seas/sea-claudecode.png",
    "isles": [
      "assets/route-isles/claudecode-1.png",
      "assets/route-isles/claudecode-2.png",
      "assets/route-isles/claudecode-3.png"
    ]
  },
  "mcp": {
    "biome": "冰川水晶",
    "sea": "assets/route-seas/sea-mcp.png",
    "isles": [
      "assets/route-isles/mcp-1.png",
      "assets/route-isles/mcp-2.png",
      "assets/route-isles/mcp-3.png"
    ]
  },
  "spec": {
    "biome": "雾白浅滩",
    "sea": "assets/route-seas/sea-spec.png",
    "isles": [
      "assets/route-isles/spec-1.png",
      "assets/route-isles/spec-2.png"
    ]
  },
  "idea": {
    "biome": "灯塔礁",
    "sea": "assets/route-seas/sea-idea.png",
    "isles": [
      "assets/route-isles/idea-1.png",
      "assets/route-isles/idea-2.png",
      "assets/route-isles/idea-3.png",
      "assets/route-isles/idea-4.png"
    ]
  }
};
if (typeof window !== 'undefined') window.ROUTE_ART = ROUTE_ART;
