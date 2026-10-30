/**
 * Module dependencies.
 */

import { getOptionBlocks, toggleLines, toggleOptionBlock } from '../options/option-blocks';
import { parseOptionsText } from '../options/jsonc';
import { useRef } from 'react';

/**
 * Constants.
 */

// The key of the shortcut that comments the selected lines.
const COMMENT_SHORTCUT = /Mac|iPhone|iPad/.test(window.navigator.platform) ? '⌘ /' : 'Ctrl /';

/**
 * Types.
 */

type OptionsEditorProps = {
  id: string;
  isEdited: boolean;
  onChange: (text: string) => void;
  onReset: () => void;
  text: string;
};

/**
 * Exports.
 */

/**
 * Editor of the options of a flow, which are written as JSON with comments. The options can be commented and
 * uncommented a whole at a time, or the lines selected.
 */

export const OptionsEditor = ({ id, isEdited, onChange, onReset, text }: OptionsEditorProps) => {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const { error } = parseOptionsText(text);

  // Comments or uncomments the lines selected in the editor, or the one of the cursor. The selection of the editor is
  // kept when it loses the focus, so this also works from a button, which is what touch screens use.
  const toggleSelectedLines = () => {
    const field = fieldRef.current;

    if (!field) {
      return;
    }

    const toggled = toggleLines(field.value, field.selectionStart, field.selectionEnd);

    onChange(toggled.text);
    requestAnimationFrame(() => field.setSelectionRange(toggled.selectionStart, toggled.selectionEnd));
  };

  return (
    <div className="options-editor">
      <div className="options-editor-header">
        <label htmlFor={id}>Widget options (JSON)</label>
        <button className="link-button" disabled={!isEdited} onClick={onReset} type="button">
          Reset to the flow defaults
        </button>
      </div>
      <div aria-label="Options of the editor" className="option-toggles" role="group">
        {getOptionBlocks(text).map(({ active, key }) => (
          <button
            key={key}
            aria-pressed={active}
            className={`option-toggle${active ? ' active' : ''}`}
            onClick={() => onChange(toggleOptionBlock(text, key))}
            title={`${active ? 'Comment' : 'Uncomment'} ${key}`}
            type="button"
          >
            {key}
          </button>
        ))}
        <button
          className="option-toggle action"
          onClick={toggleSelectedLines}
          title="Comments or uncomments the selected lines, or the line of the cursor"
          type="button"
        >
          // Toggle comment
        </button>
      </div>
      <textarea
        id={id}
        ref={fieldRef}
        aria-invalid={error !== undefined}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === '/') {
            e.preventDefault();
            toggleSelectedLines();
          }
        }}
        rows={Math.min(16, Math.max(5, text.split('\n').length + 1))}
        spellCheck={false}
        value={text}
      />
      <p className="section-description">
        Click an option to comment or uncomment it. To do it to some lines, select them and use the button or{' '}
        <kbd>{COMMENT_SHORTCUT}</kbd>.
      </p>
      {error !== undefined && (
        <p className="options-editor-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
