// Simulación de Base de Datos temporal
let inventario = {
    alimento: {
        total: 500,     // Total de inventario
        consumido: 300  // Consumo inicial (60%)
    }
};

// Función para actualizar la UI
function actualizarGraficos() {
    // Cálculos matemáticos
    let porcentaje = (inventario.alimento.consumido / inventario.alimento.total) * 100;
    // Asegurarnos que no pase del 100% visualmente
    let anchoBarra = porcentaje > 100 ? 100 : porcentaje; 

    // 1. Actualizar Texto
    document.getElementById('textoAlimento').innerText = `${inventario.alimento.consumido} / ${inventario.alimento.total} Kg (${Math.round(porcentaje)}%)`;

    // 2. Actualizar Ancho de la Barra
    let barra = document.getElementById('barraAlimento');
    barra.style.width = `${anchoBarra}%`;

    // 3. Cambiar color estilo Semáforo
    barra.className = 'progress-fill'; // Limpiamos clases
    if (porcentaje >= 90) {
        barra.classList.add('fill-critical'); // Rojo
    } else if (porcentaje >= 75) {
        barra.classList.add('fill-warning');  // Amarillo
    } else {
        barra.classList.add('fill-normal');   // Verde
    }
}

// Función para mostrar mensajes en pantalla
function mostrarMensaje(mensaje, tipo) {
    let caja = document.getElementById('mensajeNotificacion');
    caja.innerText = mensaje;
    caja.className = `alerta-mensaje ${tipo}`;
    caja.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        caja.style.display = 'none';
    }, 3000);
}

// Evento al dar clic en el botón de "Añadir Consumo"
document.getElementById('formConsumo').addEventListener('submit', function(e){
    e.preventDefault(); // Evita que recargue la página

    // Capturar datos del formulario
    let tipo = document.getElementById('tipoInsumo').value;
    let cantidadIngresada = parseInt(document.getElementById('cantidadInsumo').value);

    // Validar si es "Alimento" para hacer la lógica matemática
    if(tipo.includes('Alimento')) {
        let restante = inventario.alimento.total - inventario.alimento.consumido;

        if (cantidadIngresada > restante) {
            mostrarMensaje(`¡Error! Solo quedan ${restante} Kg disponibles en inventario.`, 'alerta-error');
            return; // Detiene la ejecución
        }

        // Sumamos la cantidad al total consumido
        inventario.alimento.consumido += cantidadIngresada;
        
        // Actualizamos la vista
        actualizarGraficos();
        mostrarMensaje(`¡Éxito! Se registraron ${cantidadIngresada} Kg de ${tipo}.`, 'alerta-exito');
    } else {
        // Para otros insumos (Medicina, etc) solo mostramos el mensaje por ahora
        mostrarMensaje(`¡Éxito! Se registró el consumo de ${tipo}.`, 'alerta-exito');
    }

    // Limpiar el formulario
    this.reset();
});

// Inicializamos los gráficos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarGraficos();
});