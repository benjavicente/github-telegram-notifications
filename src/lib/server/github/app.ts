import {
	GITHUB_APP_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_PRIVATE_KEY,
	GITHUB_WEBHOOK_SECRET
} from '$env/static/private';
import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';

import { App } from 'octokit';
export type { OAuthApp } from 'octokit';

export const githubApp = new App({
	appId: GITHUB_APP_ID,
	oauth: {
		clientId: PUBLIC_GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET
	},
	privateKey: GITHUB_PRIVATE_KEY,
	webhooks: {
		secret: GITHUB_WEBHOOK_SECRET
	}
});
