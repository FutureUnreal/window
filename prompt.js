// 可用的语言列表
const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

// 需要弹出窗口的主机名列表
const hostsRequiringPopup = ['chatgpt.com', 'gemini.google.com', 'groq.com', 'openrouter.ai', 'tongyi.aliyun.com'];

// 获取当前主机名
const hostname = window.location.hostname;

// 检测是否是移动设备
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

// 创建一个包装器div来处理拖动
function createDraggableWrapper() {
    const wrapper = document.createElement('div');
    wrapper.id = 'ai-shortcut-wrapper';
    wrapper.style.cssText = `
        position: fixed;
        top: 300px;
        right: 15px;
        width: 35px;
        height: 35px;
        z-index: 1000;
        cursor: pointer;
        touch-action: none;
        user-select: none;
    `;
    return wrapper;
}

// 处理拖拽功能
function makeDraggable(wrapper) {
    let startY;
    let startTop;
    let isDragging = false;
    let moveDistance = 0;
    let startTime;

    // 鼠标事件
    wrapper.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        startDrag(e.clientY);
        e.preventDefault();
        wrapper.style.cursor = 'move';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        moveElement(e.clientY);
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        stopDrag(e);
        wrapper.style.cursor = 'pointer';
    });

    // 触摸事件
    wrapper.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        startDrag(e.touches[0].clientY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging || e.touches.length !== 1) return;
        moveElement(e.touches[0].clientY);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        stopDrag(e);
    });

    function startDrag(clientY) {
        isDragging = true;
        startY = clientY;
        startTop = wrapper.offsetTop;
        moveDistance = 0;
        startTime = Date.now();
        wrapper.style.transition = 'none';
    }

    function moveElement(clientY) {
        if (!isDragging) return;
        const deltaY = clientY - startY;
        moveDistance += Math.abs(deltaY);

        const newTop = startTop + deltaY;
        const maxTop = window.innerHeight - wrapper.offsetHeight;
        const boundedTop = Math.min(Math.max(0, newTop), maxTop);
        
        wrapper.style.top = boundedTop + 'px';
        startY = clientY;
        startTop = boundedTop;
    }

    function stopDrag(e) {
        if (!isDragging) return;
        const endTime = Date.now();
        const dragDuration = endTime - startTime;
        
        isDragging = false;
        wrapper.style.transition = '';
        
        // 保存位置
        localStorage.setItem('ai-shortcut-position', wrapper.style.top);
        
        // 如果移动距离小于5px且时间小于200ms，则视为点击
        if (moveDistance < 5 && dragDuration < 200 && wrapper.onclick) {
            wrapper.onclick(e);
        }
    }

    // 恢复保存的位置
    const savedTop = localStorage.getItem('ai-shortcut-position');
    if (savedTop) {
        wrapper.style.top = savedTop;
    }
}

// 创建侧边栏
function createSidebar() {
    if (isElementExists('ai-shortcut-wrapper')) {
        return;
    }
    
    const iframeUrl = getIframeUrl();
    
    // 创建包装器
    const wrapper = createDraggableWrapper();
    document.body.appendChild(wrapper);
    
    // 创建图标
    const toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    toggleIcon.id = 'ai-shortcut-toggle';
    toggleIcon.setAttribute('viewBox', '0 0 1024 1024');
    toggleIcon.setAttribute('width', '35');
    toggleIcon.setAttribute('height', '35');
    toggleIcon.innerHTML = '<path d="M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z" fill="#5cac7c"></path><path d="M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z" fill="#5cac7c" opacity=".5"></path>';
    toggleIcon.style.pointerEvents = 'none';
    
    wrapper.appendChild(toggleIcon);

    // 添加拖拽功能
    makeDraggable(wrapper);

    // 统一的点击处理逻辑
    let popupWindow = null;
    const handleClick = () => {
        if (isMobile() || hostsRequiringPopup.includes(hostname)) {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
                popupWindow = null;
            } else {
                popupWindow = window.open(iframeUrl, '_blank');
            }
        } else {
            const iframe = document.getElementById('ai-shortcut-sidebar');
            if (iframe) {
                iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
            }
        }
    };

    // 设置点击处理器
    wrapper.onclick = handleClick;

    // 如果是桌面端且不在特定域名列表中，创建侧边栏
    if (!isMobile() && !hostsRequiringPopup.includes(hostname)) {
        const iframe = document.createElement('iframe');
        iframe.id = 'ai-shortcut-sidebar';
        iframe.style.cssText = 'width:400px;height:100%;position:fixed;right:-400px;top:0;z-index:999;border:none;transition:right 0.3s ease;';
        iframe.src = iframeUrl;
        document.body.appendChild(iframe);
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
