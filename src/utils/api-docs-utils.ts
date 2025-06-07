/**
 * @ignore
 * @module
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Replace <a id="..."></a> with <a name="..."></a> in a Markdown content string.
 * @param content - The Markdown content string to process.
 * @returns The updated Markdown content string with <a id="..."></a> replaced by <a name="..."></a>.
 */
export function replaceAnchorIdWithName(content: string): string {
  return content.replaceAll(/\n\n<a id="([^"]+)"><\/a>\n\n##/gm, '\n\n<a name="$1"></a>\n\n##');
}

/**
 * Replace <a name="..."></a> with <a id="..."></a> in a Markdown content string.
 * @param content - The Markdown content string to process.
 * @returns The updated Markdown content string with <a name="..."></a> replaced by <a id="..."></a>.
 */
export function replaceAnchorNameWithId(content: string): string {
  return content.replaceAll(/\n\n<a name="([^"]+)"><\/a>\n\n##/gm, '\n\n<a id="$1"></a>\n\n##');
}

/**
 * For every Markdown file under a directory (recursively), replace <a id="..."></a> with <a name="..."></a>.
 * @param dir - The directory to recursively process Markdown files in.
 * @returns void
 */
export function replaceAnchorIdWithNameInMdFiles(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceAnchorIdWithNameInMdFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = replaceAnchorIdWithName(content);
      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, 'utf8');
      }
    }
  }
}

/**
 * If a directory has one and only one subdirectory, return its path; otherwise return undefined.
 * @param dir - The directory to check for a single subdirectory.
 * @returns The path to the single subdirectory, or undefined if there are zero or more than one subdirectories.
 */
export function getSingleSubdirectory(dir: string): string | undefined {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory());
  if (subdirs.length === 1) {
    return path.join(dir, subdirs[0].name);
  }
  return undefined;
}


