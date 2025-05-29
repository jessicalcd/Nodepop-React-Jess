import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
// import './index.css' // Si creas un index.css global para estilos adicionales

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
