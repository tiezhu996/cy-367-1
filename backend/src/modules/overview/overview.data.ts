const today = new Date().toISOString().split("T")[0];
const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const subDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};

export const overviewData = {
  "appName": "自习室智能运营系统",
  "appCode": "ldstudyroom",
  "description": "面向付费自习室/共享自习空间，提供座位预约、环境监测和学习社区功能的智能化运营平台。",
  "features": [
    {
      "id": 1,
      "title": "座位热力图可视化",
      "description": "以楼层平面图形式展示所有座位状态（空闲/已约/使用中/不可用），支持按区域（静音区/讨论区/窗景区）筛选，点击座位查看详情。",
      "status": "已上线",
      "metric": "88%"
    },
    {
      "id": 2,
      "title": "按小时预约与选座",
      "description": "用户选择日期和时段（最小单位1小时），在座位图上点选心仪座位，系统自动检测时段冲突，预约成功后生成二维码。",
      "status": "排期中",
      "metric": "31 单"
    },
    {
      "id": 3,
      "title": "学习时长排行与成就徽章",
      "description": "记录用户累计学习时长，生成日/周/月排行榜，设置成就徽章（如连续7天打卡、学习100小时），增强学习动力。",
      "status": "巡检中",
      "metric": "10 项"
    },
    {
      "id": 4,
      "title": "静音区/讨论区分区管理",
      "description": "将自习室划分为静音区和讨论区，不同区域适用不同规则（静音区禁止交谈），预约时明确标注区域类型。",
      "status": "优化中",
      "metric": "4 级"
    },
    {
      "id": 5,
      "title": "违约黑名单与公告",
      "description": "用户预约后未签到或提前离场超过一定次数记入黑名单，限制预约权限；管理员可发布系统公告和活动通知，首页轮播展示。",
      "status": "可导出",
      "metric": "28 条"
    }
  ],
  "kpis": [
    {
      "label": "今日处理",
      "value": "108",
      "trend": "+12%",
      "tone": "primary"
    },
    {
      "label": "预约/订单",
      "value": "46",
      "trend": "+8%",
      "tone": "warm"
    },
    {
      "label": "履约率",
      "value": "90%",
      "trend": "+3%",
      "tone": "cool"
    },
    {
      "label": "待处理",
      "value": "5",
      "trend": "需跟进",
      "tone": "neutral"
    }
  ],
  "records": [
    {
      "key": "ldstudyroom-1",
      "name": "座位热力图可视化",
      "owner": "运营组",
      "status": "已上线",
      "metric": "88%",
      "priority": "高"
    },
    {
      "key": "ldstudyroom-2",
      "name": "按小时预约与选座",
      "owner": "管理员",
      "status": "排期中",
      "metric": "31 单",
      "priority": "中"
    },
    {
      "key": "ldstudyroom-3",
      "name": "学习时长排行与成就徽章",
      "owner": "服务台",
      "status": "巡检中",
      "metric": "10 项",
      "priority": "低"
    },
    {
      "key": "ldstudyroom-4",
      "name": "静音区/讨论区分区管理",
      "owner": "财务组",
      "status": "优化中",
      "metric": "4 级",
      "priority": "高"
    },
    {
      "key": "ldstudyroom-5",
      "name": "违约黑名单与公告",
      "owner": "审核组",
      "status": "可导出",
      "metric": "28 条",
      "priority": "中"
    }
  ],
  "announcements": [
    {
      "id": 1,
      "title": "系统维护通知",
      "content": "本周六凌晨2:00-4:00将进行系统维护，届时座位预约功能将暂停使用，请提前做好安排。",
      "isPinned": true,
      "validFrom": today,
      "validTo": addDays(today, 7),
      "status": "published",
      "createdBy": "admin",
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString()
    },
    {
      "id": 2,
      "title": "端午节日安排",
      "content": "端午节期间自习室正常开放，开放时间调整为8:00-22:00，祝大家节日快乐！",
      "isPinned": false,
      "validFrom": subDays(today, 2),
      "validTo": addDays(today, 5),
      "status": "published",
      "createdBy": "admin",
      "createdAt": new Date(subDays(today, 2)).toISOString(),
      "updatedAt": new Date(subDays(today, 2)).toISOString()
    },
    {
      "id": 3,
      "title": "静音区新规实施",
      "content": "为营造更好的学习环境，自即日起静音区禁止食用任何食物，违规者将被扣除积分。",
      "isPinned": true,
      "validFrom": subDays(today, 1),
      "validTo": addDays(today, 30),
      "status": "published",
      "createdBy": "admin",
      "createdAt": new Date(subDays(today, 1)).toISOString(),
      "updatedAt": new Date(subDays(today, 1)).toISOString()
    },
    {
      "id": 4,
      "title": "新用户注册优惠",
      "content": "新用户注册即送3小时免费学习时长，邀请好友再得5小时，活动截至本月底。",
      "isPinned": false,
      "validFrom": today,
      "validTo": addDays(today, 14),
      "status": "published",
      "createdBy": "admin",
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString()
    }
  ]
};
