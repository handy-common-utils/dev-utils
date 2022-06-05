/**
 * ## Re-exports
 *
 * ### Functions
 *
 * - [generateApiDocsMd = DevUtils.generateApiDocsMd](../classes/dev_utils.DevUtils.md#generateApiDocsMd)
 * - [generateApiDocsAndUpdateReadme = DevUtils.generateApiDocsAndUpdateReadme](../classes/dev_utils.DevUtils.md#generateapidocsandupdatereadme)
 * - [getGitInfo = DevUtils.getGitInfo](../classes/dev_utils.DevUtils.md#getGitInfo)
 * - [loadConfiguration = DevUtils.loadConfiguration](../classes/dev_utils.DevUtils.md#loadConfiguration)
 *
 * ## Exports
 *
 * @module
 */
import { Application, TypeDocReader, TSConfigReader, TypeDocOptions } from 'typedoc';
import concatMd from 'concat-md';
import * as fs from 'fs-extra';
import * as path from 'path';
import YAML from 'yaml';
import mergeDeep from 'lodash/merge';
import { FsUtils } from '@handy-common-utils/fs-utils';
import { convertRenderedPropertiesToTables } from './utils/api-docs-utils';
const ServerlessGitVariables = require('serverless-plugin-git-variables');

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
   * suject of the commit message, as `git log -1 --pretty=%s`
   */
  messageSubject: string;
  /**
   * body of the commit message, as `git log -1 --pretty=%b`
   */
  messageBody: string;
}

export type GitInfoKey = keyof GitInfo;

const configurtionParsers = {
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
  shouldCheckAncestorDir: (level: number, dirName: string, dirAbsolutePath: string) => boolean;
  /**
   * File extensions that should be picked up. It is an object. For each property, the key is the file extension, the value is the file/parser type.
   */
  extensions: Record<string, keyof typeof configurtionParsers>;
  /**
   * Encoding of the configuration files
   */
  encoding: BufferEncoding;
  /**
   * Function for merging the configurations from different files.
   * It is supposed to merge all arguments from left to right (the one on the right overrides the one on the left).
   */
  merge: (...objs: T[]) => T;
}

export abstract class DevUtils {
  static async generateApiDocsMd(entryPoints = ['./src'], apiDocDir = API_DOCS_DIR, options?: Partial<Omit<TypeDocOptions, 'out'|'entryPoints'>>): Promise<void> {
    const app = new Application();
    // app.options.addReader(new ArgumentsReader(0));
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());
    // tdCli.options.addReader(new ArgumentsReader(300));

    app.bootstrap({
      entryPoints,
      out: apiDocDir,
      readme: 'none',
      disableSources: true,
      excludePrivate: true,
      excludeExternals: true,
      entryPointStrategy: 'expand',
      // https://www.npmjs.com/package/typedoc-plugin-markdown
      hideBreadcrumbs: true,
      hideInPageTOC: true,
      namedAnchors: false,
      ...options,
    } as Partial<TypeDocOptions>);

