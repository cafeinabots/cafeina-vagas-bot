/*
    Simple forward album plugin.
    Note: Beta version.
*/

const userList = {};

// Export bot module
module.exports = {
  id: "copyAlbum",
  defaultConfig: {
    chatId: process.env.CHAT_ID,
    message: "Received album, forwarding...",
    messageFlood: (seconds) =>
      `Too many messages, relax, wait ${seconds} seconds!`,
    messageMaxPhotos: (albumMaxLength) =>
      `Too many photos! Max: ${albumMaxLength}`,
    messageError: "Error while forwarding album!",
    timeout: 3, //espera entre o recebimento da primeira e da última mensagem do álbum (em segundos)
    interval: 30, //mínimo de tempo entre mensagens de álbum (em segundos)
    maxPhotos: 5, //máximo de fotos por mensagem
  },

  plugin(bot, pluginConfig) {
    const chatId = pluginConfig.chatId;
    const text = pluginConfig.message;
    const timeout = pluginConfig.timeout < 3 ? 3 : pluginConfig.timeout;
    const interval = pluginConfig.interval < 30 ? 30 : pluginConfig.interval;
    const maxPhotos = pluginConfig.maxPhotos;
    const textFlood = pluginConfig.messageFlood(interval);
    const textMaxPhotos = pluginConfig.messageMaxPhotos(maxPhotos);
    const textError = pluginConfig.messageError;

    bot.mod("message", (data) => {
      if (Object.keys(data.message).length === 0) {
        return data;
      }

      const mediaGroupId = data.message.media_group_id;
      const isAlbum = Boolean(mediaGroupId);
      const isPrivate = data.message.chat.type === "private";
      if (!isAlbum || !isPrivate) {
        return data;
      }

      const msg = data.message;
      const fromId = msg.from.id;
      const { photo, caption, message_id: messageId } = msg;
      const now = new Date(msg.date);

      const user =
        userList[fromId] ||
        (userList[fromId] = { warned: false, lastTime: now - interval });

      if (photo) {
        const file_id = msg.photo[0].file_id;
        const diff = now - user.lastTime;
        if (!user[mediaGroupId]) {
          user[mediaGroupId] = {};
          user[mediaGroupId].mediaList = [];
          if (diff < interval) {
            if (!user.warned) {
              user.warned = true;
              setTimeout(() => {
                bot.sendMessage(fromId, textFlood);
                setTimeout(() => {
                  user.warned = false;
                }, interval * 1000);
              }, timeout * 1000 + 2000); //espera para enviar o aviso
            }
            delete userList[fromId][mediaGroupId];
            return data;
          }
          user.lastTime = now;
        }

        user[mediaGroupId].mediaList.push({
          type: "photo",
          media: file_id,
          caption: caption || "",
        });
        if (user[mediaGroupId] !== undefined) {
          clearTimeout(user[mediaGroupId].timeoutId);
        }
        user[mediaGroupId].timeoutId = setTimeout(() => {
          if (user[mediaGroupId].mediaList.length <= maxPhotos) {
            bot
              .sendMediaGroup(chatId, user[mediaGroupId].mediaList)
              .then(() => {
                bot.sendMessage(fromId, text, { replyToMessage: messageId });
              })
              .catch((error) => {
                bot.sendMessage(fromId, textError + JSON.stringify(error), {
                  replyToMessage: messageId,
                });
              });

            delete userList[fromId][mediaGroupId];
          } else {
            bot.sendMessage(fromId, textMaxPhotos, {
              replyToMessage: messageId,
            });
          }
        }, timeout * 1000);
      }
      return data;
    });
  },
};
