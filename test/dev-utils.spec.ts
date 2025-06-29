/* eslint-disable unicorn/prefer-node-protocol */
import { FsUtils } from '@handy-common-utils/fs-utils';
import { expect } from 'chai';
import * as fs from 'fs';
// eslint-disable-next-line unicorn/import-style
import * as path from 'path';

import { DevUtils, GitInfoKey } from '../src/dev-utils';

const TMP_DIR = 'tmp';
describe('DevUtils', () => {
  describe('generateApiDocsAndUpdateReadme(...)', () => {
    it('should be able to generate api docs and update readme', async function () {
      this.timeout(10000);

      const PATTERN_STRING = '<!-- API start -->\nDUMMY\n<!-- API end -->';

      if (fs.existsSync(TMP_DIR)) {
        fs.rmSync(TMP_DIR, { recursive: true });
      }
      fs.mkdirSync(TMP_DIR);
      const readmePath = path.join(TMP_DIR, 'README.md');
      // eslint-disable-next-line node/no-unsupported-features/node-builtins
      fs.copyFileSync('README.md', readmePath);
      await FsUtils.replaceInFile(readmePath, /<!-- API start -->([\S\s]*)<!-- API end -->/m, PATTERN_STRING);
      expect(fs.readFileSync(readmePath, 'utf8')).to.include(PATTERN_STRING);

      await DevUtils.generateApiDocsAndUpdateReadme(readmePath);
      const content = fs.readFileSync(readmePath, 'utf8');
      expect(content).to.not.include(PATTERN_STRING);
      expect(content).to.include('generateApiDocsAndUpdateReadme');
      expect(content).to.not.include('Static**');
      expect(content).to.include('###### Example\n\n```ts\n');
    });
  });

  describe('getGitInfo(...)', () => {
    it('should be able to get all Git information', async function () {
      this.timeout(10000);
      const info = await DevUtils.getGitInfo();
      // console.log(info);
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
      // console.log(info);
      expect(info).to.be.an('object');
      expect(info.repository).to.be.not.empty;
      expect(info.commitIdShort).to.be.not.empty;
      expect(info.commitIdShort!.length).to.be.lessThan(10);
      expect(info.commitIdLong).to.not.exist;
      expect(info.branch).to.be.not.empty;

      expect(Object.keys(info)).to.have.members(whitelist);
      expect(whitelist).to.have.members(Object.keys(info));
    });
    it('should environment variables GIT_COMMIT and GITHUB_SHA be effective', async () => {
      const whitelist: GitInfoKey[] = ['commitIdShort', 'commitIdLong'];
      const fakeCommitIdLong = 'this_is_a_fake_commit_id_which_is_quite_long';
      // eslint-disable-next-line unicorn/prefer-string-slice
      const fakeCommitIdShort = fakeCommitIdLong.substring(0, 7);

      let info = await DevUtils.getGitInfo(whitelist);
      expect(info.commitIdShort).to.not.equal(fakeCommitIdShort);
      expect(info.commitIdLong).to.not.equal(fakeCommitIdLong);

      process.env.GITHUB_SHA = fakeCommitIdLong;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.commitIdShort).to.equal(fakeCommitIdShort);
      expect(info.commitIdLong).to.equal(fakeCommitIdLong);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.commitIdShort).to.not.equal(fakeCommitIdShort);
      expect(info.commitIdLong).to.not.equal(fakeCommitIdLong);

      process.env.GITHUB_SHA = 'wrong';
      process.env.GIT_COMMIT = fakeCommitIdLong;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.commitIdShort).to.equal(fakeCommitIdShort);
      expect(info.commitIdLong).to.equal(fakeCommitIdLong);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.commitIdShort).to.not.equal(fakeCommitIdShort);
      expect(info.commitIdLong).to.not.equal(fakeCommitIdLong);
    });
    it('should environment variables GIT_LOCAL_BRANCH, GIT_BRANCH, BRANCH_NAME and GITHUB_REF_NAME be effective', async () => {
      const whitelist: GitInfoKey[] = ['branch'];
      const fakeBranchName = 'this_is_a/fake-branch-name';

      let info = await DevUtils.getGitInfo(whitelist);
      expect(info.branch).to.not.equal(fakeBranchName);

      process.env.GITHUB_REF_NAME = fakeBranchName;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.branch).to.equal(fakeBranchName);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.branch).to.not.equal(fakeBranchName);

      process.env.GITHUB_REF_NAME = 'wrong1';
      process.env.BRANCH_NAME = fakeBranchName;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.branch).to.equal(fakeBranchName);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.branch).to.not.equal(fakeBranchName);

      process.env.BRANCH_NAME = 'wrong2';
      process.env.GIT_BRANCH = fakeBranchName;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.branch).to.equal(fakeBranchName);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.branch).to.not.equal(fakeBranchName);

      process.env.GIT_BRANCH = 'wrong3';
      process.env.GIT_LOCAL_BRANCH = fakeBranchName;
      info = await DevUtils.getGitInfo(whitelist);
      expect(info.branch).to.equal(fakeBranchName);
      info = await DevUtils.getGitInfo(whitelist, false);
      expect(info.branch).to.not.equal(fakeBranchName);
    });
  });

  describe('loadConfiguration(...)', () => {
    it('has the default merger merges object on the right to object on the left', () => {
      const left = {
        prop1: 1,
        prop2: 2,
        array1: ['a', 'b', 'c'],
        array2: ['a', 'b', 'c'],
      };
      const right = {
        prop2: 200,
        prop3: 300,
        array1: ['d', 'e', 'f', 'g'],
        array2: ['d', undefined],
      };
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(left, right)).to.deep.equal({
        prop1: 1,
        prop2: 200,
        prop3: 300,
        array1: ['d', 'e', 'f', 'g'],
        array2: ['d', 'b', 'c'],
      });
    });
    it('has the default merger that can handle null/undefined', () => {
      const obj = {
        prop1: 1,
        prop2: 2,
        array1: ['a', 'b', 'c'],
        array2: ['a', 'b', 'c'],
      };
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(undefined, obj)).to.deep.equal(obj);
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(null, obj)).to.deep.equal(obj);
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(obj, undefined)).to.deep.equal(obj);
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(obj, null)).to.deep.equal(obj);
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(undefined, null)).to.be.empty;
      expect(DevUtils.DEFAULT_OPTIONS_FOR_LOAD_CONFIGURATION.merge(null, null)).to.be.empty;
    });
    it('handles JSON', () => {
      const r = DevUtils.loadConfiguration('package');
      expect(r).to.be.an('object');
      expect(r).to.have.property('dependencies');
      expect(r.repository?.type).to.equal('git');
    });
    it('handles YAML', () => {
      const r = DevUtils.loadConfiguration('.nycrc');
      expect(r).to.be.an('object');
      expect(r).to.have.property('exclude');
      expect(r.exclude).to.be.an('array');
      expect(r['skip-full']).to.equal(true);
    });
    it('by defaults lets .yml override .json in the same directory', () => {
      const r = DevUtils.loadConfiguration('config', { dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4' });
      expect(r).to.be.an('object');
      expect(r).to.deep.equal({
        dirName: 'L4',
        fileName: 'config.yml',
        'l4_config.json': true,
        'l4_config.yml': true,
      });
    });
    it('by customisation can let .json override .yml in the same directory', () => {
      const r = DevUtils.loadConfiguration('config', { dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4', extensions: {
        '.json': 'json',
        '.yml': 'yaml',
      } });
      expect(r).to.be.an('object');
      expect(r).to.deep.equal({
        dirName: 'L4',
        fileName: 'config.json',
        'l4_config.json': true,
        'l4_config.yml': true,
      });
    });
    it('returns undefined if no configuration file can be found', () => {
      const r = DevUtils.loadConfiguration('non-existing-config', { dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4' });
      expect(r).to.be.undefined;
    });
    it('can search up ancestor directories', () => {
      const searched: any[] = [];
      const r = DevUtils.loadConfiguration(
        'config',
        {
          dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
          shouldCheckAncestorDir: (level, dirName, dirAbsolutePath, consolidatedConfiguration) => {
            searched.push({ level, dirName, dirAbsolutePath, consolidatedConfiguration });
            return level <= 3;
          },
        },
      );
      expect(r).to.be.an('object');
      expect(r).to.deep.equal({
        dirName: 'L4',
        fileName: 'config.yml',
        'l4_config.json': true,
        'l4_config.yml': true,
        'l3_config.yml': true,
        'l2_config.yml': true,
        'l2_config.json': true,
        'l1_config.yaml': true,
      });
      expect(searched.find(x => x.consolidatedConfiguration == null)).to.be.undefined;
      expect(searched.map(x => ({ level: x.level, dirName: x.dirName }))).to.deep.equal([
        {
          level: 1,
          dirName: 'dir_L3',
        },
        {
          level: 2,
          dirName: 'dir_L2',
        },
        {
          level: 3,
          dirName: 'dir_L1',
        },
        {
          level: 4,
          dirName: 'fixtures',
        },
      ]);
      const pwd = path.resolve('.');
      for (const dirInfo of searched) {
        expect(dirInfo.dirAbsolutePath).to.match(new RegExp(`^${pwd}.+`));
        expect(dirInfo.dirAbsolutePath).to.match(new RegExp(`.+${dirInfo.dirName}$`));
      }
    });
    it('does not loop infinitely when searching up ancestor directories', () => {
      const r = DevUtils.loadConfiguration(
        'config',
        {
          dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
          shouldCheckAncestorDir: () => true,
        },
      );
      expect(r).to.be.an('object');
    });
    it('throws error if the JSON configuration file is invalid', () => {
      expect(() => DevUtils.loadConfiguration('wrong', { dir: 'test/fixtures' })).to.throw(/Unable to parse the content/);
    });
    it('throws error if specified parser does not exist', () => {
      expect(() => DevUtils.loadConfiguration('wrong', { dir: 'test/fixtures', extensions: { '.json': 'abc' as any } })).to.throw(/No parser.+\.json/);
    });
  });

  describe('loadConfigurationWithVariant(...)', () => {
    it('returns undefined if no configuration file can be found', () => {
      const r = DevUtils.loadConfigurationWithVariant('non-existing-config', '.prod', '.default', { dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4' });
      expect(r).to.be.undefined;
    });
    it('can search up ancestor directories', () => {
      const r = DevUtils.loadConfigurationWithVariant(
        'config',
        '.prod',
        '',
        {
          dir: 'test/fixtures/dir_L1/dir_L2/dir_L3/dir_L4',
          shouldCheckAncestorDir: level => {
            return level <= 3;
          },
        },
      );
      expect(r).to.be.an('object');
      expect(r).to.deep.equal({
        dirName: 'L4',
        env: 'prod',
        fileName: 'config.prod.yml',
        'l4_config.json': true,
        'l4_config.yml': true,
        'l3_config.yml': true,
        'l2_config.yml': true,
        'l2_config.json': true,
        'l1_config.yaml': true,
      });
    });
  });
});
