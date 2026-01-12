/**
 * 爱情纪念页面 - 核心逻辑
 * 功能：URL参数配置、计时器、心形飘落动画、背景音乐
 */

// ==================== 配置 ====================
const CONFIG = {
    // 默认值（可通过URL参数覆盖）
    loverName: '小月月',      // 被表白者名字（URL参数：lover）
    loverFullName: '何月',    // 被表白者全名（URL参数：loverFull）
    authorName: '雨晴',       // 表白者名字（URL参数：author）
    startDate: '2017-01-13',  // 开始日期（URL参数：startDate，格式：YYYY-MM-DD）
    
    // 心形颜色
    heartColors: [
        '#ff6b6b', '#ff8787', '#ffa8a8',  // 红色系
        '#ff69b4', '#ff85c0', '#ffa6d0',  // 粉色系
        '#ff8c42', '#ffa659', '#ffb872',  // 橙色系
        '#ffd700', '#ffe033', '#ffeb66',  // 黄色系
        '#ff5252', '#ff7b7b', '#ff9e9e'   // 珊瑚色系
    ],
    
    // 动画设置
    heartsCount: 800,           // 静态心形数量（更密集）
    fallingInterval: 120,       // 飘落心形生成间隔（毫秒）
    fallingDuration: [7, 14],   // 飘落动画时长范围（秒）
};

// ==================== URL参数解析 ====================
function parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('lover')) {
        CONFIG.loverName = decodeURIComponent(params.get('lover'));
    }
    if (params.has('loverFull')) {
        CONFIG.loverFullName = decodeURIComponent(params.get('loverFull'));
    }
    if (params.has('author')) {
        CONFIG.authorName = decodeURIComponent(params.get('author'));
    }
    if (params.has('startDate')) {
        const dateStr = params.get('startDate');
        // 验证日期格式
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            CONFIG.startDate = dateStr;
        }
    }
}

// ==================== 应用配置到页面 ====================
function applyConfig() {
    // 更新页面标题
    document.title = `${CONFIG.loverFullName}，我爱你`;
    
    // 更新名字
    const loverNameEl = document.getElementById('loverName');
    const loverName2El = document.getElementById('loverName2');
    const authorNameEl = document.getElementById('authorName');
    
    if (loverNameEl) loverNameEl.textContent = CONFIG.loverFullName;
    if (loverName2El) loverName2El.textContent = CONFIG.loverName;
    if (authorNameEl) authorNameEl.textContent = CONFIG.authorName;
}

// ==================== 计时器 ====================
function updateTimer() {
    const startDate = new Date(CONFIG.startDate + 'T00:00:00');
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) {
        // 如果开始日期在未来，显示0
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours % 24;
    document.getElementById('minutes').textContent = minutes % 60;
    document.getElementById('seconds').textContent = seconds % 60;
}

