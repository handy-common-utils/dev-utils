import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { convertRenderedPropertiesToTables } from '../../src/utils/api-docs-utils';

describe('api-docs-utils', () => {
  const sample1Input = fs.readFileSync(path.join(__dirname, 'sample1.input.md'), 'utf-8');
  const sample1Expected = fs.readFileSync(path.join(__dirname, 'sample1.expected.md'), 'utf-8');
  const sample2Input = fs.readFileSync(path.join(__dirname, 'sample2.input.md'), 'utf-8');
  const sample2Expected = fs.readFileSync(path.join(__dirname, 'sample2.expected.md'), 'utf-8');
  describe('convertRenderedPropertiesToTables(...)', () => {
    it('should work for sample1', () => {
      const converted = convertRenderedPropertiesToTables(sample1Input);
      // console.log(converted);
      expect(converted).to.equal(sample1Expected);
    });
    it('should work for sample2', () => {
      const converted = convertRenderedPropertiesToTables(sample2Input);
      // console.log(converted);
      expect(converted).to.equal(sample2Expected);
    });
  });
});
