# DiaGen - Train Schedule Generator (POC)

[![Build Project](https://github.com/jules/dia-gen/actions/workflows/build.yml/badge.svg)](https://github.com/jules/dia-gen/actions/workflows/build.yml)
[![Deploy to GitHub Pages](https://github.com/jules/dia-gen/actions/workflows/deploy.yml/badge.svg)](https://github.com/jules/dia-gen/actions/workflows/deploy.yml)

> **⚠️ Disclaimer**: This is a **verification-only project** (验证性项目). All data displayed, including station names, train numbers, and schedules, is **entirely fictional and for demonstration purposes only**.

DiaGen is a modern train schedule (Dia) generator dashboard POC. It allows users to configure train districts, numbers, types, and detailed station schedules with a focus on the strict visual aesthetics of Japanese driver timetables.

## ✨ Features

- **Professional Timetable Layout**: Faithfully reproduces Japanese train schedule aesthetics, including:
  - Strict black grid borders.
  - Highlighted major stations.
  - Split arrival/departure time displays.
  - Marker support (Triangles, Reverse Triangles).
  - Track number indicators.
- **Dynamic Configuration**: Easily update train metadata (District, Number, Type, Destination) and station entries via a functional sidebar.
- **Modern Tech Stack**: Built with React 19, TypeScript, and Tailwind CSS v4.
- **High Performance**: Powered by Bun and Vite for lightning-fast development and builds.
- **CI/CD Ready**: Automated build and deployment workflows via GitHub Actions.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Vite 6+](https://vitejs.dev/)
- **Runtime**: [Bun](https://bun.sh/)
- **Compiler**: [tsgo](https://github.com/typescript/native-preview) (via `@typescript/native-preview`)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dia-gen.git
cd dia-gen

# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun run dev
```

### Build

```bash
# Compile and build for production
bun run build
```

## 📦 Deployment

This project is configured for automated deployment to **GitHub Pages**.

1. Go to your repository settings on GitHub.
2. Navigate to **Pages**.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Select the `gh-pages` branch and the `/ (root)` folder.

The workflow in `.github/workflows/deploy.yml` supports multi-branch deployment:
- Pushes to `main` or `master` are deployed to the root.
- Pushes to other branches are deployed to a subdirectory named after the branch (e.g., `your-url/branch-name/`).

## 📝 Project Structure

- `src/App.tsx`: Main dashboard and timetable visualization logic.
- `src/index.css`: Tailwind CSS v4 styling and theme configuration.
- `.github/workflows/`: CI/CD pipeline definitions.
- `package.json`: Project dependencies and scripts.

---

# DiaGen - 列车时刻表生成器 (POC)

> **⚠️ 免责声明**: 本项目纯属 **验证性项目**。其中展示的所有数据（包括但不限于车站名称、列车车次、运行时刻等）均为 **纯编造数据**，仅用于功能演示。

DiaGen 是一款现代列车时刻表 (Dia) 生成器仪表盘 POC。它允许用户配置列车运行区段、车次、种别及详细的车站时刻，重点还原日本列车驾驶员时刻表的严格视觉美学。

## ✨ 功能特性

- **专业时刻表布局**: 忠实还原日本列车时刻表美学，包括：
  - 严格的黑色网格边框。
  - 重点车站高亮。
  - 到发时间分割显示。
  - 符号支持（正三角、倒三角）。
  - 股道编号指示。
- **动态配置**: 通过功能侧边栏轻松更新列车元数据（运行区段、车次、种别、行先）及车站条目。
- **现代技术栈**: 基于 React 19, TypeScript 和 Tailwind CSS v4 构建。
- **高性能**: 由 Bun 和 Vite 提供支持，实现极速开发和构建。
- **持续集成/部署**: 通过 GitHub Actions 实现自动化构建和部署。

## 🛠 技术栈

- **框架**: [React 19](https://react.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **构建工具**: [Vite 6+](https://vitejs.dev/)
- **运行环境**: [Bun](https://bun.sh/)
- **编译器**: [tsgo](https://github.com/typescript/native-preview) (通过 `@typescript/native-preview`)

## 🚀 快速入门

### 前置条件

- 机器上已安装 [Bun](https://bun.sh/)。

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/dia-gen.git
cd dia-gen

# 安装依赖
bun install
```

### 开发环境

```bash
# 启动开发服务器
bun run dev
```

### 构建

```bash
# 编译并构建生产版本
bun run build
```

## 📦 部署

本项目已配置 **GitHub Pages** 自动化部署。

1. 进入 GitHub 仓库设置 (Settings)。
2. 导航至 **Pages**。
3. 在 **Build and deployment > Source** 下，选择 **Deploy from a branch**。
4. 选择 `gh-pages` 分支和 `/ (root)` 文件夹。

`.github/workflows/deploy.yml` 中的工作流支持多分支部署：
- 推送到 `main` 或 `master` 分支将部署到根目录。
- 推送到其他分支将部署到以分支命名的子目录中（例如：`your-url/branch-name/`）。
