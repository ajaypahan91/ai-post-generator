import React from 'react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <button className="button button-primary">Go Home</button>
      </Link>
    </div>
  );
}
