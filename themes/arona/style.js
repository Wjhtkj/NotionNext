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
      /* ==================================================================
         动效 token
         ------------------------------------------------------------------
         改之前全站散着 0.1s / 0.15s / 0.2s / 0.25s / 0.28s / 0.3s / 0.35s
         / 0.4s / 0.5s / 0.6s / 0.8s 共 11 种时长、6 种缓动写法，导致同一类
         交互在不同组件里手感不一致（比如「卡片浮升」在列表页是 0.5s、
         在标签云是 0.35s、在搜索结果是 0.5s all）。
         这里收敛成 3 档时长 + 3 条曲线，所有 transition / animation 引用变量：

           fast   160ms  颜色、描边这类「按下就要有反应」的微反馈
           base   260ms  悬停、展开、图标切换这类常规状态变化
           slow   420ms  卡片浮升、主题换肤这类有实体感的位移/大面积变色

           out    进场与位移：前快后慢，收尾干净
           inout  双向状态切换（展开 ↔ 收起）
           spring 需要「弹一下」的强调（开关、按钮按下）

         --transition-time / --transition-curve 保留为 base 档的别名，
         避免其他主题或组件里已有的引用断掉。
         ================================================================== */
      --arona-dur-fast: 160ms;
      --arona-dur-base: 260ms;
      --arona-dur-slow: 420ms;
      --arona-ease-out: cubic-bezier(0.22, 0.68, 0, 1);
      --arona-ease-inout: cubic-bezier(0.4, 0, 0.2, 1);
      --arona-ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);
      --transition-time: var(--arona-dur-base);
      --transition-curve: var(--arona-ease-inout);

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
      /* background-image 是 url()，本来就不参与插值，列在 transition 里
         除了让浏览器每帧多做一次属性比对没有任何作用，删掉。
         只留真正会变的底色与文字色。 */
      transition:
        background-color var(--arona-dur-slow) var(--arona-ease-inout),
        color var(--arona-dur-slow) var(--arona-ease-inout);
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
      /* 原来是 transition: all —— 按钮上会变的东西就这几样，
         写全了比 all 快：浏览器不必对 padding/font-size 之类的继承属性
         也逐帧做 diff，也不会误伤将来加进来的布局属性。 */
      transition:
        background-color var(--arona-dur-fast) var(--arona-ease-inout),
        color var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-out),
        box-shadow var(--arona-dur-base) var(--arona-ease-out);
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
      /* 整体居中：LOGO / 菜单 / 动作区作为一个组停在导航栏正中。
         原先这里是 space-between（LOGO 贴左、按钮贴右），按用户要求改为居中。
         注意 center 与 space-between 的一个真实差异：内容超宽时
         space-between 把溢出挤到右侧之外，center 则向两侧同时溢出 ——
         但 .menu 有 min-width:0 + 溢出时内部横向滚动（见 .menu-scroll），
         LOGO 与动作区都是 flex-shrink:0 的定宽，组宽永远缩得回来，
         不会出现两侧溢出。 */
      justify-content: center;
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
    /* 右侧动作区（ThemeToggle + 汉堡 + 下拉面板，见 Header.js）。
       height:100% 是为了让下拉面板的 top:100% 正好落在 nav 底边
       （容器若只有 32px 高，面板会探进导航栏里 20px）；
       position:relative 是给绝对定位的面板当包含块，让它跟着汉堡走。 */
    .arona-header .nav-actions {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      flex-shrink: 0;
      gap: 6px;
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
      /* 给下方 .menu-scroll-hint 的 ::after 当包含块 —— span 是行内元素，
         不设 position:relative 的话绝对定位会一路向上找到 nav，
         提示条就钉死在导航栏右缘（顶栏居中后那里已经不是菜单边缘了）。 */
      position: relative;
    }
    /* 仅在实测溢出时（Header.js 加 .menu-scroll）才成为滚动容器。
       代价是子菜单重新被裁（见下方 .menu-scroll 下的降级规则）。 */
    .arona-header .menu ul.menu-scroll {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .arona-header .menu ul.menu-scroll::-webkit-scrollbar { display: none; }
    /* menu-scroll 时子菜单常驻缩进会把 li 撑高（父项 + 三个子项 ≈ 170px），
       而 nav 写死 height: 72px + align-items: center ——
       li 超出后上下各溢出约 48px，顶部那项直接跑到视口外看不见。
       所以这状态下 nav 改为内容驱动高度、子项顶对齐，
       让 nav 自己撑高到容纳整棵菜单。

       注意：此规则只对「宽屏但菜单放不下」生效（如 700~1000px）。
       ≤768px 走下面的移动端抽屉（.menu-drawer-open），
       抽屉是 fixed 覆盖层、不参与 nav 布局，nav 高度不受影响。 */
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
         · 放在 ul 内不行 —— 绝对定位会随横向滚动内容一起移动，滑到哪它跟到哪；
         · 放在 nav 上（:has() 选择）曾是旧方案，但提示条位置只能写死
           right:52px，那是「space-between 布局下菜单右缘紧贴汉堡左侧」
的推算值；顶栏改为整体居中后菜单右缘不再贴汉堡，写死的位置会脱锚。
       所以最终画在 .menu 的 ::after 上：.menu 已设 position:relative，
       而 ul（溢出时才是滚动容器）作为块级子元素撑满 .menu 的内容宽，
       两者右缘重合 —— right:0 恰好是滚动视口的右缘，菜单滑动时
       提示条不动，位置与菜单边缘严格对齐，且不依赖 :has()。 */
    .arona-header .menu.menu-scroll-hint::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      border-radius: 2px;
      background: var(--color-blue);
      opacity: 0.5;
      pointer-events: none;
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
      /* 原来是 all 0.5s + transform 0.8s —— 两处问题：
         ① all 把 padding / font-size 也算进去；
         ② 位移用了 0.8s，比同页任何其他 hover 都慢一倍多，
            鼠标扫过一排菜单时会「追手」。统一到 base 档。 */
      transition:
        color var(--arona-dur-base) var(--arona-ease-inout),
        background-color var(--arona-dur-base) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-out);
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
      transition: transform var(--arona-dur-base) var(--arona-ease-inout);
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
      transition: opacity var(--arona-dur-fast) var(--arona-ease-inout), transform var(--arona-dur-base) var(--arona-ease-out), visibility var(--arona-dur-fast);
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
      /* 只做位移/旋转/淡出，全是合成属性 */
      transition:
        transform var(--arona-dur-base) var(--arona-ease-inout),
        opacity var(--arona-dur-fast) var(--arona-ease-inout);
    }
    .arona-header .hamburger.active .line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .arona-header .hamburger.active .line:nth-child(2) { opacity: 0; }
    .arona-header .hamburger.active .line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    /* ==================================================================
       专门的深浅色切换按钮（components/ThemeToggle.js）
       ------------------------------------------------------------------
       放在汉堡按钮左边，一步换主题，不再埋在下拉面板的 select 里。

       图标用**内联 SVG** 而不是 FontAwesome：FA 加载失败时图标宽度为 0、
       布局会跟着塌（这个坑在 .sub-arrow 上已经踩过一次，见上面注释）。

       两个图标都常驻 DOM，显隐完全由 <html> 的类决定，不依赖 JS state：
       _document.js 的内联脚本在首屏绘制前就把 dark/light 设好了，
       所以图标从第一帧就是对的；JS 只负责点击后的写值与 aria-label。
       ================================================================== */
    .arona-header .theme-toggle {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      /* 窄屏下 menu 是 fixed、logo 与两个按钮要能共存，不允许被压缩 */
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      min-width: 32px;
      /* 与汉堡的 6px 间距由 .nav-actions 的 gap 负责。
         原先这里写 margin-left:auto 把动作组推到最右（nav 当年是
         space-between）；顶栏改整体居中后auto 会把组重新推偏，必须去掉。 */
      margin-right: 0;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--font-color-grey);
      cursor: pointer;
      outline: none;
      transition:
        background-color var(--arona-dur-fast) var(--arona-ease-inout),
        color var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-out);
    }
    .arona-header .theme-toggle:hover {
      background-color: rgba(var(--blue-shadow-color), 0.18);
      color: var(--color-blue);
      transform: translateY(-1px);
    }
    .arona-header .theme-toggle:active { transform: translateY(0) scale(0.92); }
    .arona-header .theme-toggle svg {
      position: absolute;
      width: 18px;
      height: 18px;
      transition:
        opacity var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-spring);
    }
    /* 默认（<html> 类还没就位的那一两帧）显示月亮 —— 与 blog.config 里
       APPEARANCE 的默认值一致，避免亮/暗图标闪一下。 */
    .arona-header .theme-toggle .icon-sun { opacity: 0; transform: rotate(-90deg) scale(0.4); }
    .arona-header .theme-toggle .icon-moon { opacity: 1; transform: rotate(0deg) scale(1); }
    /* 深色 → 显示太阳（点它去浅色）；浅色 → 显示月亮（点它去深色） */
    html.dark .arona-header .theme-toggle .icon-sun,
    html[theme='dark'] .arona-header .theme-toggle .icon-sun {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    html.dark .arona-header .theme-toggle .icon-moon,
    html[theme='dark'] .arona-header .theme-toggle .icon-moon {
      opacity: 0;
      transform: rotate(90deg) scale(0.4);
    }
    html.light .arona-header .theme-toggle .icon-moon,
    html[theme='light'] .arona-header .theme-toggle .icon-moon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    html.light .arona-header .theme-toggle .icon-sun,
    html[theme='light'] .arona-header .theme-toggle .icon-sun {
      opacity: 0;
      transform: rotate(-90deg) scale(0.4);
    }

    /* 主题切换时的颜色过渡：点击时给 <html> 挂一个短命的 .arona-theme-anim，
       过渡跑完后由 JS 摘掉。只过渡 background-color / border-color / color，
       不碰 background 简写 —— 简写会把背景图一起重置掉。
       时长统一到 slow 档（420ms），与圆形揭幕的 0.6s 处在同一个节奏上：
       原来这里 0.35s、卡片 0.5s、侧栏 0.4s，揭幕到不同元素时颜色快慢不一，
       圆边扫过去能看到「这张卡先变、那张后变」的错位。 */
    html.arona-theme-anim #theme-arona,
    html.arona-theme-anim .arona-header nav {
      transition:
        background-color var(--arona-dur-slow) var(--arona-ease-inout),
        border-color var(--arona-dur-slow) var(--arona-ease-inout),
        color var(--arona-dur-slow) var(--arona-ease-inout);
    }
    /* 卡片类表面也要跟着变色，否则圆形揭幕 revealing 到它们时颜色是硬跳的。
       做法上的取舍：不新建 transition 列表，而是**沿用各表面自己的
       transition 时长/曲线**，只在末尾追加 background-color ——
       这样 hover 浮升（transform）的手感与平时完全一致，
       不会出现「切换主题的几百毫秒内 hover 变成硬跳」的副作用。
       类摘掉后各表面回到自己的规则，无残留。 */
    html.arona-theme-anim .arona-post-card {
      transition:
        transform var(--arona-dur-slow) var(--arona-ease-out),
        border-left-color var(--arona-dur-slow) var(--arona-ease-inout),
        background-color var(--arona-dur-slow) var(--arona-ease-inout);
    }
    html.arona-theme-anim .arona-sidebar .arona-side-card,
    html.arona-theme-anim .arona-footer,
    html.arona-theme-anim .arona-dropdown .menu-content {
      transition:
        background-color var(--arona-dur-slow) var(--arona-ease-inout),
        border-color var(--arona-dur-slow) var(--arona-ease-inout),
        color var(--arona-dur-slow) var(--arona-ease-inout);
    }

    /* ==================================================================
       主题切换的「圆形揭幕」（View Transitions API）
       ------------------------------------------------------------------
       ThemeToggle.js 在点击时调 document.startViewTransition()，浏览器给
       旧页面、新页面各拍一张位图叠到顶层，我们只控制「新页面露出多少」：
         ::view-transition-old(root)   旧页面，**不参与动画**，一直铺在下面
         ::view-transition-new(root)   新页面，按 circle(0) → circle(R) 裁开

       圆心与半径由 JS 写进 <html> 的 --arona-reveal-x/y/r（自定义属性会
       被过渡伪元素继承），关键帧里就不用塞内联样式。
       html.arona-theme-switching 是「过渡进行中」的标记，作用有三个：
         · 关掉 #theme-arona 自身 500ms 的背景/颜色过渡 —— 否则新快照会拍在
           浅→深的中间色上，圆里是一片灰；
         · 关掉切换按钮图标的过渡 —— 快照是静止位图，图标若正在旋转淡出，
           会整段动画冻结成「月亮叠着太阳」的糊影；
         · 过渡结束由 JS 摘掉（连点时按序号判断，不会误摘新过渡的类）。

       为什么不沿用「全屏遮罩复制旧背景 + transform: scale」：
       clip 半径取「点击点到最远视口角」，这个圆恒大于整个视口矩形，裁剪
       边界永远在盒子外面 —— 遮罩实际一直是**矩形**，scale 缩小时就是一块
       矩形往按钮里缩，不是圆形揭幕（已由截图实证）；而且遮罩只复制了背景，
       页面文字在点击瞬间就换成新主题了，圆里是一块没有内容的底色。
       View Transitions 叠的是两帧真实页面：旧内容一直在，圆边扫过才换，
       成本还更低（两张静态位图 + 一个 clip-path 动画，不重绘页面）。
       ================================================================== */
    html.arona-theme-switching::view-transition-old(root),
    html.arona-theme-switching::view-transition-new(root) {
      /* 默认的交叉淡入淡出关掉：旧的必须一直可见，新的只由 clip 决定露出多少。
         mix-blend-mode 归位，避免两层叠加把颜色提亮。 */
      animation: none;
      mix-blend-mode: normal;
    }
    html.arona-theme-switching::view-transition-new(root) {
      /* 这里不能用 var(--arona-ease-inout)：::view-transition-* 是挂在
         文档根下的过渡伪元素，不是 #theme-arona 的后代，继承不到那边的
         自定义属性，var() 会失效、曲线退回 ease。所以曲线要写死。
         （--arona-reveal-x/y/r 能用，是因为 ThemeToggle 直接写在 <html> 上。） */
      animation: arona-theme-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes arona-theme-reveal {
      from {
        clip-path: circle(0px at var(--arona-reveal-x, 50%) var(--arona-reveal-y, 50%));
      }
      to {
        clip-path: circle(
          var(--arona-reveal-r, 150vmax) at var(--arona-reveal-x, 50%) var(--arona-reveal-y, 50%)
        );
      }
    }
    /* 揭幕进行中：页面自身的过渡只剩重绘成本，还会把快照拍成中间态 */
    html.arona-theme-switching #theme-arona {
      transition: none;
    }
    html.arona-theme-switching .arona-header .theme-toggle svg {
      transition: none;
    }

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
      transition:
        opacity var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-out);
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
      transition: transform var(--arona-dur-base) var(--arona-ease-out);
    }
    .arona-dropdown .first-row a.arona-tool:hover { transform: translateY(-3px); }

    /* 开关 */
    .arona-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
    .arona-switch input { opacity: 0; width: 0; height: 0; }
    .arona-switch .slider {
      position: absolute; cursor: pointer; inset: 0;
      background-color: rgba(var(--blue-shadow-color), 0.15);
      transition: background-color var(--arona-dur-base) var(--arona-ease-inout); border-radius: 24px;
    }
    .arona-switch .slider:before {
      position: absolute; content: ''; height: 18px; width: 18px; left: 3px; bottom: 3px;
      background-color: white;
      /* 滑块用 spring，按下去有点「咬合感」；原来是简写 transition: 0.3s，
         等于 all 0.3s，连 box-shadow 也在逐帧插值 */
      transition: transform var(--arona-dur-base) var(--arona-ease-spring);
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .arona-switch input:checked + .slider { background-color: rgba(var(--blue-shadow-color), 0.6); }
    .arona-switch input:checked + .slider:before { transform: translateX(20px); }

    /* 桌面端遮罩兜底：抽屉是移动端专属交互，桌面端不该有遮罩。
       JSX 里遮罩是 {drawerOpen && ...} 条件渲染，正常不会在桌面端出现；
       但视口跨断点（比如移动端展开抽屉后转屏/拉宽）存在 state 残留的
       可能 —— 那个窗口里遮罩会 fixed 铺满，把整页挡住且点不到菜单。
       这里显式 display:none 兜底，不依赖 state 一定被清干净。 */
    .arona-header .menu-backdrop { display: none; }

    /* ==================================================================
       移动端主菜单抽屉（≤768px）
       ------------------------------------------------------------------
       为什么不用「横向滑动」：移动端菜单有 6 个顶项（首页/友链/Github/
       作品集/往期整理+3子项/关于），实测 360px 下 ul 的 scrollWidth=418
       而 clientWidth=228 —— 「往期整理」和「关于」永远在屏外，用户必须
       横向滑动才能发现它们，且没有任何提示。更糟的是早先为了不被裁而做的
       「子菜单常驻缩进」会把 nav 从 64px 撑到 222px，导航栏吃掉小屏 28%
       的高度，首屏内容与 Banner 都被挤没。

       所以移动端改为常规做法：菜单折进汉堡按钮，点击后竖向抽屉展开。
         · nav 高度固定 64px，不再被子菜单撑开
         · 抽屉 fixed 覆盖，不参与 nav 布局
         · 父项点击展开子项（accordion），全部竖排、超高可滚动
         · 遮罩点击关闭
       ================================================================== */
    @media (max-width: 768px) {
      .arona-header nav { height: 64px; }
      .arona-header .hamburger { width: 32px; }

      /* 桌面端的 display:none 兜底在移动端要放开 */
      .arona-header .menu-backdrop { display: block; }

      /* 遮罩：fixed 铺满、盖住页面内容但压在抽屉之下。
         z-index 98 < 抽屉 99，且都在 nav（z-index 100）内。

         高度不能用 inset 推导 —— nav 上有 backdrop-filter（毛玻璃），
         而 backdrop-filter 会让该元素成为 position:fixed 的**包含块**。
         于是 bottom:0 是相对 nav（高 64px）解析的，top:64px 又正好是
         nav 的底边，高度算成 0，遮罩完全不生效、点遮罩关不掉抽屉
         （线上实测 h=0）。改成显式的视口高度，与 nav 尺寸解耦。

         宽度继续用 left/right:0 —— 相对 nav（含 backdrop-filter 的
         包含块）解析正好等于内容容器宽度，比 100vw 更贴合版心，
         也不会溢出屏幕。 */
      .arona-header .menu-backdrop {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        /* 两条高度做渐进增强：vh 老浏览器必支持，dvh 在移动端地址栏
           收起时更准。 */
        height: calc(100vh - 64px);
        height: calc(100dvh - 64px);
        z-index: 98;
        /* 0.35 偏淡：banner 是大图，遮罩压不太住，抽屉区域和背景
           分层不明显。加深到 0.55，既能压住底图又不至于让整页发闷。 */
        background: rgba(0, 0, 0, 0.55);
        -webkit-backdrop-filter: blur(2px);
        backdrop-filter: blur(2px);
        animation: arona-fade-in var(--arona-dur-base) var(--arona-ease-inout);
      }

      /* 抽屉本体。收起态用 visibility + opacity + pointer-events，
         不用 display:none（那样做不了过渡，且 pointer-events 已足够
         阻止收起态的误点）。
         left/right:0 相对 nav（含 backdrop-filter 的包含块）解析，
         正好等于版心宽度；max-height 已是显式视口单位，不受该包含块影响。 */
      .arona-header .menu {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        z-index: 99;
        max-height: calc(100vh - 64px);
        max-height: calc(100dvh - 64px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        margin: 0;
        padding: 8px clamp(12px, 4vw, 20px) 20px;
        /* --triangle-background 是三层半透明渐变、没有不透明底色。
           桌面端菜单是横向窄条、后面紧贴 nav 自己的底色，看不出来；
           但抽屉是覆盖在 banner 上的大面板，半透明底会让 banner 的大字
           透过来和菜单文字叠在一起（线上截图实测「首页/友链/Github」
           几乎读不出来）。所以这里补一层不透明底色再叠渐变。 */
        background-color: var(--general-background-color);
        background-image: var(--triangle-background);
        /* 不再叠 backdrop-filter —— 上面已经有不透明底色，
           模糊背后已经看不见的东西，纯属多余的合成开销。
           而且它会让本元素成为子元素的 fixed 包含块（见上面注释）。 */
        border-bottom: 2px solid var(--foreground-color);
        box-shadow: 0 8px 24px rgba(var(--blue-shadow-color), 0.5);
        visibility: hidden;
        opacity: 0;
        transform: translateY(-12px);
        /* 抽屉只做位移+淡入。visibility 必须带过渡，否则收起时面板会
           立刻消失、看不到滑回去的过程（visibility 是离散属性，
           在过渡结束时才翻转，正是我们想要的）。 */
        transition:
          opacity var(--arona-dur-base) var(--arona-ease-inout),
          transform var(--arona-dur-base) var(--arona-ease-out),
          visibility var(--arona-dur-base);
        pointer-events: none;
      }
      .arona-header.menu-drawer-open .menu {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      /* 竖排：不再横向滑动 */
      .arona-header .menu ul,
      .arona-header .menu ul.menu-scroll {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        width: 100%;
        overflow: visible;
      }
      .arona-header .menu li {
        width: 100%;
        border-bottom: 1px solid rgba(128, 128, 128, 0.14);
      }
      .arona-header .menu li:last-child { border-bottom: none; }
      .arona-header .menu li a {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 13px 12px;
        font-size: 15px;
        border-radius: 10px;
      }
      /* 子菜单默认收起，点父项才展开（accordion）。
         这里必须把桌面端那套绝对定位**全部重置**，漏一项就会整体偏移：
           · position → static（脱离 hover 时居中的绝对定位）
           · left → auto（桌面端是 left:50% + translateX(-50%) 居中；
               即使 position 变 static，某些浏览器/层叠上下文下
               left 仍会参与布局 —— 实测线上子菜单 x=-144、
               父项 x=26，横向平移了 170px，三个子项文字全跑到屏外）
           · transform → none（同一原因，且桌面端 hover/focus-within
               那条 translateX(-50%) translateY(0) 也会参与）
           · z-index → auto（桌面端 130 在抽屉里没必要，
               抽屉本体已 z-index 99 把整组抬到遮罩之上）
         选择器前缀多一层 .menu-drawer-open 是为了压过桌面端规则 ——
         同特异性的情况下靠「后写」生效，而桌面端 hover 那条在文件更早处，
         但 :hover 是动态的、随时可能重新匹配，不能只靠顺序赌。 */
      .arona-header.menu-drawer-open .menu li.has-sub > .sub-menu {
        position: static;
        left: auto;
        right: auto;
        top: auto;
        transform: none;
        z-index: auto;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        box-shadow: none;
        display: none;
        min-width: 0;
        margin: 0;
        padding: 0 0 6px 0;
        border-width: 0;
        background: transparent;
      }
      .arona-header.menu-drawer-open .menu li.sub-expanded > .sub-menu { display: block; }
      /* 桌面端 :hover / :focus-within 那条会给子菜单 translateX(-50%) translateY(0)。
         移动端抽屉里父项是被「点」展开的，鼠标不一定在它身上；
         但触屏/鼠标操作随时可能触发 :hover，把已展开的子菜单横向甩出去。
         所以这里对 hover/focus 状态也显式清掉位移。 */
      .arona-header.menu-drawer-open .menu li.has-sub:hover > .sub-menu,
      .arona-header.menu-drawer-open .menu li.has-sub:focus-within > .sub-menu {
        transform: none;
      }
      /* 父项（往期整理）：箭头在标题**左侧**，间距由父级 flex 的 gap 提供。
         这里不加 margin-left:auto —— 图标字体加载失败时箭头宽度为 0，
         auto 仍会把它甩到行尾、把标题挤到最左边（夹具实测复现过）。
         min-width 保证图标缺失时间距不塌成 0，text-align 让旋转后的
         图标仍以自身为中心，标题完全不受影响。 */
      .arona-header .menu li.has-sub > a .sub-arrow {
        min-width: 12px;
        text-align: center;
        transition: transform var(--arona-dur-base) var(--arona-ease-inout);
      }
      .arona-header .menu li.sub-expanded > a .sub-arrow { transform: rotate(90deg); }
      .arona-header .menu li.has-sub > .sub-menu li a {
        padding: 10px 12px 10px 34px;
        font-size: 14px;
      }
      /* 抽屉已把菜单全竖排展示，横向溢出提示不再有意义。
         Header.js 在移动端也会摘掉 menu-scroll-hint，这里双保险。 */
      .arona-header .menu.menu-scroll-hint::after { display: none; }
    }

    @keyframes arona-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ==================================================================
       滚动进场 + 卡片鼠标高光（ScrollReveal.js）
       ------------------------------------------------------------------
       初始隐藏态挂在 html.arona-reveal-on 下，而那个类是由 JS 加上的。
       这样 JS 一旦没跑（禁用脚本/报错），内容就是正常可见的 ——
       不会把整站变成空白页。这是所有「进场动画」都必须守住的底线。

       为什么用 animation 而不是 transition：
       进场播完后，transition 的 delay（--arona-reveal-delay）会一直留在
       元素上，之后每一次 hover 位移都要先等那几百毫秒延迟，卡片会「发木」。
       改用 animation + fill-mode: backwards 就没这个问题 ——
       动画播完即失效，hover 过渡回到 .arona-post-card 自己那条，
       延迟变量留在那儿也无害。
       ================================================================== */
    .arona-reveal-on .arona-post-card,
    .arona-reveal-on .arona-sidebar .arona-side-card,
    .arona-reveal-on .arona-tag-cloud .arona-cloud-item,
    .arona-reveal-on .arona-list-heading,
    .arona-reveal-on .arona-view-box {
      opacity: 0;
    }
    .arona-reveal-on .arona-post-card.arona-revealed,
    .arona-reveal-on .arona-sidebar .arona-side-card.arona-revealed,
    .arona-reveal-on .arona-tag-cloud .arona-cloud-item.arona-revealed,
    .arona-reveal-on .arona-list-heading.arona-revealed,
    .arona-reveal-on .arona-view-box.arona-revealed {
      opacity: 1;
      /* 位移刻意小（16px）：幅度大了在长列表里会显得元素在「跳」。
         时长从 0.7s 收到 slow 档：0.7s 在「首屏 8 张卡片依次进场」时
         最后一张要等 1 秒多才落定，读者会以为页面还在加载。 */
      animation: arona-reveal-up var(--arona-dur-slow) var(--arona-ease-out) var(--arona-reveal-delay, 0ms) backwards;
    }
    @keyframes arona-reveal-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 鼠标跟随高光：指针坐标由 JS 写进 --mx / --my（百分比）。
       默认 50% 50% + opacity 0，所以没鼠标的设备上什么都不显示。 */
    .arona-post-card::after,
    .arona-sidebar .arona-side-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      /* 半径 260px 约等于一张卡片的三分之一宽，跟着指针走时
         边缘刚好淡出，不会在卡片中央留下一个硬邦邦的圆。 */
      background: radial-gradient(
        260px circle at var(--mx, 50%) var(--my, 50%),
        rgba(255, 255, 255, 0.16),
        transparent 70%
      );
      opacity: 0;
      transition: opacity var(--arona-dur-base) var(--arona-ease-out);
      z-index: 1;
    }
    .arona-post-card:hover::after,
    .arona-sidebar .arona-side-card:hover::after { opacity: 1; }
    /* 深色模式下白光糊脸，换成冷蓝高光，和整体色板一致 */
    html.dark .arona-post-card::after,
    html.dark .arona-sidebar .arona-side-card::after {
      background: radial-gradient(
        260px circle at var(--mx, 50%) var(--my, 50%),
        rgba(147, 197, 253, 0.14),
        transparent 70%
      );
    }
    /* 卡片内容要压在高光之上，否则文字会被一层白纱盖住 */
    .arona-post-card > *,
    .arona-sidebar .arona-side-card > * { position: relative; z-index: 2; }

    /* 文章卡片的 hover 过渡统一写在下方 .arona-post-card 的定义处。
       这里原来还有一份 transition: transform/box-shadow/border-color，
       但注释里写的「要写在 transition: all 0.5s 之后才能覆盖」并不成立 ——
       那份 all 0.5s 在文件更后面，同权重下后写的赢，所以这一段一直是死代码，
       hover 实际走的是 all 0.5s（连 background-image 都在逐帧比对）。
       已合并到唯一一处，避免两套规则互相打架。 */

    /* 标签云：hover 抬升 + 轻微放大。原来只有背景色变化，反馈太弱 */
    .arona-tag-cloud .arona-cloud-item {
      transition:
        transform 0.35s cubic-bezier(0.22, 0.68, 0, 1),
        box-shadow 0.35s ease,
        background-color 0.3s ease;
    }
    .arona-tag-cloud .arona-cloud-item:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 4px 14px rgba(var(--blue-shadow-color), 0.35);
    }

    /* 尊重系统「减少动画」设置：位移和高光都撤掉，只留淡入。 */
    @media (prefers-reduced-motion: reduce) {
      .arona-reveal-on .arona-post-card,
      .arona-reveal-on .arona-sidebar .arona-side-card,
      .arona-reveal-on .arona-tag-cloud .arona-cloud-item,
      .arona-reveal-on .arona-list-heading,
      .arona-reveal-on .arona-view-box {
        opacity: 1;
        animation: none;
      }
      .arona-post-card::after,
      .arona-sidebar .arona-side-card::after { display: none; }
      .arona-post-card:hover,
      .arona-tag-cloud .arona-cloud-item:hover { transform: none; }
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
      /* 原来这里有一条 transition: height 0.3s。
         height 是布局属性，而 banner 高 75vh —— 文章页切到 .postViewer
         (50vh) 时会让整页重排 300ms，正好撞上首屏渲染，白白多掉几帧。
         这个类在挂载时一次性加上的，本来也看不到过渡，直接去掉。 */
    }
    .arona-banner.postViewer { height: 50vh; }
    .arona-banner.loadingComplete {
      animation: arona-fade-blur-in var(--arona-dur-slow) var(--arona-ease-out) forwards;
    }
    /* 进场：原来是 filter: blur(≈10px) + scale(1.5) → 清晰 + scale(1)。
       问题在于它作用的是一块 75vh 的全屏 banner，而且正好在首屏渲染那一刻跑：
       blur 无法合成，每一帧都要对整块区域做一次高斯模糊，实测是本站
       最贵的一段动画（同一帧里还要画 banner 背景图、波浪 SVG、欢迎框）。
       现在只保留 scale 的「落定」感：位移全部走 transform，纯合成层，
       不产生任何重绘。视觉上少了「从雾里显影」，但首屏稳得多。 */
    @keyframes arona-fade-blur-in {
      from { transform: scale(1.06); }
      to { transform: scale(1); }
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
      /* 只过渡 opacity。原来还带 filter 0.5s —— --img-brightness 会随
         深浅色切换变化，而 filter 过渡意味着整张全屏背景图每帧重新做一次
         亮度合成，正好和主题揭幕动画抢同一段时间。改为瞬时生效：
         换肤时它本来就藏在揭幕的圆形裁剪里，看不出来。 */
      transition: opacity var(--arona-dur-slow) var(--arona-ease-inout);
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
      /* text-shadow 的过渡同样是逐帧重绘（欢迎框是大字号，模糊半径大），
         换肤时颜色本来就在圆形揭幕里被盖住，没必要做过渡。 */
      transition:
        transform var(--arona-dur-base) var(--arona-ease-out),
        color var(--arona-dur-slow) var(--arona-ease-inout);
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
      /* 只过渡 transform：整圈旋转本身已经是「够重」的反馈，
         再叠 box-shadow + filter 的逐帧插值只会拖慢它。
         filter（--img-brightness）是深浅色用的，换肤时在揭幕里，不必过渡。 */
      transition: transform var(--arona-dur-slow) var(--arona-ease-out);
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
      background-color: var(--font-color-grey);
      /* 原来在关键帧里改 background-color —— 那是一条永不停止的无限动画，
         每 0.8s 都要重绘一次。改成改 opacity：合成属性，不产生重绘。 */
      animation: arona-pointer-blink 0.8s linear infinite;
    }
    @keyframes arona-pointer-blink {
      0%, 40% { opacity: 1; }
      60%, 100% { opacity: 0; }
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
      /* 原来是 transition: all 0.5s —— 图标上会变的只有颜色和那层辉光。
         这里的 drop-shadow 只作用在 32px 的小图标上，代价可忽略，
         所以保留原设计（辉光），只是把 all 收窄成明确的两个属性。 */
      transition:
        color var(--arona-dur-fast) var(--arona-ease-inout),
        filter var(--arona-dur-base) var(--arona-ease-out);
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
      transition: color var(--arona-dur-slow) var(--arona-ease-inout);
      padding: 0 20px;
      text-align: center;
    }
    .arona-post-banner .title {
      font-size: max(64px, 4.5vw);
      margin: 0 0 50px;
      color: var(--post-InnerBanner-color);
      transition: color var(--arona-dur-slow) var(--arona-ease-inout);
      word-break: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
    .arona-post-banner .status {
      font-size: max(20px, 1vw);
      font-weight: bold;
      color: var(--post-InnerBanner-color);
      transition: color var(--arona-dur-slow) var(--arona-ease-inout);
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
      /* hover 只动 transform 与 border-left-color，两者都不触发重排；
         阴影的加深交给下面 ::before 的 opacity 过渡 ——
         box-shadow 是纯绘制属性，逐帧插值会让整张卡（含背景装饰图）
         每帧重绘一次，长列表里 hover 扫过去会明显掉帧。 */
      transition:
        transform var(--arona-dur-slow) var(--arona-ease-out),
        border-left-color var(--arona-dur-slow) var(--arona-ease-inout);
    }
    /* 阴影层：一块和卡片等大的透明伪元素，常驻一层较重的阴影，
       hover 时只改它的 opacity（合成属性，零重绘）。
       left 取 -16px 是为了抵消卡片 16px 的左边框 ——
       绝对定位的参照是 padding box，不减的话阴影会整体右移 16px。 */
    .arona-post-card::before {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: -16px;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: 0 8px 26px rgba(var(--blue-shadow-color), 0.5);
      opacity: 0;
      transition: opacity var(--arona-dur-slow) var(--arona-ease-out);
      z-index: 0;
    }
    .arona-post-card:hover::before { opacity: 1; }
    .arona-post-card:hover {
      /* 浮升 4px 而不是 2px：竖条同时点亮，2px 在视觉上几乎看不出来 */
      transform: translateY(-4px);
      border-left-color: var(--color-blue);
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
      transition: transform var(--arona-dur-base) var(--arona-ease-out);
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
      transition: background-color var(--arona-dur-slow) var(--arona-ease-inout);
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
      /* text-shadow 是绘制属性，28px 标题上做 0.5s 过渡 = 每帧重新模糊一遍
         文字轮廓。保留这个辉光效果，但把时长收到 fast 档：
         0.5s 拖得越久，重绘的帧数越多，看起来也越「黏」。 */
      transition:
        text-shadow var(--arona-dur-fast) var(--arona-ease-out),
        color var(--arona-dur-base) var(--arona-ease-inout);
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
      transition:
        background-color var(--arona-dur-fast) var(--arona-ease-inout),
        color var(--arona-dur-fast) var(--arona-ease-inout);
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
    .arona-page-btn { padding: 8px 16px; border-radius: 8px; background: var(--btn-background); color: #fff; text-decoration: none; font-size: 14px; transition: background-color var(--arona-dur-fast) var(--arona-ease-inout), color var(--arona-dur-fast) var(--arona-ease-inout); }
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
      /* 原来是 transition: all 0.5s，而隐藏态改的是 bottom/right ——
         fixed 元素上动 bottom/right 是布局动画，每次滚动跨过阈值都要
         重算一次定位并整层重绘。改成 transform + opacity，纯合成。 */
      transition:
        opacity var(--arona-dur-base) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-out);
      opacity: 1;
      transform: translate(0, 0) scale(1);
      cursor: pointer;
      border: none;
      background: transparent;
      padding: 0;
    }
    .arona-totop img { width: 85px; height: auto; pointer-events: none; display: block; }
    /* 藏到右下角视野外：位移量按视口算，任何尺寸下都能完全移出 */
    .arona-totop.hidden {
      opacity: 0;
      transform: translate(30vw, 30vh) scale(0.5);
      pointer-events: none;
    }
    @media (max-width: 768px) { .arona-totop { right: 5%; } .arona-totop img { width: 8vh; } }

    /* 进度环：套在图标外面的一圈描边圆环。
       stroke-dashoffset 由 BackToTop.js 按滚动进度改，
       这里只负责「画成什么样」。rotate(-90deg) 让进度从顶点起算，
       否则 SVG 圆是从 3 点钟方向开始的，看着像随机从侧面冒出来。 */
    .arona-totop-ring { position: relative; display: block; line-height: 0; }
    .arona-totop-ring svg {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      transform: rotate(-90deg);
      overflow: visible;
    }
    .arona-totop-ring circle {
      fill: none;
      stroke-linecap: round;
      /* 线宽按 viewBox 100 的比例给，图标缩放时环跟着一起缩 */
      stroke-width: 6;
    }
    .arona-totop-ring .ring-track { stroke: rgba(var(--blue-shadow-color), 0.22); }
    .arona-totop-ring .ring-bar {
      stroke: var(--color-blue);
      /* 进度环本身也要有过渡，否则快速滚动时它一格格跳。
         0.15s 已经够短，改 token 会把「跟手」变成「拖手」，保持线性短过渡。 */
      transition: stroke-dashoffset 0.15s linear;
      filter: drop-shadow(0 0 4px rgba(var(--blue-shadow-color), 0.7));
    }
    html.dark .arona-totop-ring .ring-bar { stroke: #9ec5fd; }
    /* hover 时图标轻微放大，配合 ring 一起给反馈 */
    .arona-totop:hover .arona-totop-ring { transform: scale(1.06); }
    .arona-totop-ring { transition: transform var(--arona-dur-base) var(--arona-ease-out); }

    /* ==================================================================
       Splash 开屏 (Splash.astro)
       ================================================================== */
    html.arona-splash-loading { overflow: hidden !important; }
    html.arona-splash-loading body { overflow: hidden !important; height: 100vh !important; }
    .arona-splash {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      /* 默认不显示：SSR 已经把真实内容画出来了，开屏若在 HTML 里就可见，
         会把内容盖到 JS 下载完为止（慢网实测 5~7 秒）。由 Splash.js 在
         「页面本来没有 SSR 内容」时再挂 .arona-splash-on 打开。 */
      display: none;
      justify-content: center;
      align-items: center;
      background: linear-gradient(#b9e6f6, #ece5f4);
      z-index: 9999;
      transition: opacity 500ms ease-in-out;
    }
    .arona-splash.arona-splash-on { display: flex; }
    .arona-splash svg { width: min(60vw, 900px); height: auto; }
    .arona-splash .triangle-group path { fill: white; fill-opacity: 0.15; }
    .arona-splash .circle-path { fill: #e0f0fa; fill-opacity: 0.9; }
    .arona-splash .led-path { fill: white; filter: url(#arona-splash-glow); }
    .arona-splash .glow-color { flood-color: white; }
    /* 呼吸：原来由 Splash.js 用 requestAnimationFrame 每帧把 <g> 的
       style.opacity 加减 0.01 来驱动 —— 等于让主线程常驻 60fps 循环，
       而这段时间恰好是首屏最忙的时候（还要解析 CSS、水合 React）。
       换成 CSS 动画后由样式/合成线程接管，主线程彻底空出来。
       用 alternate 而不是手写方向判断，也省掉了 JS 里的边界回弹逻辑。 */
    .arona-splash .breath-group {
      animation: arona-splash-breathe 1.6s var(--arona-ease-inout) infinite alternate;
    }
    @keyframes arona-splash-breathe {
      from { opacity: 0.3; }
      to { opacity: 1; }
    }
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
      /* 原来还带 bottom 0.3s —— 同样是布局动画，而 bottom 只在断点切换时
         由媒体查询改一次，过渡毫无意义。 */
      transition: opacity var(--arona-dur-base) var(--arona-ease-inout);
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
      transition:
        opacity var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-spring);
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
      animation: arona-pop-up var(--arona-dur-base) var(--arona-ease-out) forwards;
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
      transition:
        color var(--arona-dur-fast) var(--arona-ease-inout),
        transform var(--arona-dur-base) var(--arona-ease-spring);
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
      /* 收窄 all：这里会变的只有位移、阴影、左边框色 */
      transition:
        transform var(--arona-dur-base) var(--arona-ease-out),
        box-shadow var(--arona-dur-base) var(--arona-ease-out),
        border-left-color var(--arona-dur-base) var(--arona-ease-inout);
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
      /* border 简写会把 border-width/style 也纳入插值，这里只换颜色；
         box-shadow 换肤时不变，去掉。 */
      transition:
        background-color var(--arona-dur-slow) var(--arona-ease-inout),
        border-color var(--arona-dur-slow) var(--arona-ease-inout);
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
      transition:
        color var(--arona-dur-fast) var(--arona-ease-inout),
        background-color var(--arona-dur-fast) var(--arona-ease-inout);
    }
    .arona-toc-level-3 .arona-toc-link { font-size: 12px; }
    .arona-toc-sub-list {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      /* max-height 是布局属性，DOM 结构决定了没法换成 transform
         （会把文字拉扁），但可以把 margin 从过渡里摘掉 ——
         4px 的间距跳变肉眼看不出来，却省掉每帧一次重排。
         时长收到 fast 档：max-height 给的是 500px 上限，实际内容往往
         只有 60~80px，过渡在前 15% 就跑完了，拖长只会显得「点了没反应」。 */
      transition:
        max-height var(--arona-dur-fast) var(--arona-ease-inout),
        opacity var(--arona-dur-fast) var(--arona-ease-inout);
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
      /* background 是简写，会把 background-image 一起纳入过渡比对；
         这张大卡片只需要底色变化。box-shadow 换肤时不变，也去掉。 */
      transition: background-color var(--arona-dur-slow) var(--arona-ease-inout);
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
      transition:
        transform var(--arona-dur-base) var(--arona-ease-out),
        box-shadow var(--arona-dur-base) var(--arona-ease-out);
    }
    .arona-post-nav a:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(var(--blue-shadow-color), 0.5); }
    .arona-post-nav a.next { align-items: flex-end; text-align: right; margin-left: auto; }
    .arona-post-nav .nav-label { font-size: 14px; color: var(--color-blue); font-weight: 500; margin-bottom: 4px; }
    .arona-post-nav .nav-title { font-size: 16px; color: var(--font-color-grey); font-weight: bold; }

    /* ==================================================================
       侧边栏（NotionNext 自带，做 Arona 化）
       ================================================================== */
    .arona-sidebar .arona-side-card {
      /* relative 是给 ::after 鼠标高光当定位上下文用的 */
      position: relative;
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
      transition: background-color var(--arona-dur-fast) var(--arona-ease-inout);
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
      transition: background-color var(--arona-dur-fast) var(--arona-ease-inout), color var(--arona-dur-fast) var(--arona-ease-inout);
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
      transition: background-color var(--arona-dur-fast) var(--arona-ease-inout), color var(--arona-dur-fast) var(--arona-ease-inout);
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
      transition: background-color var(--arona-dur-fast) var(--arona-ease-inout), transform var(--arona-dur-base) var(--arona-ease-out);
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
      opacity: 0; transition: opacity var(--arona-dur-base) var(--arona-ease-inout);
    }
    .arona-reading-progress.visible { opacity: 1; }
    .arona-reading-progress .fill {
      height: 100%;
      /* 宽度恒为 100%，进度靠 scaleX 表达（见 ReadingProgress.js）。
         原来改 width，滚动时每帧一次布局；现在是合成变换。 */
      width: 100%;
      transform: scaleX(0);
      transform-origin: 0 50%;
      background: var(--color-blue, #328cfa);
      /* 短过渡只为把两帧之间的跳变抹平，不能太长否则跟不上手指 */
      transition: transform 0.1s linear;
      will-change: transform;
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
      transition:
        transform var(--arona-dur-base) var(--arona-ease-out),
        color var(--arona-dur-fast) var(--arona-ease-inout),
        background-color var(--arona-dur-fast) var(--arona-ease-inout);
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
      /* nav 是 flex 且整体居中：logo / menu / 动作区三者总宽超过视口时，
         .menu 虽有 overflow-x:auto 仍会被 flex 挤出容器（实测 360px 下
         菜单末项右缘 365 > 360）。min-width:0 让它能缩到可用宽度，
         内部再由自己的 overflow-x:auto 滚动；logo 与动作区定宽不缩，
         保证居中组永远不会单向溢出。 */
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

    /* 减少动态效果
       ------------------------------------------------------------------
       全局兜底：把动画/过渡压到「一帧内结束」。这比逐条写
       @media (prefers-reduced-motion) 覆盖更可靠 —— 以后新增的动效
       自动被覆盖，不会漏。
       另外两处必须显式处理：
         · ::view-transition-* 是浏览器顶层的过渡伪元素，不在 * 的范围内，
           不写这条的话主题切换的圆形揭幕仍会照常播；
         · 平滑滚动同样属于「动态效果」，一并关掉。 */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        transition-delay: 0ms !important;
        scroll-behavior: auto !important;
      }
      ::view-transition-group(*),
      ::view-transition-old(*),
      ::view-transition-new(*) {
        animation: none !important;
      }
    }

    ${themeConsoleStyle('arona', CONFIG)}
  `}</style>
}

export { Style }
