import { Context } from 'grammy';
import { modEntities } from '../utils/helper';
import bot from '../bot';
import { basicAnswer } from '../responses/messages';

export const forwardMessage = async (ctx: Context) => {
  if (!ctx.msg) {
    return;
  }
  const text = ctx.msg.text || '';
  const target = process.env.CHAT_ID!;
  const messageId: number = ctx.msg.message_id;
  const { header, newEntities } = modEntities(ctx.msg);
  const newText = [header, text].join('\n');

  await ctx.react('🙏');
  await ctx.reply(basicAnswer, { reply_to_message_id: messageId });
  await bot.api.sendMessage(target, newText, { entities: newEntities });
};
