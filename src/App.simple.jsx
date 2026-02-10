import React from 'react'

function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#3b82f6' }}>Alumni Connect</h1>
      <p>Welcome to the Alumni Management Platform</p>
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        padding: '15px', 
        margin: '20px 0',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Quick Test</h3>
        <p style={{ margin: 0 }}>If you can see this, the application is working correctly!</p>
      </div>
      <button 
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked! React is working.')}
      >
        Test Button
      </button>
    </div>
  )
}

export default SimpleApp















