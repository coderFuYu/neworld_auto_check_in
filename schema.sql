-- 创建用户表
CREATE TABLE `neworld_auto_login_user_table` (
  `email` varchar(255) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `random_start_time` varchar(8) DEFAULT NULL,
  `random_end_time` varchar(8) DEFAULT NULL,
  `delete_flag` tinyint(4) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 查看表结构
DESCRIBE `neworld_auto_login_user_table`;
