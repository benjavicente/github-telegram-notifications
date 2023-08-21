import { githubApp } from './app';
import { telegramBot } from '../telegram';
import { prisma } from '../prisma';

const getTelegramLinks = (orgId: number) =>
	prisma.linkedGitHubOrg.findMany({
		where: { githubOrgId: orgId },
		include: { telegramLink: true }
	});

const getTelegramLinkedMessages = ({
	orgId,
	entityType,
	entityId
}: {
	orgId: number;
	entityType: 'issue' | 'discussion';
	entityId: number;
}) =>
	prisma.gitHubEntityTelegramMessage.findMany({
		where: {
			githubEntityType: entityType,
			githubEntityId: entityId,
			linkedGitHubOrg: {
				githubOrgId: orgId
			}
		},
		include: {
			linkedGitHubOrg: {
				include: { telegramLink: true }
			}
		}
	});

githubApp.webhooks.on('discussion.created', async ({ payload }) => {
	if (!payload.organization) return;

	const links = await getTelegramLinks(payload.organization.id);

	for (const link of links) {
		const { message_id } = await telegramBot.api.sendMessage(
			link.telegramLink.telegramChatId,
			`Nueva discusión de <a href="${payload.sender.html_url}">${payload.sender.login}</a>: <a href="${payload.discussion.html_url}">${payload.discussion.title}</a>`,
			{ disable_web_page_preview: true }
		);

		await prisma.gitHubEntityTelegramMessage.create({
			data: {
				telegramMessageId: message_id,
				githubEntityId: payload.discussion.id,
				githubEntityType: 'discussion',
				linkedGitHubOrg: { connect: { id: link.id } }
			}
		});
	}
});

githubApp.webhooks.on('issues.opened', async ({ payload }) => {
	if (!payload.organization) return;

	const links = await getTelegramLinks(payload.organization.id);

	for (const link of links) {
		const { message_id } = await telegramBot.api.sendMessage(
			link.telegramLink.telegramChatId,
			`Nueva issue de <a href="${payload.issue.user.html_url}">${payload.issue.user.login}</a>: <a href="${payload.issue.html_url}">${payload.issue.title}</a>`
		);

		await prisma.gitHubEntityTelegramMessage.create({
			data: {
				telegramMessageId: message_id,
				githubEntityId: payload.issue.id,
				githubEntityType: 'issue',
				linkedGitHubOrg: { connect: { id: link.id } }
			}
		});
	}
});

githubApp.webhooks.on('issue_comment.created', async ({ payload }) => {
	if (!payload.organization) return;

	const messagesToEdit = await getTelegramLinkedMessages({
		orgId: payload.organization.id,
		entityType: 'issue',
		entityId: payload.issue.id
	});

	for (const msg of messagesToEdit) {
		await telegramBot.api.editMessageText(
			msg.linkedGitHubOrg.telegramLink.telegramChatId,
			msg.telegramMessageId,
			`Issue de <a href="${payload.issue.user.html_url}">${payload.issue.user.login}</a>: <a href="${payload.issue.html_url}">${payload.issue.title}</a><br>Último comentario de ${payload.comment.user.login}: <a href="${payload.comment.html_url}">${payload.comment.body}</a>`
		);
	}
});

githubApp.webhooks.on('discussion_comment.created', async ({ payload }) => {
	if (!payload.organization) return;

	const messagesToEdit = await getTelegramLinkedMessages({
		orgId: payload.organization.id,
		entityType: 'issue',
		entityId: payload.discussion.id
	});

	for (const msg of messagesToEdit) {
		await telegramBot.api.editMessageText(
			msg.linkedGitHubOrg.telegramLink.telegramChatId,
			msg.telegramMessageId,
			`Discusión de <a href="${payload.discussion.user.html_url}">${payload.discussion.user.login}</a>: <a href="${payload.discussion.html_url}">${payload.discussion.title}</a><br>Último comentario de ${payload.comment.user.login}: <a href="${payload.comment.html_url}">${payload.comment.body}</a>`
		);
	}
});
