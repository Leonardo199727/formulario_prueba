// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Formulario from './Formulario';
import Resumen from './Resumen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Formulario />} />
        <Route path="/resumen" element={<Resumen />} />
      </Routes>
    </Router>
  );
};

export default App;
