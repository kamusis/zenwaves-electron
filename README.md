# Zen Waves

A dynamic wallpaper application that combines wave animations with Chinese poetry, creating a zen-like desktop wallpaper experience.

## Project Attribution

This project is a standalone Electron application evolved from [utools-wallpaper](https://github.com/junruchen/utools-wallpaper), initially forked and modified by [kamusis](https://github.com/kamusis/utools-wallpaper). While the original was a uTools extension, Zen Waves has been completely rebuilt as an independent desktop application using Electron, introducing new features and improvements for a more immersive desktop experience.

## Features

- 🌊 Dynamic wave animation with P5.js
- 📝 Integration with Chinese poetry API
- 🎨 Customizable wave colors and themes
- ✍️ Customizable font
- 🕒 Automatic wallpaper changes at set intervals
- 🖥️ Cross-platform support (Windows, macOS, Linux)
- 🌓 Light/Dark mode support

## Tech Stack

- **Framework**: Vue 3 + Vite
- **Desktop**: Electron 35.0
- **Animation**: P5.js
- **State Management**: Electron Store
- **Build Tools**: Vite + TypeScript
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/kamusis/zenwaves-electron.git

# Navigate to project directory
cd zenwaves-electron

# Install dependencies
npm install

# Start the application in development mode
npm start
```

### Development Scripts

- `npm start` - Start the application in development mode
- `npm run dev` - Start Vite development server
- `npm run build` - Build the application
- `npm run preview` - Preview the built application
- `npm run electron` - Start Electron process

## Project Structure

See [init-works.md](./init-works.md) for detailed project structure.

## Platform-Specific Features

### Windows
- Uses custom C# script for wallpaper setting
- Supports both light and dark themes

### macOS
- Uses AppleScript for wallpaper setting
- Native system integration

### Linux
- Supports GNOME and KDE desktop environments
- Uses respective desktop environment commands for wallpaper setting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<h2 id="chinese-readme">中文说明</h2>

Zen Waves 是一款将动态波浪动画与中国诗词相结合的壁纸应用，为您的桌面带来禅意体验。

### 主要特性

- 🌊 基于 P5.js 的动态波浪动画
- 📝 集成今日诗词 API
- 🎨 可自定义波浪颜色和主题
- 🕒 支持定时自动更换壁纸
- ✍️ 可更换字体
- 🖥️ 跨平台支持（Windows、macOS、Linux）
- 🌓 支持浅色/深色主题

### 快速开始

1. 确保已安装最新版本的 Node.js
2. 克隆项目并安装依赖：
   ```bash
   git clone https://github.com/yourusername/zenwaves-electron.git
   cd zenwaves-electron
   npm install
   ```
3. 启动应用：
   ```bash
   npm start
   ```

### 开发相关

详细的项目结构和技术文档请参考 [init-works.md](./init-works.md)。

如需参与项目开发，请查看上方英文版本的 Contributing 部分。
