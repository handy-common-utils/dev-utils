import { Application, TypeDocReader, TSConfigReader, TypeDocOptions } from 'typedoc';
import concatMd from 'concat-md';
import { FsUtils } from '@handy-common-utils/fs-utils';
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
      ...options,
    });

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
    const apiDocsContentPromise = concatMd(apiDocDir, {
      toc: false,
      decreaseTitleLevels: true,
      dirNameAsTitle: true,
      startTitleLevelAt: 2,
    })
    .then(content => `<!-- API start -->${content}<!-- API end -->`)
    .then(content => FsUtils.escapeRegExpReplacement(content));
    await FsUtils.replaceInFile(readmeLocation, /<!-- API start -->([\s\S]*)<!-- API end -->/m, () => apiDocsContentPromise);
    await FsUtils.addSurroundingInFile(readmeLocation, /\*\*`example`\*\*([\s\S]*?)###/gm, '**`example`**\n```javascript\n', '```\n###');
  }

  static async getGitInfo(whitelistKeys?: GitInfoKey[], checkEnvironmentVariables = true): Promise<Partial<GitInfo>> {
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
    const info = {} as Partial<GitInfo>;
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
      } catch {
        // do nothing
      }
    }));
    return info;
  }
}
