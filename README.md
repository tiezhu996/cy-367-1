# 自习室智能运营系统

面向付费自习室/共享自习空间，提供座位预约、环境监测和学习社区功能的智能化运营平台。

## Docker Compose 快速启动

首次启动前复制环境变量文件：

```bash
cp .env.example .env
docker compose up -d
```

访问地址：

- 前端：http://localhost:28507
- 后端健康检查：http://localhost:29507/health
- API 示例：http://localhost:28507/api/overview

## 项目主要功能

- 座位热力图可视化：以楼层平面图形式展示所有座位状态（空闲/已约/使用中/不可用），支持按区域（静音区/讨论区/窗景区）筛选，点击座位查看详情。
- 按小时预约与选座：用户选择日期和时段（最小单位1小时），在座位图上点选心仪座位，系统自动检测时段冲突，预约成功后生成二维码。
- 学习时长排行与成就徽章：记录用户累计学习时长，生成日/周/月排行榜，设置成就徽章（如连续7天打卡、学习100小时），增强学习动力。
- 静音区/讨论区分区管理：将自习室划分为静音区和讨论区，不同区域适用不同规则（静音区禁止交谈），预约时明确标注区域类型。
- 违约黑名单与公告：用户预约后未签到或提前离场超过一定次数记入黑名单，限制预约权限；管理员可发布系统公告和活动通知，首页轮播展示。

## 本地开发方式

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
npm install
npm run dev
```

## 技术栈

| 分层 | 技术 |
| --- | --- |
| 前端 | React 18 + TypeScript、Tailwind CSS、Vite |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | MySQL 8.0 |
| 认证 | JWT |
| 依赖 | Sequelize、bcryptjs |

## 项目目录结构

```text
.
├── backend/              # 后端服务
├── database/             # 数据库脚本
├── frontend/             # 前端应用
├── docker-compose.yml    # 一键部署编排
├── .env.example          # 环境变量示例
└── README.md
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| COMPOSE_PROJECT_NAME | Compose 项目名，避免中文目录名导致项目名为空 | ldstudyroom |
| DB_NAME | 数据库名称 | app |
| DB_USER | 数据库用户 | app |
| DB_PASSWORD | 数据库密码 | app_pwd |
| DB_ROOT_PASSWORD | 数据库 root 密码 | root_pwd |
| JWT_SECRET | JWT 签名密钥 | change_me_to_a_long_random_string |
| FRONTEND_PORT | 前端宿主机端口 | 28507 |
| BACKEND_PORT | 后端宿主机端口 | 29507 |
| DB_PORT | 数据库宿主机端口 | 3306 |

## Docker 部署说明

- 使用 `docker compose up -d` 启动，不需要额外传入 `-p`。
- `docker-compose.yml` 顶层已声明 `name: ldstudyroom`，并且 `.env` 包含 `COMPOSE_PROJECT_NAME=ldstudyroom`，可在中文目录名下启动。
- 数据库数据保存在命名卷 `db_data` 中，不依赖当前目录名。
- 前端容器由 Nginx 托管静态资源，并把 `/api/` 反向代理到 `backend:29507`。
- 若本地端口冲突，可修改 `.env` 中的 `FRONTEND_PORT`、`BACKEND_PORT`、`DB_PORT`。

常用命令：

```bash
docker compose config --quiet
docker compose ps
docker compose down
```

## License

MIT
