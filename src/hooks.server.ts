import { githubApp } from '$lib/server/github';
import type { Octokit } from 'octokit';
import { PrismaClient } from '@prisma/client';

export const handle = async ({ event, resolve }) => {
	// GitHub
	const refreshToken = event.cookies.get('github_refresh_token');
	let token = event.cookies.get('github_access_token');

	if (refreshToken) {
		if (!token) {
			const { authentication } = await githubApp.oauth.refreshToken({ refreshToken });
			token = authentication.token;

			event.cookies.set('github_access_token', token, {
				expires: new Date(authentication.expiresAt),
				httpOnly: true
			});

			event.cookies.set('github_refresh_token', refreshToken, {
				expires: new Date(authentication.refreshTokenExpiresAt),
				httpOnly: true
			});
		}

		event.locals.github = {
			token,
			octokit: (await githubApp.oauth.getUserOctokit({ token })) as Octokit
		};
	}

	// Prisma
	event.locals.prisma = new PrismaClient();

	const response = await resolve(event);

	return response;
};
