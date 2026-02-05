document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const submitBtn = this.querySelector('button');

    // 1. Basit Güvenlik Kontrolü
    if (!name || !email || !message) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    // Butonu kilitle (Art arda basamasınlar)
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Gönderiliyor...";

    // 2. Flask Backend'e Veriyi Ateşle
    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, email: email, message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Mesajın başarıyla ulaştı! En kısa sürede döneceğim.");
            document.getElementById('contact-form').reset(); // Formu temizle
        } else {
            alert("Hata oluştu: " + (data.error || "Bilinmeyen hata"));
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        alert("Sunucu ile iletişim kurulamadı!");
    })
    .finally(() => {
        // İşlem bitince butonu eski haline getir
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
    });
});
