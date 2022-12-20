#!/usr/bin/env node

/**
 * @ignore
 * @module
 */

import { DevUtils } from '../dev-utils';

const i = process.argv.findIndex(v => v.match(/\.md$/i));
const readmePath = i >= 0 ? process.argv[i] : undefined;
const entryPointsString = readmePath ? process.argv[i + 1] : undefined;
const entryPoints = entryPointsString ? entryPointsString.split(',') : undefined;
const apiDocDir = entryPoints ? process.argv[i + 2] : undefined;

DevUtils.generateApiDocsAndUpdateReadme(readmePath, entryPoints, apiDocDir);
