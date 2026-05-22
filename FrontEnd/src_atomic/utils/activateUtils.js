import { showAlert } from './alertUtils';

export const activateUtils = {
  activarRegistro: async (modulo, id, nombre, onUpdate) => {
    const result = await showAlert.confirm(
      '¿Estás seguro?',
      `¿Deseas activar "${nombre}"?`,
      'Sí, activar'
    );
    if (!result.isConfirmed) return;

    try {
      const userName = localStorage.getItem('userName');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${modulo}/activate/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ userName })
      });

      if (!res.ok) {
        showAlert.error('Error', 'No se pudo activar el registro.');
        return;
      }

      showAlert.successToast('Activado correctamente');

      if (onUpdate) {
        onUpdate(`${import.meta.env.VITE_API_BASE_URL}/api/${modulo}`);
      }

    } catch (err) {
      console.error("Error en la petición:", err);
      showAlert.error('Error', 'Hubo un error de conexión al activar.');
    }
  }
}