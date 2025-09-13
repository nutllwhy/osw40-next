# Open‑Strengths@Work (OSW‑40)

一个基于 **公有领域题库理念** 的工作优势测评站（Next.js + TypeScript + Tailwind + Recharts）。
> 与 Gallup®/CliftonStrengths® 无从属或授权关系；严禁复制/仿制其受版权保护的题库与报告。

## 本地运行
```bash
pnpm i   # 或 npm i / yarn
pnpm dev # or npm run dev / yarn dev
```
打开 http://localhost:3000

## 构建 & 生产
```bash
pnpm build && pnpm start
```

## 部署

### GitHub Pages（推荐）
项目已配置自动部署到 GitHub Pages：

1. **Fork 或克隆仓库**到你的 GitHub 账户
2. **启用 GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
3. **推送代码**后自动触发部署
4. **访问地址**：`https://你的用户名.github.io/osw40-next/`

### 其他部署方式
- **Vercel**：一键导入仓库即可；默认 `next start`。
- **Netlify/自托管**：使用 Node 18+，执行 `npm run build && npm start`。
- **本地静态导出**：`npm run deploy` 生成 `out/` 目录。

## 目录
```
app/            # App Router
  page.tsx      # 页面入口（客户端组件）
  layout.tsx
  globals.css   # Tailwind
components/
  OSWApp.tsx    # 测评主应用（题库、计分、报告）
```

## 定制
- 题库：在 `components/OSWApp.tsx` 的 `ITEMS` 数组中编辑（支持反向计分）。
- 维度：在 `DIMS`、`INTERP` 中修改标签、解释与行动建议。
- 报告：当前提供 JSON 下载与打印 PDF，可接入后端存储常模与团队看板。

## 在线体验

🌐 **在线测评地址**：[https://你的用户名.github.io/osw40-next/](https://你的用户名.github.io/osw40-next/)

> 完全免费使用，无需注册，数据仅在本地处理，支持下载测评报告。

## 功能特色

- ✅ **40 题专业测评**：覆盖 5 大工作优势维度
- ✅ **可视化报告**：雷达图 + TOP3 优势分析
- ✅ **行动建议**：针对每个维度提供具体改进方案
- ✅ **数据安全**：纯客户端运行，无数据上传
- ✅ **完全免费**：开源项目，可自由使用和定制
- ✅ **响应式设计**：支持手机、平板、桌面端

## 版权与商标
- 本仓库题项与文案为原创文本，可自由复制与商用（保留合规声明更佳）。
- Gallup®、CliftonStrengths® 等名称/主题为注册商标，请勿用于误导性宣传。

## 贡献

欢迎提交 Issue 和 Pull Request：
- 🐛 报告问题或建议
- 📝 改进题库内容
- 🎨 优化界面设计
- 🌍 添加多语言支持
