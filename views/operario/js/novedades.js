// js/novedades.js

// Función para el contador de aves (+ y -)
function updateCounter(change) {
    const input = document.getElementById('cantidadAves');
    let current = parseInt(input.value) || 0;
    let newVal = current + change;
    
    // Evitar números negativos
    if (newVal < 0) newVal = 0; 
    input.value = newVal;
}

// Evento al enviar el formulario
document.getElementById('formMortalidad').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita recargar la página

    const cantidad = document.getElementById('cantidadAves').value;
    const causa = document.getElementById('causaProbable').value;
    
    if(cantidad === "0" || cantidad === 0) {
        alert("Por favor, registre al menos 1 ave para enviar el reporte.");
        return;
    }

    // 1. Simular el guardado exitoso
    alert(`¡Éxito! Se registró la mortalidad de ${cantidad} aves por ${causa}.`);

    // 2. Agregar visualmente el nuevo registro al historial
    const historialContainer = document.getElementById('historialRegistros');
    
    // Crear nueva tarjeta HTML
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'history-card fade-in';
    // Si la cantidad es mayor a 5, la marcamos como crítica (roja)
    if(parseInt(cantidad) >= 5) {
        nuevaTarjeta.style.borderLeftColor = 'var(--status-critical)';
    } else {
        nuevaTarjeta.style.borderLeftColor = 'var(--status-warning)';
    }

    nuevaTarjeta.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <strong>${cantidad} Aves</strong>
            <span style="color: var(--text-secondary); font-size: 0.8rem;">Justo ahora</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">${causa} - Ingresado por ti.</p>
    `;

    // Insertar al principio de la lista
    historialContainer.prepend(nuevaTarjeta);

    // 3. Resetear el formulario
    document.getElementById('cantidadAves').value = 0;
    this.reset();
});