/**
 * Module dependencies.
 */

import type { OptionTag } from '../options/options-summary';

/**
 * Types.
 */

type OptionTagsProps = {
  // How many tags are shown, and how many more there are after them.
  max?: number;
  tags: OptionTag[];
  title?: string;
};

/**
 * Exports.
 */

export const OptionTags = ({ max = Infinity, tags, title }: OptionTagsProps) => {
  if (tags.length === 0) {
    return null;
  }

  const hidden = tags.length - max;

  return (
    <span className="flow-tags" title={title}>
      {tags.slice(0, max).map(({ label, variant }) => (
        <span key={label} className={`flow-tag${variant ? ` ${variant}` : ''}`}>
          {label}
        </span>
      ))}
      {hidden > 0 && <span className="flow-tag">+{hidden}</span>}
    </span>
  );
};
