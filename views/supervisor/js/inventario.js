// Esperamos a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELECCIÓN DE ELEMENTOS DEL MODAL ---
    const btnNuevoIngreso = document.querySelector('.btn-outline'); // El botón "+ Nuevo Ingreso"
    const modalInventario = document.getElementById('modal-inventario');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal-inv');
    const btnCancelar = document.getElementById('btn-cancelar-inv');
    const formIngreso = document.getElementById('form-nuevo-ingreso');
    const tbodyInventario = document.querySelector('.data-table tbody'); // El cuerpo de la tabla

    // --- 2. FUNCIONES PARA ABRIR Y CERRAR EL MODAL ---
    const abrirModal = () => {
        modalInventario.classList.remove('hidden');
    };

    const cerrarModal = () => {
        modalInventario.classList.add('hidden');
        formIngreso.reset(); // Limpia el formulario al cerrar
    };

    // --- 3. ASIGNACIÓN DE EVENTOS ---
    
    // Abrir modal al hacer clic en "Nuevo Ingreso"
    if (btnNuevoIngreso) {
        btnNuevoIngreso.addEventListener('click', abrirModal);
    }

    // Cerrar modal con la X o el botón Cancelar
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic fuera del modal (en el fondo oscuro)
    modalInventario.addEventListener('click', (e) => {
        if (e.target === modalInventario) {
            cerrarModal();
        }
    });

    // --- 4. LÓGICA PARA REGISTRAR EL NUEVO INGRESO EN LA TABLA ---
    formIngreso.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Obtenemos los valores de los inputs
        const nombre = document.getElementById('producto-nombre').value;
        const categoria = document.getElementById('producto-categoria').value;
        const cantidad = document.getElementById('producto-cantidad').value;
        const notas = document.getElementById('producto-notas').value;

        // Determinamos la unidad de medida según la categoría
        let unidad = "unidades";
        if(categoria === "Alimento") unidad = "bultos";
        if(categoria === "Medicamento") unidad = "frascos";
        if(categoria === "Suministros") unidad = "pacas";

        // Creamos una nueva fila (tr) para la tabla
        const nuevaFila = document.createElement('tr');
        
        // Plantilla HTML de la nueva fila (simulando un stock del 100% como es un nuevo ingreso)
        nuevaFila.innerHTML = `
            <td>
                <strong>${nombre}</strong><br>
                <span class="text-xs text-muted">${notas}</span>
            </td>
            <td>${categoria}</td>
            <td>${cantidad} ${unidad}</td>
            <td>
                <div class="mini-progress-container">
                    <div class="mini-progress-bar optimal-bg" style="width: 100%;"></div>
                </div>
                <span class="text-xs text-muted">100% lleno</span>
            </td>
            <td><span class="badge optimal-badge">Nuevo Ingreso</span></td>
        `;

        // Añadimos la fila al principio de la tabla
        tbodyInventario.insertBefore(nuevaFila, tbodyInventario.firstChild);

        // Cerramos el modal y mostramos un mensaje rápido
        cerrarModal();
        alert(`¡Éxito! Se han registrado ${cantidad} ${unidad} de ${nombre}.`);
    });

});