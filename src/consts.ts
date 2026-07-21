export const SITE = {
  title: 'zu1k',
  description: 'A boy dreaming of traveling around the world. Notes on security, systems, code and life.',
  url: 'https://zu1k.com',
  author: 'zu1k',
  email: 'i@zu1k.com',
  locale: 'zh-CN',
  timezone: 'Asia/Shanghai',
  since: 2017,
} as const;

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/zu1k' },
  { label: 'Mastodon', href: 'https://fosstodon.org/@zu1k' },
  { label: 'Telegram', href: 'https://t.me/peekfun' },
  { label: 'Email', href: `mailto:${SITE.email}` },
] as const;

export const NAV = [
  { label: '文章', href: '/posts/' },
  { label: '分类', href: '/categories/' },
  { label: '标签', href: '/tags/' },
  { label: '项目', href: '/projects/' },
  { label: '友链', href: '/links/' },
  { label: '关于', href: '/about/' },
] as const;
