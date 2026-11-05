/**
 * Commenting. The options of the editor are blocks of lines (an option can take many), which are commented or
 * uncommented as a whole, and any lines can be too.
 */

// The text without what follows a `//`, which is not part of the value.
const withoutInlineComment = (line: string) => {
  let inString = false;

  for (let i = 0; i < line.length; i++) {
    if (inString) {
      if (line[i] === '\\') {
        i++;
      } else if (line[i] === '"') {
        inString = false;
      }
    } else if (line[i] === '"') {
      inString = true;
    } else if (line[i] === '/' && line[i + 1] === '/') {
      return line.slice(0, i);
    }
  }

  return line;
};

// How many brackets the line opens, minus the ones it closes.
const getBracketDepth = (line: string) => {
  let depth = 0;
  let inString = false;

  for (let i = 0; i < line.length; i++) {
    if (inString) {
      if (line[i] === '\\') {
        i++;
      } else if (line[i] === '"') {
        inString = false;
      }
    } else if (line[i] === '"') {
      inString = true;
    } else if ('{['.includes(line[i]!)) {
      depth++;
    } else if ('}]'.includes(line[i]!)) {
      depth--;
    }
  }

  return depth;
};

const COMMENT_MARKER = /^(\s*)\/\/ ?/;

export type OptionBlock = { active: boolean; end: number; key: string; start: number };

// The options in the text, commented or not, which are the keys at the first level of the object.
export const getOptionBlocks = (text: string): OptionBlock[] => {
  const lines = text.split('\n');
  const blocks: OptionBlock[] = [];

  lines.forEach((line, start) => {
    const match = /^ {2}(\/\/ )?"(\w+)":/.exec(line);

    if (!match) {
      return;
    }

    let depth = 0;
    let end = start;

    for (let i = start; i < lines.length; i++) {
      depth += getBracketDepth(withoutInlineComment(lines[i]!.replace(COMMENT_MARKER, '$1')));
      end = i;

      if (depth <= 0) {
        break;
      }
    }

    blocks.push({ active: !match[1], end, key: match[2]!, start });
  });

  return blocks;
};

export const toggleOptionBlock = (text: string, key: string) => {
  const block = getOptionBlocks(text).find(candidate => candidate.key === key);

  if (!block) {
    return text;
  }

  const lines = text.split('\n');

  for (let i = block.start; i <= block.end; i++) {
    // The marker goes after the indentation of the option, so that the lines are restored as they were.
    lines[i] = block.active ? lines[i]!.replace(/^( {2})(?=\S| )/, '$1// ') : lines[i]!.replace(/^( {2})\/\/ ?/, '$1');
  }

  return lines.join('\n');
};

// Comments the lines of the selection, or uncomments them when all of them are commented.
export const toggleLines = (text: string, selectionStart: number, selectionEnd: number) => {
  const lines = text.split('\n');
  const firstLine = text.slice(0, selectionStart).split('\n').length - 1;
  const lastLine = text.slice(0, Math.max(selectionStart, selectionEnd - 1)).split('\n').length - 1;
  const selected = lines.slice(firstLine, lastLine + 1).filter(line => line.trim() !== '');
  const areCommented = selected.length > 0 && selected.every(line => COMMENT_MARKER.test(line));

  for (let i = firstLine; i <= lastLine; i++) {
    if (lines[i]!.trim() === '') {
      continue;
    }

    lines[i] = areCommented ? lines[i]!.replace(COMMENT_MARKER, '$1') : lines[i]!.replace(/^(\s*)/, '$1// ');
  }

  const start = lines.slice(0, firstLine).reduce((length, line) => length + line.length + 1, 0);
  const end = lines.slice(0, lastLine + 1).reduce((length, line) => length + line.length + 1, 0) - 1;

  return { selectionEnd: end, selectionStart: start, text: lines.join('\n') };
};
