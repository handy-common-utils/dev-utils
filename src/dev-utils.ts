/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable unicorn/prefer-string-slice */
/* eslint-disable unicorn/switch-case-braces */
/* eslint-disable default-param-last */

/**
 * ## Re-exports
 *
 * ### Functions
 *
 * - [generateApiDocsMd = DevUtils.generateApiDocsMd](classes/DevUtils.md#api-generateapidocsmd)
 * - [generateApiDocsAndUpdateReadme = DevUtils.generateApiDocsAndUpdateReadme](classes/DevUtils.md#api-generateapidocsandupdatereadme)
 * - [getGitInfo = DevUtils.getGitInfo](classes/DevUtils.md#api-getgitinfo)
 * - [loadConfiguration = DevUtils.loadConfiguration](classes/DevUtils.md#api-loadconfiguration)
 * - [loadConfigurationWithVariant = DevUtils.loadConfigurationWithVariant](classes/DevUtils.md#api-loadconfigurationwithvariant)
 *
 * ## Exports
 *
 * @module
 */

import type { TypeDocOptions } from 'typedoc' assert { 'resolution-mode': 'import' };

import { FsUtils } from '@handy-common-utils/fs-utils';
import concatMd from 'concat-md';
import * as fs from 'fs';
import mergeDeep from 'lodash/merge';
// eslint-disable-next-line unicorn/import-style
import * as path from 'path';
import YAML from 'yaml';

// eslint-disable-next-line unicorn/prefer-module
const ServerlessGitVariables = require('serverless-plugin-git-variables');
import {
  getSingleSubdirectory,
  replaceAnchorIdWithNameInMdFiles,
  replaceAnchorNameWithId,
} from './utils/api-docs-utils';

const API_DOCS_DIR = 'api-docs';
const README_MD_FILE = 'README.md';

/**
 * Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables
 */
export interface GitInfo {
  /**
   * name of the git repository
   */
  repository: string;
  /**
   * hash of the current commit, a.k.a. commit ID, in short format
   */
  commitIdShort: string;
  /**
   * hash of the current commit, a.k.a. commit ID, in full
   */
   commitIdLong: string;
  /**
   * name of the current branch
   */
  branch: string;
  /**
   * true if the workspace is currently dirty
   */
  isDirty: boolean;
  /**
   * the most recent tag of the repo, evaluates to `git describe --always`
   */
  describe: string;
  /**
   * the most recent tag of the repo, evaluates to `git describe --always --tags`
   */
  describeLight: string;
  /**
   * current Git user's name as configured by `git config user.name ...`
   */
  user: string;
  /**
   * current Git user's email as configured by `git config user.email ...`
   */
  email: string;
  /**
   * tags on the current commit, or sha1/ID of the commit if there's no tag
   */
  tags: string[];
  /**
   * First tag on the current commit, or sha1/ID of the commit if there's no tag
   */
  tag: string;
  /**
   * full git commit message
   */
  message: string;
  /**
   * subject of the commit message, as `git log -1 --pretty=%s`
   */
  messageSubject: string;
  /**
   * body of the commit message, as `git log -1 --pretty=%b`
   */
  messageBody: string;
}

export type GitInfoKey = keyof GitInfo;

const configurationParsers = {
  yaml: (text: string) => YAML.parse(text),
  json: (text: string) => JSON.parse(text),
};

/**
 * Options for loadConfiguration(...) function
 */
export interface LoadConfigurationOptions<T = any> {
  /**
   * In which directory configuration file(s) should be picked up
   */
  dir: string;
  /**
   * Predicate function for deciding whether configuration files in the ancestor directory should be picked up
   */
  shouldCheckAncestorDir: (level: number, dirName: string, dirAbsolutePath: string, consolidatedConfiguration: Partial<T>|undefined, previousDirAbsolutePath: string) => boolean;
  /**
   * File extensions that should be picked up. It is an object. For each property, the key is the file extension, the value is the file/parser type.
   */
  extensions: Record<string, keyof typeof configurationParsers>;
  /**
   * Encoding of the configuration files
   */
  encoding: BufferEncoding;
  /**
   * Function for merging the configurations from different files.
   * It is supposed to merge the object on the right to the object on the left.
   * The function is also supposed to return the modified object on the left.
   */
  merge: (base: T|undefined, override: T|undefined) => T;
}

