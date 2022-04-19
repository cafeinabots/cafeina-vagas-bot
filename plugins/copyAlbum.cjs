/*
    Simple forward album plugin.
    Note: Beta version.
    userList: {
        44232552342(fromId): {
            warned: false,
            lastTime: undefined,
            53245342345(mediaGroupId): 
                mediaList: [],
                timeoutId: undefined,
            1113232334(mediaGroupId): 
                mediaList: [],
                timeoutId: undefined,
        }
    }
*/

const userList = {};

// Export bot module
module.exports = {
  id: "copyAlbum",
  defaultConfig: {
    chatId: process.env.CHAT_ID,
    message: "Received album, forwarding...",
    messageFlood: "Too many messages, relax!",
    timeout: 3, //segundos
  },

  plugin(bot, pluginConfig) {
    const chatId = pluginConfig.chatId;
    const text = pluginConfig.message;
    const textFlood = pluginConfig.messageFlood;
    const timeout = pluginConfig.timeout < 3 ? 3 : pluginConfig.timeout;

    bot.mod("message", (data) => {
      if (Object.keys(data.message).length === 0) return data;

      const mediaGroupId = data.message.media_group_id;
      const isAlbum = !!mediaGroupId;
      const isPrivate = data.message.chat.type === "private";
      if (!isAlbum || !isPrivate) return data;

      const msg = data.message;
      const fromId = msg.from.id;
      const { photo, caption, message_id: messageId } = msg;
      const now = new Date(msg.date);

      const user = userList[fromId] || (userList[fromId] = { warned: false });

      if (photo) {
        const file_id = msg.photo[0].file_id;
        const diff = now - user.lastTime;
        if (!user[mediaGroupId]) {
          user[mediaGroupId] = {};
          user[mediaGroupId].mediaList = [];
          if (diff < timeout) {
            if (!user.warned) {
              user.warned = true;
              setTimeout(() => {
                bot.sendMessage(fromId, textFlood);
              }, timeout * 1000 + 2000);
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
        if (user[mediaGroupId] !== undefined)
          clearTimeout(user[mediaGroupId].timeoutId);

        user[mediaGroupId].timeoutId = setTimeout(() => {
          bot.sendMediaGroup(chatId, user[mediaGroupId].mediaList);
          bot.sendMessage(fromId, text, { replyToMessage: messageId });
          delete userList[fromId][mediaGroupId];
          if (Object.keys(userList[fromId]).length === 2) {
            delete userList[fromId];
          }
        }, timeout * 1000);
      }
      return data;
    });
  },
};
