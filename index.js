const TeleBot = require('telebot');
const bot = new TeleBot(process.env.BOT_TOKEN);

// On every text message
bot.on('text', msg => {
    let fromId = msg.from.id;
    let messageId = msg.message_id;
    let answer = `Oi, recebi sua mensagem! Obrigada por enviar uma vaga e/ou material para o nosso canal!

Nossos ADMs humanos irão avaliar o link e, caso seja bacana para o grupo, o link será postado.

PS: Lembrando que só postamos vagas para iniciantes sem experiência.`;

    bot.forwardMessage(-1001505347688, fromId, messageId);

    return bot.sendMessage(fromId, answer);
});

bot.connect();
