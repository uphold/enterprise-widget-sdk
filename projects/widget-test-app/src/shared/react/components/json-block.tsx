/**
 * Module dependencies.
 */

import { type ReactNode, useState } from 'react';

/**
 * Types.
 */

type JsonBlockProps = {
  title?: string;
  value: unknown;
};

/**
 * Constants.
 */

// Matches, in order: strings (and whether they are keys), numbers, and the `true`, `false` and `null` literals.
const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

/**
 * Helpers.
 */

const stringify = (value: unknown) => {
  try {
    // `undefined` and functions are not serializable, so they would render as `undefined`.
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
};

// Colors the JSON tokens with React elements only, so there is no HTML to escape.
const highlight = (json: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of json.matchAll(JSON_TOKEN)) {
    const [token, string, colon, number, literal] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(json.slice(lastIndex, start));
    }

    if (string) {
      nodes.push(
        <span key={start} className={colon ? 'json-key' : 'json-string'}>
          {string}
        </span>
      );

      if (colon) {
        nodes.push(colon);
      }
    } else if (number) {
      nodes.push(
        <span key={start} className="json-number">
          {number}
        </span>
      );
    } else if (literal) {
      nodes.push(
        <span key={start} className={literal === 'null' ? 'json-null' : 'json-boolean'}>
          {literal}
        </span>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return nodes;
};

/**
 * Export component.
 */

export function JsonBlock({ title, value }: JsonBlockProps) {
  const [copied, setCopied] = useState(false);
  const json = stringify(value);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The clipboard API may be unavailable, ignore.
    }
  };

  return (
    <div className="payload-container">
      <div className="payload-header">
        <h3>{title ?? 'Payload'}</h3>
        <button className="copy-button" onClick={handleCopy} type="button">
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="payload-code">{highlight(json)}</pre>
    </div>
  );
}
