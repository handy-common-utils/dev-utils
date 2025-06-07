/* eslint-disable unicorn/prefer-node-protocol */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/text-encoding-identifier-case */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import {
  getSingleSubdirectory,
  replaceAnchorIdWithName,
  replaceAnchorIdWithNameInMdFiles,
  replaceAnchorNameWithId,
} from '../../src/utils/api-docs-utils';

describe('api-docs-utils', () => {
  describe('replaceAnchorNameWithId', () => {
    it('should replace <a name="..."></a> with <a id="..."></a>', () => {
      const input = '\n\n<a name="abc"></a>\n\n## Title';
      const expected = '\n\n<a id="abc"></a>\n\n## Title';
      expect(replaceAnchorNameWithId(input)).to.equal(expected);
    });
  });

  describe('replaceAnchorIdWithName', () => {
    it('should replace <a id="..."></a> with <a name="..."></a>', () => {
      const input = '\n\n<a id="xyz"></a>\n\n## Title';
      const expected = '\n\n<a name="xyz"></a>\n\n## Title';
      expect(replaceAnchorIdWithName(input)).to.equal(expected);
    });
  });

  describe('getSingleSubdirectory', () => {
    const tmpDir = path.join(__dirname, 'tmp-test-dir');
    beforeEach(() => {
      fs.mkdirSync(tmpDir, { recursive: true });
    });
    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should return the single subdirectory path if only one exists', () => {
      const sub = path.join(tmpDir, 'sub1');
      fs.mkdirSync(sub);
      expect(getSingleSubdirectory(tmpDir)).to.equal(sub);
    });

    it('should return undefined if no subdirectories', () => {
      expect(getSingleSubdirectory(tmpDir)).to.be.undefined;
    });

    it('should return undefined if more than one subdirectory', () => {
      fs.mkdirSync(path.join(tmpDir, 'a'));
      fs.mkdirSync(path.join(tmpDir, 'b'));
      expect(getSingleSubdirectory(tmpDir)).to.be.undefined;
    });
  });

  describe('replaceAnchorIdWithNameInMdFiles', () => {
    const tmpDir = path.join(__dirname, 'tmp-md-dir');
    beforeEach(() => {
      fs.mkdirSync(tmpDir, { recursive: true });
    });
    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should replace anchors in all .md files recursively', () => {
      const mdPath = path.join(tmpDir, 'test.md');
      const content = '\n\n<a id="foo"></a>\n\n## Section';
      fs.writeFileSync(mdPath, content, 'utf8');
      replaceAnchorIdWithNameInMdFiles(tmpDir);
      const updated = fs.readFileSync(mdPath, 'utf8');
      expect(updated).to.include('<a name="foo"></a>');
    });

    it('should not modify non-md files', () => {
      const txtPath = path.join(tmpDir, 'test.txt');
      fs.writeFileSync(txtPath, '<a id="foo"></a>', 'utf8');
      replaceAnchorIdWithNameInMdFiles(tmpDir);
      const updated = fs.readFileSync(txtPath, 'utf8');
      expect(updated).to.equal('<a id="foo"></a>');
    });
  });
});
