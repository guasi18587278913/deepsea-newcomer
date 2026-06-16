/* ============================================================
   深海圈 · 全站统一顶栏渲染（原型版）
   自动挂载到 <header id="ds-topbar">；视觉对齐官网「深海圈社区」顶栏。
   改顶栏只改本文件 + topbar.css，全站同步。跳转一律站内（不蹦外站）。
   ============================================================ */
(function () {
  var host = document.getElementById('ds-topbar');
  if (!host) return;

  // 官网真 logo（取自 DeepSeaLogo.vue 的 SVG，青 #00A8A9）
  var LOGO = '<svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.01316 14.5591C1.6828 7.50721 7.50361 1.68261 14.5512 2.01317C20.7178 2.29657 25.7046 7.28645 25.9878 13.4253C26.3024 20.4929 20.4974 26.3174 13.4341 25.9868C7.28329 25.7034 2.29653 20.7135 2.01316 14.5591ZM24.3364 14.685C24.7297 8.43596 19.569 3.27297 13.3237 3.66649C8.16406 3.99721 3.99496 8.1679 3.66453 13.3149C3.27124 19.564 8.43189 24.727 14.6772 24.3335C19.8368 24.0028 24.0058 19.8477 24.3364 14.685ZM14.4614 7.4116C14.7133 7.4116 14.9184 7.61678 14.9184 7.86864V10.2768H17.7983C18.3334 10.2768 18.8058 10.6229 18.9634 11.1264C19.1208 11.6931 18.9162 12.2283 18.5542 12.4487L14.9184 14.7632V16.7934H18.5073C18.8062 16.7936 19.0581 17.0453 19.0425 17.3442V17.8794C19.0425 18.1783 18.7906 18.4299 18.4917 18.4302H14.9028V20.3667C14.9028 20.6185 14.6976 20.8227 14.4458 20.8227H13.5483C13.2966 20.8226 13.0923 20.6184 13.0923 20.3667V18.4302H10.1958C9.66064 18.4301 9.18816 18.0686 9.03074 17.5649C8.88908 17.0613 9.12555 16.4789 9.51902 16.227L13.0766 13.9448V11.9458H9.51902C9.2042 11.9458 8.93699 11.6933 8.93699 11.3628V10.8589C8.93717 10.5285 9.20431 10.2768 9.51902 10.2768H13.1079V7.86864C13.1079 7.61694 13.3123 7.41185 13.5639 7.4116H14.4614ZM11.8803 16.7143C11.8489 16.7301 11.8644 16.7934 11.9116 16.7934H13.0923V15.9282L11.8803 16.7143ZM14.9184 12.7641L16.0825 12.0239C16.114 11.9924 16.0985 11.9292 16.0512 11.9292H14.9184V12.7641ZM18.0884 7.39598C18.3716 7.39598 18.5922 7.63237 18.5923 7.89989V8.60789C18.5923 8.89117 18.3559 9.1118 18.0884 9.1118H17.27C17.0025 9.11173 16.7661 8.89113 16.7661 8.60789V7.89989C16.7661 7.61669 17.0025 7.39605 17.27 7.39598H18.0884Z" fill="#00A8A9"/></svg>';

  // 工具箱图标
  var TOOL_IC = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M6 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/><path d="M8 9v2"/></svg>';

  // 菜单（一律站内）：label / 一级落点 / 当前页匹配 / 二级
  var NAV = [
    { label: '交流区',   href: 'discuss.html', match: ['discuss', 'feed', 'community', 'course-discuss', 'article'],
      sub: [['广场', 'discuss.html'], ['干货', 'feed.html']] },
    { label: '学习中心', href: 'calendar.html', match: ['guide', 'calendar', 'roadmap', 'learn', 'course', 'live', 'isle'],
      sub: [['学习指南', 'guide.html'], ['我的路线', 'calendar.html'], ['全部课程', 'course.html'], ['直播学习', 'live.html']] },
    { label: '作品墙',   href: 'showcase.html', match: ['showcase', 'profile'],
      sub: [['全部作品', 'showcase.html'], ['我的作品', 'profile.html']] },
    { label: '成员',     href: 'members.html', match: ['members'],
      sub: [['全部成员', 'members.html'], ['认证高手', 'members.html?tab=experts'], ['同城伙伴', 'members.html?tab=local']] },
  ];

  var cur = (location.pathname.split('/').pop() || 'discuss.html').replace('.html', '');

  var menu = NAV.map(function (it) {
    var active = it.match.indexOf(cur) >= 0;
    var sub = it.sub.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + '</a>'; }).join('');
    return '<div class="dst-item' + (active ? ' active' : '') + '">' +
             '<a class="dst-l1" href="' + it.href + '">' + it.label + '</a>' +
             '<div class="dst-pop">' + sub + '</div>' +
           '</div>';
  }).join('');

  host.className = 'ds-topbar';
  host.innerHTML =
    '<div class="dst-inner">' +
      '<a class="dst-brand" href="discuss.html" title="深海圈">' + LOGO + '<span>深海圈</span></a>' +
      '<nav class="dst-nav">' + menu + '</nav>' +
      '<div class="dst-right">' +
        '<a class="dst-tool" href="toolbox.html" title="AI 工具箱">' + TOOL_IC + '<span>工具箱</span></a>' +
        '<div class="dst-avatar" title="我">我</div>' +
      '</div>' +
    '</div>';
})();
