const TeleBot = require("telebot");
const bot = new TeleBot(process.env.BOT_TOKEN);

const answer = `Oi, recebi sua mensagem! Obrigada por enviar uma vaga e/ou material para o nosso canal!

Nossos ADMs humanos irão avaliar o link e, caso seja bacana para o grupo, o link será postado.

PS: Lembrando que só postamos vagas para iniciantes sem experiência.`;

const welcomeMessage = `Oi, eu sou a bot que recebe vagas e outros links para o @CafeinaVagas.

❤ Fico no aguardo de novas vagas, cursos ou outros materiais legais para compartilhar.

CHAT | Conheça o Cafeína Help, nosso chat para tirar dúvidas: @CafeinaVagasChat

SAC | Se você deseja conversar com um ADM, entre em contato pela nossa Central de Atendimento: @SAC_CafeinaVagas`;

const helpMessage = `Nosso bot recebe vagas, cursos e outros tipos de materiais. Basta enviar aqui em formato de texto ou link.

❤ Fico no aguardo de novas vagas, cursos ou outros materiais legais para compartilhar.

CHAT | Conheça o Cafeína Help, nosso chat para tirar dúvidas: @CafeinaVagasChat

SAC | Se você deseja conversar com um ADM, entre em contato pela nossa Central de Atendimento: @SAC_CafeinaVagas`;

// On every text message
bot.on("text", (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;

  console.log("User message information", msg);

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    bot.forwardMessage(-1001505347688, fromId, messageId);
    return bot.sendMessage(fromId, answer);
  }
});

bot.connect();

bot.on("foward", (msg) => {
  console.log("User message foward", msg);
});
