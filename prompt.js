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

// 处理拖拽功能
function makeDraggable(element) {
    let isDragging = false;
    let startY = 0;
    let startOffset = 0;
    let moved = false;

    // 保存位置到本地存储
    function savePosition(top) {
        localStorage.setItem('ai-shortcut-position', top);
    }

    // 从本地存储加载位置
    function loadPosition() {
        const savedTop = localStorage.getItem('ai-shortcut-position');
        if (savedTop !== null) {
            element.style.top = savedTop + 'px';
        }
    }

    function onStart(y) {
        isDragging = true;
        moved = false;
        startY = y;
        startOffset = element.offsetTop;
        element.style.cursor = 'grabbing';
    }

    function onMove(y) {
        if (!isDragging) return;
        moved = true;

        let delta = y - startY;
        let newTop = startOffset + delta;

        // 限制在视窗范围内
        const maxY = window.innerHeight - element.offsetHeight;
        newTop = Math.min(Math.max(0, newTop), maxY);

        element.style.top = newTop + 'px';
        element.style.bottom = 'auto';
        
        // 保存新位置
        savePosition(newTop);
    }

    function onEnd() {
        isDragging = false;
        element.style.cursor = 'grab';
    }

    // 鼠标事件
    element.addEventListener('mousedown', function(e) {
        onStart(e.clientY);
    });

    document.addEventListener('mousemove', function(e) {
        onMove(e.clientY);
    });

    document.addEventListener('mouseup', onEnd);

    // 触摸事件
    element.addEventListener('touchstart', function(e) {
        onStart(e.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            e.preventDefault();
            onMove(e.touches[0].clientY);
        }
    }, { passive: false });

    document.addEventListener('touchend', onEnd);

    // 加载保存的位置
    loadPosition();

    return {
        hasMoved: () => moved,
        resetMoved: () => { moved = false; }
    };
}

// 创建侧边栏
function createSidebar() {
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
    
    // 设置样式
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.top = '300px';
    toggleIcon.style.right = '15px';
    toggleIcon.style.zIndex = '1000';
    toggleIcon.style.cursor = 'grab';
    toggleIcon.style.touchAction = 'none';
    
    document.body.appendChild(toggleIcon);

    // 添加拖拽功能
    const dragHandler = makeDraggable(toggleIcon);

    if (hostsRequiringPopup.includes(hostname)) {
        let popupWindow = null;
        toggleIcon.addEventListener('click', function() {
            if (!dragHandler.hasMoved()) {
                if (popupWindow && !popupWindow.closed) {
                    popupWindow.close();
                    popupWindow = null;
                } else {
                    popupWindow = window.open(iframeUrl, '_blank', 'width=500,height=700');
                }
            }
            dragHandler.resetMoved();
        });
    } else {
        const iframe = document.createElement('iframe');
        iframe.id = 'ai-shortcut-sidebar';
        iframe.style.cssText = 'width:400px;height:100%;position:fixed;right:-400px;top:0;z-index:999;border:none;transition:right 0.3s ease;';
        iframe.src = iframeUrl;
        
        document.body.appendChild(iframe);
        
        toggleIcon.addEventListener('click', function() {
            if (!dragHandler.hasMoved()) {
                iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
            }
            dragHandler.resetMoved();
        });
    }
}

// 初始化函数
function initializeSidebar() {
    if (document.body) {
        createSidebar();
    } else {
        document.addEventListener('DOMContentLoaded', createSidebar);
    }
}

// 监听路由变化（针对单页应用）
function listenToRouteChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeSidebar();
        }
    }).observe(document, { subtree: true, childList: true });

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
    initializeSidebar();
    window.addEventListener('load', initializeSidebar);
    listenToRouteChanges();
    setInterval(initializeSidebar, 2000);
})();
