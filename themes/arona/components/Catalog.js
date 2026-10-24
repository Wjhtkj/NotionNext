import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 目录导航组件（Endless647 风格）
 * 结构：白底圆角卡片 + 「目录」标题 + 二/三级条目
 * - h2 为顶层条目（加粗、未激活时淡化）
 * - h3 收进所属 h2 的子列表，仅当前 h2 展开（对齐 TableOfContents.astro）
 * - 当前可见标题高亮为蓝字 + 淡蓝药丸底色（对齐 .toc-link.active）
 * @param {*} toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc }) => {
  const [activeSection, setActiveSection] = useState(null)

  // 把扁平 toc 组装成 { h2, children[] } 的树
  const tree = useMemo(() => {
    const out = []
    let current = null
    ;(toc || []).forEach(tocItem => {
      const id = uuidToId(tocItem.id)
      const text = tocItem.text || ''
      if (tocItem.indentLevel >= 2) {
        if (current) {
          current.children.push({ id, text })
        } else {
          current = { id, text, children: [] }
          out.push(current)
        }
      } else {
        current = { id, text, children: [] }
        out.push(current)
      }
    })
    return out
  }, [toc])

  // 当前激活的顶层 h2
  const activeH2 = useMemo(() => {
    if (!activeSection) return tree[0]?.id ?? null
    const hit = tree.find(
      t => t.id === activeSection || t.children.some(c => c.id === activeSection)
    )
    return hit?.id ?? tree[0]?.id ?? null
  }, [activeSection, tree])

  // 目录自动滚动
  const tRef = useRef(null)
  const tocIds = useMemo(() => {
    const ids = []
    tree.forEach(t => {
      ids.push(t.id)
      t.children.forEach(c => ids.push(c.id))
    })
    return ids
  }, [tree])

  const throttleMs = 200
  /* 记录上一次把目录滚到第几项。
     原来只要 index >= 0 就调一次 scrollTo({behavior:'smooth'})，而这段
     是挂在 scroll 上的节流回调 —— 滚动时每 200ms 就重新发起一次平滑滚动，
     新动画把上一次打断，目录看起来一直在「抽搐」。
     现在只在「激活项真的换了」时才滚，动画能完整播完。 */
  const lastTocIndexRef = useRef(-1)
  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = null
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        // GetBoundingClientRect returns values relative to viewport
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = tocIds.indexOf(currentSectionId)
      if (index >= 0 && index !== lastTocIndexRef.current) {
        lastTocIndexRef.current = index
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        tRef?.current?.scrollTo({
          top: 28 * index,
          behavior: reduce ? 'auto' : 'smooth'
        })
      }
    }, throttleMs),
    [tocIds]
  )

  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy, { passive: true })
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [actionSectionScrollSpy])

  // 无目录就直接返回空
  if (!toc || toc.length < 1 || tree.length < 1) {
    return <></>
  }

  return (
    <nav className='arona-toc' aria-label='文章目录'>
      <div className='arona-toc-header'>
        <span className='arona-toc-title'>目录</span>
      </div>
      <div className='arona-toc-body' ref={tRef}>
        <ul className='arona-toc-list'>
          {tree.map(node => (
            <li
              key={node.id}
              className={`arona-toc-item arona-toc-level-2 ${
                activeH2 === node.id ? 'is-current-h2' : ''
              }`}>
              <a
                href={`#${node.id}`}
                className={`arona-toc-link ${
                  activeSection === node.id ? 'active' : ''
                }`}>
                {node.text}
              </a>
              {node.children.length > 0 && (
                <ul
                  className={`arona-toc-sub-list ${
                    activeH2 === node.id ? 'is-visible' : ''
                  }`}>
                  {node.children.map(child => (
                    <li key={child.id} className='arona-toc-item arona-toc-level-3'>
                      <a
                        href={`#${child.id}`}
                        className={`arona-toc-link ${
                          activeSection === child.id ? 'active' : ''
                        }`}>
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Catalog
