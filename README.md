# persist

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Vuex Persisted State for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `persist` dependency to your project

```bash
yarn add persist # or npm install persist
```

2. Add `persist` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'persist',

    // With options
    ['persist', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Baker Shamlan <root@xyz.dev>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/persist/latest.svg
[npm-version-href]: https://npmjs.com/package/persist

[npm-downloads-src]: https://img.shields.io/npm/dt/persist.svg
[npm-downloads-href]: https://npmjs.com/package/persist

[github-actions-ci-src]: https://github.com/xyzrepo/persist/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/xyzrepo/persist/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/xyzrepo/persist.svg
[codecov-href]: https://codecov.io/gh/xyzrepo/persist

[license-src]: https://img.shields.io/npm/l/persist.svg
[license-href]: https://npmjs.com/package/persist
