// Esperamos a que todo el HTML cargue primero
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Seleccionamos los elementos principales
  const modal = document.getElementById('modal-usuario');
  const btnAbrirModal = document.getElementById('btn-abrir-modal'); // Botón de Añadir
  const btnCerrarModal = document.getElementById('btn-cerrar-modal'); // La X de la esquina
  const btnCancelar = document.getElementById('btn-cancelar'); // Botón cancelar
  const tituloModal = document.querySelector('.modal-header h3'); // El <h3> del título
  const botonesEliminar = document.querySelectorAll('.icon-btn.delete');

  // 2. Seleccionamos TODOS los botones de editar de la tabla
  const botonesEditar = document.querySelectorAll('.icon-btn.edit');

  // Función para abrir el modal y cambiarle el título
  const abrirModal = (titulo) => {
    tituloModal.textContent = titulo; // Asigna el nuevo título
    modal.classList.remove('hidden'); // Quita la clase que lo oculta
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    modal.classList.add('hidden'); // Vuelve a poner la clase que lo oculta
  };

  // 3. Evento para el botón principal de "Añadir Usuario"
  if (btnAbrirModal) {
    btnAbrirModal.addEventListener('click', () => {
      abrirModal('Añadir Nuevo Usuario');
      // Opcional: Aquí podrías limpiar el formulario con document.querySelector('form').reset();
    });
  }

  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      // Buscamos la fila (tr) completa donde se hizo clic
      const fila = boton.closest('tr');
      // Extraemos el nombre del usuario para hacerlo más personalizado
      const nombreUsuario = fila.querySelector('strong').textContent;

      // Mostramos una alerta de confirmación del navegador
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombreUsuario}"?`);

      // Si el administrador hace clic en "Aceptar", borramos la fila
      if (confirmacion) {
        fila.remove(); // Esta línea elimina visualmente el elemento del HTML
        
        // (Opcional: Si más adelante conectas esto a una base de datos, 
        // aquí iría el código fetch() para borrarlo también del servidor)
      }
    });
  });

  // 4. Evento para CADA botón de "Editar" en la tabla
  botonesEditar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      // Magia extra: Buscamos la fila (tr) donde se hizo clic para sacar el nombre del usuario
      const fila = boton.closest('tr');
      const nombreUsuario = fila.querySelector('strong').textContent;

      // Abrimos el modal con el título personalizado
      abrirModal(`Editar Usuario: ${nombreUsuario}`);
      
      // (En el futuro, aquí puedes poner código para que los inputs se llenen con los datos de esa fila)
    });
  });

  // 5. Eventos para cerrar el modal
  if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

  // 6. Cerrar modal si el usuario hace clic afuera del cuadro blanco (en el fondo semitransparente)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

});