# @handy-common-utils/dev-utils

Tool chain utilities for the convenience of developers.

[![Version](https://img.shields.io/npm/v/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/dev-utils.svg)](https://npmjs.org/package/@handy-common-utils/dev-utils)
[![CI](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/dev-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/dev-utils/branch/master/graph/badge.svg?token=K92AF9D201)](https://codecov.io/gh/handy-common-utils/dev-utils)

## Node.js version compatibility

- Test cases have been verified with Node.js versions 18, 20, and 22.
- Compilation target is ES2021.
- Compatibility with ES2021 has been checked. 

## How to use - generating API doc and update README.md

Normally you don't use this package directly (although it is perfectly fine to use this package alone).
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
3. path of the directory for storing generated intermediate documentation files. This directory would not be cleaned up. Default: `api-docs`.

These arguments must be specified in the order as shown above.

## How to use - getGitInfo(...)

`const info = await DevUtils.getGitInfo();` is how you can get Git repository related information,
such as repository, branch, commit id, tags, etc.
It relies on the Git command line tool ('git') to have already been installed.

The function accepts two optional arguments. The first one allows you to specify which properties/info to return.
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

## How to use - loadConfiguration(...) and loadConfigurationWithVariant(...)

The function `loadConfiguration(...)` / `DevUtils.loadConfiguration(...)` would be handy if you need to read configuration from YAML and/or JSON files.

If you have multiple variants of the configurations, such like `settings.default.yml`, `settings.staging.yml`, `settings.production.yml`,
you can use `loadConfigurationWithVariant(...)` or `DevUtils.loadConfigurationWithVariant(...)` instead.

`loadConfiguration(...)` / `DevUtils.loadConfiguration(...)` has these features:

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

`loadConfigurationWithVariant(...)` / `DevUtils.loadConfigurationWithVariant(...)` has these additional features:

- Allows a base variant and an interested variant to be specified
- Overrides the base variant configuration with the interested variant configuration

Code examples:

```typescript
// Pick up and merge (those to the left overrides those to the right) configurations from: ./my-config.yaml, ./my-config.yml, ./my-config.json
const config = DevUtils.loadConfiguration('my-config');

// Pick up and merge ./my-config.default.{yaml,yml,json} with ./my-config.prod.{yaml,yml,json}
const config = DevUtils.loadConfigurationWithVariant('my-config', '.prod');

// Pick up and merge ./my-config-production.{yaml,yml,json} with ./my-config.{yaml,yml,json}
const config = DevUtils.loadConfigurationWithVariant('my-config', '-production', '');

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

Please note that for avoiding peer dependency `serverless` to be included,
bundled dependency `serverless-plugin-git-variables` was installed with additional option:

```sh
npm i serverless-plugin-git-variables --legacy-peer-deps
```

# API

<!-- API start -->
<a name="readmemd"></a>

## dev-utils

### Re-exports

#### Functions

- [generateApiDocsMd = DevUtils.generateApiDocsMd](#api-generateapidocsmd)
- [generateApiDocsAndUpdateReadme = DevUtils.generateApiDocsAndUpdateReadme](#api-generateapidocsandupdatereadme)
- [getGitInfo = DevUtils.getGitInfo](#api-getgitinfo)
- [loadConfiguration = DevUtils.loadConfiguration](#api-loadconfiguration)
- [loadConfigurationWithVariant = DevUtils.loadConfigurationWithVariant](#api-loadconfigurationwithvariant)

### Exports

### Classes

| Class | Description |
| ------ | ------ |
| [DevUtils](#classesdevutilsmd) | - |

### Interfaces

| Interface | Description |
| ------ | ------ |
| [GitInfo](#interfacesgitinfomd) | Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables |
| [LoadConfigurationOptions](#interfacesloadconfigurationoptionsmd) | Options for loadConfiguration(...) function |

### Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [GitInfoKey](#type-aliasesgitinfokeymd) | - |

## Classes


<a id="classesdevutilsmd"></a>

### Class: `abstract` DevUtils

#### Constructors

<a id="api-constructor"></a>

##### Constructor

> **new DevUtils**(): `DevUtils`

###### Returns

`DevUtils`

#### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="api-default_options_for_load_configuration"></a> `DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION` | `readonly` | [`LoadConfigurationOptions`](#interfacesloadconfigurationoptionsmd) | Default options for `loadConfiguration(...)` |

#### Methods

<a id="api-generateapidocsandupdatereadme"></a>

##### generateApiDocsAndUpdateReadme()

> `static` **generateApiDocsAndUpdateReadme**(`readmeLocation`, `entryPoints`, `apiDocDir`, `typeDocOptions?`): `Promise`\<`void`\>

Generate API documentation and insert it into README.md file.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `readmeLocation` | `string` | `README_MD_FILE` | location of the README.md file |
| `entryPoints` | `string`[] | `...` | Entry points for generating API documentation |
| `apiDocDir` | `string` | `API_DOCS_DIR` | temporary directory for storing intermediate documentation files |
| `typeDocOptions?` | `Partial`\<`Omit`\<`TypeDocOptions`, `"entryPoints"` \| `"out"`\>\> | `undefined` | Options for TypeDoc |

###### Returns

`Promise`\<`void`\>

Promise of void

###### Example

```ts
DevUtils.generateApiDocsAndUpdateReadme(readmePath, entryPoints, apiDocDir);
```

***

<a id="api-generateapidocsmd"></a>

##### generateApiDocsMd()

> `static` **generateApiDocsMd**(`entryPoints`, `apiDocDir`, `options?`): `Promise`\<`void`\>

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `entryPoints` | `string`[] | `...` |
| `apiDocDir` | `string` | `API_DOCS_DIR` |
| `options?` | `Partial`\<`Omit`\<`TypeDocOptions`, `"entryPoints"` \| `"out"`\>\> | `undefined` |

###### Returns

`Promise`\<`void`\>

***

<a id="api-getgitinfo"></a>

##### getGitInfo()

> `static` **getGitInfo**(`whitelistKeys?`, `checkEnvironmentVariables?`, `reportErrors?`): `Promise`\<`Partial`\<[`GitInfo`](#interfacesgitinfomd)\>\>

Get Git related information. This function relies on the existence of Git command line.

By default all possible information will be returned, but this can be overridden by
specifying `whitelistKeys` argument.

If `checkEnvironmentVariables` argument is `true`, then environment variables `GIT_COMMIT` and `GITHUB_SHA`
will be checked before trying to identify the commit ID from local Git repository,
also environment variables `GIT_LOCAL_BRANCH`, `GIT_BRANCH`, `BRANCH_NAME`, `GITHUB_REF_NAME`
will be checked before trying to identify the branch name from local Git repository.

This function never throws Error. For example, if user and email have not been configured,
they would be undefined in the returned object.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `whitelistKeys?` | keyof [`GitInfo`](#interfacesgitinfomd)[] | `undefined` | keys (property names) in the returned object that values need to be populated |
| `checkEnvironmentVariables?` | `boolean` | `true` | true (default value) if environment variables should be checked |
| `reportErrors?` | `boolean` | `false` | true if errors should be reported in the `errors: any[]` property of the returned object |

###### Returns

`Promise`\<`Partial`\<[`GitInfo`](#interfacesgitinfomd)\>\>

Git related information

***

<a id="api-loadconfiguration"></a>

##### loadConfiguration()

> `static` **loadConfiguration**\<`T`\>(`fileNameBase`, `overrideOptions?`): `undefined` \| `T`

Load configuration from YAML and/or JSON files.
This function is capable of reading multiple configuration files from the same directory and optionally its ancestor directories, and combine the configurations.

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
       3.4.1 Several parameters are passed to the function: level (the immediate parent directory has the level value 1), basename of the directory, absolute path of the directory, already consolidated/merged configurations, absolute path of the directory containing the last/previous file picked up. \
4. Configurations in child directories override configurations in parent directories. \

Other options: \
`encoding`: encoding used when reading the file, default is 'utf8' \
`merge`: the function for merging configurations, the default implementation uses lodash/merge \

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fileNameBase` | `string` | Base part of the file name, usually this is the file name without extension, but you can also be creative. |
| `overrideOptions?` | `Partial`\<[`LoadConfigurationOptions`](#interfacesloadconfigurationoptionsmd)\<`T`\>\> | Options that would be combined with default options. |

###### Returns

`undefined` \| `T`

The combined configuration, or undefined if no configuration file can be found/read.

###### Example

```ts
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

***

<a id="api-loadconfigurationwithvariant"></a>

##### loadConfigurationWithVariant()

> `static` **loadConfigurationWithVariant**\<`T`\>(`fileNameBase`, `variant`, `baseVariant`, `overrideOptions?`): `undefined` \| `T`

Load configuration from YAML and/or JSON files with variant suffix.
This function is capable of reading multiple configuration files from the same directory and optionally its ancestor directories, and combine the configurations.
This function is based on [loadConfiguration](#api-loadconfiguration).
It picks up the specified variant configuration and the base variant configuration from a directory and optionally its ancestor directories,
then merge them by overriding the base variant configuration with the specified variant configuration.

###### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `fileNameBase` | `string` | `undefined` | Base part of the file name, for example, `my-config`, `settings`. |
| `variant` | `string` | `undefined` | Part of the file name that identifies the variant, for example, `.staging`, `-production`, `_test`. When searching for configuration files, it would be inserted between the fileNameBase and the file type suffix. |
| `baseVariant` | `string` | `'.default'` | Part of the file name that identifies the base variant. The default value is `.default`. When searching for configuration files, it would be inserted between the fileNameBase and the file type suffix. |
| `overrideOptions?` | `Partial`\<[`LoadConfigurationOptions`](#interfacesloadconfigurationoptionsmd)\<`T`\>\> | `undefined` | Options that would be combined with default options. |

###### Returns

`undefined` \| `T`

The combined configuration, or undefined if no configuration file can be found/read.

## Interfaces


<a id="interfacesgitinfomd"></a>

### Interface: GitInfo

Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="api-branch"></a> `branch` | `string` | name of the current branch |
| <a id="api-commitidlong"></a> `commitIdLong` | `string` | hash of the current commit, a.k.a. commit ID, in full |
| <a id="api-commitidshort"></a> `commitIdShort` | `string` | hash of the current commit, a.k.a. commit ID, in short format |
| <a id="api-describe"></a> `describe` | `string` | the most recent tag of the repo, evaluates to `git describe --always` |
| <a id="api-describelight"></a> `describeLight` | `string` | the most recent tag of the repo, evaluates to `git describe --always --tags` |
| <a id="api-email"></a> `email` | `string` | current Git user's email as configured by `git config user.email ...` |
| <a id="api-isdirty"></a> `isDirty` | `boolean` | true if the workspace is currently dirty |
| <a id="api-message"></a> `message` | `string` | full git commit message |
| <a id="api-messagebody"></a> `messageBody` | `string` | body of the commit message, as `git log -1 --pretty=%b` |
| <a id="api-messagesubject"></a> `messageSubject` | `string` | subject of the commit message, as `git log -1 --pretty=%s` |
| <a id="api-repository"></a> `repository` | `string` | name of the git repository |
| <a id="api-tag"></a> `tag` | `string` | First tag on the current commit, or sha1/ID of the commit if there's no tag |
| <a id="api-tags"></a> `tags` | `string`[] | tags on the current commit, or sha1/ID of the commit if there's no tag |
| <a id="api-user"></a> `user` | `string` | current Git user's name as configured by `git config user.name ...` |


<a id="interfacesloadconfigurationoptionsmd"></a>

### Interface: LoadConfigurationOptions\<T\>

Options for loadConfiguration(...) function

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="api-dir"></a> `dir` | `string` | In which directory configuration file(s) should be picked up |
| <a id="api-encoding"></a> `encoding` | `BufferEncoding` | Encoding of the configuration files |
| <a id="api-extensions"></a> `extensions` | `Record`\<`string`, keyof *typeof* `configurationParsers`\> | File extensions that should be picked up. It is an object. For each property, the key is the file extension, the value is the file/parser type. |
| <a id="api-merge"></a> `merge` | (`base`, `override`) => `T` | Function for merging the configurations from different files. It is supposed to merge the object on the right to the object on the left. The function is also supposed to return the modified object on the left. |
| <a id="api-shouldcheckancestordir"></a> `shouldCheckAncestorDir` | (`level`, `dirName`, `dirAbsolutePath`, `consolidatedConfiguration`, `previousDirAbsolutePath`) => `boolean` | Predicate function for deciding whether configuration files in the ancestor directory should be picked up |

## Type Aliases


<a id="type-aliasesgitinfokeymd"></a>

### Type Alias: GitInfoKey

> **GitInfoKey** = keyof [`GitInfo`](#interfacesgitinfomd)
<!-- API end -->