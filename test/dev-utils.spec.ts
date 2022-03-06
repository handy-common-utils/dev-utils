import { expect } from 'chai';
import { DevUtils } from '../src/dev-utils';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FsUtils } from '@handy-common-utils/fs-utils';

const TMP_DIR = 'tmp';
describe('DevUtils', () => {
  it('should be able to generate api docs and update readme', async function () {
    this.timeout(10000);

    const PATTERN_STRING = '<!-- API start -->\nDUMMY\n<!-- API end -->';

    fs.removeSync(TMP_DIR);
    fs.mkdirSync(TMP_DIR);
    const readmePath = path.join(TMP_DIR, 'README.md');
    fs.copyFileSync('README.md', readmePath);
    await FsUtils.replaceInFile(readmePath, /<!-- API start -->([\s\S]*)<!-- API end -->/m, PATTERN_STRING);
    expect(fs.readFileSync(readmePath, 'utf8')).to.include(PATTERN_STRING);

    await DevUtils.generateApiDocsAndUpdateReadme(readmePath);
    const content = fs.readFileSync(readmePath, 'utf8');
    expect(content).to.not.include(PATTERN_STRING);
    expect(content).to.include('generateApiDocsAndUpdateReadme');
    expect(content).to.not.include('Static**');
    expect(content).to.include('**`example`**\n```javascript\n');
  });
});
