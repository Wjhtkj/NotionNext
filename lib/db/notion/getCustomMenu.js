function normalizeSourceSlug(slug) {
  if (typeof slug !== 'string') {
    return ''
  }

  const normalized = slug.trim()
  if (
    !normalized ||
    normalized === '#' ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(normalized)
  ) {
    return ''
  }

  return normalized.replace(/^\/+|\/+$/g, '')
}

export function getSourcePageSlugs(collectionData) {
  return new Map(
    collectionData
      .filter(page => page?.type === 'Page' && page?.slug)
      .map(page => [page.id, page.slug])
  )
}

function getPageHrefBySourceSlug(collectionData, sourcePageSlugs) {
  const pageHrefBySourceSlug = new Map()
  const ambiguousSlugs = new Set()

  collectionData.forEach(page => {
    const isDirectlyRoutable =
      page?.status === 'Published' || page?.status === 'Invisible'
    if (page?.type !== 'Page' || !isDirectlyRoutable || !page?.href) {
      return
    }

    const sourceSlug = normalizeSourceSlug(sourcePageSlugs?.get(page.id))
    if (!sourceSlug || ambiguousSlugs.has(sourceSlug)) {
      return
    }

    const existingHref = pageHrefBySourceSlug.get(sourceSlug)
    if (existingHref && existingHref !== page.href) {
      pageHrefBySourceSlug.delete(sourceSlug)
      ambiguousSlugs.add(sourceSlug)
      return
    }

    pageHrefBySourceSlug.set(sourceSlug, page.href)
  })

  return pageHrefBySourceSlug
}

export function getCustomMenu({ collectionData, sourcePageSlugs }) {
  const pageHrefBySourceSlug = getPageHrefBySourceSlug(
    collectionData,
    sourcePageSlugs
  )
  const menuPages = collectionData.filter(
    post =>
      post.status === 'Published' &&
      (post?.type === 'Menu' || post?.type === 'SubMenu')
  )
  const menus = []
  if (menuPages && menuPages.length > 0) {
    /* 先按原始顺序收集全部 Menu 及其下标，再单独给每个 SubMenu 找
       「它前面最近的那个 Menu」。

       原实现在单次遍历里用 menus[menus.length - 1]，隐含假设
       SubMenu 一定排在其父 Menu 之后。但 collectionData 的顺序由
       Notion 视图 / 最后编辑时间决定：只要在后台编辑过任意一条 Menu
       （哪怕只改一个 slug），Menu 就可能整体排到 SubMenu 后面，
       此时 menus 仍是空数组，所有子菜单被静默丢弃。
       线上实测：改了两条 Menu 的 slug 后，三个子菜单全部消失。

       两遍遍历在顺序正常时与原实现完全等价；顺序异常时退回到
       第一个 Menu，至少保证子菜单不会凭空消失。 */
    const menuAt = []
    menuPages.forEach((e, idx) => {
      e.show = true
      const sourceSlug = normalizeSourceSlug(e.slug)
      if (sourceSlug && pageHrefBySourceSlug.has(sourceSlug)) {
        e.href = pageHrefBySourceSlug.get(sourceSlug)
      }
      if (e.type === 'Menu') {
        menus.push(e)
        menuAt.push({ menu: e, idx })
      }
    })

    menuPages.forEach((e, idx) => {
      if (e.type !== 'SubMenu') return
      let parent = null
      for (const m of menuAt) {
        if (m.idx < idx) parent = m.menu
        else break
      }
      if (!parent) parent = menuAt[0]?.menu
      if (!parent) return
      if (parent.subMenus) parent.subMenus.push(e)
      else parent.subMenus = [e]
    })
  }
  return menus
}
