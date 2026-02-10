import React from 'react'
import ReactDOM from 'react-dom/client'

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Alumni Connect - Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ background: 'lightgreen', padding: '10px', margin: '10px 0' }}>
        <strong>Status:</strong> Application is loading correctly
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<TestApp />)















