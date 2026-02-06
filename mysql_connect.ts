import mysql from 'mysql2/promise'; // MySQL 异步客户端
import CONFIG from './config.json' with { type: 'json' };
import {User} from "./type.js";

// 从 MySQL 数据库获取账号列表
export async function getAccountsFromDB() {
    let connection;
    try {
        // 建立数据库连接
        connection = await mysql.createConnection(CONFIG.DB_CONFIG);

        // 查询启用状态的账号（可根据需求添加过滤条件）
        const [rows] = await connection.execute(
            'SELECT email, passwd,random_start_time,random_end_time  FROM neworld_auto_login_user_table WHERE delete_flag = 0'
        );

        return rows as User[];
    } catch (error) {
        console.error('数据库查询失败:', error);
        return [];
    } finally {
        // 确保连接关闭
        if (connection) {
            await connection.end();
        }
    }
}

