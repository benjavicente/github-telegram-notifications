import { telegramBot } from '$lib/server/telegram';
import { webhookCallback } from 'grammy';

export const POST = webhookCallback(telegramBot, 'sveltekit');
