// 配置对象
const config = {
    version: "2.0.5",
    title: "十七号球衣",
    server: {
        startDate: '2025-06-01T06:06:06',
        cpu: {
            min: 2,
            max: 15,
            total: 100
        },
        ram: {
            min: 0.1,
            max: 3.7,
            total: 512
        },
        disk: {
            min: 66.6,
            max: 66.6,
            total: 1024
        },
        networkSpeed: {
            min: 0,
            max: 9999
        }
    }
};

// 初始导航数据
const groups = [
    {
    name: "常用",
    list: [
        { name: "Github", url: "https://github.com/iitbt", icon: "" },
        { name: "Gitee", url: "https://gitee.com/iitbt", icon: "" },
        { name: "CloudFlare", url: "https://www.cloudflare-cn.com", icon: "" }
    ]
    },
    {
    name: "大厂",
    list: [
        { name: "讯飞", url: "https://xinghuo.xfyun.cn", icon: "" },
        { name: "DeepSeek", url: "https://www.deepseek.com", icon: "" }
    ]
    },
    {
    name: "API",
    list: [
        { name: "ALAPI", url: "https://www.alapi.cn", icon: "" },
        { name: "天行API", url: "https://www.tianapi.com", icon: "" }
    ]
    },
    {
    name: "自建",
    list: [
        { name: "openwrt", url: "https://opw.iitbt.cn", icon: "" },
        { name: "NAS", url: "https://nas.iitbt.cn", icon: "" },
        { name: "Lucky", url: "https://opl.iitbt.cn", icon: "" }
    ]
    },
    {
    name: "60S",
    list: [
        { name: "60s", url: "https://60s.99250036.xyz/v2/60s", icon: "" }
    ]
    }
];

// 更新时间和日期
function updateDateTime() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    if (timeEl) {
        timeEl.textContent = 
            pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    }
    if (dateEl) {
        dateEl.textContent = 
            now.getFullYear() + '年' + pad(now.getMonth()+1) + '月' + pad(now.getDate()) + '日 星期' + '日一二三四五六'.charAt(now.getDay());
    }
}
updateDateTime();
setInterval(updateDateTime, 1000);


// 拆分服务器状态更新功能，提高性能
function updateUptime() {
    // 运行时间递增(每秒更新)
    const startDate = new Date(config.server.startDate);
    const now = new Date();
    const diffInMs = now - startDate;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
    // 使用padStart确保小时、分钟和秒显示为两位数
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    const uptimeEl = document.getElementById('uptime');
    if(uptimeEl) {
        uptimeEl.textContent = days + '天' + hoursStr + '小时' + minutesStr + '分' + secondsStr + '秒';
    }
}

function updateStats() {
    // CPU使用率随机波动
    const cpuEl = document.getElementById('cpu-usage');
    if (cpuEl) {
        const cpuUsage = Math.floor(config.server.cpu.min + Math.random() * (config.server.cpu.max - config.server.cpu.min));
        cpuEl.textContent = formatCpuUsage(cpuUsage);
    }
    
    // RAM使用率随机波动
    const ramEl = document.getElementById('ram-usage');
    if (ramEl) {
        const ramUsage = (config.server.ram.min + Math.random() * (config.server.ram.max - config.server.ram.min)).toFixed(1);
        ramEl.textContent = ramUsage + ' GB/' + config.server.ram.total + ' GB';
    }
    
    // 硬盘使用率随机波动
    const diskEl = document.getElementById('disk-usage');
    if (diskEl) {
        const diskUsage = (config.server.disk.min + Math.random() * (config.server.disk.max - config.server.disk.min)).toFixed(1);
        diskEl.textContent = diskUsage + ' GB/' + config.server.disk.total + ' GB';
    }
    
    // 网络速度随机波动
    const networkEl = document.getElementById('network');
    if (networkEl) {
        const networkSpeed = Math.floor(config.server.networkSpeed.min + Math.random() * (config.server.networkSpeed.max - config.server.networkSpeed.min));
        networkEl.textContent = networkSpeed + ' Mbps';
    }
}

// 初始化所有状态
updateUptime();
updateStats();

// 设置不同的更新频率
setInterval(updateUptime, 1000);  // 运行时间每秒更新
setInterval(updateStats, 2000);  // 其他状态2秒更新一次

// 获取导航数据：优先 Cloudflare API，失败则本地 API，仍失败用初始 groups
function fetchNavDataFromAPI(callback, fallback) {
    const apiBase = location.origin;
    fetch(`${apiBase}/nav`)
      .then(res => res.json())
      .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                callback(data);
            } else {
                // 2. Cloudflare API 没数据，尝试本地 API
                fetchLocalNavAPI(callback, fallback);
            }
        })
        .catch(() => {
            // 2. Cloudflare API 失败，尝试本地 API
            fetchLocalNavAPI(callback, fallback);
        });
}

