import {Hono} from 'hono'

type Bindings = {
    // 如果使用 Cloudflare 环境变量可在此定义
};

const app = new Hono<{ Bindings: Bindings }>();

// 错误处理中间件
app.onError((err, c) => {
    console.error(err);
    return c.text('Internal Server Error', 500);
});

// 响应头中间件
const setSecurityHeaders = async (c: any, next: any) => {
    await next();
    // c.header('Cache-Control', 'public, max-age=14400'); // 4 小时缓存
    // c.header('CDN-Cache-Control', 'public, max-age=86400'); // 24 小时 CDN 缓存
};


// 每日图片路由 ========================================================================================================
app.get('/', setSecurityHeaders, async (c) => {
    const imageUrl = await bing_cn(c);
    return results(c, imageUrl);
});

// 每日图片路由 ========================================================================================================
app.get('/bingimg', setSecurityHeaders, async (c) => {
    const imageUrl = await bing_cn(c);
    return results(c, imageUrl);
});
// 原神图片路由 ========================================================================================================
app.get('/genshin', setSecurityHeaders, async (c) => {
    const imageUrl = await genshin(c);
    console.log(imageUrl);
    return results(c, imageUrl, "image/webp");
});

// 响应图片结果 ========================================================================================================
async function results(c, url: string, sub: string = 'image/jpeg') {
    let images: string = <string>c.req.query('images')
    if (images != undefined && images != "") {
        if (images == "1")
            return c.text(url)
        if (images == "2")
            return c.redirect(url, 302)
    }
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) return c.text(`Image Fetch Error: ${imageResponse.status}`, 500);
    // 构建响应
    return new Response(imageResponse.body, {
        headers: {
            // 'Content-Type': imageResponse.headers.get('Content-Type') || sub,
            'Content-Type': sub,
            'Cache-Control': c.res.headers.get('Cache-Control') || '',
            'CDN-Cache-Control': c.res.headers.get('CDN-Cache-Control') || ''
        }
    });
}

// 处理传入参数 ========================================================================================================
async function parsers(c, num: number = 0) {
    let number: string = <string>c.req.query('number')
    let random: string = <string>c.req.query('random')
    if (random != undefined && random != "" && random != "0")
        return Math.floor(Math.random() * num) + 1;
    return Number(number) % num;
}

async function bing_cn(c) {
    try {
        // 请求 Bing API ===============================================================================
        const apiResponse = await fetch(
            'https://cn.bing.com/HPImageArchive.aspx?idx=' + await parsers(c, 7) + '&n=1');
        if (!apiResponse.ok) return c.text(`API Error: ${apiResponse.status}`, 500);
        // 解析 XML 数据 ===============================================================================
        const xmlData = await apiResponse.text();
        const urlMatch = xmlData.match(/<url>(.*?)<\/url>/is);
        if (!urlMatch?.[1]) return c.text('Image URL not found', 500);
        // 获取图片流 ==================================================================================
        return `https://cn.bing.com${urlMatch[1]}`;
    } catch (error) {
        console.error('[BING_ERROR]', error);
        return c.text('Failed to fetch daily image', 500);
    }
}

async function genshin(c) {
    // 生成随机数或使用指定值 ===========================================================================
    const targetNum = Math.floor(await parsers(c, 330)) + 1;
    // 格式化为三位数并拼接 URL =========================================================================
    return `https://oneapi.524228.xyz/img/yuanshenpic/image_${targetNum
        .toString()
        .padStart(3, '0')}.webp`;
}

export default app;