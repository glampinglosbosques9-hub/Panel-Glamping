import ModalPlantilla from "../../../components/organisms/Modales/modalPlantilla";
import { useForm } from "../../../hooks/useForm";
import styled from "styled-components";
import SelectBase from "../../../components/atoms/select/selectBase";
import { useState, useEffect } from "react";
import { useFetch } from "../../../hooks/fetchConnect";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  input, textarea, select {
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
  button {
    padding: 10px;
    background-color: #43523A;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      background-color: #2c3825;
    }
  }
  label {
    font-size: 14px;
    color: #555;
    margin-bottom: -5px;
    font-weight: 500;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export default function ModalAgregarDano({ setModalAbierto, fetchData }) {
  const [cabanas, setCabanas] = useState([]);
  const { data, loading, error, fetchData: fetchCabins } = useFetch();
  useEffect(() => {
    fetchCabins(`${import.meta.env.VITE_API_BASE_URL}/api/cabins`);
  }, [fetchCabins]);
  useEffect(() => {
    if (data) {
      setCabanas([{ id: "", nombre: "Seleccione una cabaña" }, ...data]);
    }
  }, [data]);
  const { formData, handleChange, handleSubmit, submitting, submitError } = useForm(
    { 
      cabanaid: '', 
      descripcion: '',
      estado: 'Pendiente', 
      fechaRegistro: new Date().toISOString().split('T')[0],
      fechaarreglo: '',
      responsable: '',
    },
    `${import.meta.env.VITE_API_BASE_URL}/api/cabinDamage`,
    () => {
      fetchData(); // recarga la tabla en la vista principal
      setModalAbierto(false); // Cerramos el modal al tener éxito
    }
  );
  const estados = [
    { id: "", nombre: "Seleccione un estado" },
    { id: "Pendiente", nombre: "Pendiente" },
    { id: "En proceso", nombre: "En proceso" },
    { id: "Terminado", nombre: "Terminado" }
  ];
  return (
    <ModalPlantilla modulo="daños" onClose={() => setModalAbierto(false)}>
      <Form onSubmit={(e) => handleSubmit(e, () => setModalAbierto(false))}>
        
        <FormGroup>
          <label>Cabaña *</label>
          <SelectBase
            name="cabanaid"
            value={formData.cabanaid}
            onChange={handleChange}
            required
            options={cabanas}
            valueKey="id"
            nameKey="nombre"
          />
        </FormGroup>
        <FormGroup>
          <label>Descripción * (mínimo 10 caracteres)</label>
          <textarea
            name="descripcion"
            placeholder="Descripción detallada del daño"
            value={formData.descripcion}
            onChange={handleChange}
            required
            minLength={10}
          />
        </FormGroup>
        <FormGroup>
          <label>Estado *</label>
          <SelectBase
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            options={estados}
            valueKey="id"
            nameKey="nombre"
          />
        </FormGroup>
        <FormGroup>
          <label>Fecha de Registro *</label>
          <input
            type="date"
            name="fechaRegistro"
            value={formData.fechaRegistro}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Fecha de Arreglo *</label>
          <input
            type="date"
            name="fechaarreglo"
            value={formData.fechaarreglo}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Responsable * (mínimo 3 caracteres)</label>
          <input
            type="text"
            name="responsable"
            placeholder="Nombre del responsable"
            value={formData.responsable}
            onChange={handleChange}
            required
            minLength={3}
          />
        </FormGroup>
        {submitError && <p style={{ color: 'red', fontSize: '14px' }}>{submitError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar Daño'}
        </button>
      </Form>
    </ModalPlantilla>
  );
}