// 本地 API 获取导航数据
function fetchLocalNavAPI(callback, fallback) {
    fetch('http://localhost:3000/nav')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                // 按 group_name 分组
                const grouped = {};
                data.forEach(item => {
                    if (!grouped[item.group_name]) grouped[item.group_name] = [];
                    grouped[item.group_name].push({
                        name: item.name,
                        url: item.url,
                        icon: item.icon
                    });
                });
                // 转换为 groups 结构
                const groupsFromDB = Object.keys(grouped).map(groupName => ({
                    name: groupName,
                    list: grouped[groupName]
                }));
                callback(groupsFromDB);
            } else {
                // 3. 本地 API 也没数据，使用初始 groups
                fallback();
            }
        })
        .catch(() => {
            // 3. 本地 API 失败，使用初始 groups
            fallback();
        });
}

// 格式化CPU使用率为两位数
function formatCpuUsage(usage) {
    return String(usage).padStart(2, '0') + '%';
}

// 初始化服务器状态显示
function initServerStatus() {
    // 设置初始CPU使用率
    const cpuEl = document.getElementById('cpu-usage');
    if (cpuEl) {
        const initialCpuUsage = Math.floor(config.server.cpu.min + Math.random() * (config.server.cpu.max - config.server.cpu.min));
        cpuEl.textContent = formatCpuUsage(initialCpuUsage);
    }
    
    // 设置初始RAM使用率
    const ramEl = document.getElementById('ram-usage');
    if (ramEl) {
        const initialRamUsage = (config.server.ram.min + Math.random() * (config.server.ram.max - config.server.ram.min)).toFixed(1);
        ramEl.textContent = initialRamUsage + ' GB/' + config.server.ram.total + ' GB';
    }
    
    // 设置初始硬盘使用率
    const diskEl = document.getElementById('disk-usage');
    if (diskEl) {
        const initialDiskUsage = (config.server.disk.min + Math.random() * (config.server.disk.max - config.server.disk.min)).toFixed(1);
        diskEl.textContent = initialDiskUsage + ' GB/' + config.server.disk.total + ' GB';
    }
    
    // 设置初始网络速度
    const networkEl = document.getElementById('network');
    if (networkEl) {
        const initialNetworkSpeed = Math.floor(config.server.networkSpeed.min + Math.random() * (config.server.networkSpeed.max - config.server.networkSpeed.min));
        networkEl.textContent = initialNetworkSpeed + ' Mbps';
    }
    
    // 设置版本信息
    const versionEl = document.getElementById('version');
    if (versionEl) {
        versionEl.textContent = config.version;
    }
}

// 设置页面标题
function updatePageTitle() {
    document.title = config.title;
}

// 确保DOM加载完成后初始化
function initNav() {
    fetchNavDataFromAPI(
        // 成功回调
        function(groupsFromDB) {
            renderNav(groupsFromDB);
        },
        // 失败回调
        function() {
            renderNav(groups); // groups 是 index.js 里的本地数据
        }
    );
}

