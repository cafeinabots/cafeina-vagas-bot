import { Message, MessageEntity } from 'grammy/types';

export const modEntities = (msg: Message): { header: string; newEntities: MessageEntity[] } => {
  const entities = msg.entities || msg.caption_entities || [];
  const from = msg.from?.id;
  const first_name = msg.from?.first_name || '';
  const last_name = msg.from?.last_name;
  const fullname = [first_name, last_name].filter(Boolean).join(' ');
  const username = msg.from?.username;
  const header = `👤 Enviado por: ${fullname} #id${from}`;
  const headerEntities: MessageEntity[] = [
    {
      offset: 0,
      length: 15,
      type: 'bold',
    },
    {
      offset: 0,
      length: 2,
      type: 'text_mention',
      user: {
        id: from || 0,
        is_bot: false,
        first_name,
        last_name,
        username,
      },
    },
    {
      offset: 15 + (fullname.length + 2),
      length: from?.toString().length || 0,
      type: 'hashtag',
    },
  ];
  entities.forEach(entity => (entity.offset += header.length + 1));
  const newEntities = entities.concat(headerEntities);
  return { header, newEntities };
};
