import { Application, TypeDocReader, TSConfigReader } from 'typedoc';
import concatMd from 'concat-md';
import { FsUtils } from '@handy-common-utils/fs-utils';

const API_DOCS_DIR = 'api-docs';
const README_MD_FILE = 'README.md';

export abstract class DevUtils {
  static async generateApiDocsMd(): Promise<void> {
    const app = new Application();
    // app.options.addReader(new ArgumentsReader(0));
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());
    // tdCli.options.addReader(new ArgumentsReader(300));

    app.bootstrap({
      entryPoints: ['./src'],
      out: API_DOCS_DIR,
      readme: 'none',
      disableSources: true,
      excludePrivate: true,
      excludeExternals: true,
    });

    const project = app.convert()!;
    await app.generateDocs(project, API_DOCS_DIR);
  }

  static async generateApiDocsAndUpdateReadme(): Promise<void> {
    await DevUtils.generateApiDocsMd();
    const apiDocsContentPromise = concatMd(API_DOCS_DIR, {
      toc: false,
      decreaseTitleLevels: true,
      dirNameAsTitle: true,
      startTitleLevelAt: 2,
    })
    .then(content => content.replace(/`Static`\*\*/g, '`Static` **'))
    .then(content => `<!-- API start -->${content}<!-- API end -->`)
    .then(content => FsUtils.escapeRegExpReplacement(content));
    await FsUtils.replaceInFile(README_MD_FILE, /<!-- API start -->([\s\S]*)<!-- API end -->/m, () => apiDocsContentPromise);
    await FsUtils.addSurroundingInFile(README_MD_FILE, /\*\*`example`\*\*([\s\S]*?)###/gm, '**`example`**\n```javascript\n', '```\n###');
  }
}
