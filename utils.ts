import dayjs from 'dayjs';

/**
 * 在指定时间段内生成随机时间（支持纯时间字符串，默认当天）
 * @param {string} startTime - 开始时间（如 '08:00' 或 '2024-05-01 08:00'）
 * @param {string} endTime - 结束时间（如 '10:00' 或 '2024-05-01 10:00'）
 * @returns {dayjs.Dayjs} 随机时间
 */
export function generateRandomTime(startTime:string, endTime:string) {
    // 解析时间：若为纯时间字符串（不含日期），自动拼接当天日期
    const parseTime = (time: string) => {
        const timeStr = time;
        // 判断是否为纯时间格式（如 '08:00' 或 '09:30:15'）
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
            return dayjs().format('YYYY-MM-DD') + ' ' + timeStr;
        }
        return time; // 其他格式（含日期）直接返回
    };

    // 转换为 dayjs 对象并验证
    const start = dayjs(parseTime(startTime));
    const end = dayjs(parseTime(endTime));

    if (!start.isValid() || !end.isValid()) {
        throw new Error('无效的时间格式，请使用 "HH:mm"、"HH:mm:ss" 或完整日期时间');
    }
    if (start.isAfter(end)) {
        throw new Error('开始时间不能晚于结束时间');
    }

    // 生成随机时间戳并转换为 dayjs 对象
    const startTimestamp = start.valueOf();
    const endTimestamp = end.valueOf();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);

    return dayjs(randomTimestamp);
}

console.log(generateRandomTime('08:00', '10:00').format('YYYY-MM-DD HH:mm:ss'));