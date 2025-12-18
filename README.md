# 🔮 Vanish

> **A message, a secret.**

Vanish 是一款移动端优先的私密即时通讯 Web 应用。灵感来自对讲机 —— 一次性的秘密通道。

![Vanish](https://img.shields.io/badge/Vanish-Private%20Messaging-00FF00?style=for-the-badge&labelColor=000000)

## ✨ 特性

- 🔒 **端到端加密** - 基于 WebRTC P2P 通讯，消息不经过服务器
- 👻 **阅后即焚** - 每次只显示一条消息，新消息替换旧消息
- 🎯 **排他性连接** - 一个通讯码同一时间只能与一人建立通道
- 📱 **移动端优先** - 专为手机设计，单手可操作
- 🚀 **PWA 支持** - 可添加到主屏幕，像 App 一样运行
- 🌐 **无需注册** - 打开即用，无需任何账号

## 🎮 使用方式

1. 打开 Vanish，获得你的 **6 位通讯码**
2. 将通讯码分享给对方
3. 输入对方的通讯码，点击 **Connect**
4. **双方都完成连接后**，即可开始通讯
5. 发送消息（最多 100 字符）
6. 关闭页面 = 一切消失 ✨

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **通讯**: PeerJS (WebRTC)
- **部署**: Vercel / Netlify / 任意静态托管

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd vanish

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
```

## 📦 部署

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 点击 Deploy
4. 完成！🎉

```bash
# 或使用 Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. 将代码推送到 GitHub
2. 在 [Netlify](https://netlify.com) 导入项目
3. 构建命令: `npm run build`
4. 发布目录: `.next`
5. 完成！

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t vanish .
docker run -p 3000:3000 vanish
```

## 🔧 配置

### 环境变量（可选）

```env
# 自定义 PeerJS 服务器（可选，默认使用公共服务器）
NEXT_PUBLIC_PEER_HOST=your-peer-server.com
NEXT_PUBLIC_PEER_PORT=443
NEXT_PUBLIC_PEER_PATH=/peerjs
```

### 生成 PNG 图标（可选）

如需生成 PNG 格式的 PWA 图标：

```bash
npm install sharp
node scripts/generate-icons.js
```

## 📐 项目结构

```
vanish/
├── public/
│   ├── manifest.json      # PWA 配置
│   ├── icon.svg           # 应用图标
│   └── ...
├── src/
│   ├── app/
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 主页面
│   ├── components/
│   │   ├── EntryPage.tsx      # 进入页
│   │   ├── CommunicationPage.tsx  # 通讯页
│   │   ├── MessageDisplay.tsx # 消息显示
│   │   └── ...
│   ├── hooks/
│   │   └── usePeer.ts     # WebRTC 通讯逻辑
│   └── lib/
│       └── utils.ts       # 工具函数
└── ...
```

## 🔐 隐私说明

- ✅ 所有消息通过 WebRTC P2P 直接传输
- ✅ 服务器仅用于信令（建立连接）
- ✅ 不存储任何消息内容
- ✅ 不存储任何用户数据
- ✅ 不使用 Cookie 或本地存储
- ✅ 刷新/关闭页面 = 数据销毁

## 🎨 设计理念

- **极简** - 只保留必要功能
- **私密** - 消息用完即焚
- **即时** - 实时 P2P 通讯
- **移动优先** - 为手机而生
- **黑客美学** - Matrix 风格 UI

## 📝 License

MIT License

---

<p align="center">
  <strong>Vanish</strong> - A message, a secret.
</p>

