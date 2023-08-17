import { Bot, Keyboard } from 'grammy';
import { TELEGRAM_TOKEN } from '$env/static/private';
import { prisma } from '../prisma';

export const telegramBot = new Bot(TELEGRAM_TOKEN);

telegramBot.command('start', async (ctx) => {
	await ctx.reply('👋');
});

telegramBot.command('link', async (ctx) => {
	if (!ctx.from) return;

	// TODO: validate UUID
	// const match = ctx.msg.text.match(/(?<=\/link\s)([\w-]+)/);
	// if (!match) return await ctx.reply('ID invalido');
	// const id = match[0];
	const id = ctx.msg.text.split(' ')[1];

	// Get user ID
	const request = await prisma.telegramLinkRequest.findFirst({
		where: { id }
	});

	if (!request) return await ctx.reply('ID invalido');

	// Ask for group to join
	const chatRequestId = Math.floor(Math.random() * 2 ** 30);

	await prisma.telegramLinkRequest.update({
		where: { id },
		data: { chatRequestId, fromChatId: ctx.chat.id, fromUserId: ctx.from.id }
	});

	const btn = Keyboard.requestChat('Elige un grupo', chatRequestId, {
		bot_is_member: true,
		chat_is_channel: false
	});

	await ctx.reply('Elige un grupo', { reply_markup: { keyboard: [[btn]] } });
});

telegramBot.on('msg:chat_shared', async (ctx) => {
	const { chat_id: chatToJoin, request_id: chatRequestId } = ctx.msg.chat_shared;
	const fromChatId = ctx.chat.id;
	const fromUserId = ctx.from?.id;
	if (!fromUserId) return await ctx.reply('Usuario invalido');

	// See if the bot is in the group
	const botInfo = await telegramBot.api.getMe();
	const botInGroup = await telegramBot.api.getChatMember(chatToJoin, botInfo.id);
	if (botInGroup.status === 'left' || botInGroup.status === 'kicked') {
		await ctx.reply('Grupo invalido');
		return;
	}

	// See if the request exists
	const request = await prisma.telegramLinkRequest.findFirst({
		where: { chatRequestId, fromChatId, fromUserId }
	});

	if (!request) return await ctx.reply('Grupo invalido');

	// See if the group is already linked
	const link = await prisma.telegramLink.findFirst({
		where: { telegramChatId: chatToJoin }
	});
	if (link) return await ctx.reply('Grupo ya vinculado');

	await prisma.$transaction(async ($t) => {
		await $t.telegramLinkRequest.delete({ where: { id: request.id } });
		await $t.telegramLink.create({
			data: {
				ownerGithubId: request.ownerGithubId,
				telegramChatId: chatToJoin
			}
		});
	});

	await ctx.reply('Grupo agregado');
});
