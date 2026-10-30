/**
 * Module dependencies.
 */

import { Link } from 'react-router';
import type { ReactNode } from 'react';

/**
 * Types.
 */

export type Breadcrumb = {
  label: string;
  // Goes back within the page. Without it the item is not clickable, as it is the current location or a link.
  onClick?: () => void;
  // Goes to another page.
  to?: string;
};

type PageHeaderProps = {
  title: string;
  // Where the user is, from the home page to the current screen. The last item is the current one.
  breadcrumbs?: Breadcrumb[];
  subtitle?: ReactNode;
  showBackLink?: boolean;
  // Replaces the link to the home page with a button that goes back within the page (e.g. to the flow list).
  onBack?: () => void;
  backLabel?: string;
};

/**
 * Export component.
 */

export function PageHeader({
  backLabel = '← Back',
  breadcrumbs,
  onBack,
  showBackLink = true,
  subtitle,
  title
}: PageHeaderProps) {
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
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            {breadcrumbs.map(({ label, onClick, to }, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li key={`${label}-${index}`}>
                  {isCurrent && <span aria-current="page">{label}</span>}
                  {!isCurrent && to && <Link to={to}>{label}</Link>}
                  {!isCurrent && !to && (
                    <button onClick={onClick} type="button">
                      {label}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
