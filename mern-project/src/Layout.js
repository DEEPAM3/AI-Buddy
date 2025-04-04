import React from 'react';

function Layout({ children }) {
  return (
    <div className="layout">
      <noscript>You need to enable JavaScript to run this app.</noscript>
      {children}
    </div>
  );
}

export default Layout;