import { limit } from '@grammyjs/ratelimiter';
import 'dotenv/config';
import bot from './bot';
import composer from './commands/composer';
import { forwardMessage, forwardPhoto, refuseMessage } from './functions';
import { floodMessage } from './responses/messages';
import { development } from './utils/start';

bot.use(
  limit({
    // Permite apenas o processamento de 5 mensagens a cada 5 segundos, por usuário.
    timeFrame: 3000,
    limit: 5,
    // Função chamada quando o limite é excedido.
    onLimitExceeded: async ctx => {
      await ctx.reply(floodMessage(3));
    },
  }),
);

bot.use(composer);

bot.chatType('private').on(['msg:photo'], forwardPhoto);

bot.chatType('private').on(['msg::url', 'msg:text', 'msg::text_link'], forwardMessage);

bot.chatType('private').on(['msg'], refuseMessage);

process.env.NODE_ENV === 'development' && development(bot);

export {};
