/* 路线地图素材配置 — 由 prototype/stage_assets.py 生成。
   每条路线 → 生态海(sea) + 生态岛池(isles, 透明PNG, 可单独点亮)。
   岛数最终以 routes.js 的阶段数为准；岛池不够则循环复用，多出忽略。 */
const ROUTE_ART = {
  "miniprogram": {
    "biome": "热带翠岛",
    "sea": "assets/route-seas/sea-miniprogram.webp",
    "isles": [
      "assets/route-isles/miniprogram-1.webp",
      "assets/route-isles/miniprogram-2.webp",
      "assets/route-isles/miniprogram-3.webp",
      "assets/route-isles/miniprogram-4.webp"
    ]
  },
  "aiwebsite": {
    "biome": "珊瑚蔚蓝",
    "sea": "assets/route-seas/sea-aiwebsite.webp",
    "isles": [
      "assets/route-isles/aiwebsite-1.webp",
      "assets/route-isles/aiwebsite-2.webp",
      "assets/route-isles/aiwebsite-3.webp",
      "assets/route-isles/aiwebsite-4.webp"
    ]
  },
  "minigame": {
    "biome": "火山",
    "sea": "assets/route-seas/sea-minigame.webp",
    "isles": [
      "assets/route-isles/minigame-1.webp",
      "assets/route-isles/minigame-2.webp",
      "assets/route-isles/minigame-3.webp",
      "assets/route-isles/minigame-4.webp"
    ]
  },
  "app": {
    "biome": "紫调暮光",
    "sea": "assets/route-seas/sea-app.webp",
    "isles": [
      "assets/route-isles/app-1.webp",
      "assets/route-isles/app-2.webp",
      "assets/route-isles/app-3.webp"
    ]
  },
  "aiemployee": {
    "biome": "港湾城",
    "sea": "assets/route-seas/sea-aiemployee.webp",
    "isles": [
      "assets/route-isles/aiemployee-1.webp",
      "assets/route-isles/aiemployee-2.webp",
      "assets/route-isles/aiemployee-3.webp",
      "assets/route-isles/aiemployee-4.webp"
    ]
  },
  "automedia": {
    "biome": "落日金",
    "sea": "assets/route-seas/sea-automedia.webp",
    "isles": [
      "assets/route-isles/automedia-1.webp",
      "assets/route-isles/automedia-2.webp",
      "assets/route-isles/automedia-3.webp"
    ]
  },
  "workflow": {
    "biome": "丛林瀑布",
    "sea": "assets/route-seas/sea-workflow.webp",
    "isles": [
      "assets/route-isles/workflow-1.webp",
      "assets/route-isles/workflow-2.webp",
      "assets/route-isles/workflow-3.webp"
    ]
  },
  "claudecode": {
    "biome": "极光松林",
    "sea": "assets/route-seas/sea-claudecode.webp",
    "isles": [
      "assets/route-isles/claudecode-1.webp",
      "assets/route-isles/claudecode-2.webp",
      "assets/route-isles/claudecode-3.webp"
    ]
  },
  "mcp": {
    "biome": "冰川水晶",
    "sea": "assets/route-seas/sea-mcp.webp",
    "isles": [
      "assets/route-isles/mcp-1.webp",
      "assets/route-isles/mcp-2.webp",
      "assets/route-isles/mcp-3.webp"
    ]
  },
  "spec": {
    "biome": "雾白浅滩",
    "sea": "assets/route-seas/sea-spec.webp",
    "isles": [
      "assets/route-isles/spec-1.webp",
      "assets/route-isles/spec-2.webp"
    ]
  },
  "idea": {
    "biome": "灯塔礁",
    "sea": "assets/route-seas/sea-idea.webp",
    "isles": [
      "assets/route-isles/idea-1.webp",
      "assets/route-isles/idea-2.webp",
      "assets/route-isles/idea-3.webp",
      "assets/route-isles/idea-4.webp"
    ]
  }
};
if (typeof window !== 'undefined') window.ROUTE_ART = ROUTE_ART;
