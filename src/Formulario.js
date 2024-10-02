import React, { useState, useEffect } from "react";
import { db, collection, getDocs, query, where, addDoc } from "./firebaseConfig";
import "./Formulario.css";

function Formulario() {
  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [carrera, setCarrera] = useState("");
  const [materia, setMateria] = useState("");
  const [profesor, setProfesor] = useState("");
  const [materiales, setMateriales] = useState([{ material: "", cantidad: "" }]);
  const [integrantes, setIntegrantes] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [materialesSugeridos, setMaterialesSugeridos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState("");

  const obtenerCarreras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "carreras"));
      const listaCarreras = querySnapshot.docs.map((doc) => doc.data().nombre);
      setCarreras(listaCarreras);
    } catch (error) {
      console.error("Error al obtener carreras: ", error);
    }
  };

  const obtenerMaterias = async (carreraSeleccionada) => {
    try {
      const q = query(collection(db, "materias"), where("carrera", "==", carreraSeleccionada));
      const querySnapshot = await getDocs(q);
      const listaMaterias = querySnapshot.docs.map((doc) => doc.data().nombre);
      setMaterias(listaMaterias);
    } catch (error) {
      console.error("Error al obtener materias: ", error);
    }
  };

  const obtenerProfesores = async (carreraSeleccionada, materiaSeleccionada) => {
    try {
      const q = query(
        collection(db, "profesores"),
        where("carrera", "==", carreraSeleccionada),
        where("materia", "array-contains", materiaSeleccionada)
      );
      const querySnapshot = await getDocs(q);
      const listaProfesores = querySnapshot.docs.map((doc) => doc.data().nombre);
      setProfesores(listaProfesores);
    } catch (error) {
      console.error("Error al obtener profesores: ", error);
    }
  };

  const handleMaterialChange = async (index, e) => {
    const value = e.target.value.toLowerCase();
    const newMateriales = [...materiales];
    newMateriales[index].material = value; // Actualiza el material correspondiente
    setMateriales(newMateriales);

    if (value.length >= 3) {
      const q = query(
        collection(db, "materiales"),
        where("nombre", ">=", value),
        where("nombre", "<=", value + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const sugerencias = [];
      querySnapshot.forEach((doc) => {
        sugerencias.push(doc.data().nombre);
      });
      setMaterialesSugeridos({ index, sugerencias }); // Guarda el índice y las sugerencias
    } else {
      setMaterialesSugeridos([]);
    }
  };

  const handleSuggestionClick = (sugerido) => {
    const newMateriales = [...materiales];
    newMateriales[materialesSugeridos.index].material = sugerido; // Establece el material sugerido en el índice correspondiente
    setMateriales(newMateriales);
    setMaterialesSugeridos([]); // Oculta las sugerencias
  };

  const handleCantidadChange = (index, e) => {
    const newMateriales = [...materiales];
    newMateriales[index].cantidad = e.target.value; // Actualiza la cantidad correspondiente
    setMateriales(newMateriales);
  };

  const agregarMaterial = () => {
    setMateriales([...materiales, { material: "", cantidad: "" }]); // Agrega un nuevo objeto
  };

  const obtenerAreas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "areas"));
      const listaAreas = querySnapshot.docs.map((doc) => doc.data().nombre);
      setAreas(listaAreas);
    } catch (error) {
      console.error("Error al obtener áreas: ", error);
    }
  };

  useEffect(() => {
    obtenerCarreras();
    obtenerAreas();
  }, []);

  useEffect(() => {
    if (carrera) {
      obtenerMaterias(carrera);
      setProfesores([]);
    }
  }, [carrera]);

  useEffect(() => {
    if (carrera && materia) {
      obtenerProfesores(carrera, materia);
    }
  }, [materia]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const materialesData = materiales.map(m => m.material); // Solo el nombre del material
      const cantidadesData = materiales.map(m => m.cantidad); // Solo la cantidad

      await addDoc(collection(db, "solicitudes"), {
        nombre,
        matricula,
        carrera,
        materia,
        profesor,
        materiales: materialesData,
        cantidadmat: cantidadesData, // Guardar cantidades en 'cantidadmat'
        cantidadIntegrantes: integrantes,
        area,
        fecha: new Date(),
      });
      alert("Solicitud enviada exitosamente");
      setNombre("");
      setMatricula("");
      setCarrera("");
      setMateria("");
      setProfesor("");
      setMateriales([{ material: "", cantidad: "" }]);
      setIntegrantes("");
      setArea("");
      setMaterialesSugeridos([]);
    } catch (error) {
      console.error("Error al enviar solicitud: ", error);
    }
  };

  return (
    <div className="mobile-full-screen-form">
      <form onSubmit={handleSubmit}>
        <h3 className="tittle">Formulario para el préstamo de herramientas</h3>
        
        <h5 className="tittle-nombre">Nombre:</h5>
        <input
          className="input-nombre"
          type="text"
          placeholder="Introduce tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        
        <h5 className="tittle-matricula">Matrícula:</h5>
        <input
          className="input-matricula"
          type="number"
          placeholder="Introduce la matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        
        <h5 className="tittle-carrera">Selecciona carrera</h5>
        <select
          className="input-carrera"
          value={carrera}
          onChange={(e) => setCarrera(e.target.value)}
        >
          <option value="">Seleccionar carrera</option>
          {carreras.map((carrera, index) => (
            <option key={index} value={carrera}>
              {carrera}
            </option>
          ))}
        </select>

        <h5 className="tittle-materia">Materia:</h5>
        <select
          className="input-materia"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
        >
          <option value="">Seleccionar materia</option>
          {materias.map((materia, index) => (
            <option key={index} value={materia}>
              {materia}
            </option>
          ))}
        </select>

        <h5 className="tittle-profesor">Profesor:</h5>
        <select
          className="input-profesor"
          value={profesor}
          onChange={(e) => setProfesor(e.target.value)}
        >
          <option value="">Seleccionar profesor</option>
          {profesores.map((profesor, index) => (
            <option key={index} value={profesor}>
              {profesor}
            </option>
          ))}
        </select>

        <h5 className="tittle-material">Material requerido</h5>
        {materiales.map((_, index) => (
          <div key={index} className="contmaterial">
            <input
              className="input-material"
              placeholder="Introduce el material"
              value={materiales[index].material}
              onChange={(e) => handleMaterialChange(index, e)}
            />
            <input
              className="input-cantmaterial"
              placeholder="Introduce la cantidad"
              type="number"
              value={materiales[index].cantidad}
              onChange={(e) => handleCantidadChange(index, e)}
            />
            <button className='btn-add' type="button" onClick={agregarMaterial}>+</button>
          </div>
        ))}

        {/* Sugerencias de materiales afuera del div de materiales */}
        {materialesSugeridos.sugerencias && materialesSugeridos.sugerencias.length > 0 && (
          <ul className="material-suggestions">
            {materialesSugeridos.sugerencias.map((sugerido, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(sugerido)}>
                {sugerido}
              </li>
            ))}
          </ul>
        )}

        <h5 className="tittle-integrantes">Cantidad de integrantes:</h5>
        <input
          className="input-integrantes"
          type="number"
          value={integrantes}
          onChange={(e) => setIntegrantes(e.target.value)}
        />

        <h5 className="tittle-area">Área:</h5>
        <select
          className="input-area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Seleccionar área</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        <button type="submit" className="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Formulario;