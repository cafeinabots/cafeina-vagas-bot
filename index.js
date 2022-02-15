import { basicAnswer, welcomeMessage, helpMessage } from "./messages.js";
import Telebot from "telebot";

const bot = new Telebot(process.env.BOT_TOKEN);

const CHAT_ID = -1001505347688;

// On every text message
bot.on(["text", "forward", "photo", "document"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let promise;

  console.log("[message]: ", JSON.stringify(msg));

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    promise = bot.sendMessage(CHAT_ID, text);

    return promise.catch(error => { 
      console.log('[error]', error); 
      bot.sendMessage(fromId, errorMessage + error);
    });

    // return bot.sendMessage(fromId, basicAnswer);
  }
});

bot.connect();
