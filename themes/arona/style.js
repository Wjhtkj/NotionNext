/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
/**
 * AronaNote 主题全局样式
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

      /* AronaNote 未定义、被 TOC 等组件引用 */
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

    /* 用 :where() 把 ID 的权重归零，保持与 AronaNote 原始 less 相同的层叠优先级
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

    .arona-header .menu {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      margin: 0 24px;
      padding: 0;
    }
    .arona-header .menu::-webkit-scrollbar { display: none; }
    .arona-header .menu ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0;
      margin: 0;
      list-style: none;
      white-space: nowrap;
      gap: clamp(16px, 4vw, 64px);
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

    /* 主内容 + 侧边栏（列表页布局；AronaNote 首页为单列，此处仅在非全宽时启用侧栏） */
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
       ================================================================== */
    .arona-spine-wrap {
      position: fixed;
      bottom: 25px;
      left: 3%;
      z-index: 120;
      height: 45vh;
      min-height: 300px;
      width: auto;
      filter: drop-shadow(0 0 3px rgba(40, 42, 44, 0.42));
      cursor: pointer;
      transition: opacity 0.3s ease, bottom 0.3s ease;
    }
    .arona-spine-wrap canvas { display: block; }
    @media (max-width: 1440px) { .arona-spine-wrap { opacity: 0.7; } }
    @media (max-width: 768px) { .arona-spine-wrap { display: none; } }
    .arona-spine-wrap.hidden { display: none !important; }
    .arona-spine-dialog {
      position: fixed;
      z-index: 121;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0.92);
      color: #000;
      border-radius: 25px;
      padding: 12px 24px;
      line-height: 1.4;
      font-size: 18px;
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
      z-index: 200;
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
