import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Resume Compiler
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px'
          }}>
            Professional Desktop Application
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
