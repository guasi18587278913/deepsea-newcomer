/* ==========================================================
   AI 刘小白 · 全站浮窗助手
   ----------------------------------------------------------
   单文件、零依赖。引入即用：<script src="assistant.js"></script>
   读取 localStorage 的 ds_project 给出上下文化欢迎语。
   mockReply() 是占位实现；真接入 AI 刘小白 API 时替换它即可。
   ========================================================== */
(function () {
  if (document.getElementById('assistant-root')) return; // 防重复

  /* ---------------- CSS ---------------- */
  const css = `
#assistant-root { position: fixed; z-index: 9999; bottom: 24px; right: 24px; font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

.assistant-btn {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #14b8a6 0%, #1a2942 100%);
  color: #fff;
  display: grid; place-items: center;
  font-size: 22px; font-weight: 700;
  font-family: 'Songti SC', 'STSong', Georgia, serif;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35), 0 2px 6px rgba(0,0,0,.08);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.assistant-btn:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(13, 148, 136, 0.45); }
.assistant-btn .pulse-dot {
  position: absolute; top: 4px; right: 4px;
  width: 10px; height: 10px;
  border-radius: 50%; background: #22c55e;
  border: 2px solid #fff;
}

.assistant-panel {
  position: absolute;
  bottom: 72px; right: 0;
  width: 380px; height: 560px;
  max-height: calc(100vh - 120px);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(30, 58, 82, 0.18), 0 2px 8px rgba(0,0,0,.06);
  display: none;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e8eaed;
}
.assistant-panel.open { display: flex; animation: slide-in 0.22s ease; }
@keyframes slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

.assistant-header {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #e8eaed;
  background: linear-gradient(180deg, #f7f8fa 0%, #fff 100%);
  flex-shrink: 0;
}
.assistant-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #14b8a6 0%, #1a2942 100%);
  color: #fff;
  display: grid; place-items: center;
  font-size: 14px; font-weight: 700;
  font-family: 'Songti SC', 'STSong', Georgia, serif;
}
.assistant-name { font-size: 14px; font-weight: 700; color: #1a2942; line-height: 1.2; }
.assistant-status { font-size: 11px; color: #14b8a6; font-family: 'SF Mono', monospace; display: flex; align-items: center; gap: 4px; }
.assistant-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
.assistant-close {
  margin-left: auto;
  width: 28px; height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: grid; place-items: center;
  font-size: 18px;
  transition: all .15s;
}
.assistant-close:hover { background: #f0f2f4; color: #1a2942; }

.assistant-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
}

.assistant-msg { display: flex; gap: 8px; max-width: 92%; }
.assistant-msg .msg-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #14b8a6 0%, #1a2942 100%);
  color: #fff;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 700;
  font-family: 'Songti SC', 'STSong', Georgia, serif;
  flex-shrink: 0;
}
.assistant-msg .msg-text {
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 13.5px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.assistant-msg.ai .msg-text {
  background: #fff; color: #1a1a2e;
  border: 1px solid #e8eaed;
  border-top-left-radius: 4px;
}
.assistant-msg.user { align-self: flex-end; flex-direction: row-reverse; }
.assistant-msg.user .msg-text {
  background: #14b8a6; color: #fff;
  border-top-right-radius: 4px;
}

.assistant-suggest {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 0 16px 12px;
  background: #f9fafb;
}
.assistant-suggest-chip {
  font-size: 12px; padding: 5px 10px;
  border: 1px solid #dde7ea;
  border-radius: 999px;
  background: #fff;
  color: #5c7a8a;
  cursor: pointer;
  transition: all 0.15s;
}
.assistant-suggest-chip:hover {
  border-color: #14b8a6;
  color: #0d9488;
  background: #e6f7f5;
}

.assistant-input-wrap {
  display: flex; gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e8eaed;
  background: #fff;
  flex-shrink: 0;
}
.assistant-input {
  flex: 1;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: inherit;
  font-size: 13.5px;
  color: #1a1a2e;
  resize: none;
  outline: none;
  max-height: 80px;
  line-height: 1.5;
}
.assistant-input:focus { border-color: #14b8a6; }
.assistant-send {
  border: none;
  background: #1a2942;
  color: #fff;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.assistant-send:hover { opacity: 0.88; }
.assistant-send:disabled { opacity: 0.35; cursor: not-allowed; }

.assistant-typing {
  display: flex; gap: 4px;
  padding: 12px 14px;
}
.assistant-typing span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: typing 1.2s infinite;
}
.assistant-typing span:nth-child(2) { animation-delay: 0.2s; }
.assistant-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}

@media (max-width: 640px) {
  #assistant-root { bottom: 16px; right: 16px; }
  .assistant-panel { width: calc(100vw - 32px); max-width: 380px; }
}
`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- HTML ---------------- */
  const root = document.createElement('div');
  root.id = 'assistant-root';
  root.innerHTML = `
<button class="assistant-btn" id="assistantBtn" title="问 AI 刘小白">
  白
  <span class="pulse-dot"></span>
</button>
<div class="assistant-panel" id="assistantPanel">
  <div class="assistant-header">
    <div class="assistant-avatar">白</div>
    <div>
      <div class="assistant-name">AI 刘小白</div>
      <div class="assistant-status">在线 · 通常 5 秒内回复</div>
    </div>
    <button class="assistant-close" id="assistantClose" title="关闭">×</button>
  </div>
  <div class="assistant-messages" id="assistantMessages"></div>
  <div class="assistant-suggest" id="assistantSuggest"></div>
  <div class="assistant-input-wrap">
    <textarea class="assistant-input" id="assistantInput" rows="1" placeholder="问刘小白任何问题..."></textarea>
    <button class="assistant-send" id="assistantSend">发送</button>
  </div>
</div>
`;
  document.body.appendChild(root);

  /* ---------------- WIRE ---------------- */
  const btn = document.getElementById('assistantBtn');
  const panel = document.getElementById('assistantPanel');
  const closeBtn = document.getElementById('assistantClose');
  const input = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSend');
  const messages = document.getElementById('assistantMessages');
  const suggest = document.getElementById('assistantSuggest');

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      setTimeout(() => input.focus(), 250);
    }
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  /* ---------------- INIT ---------------- */
  function loadProject() {
    try { return JSON.parse(localStorage.getItem('ds_project') || 'null'); }
    catch (e) { return null; }
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'assistant-msg ' + role;
    div.innerHTML = role === 'ai'
      ? '<div class="msg-avatar">白</div><div class="msg-text">' + escapeHtml(text) + '</div>'
      : '<div class="msg-text">' + escapeHtml(text) + '</div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  /* suggestion item 支持两种形态：
       字符串 → 点击当成用户消息发送
       { text, href } → 点击直接跳转到 href（用于"打开工具箱"这类导航型 chip） */
  function setSuggestions(arr) {
    suggest.innerHTML = arr.map(item => {
      if (typeof item === 'string') {
        return '<div class="assistant-suggest-chip" data-text="' + escapeHtml(item) + '">' + escapeHtml(item) + '</div>';
      }
      const hrefAttr = item.href ? ' data-href="' + escapeHtml(item.href) + '"' : '';
      const arrow = item.href ? ' <span style="font-size:10px;opacity:.55;margin-left:2px;">↗</span>' : '';
      return '<div class="assistant-suggest-chip" data-text="' + escapeHtml(item.text) + '"' + hrefAttr + '>' + escapeHtml(item.text) + arrow + '</div>';
    }).join('');
    suggest.querySelectorAll('.assistant-suggest-chip').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.href) {
          location.href = el.dataset.href;
          return;
        }
        input.value = el.dataset.text;
        send();
      });
    });
  }

  function initGreeting() {
    const project = loadProject();
    let greet, suggestions;
    if (project) {
      greet = 'Hi 我是 AI 刘小白 👋 看到你在做「' + project.name + '」，目前在「' + (project.stage || '需求定义') + '」阶段。\n\n有什么需要我帮的？';
      suggestions = [
        '帮我拆解下一步要做什么',
        '这个阶段最容易踩什么坑？',
        '推荐对应的课程节点',
        '检查下我的 SPEC'
      ];
    } else {
      greet = 'Hi 我是 AI 刘小白 👋\n\n你可以问我课程任何问题，或让我帮你梳理一个 idea。';
      suggestions = [
        '怎么找一个能赚钱的 idea',
        '零基础该从哪节课开始',
        '推荐一个技术栈',
        '怎么写 SPEC'
      ];
    }
    addMessage('ai', greet);
    setSuggestions(suggestions);
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'assistant-msg ai';
    div.id = 'assistant-typing-row';
    div.innerHTML = '<div class="msg-avatar">白</div><div class="msg-text" style="padding:0;background:transparent;border:none;"><div class="assistant-typing"><span></span><span></span><span></span></div></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const row = document.getElementById('assistant-typing-row');
    if (row) row.remove();
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    suggest.innerHTML = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      const r = mockReply(text);
      addMessage('ai', r.text);
      if (r.suggestions) setSuggestions(r.suggestions);
    }, 600 + Math.random() * 500);
  }

  /* ---------------- MOCK REPLY ----------------
     占位实现：基于关键词匹配返回有针对性的回答。
     真接入 AI 刘小白 API 时只换这个函数。
     ------------------------------------------ */
  function mockReply(text) {
    const t = text.toLowerCase();
    const project = loadProject();

    if (/idea|想法|做什么|做啥|方向/i.test(text)) {
      return {
        text: '可以去工具箱里用 "Idea 探索器"（没想法时用）或 "Idea 验证器"（有想法时用）。两个工具都在顶栏的工具箱里。',
        suggestions: [
          { text: '打开 Idea 探索器', href: 'toolbox.html?t=idea-explore' },
          { text: '打开 Idea 验证器', href: 'toolbox.html?t=idea-validate' }
        ]
      };
    }
    if (/技术栈|框架|用什么|tech stack/i.test(text)) {
      return {
        text: '工具箱里有 "技术栈推荐" 工具。你选产品类型 + 自己的水平 + 面向市场，会给你一套上手就能开干的栈。',
        suggestions: [
          { text: '打开技术栈推荐', href: 'toolbox.html?t=stack' },
          '零基础推荐什么栈'
        ]
      };
    }
    if (/落地页|landing|文案/i.test(text)) {
      return {
        text: '工具箱有 "落地页文案生成器"，输入产品信息能出"8 秒打动用户版本"。课程里 C11 讲落地页方法论，可以配合看。',
        suggestions: [
          { text: '打开落地页生成器', href: 'toolbox.html?t=landing' },
          { text: '打开 C11 课程', href: 'learn.html?code=C11' }
        ]
      };
    }
    if (/冷启动|没人用|找用户|增长/i.test(text)) {
      return {
        text: '工具箱里的 "冷启动剧本" 会给你 7 个具体动作（去哪个平台发什么）。课程对应 D16 节。\n\n核心心法：前 100 个用户都得自己一个一个聊出来，不是流量推来的。',
        suggestions: [
          { text: '打开冷启动剧本', href: 'toolbox.html?t=cold-start' },
          { text: '打开 D16 课程', href: 'learn.html?code=D16' }
        ]
      };
    }
    if (/spec|需求|怎么写/i.test(text)) {
      return {
        text: '一份好 SPEC 包括：\n1. 一句话产品描述\n2. 目标用户（具体，不要"年轻人"这种）\n3. 核心场景 3 个\n4. 必须有的功能 / 暂时不要的功能\n5. 给 AI 的具体指令\n\n课程 A6 + B17（期中考试）有完整 SPEC 示例可以照着改。',
        suggestions: ['SPEC 长什么样', '让 AI 帮我打磨 SPEC']
      };
    }
    if (/bug|报错|错误|不工作/i.test(text)) {
      return {
        text: '把报错信息发给我，我看看。也建议先去 #踩坑经验 频道搜一下，80% 的坑别人已经踩过了。',
        suggestions: [
          { text: '打开 #踩坑经验 频道', href: 'discuss.html' },
          '常见 Bug 总结'
        ]
      };
    }
    if (/课程|哪一节|学/i.test(text)) {
      if (project) {
        return {
          text: '基于你在做「' + project.name + '」（' + project.stage + ' 阶段），我建议先看：\n• ' + stageToLessons(project.stage) + '\n\n卡在哪一节告诉我，我帮你具体拆解。',
          suggestions: ['拆解下一节内容', '推荐替代教学项目']
        };
      }
      return {
        text: '建议先看路线图，从快速入门第 1 节开始（这套课程有什么不同？）。零基础 12 节课大约 2-3 周能跑通第一个 demo。',
        suggestions: [
          { text: '打开路线图', href: 'roadmap.html' },
          { text: '打开 A1 第一节', href: 'learn.html?code=A1' }
        ]
      };
    }
    if (/支付|stripe|微信支付|收钱/i.test(text)) {
      return {
        text: '海外用 Stripe（首选）或 Paddle / LemonSqueezy（Stripe 不行的国家）。国内用微信支付或支付宝。\n\n课程 C13 节专门讲海外订阅支付。',
        suggestions: [
          { text: '打开 C13 课程', href: 'learn.html?code=C13' },
          'Stripe 还是 Paddle'
        ]
      };
    }
    if (/课程节点|对应课/i.test(text) && project) {
      return {
        text: stageToLessons(project.stage),
        suggestions: ['更详细拆解一节']
      };
    }
    if (/坑|常见问题/i.test(text)) {
      return {
        text: '前三大坑：\n1. SPEC 写太模糊 → AI 出的代码全跑偏\n2. 没用 git → 改坏了回不去\n3. 环境变量直接写在代码里 → 推到 GitHub 泄露密钥\n\n对应课程：A6 / B2 / B10。',
        suggestions: ['SPEC 怎么写', 'GitHub 怎么用']
      };
    }

    /* 兜底 */
    return {
      text: '收到。这个问题我给个大致方向：\n\n建议先去 "工具箱"（顶栏入口）里看有没有对应工具，或在 #求助问答 频道发帖。具体要不要展开讲？',
      suggestions: [
        { text: '打开工具箱', href: 'toolbox.html' },
        '帮我具体拆解'
      ]
    };
  }

  function stageToLessons(stage) {
    const map = {
      '需求定义': 'A6 跟 AI 讨论需求（SPEC 起点）+ A5 第一个网站',
      '原型': 'A5 / A9 / A10（黑话翻译器、哄哄模拟器）',
      '开发': 'B6 进入深水区 + B3 数据库 + B4 用户认证',
      '部署': 'B12 部署上线 + B13 域名配置',
      '上线': 'D16 冷启动 + D17 产品里种传播'
    };
    return map[stage] || map['需求定义'];
  }

  initGreeting();
})();
