export const sendToTelegram = async (message) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram Bot Token or Chat ID not configured. Message not sent.');
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
      throw new Error(`Failed to send message: ${errorData.description}`);
    }
    
    console.log('Message sent to Telegram successfully');
    return true;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return false;
  }
};
