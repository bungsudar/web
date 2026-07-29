export const SITE = {
  title: 'Sudar Blogger',
  description: 'A boy dreaming of traveling around the world. Notes on security, systems, code and life.',
  url: 'https://zu1k.com',
  author: 'Masdar',
  email: 'i@zu1k.com',
  locale: 'zh-CN',
  timezone: 'Asia/Jakarta',
  since: 2017,
} as const;

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/zu1k' },
  { label: 'Mastodon', href: 'https://fosstodon.org/@zu1k' },
  { label: 'Telegram', href: 'https://t.me/peekfun' },
  { label: 'Email', href: `mailto:${SITE.email}` },
] as const;

export const NAV = [
  { label: 'Blog', href: '/posts/' },
  { label: 'Topik', href: '/categories/' },
  { label: 'Tag', href: '/tags/' },
  { label: 'Project', href: '/projects/' },
  { label: 'Teman', href: '/links/' },
  { label: 'About', href: '/about/' },
] as const;
