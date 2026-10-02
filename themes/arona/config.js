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

     骨架与语音是分开选的，互不绑定：
       骨架 = 全身版（arona_spr / NP0035_spr），有眼与头骨骼，跟随功能才有效；
       语音 = aris/kei 的，与下面文本一一对应（沿用作者原始配置，语义正确）。
     不要换成 arona/plana 目录下的语音：那些是另一批同人录音，仓库里没有配套台词，
     字幕无法与之对应（且作者原始配置里 aris/kei 的文本也有时长偏差，
     属源素材固有问题，不是此处引入）。 */
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
        { audio: '/arona/spine_assets/aris/audio/aris_01.ogg', animation: '10', text: '唔——肚子饿了。\n咦……？ \n爱丽丝不吃电池的！' },
        { audio: '/arona/spine_assets/aris/audio/aris_02.ogg', animation: '00', text: '勇者啊，愿光与你同在。' },
        { audio: '/arona/spine_assets/aris/audio/aris_03.ogg', animation: '07', text: '爱丽丝也想要提升老师的好感度。' },
        { audio: '/arona/spine_assets/aris/audio/aris_04.ogg', animation: '05', text: '以这不可动摇的意志……光啊！' },
        { audio: '/arona/spine_assets/aris/audio/aris_05.ogg', animation: '04', text: '老师？怎么了？' }
      ],
      copyConfig: { audio: '/arona/spine_assets/aris/audio/aris_copy.mp3', animation: '07', text: '邦邦咔邦！复制了有用的知识呢！' }
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
        { audio: '/arona/spine_assets/kei/audio/kei_01.ogg', animation: '17', text: '请别说我可爱啦！' },
        { audio: '/arona/spine_assets/kei/audio/kei_02.ogg', animation: '18', text: '……我还没幼稚到那种地步。' },
        { audio: '/arona/spine_assets/kei/audio/kei_03.ogg', animation: '03', text: '什么事？如果没事的话请不要叫我。' },
        { audio: '/arona/spine_assets/kei/audio/kei_04.ogg', animation: '99', text: '工作要适度，不过偷懒也得适可而止。' },
        { audio: '/arona/spine_assets/kei/audio/kei_05.ogg', animation: '20', text: '刚才笑了吧！？\n绝对是笑了对吧！？\n我可全都看到了！' }
      ],
      copyConfig: { audio: '/arona/spine_assets/kei/audio/kei_copy.ogg', animation: '07', text: '我能帮上忙吗？' }
    }
  }
}

export default CONFIG
