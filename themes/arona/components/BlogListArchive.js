import SmartLink from '@/components/SmartLink'

/**
 * 博客归档列表；仅归档页面使用
 * 按照日期将文章分组
 * @param {*} param0
 * @returns
 */
export default function BlogListArchive({ archiveTitle, archivePosts }) {
  return (
    <div key={archiveTitle}>
      {/* arona-archive-title / arona-archive-item 供 11 号动效
          （细节呼吸）挂「标题描线 + 竖线逐条生长」，见 style.js 的 detail 段 */}
      <div id={archiveTitle} className='arona-archive-title pt-16 pb-4 text-3xl dark:text-gray-300'>
        {archiveTitle}
      </div>

      <ul>
        {archivePosts[archiveTitle].map(post => {
          return (
            <li
              key={post.id}
              className='arona-archive-item border-l-2 p-1 text-xs md:text-base items-center  hover:scale-x-105 hover:border-gray-500 dark:hover:border-gray-300 dark:border-gray-400 transform duration-500'>
              <div id={post?.publishDay}>
                <span className='text-gray-400'>{post?.publishDay}</span> &nbsp;
                <SmartLink
                  href={post?.href}
                  className='dark:text-gray-400  dark:hover:text-gray-300 overflow-x-hidden hover:underline cursor-pointer text-gray-600'>
                  {post.title}
                </SmartLink>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