export abstract class DevUtils {
  static async generateApiDocsMd(entryPoints = ['./src'], apiDocDir = API_DOCS_DIR, options?: Partial<Omit<TypeDocOptions, 'out'|'entryPoints'>>): Promise<void> {
    const { Application, PackageJsonReader, TSConfigReader, TypeDocReader } = await import('typedoc');
    const app = await Application.bootstrapWithPlugins({
      entryPoints,
      out: apiDocDir,
      readme: 'none',
      disableSources: true,
      excludePrivate: true,
      excludeExternals: true,
      entryPointStrategy: 'expand',
      plugin: ['typedoc-plugin-markdown'],
      theme: 'markdown',
      // https://www.npmjs.com/package/typedoc-plugin-markdown
      hideBreadcrumbs: true,
      hidePageHeader: true,
      useHTMLAnchors: true,
      anchorPrefix: 'api-',
      interfacePropertiesFormat: 'table',
      classPropertiesFormat: 'table',
      parametersFormat: 'table',
      indexFormat: 'table',
      typeAliasPropertiesFormat: 'table',
      enumMembersFormat: 'table',
      propertyMembersFormat: 'table',
      typeDeclarationFormat: 'table',
      ...options,
    } as Partial<TypeDocOptions>, [
      new TypeDocReader(),
      new PackageJsonReader(),
      new TSConfigReader(),
    ]);

    const project = await app.convert();
    await app.generateOutputs(project!);
  }

