# @handy-common-utils/fs-utils

File system operations related utilities based on fs-extra

## How to use

First add it as a dependency:

```sh
npm install @handy-common-utils/fs-utils
```

Then you can use it in the code:

```javascript
import { FsUtils } from '../fs-utils';

const [,, filePath, matchPattern, beforeString, afterString] = process.argv;
FsUtils.addSurrounding(filePath, new RegExp(matchPattern), beforeString, afterString);
```

You can either import and use the [class](#classes) as shown above,
or you can import individual [functions](#variables) directly.

# API

<!-- API start -->
<a name="readmemd"></a>

**[@handy-common-utils/dev-utils](#readmemd)**

> Globals

## @handy-common-utils/dev-utils

### Index

#### Classes

* [DevUtils](#classesdevutilsmd)

#### Variables

* [API\_DOCS\_DIR](#api_docs_dir)
* [README\_MD\_FILE](#readme_md_file)

### Variables

#### API\_DOCS\_DIR

• `Const` **API\_DOCS\_DIR**: \"api-docs\" = "api-docs"

___

#### README\_MD\_FILE

• `Const` **README\_MD\_FILE**: \"README.md\" = "README.md"

## Classes


<a name="classesdevutilsmd"></a>

**[@handy-common-utils/dev-utils](#readmemd)**

> [Globals](#readmemd) / DevUtils

### Class: DevUtils

#### Hierarchy

* **DevUtils**

#### Index

##### Methods

* [generateApiDocsAndUpdateReadme](#generateapidocsandupdatereadme)
* [generateApiDocsMd](#generateapidocsmd)

#### Methods

##### generateApiDocsAndUpdateReadme

▸ `Static` **generateApiDocsAndUpdateReadme**(): Promise\<void>

**Returns:** Promise\<void>

___

##### generateApiDocsMd

▸ `Static` **generateApiDocsMd**(): Promise\<void>

**Returns:** Promise\<void>
<!-- API end -->