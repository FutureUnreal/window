// 可用的语言列表
const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

// 允许的主机名列表（白名单）
const allowedHosts = [
    'isgpt.cloud',
    'ai-unreal.com',
    'www.ai-unreal.com'
];

// 允许的路径规则
const allowedPathPatterns = [
    '^/?$',                         // 首页 https://isgpt.cloud/
    '^/chat/[\\w-]+$',             // 聊天页 https://isgpt.cloud/chat/96674f63-bcae-4ae9-a7c4-a197a3efb
    '^/new/?$',                    // 新建页 https://isgpt.cloud/new/
    '^/c/[\\w-]+$',                // c路径页 https://isgpt.cloud/c/435erwf
    '^/pastel/#/carlist$',         // 列表页 https://isgpt.cloud/pastel/#/carlist
];

// 获取当前主机名和路径
const hostname = window.location.hostname;
const pathname = window.location.pathname + window.location.hash;

// 检查当前网站和路径是否允许
function isAllowed() {
    // 检查主机名是否允许
    const hostAllowed = allowedHosts.some(host => hostname.includes(host));
    if (!hostAllowed) return false;

    // 获取完整路径（移除查询参数）
    const fullPath = window.location.pathname + window.location.hash;
    const pathWithoutQuery = fullPath.split('?')[0];

    // 检查路径是否匹配任何允许的模式
    const pathAllowed = allowedPathPatterns.some(pattern => {
        const regex = new RegExp(pattern);
        return regex.test(pathWithoutQuery);
    });

    console.log('Path check:', {
        path: pathWithoutQuery,
        allowed: pathAllowed
    });

    return pathAllowed;
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

// 创建侧边栏
function createSidebar() {
    // 如果不允许在当前页面显示，直接返回
    if (!isAllowed()) {
        console.log('Not allowed on current page:', window.location.href);
        return;
    }
    
    // 如果已经存在侧边栏，则不重复创建
    if (isElementExists('ai-shortcut-sidebar') || isElementExists('ai-shortcut-toggle')) {
        return;
    }
    
    console.log('Creating sidebar for:', window.location.href);
    
    const iframeUrl = getIframeUrl();
    
    // 创建切换按钮
    const toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    toggleIcon.id = 'ai-shortcut-toggle';
    toggleIcon.setAttribute('viewBox', '0 0 1024 1024');
    toggleIcon.setAttribute('width', '35');
    toggleIcon.setAttribute('height', '35');
    toggleIcon.innerHTML = '<path d="M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z" fill="#5cac7c"></path><path d="M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z" fill="#5cac7c" opacity=".5"></path>';
    
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.bottom = '300px';
    toggleIcon.style.right = '15px';
    toggleIcon.style.zIndex = '9999999';
    toggleIcon.style.cursor = 'pointer';
    toggleIcon.style.background = '#fff';
    toggleIcon.style.borderRadius = '50%';
    toggleIcon.style.padding = '5px';
    toggleIcon.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    document.body.appendChild(toggleIcon);

    // 创建侧边栏 iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'ai-shortcut-sidebar';
    iframe.style.cssText = 'width:400px;height:100%;position:fixed;right:-400px;top:0;z-index:9999998;border:none;transition:right 0.3s ease;box-shadow:-2px 0 5px rgba(0,0,0,0.2);background:#fff;';
    iframe.src = iframeUrl;
    
    document.body.appendChild(iframe);
    
    // 添加点击事件
    toggleIcon.addEventListener('click', function() {
        iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
    });
}

// 初始化函数
function initialize() {
    if (document.body) {
        createSidebar();
    } else {
        document.addEventListener('DOMContentLoaded', createSidebar);
    }
}

// 监听 URL 变化
function listenToUrlChanges() {
    let lastUrl = location.href;
    
    // 创建一个观察器来监听 URL 变化
    const observer = new MutationObserver(function() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            console.log('URL changed to:', location.href);
            createSidebar();
        }
    });
    
    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 监听 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        createSidebar();
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        createSidebar();
    };
    
    // 监听 popstate 事件
    window.addEventListener('popstate', function() {
        createSidebar();
    });
    
    // 监听 hashchange 事件
    window.addEventListener('hashchange', function() {
        createSidebar();
    });
}

// 定期检查路由变化
function startPeriodicCheck() {
    setInterval(function() {
        if (!isElementExists('ai-shortcut-sidebar') && !isElementExists('ai-shortcut-toggle')) {
            createSidebar();
        }
    }, 2000);
}

// 启动脚本
(function() {
    console.log('Initializing AI-Unreal sidebar for:', window.location.href);
    
    // 初始化
    initialize();
    
    // 监听加载完成事件
    window.addEventListener('load', initialize);
    
    // 启动 URL 变化监听
    listenToUrlChanges();
    
    // 启动定期检查
    startPeriodicCheck();
})();
