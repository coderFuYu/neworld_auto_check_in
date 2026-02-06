# Neworld Auto Login - TypeScript 项目

自动签到系统,支持定时任务和随机时间签到。

## 技术栈

- TypeScript 5.9.3
- Node.js ES Module
- Puppeteer (浏览器自动化)
- MySQL2 (数据库连接)
- Node-Schedule (定时任务)

## 环境准备

1. 确保已安装 Node.js (推荐 v18 或更高版本)
2. 安装项目依赖:
   ```bash
   npm install
   # 或
   yarn install
   ```

## 启动方式

### 开发模式 (推荐用于开发调试)

直接运行 TypeScript 源代码,无需编译:

```bash
npm run dev
```

**特点:**
- 即时运行,无需等待编译
- 支持快速迭代开发
- 使用 tsx 工具直接执行 TypeScript

### 生产模式 (推荐用于正式部署)

先编译后运行,性能更优:

```bash
# 1. 编译 TypeScript 为 JavaScript
npm run build

# 2. 运行编译后的代码
npm start
```

**特点:**
- 启动速度更快
- 运行时无额外编译开销
- 适合长期运行的生产环境

## 可用脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式启动,直接运行 TS 文件 |
| `npm run build` | 编译 TypeScript 到 dist 目录 |
| `npm start` | 生产模式启动,运行编译后的 JS 文件 |

## 项目结构

```
.
├── auto_login.ts         # 自动登录和签到逻辑
├── config.json          # 数据库配置文件
├── index.ts             # 主入口文件
├── mysql_connect.ts     # MySQL 数据库连接
├── utils.ts             # 工具函数
├── type.d.ts            # TypeScript 类型定义
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目依赖配置
└── dist/                # 编译输出目录 (执行 build 后生成)
```

## 配置说明

### 数据库配置

在 `config.json` 中配置 MySQL 数据库连接信息:

```json
{
  "DB_CONFIG": {
    "host": "localhost",
    "user": "your_user",
    "password": "your_password",
    "database": "your_database"
  }
}
```

### TypeScript 配置

项目使用 ES Module 模式,已在 `tsconfig.json` 中配置:
- 编译目标: ES2022
- 模块系统: NodeNext
- 输出目录: dist/
- 启用严格类型检查
- 支持 JSON 模块导入

## 注意事项

1. **首次运行前**:确保已正确配置数据库连接信息
2. **依赖安装**:确保 node_modules 目录完整
3. **Puppeteer**: 首次安装时会自动下载 Chromium 浏览器,需要网络连接
4. **数据库表**: 确保数据库中存在 `neworld_auto_login_user_table` 表,且包含账号数据

## 常见问题

### Q: 如何切换 headless 模式?
A: 在 `auto_login.ts` 文件中修改 `headless: false` 为 `headless: true`

### Q: 编译失败怎么办?
A: 检查 TypeScript 语法错误,确保所有导入路径正确(需要包含 .js 扩展名)

### Q: 数据库连接失败?
A: 检查 `config.json` 中的数据库配置是否正确,确保数据库服务已启动

## 后续优化建议

- [ ] 添加文件监听和自动重启 (使用 nodemon)
- [ ] 配置进程管理工具 (如 PM2)
- [ ] 添加日志持久化
- [ ] 添加错误重启机制
- [ ] 配置健康检查接口
