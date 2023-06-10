import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
    'packages/postcss-perspective-style-class',
    {
        test: {
            name: 'node',
            environment: 'node',
            globals: true,
        },
    },
])
