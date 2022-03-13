import { expect } from 'chai';
import { DevUtils, GitInfoKey } from '../src/dev-utils';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FsUtils } from '@handy-common-utils/fs-utils';

const TMP_DIR = 'tmp';
describe('DevUtils', () => {
  describe('generateApiDocsAndUpdateReadme(...)', () => {
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

  describe('getGitInfo(...)', () => {
    it('should be able to get all Git information', async function () {
      this.timeout(10000);
      const info = await DevUtils.getGitInfo();
      console.log(info);
      expect(info).to.be.an('object');
      expect(info.repository).to.be.not.empty;
      expect(info.commitIdShort).to.be.not.empty;
      expect(info.commitIdShort!.length).to.be.lessThan(10);
      expect(info.commitIdLong).to.be.not.empty;
      expect(info.commitIdLong!.length).to.be.greaterThan(30);
      expect(info.branch).to.be.not.empty;
      expect(info.isDirty).to.be.a('boolean');
      expect(info.describe).to.be.not.empty;
      expect(info.describeLight).to.be.not.empty;
      expect(info.tags).to.be.an('array');
      expect(info.tags!.length).to.be.greaterThanOrEqual(1);
      expect(info.tag).to.be.a('string');
      expect(info.tag).to.be.not.empty;
      expect(info.tag).to.equal(info.tags![0]);
      expect(info.message).to.be.not.empty;
      expect(info.messageSubject).to.be.not.empty;
      expect(info.messageBody).to.be.a('string');
      // could be undefined in CI:
      // expect(info.user).to.be.not.empty;
      // expect(info.email).to.be.not.empty;
    });
    it('should be able to get Git information as whitelisted', async function () {
      this.timeout(10000);
      const whitelist: GitInfoKey[] = ['repository', 'branch', 'commitIdShort'];
      const info = await DevUtils.getGitInfo(whitelist);
      console.log(info);
      console.log(process.env);
      expect(info).to.be.an('object');
      expect(info.repository).to.be.not.empty;
      expect(info.commitIdShort).to.be.not.empty;
      expect(info.commitIdShort!.length).to.be.lessThan(10);
      expect(info.commitIdLong).to.not.exist;
      expect(info.branch).to.be.not.empty;

      expect(Object.keys(info)).to.have.members(whitelist);
      expect(whitelist).to.have.members(Object.keys(info));
    });
  });
});
