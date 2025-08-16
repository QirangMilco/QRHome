# 个人导航页

一个功能完整、现代化的个人导航页面应用，使用 Next.js + React + Tailwind CSS 构建。

## 🚀 功能特性

### 核心功能
- **网站管理**：添加、编辑、删除网站链接，支持多URL切换
- **分组管理**：创建分组，支持折叠/展开，拖拽排序
- **搜索功能**：实时搜索网站和描述内容
- **密码认证**：保护您的导航页面，支持"记住我"功能
- **数据管理**：支持JSON格式的导入/导出和一键重置

### 设计特色
- **现代设计**：采用玻璃拟态效果和渐变色彩
- **响应式布局**：完美适配桌面和移动设备
- **主题定制**：支持深色/浅色模式切换
- **动画效果**：流畅的过渡动画和悬停效果
- **布局选择**：网格和列表两种显示模式

### 技术亮点
- **纯静态部署**：支持 GitHub Pages、Vercel、Netlify
- **本地存储**：使用 localStorage 实现数据持久化
- **TypeScript**：完整的类型安全支持
- **组件化**：清晰的模块化架构

## 📦 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd navigation-dashboard
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **打开浏览器**
访问 [http://localhost:3000](http://localhost:3000)

## 🔧 项目配置

### 构建生产版本
```bash
npm run build
```

### 静态导出（用于部署）
```bash
npm run build
```
构建完成后，`out` 文件夹包含所有静态文件。

## 🌐 部署指南

### Vercel 部署
1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify 部署
1. 运行 `npm run build`
2. 将 `out` 文件夹拖拽到 Netlify
3. 或连接 GitHub 仓库自动部署

### GitHub Pages 部署
1. 在 GitHub Settings 中启用 Pages
2. 选择 GitHub Actions 作为源
3. 使用提供的工作流文件

## 📁 项目结构

```
├── app/                    # Next.js 应用目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面组件
├── components/            # React 组件
│   ├── auth/              # 认证相关组件
│   ├── forms/             # 表单组件
│   ├── layout/            # 布局组件
│   ├── navigation/        # 导航组件
│   ├── settings/          # 设置面板组件
│   └── ui/                # UI 基础组件
├── hooks/                 # 自定义 React Hooks
├── lib/                   # 工具函数和类型定义
│   ├── auth.ts            # 认证服务
│   ├── storage.ts         # 本地存储服务
│   ├── types.ts           # TypeScript 类型定义
│   └── utils.ts           # 工具函数
├── public/                # 静态资源
└── README.md              # 项目说明
```

## 🎨 使用说明

### 首次使用
1. **设置密码**：首次访问需要设置管理密码
2. **添加网站**：点击"添加网站"开始添加您的常用网站
3. **创建分组**：使用"创建分组"功能组织您的网站

### 网站管理
- **添加网站**：填写网站名称、URL、图标、描述等信息
- **多URL支持**：每个网站可配置多个URL，方便切换
- **编辑网站**：悬停在网站卡片上显示编辑选项
- **删除网站**：在编辑菜单中选择删除

### 分组功能
- **创建分组**：设置分组名称和颜色
- **分组管理**：支持折叠/展开，编辑分组信息
- **网站分类**：在添加/编辑网站时选择所属分组

### 搜索功能
- **实时搜索**：在顶部搜索框中输入关键词
- **多字段搜索**：搜索网站名称、描述、URL等内容
- **高亮显示**：搜索结果会高亮显示匹配内容

### 设置面板
- **外观设置**：更改主题、颜色、背景样式
- **布局设置**：切换网格/列表模式，调整列数
- **数据管理**：导出/导入配置，重置数据

### 数据备份
- **导出数据**：设置面板中点击"导出配置"下载JSON文件
- **导入数据**：粘贴JSON数据并点击"导入配置"
- **跨设备同步**：通过导入/导出实现多设备数据同步

## 🛠️ 开发说明

### 技术栈
- **框架**：Next.js 13 (App Router)
- **UI库**：React + Tailwind CSS
- **组件库**：shadcn/ui
- **图标**：Lucide React
- **类型检查**：TypeScript
- **状态管理**：React Hooks + localStorage

### 核心 Hooks
- `useAuth`：用户认证状态管理
- `useWebsites`：网站数据管理
- `useConfig`：应用配置管理

### 数据存储
所有数据存储在浏览器的 localStorage 中：
- `nav-websites`：网站数据
- `nav-groups`：分组数据
- `nav-config`：应用配置
- `nav-auth`：认证信息

### 安全特性
- **密码保护**：使用 SHA-256 加密存储密码
- **会话管理**：支持"记住我"功能，24小时会话有效期
- **本地存储**：所有数据仅存储在用户本地，无服务器依赖

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Lucide](https://lucide.dev/) - 图标库

---

如果这个项目对您有帮助，请给个 ⭐️ Star！