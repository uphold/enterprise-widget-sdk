/**
 * Module dependencies.
 */

import { Link } from 'react-router';
import { PageHeader } from '../../shared/react/components';

/**
 * Types.
 */

type WidgetLink = {
  description: string;
  icon: string;
  label: string;
  to: string;
};

/**
 * Constants.
 */

const WIDGET_LINKS: WidgetLink[] = [
  {
    description: 'Select payment methods and authorize transactions and on/off-ramp orders.',
    icon: '💳',
    label: 'Payment Widget',
    to: '/payment-widget'
  },
  {
    description: 'Collect and verify the information required by Travel Rule regulations.',
    icon: '🧭',
    label: 'Travel Rule Widget',
    to: '/travel-rule-widget'
  },
  {
    description: 'Run identity, address, profile and due diligence verification processes.',
    icon: '🪪',
    label: 'KYC Widget',
    to: '/kyc-widget'
  }
];

/**
 * Gets page metadata.
 */

export const meta = () => {
  return [{ title: 'Widget Test Page' }, { content: 'Widget Test Page', name: 'description' }];
};

/**
 * Export component.
 */

export default function Home() {
  return (
    <div className="app-shell">
      <PageHeader
        showBackLink={false}
        subtitle="Pick a widget to launch it against your configured environment."
        title="Widget Test Page"
      />

      <nav aria-label="Widgets" className="widget-grid">
        {WIDGET_LINKS.map(({ description, icon, label, to }) => (
          <Link key={to} className="widget-card" to={to}>
            <span aria-hidden className="widget-card-icon">
              {icon}
            </span>
            <span className="widget-card-title">{label}</span>
            <span className="widget-card-description">{description}</span>
            <span className="widget-card-cta">Open →</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
