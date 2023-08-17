import { githubApp } from '$lib/server/github';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ request, cookies }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	if (!code) return new Response('No code', { status: 400 });

	const cookiesState = cookies.get('github_oauth_state');
	const urlState = url.searchParams.get('state');

	if (cookiesState !== urlState) return new Response('Invalid state', { status: 400 });

	const { authentication } = await githubApp.oauth.createToken({ code, state: cookiesState });
	if (!('refreshToken' in authentication)) return new Response('No refresh token', { status: 500 });

	cookies.set('github_access_token', authentication.token, {
		expires: new Date(authentication.expiresAt),
		path: '/'
	});

	cookies.set('github_refresh_token', authentication.refreshToken, {
		expires: new Date(authentication.refreshTokenExpiresAt),
		path: '/'
	});

	cookies.delete('github_oauth_state', { path: '/' });

	throw redirect(302, '/');
};
