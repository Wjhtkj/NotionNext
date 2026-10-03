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

     骨架 = 全身版（arona_spr / NP0035_spr），有眼与头骨骼，跟随功能才有效。
     语音 = 各角色自有录音（arona/audio/zh、plana/audio/zh），与形象一致。

     ★ 人工配对指南（config 里每条都标了实测时长与建议字数）
     ----------------------------------------------------
     1. 每条 voice 就是「一个音频 + 一句台词 + 一个动画」的绑定。
        新增一条就往数组里加一个对象；少一个逗号会导致整个配置解析失败。
     2. 先用「试听工具」听音频、照着写台词（本地打开 tools/spine-voice.html）。
        工具会同时显示该音频的实测时长与建议字数区间，不用自己算。
     3. 写完把 text 填进来，duration 改成你实测的秒数（可选，但强烈建议填：
        填了它，字幕严格跟着录音走；不填则由 SpinePlayer.js 按字数估算，
        会有几百毫秒误差）。
     4. 标记 ok: true 表示这条已人工确认；配好后可以删掉所有 ok 与 duration 字段，
        只留 audio / animation / text 长期使用。
     5. 配错了直接改 text；想禁用某条就整条删掉，或设 skip: true。
        某条若没有 audio 字段，则只显示字幕不播声音（静默台词）。

     ⚠ 不要出现两处 audio 指向同一个文件（会重复听到同一句）。
     ⚠ 不要把 arona/plana 的骨架配上 aris/kei 的音频 —— 形象与声音对不上。 */

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
      /* 实测 setup pose 包围盒，供 SpinePlayer 初始化与响应式布局使用。
         arona_spr = 1011 x 2128（1:2.10） */
      boundsHeight: 2128,
      aspectRatio: 0.4752,
      /* 时长为实测值（Ogg granule / 采样率），建议字数按中文口语 3.2~5.2 字/秒 */
      voiceConfig: [
        { audio: '/arona/spine_assets/arona/audio/zh/arona_01.ogg', duration: 3.49, chars: '20 字以内', animation: '10', text: '', ok: false },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_02.ogg', duration: 4.18, chars: '14~21 字', animation: '00', text: '', ok: false },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_03.ogg', duration: 5.7, chars: '19~29 字', animation: '07', text: '', ok: false },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_04.ogg', duration: 5.64, chars: '19~29 字', animation: '05', text: '', ok: false },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_05.ogg', duration: 2.95, chars: '10~15 字', animation: '04', text: '', ok: false },
        { audio: '/arona/spine_assets/arona/audio/zh/arona_06.ogg', duration: 7.6, chars: '25~39 字', animation: '03', text: '', ok: false }
      ],
      /* arona 目录下没有 copy 语音（只有 aris 有 aris_copy.mp3），
         所以复制事件用静默台词：只出字幕不播声音。 */
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
      /* 实测 setup pose 包围盒。NP0035_spr = 1154 x 2216（1:1.92），
         比 arona 宽约 9%，所以响应式必须按各自比例单独算，不能共用一个宽度 */
      boundsHeight: 2216,
      aspectRatio: 0.5207,
      /* NP0035_spr 可用动画只有 00-20 与 99（无 25/29），下面编号均已实测存在 */
      voiceConfig: [
        { audio: '/arona/spine_assets/plana/audio/zh/plana_01.ogg', duration: 9.12, chars: '30~47 字', animation: '17', text: '', ok: false },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_02.ogg', duration: 6.43, chars: '21~33 字', animation: '18', text: '', ok: false },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_03.ogg', duration: 1.33, chars: '4~6 字', animation: '03', text: '', ok: false },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_04.ogg', duration: 5.74, chars: '19~29 字', animation: '99', text: '', ok: false },
        { audio: '/arona/spine_assets/plana/audio/zh/plana_05.ogg', duration: 1.67, chars: '5~8 字', animation: '20', text: '', ok: false }
      ],
      /* plana 目录同样没有 copy 语音（只有 kei 有 kei_copy.ogg） */
      copyConfig: { animation: '07', text: '复制好了……能帮上你就行。' }
    }
  }
}

export default CONFIG
