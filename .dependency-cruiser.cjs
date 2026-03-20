/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
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
      path: 'node_modules',
    },
    reporterOptions: {
      dot: {
        collapsePattern:
          'node_modules/[^/]+',
      },
    },
  },
};
