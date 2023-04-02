import 'dotenv/config';
import { Bot, Context } from 'grammy';

const development = async (bot: Bot<Context>): Promise<void> => {
  console.log(`Bot starting polling: ${process.env.BOT_TOKEN?.split(':')[0]}`);
  return bot.api
    .deleteWebhook()
    .then(async () => {
      console.log('Bot starting polling: Success');
      await bot.start();
    })
    .catch(console.error);
};

export { development };
