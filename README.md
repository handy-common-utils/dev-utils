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
This command line can update the the `<!--` `API start` `-->...<!--` `API end` `-->` section
in your `README.md` with generated API documentation.

# API

<!-- API start -->
<a name="readmemd"></a>

@handy-common-utils/dev-utils

## @handy-common-utils/dev-utils

### Table of contents

#### Modules

- [bin/generate-api-docs-and-update-readme](#modulesbin_generate_api_docs_and_update_readmemd)
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

\+ **new DevUtils**(): [*DevUtils*](#classesdev_utilsdevutilsmd)

**Returns:** [*DevUtils*](#classesdev_utilsdevutilsmd)

#### Methods

##### generateApiDocsAndUpdateReadme

▸ `Static` **generateApiDocsAndUpdateReadme**(): *Promise*<void\>

**Returns:** *Promise*<void\>

___

##### generateApiDocsMd

▸ `Static` **generateApiDocsMd**(): *Promise*<void\>

**Returns:** *Promise*<void\>

## Modules


<a name="modulesbin_generate_api_docs_and_update_readmemd"></a>

[@handy-common-utils/dev-utils](#readmemd) / bin/generate-api-docs-and-update-readme

### Module: bin/generate-api-docs-and-update-readme


<a name="modulesdev_utilsmd"></a>

[@handy-common-utils/dev-utils](#readmemd) / dev-utils

### Module: dev-utils

#### Table of contents

##### Classes

- [DevUtils](#classesdev_utilsdevutilsmd)
<!-- API end -->