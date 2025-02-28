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
    c.header('Cache-Control', 'public, max-age=14400'); // 4 小时缓存
    c.header('CDN-Cache-Control', 'public, max-age=86400'); // 24 小时 CDN 缓存
};


// 每日图片路由
app.get('/', setSecurityHeaders, async (c) => {
    const imageUrl = await bing_daily_img_url(c);
    return response_image_now(c, imageUrl);
});

// 每日图片路由
app.get('/bing-daily-img', setSecurityHeaders, async (c) => {
    const imageUrl = await bing_daily_img_url(c);
    return response_image_now(c, imageUrl);
});
app.get('/genshin-impact', setSecurityHeaders, async (c) => {
    const imageUrl = await genshin_impact_num(c);
    console.log(imageUrl);
    return response_image_now(c, imageUrl);
});

async function response_image_now(c, url:string){
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) return c.text(`Image Fetch Error: ${imageResponse.status}`, 500);
    // 构建响应
    return new Response(imageResponse.body, {
        headers: {
            'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
            'Cache-Control': c.res.headers.get('Cache-Control') || '',
            'CDN-Cache-Control': c.res.headers.get('CDN-Cache-Control') || ''
        }
    });
}

async function bing_daily_img_url(c) {
    try {
        // 请求 Bing API
        const apiResponse = await fetch('https://cn.bing.com/HPImageArchive.aspx?idx=0&n=1');
        if (!apiResponse.ok) return c.text(`API Error: ${apiResponse.status}`, 500);
        // 解析 XML 数据
        const xmlData = await apiResponse.text();
        const urlMatch = xmlData.match(/<url>(.*?)<\/url>/is);
        if (!urlMatch?.[1]) return c.text('Image URL not found', 500);
        // 获取图片流
        return `https://cn.bing.com${urlMatch[1]}`;

    } catch (error) {
        console.error('[BING_ERROR]', error);
        return c.text('Failed to fetch daily image', 500);
    }
}

async function genshin_impact_num(c, num:number=null) {
    // 生成随机数或使用指定值
    const targetNum = num ?? Math.floor(Math.random() * 330) + 1;
    // 格式化为三位数并拼接 URL
    return `https://oneapi.524228.xyz/img/yuanshenpic/image_${targetNum
        .toString()
        .padStart(3, '0')}.webp`;
}

export default app;