# 小游戏聚合平台

这是一个基于 React 和 Vite 构建的小游戏聚合平台，旨在提供各种各样的休闲小游戏，并部署在 Cloudflare 上。

## 项目结构

```
/
├── public/                  # 静态资源
│   ├── assets/              # 通用资源（图标、字体等）
│   └── images/              # 图片资源
├── src/                     # 源代码
│   ├── components/          # 通用组件
│   │   ├── Layout/          # 布局组件
│   │   ├── UI/              # UI组件
│   │   └── GameCard/        # 游戏卡片组件
│   ├── pages/               # 页面组件
│   │   ├── Home/            # 首页
│   │   ├── GameDetail/      # 游戏详情页
│   │   └── About/           # 关于页面
│   ├── games/               # 游戏目录（每个游戏一个文件夹）
│   │   ├── game1/           # 游戏1
│   │   │   ├── index.jsx    # 游戏主入口
│   │   │   ├── Game.jsx     # 游戏组件
│   │   │   ├── styles.css   # 游戏样式
│   │   │   └── assets/      # 游戏特定资源
│   │   └── game2/           # 游戏2（同样的结构）
│   ├── hooks/               # 自定义钩子
│   ├── utils/               # 工具函数
│   ├── styles/              # 全局样式
│   ├── App.jsx              # 应用主组件
│   ├── main.jsx             # 入口文件
│   └── routes.jsx           # 路由配置
├── functions/               # Cloudflare Workers函数
├── index.html               # HTML模板
├── vite.config.js           # Vite配置
├── wrangler.toml            # Cloudflare Wrangler配置
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 部署到 Cloudflare Pages

```bash
npm run deploy
```

## 添加新游戏

要添加新游戏，请按照以下步骤操作：

1. 在 `src/games` 目录下创建一个新的文件夹，命名为游戏的唯一标识符（例如 `snake-game`）
2. 在该文件夹中创建以下文件：
   - `index.jsx`：游戏的主入口组件
   - `style.css`：游戏的样式
   - 其他需要的组件和资源
3. 在 `src/utils/gameUtils.js` 中的 `gamesData` 数组中添加新游戏的信息

示例：

```javascript
// 在 gameUtils.js 中添加
{
  id: 'snake-game',
  title: '贪吃蛇',
  description: '经典的贪吃蛇游戏，通过键盘控制蛇的移动，吃到食物后会变长。',
  thumbnail: '/images/snake-game.jpg',
  category: '休闲',
  path: 'snake-game'
}
```

4. 在 `public/images` 目录下添加游戏的缩略图

## 技术栈

- React：前端框架
- React Router：路由管理
- Vite：构建工具
- Cloudflare Pages：部署平台

## 许可证

MIT
