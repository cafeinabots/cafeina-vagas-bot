import { Context } from 'grammy';
import { helpMessage, welcomeMessage } from '../../responses/messages';

export const start = async (ctx: Context) => {
  await ctx.reply(welcomeMessage, { parse_mode: 'HTML' });
};
export const help = async (ctx: Context): Promise<void> => {
  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
};
