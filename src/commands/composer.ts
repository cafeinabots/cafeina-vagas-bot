import { Composer } from 'grammy';
import { help, start } from './text-only';

const composer = new Composer();

composer.command(['start'], start);

composer.command(['help', 'ajuda'], help);

export default composer;