    const project = app.convert()!;
    await app.generateDocs(project, API_DOCS_DIR);
  }

  /**
   * Generate API documentation and insert it into README.md file.
   * @param readmeLocation location of the README.md file
   * @param entryPoints Entry points for generating API documentation
   * @param apiDocDir temporary directory for storing intemediate documenation files
   * @param typeDocOptions Options for TypeDoc
   * @returns Promise of void
   * @example
   * DevUtils.generateApiDocsAndUpdateReadme(readmePath, entryPoints, apiDocDir);
   */
  static async generateApiDocsAndUpdateReadme(readmeLocation = README_MD_FILE,
    entryPoints = ['./src'], apiDocDir = API_DOCS_DIR, typeDocOptions?: Partial<Omit<TypeDocOptions, 'out'|'entryPoints'>>,
  ): Promise<void> {
    await DevUtils.generateApiDocsMd(entryPoints, apiDocDir, typeDocOptions);

    // if there's only one module, use its .md as README.md
    let elevatedModuleMdFileName;
    const moduleMdFileDir = path.join(apiDocDir, 'modules');
    if (fs.existsSync(moduleMdFileDir)) {
      const moduleMdFiles = fs.readdirSync(moduleMdFileDir);
      if (moduleMdFiles.length === 1) {
        elevatedModuleMdFileName = moduleMdFiles[0];
        const moduleMdFile = path.join(moduleMdFileDir, elevatedModuleMdFileName);
        const readmeMdFile = path.join(apiDocDir, 'README.md');
        fs.moveSync(moduleMdFile, readmeMdFile, { overwrite: true });
        // fix links
        await FsUtils.replaceInFile(readmeMdFile, /]\(\.\.\//g, '](');
        await FsUtils.replaceInFile(readmeMdFile, new RegExp(`]\\(${elevatedModuleMdFileName}#`, 'g'), '](#');
      }
    }

    const apiDocsContentPromise = concatMd(apiDocDir, {
      toc: false,
      decreaseTitleLevels: true,
      dirNameAsTitle: true,
      startTitleLevelAt: 2,
    })
    .then(content => content.replace(/##+ Table of contents\n/g, ''))
    .then(content => convertRenderedPropertiesToTables(content))
    .then(content => `<!-- API start -->${content}<!-- API end -->`)
    .then(content => FsUtils.escapeRegExpReplacement(content));
    await FsUtils.replaceInFile(readmeLocation, /<!-- API start -->([\s\S]*)<!-- API end -->/m, () => apiDocsContentPromise);
    if (elevatedModuleMdFileName) {
      await FsUtils.replaceInFile(readmeLocation, new RegExp(`]\\(\\.\\./modules/${elevatedModuleMdFileName}\\)`, 'g'), '](#readmemd)');
    }
    await FsUtils.addSurroundingInFile(readmeLocation, /\*\*`example`\*\*([\s\S]*?)###/gm, '**`example`**\n```javascript\n', '```\n###');
  }

  /**
   * Get Git related information. This function relies on the existence of Git command line.
   *
   * By default all possible information will be returned, but this can be overriden by
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
    const slsGitVars = new ServerlessGitVariables({});
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
    const info = {} as Partial<GitInfo> & {errors: any[]};
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
    shouldCheckAncestorDir: (() => false) as (level: number, dirName: string, dirAbsolutePath: string) => boolean,
    extensions: {
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.json': 'json',
    },
    encoding: 'utf8',
    merge: (...objs: any[]) => mergeDeep({}, ...objs),
  };

  /**
   * Load configuration from YAML and/or JSON files.
   * This function is capable of reading multiple configuration files from the same directory and/or a series of directories, and combine the configurations.
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
   *        3.4.1 Three parameters are passed to the function: level (the immedicate parent directory has the leve value 1), basename of the directory, absolute path of the directory. \
   * 4. Configurtions in child directories override configurations in parent directories. \
   *
   * Other options: \
   * `encoding`: encoding used when reading the file, default is 'utf8' \
   * `merge`: the function for merging configurations, the default implementation uses lodash/merge \
   *
   * @param fileNameBase Base part of the file name, usually this is the file name without extension, but you can also be creative.
   * @param overrideOptions Options that would be combined with default options.
   * @returns The combined configuration, or undefined if no configuration file can be found/read.
   */
  static loadConfiguration<T = any>(fileNameBase: string, overrideOptions?: Partial<LoadConfigurationOptions<T>>): T | undefined {
    const options = { ...DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION, ...overrideOptions };
    const results = [];

    let { dir } = options;
    let dirName = path.basename(dir);
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
        const parse = configurtionParsers[fileType];
        if (!parse) {
          throw new Error(`No parser for file extension "${extension}" as type "${fileType}", is it caused by a typo in options.extensions?`);
        }
        try {
          const fileContentObj = parse(fileContent);
          results.unshift(fileContentObj);
        } catch (error: any) {
          throw new Error(`Unable to parse the content in "${filePath}" as "${fileType}": ${error?.message}`);
        }
      }

      dir = path.resolve(dir, '..');
      dirName = path.basename(dir);
      ++level;
    } while (options.shouldCheckAncestorDir(level, dirName, dir));

    if (results.length === 0) {
      return undefined;
    }
    return options.merge(...results) as T;
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
