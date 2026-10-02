/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
/**
 * AronaNote 风格主题样式
 * 参考 astro-theme-AronaNote 的 vars.less / components 样式
 * 不支持 tailwind 的 @apply 语法，使用原生 CSS。
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    /* ============ 颜色变量（浅色） ============ */
    :root {
      --arona-transition-time: 0.3s;
      --arona-general-bg: #eaeff5;          /* 最底色 */
      --arona-foreground: #ffffff;          /* 卡片/通用背景 */
      --arona-blue: #128afa;                /* 强调蓝 */
      --arona-gold: #ffe401;                /* 金色 */
      --arona-grey: #4c5866;               /* 文字灰 */
      --arona-icon: #466398;
      --arona-blur: blur(15px);
      --arona-blue-shadow: 40, 135, 200;    /* 通用阴影 rgb 分量 */
      --arona-pot-border: #c7e4f6;          /* 帖子列表左侧边框 */
      --arona-img-brightness: brightness(100%);
      --arona-bg-image: url(/arona/background.svg);
      --arona-triangle: repeating-linear-gradient(60deg, rgba(190,242,255,0.3), transparent 35px),
                        repeating-linear-gradient(180deg, transparent, rgba(108,230,255,0.3) 30px),
                        repeating-linear-gradient(120deg, rgba(16,179,215,0.3), transparent 46px);
      --arona-card-shadow: 0 0 8px rgba(var(--arona-blue-shadow), 0.8);
      --arona-glow: 0 0 8px rgba(var(--arona-blue-shadow), 0.8);
    }

    /* ============ 颜色变量（深色） ============ */
    html.dark,
    html[data-theme="dark"],
    html[theme="dark"] {
      --arona-general-bg: #0f0f16;
      --arona-foreground: #1f1f2c;
      --arona-blue: #705781;
      --arona-gold: #cfc6ff;
      --arona-grey: #c8c8dc;
      --arona-icon: #9d7cd8;
      --arona-blur: blur(8px);
      --arona-blue-shadow: 147, 113, 207;
      --arona-pot-border: rgba(135, 112, 210, 0.687);
      --arona-img-brightness: brightness(80%);
      --arona-bg-image: url(/arona/background_dark.svg);
      --arona-triangle: repeating-linear-gradient(60deg, rgba(158,124,216,0.15), transparent 35px),
                        repeating-linear-gradient(180deg, transparent, rgba(157,124,216,0.08) 30px),
                        repeating-linear-gradient(120deg, rgba(157,124,216,0.08), transparent 46px);
      --arona-card-shadow: 0 0 8px rgba(var(--arona-blue-shadow), 0.8);
      --arona-glow: 0 0 8px rgba(var(--arona-blue-shadow), 0.8);
    }

    /* ============ 全局底色 + 三角纹理 ============ */
    body {
      background-color: var(--arona-general-bg);
      background-image: var(--arona-bg-image);
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      color: var(--arona-grey);
      transition: background-color var(--arona-transition-time);
    }
    html.dark body,
    html[data-theme="dark"] body,
    html[theme="dark"] body {
      background-color: var(--arona-general-bg);
    }

    /* ============ 阅读进度条 ============ */
    .arona-reading-progress {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 3px;
      background: transparent;
      z-index: 200;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .arona-reading-progress.visible { opacity: 1; }
    .arona-reading-progress-fill {
      height: 100%;
      background: var(--arona-blue, #328cfa);
      width: 0%;
      transition: width 0.1s ease-out;
    }

    /* ============ 玻璃拟态导航（Header） ============ */
    .arona-header {
      position: sticky;
      top: 0;
      z-index: 150;
    }
    .arona-header nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 0 0 32px 32px;
      border-bottom: solid 2px var(--arona-foreground);
      border-left: solid 2px var(--arona-foreground);
      border-right: solid 2px var(--arona-foreground);
      background:
        linear-gradient(0.25turn, transparent, var(--arona-foreground) 25%),
        var(--arona-triangle);
      -webkit-backdrop-filter: var(--arona-blur);
      backdrop-filter: var(--arona-blur);
      box-shadow: var(--arona-glow);
    }
    .arona-header .logo {
      display: flex; align-items: center; height: 100%; cursor: pointer;
    }
    .arona-header .logo img { height: 32px; width: auto; min-width: 32px; filter: drop-shadow(0 0 8px #328cfa); }
    .arona-header .logo-text {
      font-size: 22px; font-weight: 800; color: var(--arona-grey);
      letter-spacing: 1px; text-decoration: none; padding-left: 8px;
      text-shadow: 0 0 6px rgba(var(--arona-blue-shadow), 0.4);
    }
    .arona-header .menu {
      display: flex; align-items: center; gap: clamp(16px, 4vw, 48px);
      margin: 0 24px; padding: 0; list-style: none;
      overflow-x: auto; scrollbar-width: none;
    }
    .arona-header .menu::-webkit-scrollbar { display: none; }
    .arona-header .menu a {
      display: block; padding: 10px 16px; border-radius: 8px;
      font-size: 18px; font-weight: 700; color: var(--arona-grey);
      text-decoration: none; white-space: nowrap;
      transition: all 0.5s, transform 0.8s cubic-bezier(0.25,1,0.5,1);
    }
    .arona-header .menu a:hover {
      color: var(--arona-gold);
      background-color: var(--arona-blue);
      transform: translateY(-2px);
    }
    .arona-header .menu a.active { color: var(--arona-gold); background-color: var(--arona-blue); }
    .arona-header .header-tools { display: flex; align-items: center; gap: 10px; }
    .arona-header .header-tools .arona-tool-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 10px; cursor: pointer;
      color: var(--arona-grey); font-size: 18px; text-decoration: none;
      background: transparent; border: none; transition: all 0.3s;
    }
    .arona-header .header-tools .arona-tool-btn:hover { background: var(--arona-blue); color: var(--arona-gold); }

    /* ============ Banner 横幅 ============ */
    .arona-banner {
      position: relative;
      display: flex; align-items: center; justify-content: center;
      width: 100%;
      min-height: 75vh;
      overflow: hidden;
      -webkit-user-drag: none;
      mask: linear-gradient(to top, transparent, var(--arona-general-bg) 6%);
      -webkit-mask: linear-gradient(to top, transparent, var(--arona-general-bg) 6%);
    }
    .arona-banner.postViewer { min-height: 50vh; }
    .arona-banner .bg-layer {
      position: absolute; inset: 0;
      background-size: cover; background-position: center; background-repeat: no-repeat;
      filter: var(--arona-img-brightness);
    }
    .arona-banner.loadingComplete {
      animation: arona-fade-blur-in 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
    }
    @keyframes arona-fade-blur-in {
      from { filter: var(--arona-blur); transform: scale(1.5); }
      to   { filter: none; transform: scale(1); }
    }
    .arona-banner .banner-content {
      position: relative; z-index: 80;
      text-align: center; padding: 0 16px;
    }
    .arona-banner .banner-title {
      font-size: clamp(36px, 6vw, 72px); font-weight: 900; color: var(--arona-grey);
      text-shadow: 0 2px 18px rgba(var(--arona-blue-shadow), 0.45);
      margin: 0;
    }
    .arona-banner .banner-desc {
      margin-top: 14px; font-size: clamp(14px, 2vw, 20px); color: var(--arona-grey);
      opacity: 0.85;
    }
    .arona-banner .wave-canvas { position: absolute; bottom: 0; left: 0; width: 100%; z-index: 50; pointer-events: none; }

    /* ============ 正文容器 ============ */
    .arona-container {
      position: relative; z-index: 10;
      display: flex; justify-content: center;
      gap: 24px; padding: 40px 16px 0;
      max-width: 1180px; margin: 0 auto;
    }
    .arona-main { width: 100%; min-width: 0; }
    .arona-sidebar { width: 288px; flex-shrink: 0; }
    @media (max-width: 1024px) {
      .arona-container { flex-direction: column; }
      .arona-sidebar { width: 100%; }
    }

    /* ============ 文章卡片（AronaNote 风格） ============ */
    .arona-card {
      position: relative;
      background-color: var(--arona-foreground);
      border-radius: 32px;
      border-left: solid 16px var(--arona-pot-border);
      box-shadow: var(--arona-card-shadow);
      transition: all 0.5s;
      overflow: hidden;
    }
    .arona-card:hover {
      box-shadow: 0 0 15px rgba(var(--arona-blue-shadow), 0.8);
      transform: translateY(-2px);
    }
    .arona-card .card-inner { display: flex; gap: 24px; padding: 32px 40px; align-items: stretch; }
    .arona-card .card-cover {
      flex: 0 0 200px; height: 150px; border-radius: 12px; overflow: hidden; align-self: center;
    }
    .arona-card .card-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .arona-card:hover .card-cover img { transform: scale(1.05); }
    .arona-card .card-body { flex: 1; min-width: 0; }
    .arona-card .card-title {
      font-size: 28px; font-weight: 800; margin: 0 0 8px; line-height: 1.2;
      display: flex; align-items: center; gap: 4px;
    }
    .arona-card .card-title a { color: var(--arona-grey); text-decoration: none; transition: text-shadow 0.5s, color 0.5s; }
    .arona-card .card-title a:hover { text-shadow: 0 0 3px var(--arona-grey); }
    .arona-card .card-meta {
      display: flex; align-items: center; gap: 6px; margin-bottom: 7px;
      opacity: 0.75; font-size: 15px; color: var(--arona-grey);
    }
    .arona-card .card-meta .sep { width: 4px; height: 4px; border-radius: 50%; background: var(--arona-grey); margin: 0 12px; }
    .arona-card .card-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0; padding: 0; list-style: none; }
    .arona-card .card-tags a {
      display: inline-flex; align-items: center; gap: 4px; color: var(--arona-gold);
      background-color: var(--arona-blue); border-radius: 5px; padding: 3px 8px;
      font-size: 14px; text-decoration: none; transition: all 0.5s;
    }
    .arona-card .card-tags a:hover { background-color: var(--arona-grey); color: var(--arona-gold); }
    .arona-card .card-excerpt { color: var(--arona-grey); opacity: 0.8; line-height: 1.6; }
    @media (max-width: 768px) {
      .arona-card .card-inner { flex-direction: column; gap: 16px; padding: 24px 20px; }
      .arona-card .card-cover { flex: none; width: 100%; height: 200px; }
      .arona-card .card-title { font-size: 24px; }
    }

    /* ============ 玻璃拟态页脚 ============ */
    .arona-footer {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; z-index: 100; margin: 50px auto 0; padding: 0 16px;
      box-sizing: border-box; height: 72px;
      border-radius: 32px 32px 0 0;
      border-top: solid 2px var(--arona-foreground);
      border-left: solid 2px var(--arona-foreground);
      border-right: solid 2px var(--arona-foreground);
      background:
        linear-gradient(0.75turn, transparent, var(--arona-foreground) 25%),
        var(--arona-triangle);
      -webkit-backdrop-filter: var(--arona-blur);
      backdrop-filter: var(--arona-blur);
      box-shadow: var(--arona-glow);
    }
    .arona-footer .footer-info { line-height: 1.5; font-size: 14px; color: var(--arona-grey); }
    .arona-footer .footer-info a { color: var(--arona-blue); text-decoration: none; }
    .arona-footer .footer-logo { height: 75%; display: flex; align-items: center; }
    .arona-footer .footer-logo img { height: 100%; width: auto; filter: drop-shadow(0 0 8px #328cfa); }
    @media (max-width: 768px) { .arona-footer { font-size: 12px; } }

    /* ============ 侧边栏卡片 ============ */
    .arona-sidebar .side-card {
      background-color: var(--arona-foreground);
      border-radius: 24px;
      box-shadow: var(--arona-card-shadow);
      margin-bottom: 20px; overflow: hidden;
    }
    .arona-sidebar .side-card h3 {
      font-size: 14px; font-weight: 700; color: var(--arona-grey);
      padding: 12px 16px; margin: 0;
      border-bottom: 1px solid rgba(var(--arona-blue-shadow), 0.15);
    }
    .arona-sidebar .side-card .side-body { padding: 12px 16px; font-size: 14px; color: var(--arona-grey); }
    .arona-sidebar .side-card a { color: var(--arona-grey); text-decoration: none; }
    .arona-sidebar .side-card a:hover { color: var(--arona-blue); text-decoration: underline; }

    /* ============ 开屏加载动画 ============ */
    .arona-splash {
      position: fixed; inset: 0;
      display: flex; justify-content: center; align-items: center;
      background: linear-gradient(#b9e6f6, #ece5f4);
      z-index: 9999; transition: opacity 500ms ease-in-out;
    }
    html.dark .arona-splash, html[data-theme="dark"] .arona-splash, html[theme="dark"] .arona-splash {
      background: linear-gradient(#c3bde9, #fee4ff);
    }
    .arona-splash svg { width: 240px; height: auto; }
    .arona-splash .tri { fill: #ffffff; fill-opacity: 0.15; }
    .arona-splash .circle { fill: #e0f0fa; fill-opacity: 0.9; }
    .arona-splash .led { fill: #ffffff; }
    .arona-splash .splash-breath { animation: arona-breath 2.4s ease-in-out infinite; }
    @keyframes arona-breath { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

    /* ============ 点击烟花 ============ */
    .arona-click-canvas {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;
      pointer-events: none; z-index: 9998;
    }
    @media (hover: none) { .arona-click-canvas { display: none !important; } }

    /* ============ Spine 看板娘 ============ */
    .arona-spine-wrap { position: fixed; bottom: 25px; left: 3%; z-index: 120; height: 45vh; min-height: 300px; width: auto; filter: drop-shadow(0 0 3px rgba(40,42,44,0.42)); cursor: pointer; transition: opacity 0.3s ease, bottom 0.3s ease; }
    .arona-spine-wrap canvas { width: 100% !important; height: 100% !important; display: block; }
    .arona-spine-wrap:hover { opacity: 1; }
    @media (max-width: 1440px) { .arona-spine-wrap { opacity: 0.7; } }
    @media (max-width: 768px) { .arona-spine-wrap { display: none; } }
    .arona-spine-dialog {
      position: fixed; z-index: 121; pointer-events: none;
      background-color: rgba(255,255,255,0.92); color: #000;
      border-radius: 25px; padding: 12px 24px; line-height: 1.4;
      font-size: 18px; white-space: pre-wrap; word-wrap: break-word;
      filter: drop-shadow(0 0 3px rgba(36,36,36,0.6));
    }

    /* ============ 回到顶部 ============ */
    .arona-totop {
      position: fixed; right: 18px; bottom: 18px; z-index: 130;
      width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
      border-radius: 50%; background: var(--arona-foreground);
      box-shadow: var(--arona-card-shadow); cursor: pointer; color: var(--arona-blue);
      font-size: 22px; transition: transform 0.3s;
    }
    .arona-totop:hover { transform: translateY(-3px); }

    /* 目录高亮 */
    .arona-sidebar .side-card .catalog-active a { color: var(--arona-blue); font-weight: 700; }

    /* 开屏期间锁定滚动 */
    html.splash-loading,
    html.splash-loading body { overflow: hidden !important; height: 100vh !important; }

    /* 保持 NotionNext 自带 console 样式 */
    ${themeConsoleStyle('arona', CONFIG)}
  `}</style>
}

export { Style }