  /**
   * Generate API documentation and insert it into README.md file.
   * @param readmeLocation location of the README.md file
   * @param entryPoints Entry points for generating API documentation
   * @param apiDocDir temporary directory for storing intermediate documentation files
   * @param typeDocOptions Options for TypeDoc
   * @returns Promise of void
   * @example
   * DevUtils.generateApiDocsAndUpdateReadme(readmePath, entryPoints, apiDocDir);
   */
  static async generateApiDocsAndUpdateReadme(readmeLocation = README_MD_FILE,
    entryPoints = ['./src'], apiDocDir = API_DOCS_DIR, typeDocOptions?: Partial<Omit<TypeDocOptions, 'out'|'entryPoints'>>,
  ): Promise<void> {
    await DevUtils.generateApiDocsMd(entryPoints, apiDocDir, typeDocOptions);

    let apiDocMdDir = apiDocDir;
    const singleSubdir = getSingleSubdirectory(apiDocMdDir);
    if (singleSubdir) {
      apiDocMdDir = singleSubdir;
    }

    // For every file under apiDocMdDir, replace <a id="..." /> with <a name="..."></a> because concat-md handles only <a name="..."></a>
    replaceAnchorIdWithNameInMdFiles(apiDocMdDir);

    const apiDocsContentPromise = concatMd(apiDocMdDir, {
      toc: false,
      decreaseTitleLevels: true,
      dirNameAsTitle: true,
      startTitleLevelAt: 2,
    })
    .then(content => content.replaceAll(/##+ Table of contents\n/g, ''))
    // Replace <a name="..." /> with <a id="..."></a> because vscode likes it better
    .then(content => replaceAnchorNameWithId(content))
    .then(content => `<!-- API start -->${content}<!-- API end -->`)
    .then(content => FsUtils.escapeRegExpReplacement(content));
    await FsUtils.replaceInFile(readmeLocation, /<!-- API start -->([\S\s]*)<!-- API end -->/m, () => apiDocsContentPromise);
  }

  /**
   * Get Git related information. This function relies on the existence of Git command line.
   *
   * By default all possible information will be returned, but this can be overridden by
   * specifying `whitelistKeys` argument.
   *
   * If `checkEnvironmentVariables` argument is `true`, then environment variables `GIT_COMMIT` and `GITHUB_SHA`
   * will be checked before trying to identify the commit ID from local Git repository,
   * also environment variables `GIT_LOCAL_BRANCH`, `GIT_BRANCH`, `BRANCH_NAME`, `GITHUB_REF_NAME`
   * will be checked before trying to identify the branch name from local Git repository.
   *
   * This function never throws Error. For example, if user and email have not been configured,
   * they would be undefined in the returned object.
   *
   * @param whitelistKeys keys (property names) in the returned object that values need to be populated
   * @param checkEnvironmentVariables true (default value) if environment variables should be checked
   * @param reportErrors true if errors should be reported in the `errors: any[]` property of the returned object
   * @returns Git related information
   */
  static async getGitInfo(whitelistKeys?: GitInfoKey[], checkEnvironmentVariables = true, reportErrors = false): Promise<Partial<GitInfo>> {
    const slsGitVars = new ServerlessGitVariables({
      service: {
        getAllFunctions: () => [],
        custom: {},
      },
    });
    const allPossibleKeys: GitInfoKey[] = [
      'repository',
      'commitIdShort',
      'commitIdLong',
      'branch',
      'isDirty',
      'describe',
      'describeLight',
      'user',
      'email',
      'tags',
      'tag',
      'message',
      'messageSubject',
      'messageBody',
    ];
    const keys = whitelistKeys ? allPossibleKeys.filter(k => whitelistKeys.includes(k)) : allPossibleKeys;
    const info = {} as {errors: any[]} & Partial<GitInfo>;
    // eslint-disable-next-line complexity
    await Promise.all(keys.map(async key => {
      try {
        switch (key) {
          case 'commitIdShort':
            info[key] = (checkEnvironmentVariables ? (process.env.GIT_COMMIT ?? process.env.GITHUB_SHA)?.substring(0, 7) : undefined) ?? await slsGitVars._getValue('sha1');
            break;
          case 'commitIdLong':
            info[key] = (checkEnvironmentVariables ? (process.env.GIT_COMMIT ?? process.env.GITHUB_SHA) : undefined) ?? await slsGitVars._getValue('commit');
            break;
          case 'branch':
            info[key] = (checkEnvironmentVariables ? (process.env.GIT_LOCAL_BRANCH ?? process.env.GIT_BRANCH ?? process.env.BRANCH_NAME ?? process.env.GITHUB_REF_NAME) : undefined) ?? await slsGitVars._getValue(key);
            break;
          case 'isDirty':
            info[key] = Boolean(await slsGitVars._getValue(key));
            break;
          case 'tags':
            info[key] = (await slsGitVars._getValue(key) as string).split('::');
            break;
          case 'tag':
            info[key] = (await slsGitVars._getValue('tags') as string).split('::')[0];
            break;
          default:
            info[key] = await slsGitVars._getValue(key);
        }
      } catch (error) {
        if (reportErrors) {
          if (!info.errors) {
            info.errors = [];
          }
          info.errors.push(error);
        }
      }
    }));
    return info;
  }

  /**
   * Default options for `loadConfiguration(...)`
   */
  static readonly DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION: LoadConfigurationOptions = {
    dir: '.',
    shouldCheckAncestorDir: () => false,
    extensions: {
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.json': 'json',
    },
    encoding: 'utf8',
    merge: (base: any, override: any) => mergeDeep(base, override),
  };

  /**
   * Load configuration from YAML and/or JSON files.
   * This function is capable of reading multiple configuration files from the same directory and optionally its ancestor directories, and combine the configurations.
   *
   * Internal logic of this function is: \
   * 1. Start from the directory as specified by options.dir (default is ".") \
   * 2. Try to read and parse all the files as specified by `${dir}${options.extensions.<key>}` as type `options.extensions.<value>` \
   *    2.1 Unreadable (non-existing, no permission, etc.) files are ignored \
   *    2.2 File content parsing error would halt the process with an Error \
   *    2.3 Files specified at the top of `options.extensions` overrides those at the bottom \
   *    2.4 Default configuration in `options.extensions` is: ".yaml" as YAML, ".yml" as YAML, ".json" as JSON. You can override it. \
   * 3. Find the parent directory, and use `options.shouldCheckAncestorDir` function to decide if parent directory should be checked. \
   *    3.1 The function won't be called for the starting directory. The first call to this function would be for the parent directory with level=1. \
   *    3.2 If parent directory should be checked, use parent directory and go to step 2 \
   *    3.3 Otherwise finish up \
   *    3.4 Default configuration of `options.shouldCheckAncestorDir` always returns false. You can override it. \
   *        3.4.1 Several parameters are passed to the function: level (the immediate parent directory has the level value 1), basename of the directory, absolute path of the directory, already consolidated/merged configurations, absolute path of the directory containing the last/previous file picked up. \
   * 4. Configurations in child directories override configurations in parent directories. \
   *
   * Other options: \
   * `encoding`: encoding used when reading the file, default is 'utf8' \
   * `merge`: the function for merging configurations, the default implementation uses lodash/merge \
   *
   * @example
   * // Pick up and merge (those to the left overrides those to the right) configurations from: ./my-config.yaml, ./my-config.yml, ./my-config.json
   * const config = DevUtils.loadConfiguration('my-config');
   *
   * // Let .json override .yml and don't try to pick up .yaml
   * const config = DevUtils.loadConfiguration('my-config', { extensions: {
   *   '.json': 'json',
   *   '.yml': 'yaml',
   * } });
   *
   * // Search in parent, grand parent, and great grand parent directories as well
   * const config = DevUtils.loadConfiguration(
   *   'my-config',
   *   {
   *     dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
   *     shouldCheckAncestorDir: (level, _dirName, _dirAbsolutePath) => level <= 3,
   *   },
   * );
   *
   * @param fileNameBase Base part of the file name, usually this is the file name without extension, but you can also be creative.
   * @param overrideOptions Options that would be combined with default options.
   * @returns The combined configuration, or undefined if no configuration file can be found/read.
   */
  static loadConfiguration<T = any>(fileNameBase: string, overrideOptions?: Partial<LoadConfigurationOptions<T>>): T | undefined {
    const options = { ...DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION, ...overrideOptions };
    let consolidatedConfiguration: T | undefined;

    let { dir } = options;
    let dirName = path.basename(dir);
    let previousDir: string;
    let level = 0;
    do {
      for (const extension of Object.keys(options.extensions)) {
        const fileType = options.extensions[extension];
        const filePath = path.join(dir, `${fileNameBase}${extension}`);
        let fileContent;
        try {
          fileContent = fs.readFileSync(filePath, options.encoding);
        } catch {
          // ignore
          continue;
        }
        const parse = configurationParsers[fileType];
        if (!parse) {
          throw new Error(`No parser for file extension "${extension}" as type "${fileType}", is it caused by a typo in options.extensions?`);
        }
        try {
          const fileContentObj = parse(fileContent);
          consolidatedConfiguration = consolidatedConfiguration ? options.merge(fileContentObj, consolidatedConfiguration) : fileContentObj;
          previousDir = path.resolve(dir);
        } catch (error: any) {
          throw new Error(`Unable to parse the content in "${filePath}" as "${fileType}": ${error?.message}`);
        }
      }

      const parentDir = path.resolve(dir, '..');
      if (parentDir === dir) { // fs root
        break;
      }
      dir = parentDir;
      dirName = path.basename(dir);
      ++level;
    } while (options.shouldCheckAncestorDir(level, dirName, dir, consolidatedConfiguration, previousDir!));

    return consolidatedConfiguration;
  }

  /**
   * Load configuration from YAML and/or JSON files with variant suffix.
   * This function is capable of reading multiple configuration files from the same directory and optionally its ancestor directories, and combine the configurations.
   * This function is based on {@link loadConfiguration}.
   * It picks up the specified variant configuration and the base variant configuration from a directory and optionally its ancestor directories,
   * then merge them by overriding the base variant configuration with the specified variant configuration.
   *
   * @param fileNameBase Base part of the file name, for example, `my-config`, `settings`.
   * @param variant Part of the file name that identifies the variant, for example, `.staging`, `-production`, `_test`.
   * When searching for configuration files, it would be inserted between the fileNameBase and the file type suffix.
   * @param baseVariant Part of the file name that identifies the base variant. The default value is `.default`.
   * When searching for configuration files, it would be inserted between the fileNameBase and the file type suffix.
   * @param overrideOptions Options that would be combined with default options.
   * @returns The combined configuration, or undefined if no configuration file can be found/read.
   */
  static loadConfigurationWithVariant<T = any>(fileNameBase: string, variant: string, baseVariant = '.default', overrideOptions?: Partial<LoadConfigurationOptions<T>>): T | undefined {
    const baseConfiguration = DevUtils.loadConfiguration<T>(`${fileNameBase}${baseVariant}`, overrideOptions);
    const variantConfiguration = DevUtils.loadConfiguration<T>(`${fileNameBase}${variant}`, overrideOptions);
    if (baseConfiguration == null && variantConfiguration == null) {
      return undefined;
    }
    return (overrideOptions?.merge ?? DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge)(baseConfiguration, variantConfiguration);
  }
}

/** @ignore */
export const generateApiDocsMd = DevUtils.generateApiDocsMd;
/** @ignore */
export const generateApiDocsAndUpdateReadme = DevUtils.generateApiDocsAndUpdateReadme;
/** @ignore */
export const getGitInfo = DevUtils.getGitInfo;
/** @ignore */
export const loadConfiguration = DevUtils.loadConfiguration;
/** @ignore */
export const loadConfigurationWithVariant = DevUtils.loadConfigurationWithVariant;
