/**
 * AronaNote 风格主题配置
 * 参考 astro-theme-AronaNote 的 vars.less / config.yml
 * 颜色主要由 style.js 中的 CSS 变量控制，这里的配置更多用于功能开关与资源路径。
 * 所有项都可以通过 blog.config.js 中的同名键覆盖（blog.config > 本文件）。
 */
const CONFIG = {
  // ===== 色板（JS 侧引用 / 占位，真实颜色见 style.js CSS 变量）=====
  ARONA_COLOR_BLUE: '#128afa',
  ARONA_COLOR_GOLD: '#ffe401',
  ARONA_COLOR_GREY: '#4c5866',

  // ===== Banner 横幅 =====
  // 浅色 / 深色 横幅背景图；留空字符串 '' 则回退到站点 pageCover
  ARONA_BANNER_LIGHT: process.env.NEXT_PUBLIC_ARONA_BANNER_LIGHT || '/arona/banner.webp',
  ARONA_BANNER_DARK: process.env.NEXT_PUBLIC_ARONA_BANNER_DARK || '/arona/banner_dark.webp',
  ARONA_BANNER_HEIGHT: 75, // vh，桌面端横幅高度
  ARONA_BANNER_TITLE: true, // 横幅中央是否显示站点标题 + 简介
  ARONA_BANNER_WAVE: true, // 横幅底部 Siri 风格波浪

  // ===== 顶部导航 =====
  ARONA_MENU_CATEGORY: true,
  ARONA_MENU_TAG: true,
  ARONA_MENU_ARCHIVE: true,
  ARONA_MENU_SEARCH: true,

  // ===== 文章列表 =====
  ARONA_POST_LIST_COVER: true, // 列表显示封面
  ARONA_POST_LIST_STYLE: 'scroll', // 'scroll' 无限滚动 | 'page' 分页

  // ===== 功能开关 =====
  ARONA_READING_PROGRESS: true, // 阅读进度条（固定在顶部）
  ARONA_SPLASH: true, // 开屏加载动画
  ARONA_FIREWORKS: true, // 点击烟花特效
  ARONA_CLICK_FIREWORKS: true, // 同上别名，兼容

  // ===== Spine 看板娘（需要 /arona/spine_assets 资源）=====
  // light 模式使用 arona 角色(实为 aris 资源)，dark 模式使用 plana 角色(实为 kei 资源)
  // 与 AronaNote 官方配置保持一致
  ARONA_SPINE_ENABLE: true,
  ARONA_SPINE_BASE: process.env.NEXT_PUBLIC_ARONA_SPINE_BASE || '/arona/spine_assets',
  ARONA_SPINE_VOICE_LANG: process.env.NEXT_PUBLIC_ARONA_SPINE_VOICE_LANG || 'zh',
  // 浅色 / 深色 角色 key（对应下方 CHARACTERS 的键）
  ARONA_SPINE_LIGHT_CHAR: 'arona',
  ARONA_SPINE_DARK_CHAR: 'plana',

  // 角色资源清单（skel / atlas / 骨骼 / 语音）
  ARONA_SPINE_CHARACTERS: {
    arona: {
      skelUrl: '/arona/spine_assets/aris/aris_noweapon_spr.skel',
      atlasUrl: '/arona/spine_assets/aris/aris_noweapon_spr.atlas',
      idleAnimationName: 'Idle_01',
      eyeCloseAnimationName: 'Eye_Close_01',
      rightEyeBone: 'R_Eye_01',
      leftEyeBone: 'L_Eye_01',
      frontHeadBone: 'Head_01',
      backHeadBone: 'Head_Back',
      eyeRotationAngle: 76.307,
      voiceConfig: [
        { audio: '/arona/spine_assets/aris/audio/aris_01.ogg', animation: '10', text: '唔——肚子饿了。\n咦……？ \n爱丽丝不吃电池的！' },
        { audio: '/arona/spine_assets/aris/audio/aris_02.ogg', animation: '00', text: '勇者啊，愿光与你同在。' },
        { audio: '/arona/spine_assets/aris/audio/aris_03.ogg', animation: '07', text: '爱丽丝也想要提升老师的好感度。' },
        { audio: '/arona/spine_assets/aris/audio/aris_04.ogg', animation: '05', text: '以这不可动摇的意志……光啊！' },
        { audio: '/arona/spine_assets/aris/audio/aris_05.ogg', animation: '04', text: '老师？怎么了？' }
      ],
      copyConfig: { audio: '/arona/spine_assets/aris/audio/aris_copy.mp3', animation: '07', text: '邦邦咔邦！复制了有用的知识呢！' }
    },
    plana: {
      skelUrl: '/arona/spine_assets/kei/CH0335_noweapon_spr.skel',
      atlasUrl: '/arona/spine_assets/kei/CH0335_noweapon_spr.atlas',
      idleAnimationName: 'Idle_01',
      eyeCloseAnimationName: 'Eye_Close_01',
      rightEyeBone: 'R_Eye_01',
      leftEyeBone: 'L_Eye_01',
      frontHeadBone: 'Head_Rot',
      backHeadBone: 'Head_Back',
      eyeRotationAngle: 97.331,
      voiceConfig: [
        { audio: '/arona/spine_assets/kei/audio/kei_01.ogg', animation: '17', text: '请别说我可爱啦！' },
        { audio: '/arona/spine_assets/kei/audio/kei_02.ogg', animation: '29', text: '……我还没幼稚到那种地步。' },
        { audio: '/arona/spine_assets/kei/audio/kei_03.ogg', animation: '03', text: '什么事？如果没事的话请不要叫我。' },
        { audio: '/arona/spine_assets/kei/audio/kei_04.ogg', animation: '99', text: '工作要适度，不过偷懒也得适可而止。' },
        { audio: '/arona/spine_assets/kei/audio/kei_05.ogg', animation: '25', text: '刚才笑了吧！？\n绝对是笑了对吧！？\n我可全都看到了！' }
      ],
      copyConfig: { audio: '/arona/spine_assets/kei/audio/kei_copy.ogg', animation: '07', text: '我能帮上忙吗？' }
    }
  }
}

export default CONFIG
