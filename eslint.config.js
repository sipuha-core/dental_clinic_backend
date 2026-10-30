import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
    tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**'],
    }
);