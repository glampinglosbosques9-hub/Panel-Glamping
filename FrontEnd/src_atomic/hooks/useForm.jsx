import { useState } from "react";
import { useFetch } from "./fetchConnect";
import { showAlert } from "../utils/alertUtils";

/**
 * Hook personalizado para manejar formularios, sus estados y envío al backend
 * reutilizando la lógica base de useFetch internamente.
 * 
 * @param {Object} initialState - El estado con valores iniciales del formulario (ej. { nombre: '', edad: 0 })
 * @param {string} url - El endpoint a donde enviar (POST) los datos
 * @param {Function} onSuccess - Un callback que se ejecuta tras una respuesta HTTP 200/201 éxitosa (ideal para recargar tablas)
 * @param {string} method - El método HTTP a utilizar
 * @param {boolean} isFormData - Indica si se debe enviar como FormData
 */
export const useForm = (initialState, url, onSuccess, method = 'POST', isFormData = false) => {
  const [formData, setFormData] = useState(initialState);
  const { loading: submitting, error: submitError, fetchData: postData } = useFetch();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files : value
    }));
  };

  const handleSubmit = async (e, cerrarModal) => {
    if (e && e.preventDefault) e.preventDefault(); // Verificación por si se llama manualmente

    try {
      const cleanedData = { ...formData };
      
      const userName = localStorage.getItem('userName');
      if (userName) {
        cleanedData.userName = userName;
      }

      Object.keys(cleanedData).forEach(key => {
        if (key.includes('_id') && cleanedData[key] === '') {
          cleanedData[key] = null;
        }
      });

      let bodyData;
      let reqHeaders = undefined;

      if (isFormData) {
        bodyData = new FormData();
        Object.keys(cleanedData).forEach(key => {
          if (Array.isArray(cleanedData[key]) || cleanedData[key] instanceof FileList) {
            for (let i = 0; i < cleanedData[key].length; i++) {
              bodyData.append(key, cleanedData[key][i]);
            }
          } else {
            bodyData.append(key, cleanedData[key]);
          }
        });
      } else {
        bodyData = JSON.stringify(cleanedData);
        reqHeaders = { 'Content-Type': 'application/json' };
      }

      // IMPORTANTE: postData debe lanzar un error si la respuesta no es 2xx
      const response = await postData(url, {
        method: method,
        body: bodyData,
        headers: reqHeaders
      });

      // SI LLEGAMOS AQUÍ, ES QUE FUE EXITOSO (Status 200-299)
      showAlert.successToast(response.message || 'Operación realizada con éxito');

      if (method === 'POST') {
        setFormData(initialState);
      }

      if (cerrarModal) cerrarModal();
      if (onSuccess) onSuccess(response); // Pasamos la respuesta (donde viene el TOKEN)

    } catch (err) {
      console.error("Error al enviar formulario:", err);
      showAlert.error('Error al enviar formulario', err.message || 'Ocurrió un error inesperado.');
    }
  };

  return { formData, handleChange, handleSubmit, submitting, submitError, setFormData };
};
