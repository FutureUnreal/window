function showPopup() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        #popup-overlay {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
        }
        #popup-box {
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 
                0 10px 25px rgba(0,0,0,0.2),
                0 0 0 3px rgba(128, 0, 128, 0.3),
                0 0 20px 10px rgba(128, 0, 128, 0.2);
            text-align: center;
            max-width: 400px;
            width: 80%;
            animation: slideIn 0.3s ease-out;
            position: relative;
        }
        #popup-box::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: rgba(128, 0, 128, 0.1);
            border-radius: 15px;
            z-index: -1;
            filter: blur(10px);
        }
        #popup-content {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        #close-button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #3498db;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.1s;
        }
        #close-button:hover {
            background-color: #2980b9;
        }
        #close-button:active {
            transform: scale(0.95);
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
    content.textContent = '这是一个带有虚化紫色边框的弹窗！';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.textContent = '关闭';

    // 关闭弹窗事件
    closeButton.addEventListener('click', function() {
        overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
        popup.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });

    popup.appendChild(content);
    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

window.onload = showPopup;
