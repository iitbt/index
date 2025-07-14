-- 创建表
CREATE TABLE nav_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name TEXT,
  name TEXT,
  url TEXT,
  icon TEXT
);

-- 操作建议
-- 每次只粘贴一组 INSERT 语句，执行后再粘贴下一组。
-- 不要带注释（-- 常用 之类），只粘贴 SQL 语句。
-- 每组 INSERT 语句结尾有分号。

-- 常用
INSERT INTO nav_table (group_name, name, url, icon) VALUES
('常用', 'Github', 'https://github.com/iitbt', ''),
('常用', 'Gitee', 'https://gitee.com/iitbt', ''),
('常用', 'CloudFlare', 'https://www.cloudflare-cn.com', ''),
('常用', 'claw.cloud', 'https://ap-northeast-1.run.claw.cloud', ''),
('常用', 'Vercel', 'https://vercel.com/account', ''),
('常用', 'Gitlab', 'https://gitlab.com/', ''),
('常用', '吾爱破解', 'https://www.52pojie.cn', ''),
('常用', 'Bilibili', 'https://www.bilibili.com', ''),
('常用', '果核剥壳', 'https://www.ghxi.com', ''),
('常用', 'LinkAI', 'https://link-ai.tech/portal', ''),
('常用', 'V2free', 'https://v2-free.github.io', ''),
('常用', 'WYS', 'https://w1.v2free.cc/user', ''),
('常用', 'IITBT', 'https://w1.v2free.net/user', ''),
('常用', '易搜', 'https://yiso.eu.org', ''),
('常用', '解析', 'https://jx.os3.cn/user/parse', ''),
('常用', 'Emoji', 'https://www.emojiall.com/zh-hans', ''),
('常用', '在线ICO', 'https://www.ico51.cn', ''),
('常用', '在线图像转换器', 'https://onlineconvertfree.com/zh/converter/images', ''),
('常用', '微信公众平台', 'https://mp.weixin.qq.com', '');
-- 注意这里有分号

-- 大厂
INSERT INTO nav_table (group_name, name, url, icon) VALUES
('大厂', '讯飞', 'https://xinghuo.xfyun.cn', ''),
('大厂', 'DeepSeek', 'https://www.deepseek.com', ''),
('大厂', '硅基流动', 'https://cloud.siliconflow.cn/invitation', ''),
('大厂', '阿里云', 'https://www.aliyun.com', ''),
('大厂', '华为云', 'https://www.huaweicloud.com', ''),
('大厂', '阿里邮箱', 'https://qiye.aliyun.com', ''),
('大厂', 'Cursor', 'https://www.cursor.com/cn', ''),
('大厂', '企业微信', 'https://work.weixin.qq.com', ''),
('大厂', 'MCP聚合', 'https://smithery.ai', '');
-- 这里也有分号

-- API
INSERT INTO nav_table (group_name, name, url, icon) VALUES
('API', 'ALAPI', 'https://www.alapi.cn', ''),
('API', '天行API', 'https://www.tianapi.com', ''),
('API', '和风天气', 'https://id.qweather.com', ''),
('API', 'DP-API', 'https://api.dudunas.top', ''),
('API', 'Hitokoto - 一言', 'https://hitokoto.cn', '');

-- 自建
INSERT INTO nav_table (group_name, name, url, icon) VALUES
('自建', 'openwrt', 'https://opw.iitbt.cn', ''),
('自建', 'NAS', 'https://nas.iitbt.cn', ''),
('自建', 'Lucky', 'https://opl.iitbt.cn', ''),
('自建', 'Certd', 'https://opc.iitbt.cn', ''),
('自建', 'Vaultwarden', 'https://opv.iitbt.cn', ''),
('自建', 'DDNS-GO', 'https://opd.iitbt.cn', ''),
('自建', '青龙', 'https://opq.iitbt.cn', ''),
('自建', '小爱音乐', 'https://opm.iitbt.cn', ''),
('自建', 'Navidrome', 'https://opn.iitbt.cn', ''),
('自建', 'Rustdesk', 'https://rd4.iitbt.cn', ''),
('自建', '狼牙极限后台管理系统', 'https://nsam.iitbt.cn', ''),
('自建', 'phpmyadmin', 'https://nsp.iitbt.cn', ''),
('自建', 'API', 'https://nsapi.iitbt.cn', ''),
('自建', 'NAS-DDNSGO', 'https://nsd.iitbt.cn', ''),
('自建', 'nav', 'https://nav.99250036.xyz', '');

-- 60S
INSERT INTO nav_table (group_name, name, url, icon) VALUES
('60S', '60s', 'https://60s.99250036.xyz/v2/60s', ''),
('60S', '答案之书', 'https://60s.99250036.xyz/v2/answer', ''),
('60S', '百科', 'https://60s.99250036.xyz/v2/baike', ''),
('60S', '哔哩哔哩', 'https://60s.99250036.xyz/v2/bili', ''),
('60S', '必应壁纸', 'https://60s.99250036.xyz/v2/bing', ''),
('60S', '唱鸭', 'https://60s.99250036.xyz/v2/changya', ''),
('60S', '化学', 'https://60s.99250036.xyz/v2/chemical', ''),
('60S', '抖音热点', 'https://60s.99250036.xyz/v2/douyin', ''),
('60S', '段子', 'https://60s.99250036.xyz/v2/duanzi', ''),
('60S', 'Epic免费游戏', 'https://60s.99250036.xyz/v2/epic', ''),
('60S', '汇率', 'https://60s.99250036.xyz/v2/exchange_rate', ''),
('60S', '发病文学', 'https://60s.99250036.xyz/v2/fabing', ''),
('60S', '一言', 'https://60s.99250036.xyz/v2/hitokoto', ''),
('60S', 'IP查询', 'https://60s.99250036.xyz/v2/ip', ''),
('60S', '肯德基', 'https://60s.99250036.xyz/v2/kfc', ''),
('60S', '运势', 'https://60s.99250036.xyz/v2/luck', ''),
('60S', '猫眼电影', 'https://60s.99250036.xyz/v2/maoyan', ''),
('60S', '历史上的今天', 'https://60s.99250036.xyz/v2/today_in_history', ''),
('60S', '头条', 'https://60s.99250036.xyz/v2/toutiao', ''),
('60S', '微博热搜', 'https://60s.99250036.xyz/v2/weibo', ''),
('60S', '知乎热榜', 'https://60s.99250036.xyz/v2/zhihu', ''),
('60S', 'OG信息', 'https://60s.99250036.xyz/v2/og', ''),
('60S', '哈希计算', 'https://60s.99250036.xyz/v2/hash', ''),
('60S', '翻译', 'https://60s.99250036.xyz/v2/fanyi', ''),
('60S', '支持语言', 'https://60s.99250036.xyz/v2/fanyi/langs', '');