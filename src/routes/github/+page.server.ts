export const load = async ({ locals }) => {
	const { github } = locals;
	if (github) {
		const { data } = await github.octokit.rest.orgs.listForAuthenticatedUser();
		return {
			orgs: data
		};
	} else {
		console.warn('No octokit instance found.');
	}
};
