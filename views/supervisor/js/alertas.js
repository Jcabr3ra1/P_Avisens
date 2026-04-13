document.addEventListener('DOMContentLoaded', () => {

  // ===== TABS =====
  window.cambiarTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
  };

  // ===== FILTRO POR SEVERIDAD (desde summary cards) =====
  window.filtrarPorSeveridad = function(sev) {
    document.getElementById('filter-severidad').value = sev;
    aplicarFiltrosAlertas();
  };

  // ===== APLICAR FILTROS REALES =====
  window.aplicarFiltrosAlertas = function() {
    const estado = document.getElementById('filter-estado').value;
    const severidad = document.getElementById('filter-severidad').value;
    const galpon = document.getElementById('filter-galpon-alerta').value;
    const busqueda = (document.getElementById('search-alertas').value || '').toLowerCase().trim();

    const cards = document.querySelectorAll('#alertas-container .detailed-alert-card');
    let visible = 0;

    cards.forEach(card => {
      const cardStatus = card.getAttribute('data-status');
      const cardGalpon = card.getAttribute('data-galpon');
      const isResolved = card.classList.contains('resolved') || cardStatus === 'optimal';
      const texto = card.textContent.toLowerCase();

      // Estado filter
      let matchEstado = true;
      if (estado === 'activa') matchEstado = !isResolved;
      else if (estado === 'resuelta') matchEstado = isResolved;

      // Severidad filter
      let matchSev = severidad === 'all' || cardStatus === severidad;
      // Resueltas tienen status "optimal", no deben ocultarse por filtro de severidad si estado=all
      if (isResolved && severidad === 'all') matchSev = true;

      // Galpon filter
      const matchGalpon = galpon === 'all' || cardGalpon === galpon;

      // Busqueda
      const matchBusqueda = !busqueda || texto.includes(busqueda);

      if (matchEstado && matchSev && matchGalpon && matchBusqueda) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update pagination info
    const info = document.querySelector('.pagination-info');
    if (info) info.textContent = `Mostrando ${visible} de ${cards.length} alertas`;
  };

  // ===== LIMPIAR FILTROS =====
  window.limpiarFiltrosAlertas = function() {
    document.getElementById('filter-estado').value = 'activa';
    document.getElementById('filter-severidad').value = 'all';
    document.getElementById('filter-galpon-alerta').value = 'all';
    document.getElementById('search-alertas').value = '';
    aplicarFiltrosAlertas();
    showToast('info', 'Filtros limpiados', 'Mostrando todas las alertas activas.');
  };

  // Aplicar filtro de "Activas" al cargar
  aplicarFiltrosAlertas();

  // ===== RESOLVER ALERTA =====
  window.abrirResolverAlerta = function(id, titulo, galpon) {
    document.getElementById('resolver-id').value = id;
    document.getElementById('resolver-galpon').value = galpon;
    document.getElementById('resolver-titulo').textContent = titulo;
    document.getElementById('resolver-accion').value = '';
    document.getElementById('resolver-notas').value = '';
    document.getElementById('resolver-estado').value = 'resuelto';
    document.getElementById('resolver-chars').textContent = '0 / 1000 caracteres';
    openModal('modal-resolver');
  };

  // Contador de caracteres en notas
  const notasInput = document.getElementById('resolver-notas');
  if (notasInput) {
    notasInput.addEventListener('input', function() {
      document.getElementById('resolver-chars').textContent = this.value.length + ' / 1000 caracteres';
    });
  }

  window.confirmarResolucion = function() {
    const accion = document.getElementById('resolver-accion').value;
    const notas = document.getElementById('resolver-notas').value.trim();
    const id = document.getElementById('resolver-id').value;

    if (!accion) {
      showToast('error', 'Campo requerido', 'Selecciona la acción tomada.');
      return;
    }
    if (notas.length < 20) {
      showToast('error', 'Notas insuficientes', 'Las notas deben tener al menos 20 caracteres.');
      return;
    }

    // Marcar la alerta como resuelta visualmente
    const alertCard = document.querySelector(`[data-id="${id}"]`);
    if (alertCard) {
      alertCard.classList.remove('unread');
      alertCard.classList.add('resolved');
      alertCard.setAttribute('data-status', 'optimal');

      // Cambiar icono
      const iconEl = alertCard.querySelector('.alert-icon-large');
      if (iconEl) {
        iconEl.classList.remove('pulse-animation');
        iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      }

      // Cambiar acciones por badge resuelta
      const actionsEl = alertCard.querySelector('.alert-actions');
      if (actionsEl) {
        actionsEl.innerHTML = `
          <span class="badge optimal-badge"><i class="fa-solid fa-check"></i> Resuelta</span>
          <span class="text-xs text-muted">por María López - Ahora</span>
        `;
      }

      // Agregar meta de resolución
      const metaEl = alertCard.querySelector('.alert-meta');
      if (metaEl) {
        metaEl.innerHTML += `<span class="alert-meta-item"><i class="fa-solid fa-user-check"></i> Resuelta por: María López</span>`;
      }
    }

    // Actualizar contadores
    const countCriticas = document.getElementById('count-criticas');
    const currentCount = parseInt(countCriticas.textContent);
    if (currentCount > 0) {
      countCriticas.textContent = currentCount - 1;
    }

    closeModal('modal-resolver');
    showToast('success', 'Alerta resuelta', `La alerta ${id} ha sido marcada como resuelta exitosamente.`);
  };

  // ===== DETALLE DE ALERTA =====
  const alertasData = {
    'A-001': {
      titulo: 'Temperatura Crítica detectada',
      galpon: 'Galpón 3',
      tipo: 'Ambiental - Temperatura',
      severidad: 'Crítica',
      estado: 'Activa',
      creada: '2026-03-17 10:40:15',
      duracion: '15 min 32 seg',
      valorActual: '35.2°C',
      umbralCritico: '>34°C',
      umbralOptimo: '28-32°C',
      contexto: { humedad: '72%', co2: '1150 ppm', nh3: '22 ppm' },
      historial: '3 veces en últimos 30 días, promedio 12 min'
    },
    'A-002': {
      titulo: 'Niveles de Amoníaco peligrosos',
      galpon: 'Galpón 3',
      tipo: 'Ambiental - Amoníaco',
      severidad: 'Crítica',
      estado: 'Activa',
      creada: '2026-03-17 10:33:00',
      duracion: '25 min',
      valorActual: '22 ppm',
      umbralCritico: '>20 ppm',
      umbralOptimo: '<10 ppm',
      contexto: { humedad: '72%', co2: '1150 ppm', temp: '35°C' },
      historial: '2 veces en últimos 30 días, promedio 20 min'
    },
    'A-003': {
      titulo: 'CO₂ Elevado',
      galpon: 'Galpón 2',
      tipo: 'Ambiental - CO₂',
      severidad: 'Advertencia',
      estado: 'Activa',
      creada: '2026-03-17 10:20:00',
      duracion: '35 min',
      valorActual: '920 ppm',
      umbralCritico: '>1000 ppm',
      umbralOptimo: '<800 ppm',
      contexto: { humedad: '62%', temp: '29°C', nh3: '15 ppm' },
      historial: '5 veces en últimos 30 días'
    }
  };

  window.abrirDetalleAlerta = function(id) {
    const data = alertasData[id];
    if (!data) {
      showToast('info', 'Sin datos', 'No hay información detallada para esta alerta.');
      return;
    }

    const body = document.getElementById('detalle-alerta-body');
    body.innerHTML = `
      <div style="margin-bottom:1.25rem;">
        <h4 style="font-size:1.1rem; margin-bottom:0.5rem;">${data.titulo}</h4>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <span class="badge ${data.severidad === 'Crítica' ? 'critical-badge' : 'warning-badge'}">${data.severidad}</span>
          <span class="badge ${data.estado === 'Activa' ? 'warning-badge' : 'optimal-badge'}">${data.estado}</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
        <div class="form-group" style="margin-bottom:0;">
          <label>Galpón</label>
          <div style="color:var(--text-primary); font-weight:600;">${data.galpon}</div>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label>Tipo</label>
          <div style="color:var(--text-primary);">${data.tipo}</div>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label>Creada</label>
          <div style="color:var(--text-primary);">${data.creada}</div>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label>Duración</label>
          <div style="color:var(--text-primary);">${data.duracion}</div>
        </div>
      </div>

      <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:0.5rem; padding:1rem; margin-bottom:1.25rem;">
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem; text-transform:uppercase;">Valores</div>
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Actual</div>
            <div style="font-size:1.25rem; font-weight:700; color:var(--status-critical);">${data.valorActual}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Umbral Crítico</div>
            <div style="font-size:1.25rem; font-weight:700;">${data.umbralCritico}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Rango Óptimo</div>
            <div style="font-size:1.25rem; font-weight:700; color:var(--status-optimal);">${data.umbralOptimo}</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:1.25rem;">
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem; text-transform:uppercase;">Contexto del galpón</div>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          ${Object.entries(data.contexto).map(([k,v]) => `<span class="badge neutral-badge">${k}: ${v}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.25rem; text-transform:uppercase;">Historial</div>
        <p style="font-size:0.85rem; color:var(--text-secondary);">${data.historial}</p>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('modal-detalle-alerta')">Cerrar</button>
        <button class="btn-primary" onclick="closeModal('modal-detalle-alerta'); abrirResolverAlerta('${id}','${data.titulo}','${data.galpon}');">
          <i class="fa-solid fa-check"></i> Resolver
        </button>
      </div>
    `;
    openModal('modal-detalle-alerta');
  };

  // ===== GUARDAR REGLA =====
  window.guardarReglaAlerta = function() {
    const nombre = document.getElementById('regla-nombre').value.trim();
    if (!nombre) {
      showToast('error', 'Campo requerido', 'Escribe un nombre para la regla.');
      return;
    }
    const valor = document.getElementById('regla-valor').value;
    if (!valor) {
      showToast('error', 'Campo requerido', 'Especifica un valor para la condición.');
      return;
    }

    const param = document.getElementById('regla-param').selectedOptions[0].text;
    const operador = document.getElementById('regla-operador').selectedOptions[0].text;

    // Agregar a la lista visual
    const rulesList = document.querySelector('.rules-list');
    const newRule = document.createElement('div');
    newRule.className = 'rule-card';
    newRule.style.animation = 'fadeIn 0.5s ease forwards';
    newRule.innerHTML = `
      <div class="rule-info">
        <div class="rule-name">📋 ${nombre}</div>
        <div class="rule-condition">Si ${param} ${operador} ${valor} → Alerta</div>
        <div class="rule-meta">
          <span>Creada ahora</span>
          <span>Activa</span>
          <span>María López</span>
        </div>
      </div>
      <div class="rule-actions">
        <button class="icon-btn edit" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn delete" title="Desactivar"><i class="fa-solid fa-toggle-off"></i></button>
      </div>
    `;
    rulesList.insertBefore(newRule, rulesList.firstChild);

    closeModal('modal-nueva-regla-alerta');
    showToast('success', 'Regla creada', `La regla "${nombre}" se ha activado correctamente.`);
  };

});
