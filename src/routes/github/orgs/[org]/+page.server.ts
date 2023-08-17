import { prisma } from '$lib/server/prisma.js';
import { getLinkedChatMeta } from '$lib/server/telegram/helpers.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.github) throw redirect(302, '/api/github/login');

	const { data: user } = await locals.github.octokit.rest.users.getAuthenticated();

	const { data } = await locals.github.octokit.rest.orgs.getMembershipForAuthenticatedUser({
		org: params.org
	});

	const telegramLinks = await prisma.telegramLink.findMany({
		where: {
			ownerGithubId: user.id
		},
		include: {
			linkedGitHubOrgs: true
		}
	});

	const telegramLinksWithMeta = await Promise.all(telegramLinks.map(getLinkedChatMeta));

	return {
		organization: data.organization,
		telegramLinksWithMeta
	};
};

export const actions = {
	activate: async ({ locals, params, request }) => {
		if (!locals.github) throw redirect(302, '/api/github/login');

		const { data } = await locals.github.octokit.rest.orgs.getMembershipForAuthenticatedUser({
			org: params.org
		});

		if (!data) throw redirect(302, '/api/github/login');

		const formData = await request.formData();
		const linkId = formData.get('linkId');
		if (typeof linkId !== 'string') throw error(400, 'Invalid ID');
		if (!linkId.match(/^\d+$/)) throw error(400, 'Invalid ID');

		const telegramLink = await prisma.telegramLink.findFirst({
			where: {
				id: parseInt(linkId)
			}
		});

		if (!telegramLink) throw error(400, 'Invalid ID');

		await prisma.linkedGitHubOrg.create({
			data: {
				telegramLinkId: telegramLink.id,
				githubOrgId: data.organization.id
			}
		});
	},
	deactivate: async ({ locals, params, request }) => {
		if (!locals.github) throw redirect(302, '/api/github/login');

		const { data } = await locals.github.octokit.rest.orgs.getMembershipForAuthenticatedUser({
			org: params.org
		});

		if (!data) throw redirect(302, '/api/github/login');

		const formData = await request.formData();
		const linkId = formData.get('linkId');
		if (typeof linkId !== 'string') throw error(400, 'Invalid ID');
		if (!linkId.match(/^\d+$/)) throw error(400, 'Invalid ID');

		const telegramLink = await prisma.telegramLink.findFirst({
			where: {
				id: parseInt(linkId)
			}
		});

		if (!telegramLink) throw error(400, 'Invalid ID');

		await prisma.linkedGitHubOrg.deleteMany({
			where: {
				telegramLinkId: telegramLink.id,
				githubOrgId: data.organization.id
			}
		});
	}
};
