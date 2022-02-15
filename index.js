import {
  basicAnswer,
  welcomeMessage, 
  helpMessage, 
  errorMessage, 
  typeDocument 
  floodMessage
} from "./messages.js";

import Telebot from "telebot";

const bot = new Telebot({
  token: process.env.BOT_TOKEN,
  usePlugins: ['floodProtection'], 
    pluginConfig: { 
      floodProtection: { 
        interval: 2, 
          message: floodMessage
      } 
    }
});

const CHAT_ID = -1001505347688;

// On every text message
bot.on(["text", "forward", "photo"], (msg) => {
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
    bot.sendMessage(fromId, basicAnswer);

    promise = bot.sendMessage(CHAT_ID, text);

    return promise.catch(error => { 
      console.log('[error]: ', error); 
      bot.sendMessage(fromId, errorMessage + error);
    });
  }
});

bot.on("document", (msg) => {
  let fromId = msg.from.id;

  return bot.sendMessage(fromId, typeDocument);
});

bot.connect();
