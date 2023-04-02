import { Context } from 'grammy';
import { wrongFormat } from '../responses/messages';

export const refuseMessage = async (ctx: Context) => {
  if (!ctx.msg) {
    return;
  }
  const messageId: number = ctx.msg.message_id;

  await ctx.reply(wrongFormat, { reply_to_message_id: messageId });
};
