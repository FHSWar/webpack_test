module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'plugin:vue/recommended'
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
		'no-multi-spaces': ['error', { ignoreEOLComments: false }],
		'no-trailing-spaces': 'error',
		'no-unused-vars': 'off',
		'quotes': ['error', 'single'],
		'semi': ['error', 'never'],
		'vue/html-self-closing': ["error", { 'html': { 'void': 'always' } }],
		'vue/max-attributes-per-line': ['error', {
			'singleline': { 'max': 5 },
			'multiline': { 'max': 5 }
		}],
		'vue/singleline-html-element-content-newline': 'off'
	}
}
