/**
 * Module dependencies.
 */

import './home.css';
import { Link } from 'react-router';

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
    <div className="home-container">
      <h1>Widget Test Page</h1>
      <div className="button-container">
        <p>Select your widget:</p>
        <Link to={'/payment-widget'} className="button">
          Payment Widget
        </Link>
        <Link to={'/travel-rule-widget'} className="button">
          Travel Rule Widget
        </Link>
        <Link to={'/kyc-widget'} className="button">
          KYC Widget
        </Link>
      </div>
    </div>
  );
}
