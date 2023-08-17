import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		plugin(({ addComponents, theme }) => {
			addComponents({
				'.btn': {
					'text-align': 'center',
					border: `${theme('borderWidth.2')} solid ${theme('borderColor.gray.500')}`,
					padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
					background: theme('colors.gray.800'),
					'border-radius': theme('borderRadius.lg')
				}
			});
		})
	]
};
