import { githubApp } from '$lib/server/github';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	const { url, state } = githubApp.oauth.getWebFlowAuthorizationUrl({});
	cookies.set('github_oauth_state', state, { maxAge: 1800, sameSite: 'strict' });
	throw redirect(302, url);
};
