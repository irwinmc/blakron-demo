# Blakron Integration Demo

Blakron 引擎的交互式功能展示项目，覆盖 Core、Game、UI 和 EXML 四大模块的完整示例。

## 快速开始

```bash
# 安装依赖（workspace 根目录）
pnpm install

# 启动开发服务器
cd demo && pnpm dev

# 生产构建
pnpm build
```

开发服务器默认启动在 `http://localhost:3000`。

## 项目结构

```
demo/
├── index.html              # 入口 HTML（640×1136 手机比例）
├── vite.config.ts          # Vite 构建配置
├── tsconfig.json           # TypeScript 配置
└── src/
    ├── Main.ts             # 应用入口，创建 Player 并启动导航
    ├── Navigator.ts        # 页面栈路由（push/pop）
    ├── pages/
    │   ├── common.ts       # 共享 UI 组件（标题栏、内容区、菜单卡片）
    │   ├── MainMenu.ts     # 首页 — 四大分类入口
    │   ├── CoreMenu.ts     # Core 模块 — Shapes、Graphics、TextField、Events、ImageLoading
    │   ├── GameMenu.ts     # Game 模块 — BasicTween、ChainedTween、EaseShowcase、MovieClip、Orbit
    │   ├── UITestsMenu.ts  # UI 入口 — 4 个分组子页面
    │   ├── EXMLMenu.ts     # EXML — 运行时编译与实时预览
    │   └── ui-tests/
    │       ├── shared.ts           # 共享工具（makePage、sectionGroup）
    │       ├── DisplayWidgets.ts   # Labels、Rects、Image、Animation
    │       ├── Controls.ts         # Buttons、CheckBoxes、RadioButtons、ToggleSwitch
    │       ├── Inputs.ts           # ProgressBar、HSlider/VSlider、TextInput
    │       └── Containers.ts       # Panel、ViewStack、Scroller、List+VirtualLayout
    ├── scenes/             # 旧版独立场景（保留兼容）
    └── exml/               # EXML 编译器（AST、Codegen、Parser）
```

## 功能覆盖

| 分类 | 包含内容 |
|------|---------|
| **Core** | Shape 图元、Graphics & Bitmap、TextField 样式/描边、滤镜（Blur/Glow/ColorMatrix）、事件交互、图片加载 |
| **Game** | Basic Tween、Chained Tween、Ease 函数对比（5种）、MovieClip 帧动画、Orbit 旋转动画 |
| **UI - Display** | Label（各种样式）、Rect、Image、Tween 脉冲动画 |
| **UI - Controls** | Button、CheckBox、RadioButton、ToggleSwitch |
| **UI - Inputs** | ProgressBar（LTR/BTT）、HSlider/VSlider、EditableText（含 password 模式） |
| **UI - Containers** | Panel、ViewStack、Scroller、List + VirtualLayout |
| **EXML** | Button Skin、Card Panel、CheckBox Skin、Legacy Style、All Examples 实时编译预览 |

## 技术栈

- **引擎**：`@blakron/core` + `@blakron/game` + `@blakron/ui`
- **构建**：Vite（ESM + HMR）
- **语言**：TypeScript（strict mode，ES2022）
- **包管理**：pnpm workspace
