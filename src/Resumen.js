import React from 'react';
import { useLocation } from 'react-router-dom';
import './Resumen.css';

const Resumen = () => {
  const { state } = useLocation();

  return (
    <div className="resumen-container">
      <h2>Resumen de la Solicitud</h2>
      <table className="resumen-tabla">
        <tbody>
          <tr>
            <th>Nombre Completo:</th>
            <td>{state.nombre}</td>
          </tr>
          <tr>
            <th>Matrícula:</th>
            <td>{state.matricula}</td>
          </tr>
          <tr>
            <th>Carrera:</th>
            <td>{state.carrera}</td>
          </tr>
          <tr>
            <th>Profesor:</th>
            <td>{state.profesor}</td>
          </tr>
          <tr>
            <th>Materiales Requeridos:</th>
            <td>
              <ul>
                {state.materiales.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <th>Área Requerida:</th>
            <td>{state.area}</td>
          </tr>
          <tr>
            <th>Cantidad de Integrantes:</th>
            <td>{state.cantidadIntegrantes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Resumen;
