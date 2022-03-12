# @handy-common-utils/dev-utils

Tool chain utilities for the convenience of developers.

[![Version](https://img.shields.io/npm/v/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![CI](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/dev-utils/branch/master/graph/badge.svg?token=K92AF9D201)](https://codecov.io/gh/handy-common-utils/dev-utils)


## How to use

Normally you don't use this package directly.
Instead, you add `@handy-common-utils/dev-dependencies`as a dev dependency (which in turn depends on this package):

```sh
npm install -D @handy-common-utils/dev-dependencies
```

After installation, the command line `generate-api-docs-and-update-readme` will be available in your project.
This command line can update the `<!--` `API start` `-->...<!--` `API end` `-->` section
in your `README.md` with generated API documentation.

You can use optional command line arguments to customise the behaviour of `generate-api-docs-and-update-readme`:

1. Path of the readme.md file. The path must ends with ".md" (case insensitive). The file would be modified. Default: `README.md`.
2. Entry points for generating API documentation. Multiple entry points can be specified by joining them with comma (`,`). Default: `./src`.
3. path of the directory for storing generated intemediate documentation files. This directory would not be cleaned up. Default: `api-docs`.

These arguments must be specified in the order as shown above.

# How to contribute

Please note that for avoidding peer dependency `serverless` to be included,
bundled dependency `serverless-plugin-git-variables` was installed with additional option:

```sh
npm i serverless-plugin-git-variables --legacy-peer-deps
```

# API

<!-- API start -->
<a name="readmemd"></a>

@handy-common-utils/dev-utils

## @handy-common-utils/dev-utils

### Table of contents

#### Modules

- [dev-utils](#modulesdev_utilsmd)

## Classes


<a name="classesdev_utilsdevutilsmd"></a>

[@handy-common-utils/dev-utils](#readmemd) / [dev-utils](#modulesdev_utilsmd) / DevUtils

### Class: DevUtils

[dev-utils](#modulesdev_utilsmd).DevUtils

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Methods

- [generateApiDocsAndUpdateReadme](#generateapidocsandupdatereadme)
- [generateApiDocsMd](#generateapidocsmd)

#### Constructors

##### constructor

• **new DevUtils**()

#### Methods

##### generateApiDocsAndUpdateReadme

▸ `Static` **generateApiDocsAndUpdateReadme**(`readmeLocation?`, `entryPoints?`, `apiDocDir?`, `typeDocOptions?`): `Promise`<`void`\>

Generate API documentation and insert it into README.md file.

**`example`**
```javascript

DevUtils.generateApiDocsAndUpdateReadme(readmePath, entryPoints, apiDocDir);

```
###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `readmeLocation` | `string` | `README_MD_FILE` | location of the README.md file |
| `entryPoints` | `string`[] | `undefined` | Entry points for generating API documentation |
| `apiDocDir` | `string` | `API_DOCS_DIR` | temporary directory for storing intemediate documenation files |
| `typeDocOptions?` | `Partial`<`Omit`<`TypeDocOptions`, ``"entryPoints"`` \| ``"out"``\>\> | `undefined` | Options for TypeDoc |

###### Returns

`Promise`<`void`\>

Promise of void

___

##### generateApiDocsMd

▸ `Static` **generateApiDocsMd**(`entryPoints?`, `apiDocDir?`, `options?`): `Promise`<`void`\>

###### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `entryPoints` | `string`[] | `undefined` |
| `apiDocDir` | `string` | `API_DOCS_DIR` |
| `options?` | `Partial`<`Omit`<`TypeDocOptions`, ``"entryPoints"`` \| ``"out"``\>\> | `undefined` |

###### Returns

`Promise`<`void`\>

## Modules


<a name="modulesdev_utilsmd"></a>

[@handy-common-utils/dev-utils](#readmemd) / dev-utils

### Module: dev-utils

#### Table of contents

##### Classes

- [DevUtils](#classesdev_utilsdevutilsmd)
<!-- API end -->