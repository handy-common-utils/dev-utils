import { CliApplication } from 'typedoc';
import concatMd from 'concat-md';
import { FsUtils } from '@handy-common-utils/fs-utils';

const API_DOCS_DIR = 'api-docs';
const README_MD_FILE = 'README.md';

export abstract class DevUtils {
  static async generateApiDocsMd(): Promise<void> {
    const tdCli = new CliApplication();
    tdCli.bootstrap({
      inputFiles: ['./src'],
      out: API_DOCS_DIR,
      mode: 'file',
      readme: 'none',
      plugin: ['typedoc-plugin-markdown'],
      disableSources: true,
      excludePrivate: true,
    });
  }

  static async generateApiDocsAndUpdateReadme(): Promise<void> {
    DevUtils.generateApiDocsMd();
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
