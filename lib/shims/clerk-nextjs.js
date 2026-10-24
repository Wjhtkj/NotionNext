/**
 * @clerk/nextjs 的空实现（仅在未配置 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 时通过
 * next.config.js 的 resolve.alias 生效）。
 *
 * 背景：NotionNext 里 @clerk/nextjs 是被静态 import 的（lib/global.js 的 useUser、
 * _app.js 的 zhCN 本地化包），即使用不到也会整包打进首屏 _app，实测约 90KB gzip。
 * 未配置 Clerk 的站点把它替换成这个 shim 后，首屏 JS 直接瘦身。
 *
 * 只要配置了 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY，alias 不生效，走真实的 Clerk。
 */
const noop = () => null

// 未启用 Clerk 时：永远处于「已就绪 + 未登录」状态，与 global.js 里
// enableClerk 为 false 时的兜底分支保持一致。
const EMPTY_USER_STATE = {
  isLoaded: true,
  isSignedIn: false,
  isSignedOut: true,
  user: null,
  session: null
}

export const useUser = () => EMPTY_USER_STATE
export const useAuth = () => EMPTY_USER_STATE
export const useSession = () => EMPTY_USER_STATE
export const useClerk = () => ({ loaded: true, signOut: async () => {} })
export const useOrganization = () => ({ isLoaded: true, organization: null })

export const ClerkProvider = ({ children }) => children
export const ClerkLoaded = ({ children }) => children
export const ClerkLoading = () => null

// 未登录：SignedOut 渲染子节点，SignedIn 什么都不渲染
export const SignedIn = () => null
export const SignedOut = ({ children }) => children

// 这些是登录相关 UI，未启用 Clerk 时不渲染
export const SignIn = noop
export const SignUp = noop
export const UserButton = noop
export const UserProfile = noop
export const OrganizationSwitcher = noop
export const OrganizationProfile = noop
export const CreateOrganization = noop
export const RedirectToSignIn = noop
export const RedirectToSignUp = noop

// 按钮类组件只作为包装器，保留子节点，避免布局塌陷
export const SignInButton = ({ children }) => children ?? null
export const SignUpButton = ({ children }) => children ?? null
export const SignOutButton = ({ children }) => children ?? null
