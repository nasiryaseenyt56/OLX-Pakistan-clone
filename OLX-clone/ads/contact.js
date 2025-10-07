function showPhoneNumber() {
    const phoneBtn = document.querySelector('.phone-btn');
    phoneBtn.innerHTML = '<i class="fas fa-phone"></i> +92 300 1234567';
    phoneBtn.style.background = '#23e5db';
    phoneBtn.style.color = '#002f34';
    phoneBtn.onclick = () => window.location.href = 'tel:+923001234567';
}

function contactSeller() {
    window.location.href = '../chat.html';
}