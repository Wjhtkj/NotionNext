/**
 * Endless647 主题配置
 * 参考 astro-theme-AronaNote 的 config.yml / consts.ts
 * 所有项均可在 blog.config.js 中以同名键覆盖（优先级：Notion 配置表 > 环境变量 > blog.config.js > 本文件）。
 */
const CONFIG = {
  // ===== 色板（JS 引用占位，真实颜色见 style.js CSS 变量）=====
  ARONA_COLOR_BLUE: '#128afa',
  ARONA_COLOR_GOLD: '#ffe401',
  ARONA_COLOR_GREY: '#4c5866',

  // ===== Banner 横幅 =====
  ARONA_BANNER_LIGHT: process.env.NEXT_PUBLIC_ARONA_BANNER_LIGHT || '/arona/banner.webp',
  ARONA_BANNER_DARK: process.env.NEXT_PUBLIC_ARONA_BANNER_DARK || '/arona/banner_dark.webp',
  ARONA_BANNER_HEIGHT: 75, // vh
  ARONA_BANNER_WAVE: true, // 底部 Siri 风格波浪
  ARONA_BANNER_INTRO: true, // 进场淡入模糊动画

  // ===== 导航 =====
  ARONA_MENU_SEARCH: true,
  ARONA_MENU_ARCHIVE: true,
  ARONA_MENU_CATEGORY: true,
  ARONA_MENU_TAG: true,

  // ===== 欢迎框（首页 Banner 中央的玻璃卡片）=====
  ARONA_WELCOME_ENABLE: true,
  // 一言 / 座右铭（打字机效果，随机取一条）
  ARONA_HITOKOTO_ENABLE: true,
  ARONA_HITOKOTO_LIST: [
    '生活不止眼前的苟且，还有诗和远方。',
    'Stay hungry, stay foolish.',
    'Talk is cheap. Show me the code.',
    'The journey of a thousand miles begins with one step.'
  ],
  // 社交链接（FontAwesome 图标类名；留空数组则使用默认）
  ARONA_SOCIAL: [
    { icon: 'fab fa-github', url: 'https://github.com/wjhtkj' },
    { icon: 'fab fa-bilibili', url: 'https://space.bilibili.com/1130303811' }
  ],

  // ===== 侧栏个人信息卡（排布参考 heo 主题的 InfoCard）=====
  // 问候语，点击可随机切换到下一条
  ARONA_INFO_CARD_GREETINGS: [
    'Hi，欢迎来到我的小站',
    '这里记录折腾与分享',
    '随便逛逛吧',
    '欢迎来到我的博客'
  ],
  // 「了解更多」按钮（不配置 url 则不显示）
  ARONA_INFO_CARD_MORE: {
    url: 'https://github.com/wjhtkj',
    text: '了解更多'
  },

  // ===== 侧栏「加入QQ群」卡片（enable:false 可关闭）=====
  ARONA_QQ_CARD: {
    enable: true,
    title: '加入QQ群',
    text: '一起交流折腾与分享，欢迎随时来聊。',
    button: '一键加入',
    icon: 'fab fa-qq',
    url: 'https://qm.qq.com/q/d57URs0h8I'
  },

  // ===== 文章列表 =====
  ARONA_POST_LIST_COVER: true,
  ARONA_POST_LIST_STYLE: 'scroll', // 'scroll' 无限滚动 | 'page' 分页

  // ===== 功能开关 =====
  ARONA_READING_PROGRESS: true,
  ARONA_SPLASH: true,
  ARONA_FIREWORKS: true,
  ARONA_BACK_TO_TOP: true,
  ARONA_AUTO_COLLAPSE: false,

  // ===== Spine 看板娘 =====
  ARONA_SPINE_ENABLE: true,
  /* 参考站的 ARONA_SPINE_BASE / ARONA_SPINE_VOICE_LANG 在本主题里不生效：
     SpinePlayer.js 直接读 voiceConfig 里的完整路径（从 Astro 移植时未沿用这两个键）。
     保留它们只为兼容外部覆盖，实际改这里不会起作用。 */
  ARONA_SPINE_BASE: process.env.NEXT_PUBLIC_ARONA_SPINE_BASE || '/arona/spine_assets',
  ARONA_SPINE_VOICE_LANG: process.env.NEXT_PUBLIC_ARONA_SPINE_VOICE_LANG || 'zh',
  ARONA_SPINE_LIGHT_CHAR: 'arona',
  ARONA_SPINE_DARK_CHAR: 'plana',

  /* 骨骼名必须与骨架二进制里的实际名字完全一致，否则 findBone 返回 null，
     眼神跟随 / 头部转动会静默失效（不报错，只是没反应）。
     以下名字均由 spine-core 4.2.108 实测解析得出：
       arona/arona_spr : R_Eye_01 ✓  L_Eye_01 ✓  Head_01 ✗(不存在)  Head_Rot ✓  Head_Back ✓
       plana/NP0035_spr : R_Eye_01 ✗(实际叫 R_Eye_1)  L_Eye_01 ✓  Head_Rot ✓  Head_Back ✗(实际叫 Head_back，小写 b)

     骨架 = 全身版（arona_spr / NP0035_spr），有眼与头骨骼，跟随功能才有效；
     台词 = 按 arona / plana 各自的角色性格重写，与骨架身份一致。
     语音 = 已整体关闭（原 aris/kei 录音与 arona/plana 的形象不符，
     arona/plana 自己的录音是另一批无配套台词的素材）。所以下面没有 audio 字段，
     字幕停留时长由 SpinePlayer.js 按字数估算。
     动画编号沿用原值，均已实测存在于对应骨架中：
       arona_spr  : 00 / 04 / 05 / 07 / 10（该骨架共 44 个动画）
       NP0035_spr : 03 / 17 / 18 / 20 / 99（该骨架只有 00-20 与 99，无 25/29） */
  ARONA_SPINE_CHARACTERS: {
    arona: {
      skelUrl: '/arona/spine_assets/arona/arona_spr.skel',
      atlasUrl: '/arona/spine_assets/arona/arona_spr.atlas',
      idleAnimationName: 'Idle_01',
      eyeCloseAnimationName: 'Eye_Close_01',
      rightEyeBone: 'R_Eye_01',
      leftEyeBone: 'L_Eye_01',
      frontHeadBone: 'Head_Rot',
      backHeadBone: 'Head_Back',
      eyeRotationAngle: 76.307,
      voiceConfig: [
        { animation: '10', text: '肚子饿了……咦？\n等等，我不需要吃电池的！' },
        { animation: '00', text: '老师，今天也一起加油吧。' },
        { animation: '07', text: '想把老师的好感度……唔，暂时保密。' },
        { animation: '05', text: '以这不可动摇的意志——光啊！' },
        { animation: '04', text: '老师？怎么了？叫我有事吗？' }
      ],
      copyConfig: { animation: '07', text: '邦邦咔邦！有用的知识复制好啦！' }
    },
    plana: {
      skelUrl: '/arona/spine_assets/plana/NP0035_spr.skel',
      atlasUrl: '/arona/spine_assets/plana/NP0035_spr.atlas',
      idleAnimationName: 'Idle_01',
      eyeCloseAnimationName: 'Eye_Close_01',
      rightEyeBone: 'R_Eye_1',
      leftEyeBone: 'L_Eye_01',
      frontHeadBone: 'Head_Rot',
      backHeadBone: 'Head_back',
      eyeRotationAngle: 97.331,
      voiceConfig: [
        { animation: '17', text: '……请别再叫我可爱了，笨蛋。' },
        { animation: '18', text: '我还没幼稚到需要你来提醒的程度。' },
        { animation: '03', text: '什么事？没事的话别来打扰我工作。' },
        { animation: '99', text: '努力也要适可而止，偷懒也是。' },
        { animation: '20', text: '刚才笑了吧？\n我全都看到了哦。' }
      ],
      copyConfig: { animation: '07', text: '复制好了……能帮上你就行。' }
    }
  }
}

export default CONFIG
