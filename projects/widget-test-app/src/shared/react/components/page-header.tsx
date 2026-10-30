/**
 * Module dependencies.
 */

import { Link } from 'react-router';
import type { ReactNode } from 'react';

/**
 * Types.
 */

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  showBackLink?: boolean;
  // Replaces the link to the home page with a button that goes back within the page (e.g. to the flow list).
  onBack?: () => void;
  backLabel?: string;
};

/**
 * Export component.
 */

export function PageHeader({ backLabel = '← Back', onBack, showBackLink = true, subtitle, title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        <span className="brand">
          <span aria-hidden className="brand-mark">
            ◆
          </span>
          Uphold Enterprise · Widget SDK
        </span>
        {onBack && (
          <button className="back-link" onClick={onBack} type="button">
            {backLabel}
          </button>
        )}
        {!onBack && showBackLink && (
          <Link className="back-link" to="/">
            ← All widgets
          </Link>
        )}
      </div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
