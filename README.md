# @handy-common-utils/dev-utils

Utilities for the convenience of developers

## How to use

Normally you don't use this package directly.
Instead, you add `@handy-common-utils/dev-dependencies`as a dev dependency:

```sh
npm install -D @handy-common-utils/dev-dependencies
```

That's all.

After installation, the command line `generate-api-docs-and-update-readme` will be available in your project.
This command line can update the `<!--` `API start` `-->...<!--` `API end` `-->` section
in your `README.md` with generated API documentation.

You can use optional command line arguments to customise the behaviour of `generate-api-docs-and-update-readme`:

1. Path of the readme.md file. The path must ends with ".md" (case insensitive). The file would be modified. Default: `README.md`.
2. Entry points for generating API documentation. Multiple entry points can be specified by joining them with comma (`,`). Default: as specified in `package.json`.
3. path of the directory for storing generated intemediate documentation files. This directory would not be cleaned up. Default: `api-docs`.

These arguments must be specified in the order as shown above.

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

▸ `Static` **generateApiDocsAndUpdateReadme**(): `Promise`<`void`\>

###### Returns

`Promise`<`void`\>

___

##### generateApiDocsMd

▸ `Static` **generateApiDocsMd**(): `Promise`<`void`\>

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