import { useState } from "react";
import ModalPlantilla from "../../../components/organisms/Modales/modalPlantilla";
import { useForm } from "../../../hooks/useForm";
import styled from "styled-components";
import CabinImagesEditor from "./cabinImagesEditor";

const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  background-color: #637856ff;
  border: none;
  border-radius: 5px;
  border-bottom: ${props => props.active ? "3px solid #4A90E2" : "none"};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  &:hover {
    background-color: #36422fff;
  }
  &:focus {
    background-color: #36422fff;
  }
  &:active {
    background-color: #36422fff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: inherit;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  button[type="submit"] {
    padding: 10px;
    background-color: #4A90E2; 
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      background-color: #357ABD;
    }
  }
`;

export default function ModalEditar({ setModalAbierto, fetchData, cabanaAEditar }) {
  const [activeTab, setActiveTab] = useState('detalles');
  const urlParams = `${import.meta.env.VITE_API_BASE_URL}/api/cabins/${cabanaAEditar.id}`;

  const { formData, handleChange, handleSubmit, submitting } = useForm(
    {
      nombre: cabanaAEditar.nombre || cabanaAEditar.nombre || '',
      capacidad_personas: cabanaAEditar.capacidad || cabanaAEditar.capacidad || '',
      precio_noche: cabanaAEditar["Precio noche"] || cabanaAEditar["precio noche"] || '',
      descripcion: cabanaAEditar.descripcion || cabanaAEditar.descripcion || '',
      imagenes: [],

      userName: localStorage.getItem('userName') || '',
    },
    urlParams,
    () => {
      fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/cabins`);
      setModalAbierto(false);
    },
    'PUT',
    true // isFormData
  );

  return (
    <ModalPlantilla titulo="Editar Cabaña" onClose={() => setModalAbierto(false)}>
      <TabsContainer>
        <TabButton 
          active={activeTab === 'detalles'} 
          onClick={() => setActiveTab('detalles')}
          type="button"
        >
          Editar Cabaña
        </TabButton>
        <TabButton 
          active={activeTab === 'imagenes'} 
          onClick={() => setActiveTab('imagenes')}
          type="button"
        >
          Editar Imágenes
        </TabButton>
      </TabsContainer>

      {activeTab === 'detalles' ? (
        <Form onSubmit={(e) => handleSubmit(e, () => setModalAbierto(false))}>
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre de la cabaña" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="capacidad_personas" 
            placeholder="Capacidad de personas" 
            value={formData.capacidad_personas} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            step="0.01" 
            name="precio_noche" 
            placeholder="Precio por noche" 
            value={formData.precio_noche} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="descripcion" 
            placeholder="Descripción de la cabaña" 
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
          />
          <label style={{ fontSize: '14px', color: '#555', marginBottom: '-10px' }}>Imágenes (opcional):</label>
          <input type="file" name="imagenes" multiple accept="image/*" onChange={handleChange} />
          
          <button type="submit" disabled={submitting}>
            {submitting ? 'Actualizando...' : 'Actualizar Cabaña'}
          </button>
        </Form>
      ) : (
        <CabinImagesEditor cabanaId={cabanaAEditar.id} />
      )}
    </ModalPlantilla>
  );
}
