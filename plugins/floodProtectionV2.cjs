/*
    Simple flood protection plugin.
    Note: Received Telegram message time accuracy is one second.
*/

const userList = {};

const isFlooding = (fromId, now, interval) => {
  const user = userList[fromId];
  const diff = now - user.lastTime;
  user.lastTime = now;

  if (diff <= interval) {
    if (!user.warned) {
      user.warned = true;
    }
    return true;
  }
  user.warned = false;
  return false;
};

// Export bot module
module.exports = {
  id: "floodProtectionV2",
  defaultConfig: {
    interval: 5, // segundos
    messageFlood: (seconds) =>
      `Too many messages, relax, wait ${seconds} seconds!`,
  },

  plugin(bot, pluginConfig) {
    const interval = Number(pluginConfig.interval) || 1;
    const textFlood = pluginConfig.messageFlood(interval);

    bot.mod("message", (data) => {
      const { message: msg } = data;
      const fromId = msg.from.id;
      const now = new Date(msg.date);
      const user = userList[fromId];
      const { media_group_id: mediaGroupId } = msg;

      const isAlbum = Boolean(mediaGroupId);

      if (user && !isAlbum) {
        const warned = user.warned;
        const flooding = isFlooding(fromId, now, interval);
        if (flooding) {
          if (!warned) {
            bot.sendMessage(fromId, textFlood);
          }
          data.message = {};
        }
      } else if (!user) {
        userList[fromId] = { lastTime: now };
      }

      return data;
    });
  },
};
