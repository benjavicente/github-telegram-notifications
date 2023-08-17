import { githubApp } from '$lib/server/github';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export const POST = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('x-hub-signature-256');
	if (!signature) return new Response('No signature', { status: 401 });

	const verified = await githubApp.webhooks.verify(body, signature);
	if (!verified) return new Response('Invalid signature', { status: 401 });

	const id = request.headers.get('x-github-delivery');
	const name = request.headers.get('x-github-event');
	const payload = JSON.parse(body);

	await githubApp.webhooks.receive({ id, name, payload } as EmitterWebhookEvent);
	return new Response('OK');
};
