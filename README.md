# zu1k.com

[zu1k.com](https://zu1k.com) 是一个使用 [Astro](https://astro.build) 构建的个人博客，记录安全、系统、开源以及那些无法被代码解释的生活。

## 特性

- 静态生成，快速且易于部署
- 响应式设计与明暗主题
- 全文搜索、代码高亮与 Mermaid 图表
- RSS、Atom 和站点地图
- 基于 Astro Content Collections 的内容管理

## 本地开发

需要 Node.js 22 和 npm。

```bash
npm ci
npm run dev
```

检查并生成生产版本：

```bash
npm run check
npm run build
```

构建结果位于 `dist/`，可以通过 `npm run preview` 在本地预览。

## 内容

- `src/content/posts/`：文章与相关资源
- `src/content/pages/`：关于、项目等独立内容
- `src/data/`：项目与友链等结构化数据
- `src/components/`：可复用页面组件

草稿不会出现在生产页面、搜索索引或订阅源中。

## 部署

支持 GitHub Pages、Cloudflare Workers 和 Vercel。各平台的构建与域名配置见 [部署说明](./DEPLOYMENT.md)。
