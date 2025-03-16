// @ts-check

/**
 * Module dependencies.
 */

import eslint from '@eslint/js';
import eslintPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import lodash from 'eslint-plugin-lodash';
import mocha from 'eslint-plugin-mocha';
import promise from 'eslint-plugin-promise';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import sortImportsRequires from 'eslint-plugin-sort-imports-requires';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

/**
 * Exports.
 */

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  promise.configs['flat/recommended'],
  jsdoc.configs['flat/contents-typescript-error'],
  jsdoc.configs['flat/logical-typescript-error'],
  jsdoc.configs['flat/stylistic-typescript-error'],
  jsxA11y.flatConfigs.recommended,
  eslintPrettierRecommended,
  {
    ignores: ['**/build', '**/dist', '**/coverage', '**/node_modules']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    plugins: {
      lodash,
      'sort-destructure-keys': sortDestructureKeys,
      'sort-imports-requires': sortImportsRequires,
      'sort-keys-fix': sortKeysFix
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: {
      mocha,
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'mocha/no-nested-tests': 'error',
      'mocha/no-sibling-hooks': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': ['error', { fixable: false }]
    }
  },
  {
    rules: {
      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-this': ['error', 'self'],
      curly: 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'id-length': ['error', { exceptions: ['_', 'e', 'i', 't'] }],
      'id-match': [
        'error',
        '^_$|^[$_a-zA-Z]*[_a-zA-Z0-9]*[a-zA-Z0-9]*$|^[A-Z][_A-Z0-9]+[A-Z0-9]$',
        { onlyDeclarations: true, properties: true }
      ],
      'import/no-named-as-default': 'off',
      'jsdoc/no-defaults': 'off',
      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      'lodash/import-scope': ['error', 'member'],
      'max-depth': 'error',
      'max-params': ['error', 4],
      'new-cap': 'error',
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-console': 'warn',
      'no-div-regex': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'error',
      'no-eq-null': 'off',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-inline-comments': 'error',
      'no-irregular-whitespace': ['error', { skipComments: false, skipStrings: false, skipTemplates: false }],
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      'no-mixed-requires': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-require': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-path-concat': 'error',
      'no-process-env': 'error',
      'no-process-exit': 'error',
      'no-proto': 'error',
      'no-restricted-imports': ['error', { message: "Please use 'lodash-es' instead.", name: 'lodash' }],
      'no-restricted-modules': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-sync': 'error',
      'no-tabs': ['error', { allowIndentationTabs: true }],
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-use-before-define': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'object-shorthand': 'error',
      'operator-assignment': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
        {
          blankLine: 'any',
          next: ['const', 'let', 'var'],
          prev: ['const', 'let', 'var']
        }
      ],
      'prefer-const': 'error',
      'prefer-destructuring': [
        'error',
        {
          AssignmentExpression: { array: false, object: false },
          VariableDeclarator: { array: true, object: true }
        },
        {
          enforceForRenamedProperties: false
        }
      ],
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'promise/prefer-await-to-then': 'error',
      radix: 'error',
      'require-atomic-updates': 'off',
      'require-await': 'error',
      'sort-destructure-keys/sort-destructure-keys': 'error',
      'sort-imports-requires/sort-imports': [
        'error',
        {
          unsafeAutofix: true,
          useOldSingleMemberSyntax: true
        }
      ],
      'sort-imports-requires/sort-requires': [
        'error',
        {
          unsafeAutofix: true,
          useAliases: false,
          useOldSingleMemberSyntax: true
        }
      ],
      'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }],
      'vars-on-top': 'error',
      yoda: 'error'
    }
  }
);
