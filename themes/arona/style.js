/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
/**
 * Endless647 主题全局样式
 * 逐项复刻 astro-theme-AronaNote 的 src/styles/{vars,index,icons}.less
 * 与各组件 <style> 中的样式，颜色全部走 CSS 变量，深色模式只切换变量。
 * 深色选择器：NotionNext 使用 html.dark（Tailwind 约定）。
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    /* ==================================================================
       字体
       ================================================================== */
    @font-face {
      font-family: 'Resource Han Rounded CN';
      src: url('/arona/fonts/ResourceHanRoundedCN-Medium.woff2') format('woff2');
      font-weight: 500; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'Resource Han Rounded CN';
      src: url('/arona/fonts/ResourceHanRoundedCN-Bold.woff2') format('woff2');
      font-weight: 700; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('/arona/fonts/JetBrainsMono-Regular.woff2') format('woff2');
      font-weight: normal; font-style: normal; font-display: swap;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('/arona/fonts/JetBrainsMono-Italic.woff2') format('woff2');
      font-weight: normal; font-style: italic; font-display: swap;
    }

    /* ==================================================================
       颜色变量 —— 浅色 (vars.less :root)
       ================================================================== */
    #theme-arona {
      --transition-time: 0.3s;
      --transition-curve: cubic-bezier(0.4, 0, 0.2, 1);

      --theme-background-image: url('/arona/background.svg');

      --btn-hover: #33495d;
      --btn-background: #425c8b;
      --color-blue: #128afa;
      --font-color-gold: #ffe401;
      --font-color-grey: #4c5866;
      --icon-color: #466398;
      --blur-val: blur(15px);
      --general-background-color: #eaeff5;
      --foreground-color: #ffffff;
      --blue-shadow-color: 40, 135, 200;
      --wave-color1: rgba(234, 239, 245, 0.8);
      --wave-color2: rgba(234, 239, 245, 0.5);
      --pot-border-left: #c7e4f6;
      --dot: rgba(0, 0, 0, 0.2);
      --dot-active: #128afa;
      --infobox-background-initial: rgba(255, 255, 255, 0.1);
      --infobox-background-final: rgba(255, 255, 255, 0.5);
      --triangle-background: repeating-linear-gradient(60deg, rgba(190, 242, 255, 0.3), transparent 35px),
        repeating-linear-gradient(180deg, transparent, rgba(108, 230, 255, 0.3) 30px),
        repeating-linear-gradient(120deg, rgba(16, 179, 215, 0.3), transparent 46px);
      --img-brightness: brightness(100%);
      --welcome-text-color: var(--foreground-color);
      --welcome-text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      --info-box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      --post-InnerBanner-color: white;
      --infobox-border-color: white;
      --downarrow-color: white;
      --content-opacity: 0.25;

      --deco1: url('/arona/icons/deco1.svg');
      --deco2: url('/arona/icons/deco2.svg');
      --icon-pinned: url('/arona/icons/icon-pinned.svg');
      --icon-tip: url('/arona/icons/icon-tip.svg');
      --icon-info: url('/arona/icons/icon-info.svg');
      --icon-warning: url('/arona/icons/icon-warning.svg');
      --icon-danger: url('/arona/icons/icon-danger.svg');

      /* 搜索对话框变量 */
      --search-dialog-bg: rgb(239, 239, 239);
      --search-dialog-header-bg: rgb(239, 242, 244);
      --search-dialog-border: rgb(213, 217, 219);
      --search-input-bg: rgb(230, 234, 235);
      --search-input-border: rgb(209, 213, 218);
      --search-list-bg: rgb(174, 193, 202);
      --search-item-bg: #fff;
      --search-item-shadow: rgba(69, 73, 78, 0.548);

      /* Endless647 未定义、被 TOC 等组件引用 */
      --color-text-primary: var(--font-color-grey);
      --color-text-secondary: var(--font-color-grey);
      --color-border: rgba(var(--blue-shadow-color), 0.2);
    }

    /* ==================================================================
       颜色变量 —— 深色 (vars.less html[theme='dark'])
       ================================================================== */
    html.dark #theme-arona,
    html[theme='dark'] #theme-arona {
      --theme-background-image: url('/arona/background_dark.svg');

      --btn-hover: #797995;
      --btn-background: #5c5c76bf;
      --color-blue: #705781;
      --font-color-gold: #cfc6ff;
      --font-color-grey: #c8c8dc;
      --icon-color: #9d7cd8;
      --blur-val: blur(8px);
      --general-background-color: #0f0f16;
      --foreground-color: #1f1f2c;
      --blue-shadow-color: 147, 113, 207;
      --wave-color1: rgba(30, 30, 50, 0.604);
      --wave-color2: rgba(21, 21, 28, 0.384);
      --pot-border-left: rgba(135, 112, 210, 0.687);
      --dot: rgba(150, 149, 149, 0.2);
      --dot-active: #624398;
      --infobox-background-initial: rgba(32, 27, 38, 0.6);
      --infobox-background-final: rgba(32, 29, 42, 0.9);
      --triangle-background: repeating-linear-gradient(60deg, rgba(158, 124, 216, 0.15), transparent 35px),
        repeating-linear-gradient(180deg, transparent, rgba(157, 124, 216, 0.08) 30px),
        repeating-linear-gradient(120deg, rgba(157, 124, 216, 0.08), transparent 46px);
      --img-brightness: brightness(80%);
      --welcome-text-color: #dcdce2;
      --welcome-text-shadow: 0 0 5px rgba(79, 45, 138, 0.4);
      --info-box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      --post-InnerBanner-color: #d9ddecef;
      --infobox-border-color: #2c2c39b5;
      --downarrow-color: rgba(255, 255, 255, 0.597);
      --content-opacity: 0.1;

      --deco1: url('/arona/icons/deco1_dark.svg');
      --deco2: url('/arona/icons/deco2_dark.svg');
      --icon-pinned: url('/arona/icons/icon-pinned_dark.svg');
      --icon-tip: url('/arona/icons/icon-tip_dark.svg');
      --icon-info: url('/arona/icons/icon-info_dark.svg');
      --icon-danger: url('/arona/icons/icon-danger_dark.svg');

      --search-dialog-bg: #1f1f2c;
      --search-dialog-header-bg: #2a2a3a;
      --search-dialog-border: #383852;
      --search-input-bg: #2a2a3a;
      --search-input-border: #383852;
      --search-list-bg: #2a2a3a;
      --search-item-bg: #1f1f2c;
      --search-item-shadow: rgba(0, 0, 0, 0.5);
    }

    /* ==================================================================
       基础样式 (index.less body / a / button / ...)
       ================================================================== */
    #theme-arona {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
      font-family: 'Resource Han Rounded CN', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      text-align: left;
      background-image: var(--theme-background-image);
      background-color: var(--general-background-color);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-attachment: fixed;
      /* 用 clip 而不是 hidden：hidden 会创建滚动容器，导致内部 sticky 导航失效 */
      overflow-x: clip;
      color: var(--font-color-grey);
      transition: background-image 0.5s, background-color 0.5s, color 0.5s;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.7;
    }

    /* 用 :where() 把 ID 的权重归零，保持与 Endless647 原始 less 相同的层叠优先级
       （否则 #theme-arona a 会盖掉所有组件内基于 class 的链接样式） */
    :where(#theme-arona) a {
      color: var(--color-blue);
      text-decoration: none;
      transition: color var(--transition-time) var(--transition-curve);
    }
    :where(#theme-arona) a:hover { color: var(--btn-hover); }

    :where(#theme-arona) button {
      font-family: inherit;
      cursor: pointer;
      border: none;
      outline: none;
      background: var(--btn-background);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all var(--transition-time) var(--transition-curve);
    }
    :where(#theme-arona) button:hover { background: var(--btn-hover); transform: translateY(-1px); }

    #theme-arona ::selection {
      background: rgba(var(--blue-shadow-color), 0.3);
      color: var(--font-color-grey);
    }

    #theme-arona hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(var(--blue-shadow-color), 0.3), transparent);
      margin: 2rem 0;
    }

    /* 滚动条 */
    #theme-arona ::-webkit-scrollbar { width: 8px; height: 8px; }
    #theme-arona ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: rgba(var(--blue-shadow-color), 0.5);
    }
    #theme-arona ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(var(--blue-shadow-color), 0.8);
    }
    #theme-arona ::-webkit-scrollbar-track { background: transparent; }

    /* 通用容器 */
    .arona-container {
      max-width: 1200px;
      width: calc(100% - 48px);
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      .arona-container { width: calc(100% - 24px); }
    }

    /* ==================================================================
       Header —— 玻璃导航 (Header.astro)
       ================================================================== */
    .arona-header {
      height: 75vh;
      min-height: 75vh;
      position: relative;
      z-index: 100;
      pointer-events: none; /* 让 75vh 区域不挡 Banner 的鼠标事件 */
    }
    .arona-header.postViewer { height: 50vh; min-height: 50vh; }

    .arona-header nav {
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      height: 72px;
      z-index: 100;
      box-sizing: border-box;
      padding: 0 16px;
      border-radius: 0 0 32px 32px;
      border-bottom: solid 2px var(--foreground-color);
      border-left: solid 2px var(--foreground-color);
      border-right: solid 2px var(--foreground-color);
      background: linear-gradient(0.25turn, transparent, var(--foreground-color) 25%), var(--triangle-background);
      -webkit-backdrop-filter: var(--blur-val);
      backdrop-filter: var(--blur-val);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
    }
    .arona-header .logo { display: flex; align-items: center; height: 100%; cursor: pointer; }
    .arona-header .logo a { display: flex; align-items: center; height: 100%; }
    .arona-header .logo img { height: 32px; width: auto; min-width: 32px; filter: drop-shadow(0 0 8px #328cfa); }

    /* .menu 与 ul 都不能有 overflow。
       子菜单（.sub-menu）是绝对定位、挂在 li 上，而 li 是 ul 的子元素。
       CSS 规定 overflow-x/y 任一非 visible 时，另一项的 visible 会被算成 auto，
       于是 ul 变成裁切容器、把子菜单裁在菜单栏高度内
       （实测「往期整理」的三个子菜单被限制在菜单栏里，命中测试全部落在容器上）。
       把滚动从 .menu 挪到 ul 也无效 —— li 在 ul 内，同样被裁。

       最终方案：两处都不设 overflow，窄屏需要横向滚动时
       由 Header.js 实测 scrollWidth > clientWidth 后给 ul 加
       .menu-scroll 类，只在真正溢出时才启用（见下方 .menu-scroll 规则）。 */
    .arona-header .menu {
      -webkit-overflow-scrolling: touch;
      margin: 0 24px;
      padding: 0;
      /* flex 子项需允许收缩，否则菜单总宽会挤走 logo 与汉堡按钮 */
      min-width: 0;
    }
    /* 仅在实测溢出时（Header.js 加 .menu-scroll）才成为滚动容器。
       代价是子菜单重新被裁（见下方 .menu-scroll 下的降级规则）。 */
    .arona-header .menu ul.menu-scroll {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .arona-header .menu ul.menu-scroll::-webkit-scrollbar { display: none; }
    /* 溢出 ⇒ 菜单放不下 ⇒ 视口已经足够窄，横向 hover 弹出子菜单本就不合理，
       而且 ul 一旦是滚动容器（overflow-y 被算成 auto），子菜单必被裁。
       所以这里直接把它降级为「常驻缩进」形态：静态定位、在 ul 内部正常撑开、
       随菜单一起横向滑动，永不被裁。与下方 (hover: none) 同一套规则。 */
    .arona-header .menu ul.menu-scroll li.has-sub > .sub-menu {
      position: static;
      transform: none;
      min-width: 0;
      margin: 0 0 4px 12px;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      box-shadow: none;
      border-width: 0 0 0 2px;
      border-radius: 0 12px 12px 0;
    }
    .arona-header .menu ul.menu-scroll li.has-sub > a .sub-arrow { transform: rotate(90deg); }

    /* menu-scroll 时子菜单常驻缩进会把 li 撑高（父项 + 三个子项 ≈ 170px），
       而 nav 写死 height: 72px + align-items: center ——
       li 超出后上下各溢出约 48px，顶部那项直接跑到视口外看不见。
       所以这状态下 nav 改为内容驱动高度、子项顶对齐，
       让 nav 自己撑高到容纳整棵菜单。 */
    .arona-header:has(.menu ul.menu-scroll) nav {
      height: auto;
      min-height: 72px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .arona-header .menu ul.menu-scroll { align-items: flex-start; }
    /* 菜单横向溢出提示（.menu-scroll-hint 由 Header.js 依据
       scrollWidth > clientWidth 实测后加在 .menu 上）。

       实现位置的取舍：
         · 放在 .menu 内的 ::after 不行 —— 加了 .menu-scroll 后
           ul 才是滚动容器，但 .menu 本身始终是 overflow: visible，
           绝对定位元素会「固定在滚动位置之外」，不跟着内容走；
         · 放在 ul 内更糟 —— 绝对定位会随横向滚动内容一起移动，
           滑到哪它跟到哪。
       所以用 JS 把 .menu 标记为 .menu-scroll-hint，
       提示条画在 nav 上（position: sticky 的 nav 内，不随菜单滚动），
       横向位置由 nav 的 padding-right 决定 —— nav 是 flex 容器，
       菜单撑到可用宽度的右缘，紧贴汉堡按钮左侧，位置稳定。 */
    .arona-header:has(.menu.menu-scroll-hint) nav::after {
      content: '';
      position: absolute;
      right: 52px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      border-radius: 2px;
      background: var(--color-blue);
      opacity: 0.5;
      pointer-events: none;
    }
    /* 不支持 :has() 的浏览器（Safari < 15.4、Firefox < 121）退回无提示：
       菜单仍可横向滑动，只少了视觉引导 —— 可接受的降级，
       总比为了提示牺牲内容可见性要好。 */
    @supports not selector(:has(*)) {
      .arona-header nav::after { content: none; }
    }
    .arona-header .menu ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0;
      margin: 0;
      list-style: none;
      white-space: nowrap;
      gap: clamp(16px, 4vw, 64px);
      /* 刻意不设 overflow：会让子菜单被裁（见上方注释）。
         横向滚动由 .menu-scroll 类按需启用。 */
      flex-shrink: 1;
      min-width: 0;
    }
    .arona-header .menu li { margin: 0; flex-shrink: 0; }
    .arona-header .menu li a {
      display: block;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      color: var(--font-color-grey);
      text-decoration: none;
      transition: all 0.5s, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .arona-header .menu li a:hover {
      color: var(--font-color-gold);
      background-color: var(--btn-background);
      transform: translateY(-2px);
    }
    .arona-header .menu li a.active { font-weight: bold; }

    /* 带子菜单的父项（如 Notion 的「往期整理」） */
    .arona-header .menu li.has-sub { position: relative; }
    .arona-header .menu li.has-sub > a { display: flex; align-items: center; gap: 6px; }
    .arona-header .menu li.has-sub > a .sub-arrow {
      font-size: 12px;
      transition: transform 0.3s var(--transition-curve);
    }
    .arona-header .menu li.has-sub:hover > a .sub-arrow { transform: rotate(90deg); }
    .arona-header .menu li.has-sub > .sub-menu {
      position: absolute;
      top: calc(100% - 4px);
      left: 50%;
      transform: translateX(-50%) translateY(6px);
      min-width: 168px;
      padding: 6px;
      list-style: none;
      margin: 0;
      gap: 2px;
      flex-direction: column;
      background-color: var(--foreground-color);
      border: solid 2px var(--foreground-color);
      border-radius: 16px;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.25s var(--transition-curve), transform 0.25s var(--transition-curve), visibility 0.25s;
      z-index: 130;
    }
    .arona-header .menu li.has-sub:hover > .sub-menu,
    .arona-header .menu li.has-sub:focus-within > .sub-menu {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    .arona-header .menu li.has-sub > .sub-menu li a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: normal;
      white-space: nowrap;
      text-align: left;
    }
    .arona-header .menu li.has-sub > .sub-menu li a .sub-icon { font-size: 13px; }

    /* 触屏设备没有 hover，子菜单改为常驻缩进显示，保证可点 */
    @media (hover: none) {
      .arona-header .menu li.has-sub > .sub-menu {
        position: static;
        transform: none;
        min-width: 0;
        margin: 0 0 4px 12px;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        box-shadow: none;
        border-width: 0 0 0 2px;
        border-radius: 0 12px 12px 0;
      }
      .arona-header .menu li.has-sub > a .sub-arrow { transform: rotate(90deg); }
    }

    .arona-header .hamburger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      cursor: pointer;
      background: transparent;
      border: none;
      outline: none;
      padding: 0;
    }
    .arona-header .hamburger .line {
      display: block;
      width: 80%;
      height: 4px;
      border-radius: 4px;
      background-color: var(--font-color-grey);
      margin-bottom: 4px;
      transition: all 0.3s ease-in-out;
    }
    .arona-header .hamburger.active .line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .arona-header .hamburger.active .line:nth-child(2) { opacity: 0; }
    .arona-header .hamburger.active .line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    /* 下拉菜单 */
    .arona-header nav { position: relative; }
    .arona-dropdown {
      position: absolute;
      z-index: 50;
      top: 100%;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 0.2s ease-in-out, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .arona-dropdown .menu-content {
      position: relative;
      background-color: var(--foreground-color);
      border-radius: 32px;
      padding: max(1.2vw, 2vh);
      gap: max(0.8vw, 1vh);
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      min-width: 200px;
    }
    .arona-dropdown[data-show='false'] {
      opacity: 0;
      transform: translateY(2px);
      pointer-events: none;
    }
    .arona-dropdown[data-show='true'] {
      opacity: 1;
      transform: translateY(15px);
    }
    .arona-dropdown .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(var(--blue-shadow-color), 0.05);
      border-radius: 12px;
      width: 100%;
      box-sizing: border-box;
      gap: 16px;
    }
    .arona-dropdown .toggle-row .label { font-size: 15px; color: var(--font-color-grey); font-weight: bold; white-space: nowrap; }
    .arona-dropdown .toggle-row a.arona-tool { color: var(--font-color-grey); font-size: 16px; display: inline-flex; }

    /* 首行（搜索）：虚线分隔，与 ThemeToggle/CursorToggle/SpineToggle 区分开 */
    .arona-dropdown .first-row {
      display: flex;
      gap: 0.4vw;
      padding: 8px 12px;
      padding-bottom: 1vh;
      width: 100%;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed var(--font-color-grey);
    }
    .arona-dropdown .first-row .label { font-size: 15px; color: var(--font-color-grey); font-weight: bold; }
    .arona-dropdown .first-row a.arona-tool {
      color: var(--font-color-grey);
      /* 原始 less 为 max(2vw, 4vh)，在高分辨率/高窗口下会过大，这里加个上限 */
      font-size: min(max(2vw, 4vh), 44px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .arona-dropdown .first-row a.arona-tool:hover { transform: translateY(-3px); }

    /* 开关 */
    .arona-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
    .arona-switch input { opacity: 0; width: 0; height: 0; }
    .arona-switch .slider {
      position: absolute; cursor: pointer; inset: 0;
      background-color: rgba(var(--blue-shadow-color), 0.15);
      transition: 0.3s; border-radius: 24px;
    }
    .arona-switch .slider:before {
      position: absolute; content: ''; height: 18px; width: 18px; left: 3px; bottom: 3px;
      background-color: white; transition: 0.3s; border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .arona-switch input:checked + .slider { background-color: rgba(var(--blue-shadow-color), 0.6); }
    .arona-switch input:checked + .slider:before { transform: translateX(20px); }

    /* 主题选择 */
    .arona-theme-select {
      padding: 6px 10px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 10px;
      border: 1px solid rgba(var(--blue-shadow-color), 0.15);
      background: var(--foreground-color);
      color: var(--font-color-grey);
      cursor: pointer;
      outline: none;
    }

    @media (max-width: 768px) {
      .arona-header nav { height: 64px; }
      .arona-header .menu { flex: 1; max-width: none; margin: 0 clamp(8px, 3vw, 16px); }
      .arona-header .menu ul { gap: clamp(8px, 2vw, 16px); }
      .arona-header .menu li a { font-size: 14px; padding: 8px 10px; }
      .arona-header .hamburger { width: 32px; }
    }

    /* ==================================================================
       Banner 横幅 (Banner.astro)
       ================================================================== */
    .arona-banner {
      transform: translateZ(0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 75vh;
      z-index: 1;
      mask: linear-gradient(to top, transparent, var(--general-background-color) 5%);
      -webkit-mask: linear-gradient(to top, transparent, var(--general-background-color) 5%);
      perspective: 1000px;
      overflow: hidden;
      -webkit-user-drag: none;
      transition: height 0.3s;
    }
    .arona-banner.postViewer { height: 50vh; }
    .arona-banner.loadingComplete {
      animation: arona-fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    @keyframes arona-fade-blur-in {
      from { filter: var(--blur-val); transform: scale(1.5); }
      to { filter: none; transform: scale(1); }
    }
    .arona-banner .banner-content {
      position: relative;
      z-index: 80;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .arona-banner .bg-layer {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      filter: var(--img-brightness);
      transition: opacity 0.5s ease-in-out, filter 0.5s;
      z-index: -1;
    }
    .arona-banner #arona-bg-current { opacity: 1; }
    .arona-banner #arona-bg-next { opacity: 0; }
    .arona-banner .transitioning-in { opacity: 1 !important; }
    .arona-banner #arona-wave {
      position: absolute;
      bottom: 0; left: 0;
      z-index: 50;
    }

    /* ==================================================================
       WelcomeBox 欢迎框 (WelcomeBox.astro)
       ================================================================== */
    .arona-welcome-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0; left: 0;
      z-index: 5;
      perspective: 1000px;
    }
    .arona-welcome-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: transform 0.2s, color 0.5s, text-shadow 0.5s;
    }
    .arona-welcome-text {
      font-size: max(64px, 4.5vw);
      font-weight: bold;
      color: var(--welcome-text-color);
      text-shadow: var(--welcome-text-shadow);
      text-align: center;
      margin-bottom: max(128px, 5vw);
      user-select: none;
    }
    .arona-info-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 6vh 2vw 3vh;
      width: max(576px, 40vw);
      max-width: 90vw;
      box-sizing: border-box;
      border-radius: 3vw;
      box-shadow: var(--info-box-shadow);
      -webkit-backdrop-filter: var(--blur-val) saturate(120%);
      backdrop-filter: var(--blur-val) saturate(120%);
      background: linear-gradient(0deg, var(--infobox-background-initial), var(--infobox-background-final));
    }
    .arona-info-box .avatar {
      position: absolute;
      top: 0; left: 50%;
      transform: translate(-50%, -50%);
      width: max(128px, 7.5vw);
      height: max(128px, 7.5vw);
      border-radius: 50%;
      border: solid 3px var(--infobox-border-color);
      transition: transform 0.6s ease, box-shadow 0.4s ease, filter 0.5s;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
      cursor: pointer;
      user-select: none;
      filter: var(--img-brightness);
    }
    .arona-info-box .avatar:hover {
      transform: translate(-50%, -50%) rotate(1turn) scale(1.1);
      box-shadow: 0 0 7px rgba(0, 0, 0, 0.6);
    }
    .arona-info-box .name { font-size: max(32px, 1.5vw); margin-top: 3vh; }
    .arona-info-box .motto {
      font-size: max(18px, 1vw);
      font-weight: bold;
      margin-top: 3vh;
      text-align: center;
      min-height: 1.6em;
    }
    .arona-info-box .motto .pointer {
      display: inline-block;
      margin: -0.5vh 0 0;
      vertical-align: middle;
      width: 2px;
      height: max(18px, 1vw);
      animation: arona-pointer-blink 0.8s linear infinite;
    }
    @keyframes arona-pointer-blink {
      0%, 40% { background-color: var(--font-color-grey); }
      60%, 100% { background-color: transparent; }
    }
    .arona-info-box ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 3.5vh;
      width: 12vw;
      padding: 0;
      list-style: none;
    }
    .arona-info-box ul li { margin: 0; padding: 0; }
    .arona-info-box ul li a { display: inline-flex; }
    .arona-info-box .social {
      width: max(32px, 1.5vw);
      height: max(32px, 1.5vw);
      transition: all 0.5s;
      color: var(--font-color-grey);
      vertical-align: middle;
    }
    .arona-info-box .social:hover { filter: drop-shadow(0 0 5px var(--font-color-grey)); }

    @media (max-width: 768px) {
      .arona-welcome-text { font-size: 5vh; margin-bottom: 10vh; }
      .arona-info-box { padding: 5vh 6vw 2vh; width: 75vw; border-radius: 4vh; }
      .arona-info-box .avatar { width: 10vh; height: 10vh; }
      .arona-info-box .name { font-size: 2.5vh; margin-top: 1.8vh; }
      .arona-info-box .motto { font-size: 1.5vh; margin-top: 1.5vh; }
      .arona-info-box ul { margin-top: 1.8vh; width: 32vw; }
      .arona-info-box .social { width: 2vh; height: 2vh; }
    }

    /* 文章页 Banner 文字 */
    .arona-post-banner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--post-InnerBanner-color);
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      z-index: 100;
      transition: color 0.5s;
      padding: 0 20px;
      text-align: center;
    }
    .arona-post-banner .title {
      font-size: max(64px, 4.5vw);
      margin: 0 0 50px;
      color: var(--post-InnerBanner-color);
      transition: color 0.5s;
      word-break: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
    .arona-post-banner .status {
      font-size: max(20px, 1vw);
      font-weight: bold;
      color: var(--post-InnerBanner-color);
      transition: color 0.5s;
      word-break: break-word;
      max-width: 100%;
      line-height: 1.6;
    }
    @media (max-width: 768px) {
      .arona-post-banner { padding: 0 16px; }
      .arona-post-banner .title { font-size: clamp(28px, 6vw, 5vh); margin-bottom: 24px; }
      .arona-post-banner .status { font-size: clamp(14px, 3vw, 1.5vh); }
    }

    /* ==================================================================
       主内容
       ================================================================== */
    .arona-main { flex: 1; min-height: 40vh; }

    /* 文章列表 (PostsList.astro) */
    .arona-posts-content { margin-top: 50px; }
    .arona-posts-list { position: relative; overflow-wrap: break-word; }

    .arona-post-card {
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 0 0 50px 0;
      padding-bottom: 16px;
      background-color: var(--foreground-color);
      border-radius: 32px;
      border-left: solid 16px var(--pot-border-left);
      background-image: var(--deco1);
      background-size: contain;
      background-position: right;
      background-repeat: no-repeat;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      transition: all 0.5s;
    }
    .arona-post-card:hover {
      box-shadow: 0 0 15px rgba(var(--blue-shadow-color), 0.8);
      transform: translateY(-2px);
    }
    .arona-post-card .pinned {
      position: absolute;
      width: 42px; height: 42px;
      top: -8px; right: -8px;
      border-radius: 50px;
      background: var(--icon-pinned) no-repeat;
      background-size: contain;
      box-shadow: 0 0 6px rgba(var(--blue-shadow-color), 0.65);
    }
    .arona-post-card .post-header {
      display: flex;
      gap: 24px;
      padding: 32px 40px 0;
      position: relative;
      align-items: stretch;
    }
    .arona-post-card .cover-container {
      flex: 0 0 180px;
      height: 140px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      margin-left: -8px;
      margin-bottom: 15px;
      align-self: center;
    }
    .arona-post-card .cover-container img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
      border-radius: 12px;
    }
    .arona-post-card .cover-container img:hover { transform: scale(1.05); }
    .arona-post-card .header-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .arona-post-card .title { position: relative; margin-bottom: 8px; }
    .arona-post-card .title .title-dot {
      width: 4px; height: 20px;
      position: absolute;
      left: -16px; top: 9.5px;
      background: var(--pot-border-left);
      border-radius: 2px;
      transition: background 0.5s;
    }
    .arona-post-card .title .name {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 28px;
      margin: 0;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arona-post-card .title .name a {
      color: var(--font-color-grey);
      transition: text-shadow 0.5s, color 0.5s;
      text-decoration: none;
    }
    .arona-post-card .title .name a:hover { text-shadow: 0 0 3px var(--font-color-grey); }
    .arona-post-card .meta-info-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 7px;
      opacity: 0.75;
      font-size: 16px;
      color: var(--font-color-grey);
    }
    .arona-post-card .meta-info-bar .meta-icon {
      width: 16px; height: 16px;
      color: var(--font-color-grey);
      margin-right: 4px;
      vertical-align: middle;
      display: inline-flex;
    }
    .arona-post-card .meta-info-bar .meta-icon i { font-size: 14px; line-height: 1; }
    .arona-post-card .meta-info-bar .sep {
      display: inline-block;
      border-radius: 50%;
      height: 4px; width: 4px;
      background-color: var(--font-color-grey);
      margin: 0 16px;
      flex-shrink: 0;
    }
    .arona-post-card .tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0;
      margin: 0 0 6px 0;
      list-style: none;
    }
    .arona-post-card .tags li { display: flex; align-items: center; padding-top: 6px; margin-right: 12px; }
    .arona-post-card .tags li a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 5px;
      color: var(--font-color-gold);
      background-color: var(--btn-background);
      border-radius: 5px;
      transition: all 0.5s;
      text-decoration: none;
      font-size: 16px;
    }
    .arona-post-card .tags li a:hover { background-color: var(--btn-hover); color: var(--font-color-gold); }
    .arona-post-card .excerpt { flex: 1; display: flex; align-items: flex-end; color: var(--font-color-grey); }
    .arona-post-card .excerpt p { margin: 0; }

    @media (max-width: 768px) {
      .arona-post-card { margin: 0 8px 30px 8px; background-size: cover; border-left: solid 1.5vh var(--pot-border-left); }
      .arona-post-card .pinned { display: none; }
      .arona-post-card .post-header { flex-direction: column; gap: 16px; padding: 24px 20px 0; }
      .arona-post-card .cover-container { flex: none; width: 100%; height: 240px; margin-left: 0; }
      .arona-post-card .title .name { font-size: 24px; }
      .arona-post-card .title .title-dot { height: 18px; top: 6px; }
      .arona-post-card .meta-info-bar { font-size: 12px; }
      .arona-post-card .excerpt { font-size: 12px; }
    }

    /* 分页 */
    .arona-pagination {
      display: flex; align-items: center; justify-content: space-between; margin-top: 50px;
    }
    .arona-pagination .page-numbers { display: flex; align-items: center; gap: 8px; }
    .arona-pagination .page-number {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; font-size: 16px; border-radius: 6px;
      color: var(--icon-color); background-color: transparent;
    }
    .arona-pagination .page-number:hover,
    .arona-pagination .page-number.active { background-color: var(--btn-hover); color: var(--font-color-gold); }
    .arona-page-btn { padding: 8px 16px; border-radius: 8px; background: var(--btn-background); color: #fff; text-decoration: none; font-size: 14px; transition: all 0.3s; }
    .arona-page-btn:hover { background: var(--btn-hover); color: #fff; }
    .arona-load-more { width: 100%; margin: 16px 0; padding: 16px 0; text-align: center; cursor: pointer; color: var(--font-color-grey); }
    .arona-load-more:hover { color: var(--color-blue); }

    /* 主内容 + 侧边栏（列表页布局；Endless647 首页为单列，此处仅在非全宽时启用侧栏） */
    .arona-main-flex { display: flex; gap: 24px; align-items: flex-start; }
    .arona-content-col { flex: 1; min-width: 0; }
    .arona-sidebar { width: 288px; flex-shrink: 0; }
    @media (max-width: 1024px) {
      .arona-main-flex { flex-direction: column; }
      .arona-sidebar { width: 100%; }
    }

    /* ==================================================================
       Footer 玻璃页脚 (Footer.astro)
       ================================================================== */
    .arona-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      width: calc(100% - 48px);
      max-width: 1200px;
      margin: 50px auto 0;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 32px 32px 0 0;
      border-top: solid 2px var(--foreground-color);
      border-left: solid 2px var(--foreground-color);
      border-right: solid 2px var(--foreground-color);
      background: linear-gradient(0.75turn, transparent, var(--foreground-color) 25%), var(--triangle-background);
      -webkit-backdrop-filter: var(--blur-val);
      backdrop-filter: var(--blur-val);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      z-index: 100;
    }
    .arona-footer .footer-info { line-height: 1.5; font-size: 14px; color: var(--font-color-grey); }
    .arona-footer .footer-line { display: flex; flex-wrap: wrap; align-items: center; gap: 0 4px; }
    .arona-footer .separator { opacity: 0.5; }
    .arona-footer .footer-info a { color: var(--color-blue); text-decoration: none; }
    .arona-footer .footer-logo { display: flex; align-items: center; height: 75%; }
    .arona-footer .footer-logo img { height: 100%; width: auto; filter: drop-shadow(0 0 8px #328cfa); }
    @media (max-width: 768px) {
      .arona-footer { width: calc(100% - 24px); }
      .arona-footer .footer-info { font-size: 12px; }
      .arona-footer .footer-logo img { height: 26px; }
    }

    /* ==================================================================
       回到顶部 (BackToTop.astro)
       ================================================================== */
    .arona-totop {
      position: fixed;
      z-index: 100;
      right: 3%;
      bottom: 50px;
      filter: drop-shadow(0 0 8px #7171a9);
      transition: all 0.5s;
      opacity: 1;
      transform: translateY(0);
      cursor: pointer;
      border: none;
      background: transparent;
      padding: 0;
    }
    .arona-totop img { width: 85px; height: auto; pointer-events: none; display: block; }
    .arona-totop.hidden { bottom: -25%; right: -25%; opacity: 0; }
    @media (max-width: 768px) { .arona-totop { right: 5%; } .arona-totop img { width: 8vh; } }

    /* ==================================================================
       Splash 开屏 (Splash.astro)
       ================================================================== */
    html.arona-splash-loading { overflow: hidden !important; }
    html.arona-splash-loading body { overflow: hidden !important; height: 100vh !important; }
    .arona-splash {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(#b9e6f6, #ece5f4);
      z-index: 9999;
      transition: opacity 500ms ease-in-out;
    }
    .arona-splash svg { width: min(60vw, 900px); height: auto; }
    .arona-splash .triangle-group path { fill: white; fill-opacity: 0.15; }
    .arona-splash .circle-path { fill: #e0f0fa; fill-opacity: 0.9; }
    .arona-splash .led-path { fill: white; filter: url(#arona-splash-glow); }
    .arona-splash .glow-color { flood-color: white; }
    html.dark .arona-splash, html[theme='dark'] .arona-splash { background: linear-gradient(#c3bde9, #fee4ff); }
    html.dark .arona-splash .circle-path, html[theme='dark'] .arona-splash .circle-path { fill: #fee4ff; }
    html.dark .arona-splash .glow-color, html[theme='dark'] .arona-splash .glow-color { flood-color: #efe0fd; }

    /* ==================================================================
       Cursor 点击特效 (Cursor.astro)
       ================================================================== */
    .arona-click-canvas {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100dvh;
      pointer-events: none;
      z-index: 9998;
    }
    @media (hover: none) { .arona-click-canvas { display: none !important; } }

    /* ==================================================================
       Spine 看板娘
       ==================================================================
       z-index 层级（数字越大越靠上）：
         9999 Splash 开屏        —— 必须在看板娘之上，加载完才淡出
         9998 点击烟花画布       —— 在看板娘之上，烟花要从角色身上散开
         999  移动端目录按钮     —— 浮层控件，压住角色无妨
         300  看板娘             —— 抬到 200 以上，避免被搜索弹窗(200)、
                                   回到顶部(100)、下拉子菜单(130)、导航(100) 压住
         200  搜索弹窗           —— 弹窗打开时应盖住页面内容，但看板娘是常驻交互物
       原来用的是 120/121，会被搜索弹窗(200)与下拉子菜单(130)盖住。 */
    .arona-spine-wrap {
      position: fixed;
      bottom: 25px;
      left: 3%;
      z-index: 300;
      /* 具体宽高由 SpinePlayer.js 的 layoutFor() 按视口与骨架比例算出后
         写进内联 style（每个骨架比例不同：arona 1:2.10、plana 1:1.92）。
         这里只给首屏占位值，JS 接管后会被覆盖。 */
      height: 45vh;
      min-height: 200px;
      width: auto;
      filter: drop-shadow(0 0 3px rgba(40, 42, 44, 0.42));
      cursor: pointer;
      transition: opacity 0.3s ease, bottom 0.3s ease;
    }
    /* 窄屏时角色降透明度，避免挡住正文内容；鼠标移上去恢复不透明。
       参考站原版有这条 :hover 恢复规则，复刻时漏了，导致窄屏下角色永远是半透明的。 */
    .arona-spine-wrap:hover { opacity: 1 !important; }
    /* canvas 必须由 CSS 拉伸到容器尺寸：pixi 为了高清把 canvas 属性尺寸放大到 2 倍，
       若不加 !important，canvas 会以 2 倍像素尺寸显示（且容器宽度为 auto 时宽度为 0 而完全不可见）。 */
    .arona-spine-wrap canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
    /* 窄屏降透明度避免挡正文，悬停恢复为 1（见上面的 :hover）。
       参考站是 0.7，这里用 0.85 —— 0.7 在浅色玻璃背景上明显发灰。 */
    @media (max-width: 1440px) { .arona-spine-wrap { opacity: 0.85; } }

    /* ===== 响应式 =====
       原来在 768px 直接 display:none，窄屏完全看不到角色；
       但手机上正是最想看角色的时候，所以改为保留显示、缩小 + 让位。
       移动端无 hover，:hover 规则不生效，故这里直接给足不透明度。 */
    @media (max-width: 768px) {
      .arona-spine-wrap {
        left: 0;
        bottom: 12px;
        opacity: 0.92;
        min-height: 140px;
        filter: drop-shadow(0 0 2px rgba(40, 42, 44, 0.34));
      }
    }
    /* 矮屏（横屏手机、开了开发者工具的桌面窗口）：
       45vh 会把角色顶出视口顶部，JS 侧已按视口高度封顶，这里再兜一层。 */
    @media (max-height: 560px) {
      .arona-spine-wrap { min-height: 120px; bottom: 8px; }
    }
    /* 超宽屏：角色贴左 3% 会离正文太远且可能顶到边缘内容，收到 2%。 */
    @media (min-width: 2200px) {
      .arona-spine-wrap { left: 2%; bottom: 40px; }
    }
    /* 触屏设备没有 hover，字幕气泡靠点击触发，
       给个更紧凑的内边距避免超出窄屏。 */
    @media (max-width: 768px) {
      .arona-spine-dialog {
        font-size: 15px;
        padding: 10px 16px;
        max-width: 78vw;
      }
    }
    .arona-spine-wrap.hidden { display: none !important; }

    /* 看板娘被关闭时的兜底恢复入口。
       .arona-spine-wrap.hidden 是 display:none !important，
       关掉后角色整个不渲染 —— 用户看到的就是「点看板娘没反应」，
       而唯一恢复途径是开汉堡面板或清缓存，隐蔽又难找。
       这个小按钮只在角色缺席时出现，位置贴近角色原本的左下角，
       低调不干扰浏览，但保证「关掉之后一定找得回来」。 */
    .arona-spine-restore {
      position: fixed;
      left: 24px;
      bottom: 24px;
      z-index: 300;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: solid 2px var(--foreground-color);
      border-radius: 50%;
      background: var(--foreground-color);
      color: var(--font-color-grey);
      font-size: 15px;
      cursor: pointer;
      opacity: 0.5;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.6);
      transition: opacity 0.2s var(--transition-curve), transform 0.2s var(--transition-curve);
    }
    .arona-spine-restore:hover { opacity: 1; transform: scale(1.08); }
    .arona-spine-restore:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
    @media (max-width: 768px) { .arona-spine-restore { left: 12px; bottom: 12px; } }
    .arona-spine-dialog {
      position: fixed;
      z-index: 301;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0.92);
      color: #000;
      border-radius: 25px;
      padding: 12px 24px;
      line-height: 1.4;
      font-size: 18px;
      /* width 由 JS 按容器与视口算出并写入内联 style；
         没有 border-box 的话内联 width 不含 padding，气泡会比预期宽 48px 而溢出 */
      box-sizing: border-box;
      white-space: pre-wrap;
      word-wrap: break-word;
      filter: drop-shadow(0 0 3px rgba(36, 36, 36, 0.6));
    }

    /* ==================================================================
       SearchDialog 搜索
       ================================================================== */
    .arona-search-dialog {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      /* 400：搜索是模态弹窗，必须盖过看板娘(300)与它的对话框(301)，
         否则角色会浮在遮罩之上。 */
      z-index: 400;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .arona-search-dialog .dialog-cover {
      background: rgba(0, 0, 0, 0.614);
      position: absolute;
      inset: 0;
    }
    .arona-search-dialog .dialog-content {
      position: relative;
      width: 90%;
      max-width: 768px;
      max-height: 80vh;
      background-color: var(--search-dialog-bg);
      border-radius: 16px;
      padding: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: arona-pop-up 0.3s forwards;
    }
    @keyframes arona-pop-up {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .arona-search-dialog .dialog-header {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-bottom: 3px solid var(--search-dialog-border);
      background-color: var(--search-dialog-header-bg);
      background-image: var(--deco2);
      background-repeat: no-repeat;
      background-position: left;
      background-size: contain;
    }
    .arona-search-dialog .title {
      font-weight: bold;
      font-size: 25px;
      border-bottom: 5px solid var(--font-color-gold);
      position: relative;
      z-index: 2;
    }
    .arona-search-dialog .close-btn {
      position: absolute;
      top: 0; right: 0;
      width: 56px; height: 56px;
      font-size: 36px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
      color: var(--font-color-grey);
      transition: all 0.3s ease;
    }
    .arona-search-dialog .close-btn:hover { color: var(--color-blue); background: transparent; transform: scale(1.1); }
    .arona-search-dialog input {
      width: 100%;
      height: 48px;
      margin: 10px;
      padding: 0 16px;
      box-sizing: border-box;
      background-color: var(--search-input-bg);
      border: 3px solid var(--search-input-border);
      border-radius: 6px;
      font-size: 16px;
      color: var(--font-color-grey);
      outline: none;
    }
    .arona-search-dialog input:focus { border-color: var(--color-blue); }
    .arona-search-dialog .search-list {
      width: 100%;
      min-height: 100px;
      max-height: 48vh;
      overflow-y: auto;
      box-sizing: border-box;
      background-color: var(--search-list-bg);
      border-radius: 6px 6px 16px 16px;
      padding: 20px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      list-style: none;
    }
    .arona-search-dialog .empty { text-align: center; color: var(--font-color-grey); opacity: 0.7; padding: 40px 20px; font-size: 14px; }
    .arona-search-dialog .search-item {
      background-color: var(--search-item-bg);
      border-radius: 20px;
      border-left: solid 6px var(--pot-border-left);
      background-image: var(--deco1);
      background-size: contain;
      background-position: right;
      background-repeat: no-repeat;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.6);
      transition: all 0.5s;
      cursor: pointer;
      overflow: hidden;
      flex-shrink: 0;
    }
    .arona-search-dialog .search-item:hover { box-shadow: 0 0 15px rgba(var(--blue-shadow-color), 0.8); transform: translateY(-2px); }
    .arona-search-dialog .search-item a { color: var(--font-color-grey); text-decoration: none; display: block; padding: 20px 24px; }
    .arona-search-dialog .item-title { font-size: 17px; font-weight: bold; display: block; }
    .arona-search-dialog .item-desc { font-size: 13px; opacity: 0.65; display: block; }

    /* ==================================================================
       文章页 (BlogPost.astro)
       ================================================================== */
    .arona-post-layout {
      display: flex;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      box-sizing: border-box;
    }
    .arona-toc-sidebar { flex-shrink: 0; width: 260px; position: relative; }
    .arona-toc {
      position: sticky;
      top: 12px;
      width: 228px;
      max-height: calc(100vh - 140px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 16px;
      box-sizing: border-box;
      background: var(--foreground-color);
      border: solid 2px var(--foreground-color);
      border-radius: 32px;
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      color: var(--color-text-secondary);
      transition: border 0.5s, background 0.5s, box-shadow 0.5s;
    }
    .arona-toc::-webkit-scrollbar { width: 4px; }
    .arona-toc::-webkit-scrollbar-track { background: transparent; }
    .arona-toc::-webkit-scrollbar-thumb {
      background: var(--color-text-secondary);
      border-radius: 2px;
    }
    .arona-toc-header {
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border);
    }
    .arona-toc-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .arona-toc-list, .arona-toc-sub-list { list-style: none; padding: 0; margin: 0; }
    .arona-toc-item { margin: 4px 0; }
    /* h2 条目：加粗 + 非激活时淡化 */
    .arona-toc-level-2 > .arona-toc-link {
      font-weight: bold;
      color: var(--color-text-primary);
      opacity: 0.6;
    }
    .arona-toc-level-2.is-current-h2 > .arona-toc-link { opacity: 1; }
    .arona-toc-level-3 { padding-left: 12px; }
    /* 基础链接样式需排在 h2 规则之后，才能让 .active 药丸底色生效 */
    .arona-toc-link {
      display: block;
      padding: 6px 8px;
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.2s, background-color 0.2s;
    }
    .arona-toc-level-3 .arona-toc-link { font-size: 12px; }
    .arona-toc-sub-list {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
    }
    .arona-toc-sub-list.is-visible { max-height: 500px; opacity: 1; margin: 4px 0 8px 0; }
    .arona-toc-link:hover {
      color: var(--color-blue);
      background-color: rgba(var(--blue-shadow-color), 0.1);
    }
    .arona-toc-link.active {
      color: var(--color-blue);
      background-color: rgba(var(--blue-shadow-color), 0.15);
      font-weight: 500;
    }
    .arona-toc-level-2 > .arona-toc-link.active {
      font-weight: bold;
      color: var(--color-blue);
      background-color: rgba(var(--blue-shadow-color), 0.15);
      opacity: 1;
    }
    .arona-view-box {
      box-sizing: border-box;
      flex: 1;
      min-width: 0;
      position: relative;
      padding: 36px;
      border-radius: 32px;
      border: solid 2px var(--foreground-color);
      background: var(--foreground-color);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      transition: background 0.5s, box-shadow 0.5s;
      max-width: calc(1200px - 260px - 24px);
    }
    .arona-post-layout.no-toc .arona-view-box { margin: 0 auto; max-width: 1200px; }
    @media (max-width: 1024px) {
      .arona-toc-sidebar { display: none; }
      .arona-view-box { margin: 0 auto; max-width: 1200px; }
    }
    @media (max-width: 768px) {
      .arona-view-box { padding: 24px; }
      .arona-post-layout { padding: 0 12px; }
    }

    .arona-content {
      background-image: linear-gradient(90deg, rgba(159, 219, 252, 0.15) 3%, transparent 0),
        linear-gradient(1turn, rgba(159, 219, 252, 0.15) 3%, transparent 0);
      background-size: 20px 20px;
      background-position: 50%;
    }
    html.dark .arona-content, html[theme='dark'] .arona-content {
      background-image: linear-gradient(90deg, rgba(207, 198, 254, 0.08) 3%, transparent 0),
        linear-gradient(1turn, rgba(207, 198, 254, 0.08) 3%, transparent 0);
    }
    .arona-content p { margin: 16px 0; line-height: 28px; color: var(--font-color-grey); }
    .arona-content blockquote {
      margin: 16px 0;
      border-left: 3px solid #5cd3ff;
      padding-left: 16px;
      background-color: rgba(92, 212, 255, 0.15);
      border-radius: 8px;
    }
    html.dark .arona-content blockquote, html[theme='dark'] .arona-content blockquote {
      background-color: rgba(157, 124, 216, 0.1);
      border-left: 3px solid #9d7cd8;
    }
    .arona-content blockquote > p { margin: 0; font-size: 16px; }
    .arona-content a { font-weight: 500; color: var(--color-blue); text-decoration: underline; text-underline-offset: 2px; }
    .arona-content strong { font-weight: bold; color: var(--font-color-grey); }
    .arona-content code {
      font-family: 'JetBrains Mono', monospace;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.05);
      padding: 2px 6px;
      color: var(--font-color-grey);
    }
    html.dark .arona-content code, html[theme='dark'] .arona-content code { background-color: rgba(255, 255, 255, 0.1); }
    .arona-content pre {
      position: relative;
      background-color: #efefef;
      border: 1px solid var(--foreground-color);
      border-radius: 16px;
      box-shadow: 0 0 5px #c1c1c1;
      overflow: hidden;
      padding: 16px;
      margin: 16px 0;
    }
    html.dark .arona-content pre, html[theme='dark'] .arona-content pre {
      background-color: #1f1f2c;
      border: 1px solid #383852;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
    .arona-content pre code { background-color: transparent; padding: 0; line-height: 1.6; }
    .arona-content h1, .arona-content h2, .arona-content h3,
    .arona-content h4, .arona-content h5, .arona-content h6 {
      position: relative; font-weight: bold; color: var(--font-color-grey); margin: 0;
    }
    .arona-content h1 { line-height: 40px; font-size: 32px; margin-top: 24px; }
    .arona-content h2 {
      margin: 48px 0 16px; border-top: 2px solid #ced4da; padding-top: 24px;
      line-height: 32px; font-size: 24px;
    }
    html.dark .arona-content h2, html[theme='dark'] .arona-content h2 { border-top: 2px solid rgba(157, 124, 216, 0.3); }
    .arona-content h3 { margin: 32px 0 0; line-height: 28px; font-size: 20px; }
    .arona-content h4, .arona-content h5, .arona-content h6 { line-height: 24px; font-size: 16px; }
    .arona-content hr { border: 0; border-top: 2px dashed #ced4da; }
    html.dark .arona-content hr, html[theme='dark'] .arona-content hr { border-top: 2px dashed rgba(157, 124, 216, 0.3); }
    .arona-content ul, .arona-content ol { padding-left: 1.25rem; margin: 16px 0; color: var(--font-color-grey); }
    .arona-content ul { list-style: disc; }
    .arona-content ol { list-style: decimal; }
    .arona-content li + li { margin-top: 8px; }
    .arona-content table { width: 100%; border-collapse: collapse; border: 2px solid #cad4d5; }
    html.dark .arona-content table, html[theme='dark'] .arona-content table { border: 2px solid #383852; }
    .arona-content th, .arona-content td { padding: 10px; text-align: center; border-bottom: 2px solid #cad4d5; }
    .arona-content th { background-color: #e7f6fa; color: var(--btn-hover); }
    .arona-content td { background-color: #f7f7f6; color: #3c3e41; }
    .arona-content img { max-width: 100%; height: auto; border-radius: 8px; }

    /* 上一篇 / 下一篇 */
    .arona-post-nav { display: flex; justify-content: space-between; gap: 16px; max-width: 1200px; margin: 32px auto 0; padding: 0 24px; box-sizing: border-box; }
    .arona-post-nav a {
      display: flex; flex-direction: column; flex: 1; max-width: 50%;
      padding: 16px 20px; border-radius: 32px;
      border: 2px solid var(--foreground-color);
      background: var(--foreground-color);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      text-decoration: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .arona-post-nav a:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(var(--blue-shadow-color), 0.5); }
    .arona-post-nav a.next { align-items: flex-end; text-align: right; margin-left: auto; }
    .arona-post-nav .nav-label { font-size: 14px; color: var(--color-blue); font-weight: 500; margin-bottom: 4px; }
    .arona-post-nav .nav-title { font-size: 16px; color: var(--font-color-grey); font-weight: bold; }

    /* ==================================================================
       侧边栏（NotionNext 自带，做 Arona 化）
       ================================================================== */
    .arona-sidebar .arona-side-card {
      background-color: var(--foreground-color);
      border-radius: 24px;
      border: 2px solid var(--foreground-color);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
      margin-bottom: 20px;
      overflow: hidden;
      color: var(--font-color-grey);
    }
    .arona-sidebar .arona-side-card .side-title {
      font-size: 15px; font-weight: bold; color: var(--font-color-grey);
      padding: 12px 16px; margin: 0;
      border-bottom: 1px solid rgba(var(--blue-shadow-color), 0.15);
    }
    .arona-sidebar .arona-side-card .side-body { padding: 8px 12px 12px; font-size: 14px; color: var(--font-color-grey); }
    .arona-sidebar .arona-side-list { list-style: none; padding: 0; margin: 0; }
    .arona-sidebar .arona-side-list li { padding: 4px 0; font-size: 14px; }
    .arona-sidebar a { color: var(--font-color-grey); text-decoration: none; }
    .arona-sidebar a:hover { color: var(--color-blue); }

    /* ==================================================================
       侧栏个人信息卡（排布参考 heo 主题 InfoCard.js）
       问候语+头像 / 昵称 / 公告 / 社交圆钮+了解更多
       ================================================================== */
    .arona-sidebar .arona-info-card { padding: 16px; }
    /* 问候语 + 头像同一行 */
    .arona-sidebar .arona-info-top {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
    }
    .arona-sidebar .arona-greeting {
      flex: 1;
      text-align: left;
      font-size: 13px;
      line-height: 1.5;
      color: var(--font-color-grey);
      background-color: rgba(var(--blue-shadow-color), 0.08);
      border: none;
      border-radius: 12px;
      padding: 6px 10px;
      cursor: pointer;
      font-family: inherit;
      transition: background-color 0.3s var(--transition-curve);
    }
    .arona-sidebar .arona-greeting:hover { background-color: rgba(var(--blue-shadow-color), 0.16); }
    .arona-sidebar .arona-info-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid var(--foreground-color);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.6);
    }
    /* 昵称：大号加粗 */
    .arona-sidebar .arona-info-name {
      font-size: 24px;
      font-weight: 800;
      margin: 12px 0 0;
      color: var(--font-color-grey);
      line-height: 1.2;
    }
    /* 公告：卡内的一段正文 */
    .arona-sidebar .arona-info-notice { margin-top: 8px; }
    .arona-sidebar .arona-info-notice .notion-page { font-size: 14px; line-height: 1.7; color: var(--font-color-grey); }
    .arona-sidebar .arona-info-notice .notion-page p { margin: 0 0 6px; }
    .arona-sidebar .arona-info-notice .notion-page a,
    .arona-sidebar .arona-info-notice .notion-link { color: var(--color-blue); }
    /* 底部：社交圆钮 + 了解更多 */
    .arona-sidebar .arona-info-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      margin-top: 14px;
    }
    .arona-sidebar .arona-info-social { display: flex; align-items: center; gap: 8px; }
    .arona-sidebar .arona-info-social a {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px;
      border-radius: 50%;
      font-size: 15px;
      color: var(--font-color-grey);
      background-color: rgba(var(--blue-shadow-color), 0.1);
      transition: background-color 0.3s var(--transition-curve), color 0.3s var(--transition-curve);
    }
    .arona-sidebar .arona-info-social a:hover {
      color: #fff;
      background-color: var(--btn-background);
    }
    .arona-sidebar .arona-info-more {
      display: flex; align-items: center; gap: 4px;
      font-size: 13px; font-weight: bold;
      padding: 6px 12px;
      border-radius: 16px;
      color: var(--font-color-grey);
      background-color: rgba(var(--blue-shadow-color), 0.1);
      transition: background-color 0.3s var(--transition-curve), color 0.3s var(--transition-curve);
    }
    .arona-sidebar .arona-info-more:hover { color: #fff; background-color: var(--btn-background); }

    /* 加入QQ群卡片 */
    .arona-sidebar .arona-qq-icon { margin-right: 6px; color: var(--color-blue); }
    .arona-sidebar .arona-qq-text { margin: 0 0 10px; font-size: 14px; line-height: 1.6; }
    .arona-sidebar .arona-qq-btn {
      display: block;
      text-align: center;
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 14px;
      color: #fff;
      background-color: var(--btn-background);
      transition: background-color 0.3s var(--transition-curve), transform 0.2s;
    }
    .arona-sidebar .arona-qq-btn:hover {
      background-color: var(--btn-hover);
      color: #fff;
      transform: translateY(-1px);
    }

    /* ==================================================================
       阅读进度条
       ================================================================== */
    .arona-reading-progress {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 3px;
      background: transparent; z-index: 101;
      opacity: 0; transition: opacity 0.3s ease;
    }
    .arona-reading-progress.visible { opacity: 1; }
    .arona-reading-progress .fill {
      height: 100%; width: 0%;
      background: var(--color-blue, #328cfa);
      transition: width 0.1s ease-out;
    }

    /* 移动端 TOC 按钮（简化） */
    .arona-toc-mobile-btn {
      display: none;
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      z-index: 999; padding: 8px 16px;
      background: var(--foreground-color);
      border: solid 2px var(--foreground-color);
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(var(--blue-shadow-color), 0.6);
      color: var(--font-color-grey);
      font-size: 14px; font-weight: 500; cursor: pointer;
    }
    @media (max-width: 1024px) { .arona-toc-mobile-btn { display: flex; align-items: center; gap: 6px; } }

    /* ==================================================================
       列表标题 / 搜索栏 / 分类标签云 / 404
       ================================================================== */
    .arona-list-heading { padding-bottom: 32px; font-size: 24px; font-weight: bold; color: var(--font-color-grey); }
    .arona-search-bar { margin-bottom: 32px; }
    .arona-tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .arona-cloud-item {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 12px;
      color: var(--font-color-grey); text-decoration: none;
      background: var(--foreground-color);
      border: 2px solid var(--foreground-color);
      box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.5);
      transition: all 0.4s;
    }
    .arona-cloud-item:hover { color: var(--color-blue); transform: translateY(-2px); }
    .arona-404 { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; min-height: 50vh; text-align: center; }
    .arona-404-img { width: min(420px, 70vw); height: auto; border-radius: 24px; }
    .arona-404-text { color: var(--font-color-grey); }
    .arona-404-text h2 { font-size: 32px; display: flex; align-items: center; justify-content: center; margin: 0 0 8px; }

    /* ==================================================================
       Notion 内容容器适配（保留 NotionPage 渲染的既有功能）
       ================================================================== */
    #theme-arona .notion-page-content { color: var(--font-color-grey); }
    #theme-arona .notion-callout { border-radius: 16px; }

    /* ==================================================================
       全站响应式补丁
       ------------------------------------------------------------------
       放在文件末尾统一覆盖，而不是散落在各组件段落里。理由：
         · 各段落的 @media 只处理自己关心的断点，跨组件的溢出没人负责
           （实测：代码块 pre 在窄屏把内容裁掉、表格撑破容器、
             360px 屏上正文与侧栏整体右溢出 30px）；
         · 集中一处便于日后统一调整栅格与断点，不必逐段翻。
       设计原则：断点只看「布局是否换行」，不看设备名 ——
         1200 侧栏转纵向 / 1024 隐藏目录 / 900 header 收紧 /
         768 主断点 / 640 压缩留白 / 480 窄屏字号。
         比堆设备型号式断点更少冗余，也更容易预测。

       注意：这些规则必须放在文件末尾才能覆盖前面的同优先级声明。
    ================================================================== */

    /* ---------- 全局兜底 ----------
       任一子元素宽于视口时，页面会出现横向滚动条，
       移动端表现为「整页可横向拖动」，体验很差。
       用 clip 而非 hidden：hidden 会创建滚动容器，
       从而让 position: sticky 失效（TOC 依赖 sticky）。 */
    html, body { overflow-x: clip; }
    @supports not (overflow-x: clip) { html, body { overflow-x: hidden; } }

    /* flex/grid 子项补 min-width: 0 ——
       flex 子项默认 min-width:auto，内容（长单词、pre、表格）会把它撑破，
       只有显式归零才允许收缩。这是 flex 布局最常见的溢出来源。 */
    .arona-main-flex > *,
    .arona-post-layout > *,
    .arona-content-col,
    .arona-view-box,
    .arona-content,
    .arona-sidebar { min-width: 0; }

    /* ---------- 1200：侧栏转纵向 ----------
       原先要到 1024 才转；但 1024~1200 段侧栏仍占 288px，
       正文只剩 888px，而 900~1024 段更窄，转纵向更早更合理。 */
    @media (max-width: 1200px) {
      .arona-main-flex { flex-direction: column; }
      /* auto-fit + minmax：卡片数少于可放列数时（如 3 张卡放在 4 列的位置）
         不会留下空轨道，而是让已有列平分宽度。
         上限 1fr 不设固定列宽，卡片过少时整行铺满，
         故再给 480px 以上限制最大列数，避免超宽屏下单卡横跨整行。 */
      .arona-sidebar {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
        align-items: start;
      }
      .arona-sidebar > .arona-side-card { margin-bottom: 0; }
    }

    /* ---------- 1024：隐藏目录侧栏 ---------- */
    @media (max-width: 1024px) {
      .arona-toc-sidebar { display: none; }
      .arona-view-box,
      .arona-post-layout.no-toc .arona-view-box {
        margin: 0 auto;
        max-width: 100%;
      }
    }

    /* ---------- 900：header 菜单 ----------
       注意：原先这里写的是 .arona-header .search-box，
       但 arona 的 Header.js 根本没有 search-box 这个元素
       （搜索走 .arona-search-dialog 弹窗），那两条规则从未生效。
       900px 以下真正需要收紧的是菜单项间距与 logo 尺寸。 */
    @media (max-width: 900px) {
      .arona-header .menu ul { gap: clamp(6px, 1.6vw, 14px); }
      .arona-header .menu li a { padding: 8px 8px; font-size: 14px; }
      .arona-header .logo img { height: 26px; min-width: 26px; }
      /* nav 是 flex 且 space-between：logo / menu / hamburger 三者总宽
         超过视口时，.menu 虽有 overflow-x:auto 仍会被 flex 挤出容器右缘
         （实测 360px 下菜单末项右缘 365 > 360）。
         min-width:0 让它能缩到可用宽度，内部再由自己的 overflow-x:auto 滚动。
         额外的右侧留白由 .menu-scroll-hint 规则按需提供，不在这里写死。 */
      .arona-header .menu { min-width: 0; }
      .arona-header .hamburger { flex-shrink: 0; }
    }

    /* ---------- 768：主断点 ---------- */
    @media (max-width: 768px) {
      .arona-container { width: calc(100% - 24px); }
      .arona-view-box { padding: clamp(16px, 4vw, 24px); border-radius: 24px; }
      .arona-post-layout { padding: 0 12px; }
      /* 侧栏保持 auto-fit 不改：768px 时容器约 728px，
         auto-fit 放得下 2 列（每列 356px），比强制 1 列横跨 728px 更紧凑。
         minmax 的 260px 下限已保证卡片不会被压到读不清。 */

      /* 32px 的 h1 在 360px 屏上每行仅 9 字，视觉笨重；
         用 clamp 让 768→480 之间平滑收缩，不需要多档断点。 */
      .arona-content h1 { font-size: clamp(22px, 5.2vw, 28px); line-height: 1.4; }
      .arona-content h2 { font-size: clamp(19px, 4.4vw, 24px); }
      .arona-content h3 { font-size: clamp(17px, 4vw, 20px); }
      .arona-content p { line-height: 1.9; }

      /* 上一篇/下一篇两列并排时，每列不足 150px，中文标题逐字换行 */
      .arona-post-nav { flex-direction: column; gap: 12px; }
      .arona-post-nav-item { max-width: 100%; }
    }

    /* ---------- 900：平板竖屏，侧栏收为两列 ----------
       900px 下 auto-fit 用 260px 下限会排出 3 列（每列 263px），
       侧栏卡片（如公告正文、目录树）在这个宽度下读起来局促。
       提高下限到 300px 使其降为 2 列。 */
    @media (max-width: 900px) {
      .arona-sidebar { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    }

    /* ---------- 640：压缩留白 ---------- */
    @media (max-width: 640px) {
      .arona-container { width: calc(100% - 16px); }
      .arona-view-box { padding: 16px 14px; border-radius: 18px; }
      .arona-content blockquote { padding-left: 14px; }
      .arona-content th, .arona-content td { padding: 8px 6px; }
      /* 640 以下容器已不足 300px + gap，只能单列 */
      .arona-sidebar { grid-template-columns: 1fr; }
    }

    /* ---------- 480：窄屏字号与圆角 ---------- */
    @media (max-width: 480px) {
      .arona-content h1 { font-size: 21px; }
      .arona-content h2 { font-size: 18px; }
      .arona-content h3 { font-size: 16px; }
      .arona-content p { font-size: 15px; line-height: 1.9; }
      .arona-content pre { padding: 12px; border-radius: 12px; }
      .arona-content img { border-radius: 6px; }
      .arona-side-card { padding: 16px 14px; }
    }

    /* ---------- 矮屏（横屏手机 / 矮窗口） ----------
       header 用 75vh，横屏时 75vh 可能只有 160px，正文被挤出首屏。 */
    @media (max-height: 560px) {
      .arona-header,
      .arona-banner { height: 56vh; min-height: 56vh; }
      .arona-banner.postViewer { height: 40vh; }
      .arona-toc { max-height: calc(100vh - 110px); }
    }
    @media (max-height: 420px) {
      .arona-header,
      .arona-banner { height: 46vh; min-height: 46vh; }
    }

    /* ---------- 超宽屏 ----------
       容器封顶 1200px 后，超宽屏两侧大片留白，
       而看板娘贴在 3% 处离正文很远。放宽到 1440px。 */
    @media (min-width: 2000px) {
      .arona-container,
      .arona-view-box,
      .arona-post-layout.no-toc .arona-view-box,
      .arona-post-nav { max-width: 1440px; }
    }

    /* ---------- 长内容溢出防护（实测修复） ----------
       .arona-content pre 原本是 overflow: hidden，
       代码块超宽时内容被直接裁掉、无法滚动（等于内容丢失）。
       改为 auto：超宽时出现横向滚动条。
       table 改为 display:block + overflow-x:auto 才有滚动容器，
       table 本身需保持 table 布局才能对齐列，故白名单 nowrap。 */
    .arona-content pre {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      max-width: 100%;
    }
    .arona-content pre code {
      display: block;
      white-space: pre;
      width: max-content;
      min-width: 100%;
    }
    .arona-content table {
      display: block;
      overflow-x: auto;
      max-width: 100%;
      white-space: nowrap;
    }
    @media (max-width: 768px) {
      .arona-content table { white-space: normal; }
    }
    /* 行内代码、长链接、连续英文（URL / hash / 报错栈）
       是窄屏溢出的最常见来源，允许在任意位置断行。 */
    .arona-content code,
    .arona-content a {
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .arona-content p,
    .arona-content li { overflow-wrap: break-word; }

    /* 减少动态效果 */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.001ms !important;
      }
    }

    ${themeConsoleStyle('arona', CONFIG)}
  `}</style>
}

export { Style }
