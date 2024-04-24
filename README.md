# stale-dep [![npm](https://img.shields.io/npm/v/stale-dep.svg)](https://npmjs.com/package/stale-dep)

[![Unit Test](https://github.com/sxzz/stale-dep/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/stale-dep/actions/workflows/unit-test.yml)

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

[MIT](./LICENSE) License © 2022 [三咲智子](https://github.com/sxzz)
