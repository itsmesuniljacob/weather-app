// src/App.js
import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Weather from './Weather';

const App = () => {
  return (
    <div style={{ background: 'linear-gradient(to right, #00c6ff, #0072ff)', minHeight: '100vh', padding: '20px' }}>
      <CssBaseline />
      <Container maxWidth="sm" style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <Weather />
      </Container>
    </div>
  );
};

export default App;
