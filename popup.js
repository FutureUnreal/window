function showPopup() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
            padding: 20px;
            border-radius: 14px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 270px;
            animation: slideIn 0.3s ease-out;
        }
        #popup-content {
            font-size: 13px;
            margin-bottom: 20px;
            color: #000;
            font-weight: 400;
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #e1e1e1;
        }
        .popup-button {
            flex: 1;
            padding: 10px 0;
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
    content.textContent = '允许"UC"在您使用该应用时访问您的位置吗？\n方便为您提供本地新闻和天气信息，并且根据您的位置信息发现附近的免费WiFi';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const notAllowButton = document.createElement('button');
    notAllowButton.className = 'popup-button';
    notAllowButton.textContent = '不允许';

    const allowButton = document.createElement('button');
    allowButton.className = 'popup-button';
    allowButton.textContent = '允许';

    // 关闭弹窗事件
    function closePopup() {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }

    notAllowButton.addEventListener('click', closePopup);
    allowButton.addEventListener('click', closePopup);

    buttonContainer.appendChild(notAllowButton);
    buttonContainer.appendChild(allowButton);
    popup.appendChild(content);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

window.onload = showPopup;