function startTimer() {
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ==================== 心形树生成 ====================
function createStaticHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    
    const containerWidth = container.offsetWidth || 800;
    const containerHeight = container.offsetHeight || 600;
    
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2.2; // 心形向上偏移
    
    // 心形参数方程: x = 16*sin³(t), y = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
    // 我们生成心形轮廓内的随机点
    for (let i = 0; i < CONFIG.heartsCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        
        // 生成心形内部的点
        let x, y, isInside = false;
        let attempts = 0;
        
        while (!isInside && attempts < 50) {
            // 随机生成一个角度和半径
            const t = Math.random() * Math.PI * 2;
            const r = Math.random(); // 0到1之间的随机半径比例
            
            // 心形方程
            const heartX = 16 * Math.pow(Math.sin(t), 3);
            const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
        // 缩放比例（让心形充满容器）- 扩大范围
        const scale = Math.min(containerWidth, containerHeight) / 28;
            
            // 在心形内部随机分布（通过半径比例实现）
            x = centerX + heartX * scale * r;
            y = centerY + heartY * scale * r;
            
            // 检查是否在容器内
            if (x >= 10 && x <= containerWidth - 10 && y >= 10 && y <= containerHeight - 10) {
                isInside = true;
            }
            attempts++;
        }
        
        if (!isInside) continue;
        
        // 随机大小（中心区域稍大）
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = Math.min(containerWidth, containerHeight) / 2;
        const centralBonus = (1 - distFromCenter / maxDist) * 5;
        const size = Math.random() * 14 + 10 + centralBonus;
        
        // 随机颜色
        const color = CONFIG.heartColors[Math.floor(Math.random() * CONFIG.heartColors.length)];
        
        // 随机动画延迟
        const delay = Math.random() * 3;
        
        // 随机透明度
        const opacity = 0.75 + Math.random() * 0.25;
        
        heart.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size * 0.9}px;
            color: ${color};
            animation-delay: ${delay}s;
            opacity: ${opacity};
            filter: blur(${Math.random() > 0.9 ? 0.5 : 0}px);
        `;
        
        container.appendChild(heart);
    }
}

// ==================== 飘落动画 ====================
function createFallingHeart() {
    const container = document.getElementById('fallingHearts');
    const heartsContainer = document.getElementById('heartsContainer');
    if (!container || !heartsContainer) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart falling-heart';
    
    const containerWidth = heartsContainer.offsetWidth || 800;
    const containerHeight = heartsContainer.offsetHeight || 600;
    
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2.2;
    
    // 从心形轮廓边缘开始飘落
    const t = Math.random() * Math.PI * 2;
    const r = 0.85 + Math.random() * 0.15; // 在心形边缘
    
    // 心形方程
    const heartX = 16 * Math.pow(Math.sin(t), 3);
    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    const scale = Math.min(containerWidth, containerHeight) / 28;
    
    const startX = centerX + heartX * scale * r;
    const startY = centerY + heartY * scale * r;
    
    // 随机大小
    const size = Math.random() * 14 + 10;
    
    // 随机颜色
    const color = CONFIG.heartColors[Math.floor(Math.random() * CONFIG.heartColors.length)];
    
    // 随机飘落时长
    const duration = CONFIG.fallingDuration[0] + Math.random() * (CONFIG.fallingDuration[1] - CONFIG.fallingDuration[0]);
    
    // 随机摇摆方向
    const swayClass = Math.random() > 0.5 ? 'sway-left' : 'sway-right';
    heart.classList.add(swayClass);
    
    heart.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size * 0.9}px;
        color: ${color};
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, duration * 1000);
}

function startFallingAnimation() {
    // 初始生成一些飘落的心形
    for (let i = 0; i < 5; i++) {
        setTimeout(createFallingHeart, i * 200);
    }
    
    // 持续生成飘落的心形
    setInterval(createFallingHeart, CONFIG.fallingInterval);
}

// ==================== 背景音乐 ====================
let musicStarted = false;

function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const clickHint = document.getElementById('clickHint');
    
    if (!bgMusic || !musicControl) return;
    
    // 点击提示层或任意位置开始播放
    function startMusic() {
        if (musicStarted) return;
        musicStarted = true;
        
        // 隐藏提示
        if (clickHint) {
            clickHint.classList.add('hidden');
        }
        
        // 尝试播放音乐
        bgMusic.play().then(() => {
            musicControl.classList.add('playing');
        }).catch((error) => {
            console.log('音乐播放失败:', error);
            // 即使音乐播放失败也不影响其他功能
        });
        
        // 移除全局点击监听
        document.removeEventListener('click', startMusic);
    }
    
    // 添加全局点击监听
    document.addEventListener('click', startMusic);
    
    // 音乐控制按钮
    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(console.log);
        } else {
            bgMusic.pause();
            musicControl.classList.remove('playing');
        }
    });
}

// ==================== 初始化 ====================
function init() {
    // 解析URL参数
    parseURLParams();
    
    // 应用配置
    applyConfig();
    
    // 启动计时器
    startTimer();
    
    // 生成静态心形
    createStaticHearts();
    
    // 启动飘落动画
    startFallingAnimation();
    
    // 初始化音乐控制
    initMusic();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
