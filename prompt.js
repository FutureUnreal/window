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
function makeDraggable(wrapper, onClick) {
    let startY;
    let startTop;
    let isDragging = false;
    let moveDistance = 0;
    let dragStartTime;

    function startDrag(clientY) {
        isDragging = true;
        startY = clientY;
        startTop = wrapper.offsetTop;
        moveDistance = 0;
        dragStartTime = Date.now();
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

        // 保存新位置
        localStorage.setItem('ai-shortcut-position', wrapper.style.top);
    }

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;

        const dragDuration = Date.now() - dragStartTime;
        // 只在移动距离小且拖动时间短的情况下触发点击
        if (moveDistance < 5 && dragDuration < 200) {
            onClick();
        }
    }

    // 鼠标事件
    wrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        startDrag(e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        moveElement(e.clientY);
    });

    document.addEventListener('mouseup', () => {
        stopDrag();
    });

    // 触摸事件
    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        startDrag(e.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        moveElement(e.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        stopDrag();
    });

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

    let popupWindow = null;

    // 点击处理函数
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

    // 添加拖拽功能，传入点击处理函数
    makeDraggable(wrapper, handleClick);

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
