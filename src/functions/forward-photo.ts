import { Context } from 'grammy';
import { modEntities } from '../utils/helper';
import bot from '../bot';
import { basicAnswer } from '../responses/messages';

export const forwardPhoto = async (ctx: Context) => {
  if (!ctx.msg || !ctx.msg.photo) {
    return;
  }
  const photo = ctx.msg.photo[0].file_id;
  const caption = ctx.msg.caption || '';
  const target = process.env.CHAT_ID!;
  const messageId: number = ctx.msg.message_id;
  const { header, newEntities } = modEntities(ctx.msg);
  const newCaption = [header, caption].join('\n');

  await ctx.react('🙏');
  await ctx.reply(basicAnswer, { reply_to_message_id: messageId });
  await bot.api.sendPhoto(target, photo, {
    caption: newCaption,
    caption_entities: newEntities,
  });
};
