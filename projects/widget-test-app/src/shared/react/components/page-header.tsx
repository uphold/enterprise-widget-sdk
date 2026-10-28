/**
 * Module dependencies.
 */

import { Link } from 'react-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';

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
  // Only used when a widget is mounted, where the header is hidden behind a tab that toggles it.
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Closes the header when clicking outside of it. Clicks inside the widget iframe don't reach the document, but
  // they blur the window, so that closes it too.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const close = () => setIsOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('blur', close);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('blur', close);
    };
  }, [isOpen]);

  return (
    <header ref={headerRef} className={isOpen ? 'page-header is-open' : 'page-header'}>
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
      <button
        aria-expanded={isOpen}
        className="page-header-toggle"
        onClick={() => setIsOpen(current => !current)}
        type="button"
      >
        {isOpen ? '▴  Navigation' : '▾  Navigation'}
      </button>
    </header>
  );
}
