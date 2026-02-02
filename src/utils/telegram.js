export const sendToTelegram = async (message) => {
  // Try to get chat ID from env, fallback to hardcoded user ID if missing
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '1556429907';

  if (!chatId) {
    console.warn('Telegram Chat ID not configured. Message not sent.');
    return false;
  }

  // Use the backend proxy instead of direct Telegram API
  const url = '/telegram-proxy/sendMessage';

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
      console.error('Telegram API Error (via Proxy):', errorData);
      throw new Error(`Failed to send message: ${errorData.error || 'Unknown error'}`);
    }
    
    console.log('Message sent to Telegram successfully via proxy');
    return true;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return false;
  }
};
