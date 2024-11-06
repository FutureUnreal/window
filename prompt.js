// 可用的语言列表
const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

// 需要弹出窗口的主机名列表
const hostsRequiringPopup = ['chatgpt.com', 'gemini.google.com', 'groq.com', 'openrouter.ai', 'tongyi.aliyun.com'];

// 获取当前主机名和设置延迟
const hostname = window.location.hostname;
const delay = hostname === 'chatgpt.com' ? 5000 : 500;

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

// 创建侧边栏
function createSidebar() {
    const iframeUrl = getIframeUrl();
    
    // 创建切换按钮
    const toggleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    toggleIcon.setAttribute('viewBox', '0 0 1024 1024');
    toggleIcon.setAttribute('width', '35');
    toggleIcon.setAttribute('height', '35');
    toggleIcon.innerHTML = '<path d="M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z" fill="#5cac7c"></path><path d="M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z" fill="#5cac7c" opacity=".5"></path>';
    
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.bottom = '300px';
    toggleIcon.style.right = '15px';
    toggleIcon.style.zIndex = '1000';
    toggleIcon.style.cursor = 'pointer';
    
    document.body.appendChild(toggleIcon);

    if (hostsRequiringPopup.includes(hostname)) {
        let popupWindow = null;
        toggleIcon.addEventListener('click', function() {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
                popupWindow = null;
            } else {
                popupWindow = window.open(iframeUrl, '_blank', 'width=500,height=700');
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
            iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
        });
    }
}

// 检查是否存在相同的iframe
function checkForExistingIframe(delay) {
    setTimeout(function() {
        const iframes = Array.from(document.getElementsByTagName('iframe'));
        const iframeExistsWithSameHost = iframes.some(iframe => {
            try {
                const iframeSrc = new URL(iframe.src);
                return iframeSrc.hostname === 'www.ai-unreal.xin';
            } catch (e) {
                return false;
            }
        });
        
        if (!iframeExistsWithSameHost) {
            createSidebar();
        }
    }, delay);
}

// 当文档加载完成时初始化
window.addEventListener('load', function() {
    checkForExistingIframe(delay);
});
