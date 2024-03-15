require('../src/main');

import { webhookCallback } from 'grammy';
import bot from '../src/bot';

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req, res) {
  await runMiddleware(req, res, webhookCallback(bot, 'http'));
}

export default handler;
