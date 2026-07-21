# 部署说明

所有命令均从仓库根目录执行。网站由 `npm run build` 生成到 `dist/`，不需要 Astro 服务端适配器。

## GitHub Pages

1. 将仓库推送到 GitHub，默认分支可使用 `main` 或 `master`。
2. 在 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。
3. 推送默认分支，或手动运行 **Deploy to GitHub Pages** 工作流。
4. 在 Pages 设置中确认自定义域名 `zu1k.com`，并按 GitHub 提示配置 DNS。

工作流使用 GitHub Pages artifact 与 OIDC 部署，不写入 `gh-pages` 分支。`public/CNAME` 会随静态产物一起发布。

## Cloudflare Workers

在 Cloudflare 控制台的 **Workers & Pages** 中导入 Git 仓库，使用原生 Git 集成监听提交。推荐配置：

- Production branch：仓库的默认分支
- Build command：`npm run build`
- Deploy command：`npx wrangler deploy`
- Node.js version：`22`

`wrangler.jsonc` 已将 `dist/` 声明为 Worker 静态资源目录。Cloudflare 完成首次连接后，每次提交都会触发构建和部署，不需要额外的 GitHub Actions 或仓库密钥。

需要从本机手动部署时可运行：

```bash
npm run deploy:cloudflare
```

命令行部署只用于本地操作，需要先执行 `npx wrangler login`；仓库自动部署不依赖这一步。

## Vercel

在 Vercel 中直接导入 Git 仓库即可。`vercel.json` 已明确 Astro、安装命令、构建命令与 `dist` 输出目录；Vercel 会监听提交并自动生成生产部署和预览部署，不需要额外的 GitHub Actions 或仓库密钥。

需要从本机手动部署时可运行：

```bash
npm run deploy:vercel
```

首次运行时 Vercel CLI 会引导登录并关联项目；本地生成的 `.vercel/` 已被忽略，不会进入仓库。

## 自动部署选择

- GitHub Pages：由仓库内的 GitHub Actions 构建并发布。
- Cloudflare Workers：由 Cloudflare 原生 Git 集成构建并发布。
- Vercel：由 Vercel 原生 Git 集成构建并发布。

三条部署链路彼此独立，不需要在 GitHub 中保存 Cloudflare 或 Vercel 的访问令牌。
