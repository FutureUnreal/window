function showPopup() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        #popup-overlay {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
        }
        #popup-box {
            background: rgba(250, 250, 250, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 14px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            width: 300px;
            animation: slideIn 0.3s ease-out;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #popup-content {
            font-size: 16px;
            color: #000;
            font-weight: 400;
            padding: 20px;
            text-align: left;
            line-height: 1.4;
        }
        .button-container {
            display: flex;
            border-top: 1px solid #e1e1e1;
        }
        .popup-button {
            flex: 1;
            padding: 12px 0;
            font-size: 17px;
            color: #007AFF;
            background-color: transparent;
            border: none;
            cursor: pointer;
            transition: background-color 0.1s;
            font-weight: 400;
        }
        .popup-button:first-child {
            border-right: 1px solid #e1e1e1;
            font-weight: 400;
            color: #000;
        }
        .popup-button:last-child {
            font-weight: 600;
        }
        .popup-button:hover {
            background-color: rgba(0, 122, 255, 0.1);
        }
        .popup-button:active {
            background-color: rgba(0, 122, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';

    // 创建弹窗
    const popup = document.createElement('div');
    popup.id = 'popup-box';

    const content = document.createElement('p');
    content.id = 'popup-content';
    content.textContent = '请在使用前注意查看网站公告。我们可能有重要的更新或信息需要您了解。';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const closeButton = document.createElement('button');
    closeButton.className = 'popup-button';
    closeButton.textContent = '关闭';

    const notTodayButton = document.createElement('button');
    notTodayButton.className = 'popup-button';
    notTodayButton.textContent = '今日不再提醒';

    // 关闭弹窗事件
    function closePopup() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        popup.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }

    closeButton.addEventListener('click', closePopup);
    notTodayButton.addEventListener('click', function() {
        localStorage.setItem('doNotShowPopupToday', new Date().toDateString());
        closePopup();
    });

    buttonContainer.appendChild(closeButton);
    buttonContainer.appendChild(notTodayButton);
    popup.appendChild(content);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// 检查是否应该显示弹窗
function shouldShowPopup() {
    const lastShownDate = localStorage.getItem('doNotShowPopupToday');
    return lastShownDate !== new Date().toDateString();
}

window.onload = function() {
    if (shouldShowPopup()) {
        showPopup();
    }
};
