# Claire · 个人主页与简历

深色白金主题的个人展示网站：入口照片页 → 主页（Hero / 滚动图墙 / About / Skills / Education / Program / Knowledge / Subscribe）→ 独立内容管理后台。

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide React

## 本地开发

```bash
npm install
npm run dev        # 开发预览（http://localhost:5173）
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物（http://localhost:4173）
```

## 页面

| 地址 | 说明 |
| --- | --- |
| `index.html` | 对外展示主页（入口照片点击进入） |
| `admin.html` | 内容管理后台（noindex，仅自己使用） |

## 内容管理

- 网站内容统一存放在 `public/content.json`（简历经历、Program 作品、知识库）。
- 管理后台 `/admin.html` 可视化编辑：
  - **保存到本机预览**：写入浏览器 localStorage，本机立即生效；
  - **发布到网站**：通过 GitHub API 把内容提交到仓库的 `public/content.json`，GitHub Pages 自动重新部署，1-2 分钟内全网上线（需在后台配置仓库信息与 Token，Token 仅保存在本机浏览器）；
  - 支持导出 / 导入 `content.json`。
- 简历 PDF：`public/Claire-He-Resume.pdf`，替换同名文件即可更新下载链接指向的文件。
- 作品配图：`public/art/`，SVG 或图片均可，管理后台里填相对路径（如 `art/bifrost.svg`）。

## 部署

GitHub Pages，部署分支为 `gh-pages`（网站根目录即构建产物，含 `content.json`）：

```bash
npm run build
cd dist && git init -b gh-pages && git add -A && git commit -m "deploy"
git remote add origin https://github.com/kekeyee1103-ui/claire-portfolio.git
git push -f origin gh-pages:gh-pages
```

内容更新无需重新构建：在 `/admin.html` 后台点「发布到网站」，会同时把 `content.json` 提交到 `main`（存档）与 `gh-pages`（即时上线）。
