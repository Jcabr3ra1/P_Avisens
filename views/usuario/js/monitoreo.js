/* =======================================================
   AVISENS – Módulo Unificado: Sensores + Alertas + Automatización
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════════
  //  TABS PRINCIPALES (Sensores / Alertas / Automatización)
  // ═══════════════════════════════════════════════════
  window.cambiarTabPrincipal = function(tabId, btn) {
    // Desactivar todos los tab-content de nivel principal
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    // Desactivar todos los botones del tabs principal
    document.querySelectorAll('#main-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    // Activar el tab seleccionado
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    btn.classList.add('active');
    // Resetear scroll para no quedar a mitad del contenido nuevo
    const contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.scrollTop = 0;
  };

  // Acceso directo desde alertas → filtrar sensores por G4
  window.irASensoresG4 = function() {
    const btn = document.querySelector('#main-tabs .tab-btn');
    cambiarTabPrincipal('tab-sensores', btn);
    const galponSelect = document.getElementById('filter-galpon');
    if (galponSelect) { galponSelect.value = '4'; aplicarFiltrosSensores(); }
  };

  // ═══════════════════════════════════════════════════
  //  SUB-TABS (dentro de Alertas y Automatización)
  // ═══════════════════════════════════════════════════
  window.cambiarSubTab = function(tabId, btn, containerId) {
    // Encontrar el contenedor de sub-tabs
    const container = document.getElementById(containerId);
    if (!container) return;

    // Desactivar botones del sub-tab container
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Encontrar el padre que contiene los sub-tab-contents
    const parent = container.parentElement;
    if (!parent) return;

    // Desactivar todos los sub-tab-contents del mismo nivel
    parent.querySelectorAll(':scope > .sub-tab-content').forEach(t => t.classList.remove('active'));

    // Activar el seleccionado
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
  };


  // ═══════════════════════════════════════════════════
  //  SENSORES: CONFIGURACIÓN DE UMBRALES
  // ═══════════════════════════════════════════════════
  const defaults = {
    'Temperatura': { optMin:22, optMax:26, warnMin:18, warnMax:30, critMin:15, critMax:33 },
    'Humedad':     { optMin:50, optMax:70, warnMin:40, warnMax:80, critMin:30, critMax:85 },
    'CO₂':         { optMin:0,  optMax:3000, warnMin:0, warnMax:5000, critMin:0, critMax:6000 },
    'Amoníaco':    { optMin:0,  optMax:20, warnMin:0, warnMax:35, critMin:0, critMax:40 }
  };

  window.abrirConfigSensor = function(id, tipo, galpon) {
    document.getElementById('cfg-sensor-id').value = id;
    document.getElementById('cfg-sensor-galpon').value = galpon;
    document.getElementById('cfg-tipo-label').textContent = 'Parámetro: ' + tipo;

    const d = defaults[tipo] || defaults['Temperatura'];
    document.getElementById('cfg-opt-min').value = d.optMin;
    document.getElementById('cfg-opt-max').value = d.optMax;
    document.getElementById('cfg-warn-min').value = d.warnMin;
    document.getElementById('cfg-warn-max').value = d.warnMax;
    document.getElementById('cfg-crit-min').value = d.critMin;
    document.getElementById('cfg-crit-max').value = d.critMax;

    openModal('modal-config-sensor');
  };

  window.guardarConfigSensor = function() {
    const optMin = parseFloat(document.getElementById('cfg-opt-min').value);
    const optMax = parseFloat(document.getElementById('cfg-opt-max').value);
    const warnMin = parseFloat(document.getElementById('cfg-warn-min').value);
    const warnMax = parseFloat(document.getElementById('cfg-warn-max').value);

    if (optMin >= optMax) {
      showToast('error', 'Error de validación', 'El mínimo óptimo debe ser menor que el máximo.');
      return;
    }
    if (warnMin >= warnMax) {
      showToast('error', 'Error de validación', 'El mínimo de advertencia debe ser menor que el máximo.');
      return;
    }

    const sensorId = document.getElementById('cfg-sensor-id').value;
    closeModal('modal-config-sensor');
    showToast('success', 'Umbrales actualizados', `Los umbrales del sensor ${sensorId} han sido configurados correctamente.`);
  };

  // ═══════════════════════════════════════════════════
  //  SENSORES: FILTROS
  // ═══════════════════════════════════════════════════
  window.aplicarFiltrosSensores = function() {
    const galpon = document.getElementById('filter-galpon').value;
    const param = document.getElementById('filter-param').value;

    const cards = document.querySelectorAll('#sensors-grid .sensor-card');
    let visible = 0;

    cards.forEach(card => {
      const matchGalpon = galpon === 'all' || card.getAttribute('data-galpon') === galpon;
      const matchParam = param === 'all' || card.getAttribute('data-tipo') === param;

      if (matchGalpon && matchParam) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    const info = document.getElementById('sensores-pagination-info');
    if (info) info.textContent = `Mostrando ${visible} de ${cards.length} sensores`;
  };

  window.limpiarFiltrosSensores = function() {
    document.getElementById('filter-galpon').value = 'all';
    document.getElementById('filter-param').value = 'all';
    document.getElementById('filter-periodo').value = '24h';
    aplicarFiltrosSensores();
    showToast('info', 'Filtros limpiados', 'Se muestran todos los sensores.');
  };

  // ═══════════════════════════════════════════════════
  //  SENSORES: EXPORTAR CSV
  // ═══════════════════════════════════════════════════
  window.exportarSensoresCSV = function() {
    const headers = ['ID Sensor','Galpón','Tipo','Valor','Estado','Timestamp'];
    const ts = new Date().toISOString().slice(0,10);
    const rows = [
      ['S001','Galpón 4','CO₂','3200 ppm','Advertencia',`${ts} 10:45:00`],
      ['S002','Galpón 4','Amoníaco','28 ppm','Advertencia',`${ts} 10:45:00`],
      ['S003','Galpón 4','Temperatura','28°C','Advertencia',`${ts} 10:45:00`],
      ['S004','Galpón 4','Humedad','48%','Advertencia',`${ts} 10:45:00`],
      ['S005','Galpón 2','Amoníaco','22 ppm','Advertencia',`${ts} 10:44:00`],
      ['S006','Galpón 2','Temperatura','26°C','Advertencia',`${ts} 10:44:00`],
      ['S007','Galpón 1','Temperatura','22°C','Óptimo',`${ts} 10:43:00`],
      ['S008','Galpón 1','Humedad','65%','Óptimo',`${ts} 10:43:00`],
    ];
    exportToCSV('avisens_sensores_' + ts + '.csv', headers, rows);
  };


  // ═══════════════════════════════════════════════════
  //  ALERTAS: FILTRO POR SEVERIDAD (desde summary cards)
  // ═══════════════════════════════════════════════════
  window.filtrarPorSeveridad = function(sev) {
    document.getElementById('filter-severidad').value = sev;
    aplicarFiltrosAlertas();
  };

  // ═══════════════════════════════════════════════════
  //  ALERTAS: APLICAR FILTROS
  // ═══════════════════════════════════════════════════
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
    const info = document.getElementById('alertas-pagination-info');
    if (info) info.textContent = `Mostrando ${visible} de ${cards.length} alertas`;
  };

  // ═══════════════════════════════════════════════════
  //  ALERTAS: LIMPIAR FILTROS
  // ═══════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════
  //  ALERTAS: RESOLVER ALERTA
  // ═══════════════════════════════════════════════════
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
      const prevStatus = alertCard.getAttribute('data-status');

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
          <span class="text-xs text-muted">por Juan Martínez — Ahora</span>
        `;
      }

      // Agregar meta de resolución
      const metaEl = alertCard.querySelector('.alert-meta');
      if (metaEl) {
        metaEl.innerHTML += `<span class="alert-meta-item"><i class="fa-solid fa-user-check"></i> Resuelta por: Juan Martínez</span>`;
      }

      // Actualizar el contador correcto según la severidad de la alerta resuelta
      if (prevStatus === 'critical') {
        const el = document.getElementById('count-criticas');
        const n = parseInt(el.textContent);
        if (n > 0) el.textContent = n - 1;
      } else if (prevStatus === 'warning') {
        const el = document.getElementById('count-warnings');
        const n = parseInt(el.textContent);
        if (n > 0) el.textContent = n - 1;
      }
    }

    closeModal('modal-resolver');
    showToast('success', 'Alerta resuelta', `La alerta ${id} ha sido marcada como resuelta exitosamente.`);
  };

  // ═══════════════════════════════════════════════════
  //  ALERTAS: DETALLE DE ALERTA
  // ═══════════════════════════════════════════════════
  const alertasData = {
    'A-001': {
      titulo: 'Estado Crítico Compuesto — Galpón 4',
      galpon: 'Galpón 4',
      tipo: 'Ambiental - Múltiples parámetros',
      severidad: 'Advertencia',
      estado: 'Activa',
      creada: '2026-04-16 10:40:00',
      duracion: '20 min',
      valorActual: 'Temp 28°C / Hum 48% / CO₂ 3,200 ppm / NH₃ 28 ppm',
      umbralCritico: 'Múltiples parámetros en advertencia simultánea',
      umbralOptimo: 'Temp 22-26°C / Hum 50-70% / CO₂ <3,000 / NH₃ <20 ppm',
      contexto: { temp: '28°C', humedad: '48%', co2: '3,200 ppm', nh3: '28 ppm' },
      historial: '1 vez en últimos 30 días (primera ocurrencia de estado compuesto)'
    },
    'A-002': {
      titulo: 'CO₂ Elevado — Galpón 4',
      galpon: 'Galpón 4',
      tipo: 'Ambiental - CO₂',
      severidad: 'Advertencia',
      estado: 'Activa',
      creada: '2026-04-16 10:27:00',
      duracion: '30 min',
      valorActual: '3,200 ppm',
      umbralCritico: '>5,000 ppm',
      umbralOptimo: '<3,000 ppm',
      contexto: { temp: '28°C', humedad: '48%', nh3: '28 ppm' },
      historial: '3 veces en últimos 30 días, promedio 25 min'
    },
    'A-003': {
      titulo: 'Amoníaco en advertencia — Galpón 2',
      galpon: 'Galpón 2',
      tipo: 'Ambiental - Amoníaco',
      severidad: 'Advertencia',
      estado: 'Activa',
      creada: '2026-04-16 10:10:00',
      duracion: '35 min',
      valorActual: '22 ppm',
      umbralCritico: '>35 ppm',
      umbralOptimo: '<20 ppm',
      contexto: { temp: '26°C', humedad: '58%', co2: '2,800 ppm' },
      historial: '4 veces en últimos 30 días, promedio 28 min'
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

  // ═══════════════════════════════════════════════════
  //  ALERTAS: GUARDAR REGLA
  // ═══════════════════════════════════════════════════
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
    const rulesList = document.getElementById('alertas-rules-list');
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
          <span>Juan Martínez</span>
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


  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: MODO AUTO / MANUAL
  // ═══════════════════════════════════════════════════
  const masterToggle = document.getElementById('master-toggle-input');
  const masterCard = document.getElementById('master-card');
  const controlCards = document.querySelectorAll('.control-card');
  const modeManual = document.getElementById('mode-manual');
  const modeAuto = document.getElementById('mode-auto');
  const masterDesc = document.getElementById('master-desc');

  function actualizarModo(esAutomatico) {
    controlCards.forEach(card => {
      if (esAutomatico) {
        card.classList.add('control-disabled');
      } else {
        card.classList.remove('control-disabled');
      }
    });

    modeManual.classList.toggle('active-mode-warning', !esAutomatico);
    modeManual.classList.toggle('active-mode', false);
    modeAuto.classList.toggle('active-mode', esAutomatico);

    if (esAutomatico) {
      masterCard.className = 'master-control-card mode-auto';
      masterDesc.textContent = 'El sistema controla los equipos automáticamente según reglas configuradas.';
    } else {
      masterCard.className = 'master-control-card mode-manual';
      masterDesc.textContent = '⚠️ Control manual activado. Deberás controlar los equipos directamente. Las reglas automáticas están desactivadas.';
    }
  }

  actualizarModo(masterToggle.checked);

  masterToggle.addEventListener('change', (e) => {
    const esAuto = e.target.checked;
    const modoTexto = esAuto ? 'AUTOMÁTICO' : 'MANUAL';

    showConfirm(
      'Cambiar Modo',
      esAuto
        ? 'Las reglas de automatización se activarán inmediatamente y los controles manuales se deshabilitarán.'
        : 'Deberás controlar manualmente todos los equipos. Las automatizaciones se desactivarán.',
      () => {
        actualizarModo(esAuto);
        agregarLog(esAuto ? 'Modo Auto' : 'Modo Manual', 'Cambio de modo', 'manual');
        showToast('success', 'Modo actualizado', `Sistema cambiado a modo ${modoTexto}.`);
      },
      () => {
        e.target.checked = !esAuto;
      }
    );
  });

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: SLIDERS
  // ═══════════════════════════════════════════════════
  document.querySelectorAll('.equip-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      const display = e.target.closest('.control-body').querySelector('.slider-value');
      const unit = e.target.dataset.unit || '%';
      display.textContent = `${val}${unit}`;
    });
  });

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: EQUIP TOGGLES
  // ═══════════════════════════════════════════════════
  document.querySelectorAll('.equip-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const on = e.target.checked;
      const device = e.target.dataset.device;
      const body = e.target.closest('.control-card').querySelector('.control-body');
      const slider = body.querySelector('.equip-slider');

      if (!on) {
        showConfirm('Apagar Equipo', `¿Seguro que deseas APAGAR: ${device}?`, () => {
          body.style.opacity = '0.4';
          if (slider) slider.disabled = true;
          agregarLog(device, 'OFF', 'manual');
          showToast('info', device, `${device} apagado.`);
        }, () => {
          e.target.checked = true;
        });
      } else {
        body.style.opacity = '1';
        if (slider) slider.disabled = false;
        agregarLog(device, 'ON', 'manual');
        showToast('success', device, `${device} encendido.`);
      }
    });
  });

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: DISPENSAR ALIMENTO
  // ═══════════════════════════════════════════════════
  window.dispensarAhora = function() {
    showConfirm(
      'Dispensar Alimento',
      '¿Dispensar 50 kg de alimento ahora? Esta es una dosis fuera de horario.',
      () => {
        agregarLog('Comedero', 'Dispensó 50kg (manual)', 'manual');
        showToast('success', 'Alimento dispensado', '50 kg de alimento dispensados correctamente.');
      }
    );
  };

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: LOG DE ACTIVIDAD
  // ═══════════════════════════════════════════════════
  function agregarLog(device, action, mode) {
    const log = document.getElementById('activity-log');
    const now = new Date();
    const hora = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    
    const icons = {
      'Ventilador 1': 'fa-fan', 'Ventilador 2': 'fa-fan',
      'Calefactor': 'fa-fire', 'Comedero': 'fa-bowl-food',
      'Modo Auto': 'fa-robot', 'Modo Manual': 'fa-hand'
    };

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.animation = 'fadeIn 0.4s ease forwards';
    entry.innerHTML = `
      <span class="log-time">${hora}</span>
      <span class="log-device"><i class="fa-solid ${icons[device] || 'fa-gear'}"></i> ${device}</span>
      <span class="log-action">${action}</span>
      <span class="log-mode ${mode === 'auto' ? 'auto' : 'manual'}">${mode === 'auto' ? 'Auto' : 'Manual'}</span>
      <span class="log-user">${mode === 'auto' ? 'Sistema' : 'Juan Martínez'}</span>
    `;
    log.insertBefore(entry, log.firstChild);
  }

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: CAMBIAR GALPÓN
  // ═══════════════════════════════════════════════════
  window.cambiarGalponAuto = function() {
    const galpon = document.getElementById('auto-galpon').value;
    const data = {
      '1': { temp: '22°C', hum: '65%', status: 'Óptimo', statusClass: 'optimal' },
      '2': { temp: '26°C', hum: '58%', status: 'Advertencia', statusClass: 'warning' },
      '3': { temp: '20°C', hum: '72%', status: 'Óptimo', statusClass: 'optimal' },
      '4': { temp: '28°C', hum: '48%', status: 'Crítico', statusClass: 'critical' }
    };
    const d = data[galpon];
    document.getElementById('gm-temp').textContent = d.temp;
    document.getElementById('gm-hum').textContent = d.hum;

    const statusBadge = document.getElementById('auto-galpon-status');
    statusBadge.textContent = d.status;
    statusBadge.className = `badge ${d.statusClass}-badge`;

    showToast('info', 'Galpón cambiado', `Mostrando controles para Galpón ${galpon}.`);
  };

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: GUARDAR REGLA
  // ═══════════════════════════════════════════════════
  window.guardarReglaAuto = function() {
    const nombre = document.getElementById('auto-regla-nombre').value.trim();
    if (!nombre) {
      showToast('error', 'Campo requerido', 'Escribe un nombre para la regla.');
      return;
    }
    const valor = document.getElementById('auto-regla-valor').value;
    if (!valor) {
      showToast('error', 'Campo requerido', 'Especifica un valor para la condición.');
      return;
    }

    const param = document.getElementById('auto-regla-param').selectedOptions[0].text;
    const op = document.getElementById('auto-regla-op').value;
    const dispositivo = document.getElementById('auto-regla-dispositivo').selectedOptions[0].text;
    const accion = document.getElementById('auto-regla-accion').selectedOptions[0].text;

    const list = document.getElementById('auto-rules-list');
    const card = document.createElement('div');
    card.className = 'rule-card';
    card.style.animation = 'fadeIn 0.5s ease forwards';
    card.innerHTML = `
      <div class="rule-info">
        <div class="rule-name">📋 ${nombre}</div>
        <div class="rule-condition">Si ${param} ${op} ${valor} → ${dispositivo} ${accion}</div>
        <div class="rule-meta"><span>Creada ahora</span><span>Activa</span><span>Juan Martínez</span></div>
      </div>
      <div class="rule-actions">
        <button class="icon-btn edit" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn delete" title="Desactivar"><i class="fa-solid fa-toggle-off"></i></button>
      </div>
    `;
    list.insertBefore(card, list.firstChild);

    closeModal('modal-nueva-regla-auto');
    showToast('success', 'Regla creada', `Regla "${nombre}" activada correctamente.`);
  };

  // ═══════════════════════════════════════════════════
  //  AUTOMATIZACIÓN: EXPORTAR LOG
  // ═══════════════════════════════════════════════════
  window.exportarLogCSV = function() {
    const headers = ['Hora', 'Dispositivo', 'Acción', 'Modo', 'Usuario'];
    const rows = [];
    document.querySelectorAll('.log-entry').forEach(entry => {
      rows.push([
        entry.querySelector('.log-time').textContent,
        entry.querySelector('.log-device').textContent.trim(),
        entry.querySelector('.log-action').textContent,
        entry.querySelector('.log-mode').textContent,
        entry.querySelector('.log-user').textContent
      ]);
    });
    exportToCSV('avisens_log_' + new Date().toISOString().slice(0,10) + '.csv', headers, rows);
  };

});
