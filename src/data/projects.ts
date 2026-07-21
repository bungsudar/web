export type ProjectCategory = 'tools' | 'network' | 'security' | 'apps' | 'ecosystem' | 'learning';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  summary: string;
  category: ProjectCategory;
  stack: string[];
  links: ProjectLink[];
  trending?: boolean;
  featured?: boolean;
  highlight?: string;
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  tools: '开发工具',
  network: '网络与系统',
  security: '安全研究',
  apps: '实用应用',
  ecosystem: '开源生态',
  learning: '实验与学习',
};

export const PROJECT_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'trending', label: 'Trending' },
  { id: 'tools', label: PROJECT_CATEGORY_LABELS.tools },
  { id: 'network', label: PROJECT_CATEGORY_LABELS.network },
  { id: 'security', label: PROJECT_CATEGORY_LABELS.security },
  { id: 'apps', label: PROJECT_CATEGORY_LABELS.apps },
  { id: 'ecosystem', label: PROJECT_CATEGORY_LABELS.ecosystem },
  { id: 'learning', label: PROJECT_CATEGORY_LABELS.learning },
] as const;

export const PROJECTS: Project[] = [
  {
    slug: 'nali',
    name: 'Nali',
    summary: '查询 IP 地理信息和 CDN 服务提供商的离线终端工具，支持管道、交互查询、IPv4/IPv6 与多种数据库。',
    category: 'tools',
    stack: ['Go', 'CLI', 'IP'],
    trending: true,
    featured: true,
    highlight: '20k+ downloads',
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/nali' }],
  },
  {
    slug: 'book-searcher',
    name: 'Book Searcher',
    summary: '为私人图书馆构建的高性能搜索器，可为千万级图书元数据建立索引，并保持极低查询延迟。',
    category: 'tools',
    stack: ['Rust', 'Tantivy', 'Tauri'],
    trending: true,
    featured: true,
    highlight: '10M+ books · 30μs search',
    links: [{ label: 'GitHub', href: 'https://github.com/book-searcher-org/book-searcher' }],
  },
  {
    slug: 'copy-translator',
    name: 'Copy Translator',
    summary: '面向论文阅读的轻量划词翻译软件，自动整理换行和断句，并使用 DeepL 提供自然的翻译结果。',
    category: 'apps',
    stack: ['Rust', 'egui', 'DeepL'],
    trending: true,
    featured: true,
    highlight: '12 MB desktop app',
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/translator' }],
  },
  {
    slug: 'good-mitm',
    name: 'Good MITM',
    summary: '可编程的 MITM 代理，提供 rewrite、redirect、reject、透明代理和基于 YAML 的规则描述能力。',
    category: 'security',
    stack: ['Rust', 'TLS', 'Proxy'],
    trending: true,
    featured: true,
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/good-mitm' }],
  },
  {
    slug: 'srun',
    name: 'Srun',
    summary: '面向深澜校园网认证的超轻量多平台客户端，支持多拨、自动探测 IP 与指定网卡。',
    category: 'network',
    stack: ['Rust', 'OpenWrt', 'Network'],
    highlight: '209 KB executable',
    links: [
      { label: 'GitHub', href: 'https://github.com/zu1k/srun' },
      { label: '相关文章', href: '/posts/tutorials/campus-network-speed-overlay/' },
    ],
  },
  {
    slug: 'proxypool',
    name: 'ProxyPool',
    summary: '自动抓取 Telegram 频道、订阅地址和公开网络中的代理节点，聚合去重后提供统一节点列表。',
    category: 'network',
    stack: ['Go', 'Proxy', 'Crawler'],
    trending: true,
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/proxypool' }],
  },
  {
    slug: 'http-proxy-ipv6-pool',
    name: 'HTTP Proxy IPv6 Pool',
    summary: '让每个 HTTP 代理请求使用不同 IPv6 地址发出，适合需要大规模 IPv6 地址轮换的场景。',
    category: 'network',
    stack: ['Go', 'IPv6', 'Proxy'],
    links: [
      { label: 'GitHub', href: 'https://github.com/zu1k/http-proxy-ipv6-pool' },
      { label: '相关文章', href: '/posts/tutorials/http-proxy-ipv6-pool/' },
    ],
  },
  {
    slug: 'uniclip',
    name: 'Unified Clipboard',
    summary: '局域网内的多设备剪贴板同步工具，使用 mDNS 发现设备、GossipSub 传递文本和图片。',
    category: 'apps',
    stack: ['Rust', 'libp2p', 'mDNS'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/uniclip' }],
  },
  {
    slug: 'telegram-keyword-bot',
    name: 'Telegram Keyword Bot',
    summary: '可由管理员动态配置关键词和正则规则的 Telegram 群管机器人，支持回复、禁言和成员管理。',
    category: 'apps',
    stack: ['Go', 'Telegram', 'Bot'],
    trending: true,
    highlight: '20k groups at peak',
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/tg-keyword-reply-bot' }],
  },
  {
    slug: 'hosts-rs',
    name: 'Hosts-rs',
    summary: 'Hosts 文件解析与修改库，以及 resolve-github、github-hosts 等围绕域名解析衍生的工具。',
    category: 'tools',
    stack: ['Rust', 'DNS', 'Library'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/hosts-rs' }],
  },
  {
    slug: 'mitm-netflix-vip-unlocker',
    name: 'MITM Netflix VIP Unlocker',
    summary: '在不暴露账号密码和 Cookie 的情况下，与受信任的朋友共享 Netflix 会员能力。',
    category: 'security',
    stack: ['MITM', 'Netflix', 'Research'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k' }],
  },
  {
    slug: 'deepl-free-api',
    name: 'DeepL Free API',
    summary: '通过研究 DeepL 客户端协议实现的轻量 API 服务，并提供可直接运行的 Docker 镜像。',
    category: 'apps',
    stack: ['DeepL', 'API', 'Docker'],
    links: [{ label: 'Docker Hub', href: 'https://hub.docker.com/r/zu1k/deepl' }],
  },
  {
    slug: 'beacon-hook-bypass-memscan',
    name: 'Beacon Hook Bypass Memscan',
    summary: '“CS bypass 卡巴斯基内存查杀”思路的 Rust 实验实现，用于安全研究与技术验证。',
    category: 'security',
    stack: ['Rust', 'Memory', 'Research'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/beacon_hook_bypass_memscan' }],
  },
  {
    slug: 'go-service-ipfs',
    name: 'go-service-ipfs',
    summary: 'BeyondStorage go-storage 生态中的 IPFS 存储后端，为统一存储接口补充去中心化存储能力。',
    category: 'ecosystem',
    stack: ['Go', 'IPFS', 'Storage'],
    links: [{ label: 'GitHub', href: 'https://github.com/beyondstorage/go-service-ipfs' }],
  },
  {
    slug: 'pl0-compiler',
    name: 'PL0 Compiler',
    summary: '编译原理课程实验：实现简化 PL/0 的词法分析、语法分析、中间代码生成和解释执行。',
    category: 'learning',
    stack: ['Compiler', 'PL/0', 'Education'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/pl0compiler' }],
  },
  {
    slug: 'github-hosts',
    name: 'GitHub Hosts',
    summary: '生成用于改善 GitHub 访问体验的 Hosts 规则，是 Hosts-rs 工具链中的一个实际应用。',
    category: 'network',
    stack: ['DNS', 'Hosts', 'Automation'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/github-hosts' }],
  },
  {
    slug: 'xray-cracker',
    name: 'Xray Cracker',
    summary: '对 Xray 证书校验逻辑的逆向研究与验证工具；项目保留用于记录相关技术思考。',
    category: 'security',
    stack: ['Go', 'Reverse', 'IDA'],
    trending: true,
    links: [
      { label: 'GitHub', href: 'https://github.com/zu1k/xray-crack-rm' },
      { label: '相关文章', href: '/posts/security/reverse/xray-cracker/' },
    ],
  },
  {
    slug: 'dogecloud-cos-action',
    name: 'DogeCloud COS Action',
    summary: '使用 GitHub Actions 将文件部署到 DogeCloud COS，补全对象存储与 CDN 的持续部署流程。',
    category: 'ecosystem',
    stack: ['GitHub Actions', 'COS', 'CI/CD'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/dogecloud-cos-action' }],
  },
  {
    slug: 'evernote-noad',
    name: '印象笔记去广告',
    summary: '通过替换广告链接移除印象笔记客户端中的干扰内容，一次小而直接的体验优化实验。',
    category: 'security',
    stack: ['Reverse', 'Desktop', 'Patch'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/evernote_noad' }],
  },
  {
    slug: 'globalssh-for-github',
    name: 'GlobalSSH for GitHub',
    summary: '利用 UCloud GlobalSSH 服务改善 GitHub SSH 协议连接体验的辅助工具。',
    category: 'network',
    stack: ['SSH', 'UCloud', 'GitHub'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/globalssh4github' }],
  },
  {
    slug: 'coolq-rss-push-bot',
    name: 'CoolQ RSS Push Bot',
    summary: '把 RSS 更新自动推送到 QQ 群的机器人，用轻量自动化连接信息源和即时通讯。',
    category: 'apps',
    stack: ['RSS', 'QQ Bot', 'Automation'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/coolq-rsspushbot' }],
  },
  {
    slug: 'my-followers',
    name: 'My Followers',
    summary: '使用 GitHub GraphQL API 获取关注者，并由 GitHub Actions 每日更新生成头像墙。',
    category: 'ecosystem',
    stack: ['GraphQL', 'GitHub Actions', 'SVG'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/my_followers' }],
  },
  {
    slug: 'ldap-log',
    name: 'LDAP-log',
    summary: '面向安全测试的 LDAP 请求监听器，在需要独立回连验证时替代公共 DNSLog 平台。',
    category: 'security',
    stack: ['LDAP', 'Log4j', 'Security'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/ldap-log' }],
  },
  {
    slug: 'libafl-book-zh',
    name: 'LibAFL Book 中文版',
    summary: 'LibAFL 官方文档的简体中文翻译，让更多中文开发者能够系统了解现代模糊测试框架。',
    category: 'ecosystem',
    stack: ['LibAFL', 'Translation', 'Fuzzing'],
    links: [
      { label: 'GitHub', href: 'https://github.com/zu1k/LibAFL-Book-zh' },
      { label: '在线阅读', href: 'https://libafl-book-zh.zu1k.com/' },
    ],
  },
  {
    slug: 'install-cert',
    name: 'install-cert',
    summary: '跨平台向操作系统信任区安装根证书的基础工具，适合作为代理和开发工具的底层能力。',
    category: 'tools',
    stack: ['Certificate', 'System', 'CLI'],
    links: [{ label: 'GitHub', href: 'https://github.com/zu1k/install-cert' }],
  },
];
