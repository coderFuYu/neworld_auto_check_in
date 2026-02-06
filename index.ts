import schedule from "node-schedule"
import {getAccountsFromDB} from './mysql_connect.js';
import {generateRandomTime} from './utils.js'
import {autoSignInAndCheckIn} from './auto_login.js'
import {User} from "./type.js";

// 为每个账号安排随机时间签到
async function scheduleCheckInForAccounts(accounts: User[]) {
    accounts.forEach(account => {
        const targetTime = generateRandomTime(account.random_start_time || '00:00', account.random_end_time || '20:00');
        const delay = targetTime.valueOf() - new Date().getTime();
        if (delay > 0) {
            console.log(`[${new Date()}] 已安排 ${account.email} 在 ${targetTime.format('HH:mm:ss')} 执行签到`);
            // 使用 setTimeout 延迟执行
            setTimeout(() => {
                autoSignInAndCheckIn(account.email, account.passwd);
            }, delay);
        } else {
            // 若随机时间已过（极少情况），立即执行
            autoSignInAndCheckIn(account.email, account.passwd);
        }
    });
}

// 每日任务入口
async function dailyTask() {
    console.log(`[${new Date()}] 开始执行每日签到任务`);
    const accounts = await getAccountsFromDB();
    if (accounts.length === 0) {
        console.log('未找到需要签到的账号');
        return;
    }
    await scheduleCheckInForAccounts(accounts);
}

// 设置定时任务：每天零点执行
const job = schedule.scheduleJob('0 0 0 * * *', dailyTask);

console.log('自动签到定时任务已启动，将在每天00:00获取账号并安排随机时间签到');