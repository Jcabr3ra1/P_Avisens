/* =======================================================
   AVISENS – Utilidades Compartidas (Toast + Helpers)
   ======================================================= */

// ===== TOAST NOTIFICATIONS =====
(function () {
  // Crear contenedor de toasts si no existe
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  /**
   * Muestra un toast notification
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {string} title - Título del toast
   * @param {string} message - Mensaje descriptivo
   * @param {number} duration - Duración en ms (default 3500)
   */
  window.showToast = function (type, title, message, duration) {
    if (!duration) {
      duration = type === 'error' ? 5000 : type === 'warning' ? 4000 : 3500;
    }

    const icons = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="toast-icon ${icons[type] || icons.info}"></i>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();

// ===== MODAL HELPERS =====
window.openModal = function (id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
};

window.closeModal = function (id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
};

// Cerrar modal al clic fuera
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay') && !e.target.classList.contains('hidden')) {
    e.target.classList.add('hidden');
  }
});

// ===== CONFIRM MODAL (reemplazo de confirm()) =====
window.showConfirm = function (title, message, onConfirm, onCancel) {
  // Eliminar confirm anterior si existe
  const existing = document.getElementById('confirm-modal-global');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'confirm-modal-global';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content modal-warning" style="max-width: 420px;">
      <div class="modal-header">
        <h3><i class="fa-solid fa-triangle-exclamation" style="color: var(--status-warning);"></i> ${title}</h3>
        <button class="icon-btn" onclick="closeModal('confirm-modal-global')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${message}</p>
        <div class="modal-actions">
          <button class="btn-secondary" id="confirm-cancel-btn">Cancelar</button>
          <button class="btn-primary" id="confirm-ok-btn">Sí, Confirmar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('confirm-ok-btn').addEventListener('click', () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });

  document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });
};

// ===== FORMATO DE FECHAS =====
window.formatTimestamp = function (date) {
  if (!date) date = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

window.formatTimeAgo = function (minutes) {
  if (minutes < 60) return `Hace ${minutes} min`;
  if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} hr`;
  return `Hace ${Math.floor(minutes / 1440)} días`;
};

// ===== EXPORTAR CSV =====
window.exportToCSV = function (filename, headers, rows) {
  let csv = headers.join(',') + '\n';
  rows.forEach((row) => {
    csv += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
  });
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('info', 'Exportación', `Archivo "${filename}" descargado`);
};

// ===== CERRAR SESIÓN =====
window.cerrarSesion = function () {
  showConfirm(
    'Cerrar Sesión',
    '¿Seguro que deseas cerrar sesión? Serás redirigido a la página de login.',
    () => {
      showToast('info', 'Sesión cerrada', 'Redirigiendo al login...');
      setTimeout(() => {
        window.location.href = '../login.html';
      }, 1000);
    }
  );
};
