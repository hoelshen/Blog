#

## 安装

patch-package 是一个用于修补 npm 依赖包的工具，允许开发者在不需要等待官方修复或创建分支的情况下，快速应用必要的修补。以下是 patch-package 的主要功能和使用方法：
主要功能
即时修补：允许开发者立即修复 npm 依赖包中的问题，而无需等待官方的修复或合并请求。
自动应用：修补文件会在每次运行 npm install 或 yarn install 时自动应用，确保所有环境中的一致性。
版本控制：修补文件可以提交到版本控制系统中，方便团队共享修补。

```bash
npm install patch-package --save-dev
# 或者使用 Yarn
yarn add patch-package postinstall-postinstall --dev
```

## 创建修复文件

```bash
npx patch-package package-name
# 或者使用 Yarn
yarn patch-package package-name
```

## 运行

添加 postinstall 脚本：
在 package.json 中添加一个 postinstall 脚本，以确保每次安装依赖时自动应用修补：

```json
"scripts": {
  "postinstall": "patch-package"
}
```

示例
假设你需要修补 react-redux 包中的一个问题：
修改 node_modules/react-redux/dist/react-redux.js 文件。
运行以下命令创建修补文件：

```bash
npx patch-package react-redux
```

提交生成的修补文件：

```bash
git add patches/react-redux+0.44.0.patch
git commit -m "Fix issue in react-redux"
```
