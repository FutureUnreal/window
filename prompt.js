// 可用的语言列表
const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

// 需要弹出窗口的主机名列表
const hostsRequiringPopup = ['chatgpt.com', 'gemini.google.com', 'groq.com', 'openrouter.ai', 'tongyi.aliyun.com'];

// 获取当前主机名
const hostname = window.location.hostname;

// 获取用户语言
function getLanguage() {
    const browserLanguage = navigator.language.split('-')[0];
    return AVAILABLE_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
}

// 获取iframe URL
function getIframeUrl() {
    const userLanguage = getLanguage();
    return userLanguage === 'zh' ? 'https://www.ai-unreal.xin/' : `https://www.ai-unreal.xin/${userLanguage}/`;
}

// 检查元素是否已存在
function isElementExists(id) {
    return document.getElementById(id) !== null;
}

// 添加拖拽功能
function makeDraggable(element) {
    let isDragging = false;
    let currentY;
    let initialY;
    let yOffset = 0;

    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === element) {
            initialY = e.clientY - yOffset;
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentY = e.clientY - initialY;
            yOffset = currentY;

            // 限制在视窗范围内
            const maxY = window.innerHeight - element.offsetHeight;
            const boundedY = Math.min(Math.max(currentY, 0), maxY);
            
            // 只改变top值，保持right值不变
            element.style.top = boundedY + 'px';
            element.style.bottom = 'auto';
        }
    }

    function dragEnd() {
        initialY = currentY;
        isDragging = false;
    }

    // 添加触摸支持
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        initialY = touch.clientY - yOffset;
        isDragging = true;
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            currentY = touch.clientY - initialY;
            yOffset = currentY;

            const maxY = window.innerHeight - element.offsetHeight;
            const boundedY = Math.min(Math.max(currentY, 0), maxY);
            
            element.style.top = boundedY + 'px';
            element.style.bottom = 'auto';
        }
    });

    document.addEventListener('touchend', () => {
        initialY = currentY;
        isDragging = false;
    });
}

// 创建侧边栏
function createSidebar() {
    // 如果已经存在侧边栏，则不重复创建
    if (isElementExists('ai-shortcut-sidebar') || isElementExists('ai-shortcut-toggle')) {
        return;
    }
    
    const iframeUrl = getIframeUrl();
    
    // 创建切换按钮
    const toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    toggleIcon.id = 'ai-shortcut-toggle';
    toggleIcon.setAttribute('viewBox', '0 0 1024 1024');
    toggleIcon.setAttribute('width', '35');
    toggleIcon.setAttribute('height', '35');
    toggleIcon.innerHTML = '<path d="M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z" fill="#5cac7c"></path><path d="M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z" fill="#5cac7c" opacity=".5"></path>';
    
    // 设置初始样式
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.top = '300px'; // 改用 top 而不是 bottom
    toggleIcon.style.right = '15px';
    toggleIcon.style.zIndex = '1000';
    toggleIcon.style.cursor = 'move'; // 改为移动光标
    
    document.body.appendChild(toggleIcon);

    // 添加拖拽功能
    makeDraggable(toggleIcon);

    if (hostsRequiringPopup.includes(hostname)) {
        let popupWindow = null;
        toggleIcon.addEventListener('click', function() {
            if (!isDragging) { // 只在非拖拽状态处理点击事件
                if (popupWindow && !popupWindow.closed) {
                    popupWindow.close();
                    popupWindow = null;
                } else {
                    popupWindow = window.open(iframeUrl, '_blank', 'width=500,height=700');
                }
            }
        });
    } else {
        // 创建侧边栏 iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'ai-shortcut-sidebar';
        iframe.style.cssText = 'width:400px;height:100%;position:fixed;right:-400px;top:0;z-index:999;border:none;transition:right 0.3s ease;';
        iframe.src = iframeUrl;
        
        document.body.appendChild(iframe);
        
        // 添加点击事件
        toggleIcon.addEventListener('click', function() {
            if (!isDragging) { // 只在非拖拽状态处理点击事件
                iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
            }
        });
    }
}

// 初始化函数
function initializeSidebar() {
    // 检查必要的DOM元素是否已加载
    if (document.body) {
        createSidebar();
    } else {
        // 如果body还没加载，等待DOMContentLoaded事件
        document.addEventListener('DOMContentLoaded', createSidebar);
    }
}

// 监听路由变化（针对单页应用）
function listenToRouteChanges() {
    // 监听 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeSidebar();
        }
    }).observe(document, { subtree: true, childList: true });

    // 监听 history 变化
    if (window.history && window.history.pushState) {
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            initializeSidebar();
        };

        window.addEventListener('popstate', initializeSidebar);
    }
}

// 启动初始化
(function() {
    // 立即尝试初始化
    initializeSidebar();
    
    // 监听页面加载完成事件
    window.addEventListener('load', initializeSidebar);
    
    // 启动路由监听
    listenToRouteChanges();
    
    // 定期检查（作为后备方案）
    setInterval(initializeSidebar, 2000);
})();
