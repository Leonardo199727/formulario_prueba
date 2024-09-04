// src/Resumen.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Resumen = () => {
  const location = useLocation();
  const { nombre, matricula, carrera, profesor, materiales, area, cantidadIntegrantes } = location.state || {};

  return (
    <div>
      <h1>Resumen del Formulario</h1>
      <p><strong>Nombre Completo:</strong> {nombre}</p>
      <p><strong>Matrícula:</strong> {matricula}</p>
      <p><strong>Carrera:</strong> {carrera}</p>
      <p><strong>Profesor:</strong> {profesor}</p>
      <p><strong>Materiales Requeridos:</strong> {materiales.join(', ')}</p>
      <p><strong>Área Requerida:</strong> {area}</p>
      <p><strong>Cantidad de Integrantes:</strong> {cantidadIntegrantes}</p>
    </div>
  );
};

export default Resumen;
