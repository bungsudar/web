# zu1k / ablog

`zu1k.com` 的 Astro 博客源码。网站提供静态构建、内容集合、全文搜索、代码高亮、Mermaid、RSS 与 Atom 订阅。

`ablog` 是完整、独立的仓库根目录。

## 开发与构建

需要 Node.js 22 和 npm。仓库提交了 `package-lock.json`，CI 与部署平台统一使用 `npm ci`。

```bash
npm ci
npm run dev
```

提交前运行：

```bash
npm run check
npm run build
```

静态产物输出到 `dist/`，本地预览使用 `npm run preview`。构建不需要私有环境变量。

## 部署

仓库包含以下部署入口：

- GitHub Pages：`.github/workflows/deploy-github-pages.yml`
- Cloudflare Workers：`wrangler.jsonc` 和 `npm run deploy:cloudflare`
- Vercel：`vercel.json` 和 `npm run deploy:vercel`
- 持续集成：`.github/workflows/ci.yml`

Cloudflare 与 Vercel 直接连接 Git 仓库并监听提交，不通过 GitHub Actions 重复部署。详细配置见 [DEPLOYMENT.md](./DEPLOYMENT.md)。正式域名由 `astro.config.mjs` 和 `public/CNAME` 统一为 `https://zu1k.com`。

## 内容结构

- `src/content/posts/`：博客文章及文章展示资源
- `src/content/pages/`：关于、项目、友链等独立页面
- `src/data/friends.ts`：友链资料
- `src/data/projects.ts`：项目页结构化数据
- `src/components/`：站点组件
- `src/layouts/`：页面与文章布局
- `src/styles/global.css`：全局设计系统

文章由 Astro Content Collections 管理。草稿不会进入生产页面、搜索索引或订阅源。
