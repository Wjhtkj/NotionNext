/**
 * 网页右键点击后是否弹出自定义菜单
 *
 * 注意：CUSTOM_RIGHT_CLICK_CONTEXT_MENU 原先写成
 *   process.env.XXX || true
 * 这种写法下即使环境变量设为 'false' 也会因为 || 的短路语义退回 true，
 * 根本无法关闭。改为显式转换：只有 'false' / '0' 才算关闭。
 */
const toBool = (val, dflt) => {
  if (val === undefined || val === null || val === '') return dflt
  return !(String(val) === 'false' || String(val) === '0')
}

module.exports = {
  /* 关闭自定义右键菜单，恢复浏览器原生右键菜单。
     站点已在导航栏提供 Arona / Plana / System 主题切换与看板娘开关，
     不需要再劫持右键；同时也避免与浏览器的「检查/另存为/翻译」等原生项冲突。 */
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU,
    false
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH,
    true
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE,
    true
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK,
    true
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST,
    true
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY,
    true
  ),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_TAG: toBool(
    process.env.NEXT_PUBLIC_CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_TAG,
    true
  )
}
