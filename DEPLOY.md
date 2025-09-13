# 部署指南

## 🚀 GitHub Pages 部署（推荐）

### 第一步：上传到 GitHub

1. **创建新仓库**
   ```bash
   # 如果还没有初始化 git
   git init
   git add .
   git commit -m "Initial commit: OSW-40 工作优势测评系统"
   
   # 关联远程仓库（替换为你的用户名）
   git remote add origin https://github.com/你的用户名/osw40-next.git
   git branch -M main
   git push -u origin main
   ```

2. **设置 GitHub Pages**
   - 进入你的仓库页面
   - 点击 `Settings` → `Pages`
   - 在 `Source` 下选择 `GitHub Actions`
   - 保存设置

3. **自动部署**
   - 每次推送到 `main` 分支都会自动触发部署
   - 部署完成后，访问：`https://你的用户名.github.io/osw40-next/`

### 第二步：测试访问

部署成功后，你的测评系统将在以下地址可用：
- 🌐 **在线地址**：`https://你的用户名.github.io/osw40-next/`
- ⚡ **功能完整**：支持所有测评功能
- 📱 **响应式**：支持手机、平板访问
- 🔒 **隐私安全**：数据仅在客户端处理

## 🛠️ 本地测试

在推送到 GitHub 之前，可以本地测试：

```bash
# 安装依赖
npm install

# 构建静态文件
npm run build

# 本地预览（可选）
npx serve out
```

## 📋 部署检查清单

- [x] ✅ Next.js 配置已优化（静态导出）
- [x] ✅ GitHub Actions 工作流已配置
- [x] ✅ .nojekyll 文件已添加
- [x] ✅ 路径别名已配置
- [x] ✅ 构建测试通过
- [x] ✅ README 已更新

## 🔧 故障排除

### 构建失败
- 检查 Node.js 版本（推荐 18+）
- 确保所有依赖已安装：`npm install`
- 查看构建日志中的错误信息

### 页面无法访问
- 确认 GitHub Pages 已启用
- 检查仓库是否为公开状态
- 等待 2-3 分钟让部署完成

### 样式或功能异常
- 检查浏览器控制台是否有错误
- 确认 `basePath` 配置正确
- 清除浏览器缓存后重试

## 📞 获取帮助

如果遇到问题，可以：
1. 查看 GitHub Actions 的部署日志
2. 在仓库中创建 Issue
3. 检查 Next.js 官方文档的静态导出部分

---

🎉 **恭喜！** 你的工作优势测评系统现在可以供全世界的用户免费使用了！
