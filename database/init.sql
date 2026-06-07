CREATE TABLE IF NOT EXISTS operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_by VARCHAR(80) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_valid (valid_from, valid_to),
  INDEX idx_pinned (is_pinned)
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('座位热力图可视化', '运营组', 'ready', '100%');

INSERT INTO announcements (title, content, is_pinned, valid_from, valid_to, status)
VALUES
('系统维护通知', '本周六凌晨2:00-4:00将进行系统维护，届时座位预约功能将暂停使用，请提前做好安排。', TRUE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'published'),
('端午节日安排', '端午节期间自习室正常开放，开放时间调整为8:00-22:00，祝大家节日快乐！', FALSE, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'published'),
('静音区新规实施', '为营造更好的学习环境，自即日起静音区禁止食用任何食物，违规者将被扣除积分。', TRUE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'published'),
('新用户注册优惠', '新用户注册即送3小时免费学习时长，邀请好友再得5小时，活动截至本月底。', FALSE, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'published');

