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
  ARONA_SPINE_BASE: process.env.NEXT_PUBLIC_ARONA_SPINE_BASE || '/arona/spine_assets',
  ARONA_SPINE_VOICE_LANG: process.env.NEXT_PUBLIC_ARONA_SPINE_VOICE_LANG || 'zh',
  ARONA_SPINE_LIGHT_CHAR: 'arona',
  ARONA_SPINE_DARK_CHAR: 'plana',

  /* 骨骼名必须与骨架二进制里的实际名字完全一致，否则 findBone 返回 null，
     眼神跟随 / 头部转动会静默失效（不报错，只是没反应）。
     以下名字均由 spine-core 4.2.108 实测解析得出：
       arona/arona_spr : R_Eye_01 ✓  L_Eye_01 ✓  Head_01 ✗(不存在)  Head_Rot ✓  Head_Back ✓
       plana/NP0035_spr : R_Eye_01 ✗(实际叫 R_Eye_1)  L_Eye_01 ✓  Head_Rot ✓  Head_Back ✗(实际叫 Head_back，小写 b)

     文本与语音的对应关系（务必注意）：
     语音是 arona/plana 真人配音，仓库里没有配套台词表（参考站也从没写过全身版台词），
     下面的文本是**按各条语音的实际时长反推字数**写的占位台词，
     长度与录音接近，字幕不会明显念不完或提前结束。
     若要换成真实台词，请照着时长改：中文语速约每秒 4~5 字。
       arona_01 3.49s / 02 4.18s / 03 5.70s / 04 5.64s / 05 2.95s / 06 7.60s
       plana_01 9.12s / 02 6.43s / 03 1.33s / 04 5.74s / 05 1.67s */
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
        { audio: '/arona/spine_assets/arona/audio/zh/arona_01.ogg', animation: '10', text: '唔——肚子饿了，有吃的吗？' },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_02.ogg', animation: '00', text: '勇者啊，愿光与你同在，一路都要小心哦。' },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_03.ogg', animation: '07', text: '今天也请多指教，有什么需要我帮忙的吗？' },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_04.ogg', animation: '05', text: '以这不可动摇的意志……光啊！照亮前方的道路吧。' },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_05.ogg', animation: '04', text: '老师？怎么了？叫我有什么事吗？' },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_06.ogg', animation: '12', text: '观测记录已全部同步完毕，随时可以出发去下一个地方了。' }
      ],
      copyConfig: { animation: '07', text: '邦邦咔邦！复制了有用的知识呢！' }
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
        { audio: '/arona/spine_assets/plana/audio/zh/plana_01.ogg', animation: '17', text: '请别说我可爱啦！我可是分析AI，才不是什么需要人陪的小孩子。' },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_02.ogg', animation: '19', text: '……我还没幼稚到那种地步，少拿那种眼光看我。' },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_03.ogg', animation: '03', text: '什么事？' },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_04.ogg', animation: '99', text: '工作要适度，不过偷懒也得适可而止，别再熬太晚。' },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_05.ogg', animation: '20', text: '你笑什么笑。' }
      ],
      copyConfig: { animation: '07', text: '我能帮上忙吗？' }
    }
  }
}

export default CONFIG
