import babel from 'rollup-plugin-babel'

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.js', format: 'cjs' },
		{ file: 'index.mjs', format: 'esm' },
	],
	plugins: [
		babel({
			plugins: ['array-includes'],
			presets: [['@babel/env', { targets: { node: 6 } }]],
		}),
	],
}
