import { Application, TypeDocReader, TSConfigReader, TypeDocOptions } from 'typedoc';
import concatMd from 'concat-md';
import { FsUtils } from '@handy-common-utils/fs-utils';

const API_DOCS_DIR = 'api-docs';
const README_MD_FILE = 'README.md';

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
}
