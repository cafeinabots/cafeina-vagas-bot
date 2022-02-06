import { basicAnswer, welcomeMessage, helpMessage } from "./messages.js";
import Telebot from "telebot";

const bot = new Telebot(process.env.BOT_TOKEN);

const CHAT_ID = -1001505347688;

// On every text message
bot.on(["text", "forward", "photo"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;

  console.log("User message information", msg);

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    return bot.sendMessage(CHAT_ID, text);
    return bot.sendMessage(fromId, basicAnswer);
  }
});

bot.connect();
