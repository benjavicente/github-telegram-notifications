import type { TelegramLink } from '@prisma/client';
import { telegramBot } from './bot';

async function base64Image(fileId: string) {
	const file = await telegramBot.api.getFile(fileId);
	const url = `https://api.telegram.org/file/bot${telegramBot.token}/${file.file_path}`;
	const res = await fetch(url);
	const buffer = await res.arrayBuffer();
	const base64 = Buffer.from(buffer).toString('base64');
	return base64;
}

export async function getLinkedChatMeta<K extends TelegramLink>(link: K) {
	const chat = await telegramBot.api.getChat(link.telegramChatId);
	const base64Img = chat.photo ? await base64Image(chat.photo.small_file_id) : null;

	return { chat: await telegramBot.api.getChat(link.telegramChatId), link, base64Img };
}
