import {
  basicAnswer,
  welcomeMessage, 
  helpMessage, 
  errorMessage, 
  wrongFormat,
  floodMessage,
} from "./messages.js";

import Telebot from "telebot";

const bot = new Telebot({
  token: process.env.BOT_TOKEN,
  usePlugins: ['floodProtection'], 
    pluginConfig: { 
      floodProtection: { 
        interval: 3, 
        message: floodMessage
      } 
    }
});

const CHAT_ID = -1001505347688;

bot.on(["text"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let promise;

  console.log("[text message]: ", JSON.stringify(msg));

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  } else {
    bot.sendMessage(fromId, basicAnswer);

    promise = bot.sendMessage(CHAT_ID, text);

    return promise.catch(error => { 
      console.log('[error]: ', JSON.stringify(error)); 
      bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
    });
  }
});

bot.on(["photo"], (msg) => {
  let photo = msg.photo[0].file_id;
  console.log('photoo', photo)
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let caption = msg.caption;
  let promise;

  console.log("[photo message]: ", JSON.stringify(msg));

    bot.sendMessage(fromId, basicAnswer);

    promise = bot.sendPhoto(CHAT_ID, photo, { caption });

    return promise.catch(error => { 
      console.log('[error]: ', JSON.stringify(error)); 
      bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
    });
  
});

bot.on(["forward"], (msg) => {
  let {text, photo, caption, media_group_id: mediaGroupId} = msg;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let promise;

  console.log("[foward message]: ", JSON.stringify(msg));

  if(text) {
    bot.sendMessage(fromId, basicAnswer);
    promise = bot.sendMessage(CHAT_ID, text);
  }
  else if(photo && (mediaGroupId === undefined)) {
    bot.sendMessage(fromId, basicAnswer);
    promise = bot.sendPhoto(CHAT_ID, photo[0].file_id, { caption });
  }
  else {
    return bot.sendMessage(fromId, wrongFormat);
  }

    return promise.catch(error => { 
      console.log('[error]: ', JSON.stringify(error)); 
      bot.sendMessage(fromId, errorMessage + JSON.stringify(error));
    });
  
});

bot.on(["document", "audio", "video", "animation"], (msg) => {
  let fromId = msg.from.id;

  return bot.sendMessage(fromId, wrongFormat);
});

bot.connect();
