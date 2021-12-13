module.exports = {
	// 'parser': 'vue-eslint-parser',
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:vue/vue3-essential',
		'@vue/typescript/recommended'
	],
	'parserOptions': {
		'ecmaVersion': 13,
		'sourceType': 'module'
	},
	'plugins': ['vue'],
	'rules': {
		'array-bracket-spacing': ['error', 'never'],
		'camelcase': ['error', { properties: 'always' }],
		'comma-dangle': ['error', 'never'],
		'computed-property-spacing': ['error', 'never'],
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'no-multi-spaces': ["error", { ignoreEOLComments: false }],
		'quotes': ['error', 'single'],
		'semi': ['error', 'never']
	}
}
