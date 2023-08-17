export const load = async ({ locals }) => {
	return {
		github: locals.github ? { token: locals.github.token } : null
	};
};
