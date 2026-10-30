/**
 * Exports.
 */

// The options are written as JSON with comments, and with trailing commas, so the template can be uncommented.
const toJson = (text: string) => {
  let withoutComments = '';
  let inString = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;

    if (inString) {
      withoutComments += char;

      if (char === '\\') {
        withoutComments += text[++i] ?? '';
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
      withoutComments += char;
    } else if (char === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') {
        i++;
      }

      withoutComments += '\n';
    } else if (char === '/' && text[i + 1] === '*') {
      i = text.indexOf('*/', i + 2);
      i = i === -1 ? text.length : i + 1;
    } else {
      withoutComments += char;
    }
  }

  let json = '';

  inString = false;

  for (let i = 0; i < withoutComments.length; i++) {
    const char = withoutComments[i]!;

    if (inString) {
      json += char;

      if (char === '\\') {
        json += withoutComments[++i] ?? '';
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
      json += char;
    } else if (char === ',' && /^\s*[}\]]/.test(withoutComments.slice(i + 1))) {
      continue;
    } else {
      json += char;
    }
  }

  return json;
};

export type ParsedOptions = { error: string } | { error?: undefined; value: Record<string, unknown> };

export const parseOptionsText = (text: string): ParsedOptions => {
  try {
    const value: unknown = JSON.parse(toJson(text));

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { error: 'The options must be a JSON object.' };
    }

    return { value: value as Record<string, unknown> };
  } catch (e) {
    return { error: (e as Error).message };
  }
};
