// js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    // Buscar todos los botones de "marcar como leído" (los que tengan la clase dismiss-alert)
    const dismissButtons = document.querySelectorAll('.dismiss-alert');

    dismissButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Encontrar el contenedor de la alerta padre
            const alerta = this.closest('.alert-item');
            
            // Efecto visual de desvanecimiento
            alerta.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            alerta.style.opacity = "0";
            alerta.style.transform = "translateX(20px)";
            
            // Eliminar del DOM después de la animación y actualizar contador
            setTimeout(() => {
                alerta.remove();
                actualizarContadorAlertas();
            }, 300);
        });
    });
});

function actualizarContadorAlertas() {
    const alertasRestantes = document.querySelectorAll('.alert-item').length;
    const badge = document.getElementById('contadorAlertasBadge');
    
    if(badge) {
        if(alertasRestantes > 0) {
            badge.innerText = `${alertasRestantes} Pendientes`;
        } else {
            badge.className = "badge optimal-badge"; // Cambia a verde
            badge.innerText = "Todo normal";
        }
    }
}