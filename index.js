import {
  basicAnswer,
  welcomeMessage,
  helpMessage,
  errorMessage,
  wrongFormat,
  floodMessage,
  floodAlbum,
  albumMaxLength,
} from "./messages.js";

import Telebot from "telebot";
import http from "http";

const bot = new Telebot({
  token: process.env.BOT_TOKEN,
  pluginFolder: "../../../plugins/",
  usePlugins: ["floodProtectionV2.cjs", "copyAlbum.cjs"],
  pluginConfig: {
    floodProtectionV2: {
      interval: 3,
      messageFlood: floodMessage,
    },
    copyAlbum: {
      message: basicAnswer,
      messageFlood: floodAlbum,
      messageMaxPhotos: albumMaxLength,
      messageError: errorMessage,
      timeout: 3,
      interval: 30,
      maxPhotos: 5,
    },
  },
});

const CHAT_ID = process.env.CHAT_ID;

bot.on(["text"], (msg) => {
  let text = msg.text;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let firstName = msg.from.first_name;
  let lastName = msg.from.last_name;
  let name = [firstName, lastName].filter(Boolean).join(" ") || msg.from.username || "";
  let mention = `[${fromId}](tg://user?id=${fromId})`;
  let promise;
  if (msg.chat.type !== "private") {
    return;
  }

  console.log("[text message]: ", JSON.stringify(msg));

  if (text === "/start") {
    return bot.sendMessage(fromId, welcomeMessage);
  } else if (text === "/help") {
    return bot.sendMessage(fromId, helpMessage);
  }
  bot.sendMessage(fromId, basicAnswer, { replyToMessage: messageId });

  promise = bot.sendMessage(CHAT_ID, `👤 Enviado por: ${name} (${fromId})\n${text}`);

  return promise.catch((error) => {
    console.log("[error]: ", JSON.stringify(error));
    bot.sendMessage(fromId, errorMessage + JSON.stringify(error), {
      replyToMessage: messageId,
    });
  });
});

bot.on(["photo"], (msg) => {
  let { photo, caption, media_group_id: mediaGroupId } = msg;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let firstName = msg.from.first_name;
  let lastName = msg.from.last_name;
  let name = [firstName, lastName].filter(Boolean).join(" ") || msg.from.username || "";
  let promise;
  if (msg.chat.type !== "private") {
    return;
  }

  console.log("[photo message]: ", JSON.stringify(msg));

  if (photo && mediaGroupId === undefined) {
    bot.sendMessage(fromId, basicAnswer, { replyToMessage: messageId });
    console.log("[photo message]: ", `👤 Enviado por: ${name} (${fromId})\n${caption || ""}`);
    promise = bot.sendPhoto(CHAT_ID, photo[0].file_id, { caption: `👤 Enviado por: ${name} (${fromId})\n${caption || ""}` });
  } else if (mediaGroupId === undefined) {
    promise = bot.sendMessage(fromId, wrongFormat, {
      replyToMessage: messageId,
    });
  } else {
    //mensagens de album de fotos são tratadas pelo plugin copyAlbum
    promise = Promise.resolve();
  }

  return promise.catch((error) => {
    console.log("[error]: ", JSON.stringify(error));
    bot.sendMessage(fromId, errorMessage + JSON.stringify(error), {
      replyToMessage: messageId,
    });
  });
});

bot.on(["forward"], (msg) => {
  let { text, photo, caption, media_group_id: mediaGroupId } = msg;
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  let firstName = msg.from.first_name;
  let lastName = msg.from.last_name;
  let name = [firstName, lastName].filter(Boolean).join(" ") || msg.from.username || "";
  let mention = `[${fromId}](tg://user?id=${fromId})`;
  let promise;
  if (msg.chat.type !== "private") {
    return;
  }

  console.log("[foward message]: ", JSON.stringify(msg));

  if (text) {
    bot.sendMessage(fromId, basicAnswer, { replyToMessage: messageId });
    promise = bot.sendMessage(CHAT_ID, `👤 Enviado por: ${name} (${fromId})\n${text}`);
  } else if (photo && mediaGroupId === undefined) {
    bot.sendMessage(fromId, basicAnswer, { replyToMessage: messageId });
    promise = bot.sendPhoto(CHAT_ID, photo[0].file_id, { caption: `👤 Enviado por: ${name} (${fromId})\n${caption || ""}` });
  } else if (mediaGroupId === undefined) {
    promise = bot.sendMessage(fromId, wrongFormat, {
      replyToMessage: messageId,
    });
  } else {
    //mensagens de album de fotos são tratadas pelo plugin copyAlbum
    promise = Promise.resolve();
  }

  return promise.catch((error) => {
    console.log("[error]: ", JSON.stringify(error));
    bot.sendMessage(fromId, errorMessage + JSON.stringify(error), {
      replyToMessage: messageId,
    });
  });
});

bot.on(["document", "audio", "video", "animation"], (msg) => {
  let fromId = msg.from.id;
  let messageId = msg.message_id;
  if (msg.chat.type !== "private") {
    return;
  }

  return bot.sendMessage(fromId, wrongFormat, { replyToMessage: messageId });
});

bot.connect();

http
  .createServer(function(req, res) {
    res.write("Bot's running!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080