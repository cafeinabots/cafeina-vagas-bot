const TeleBot = require('telebot');
const bot = new TeleBot(process.env.BOT_TOKEN);

// On every text message
bot.on('text', msg => {
    let id = msg.from.id;
    let messageId = msg.message_id;
    let chatId = msg.from.chatId;

    bot.forwardMessage(chatId, "@CafeinaVagasBot", messageId)

    return bot.sendMessage(id, `Vaga recebida, obrigada!`);
});

bot.connect();
