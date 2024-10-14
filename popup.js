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
            background-color: rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
        }
        #popup-box {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            width: 90%;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        }
        #popup-content {
            font-size: 16px;
            margin-bottom: 20px;
            color: rgba(0, 0, 0, 0.8);
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        .popup-button {
            flex: 1;
            padding: 8px 16px;
            font-size: 14px;
            color: #fff;
            background-color: rgba(130, 46, 251, 0.8);
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.1s;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }
        .popup-button:hover {
            background-color: rgba(106, 37, 201, 0.9);
        }
        .popup-button:active {
            transform: scale(0.95);
        }
        #close-button {
            background-color: rgba(130, 46, 251, 0.8);
        }
        #not-today-button {
            background-color: rgba(100, 100, 100, 0.8);
        }
        @media (min-width: 768px) {
            #popup-box {
                max-width: 400px;
                padding: 30px;
            }
            #popup-content {
                font-size: 18px;
            }
            .popup-button {
                padding: 10px 20px;
                font-size: 16px;
            }
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
    content.textContent = '这是一个重要通知！';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.className = 'popup-button';
    closeButton.textContent = '关闭';

    const notTodayButton = document.createElement('button');
    notTodayButton.id = 'not-today-button';
    notTodayButton.className = 'popup-button';
    notTodayButton.textContent = '今日不再提醒';

    // 关闭弹窗事件
    function closePopup() {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }

    closeButton.addEventListener('click', closePopup);

    notTodayButton.addEventListener('click', function() {
        // 这里可以添加逻辑来设置一个标志，表示今天不再显示
        // 例如，可以使用 localStorage 来存储这个信息
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
