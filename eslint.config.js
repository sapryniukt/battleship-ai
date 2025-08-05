import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser
    }
  },

  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,

  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },

  {
    name: 'sapryniukt:nuxt:auto-imports',
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    rules: {
      'no-undef': 'off'
    }
  },

  {
    name: 'sapryniukt:nuxt:components',
    files: ['**/components/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      'vue/multi-word-component-names': 'warn'
    }
  },

  {
    name: 'sapryniukt:nuxt:pages-layouts',
    files: ['**/{pages,layouts}/**/*.{js,ts,jsx,tsx,vue}'],
    rules: {
      'vue/no-multiple-template-root': 'error',
      'vue/multi-word-component-names': 'off'
    }
  },

  {
    ignores: ['**/.*', 'coverage/**', 'test-results/**']
  }
];
