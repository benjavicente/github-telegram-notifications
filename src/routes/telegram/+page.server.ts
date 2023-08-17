import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { getLinkedChatMeta } from '$lib/server/telegram/helpers';

export const load = async ({ locals }) => {
	if (!locals.github) throw error(401, 'Unauthorized');

	const { data } = await locals.github.octokit.rest.users.getAuthenticated();

	const linkRequest = await prisma.telegramLinkRequest.findFirst({
		where: {
			ownerGithubId: data.id
		}
	});

	const links = await prisma.telegramLink.findMany({
		where: {
			ownerGithubId: data.id
		}
	});

	const linksWithMeta = await Promise.all(links.map(getLinkedChatMeta));

	return {
		linkRequest,
		linksWithMeta
	};
};

export const actions = {
	createTelegramLink: async ({ locals }) => {
		if (!locals.github) return new Response('Unauthorized', { status: 401 });

		const { data } = await locals.github.octokit.rest.users.getAuthenticated();

		await prisma.telegramLinkRequest.create({
			data: { ownerGithubId: data.id }
		});
	},
	deleteTelegramLinkRequest: async ({ locals }) => {
		if (!locals.github) throw error(401, 'Unauthorized');

		const { data } = await locals.github.octokit.rest.users.getAuthenticated();

		await prisma.telegramLinkRequest.deleteMany({
			where: {
				ownerGithubId: data.id
			}
		});
	},
	deleteTelegramLink: async ({ locals, request }) => {
		if (!locals.github) throw error(401, 'Unauthorized');

		const { data } = await locals.github.octokit.rest.users.getAuthenticated();

		const formData = await request.formData();
		const idString = formData.get('chatId');

		if (typeof idString !== 'string') throw error(400, 'Invalid ID');
		if (!idString.match(/^\d+$/)) throw error(400, 'Invalid ID');

		await prisma.telegramLink.delete({
			where: {
				ownerGithubId: data.id,
				id: parseInt(idString)
			}
		});
	}
};
