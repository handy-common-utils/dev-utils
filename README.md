# @handy-common-utils/dev-utils

Tool chain utilities for the convenience of developers.

[![Version](https://img.shields.io/npm/v/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![CI](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/dev-utils/branch/master/graph/badge.svg?token=K92AF9D201)](https://codecov.io/gh/handy-common-utils/dev-utils)

## Node.js version compatibility

- Test cases have been verified with Node.js versions 10, 14, and 16.
- Compilation targe is ES2017.
- Compatibility with ES2017 has been checked. 

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

## How to use - loadConfiguration(...)

This function (`loadConfiguration(...)` or `DevUtils.loadConfiguration(...)`) would be handy if you need to read configuration from YAML and/or JSON files.

It has these features:

- Find and parse files in the same directory with different extensions. By default it picks up and parses `.yaml`, `.yml` and `.json` files,
  but you can customise file extensions and the order they override each other. You can also customise it to pick up different versions of
  configuration files, such like: `{'-v3.yml': 'yaml', '-v2.yml': 'yaml', '.json': 'json'}`
- Find and parse files in ancestor (parent, grandparent, etc.) directories as well. This is not the default behaviour, but you can provide a predicate function
  to `options.shouldCheckAncestorDir` for customising this behaviour. If configuration files exit in both parent and child directories, the configuration
  in the child directory overrides that in the parent directory.
- Although you may not need it, you can customise how configurations are merged by providing the merge function to `options.merge`. 
- If the configuration file does not exist, it would just be silently ignored.
- If the configuration file has a format/syntax error and can't be parsed, an Error would be thrown.
- If there's no configuration file picked up, it would return `undefined`.

Code examples:

```typescript
// Pick up and merge (those to the left overrides those to the right) configurations from: ./my-config.yaml, ./my-config.yml, ./my-config.json
const config = DevUtils.loadConfiguration('my-config');

// Let .json override .yml and don't try to pick up .yaml
const config = DevUtils.loadConfiguration('my-config', { extensions: {
  '.json': 'json',
  '.yml': 'yaml',
} });

// Pickup and merge (v3 overrides v2 overrides legacy) my-config-v3.yml, my-config-v2.yml, my-config.json
const config = DevUtils.loadConfiguration('my-config', { extensions: {
  '-v3.yml': 'yaml',
  '-v2.yml': 'yaml',
  '.json': 'json',
} });

// Search in parent, grand parent, and great grand parent directories as well
const config = DevUtils.loadConfiguration(
  'my-config',
  {
    dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
    shouldCheckAncestorDir: (level, _dirName, _dirAbsolutePath) => level <= 3,
  },
);
```

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
- [loadConfiguration = DevUtils.loadConfiguration](#loadConfiguration)

### Exports

### Classes

- [DevUtils](#classesdev_utilsdevutilsmd)

### Interfaces

- [GitInfo](#interfacesdev_utilsgitinfomd)
- [LoadConfigurationOptions](#interfacesdev_utilsloadconfigurationoptionsmd)

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

#### Properties

| Property | Description |
| --- | --- |
| ▪ `Static` `Readonly` **DEFAULT\_OPTIONS\_FOR\_LOAD\_CONFIGURATION**: [`LoadConfigurationOptions`](#interfacesdev_utilsloadconfigurationoptionsmd)<`any`\> | Default options for `loadConfiguration(...)` |


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
| `typeDocOptions?` | `Partial`<`Omit`<`TypeDocOptions`, ``"out"`` \| ``"entryPoints"``\>\> | `undefined` | Options for TypeDoc |

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
| `options?` | `Partial`<`Omit`<`TypeDocOptions`, ``"out"`` \| ``"entryPoints"``\>\> | `undefined` |

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

___

##### loadConfiguration

▸ `Static` **loadConfiguration**<`T`\>(`fileNameBase`, `overrideOptions?`): `undefined` \| `T`

Load configuration from YAML and/or JSON files.
This function is capable of reading multiple configuration files from the same directory and/or a series of directories, and combine the configurations.

Internal logic of this function is: \
1. Start from the directory as specified by options.dir (default is ".") \
2. Try to read and parse all the files as specified by `${dir}${options.extensions.<key>}` as type `options.extensions.<value>` \
   2.1 Unreadable (non-existing, no permission, etc.) files are ignored \
   2.2 File content parsing error would halt the process with an Error \
   2.3 Files specified at the top of `options.extensions` overrides those at the bottom \
   2.4 Default configuration in `options.extensions` is: ".yaml" as YAML, ".yml" as YAML, ".json" as JSON. You can override it. \
3. Find the parent directory, and use `options.shouldCheckAncestorDir` function to decide if parent directory should be checked. \
   3.1 The function won't be called for the starting directory. The first call to this function would be for the parent directory with level=1. \
   3.2 If parent directory should be checked, use parent directory and go to step 2 \
   3.3 Otherwise finish up \
   3.4 Default configuration of `options.shouldCheckAncestorDir` always returns false. You can override it. \
       3.4.1 Three parameters are passed to the function: level (the immedicate parent directory has the leve value 1), basename of the directory, absolute path of the directory. \
4. Configurtions in child directories override configurations in parent directories. \

Other options: \
`encoding`: encoding used when reading the file, default is 'utf8' \
`merge`: the function for merging configurations, the default implementation uses lodash/merge \

**`example`**
```javascript

// Pick up and merge (those to the left overrides those to the right) configurations from: ./my-config.yaml, ./my-config.yml, ./my-config.json
const config = DevUtils.loadConfiguration('my-config');

// Let .json override .yml and don't try to pick up .yaml
const config = DevUtils.loadConfiguration('my-config', { extensions: {
  '.json': 'json',
  '.yml': 'yaml',
} });

// Search in parent, grand parent, and great grand parent directories as well
const config = DevUtils.loadConfiguration(
  'my-config',
  {
    dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
    shouldCheckAncestorDir: (level, _dirName, _dirAbsolutePath) => level <= 3,
  },
);

```
###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileNameBase` | `string` | Base part of the file name, usually this is the file name without extension, but you can also be creative. |
| `overrideOptions?` | `Partial`<[`LoadConfigurationOptions`](#interfacesdev_utilsloadconfigurationoptionsmd)<`T`\>\> | Options that would be combined with default options. |

###### Returns

`undefined` \| `T`

The combined configuration, or undefined if no configuration file can be found/read.

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
| • **user**: `string` | current Git user's name as configured by `git config user.name ...`<br><br><br><a name="interfacesdev_utilsloadconfigurationoptionsmd"></a><br><br>### Interface: LoadConfigurationOptions<T\><br><br>[dev-utils](#readmemd).LoadConfigurationOptions<br><br>Options for loadConfiguration(...) function |


#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Properties

| Property | Description |
| --- | --- |
| • **dir**: `string` | In which directory configuration file(s) should be picked up |
| • **encoding**: `BufferEncoding` | Encoding of the configuration files |
| • **extensions**: `Record`<`string`, ``"json"`` \| ``"yaml"``\> | File extensions that should be picked up. It is an object. For each property, the key is the file extension, the value is the file/parser type. |


#### Methods

##### merge

▸ **merge**(`childConfig`, `parentConfig`): `T`

Function for merging the configurations from different files.
It is supposed to merge all arguments from left to right (the one on the right overrides the one on the left).

###### Parameters

| Name | Type |
| :------ | :------ |
| `childConfig` | `T` |
| `parentConfig` | `T` |

###### Returns

`T`

___

##### shouldCheckAncestorDir

▸ **shouldCheckAncestorDir**(`level`, `dirName`, `dirAbsolutePath`, `consolidatedConfiguration`): `boolean`

Predicate function for deciding whether configuration files in the ancestor directory should be picked up

###### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `number` |
| `dirName` | `string` |
| `dirAbsolutePath` | `string` |
| `consolidatedConfiguration` | `undefined` \| `Partial`<`T`\> |

###### Returns

`boolean`
<!-- API end -->