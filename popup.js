function showPopup() {
    var popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    popup.innerHTML = '<p>这是一个弹窗！</p><button onclick="closePopup()">关闭</button>';

    document.body.appendChild(popup);
}

function closePopup() {
    var popup = document.querySelector('div');
    if (popup) {
        popup.remove();
    }
}

window.onload = function() {
    showPopup();
};
