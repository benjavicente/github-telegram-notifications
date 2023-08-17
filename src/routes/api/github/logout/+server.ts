import { githubApp } from '$lib/server/github/app.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, cookies }) => {
	const { github } = locals;
	if (!github) return new Response('Unauthorized', { status: 401 });
	await githubApp.oauth.deleteToken({ token: github.token });
	cookies.delete('github_access_token', { path: '/' });
	cookies.delete('github_refresh_token', { path: '/' });
	throw redirect(302, '/');
};
