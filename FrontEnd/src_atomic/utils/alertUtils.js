import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showAlert = {
  successToast: (message) => {
    Toast.fire({
      icon: 'success',
      title: message
    });
  },

  errorToast: (message) => {
    Toast.fire({
      icon: 'error',
      title: message
    });
  },

  success: (title, text) => {
    return Swal.fire({
      icon: 'success',
      title: title || '¡Éxito!',
      text: text,
      confirmButtonColor: '#43523A',
    });
  },

  error: (title, text) => {
    return Swal.fire({
      icon: 'error',
      title: title || '¡Error!',
      text: text || 'Algo salió mal. Por favor, intenta de nuevo.',
      confirmButtonColor: '#d33',
    });
  },

  confirm: (title, text, confirmButtonText = 'Sí, continuar', cancelButtonText = 'Cancelar') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43523A',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: true
    });
  }
};
