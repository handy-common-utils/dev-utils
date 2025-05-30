/**
 * @ignore
 * @module
 */

export function convertRenderedPropertiesToTables(content: string): string {
  let result = content;
  // remove the list in ToC
  result = result.replaceAll(/\n##### Properties\n[\0-\uFFFF]*?(?=(\n##)|$)/g, '');  // [\0-\uFFFF] is a workaround for unsupported "s" flag in ES2017

  // transform the section of property details
  const sectionMatcher = /\n#{4} Properties\n([\0-\uFFFF]*?)(?=(\n#{4} )|\n{2}<a name=.+<\/a>\n{2}#{3}|$)/g;  // [\0-\uFFFF] is a workaround for unsupported "s" flag in ES2017
  result = result.replaceAll(sectionMatcher, (p2: string) => {
    const blocks = p2.split('___')  // one block for each property
      .map(s => {
        // eslint-disable-next-line unicorn/prefer-string-replace-all
        const lines = s.replace(/^[\0-\uFFFF]*?#{5} .+?\n+/g, '')  // remove headline(s)
          .trim().split('\n');
        // console.log(lines);
        let headline = lines[0];
        let others = lines.slice(1).join('<br>');
        // trim
        others = others.replace(/^(<br>)+/, '').replace(/(<br>)+$/, '');
        // special formats
        others = others.replace(/###### Type declaration.+▸.+?<br><br>/, '')
                       .replace(/####### Parameters.*/, '')
                       .replace(/####### Returns.*/, '')
                       .replace(/(<br>)+$/, '');
        // remove bullet styles
        headline = headline.replace(/^(• |▪ )/, '');
        others = others.replaceAll(/(^|<br>)#{5,} /g, '');
        return {
          headline,
          others,
        };
      });
    const table =  '| Property | Description |\n' +
      '| --- | --- |\n' +
      blocks.map(b => `| ${b.headline} | ${b.others} |`).join('\n');
    return '\n#### Properties\n\n' + table + '\n\n';
  });
  return result;
}
