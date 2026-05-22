import { showAlert } from './alertUtils';

export const deleteUtils = {  
  eliminarRegistro: async (modulo, id, nombre, onUpdate) => {
    const result = await showAlert.confirm(
      '¿Estás seguro?',
      `¿Deseas desactivar/eliminar "${nombre}"?`,
      'Sí, desactivar'
    );
    if (!result.isConfirmed) return;

    try {
      const userName = localStorage.getItem('userName');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${modulo}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ userName })
      });

      if (!res.ok) {
        showAlert.error('Error', 'No se pudo desactivar el registro.');
        return;
      }

      showAlert.successToast('Desactivado correctamente');

      if (onUpdate) {
        onUpdate(`${import.meta.env.VITE_API_BASE_URL}/api/${modulo}`);
      }

    } catch (err) {
      console.error("Error en la petición:", err);
      showAlert.error('Error', 'Hubo un error de conexión al desactivar.');
    }
  }
}