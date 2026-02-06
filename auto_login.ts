import puppeteer from 'puppeteer';

export async function autoSignInAndCheckIn(email: string, password: string) {
    console.log('当前时间:' + new Date())
    console.log('当前签到账号：' + email)
    // 启动浏览器（headless: false 可以看到浏览器操作过程）
    const browser = await puppeteer.launch({
        args: ['--disable-cache',
            '--no-sandbox', // 禁用沙箱（root 用户必备）
            '--disable-setuid-sandbox', // 辅助禁用 setuid 沙箱，提升兼容性
            '--disable-dev-shm-usage', // 解决 Linux 下 /dev/shm 空间不足的问题（可选，推荐添加）
            '--no-zygote' // 禁用 zygote 进程，进一步提升 root 环境兼容性（可选）
        ], // 禁用缓存
        headless: true,
        defaultViewport: {width: 1280, height: 720}
    });

    try {
        // 创建新页面
        const page = await browser.newPage();

        // 1. 导航到登录页面
        await page.goto('https://neworld.cloud/auth/login', {
            waitUntil: 'networkidle2' // 等待网络稳定
        });

        // 2. 输入账号密码（根据实际表单选择器修改）
        await page.locator('input[id="email"]').fill(email);
        await page.locator('input[id="passwd"]').fill(password);

        // 3. 点击登录按钮（根据实际按钮选择器修改）
        await Promise.all([
            page.click('button[type="submit"]'), // 点击登录
            page.waitForNavigation({waitUntil: 'networkidle2'}) // 等待页面跳转
        ]);

        // 4. 导航到签到页面（如果登录后不是直接到签到页）（不需要，已自动跳转）
        // await page.goto('https://neworld.cloud/user', {
        //     waitUntil: 'networkidle2'
        // });

        // 5. 执行签到操作（根据实际签到按钮选择器修改）
        try {
            // 等待签到按钮出现
            await page.waitForSelector('button[id="check-in"]', {timeout: 10000});

            // 获取按钮文本或属性,判断是否已签到
            const buttonElement = await page.$('button[id="check-in"]');
            if (!buttonElement) {
                console.log('未找到签到按钮');
                return;
            }

            // 获取按钮文本内容
            const buttonText = await buttonElement.evaluate(el => el.textContent || '');
            console.log(`签到按钮当前状态: ${buttonText.trim()}`);

            // 判断是否已签到（根据实际按钮文本调整）
            if (buttonText.includes('已签到') || buttonText.includes('signed') || buttonText.includes('checked')) {
                console.log('今日已签到,无需重复签到');
                return;
            }

            // 点击签到按钮
            console.log('开始执行签到操作...');
            await buttonElement.click();

            // 等待签到响应（设置合理的超时时间）
            try {
                await page.waitForResponse(
                    response => {
                        const url = response.url();
                        // 根据实际签到接口调整判断条件
                        return url.includes('checkin') || url.includes('check-in') || url.includes('sign');
                    },
                    {timeout: 10000}
                );
                console.log('签到成功！');
            } catch (waitError) {
                // 如果等待响应超时,检查按钮状态变化来判断是否成功
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待页面更新
                const newButtonText = await buttonElement.evaluate(el => el.textContent || '');
                if (newButtonText.includes('已签到') || newButtonText.includes('signed')) {
                    console.log('签到成功！（通过按钮状态判断）');
                } else {
                    console.log('签到状态不明确,请手动检查');
                }
            }
        } catch (error: any) {
            console.log('签到过程出错:', error.message);
            console.log('今日可能已签到或签到按钮未找到');
        }

    } catch (error: any) {
        console.error('操作出错:', error.message);
    } finally {
        // 关闭浏览器
        await browser.close();
        console.log('\n\n')
    }
}
