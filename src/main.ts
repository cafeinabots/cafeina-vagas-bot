import { limit } from '@grammyjs/ratelimiter';
import 'dotenv/config';
import bot from './bot';
import composer from './commands/composer';
import { forwardMessage, forwardPhoto, refuseMessage } from './functions';
import { floodMessage } from './responses/messages';
import { development } from './utils/start';

bot.use(
  limit({
    timeFrame: 3000,
    limit: 5,
    onLimitExceeded: async ctx => {
      await ctx.reply(floodMessage(3));
      await ctx.react('👎');
    },
  }),
);

bot.use(composer);

bot.chatType('private').on(['msg:photo'], forwardPhoto);

bot.chatType('private').on(['msg::url', 'msg:text', 'msg::text_link'], forwardMessage);

bot.chatType('private').on(['msg'], refuseMessage);

process.env.NODE_ENV === 'development' && development(bot);

export {};
