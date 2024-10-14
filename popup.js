function showPopup() {
    // 创建遮罩层
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    // 创建弹窗
    var popup = document.createElement('div');
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '30px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    popup.style.textAlign = 'center';
    popup.style.maxWidth = '400px';
    popup.style.width = '80%';

    var content = document.createElement('p');
    content.textContent = '这是一个弹窗！';
    content.style.fontSize = '18px';
    content.style.marginBottom = '20px';

    var closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.color = '#fff';
    closeButton.style.backgroundColor = '#3498db';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    // 按钮悬停效果
    closeButton.addEventListener('mouseover', function() {
        closeButton.style.backgroundColor = '#2980b9';
    });
    closeButton.addEventListener('mouseout', function() {
        closeButton.style.backgroundColor = '#3498db';
    });

    // 关闭弹窗事件
    closeButton.addEventListener('click', function() {
        overlay.remove();
    });

    popup.appendChild(content);
    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

window.onload = function() {
    showPopup();
};