// 渲染导航的函数（原initNavCards内容，参数改为groupsData）
function renderNav(groupsData) {
    const container = document.getElementById('nav-container');
    if (!container) return;
    container.innerHTML = '';
    groupsData.forEach((group, idx) => {
        // 外层div
        const groupDiv = document.createElement('div');
        groupDiv.className = 'nav-group collapsible-group';

        // 组名header
        const titleDiv = document.createElement('div');
        titleDiv.className = 'group-title collapsible-header';
        titleDiv.innerHTML = `<span>${group.name}</span><i class="fas fa-chevron-down arrow"></i>`;
        titleDiv.tabIndex = 0;

        // 内容区
        const cardList = document.createElement('div');
        cardList.className = 'card-list collapsible-content';
        // 默认展开“常用”分组
        if (group.name === '常用') {
            cardList.classList.add('open');
            titleDiv.classList.add('active');
            titleDiv.querySelector('.arrow').classList.add('open');
        }

        // 原有卡片渲染逻辑
        group.list.forEach(item => {
            const card = document.createElement('a');
            card.className = 'nav-card';
            card.href = item.url;
            card.target = '_blank';

            // 图标和状态指示器
            const iconContainer = document.createElement('div');
            iconContainer.style.position = 'relative';
            iconContainer.style.display = 'flex';
            iconContainer.style.alignItems = 'center';
            iconContainer.style.marginRight = '10px';

            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'status-indicator checking';
            statusIndicator.title = '检查中...';
            iconContainer.appendChild(statusIndicator);

            const img = document.createElement('img');
            img.alt = item.name;
            function handleIconError() {
                if (item.url && item.url !== "") {
                    const urlObj = new URL(item.url);
                    const rootFavicon = `${urlObj.origin}/favicon.ico`;
                    img.onerror = function() {
                        img.src = "favicon.ico";
                        img.onerror = null;
                    };
                    img.src = rootFavicon;
                } else {
                    img.src = "favicon.ico";
                }
            }
            if (item.icon && item.icon !== "") {
                img.src = item.icon;
                img.onerror = handleIconError;
            } else {
                handleIconError();
            }
            iconContainer.appendChild(img);
            card.appendChild(iconContainer);

            const span = document.createElement('span');
            span.textContent = item.name;
            card.appendChild(span);
            cardList.appendChild(card);

            if (item.url) {
                checkWebsiteStatus(item.url, statusIndicator);
            } else {
                statusIndicator.className = 'status-indicator offline';
            }
        });

        // 点击header切换内容显示
        titleDiv.addEventListener('click', () => {
            const isOpen = cardList.classList.contains('open');
            if (isOpen) {
                cardList.classList.remove('open');
                titleDiv.classList.remove('active');
                titleDiv.querySelector('.arrow').classList.remove('open');
            } else {
                cardList.classList.add('open');
                titleDiv.classList.add('active');
                titleDiv.querySelector('.arrow').classList.add('open');
            }
        });

        groupDiv.appendChild(titleDiv);
        groupDiv.appendChild(cardList);
        container.appendChild(groupDiv);
    });
}

// 页面加载时调用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updatePageTitle();
        initNav();
        initServerStatus();
    });
} else {
    updatePageTitle();
    initNav();
    initServerStatus();
}

// 检查网站是否在线
function checkWebsiteStatus(url, indicator) {
    // 避免空URL
    if (!url || url === "") {
        indicator.className = 'status-indicator offline';
        indicator.title = '未配置URL';
        return;
    }
    
    // 创建一个图像对象来检测网站是否可访问
    // 这比fetch更可靠，因为fetch在CORS限制下可能会失败
    const img = new Image();
    let isChecked = false;
    
    // 设置超时 - 10秒
    const timeout = setTimeout(() => {
        if (!isChecked) {
            isChecked = true;
            indicator.className = 'status-indicator offline';
            indicator.title = '连接超时';
        }
    }, 10000);
    
    // 图像加载成功表示网站可能在线
    img.onload = function() {
        if (!isChecked) {
            isChecked = true;
            clearTimeout(timeout);
            indicator.className = 'status-indicator online';
            indicator.title = '在线';
        }
    };
    
    // 图像加载失败表示网站可能离线
    img.onerror = function() {
        if (!isChecked) {
            isChecked = true;
            clearTimeout(timeout);
            // 尝试使用fetch作为备选方案
            tryFetchCheck(url, indicator);
        }
    };
    
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 尝试加载网站的favicon
    img.src = `${url}/favicon.ico?t=${timestamp}`;
}

// 使用fetch作为备选方案检查网站
function tryFetchCheck(url, indicator) {
    fetch(url, { 
        mode: 'no-cors',  // 避免CORS错误
        cache: 'no-store', // 不使用缓存
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
    .then(() => {
        // 如果能够获取响应，则认为网站在线
        indicator.className = 'status-indicator online';
        indicator.title = '在线';
    })
    .catch(() => {
        // 如果发生错误，则认为网站离线
        indicator.className = 'status-indicator offline';
        indicator.title = '离线';
    });
}

// 鼠标文字特效
jQuery(document).ready(function($) { 
    var a_idx = 0; 
    $("body").click(function(e) { 
        var a = new Array("🌈", "❤️", "🛸", "🛫", "👣", "🤞🏻"); 
        var $i = $("<span/>").text(a[a_idx]); 
        a_idx = (a_idx + 1) % a.length; 
        var x = e.pageX, 
        y = e.pageY; 
        $i.css({ 
            "z-index": 9999, 
            "top": y - 20, 
            "left": x, 
            "position": "absolute", 
            "font-weight": "bold", 
            "color": "#ff6651" 
        }); 
        $("body").append($i); 
        $i.animate({ 
            "top": y - 180, 
            "opacity": 0 
        }, 
        1500, 
        function() { 
            $i.remove(); 
        }); 
    }); 
});