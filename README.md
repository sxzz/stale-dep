# stale-dep

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

Check if your `node_modules` is stale.

### Running on-demand

Using `npx` you can run the script without installing it first:

```bash
npx stale-dep
```

## Usage

`stale-dep -u`: store the current dependencies status.

`stale-dep`: check if dependencies status is changed comparing to previous stored.

### Add `stale-dep` to the project

1. Install stale-dep as a dev dependency:

```bash
npm install -D stale-dep
```

2. Add `stale-dep` to your package.json.

```jsonc
{
  "scripts": {
    "build": "stale-dep && some build command",
    "dev": "stale-dep && some dev command",
    // ...
    "postinstall": "stale-dep -u",
  },
}
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022-PRESENT [三咲智子](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/stale-dep.svg
[npm-version-href]: https://npmjs.com/package/stale-dep
[npm-downloads-src]: https://img.shields.io/npm/dm/stale-dep
[npm-downloads-href]: https://www.npmcharts.com/compare/stale-dep?interval=30
[unit-test-src]: https://github.com/sxzz/stale-dep/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/sxzz/stale-dep/actions/workflows/unit-test.yml
