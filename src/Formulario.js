import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, query, getDocs } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Formulario.css';

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [carrera, setCarrera] = useState('');
  const [profesor, setProfesor] = useState('');
  const [materiales, setMateriales] = useState([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState([]);
  const [buscadores, setBuscadores] = useState([{ id: Date.now(), valor: '' }]);
  const [area, setArea] = useState('');
  const [areas, setAreas] = useState([]);
  const [cantidadIntegrantes, setCantidadIntegrantes] = useState('');
  const [profesores, setProfesores] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const materialesRef = collection(db, 'materiales');
        const q = query(materialesRef);
        const querySnapshot = await getDocs(q);
        const materialData = querySnapshot.docs.map(doc => doc.data().nombre);
        setMateriales(materialData);
      } catch (error) {
        console.error('Error al cargar los materiales: ', error);
      }
    };

    fetchMateriales();
  }, []);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const profesoresRef = collection(db, 'profesores');
        const q = query(profesoresRef);
        const querySnapshot = await getDocs(q);
        const profesorData = querySnapshot.docs.map(doc => ({
          nombre: doc.data().nombre,
          carrera: doc.data().carrera
        }));
        setProfesores(profesorData);
      } catch (error) {
        console.error('Error al cargar los profesores: ', error);
      }
    };

    fetchProfesores();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasRef = collection(db, 'areas');
        const q = query(areasRef);
        const querySnapshot = await getDocs(q);
        const areaData = querySnapshot.docs.map(doc => doc.data().nombre);
        setAreas(areaData);
      } catch (error) {
        console.error('Error al cargar las áreas: ', error);
      }
    };

    fetchAreas();
  }, []);

  const handleCarreraChange = (e) => {
    const selectedCarrera = e.target.value;
    setCarrera(selectedCarrera);
    setProfesor('');
  };

  const profesoresFiltrados = profesores.filter(prof => prof.carrera === carrera);

  const handleMaterialChange = (id, value) => {
    setBuscadores(buscadores.map(busqueda =>
      busqueda.id === id ? { ...busqueda, valor: value } : busqueda
    ));
  };

  const handleAgregarCampo = () => {
    if (buscadores[buscadores.length - 1].valor) {
      setBuscadores([...buscadores, { id: Date.now(), valor: '' }]);
    }
  };

  const handleMaterialSeleccionado = (id, value) => {
    if (value) {
      setMaterialSeleccionado(prev => [...prev, value]);
      handleMaterialChange(id, value);
      handleAgregarCampo();
    }
  };

  const obtenerSugerencias = (valor) => {
    if (valor.length < 3) {
      return [];
    }
    return materiales.filter(mat => mat.toLowerCase().includes(valor.toLowerCase()));
  };

  const obtenerSiguienteID = async () => {
    try {
      const solicitudesRef = collection(db, 'solicitudes');
      const q = query(solicitudesRef);
      const querySnapshot = await getDocs(q);
      const ids = querySnapshot.docs.map(doc => doc.data().ID_solicitud);
      const maxId = ids.length ? Math.max(...ids) : 0;
      return maxId + 1;
    } catch (error) {
      console.error('Error al obtener el siguiente ID: ', error);
      return 1; // Valor por defecto si ocurre un error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const siguienteID = await obtenerSiguienteID();
      await addDoc(collection(db, 'solicitudes'), {
        ID_solicitud: siguienteID,
        nombre,
        matricula,
        carrera,
        profesor,
        materiales: materialSeleccionado,
        area,
        cantidadIntegrantes
      });
      navigate('/resumen', { state: { nombre, matricula, carrera, profesor, materiales: materialSeleccionado, area, cantidadIntegrantes } });
    } catch (error) {
      console.error('Error al enviar el formulario: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre Completo:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        title="Comenzando por apellidos"
      />

      <label>Matrícula:</label>
      <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />

      <label>Carrera:</label>
      <select value={carrera} onChange={handleCarreraChange} required>
        <option value="">Selecciona una carrera</option>
        <option value="Industrial">Industrial</option>
        <option value="Mecánica">Mecánica</option>
        <option value="Mecatrónica">Mecatrónica</option>
      </select>

      <label>Profesor:</label>
      <select value={profesor} onChange={(e) => setProfesor(e.target.value)} required>
        <option value="">Selecciona un profesor</option>
        {profesoresFiltrados.map((prof) => (
          <option key={prof.nombre} value={prof.nombre}>
            {prof.nombre}
          </option>
        ))}
      </select>

      <label>Material Requerido:</label>
      {buscadores.map(({ id, valor }) => (
        <div key={id}>
          <input
            type="text"
            value={valor}
            onChange={(e) => handleMaterialChange(id, e.target.value)}
            placeholder="Busca y selecciona un material"
            list={`materiales-${id}`}
          />
          <datalist id={`materiales-${id}`}>
            {obtenerSugerencias(valor).map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </datalist>
          <button
            type="button"
            onClick={() => handleMaterialSeleccionado(id, valor)}
          >
            Agregar
          </button>
        </div>
      ))}

      <label>Área Requerida:</label>
      <select value={area} onChange={(e) => setArea(e.target.value)} required>
        <option value="">Selecciona un área</option>
        {areas.map((areaItem) => (
          <option key={areaItem} value={areaItem}>
            {areaItem}
          </option>
        ))}
      </select>

      <label>Cantidad de Integrantes:</label>
      <input
        type="number"
        value={cantidadIntegrantes}
        onChange={(e) => setCantidadIntegrantes(e.target.value)}
        required
      />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
