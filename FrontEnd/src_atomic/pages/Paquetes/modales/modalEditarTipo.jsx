import ModalPlantilla from "../../../components/organisms/Modales/modalPlantilla";
import { useForm } from "../../../hooks/useForm";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: inherit;
  }

  button {
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

export default function ModalEditarTipo({ setModalAbierto, fetchData, tipoAEditar }) {
  const id = tipoAEditar.tipo_id || tipoAEditar.id;
  const urlParams = `${import.meta.env.VITE_API_BASE_URL}/api/packages/types/${id}`;

  const { formData, handleChange, handleSubmit, submitting } = useForm(
    {
      nombre: tipoAEditar.nombre || '',
      userName: localStorage.getItem('userName') || '',
    },
    urlParams,
    () => {
      fetchData();
      setModalAbierto(false);
    },
    'PUT'
  );

  return (
    <ModalPlantilla modulo="editar tipo de paquete" onClose={() => setModalAbierto(false)}>
      <Form onSubmit={(e) => handleSubmit(e, () => setModalAbierto(false))}>
        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre del tipo" 
          value={formData.nombre} 
          onChange={handleChange} 
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Actualizando...' : 'Actualizar Tipo'}
        </button>
      </Form>
    </ModalPlantilla>
  );
}
