/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$',
          '[.]d[.]ts$',
          '[.]types[.]ts$',
          '(^|/)tsconfig[.]json$',
          '(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$',
        ],
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: [
          '^v8/tools/codemap$',
          '^v8/tools/consarray$',
          '^v8/tools/csvparser$',
          '^v8/tools/logreader$',
          '^v8/tools/profile_view$',
          '^v8/tools/profile$',
          '^v8/tools/SourceMap$',
          '^v8/tools/splaytree$',
          '^v8/tools/tickprocessor-driver$',
          '^v8/tools/tickprocessor$',
          '^node-inspect/lib/_inspect$',
          '^node-inspect/lib/internal/inspect_client$',
          '^node-inspect/lib/internal/inspect_repl$',
          '^async_hooks$',
          '^punycode$',
          '^domain$',
          '^constants$',
          '^sys$',
          '^_linklist$',
          '^_stream_wrap$',
        ],
      },
    },
    {
      name: 'not-to-deprecated',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
        pathNot: ['(^|/)@internationalized/date/'],
      },
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      from: {
        pathNot: [
          '[.](?:spec|test|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
          '(^|/)__test__/',
        ],
      },
      to: {
        couldNotResolve: true,
        pathNot: ['^src/__generated__/', '^storybook/test$'],
      },
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'warn',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'not-to-spec',
      severity: 'error',
      from: {},
      to: {
        path: '[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
      },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      from: {
        path: '^packages/frontend/src/',
        pathNot: [
          '[.](?:spec|test|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
          '(^|/)__test__/',
          '^packages/frontend/src/storybook/',
        ],
      },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['type-only'],
        pathNot: ['node_modules/@types/'],
      },
    },
    {
      name: 'optional-deps-used',
      severity: 'info',
      from: {},
      to: {
        dependencyTypes: ['npm-optional'],
      },
    },
    {
      name: 'peer-deps-used',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['npm-peer'],
      },
    },
    {
      name: 'no-components-to-pages',
      comment: 'Frontend components must not depend on frontend pages.',
      severity: 'error',
      from: {
        path: '^packages/frontend/src/components/',
        pathNot: '(__test__/|\\.test\\.|\\.stories\\.)',
      },
      to: {
        path: '^(packages/frontend/src/pages/|src/pages/)',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: ['node_modules'],
    },
    detectProcessBuiltinModuleCalls: true,
    combinedDependencies: true,
    tsConfig: {
      fileName: `${__dirname}/packages/frontend/tsconfig.app.json`,
    },
    skipAnalysisNotInRules: true,
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
    },
  },
};
