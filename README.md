# @handy-common-utils/dev-utils

Tool chain utilities for the convenience of developers.

[![Version](https://img.shields.io/npm/v/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![CI](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/dev-utils/branch/master/graph/badge.svg?token=K92AF9D201)](https://codecov.io/gh/handy-common-utils/dev-utils)


## How to use - generating API doc and update README.md

Normally you don't use this package directly (althought it is perfectly fine to use this package alone).
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

## How to use - getGitInfo(...)

`const info = await DevUtils.getGitInfo();` is how you can get Git repository related information,
such as repository, branch, commit id, tags, etc.
It relies on the Git command line tool ('git') to have already been installed.

The function accepts two optinoal arugments. The first one allows you to specify which properties/info to return.
The second one allows you to control whether environment variables should be checked.
By default all properties/info would be returned and environment variables would be checked before falling back to checking local Git repository.

Checking environment variables is handy when you use it in a build/CI/CD pipeline.

Below is an example output:
```javascript
{
  message: 'user and email could be undefined in CI',
  email: 'james.hu.ustc@hotmail.com',
  user: 'James Hu',
  describeLight: 'v1.0.26-3-g6cfaeb8',
  describe: 'v1.0.26-3-g6cfaeb8',
  isDirty: true,
  branch: 'feature/git-info',
  commitIdLong: '6cfaeb8dade5c374c5dcc1e440795aeab3951fa9',
  commitIdShort: '6cfaeb8',
  repository: 'dev-utils',
  messageBody: '',
  messageSubject: 'user and email could be undefined in CI',
  tag: '6cfaeb8',
  tags: [ '6cfaeb8' ]
}
```

Details of the properties in this structure can be found in [the documentation of `GitInfo` interface](#interfacesdev_utilsgitinfomd).

The functionality depends on [serverless-plugin-git-variables](https://github.com/jacob-meacham/serverless-plugin-git-variables). Check it out if you are interested.

# How to contribute

Please note that for avoidding peer dependency `serverless` to be included,
bundled dependency `serverless-plugin-git-variables` was installed with additional option:

```sh
npm i serverless-plugin-git-variables --legacy-peer-deps
```

# API

<!-- API start -->
<a name="readmemd"></a>

## Module: dev-utils

### Re-exports

#### Functions

- [generateApiDocsMd = DevUtils.generateApiDocsMd](#generateApiDocsMd)
- [generateApiDocsAndUpdateReadme = DevUtils.generateApiDocsAndUpdateReadme](#generateapidocsandupdatereadme)
- [getGitInfo = DevUtils.getGitInfo](#getGitInfo)

### Exports

### Classes

- [DevUtils](#classesdev_utilsdevutilsmd)

### Interfaces

- [GitInfo](#interfacesdev_utilsgitinfomd)

### Type aliases

#### GitInfoKey

Ƭ **GitInfoKey**: keyof [`GitInfo`](#interfacesdev_utilsgitinfomd)

## Classes


<a name="classesdev_utilsdevutilsmd"></a>

### Class: DevUtils

[dev-utils](#readmemd).DevUtils

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

___

##### getGitInfo

▸ `Static` **getGitInfo**(`whitelistKeys?`, `checkEnvironmentVariables?`, `reportErrors?`): `Promise`<`Partial`<[`GitInfo`](#interfacesdev_utilsgitinfomd)\>\>

Get Git related information. This function relies on the existence of Git command line.

By default all possible information will be returned, but this can be overriden by
specifying `whitelistKeys` argument.

If `checkEnvironmentVariables` argument is `true`, then environment variables `GIT_COMMIT` and `GITHUB_SHA`
will be checked before trying to identify the commit ID from local Git repository,
also environment variables `GIT_LOCAL_BRANCH`, `GIT_BRANCH`, `BRANCH_NAME`, `GITHUB_REF_NAME`
will be checked before trying to identify the branch name from local Git repository.

This function never throws Error. For example, if user and email have not been configured,
they would be undefined in the returned object.

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `whitelistKeys?` | keyof [`GitInfo`](#interfacesdev_utilsgitinfomd)[] | `undefined` | keys (property names) in the returned object that values need to be populated |
| `checkEnvironmentVariables` | `boolean` | `true` | true (default value) if environment variables should be checked |
| `reportErrors` | `boolean` | `false` | true if errors should be reported in the `errors: any[]` property of the returned object |

###### Returns

`Promise`<`Partial`<[`GitInfo`](#interfacesdev_utilsgitinfomd)\>\>

Git related information

## Interfaces


<a name="interfacesdev_utilsgitinfomd"></a>

### Interface: GitInfo

[dev-utils](#readmemd).GitInfo

Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables

#### Properties

| Property | Description |
| --- | --- |
| • **branch**: `string` | name of the current branch |
| • **commitIdLong**: `string` | hash of the current commit, a.k.a. commit ID, in full |
| • **commitIdShort**: `string` | hash of the current commit, a.k.a. commit ID, in short format |
| • **describe**: `string` | the most recent tag of the repo, evaluates to `git describe --always` |
| • **describeLight**: `string` | the most recent tag of the repo, evaluates to `git describe --always --tags` |
| • **email**: `string` | current Git user's email as configured by `git config user.email ...` |
| • **isDirty**: `boolean` | true if the workspace is currently dirty |
| • **message**: `string` | full git commit message |
| • **messageBody**: `string` | body of the commit message, as `git log -1 --pretty=%b` |
| • **messageSubject**: `string` | suject of the commit message, as `git log -1 --pretty=%s` |
| • **repository**: `string` | name of the git repository |
| • **tag**: `string` | First tag on the current commit, or sha1/ID of the commit if there's no tag |
| • **tags**: `string`[] | tags on the current commit, or sha1/ID of the commit if there's no tag |
| • **user**: `string` | current Git user's name as configured by `git config user.name ...` |

<!-- API end -->