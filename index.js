const TeleBot = require("telebot");
const bot = new TeleBot(process.env.BOT_TOKEN);

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Node server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

// On every text message
bot.on("text", (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let answer = `Oi, recebi sua mensagem! Obrigada por enviar uma vaga e/ou material para o nosso canal!

Nossos ADMs humanos irão avaliar o link e, caso seja bacana para o grupo, o link será postado.

PS: Lembrando que só postamos vagas para iniciantes sem experiência.`;

  let welcomeMessage = `Oi, eu sou a bot que recebe vagas e outros links para o @CafeinaVagas.

❤ Fico no aguardo de novas vagas ou cursos.

CHAT | Conheça o Cafeína Help, nosso chat para tirar dúvidas: @CafeinaVagasChat

SAC | Se você deseja conversar com um ADM, entre em contato pela nossa Central de Atendimento: @SAC_CafeinaVagas`;

  console.log("User message information", msg);

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else {
    bot.forwardMessage(-1001505347688, fromId, messageId);
    return bot.sendMessage(fromId, answer);
  }
});

bot.connect();
