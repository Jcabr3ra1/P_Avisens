/* =======================================================
   AVISENS – Operadores & Tareas (JS Completo)
   3 Tabs: Tareas | Operadores | Consumos
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

  // ===== DATOS DE OPERADORES =====
  const operadores = {
    carlos: { nombre: 'Carlos Pérez', nombreCorto: 'Carlos P.', color: 'linear-gradient(135deg,#3b82f6,#2563eb)', letra: 'C', galpones: [1, 2], turno: 'dia' },
    andrea: { nombre: 'Andrea Gómez', nombreCorto: 'Andrea G.', color: 'linear-gradient(135deg,#a855f7,#7c3aed)', letra: 'A', galpones: [3, 4], turno: 'dia' },
    jorge:  { nombre: 'Jorge Ramírez', nombreCorto: 'Jorge R.', color: 'linear-gradient(135deg,#f97316,#ea580c)', letra: 'J', galpones: [1, 2, 3, 4], turno: 'noche' }
  };

  // Variable para saber qué operador estamos editando en galpones
  let gestionandoOperador = null;

  // Fecha por defecto: mañana
  const fechaInput = document.getElementById('tarea-fecha');
  if (fechaInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fechaInput.value = tomorrow.toISOString().slice(0, 10);
    fechaInput.min = new Date().toISOString().slice(0, 10);
  }

  // ===== TABS =====
  window.cambiarTab = function(tabId, btn) {
    // Desactivar todos los tabs y contenidos
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    // Activar el seleccionado
    btn.classList.add('active');
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
  };

  // =================================================================
  //  TAB 1: TAREAS
  // =================================================================

  // ===== GUARDAR NUEVA TAREA =====
  window.guardarTarea = function(e) {
    e.preventDefault();

    const titulo = document.getElementById('tarea-titulo').value.trim();
    const descripcion = document.getElementById('tarea-descripcion').value.trim();
    const operadorKey = document.getElementById('tarea-operador').value;
    const galpon = document.getElementById('tarea-galpon').value;
    const prioridad = document.getElementById('tarea-prioridad').value;
    const fecha = document.getElementById('tarea-fecha').value;

    if (!titulo || !descripcion || !operadorKey) {
      showToast('error', 'Campos requeridos', 'Completa todos los campos obligatorios.');
      return;
    }
    if (descripcion.length < 10) {
      showToast('error', 'Descripción muy corta', 'La descripción debe tener al menos 10 caracteres.');
      return;
    }

    const op = operadores[operadorKey];
    const prioBadge = prioridad === 'alta' ? 'critical-badge' : prioridad === 'media' ? 'warning-badge' : 'optimal-badge';
    const prioIcon = prioridad === 'alta' ? 'fa-arrow-up' : prioridad === 'media' ? 'fa-minus' : 'fa-arrow-down';
    const prioLabel = prioridad.charAt(0).toUpperCase() + prioridad.slice(1);

    const tbody = document.getElementById('tbody-tareas');
    const fila = document.createElement('tr');
    fila.setAttribute('data-estado', 'pendiente');
    fila.setAttribute('data-operador', operadorKey);
    fila.setAttribute('data-prioridad', prioridad);
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td>
        <strong>${titulo}</strong><br>
        <span class="text-xs text-muted">${descripcion}</span>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <div class="mini-avatar" style="background:${op.color};">${op.letra}</div>
          ${op.nombre}
        </div>
      </td>
      <td>${galpon}</td>
      <td><span class="badge ${prioBadge}"><i class="fa-solid ${prioIcon}"></i> ${prioLabel}</span></td>
      <td class="text-xs">${fecha}</td>
      <td><span class="badge warning-badge"><i class="fa-solid fa-hourglass-half"></i> Pendiente</span></td>
      <td class="action-buttons">
        <button class="icon-btn edit" title="Editar" onclick="editarTarea(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn delete" title="Eliminar" onclick="eliminarTarea(this)"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);

    // Actualizar contador
    const countPend = document.getElementById('count-pendientes');
    countPend.textContent = parseInt(countPend.textContent) + 1;

    closeModal('modal-nueva-tarea');
    document.getElementById('form-nueva-tarea').reset();
    // Restaurar fecha por defecto
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    if (fechaInput) fechaInput.value = tm.toISOString().slice(0, 10);

    showToast('success', 'Tarea asignada', `"${titulo}" asignada a ${op.nombre}.`);
  };

  // ===== COMPLETAR TAREA (por referencia al botón) =====
  window.completarTarea = function(btn) {
    const row = btn.closest('tr');
    if (!row) return;
    const titulo = row.querySelector('strong').textContent;

    showConfirm(
      'Completar Tarea',
      `¿Marcar como completada: "${titulo}"?`,
      () => {
        row.setAttribute('data-estado', 'completada');
        row.style.opacity = '0.6';
        row.querySelector('strong').style.textDecoration = 'line-through';

        const cells = row.querySelectorAll('td');
        cells[5].innerHTML = '<span class="badge optimal-badge"><i class="fa-solid fa-circle-check"></i> Completada</span>';
        const hora = new Date().toTimeString().slice(0, 5);
        cells[6].innerHTML = `<span class="text-xs text-muted">✅ ${hora}</span>`;

        const countProg = document.getElementById('count-progreso');
        const currentProg = parseInt(countProg.textContent);
        if (currentProg > 0) countProg.textContent = currentProg - 1;

        const countComp = document.getElementById('count-completadas');
        countComp.textContent = parseInt(countComp.textContent) + 1;

        showToast('success', 'Tarea completada', `"${titulo}" marcada como completada.`);
        aplicarFiltros();
      }
    );
  };

  // ===== ELIMINAR TAREA =====
  window.eliminarTarea = function(btn) {
    const row = btn.closest('tr');
    if (!row) return;
    const titulo = row.querySelector('strong').textContent;

    showConfirm(
      'Eliminar Tarea',
      `¿Eliminar la tarea "${titulo}"? Esta acción no se puede deshacer.`,
      () => {
        const estado = row.getAttribute('data-estado');
        row.style.animation = 'fadeIn 0.3s ease reverse forwards';
        setTimeout(() => {
          row.remove();
          if (estado === 'pendiente') {
            const countPend = document.getElementById('count-pendientes');
            const curr = parseInt(countPend.textContent);
            if (curr > 0) countPend.textContent = curr - 1;
          } else if (estado === 'en-progreso') {
            const countProg = document.getElementById('count-progreso');
            const curr = parseInt(countProg.textContent);
            if (curr > 0) countProg.textContent = curr - 1;
          }
          showToast('warning', 'Tarea eliminada', `"${titulo}" ha sido eliminada.`);
        }, 300);
      }
    );
  };

  // ===== EDITAR TAREA =====
  window.editarTarea = function(btn) {
    const row = btn.closest('tr');
    if (!row) return;

    const titulo = row.querySelector('strong').textContent;
    const desc = row.querySelector('.text-muted')?.textContent || '';
    const galpon = row.querySelectorAll('td')[2].textContent.trim();
    const estado = row.getAttribute('data-estado');
    const operador = row.getAttribute('data-operador');
    const prioridad = row.getAttribute('data-prioridad');

    const body = document.getElementById('editar-tarea-body');
    body.innerHTML = `
      <div class="form-group">
        <label>Título</label>
        <input type="text" id="edit-titulo" class="form-control" value="${titulo}">
      </div>
      <div class="form-group">
        <label>Descripción</label>
        <textarea id="edit-desc" class="form-control" rows="2">${desc}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Asignado a</label>
          <select id="edit-operador" class="form-control">
            <option value="carlos" ${operador === 'carlos' ? 'selected' : ''}>Carlos Pérez</option>
            <option value="andrea" ${operador === 'andrea' ? 'selected' : ''}>Andrea Gómez</option>
            <option value="jorge" ${operador === 'jorge' ? 'selected' : ''}>Jorge Ramírez</option>
          </select>
        </div>
        <div class="form-group">
          <label>Prioridad</label>
          <select id="edit-prioridad" class="form-control">
            <option value="alta" ${prioridad === 'alta' ? 'selected' : ''}>🔴 Alta</option>
            <option value="media" ${prioridad === 'media' ? 'selected' : ''}>🟡 Media</option>
            <option value="baja" ${prioridad === 'baja' ? 'selected' : ''}>🟢 Baja</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Estado</label>
          <select id="edit-estado" class="form-control">
            <option value="pendiente" ${estado === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
            <option value="en-progreso" ${estado === 'en-progreso' ? 'selected' : ''}>🔄 En Progreso</option>
            <option value="completada" ${estado === 'completada' ? 'selected' : ''}>✅ Completada</option>
          </select>
        </div>
        <div class="form-group">
          <label>Galpón</label>
          <select id="edit-galpon" class="form-control">
            <option value="Todos" ${galpon === 'Todos' ? 'selected' : ''}>Todos</option>
            <option value="Galpón 1" ${galpon === 'Galpón 1' ? 'selected' : ''}>Galpón 1</option>
            <option value="Galpón 2" ${galpon === 'Galpón 2' ? 'selected' : ''}>Galpón 2</option>
            <option value="Galpón 3" ${galpon === 'Galpón 3' ? 'selected' : ''}>Galpón 3</option>
            <option value="Galpón 4" ${galpon === 'Galpón 4' ? 'selected' : ''}>Galpón 4</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('modal-editar-tarea')">Cancelar</button>
        <button class="btn-primary" onclick="guardarEdicionTarea(this)"><i class="fa-solid fa-floppy-disk"></i> Guardar Cambios</button>
      </div>
    `;

    // Store reference to the row being edited
    body.dataset.editingRow = Array.from(document.querySelectorAll('#tbody-tareas tr')).indexOf(row);
    openModal('modal-editar-tarea');
  };

  window.guardarEdicionTarea = function(btn) {
    const body = document.getElementById('editar-tarea-body');
    const rowIndex = parseInt(body.dataset.editingRow);
    const rows = document.querySelectorAll('#tbody-tareas tr');
    if (!rows[rowIndex]) return;

    const row = rows[rowIndex];
    const nuevoTitulo = document.getElementById('edit-titulo').value.trim();
    const nuevaDesc = document.getElementById('edit-desc').value.trim();
    const nuevoOperadorKey = document.getElementById('edit-operador').value;
    const nuevaPrioridad = document.getElementById('edit-prioridad').value;
    const nuevoEstado = document.getElementById('edit-estado').value;
    const nuevoGalpon = document.getElementById('edit-galpon').value;

    if (!nuevoTitulo) {
      showToast('error', 'Título requerido', 'El título de la tarea no puede estar vacío.');
      return;
    }

    const op = operadores[nuevoOperadorKey];
    const prioBadge = nuevaPrioridad === 'alta' ? 'critical-badge' : nuevaPrioridad === 'media' ? 'warning-badge' : 'optimal-badge';
    const prioIcon = nuevaPrioridad === 'alta' ? 'fa-arrow-up' : nuevaPrioridad === 'media' ? 'fa-minus' : 'fa-arrow-down';
    const prioLabel = nuevaPrioridad.charAt(0).toUpperCase() + nuevaPrioridad.slice(1);

    let estadoBadge, estadoIcon, estadoLabel;
    if (nuevoEstado === 'completada') {
      estadoBadge = 'optimal-badge'; estadoIcon = 'fa-circle-check'; estadoLabel = 'Completada';
      row.style.opacity = '0.6';
      row.querySelector('strong').style.textDecoration = 'line-through';
    } else if (nuevoEstado === 'en-progreso') {
      estadoBadge = 'info-badge'; estadoIcon = 'fa-spinner'; estadoLabel = 'En Progreso';
      row.style.opacity = '1';
      row.querySelector('strong').style.textDecoration = 'none';
    } else {
      estadoBadge = 'warning-badge'; estadoIcon = 'fa-hourglass-half'; estadoLabel = 'Pendiente';
      row.style.opacity = '1';
      row.querySelector('strong').style.textDecoration = 'none';
    }

    row.setAttribute('data-estado', nuevoEstado);
    row.setAttribute('data-operador', nuevoOperadorKey);
    row.setAttribute('data-prioridad', nuevaPrioridad);

    const cells = row.querySelectorAll('td');
    cells[0].innerHTML = `<strong>${nuevoTitulo}</strong><br><span class="text-xs text-muted">${nuevaDesc}</span>`;
    cells[1].innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem;"><div class="mini-avatar" style="background:${op.color};">${op.letra}</div>${op.nombre}</div>`;
    cells[2].textContent = nuevoGalpon;
    cells[3].innerHTML = `<span class="badge ${prioBadge}"><i class="fa-solid ${prioIcon}"></i> ${prioLabel}</span>`;
    cells[5].innerHTML = `<span class="badge ${estadoBadge}"><i class="fa-solid ${estadoIcon}"></i> ${estadoLabel}</span>`;

    closeModal('modal-editar-tarea');
    showToast('success', 'Tarea actualizada', `"${nuevoTitulo}" ha sido modificada.`);
    aplicarFiltros();
  };

  // ===== FILTROS DE TAREAS =====
  window.aplicarFiltros = function() {
    const filtroOp = document.getElementById('filter-operador').value;
    const filtroEstado = document.getElementById('filter-estado-tarea').value;
    const filtroPrio = document.getElementById('filter-prioridad').value;
    const busqueda = document.getElementById('search-tareas').value.toLowerCase().trim();

    const rows = document.querySelectorAll('#tbody-tareas tr');
    let visible = 0;

    rows.forEach(row => {
      const matchOp = filtroOp === 'all' || row.getAttribute('data-operador') === filtroOp;
      const matchEstado = filtroEstado === 'all' || row.getAttribute('data-estado') === filtroEstado;
      const matchPrio = filtroPrio === 'all' || row.getAttribute('data-prioridad') === filtroPrio;
      const texto = row.textContent.toLowerCase();
      const matchBusqueda = !busqueda || texto.includes(busqueda);

      if (matchOp && matchEstado && matchPrio && matchBusqueda) {
        row.style.display = '';
        visible++;
      } else {
        row.style.display = 'none';
      }
    });

    // Actualizar info de paginación
    const paginInfo = document.querySelector('#tab-tareas .pagination-info');
    if (paginInfo) paginInfo.textContent = `Mostrando ${visible} de ${rows.length} tareas`;
  };

  window.filtrarTareasPorEstado = function(estado) {
    document.getElementById('filter-estado-tarea').value = estado;
    aplicarFiltros();
    // Switch to tareas tab
    cambiarTab('tab-tareas', document.querySelector('.tab-btn'));
    showToast('info', 'Filtro aplicado', `Mostrando tareas: ${estado === 'pendiente' ? 'Pendientes' : estado === 'en-progreso' ? 'En Progreso' : 'Completadas'}`);
  };

  window.limpiarFiltrosTareas = function() {
    document.getElementById('filter-operador').value = 'all';
    document.getElementById('filter-estado-tarea').value = 'all';
    document.getElementById('filter-prioridad').value = 'all';
    document.getElementById('search-tareas').value = '';
    aplicarFiltros();
    showToast('info', 'Filtros limpiados', 'Mostrando todas las tareas.');
  };

  // ===== EXPORTAR TAREAS CSV =====
  window.exportarTareasCSV = function() {
    const headers = ['Tarea', 'Asignado a', 'Galpón', 'Prioridad', 'Fecha Límite', 'Estado'];
    const rows = [];
    document.querySelectorAll('#tbody-tareas tr').forEach(tr => {
      if (tr.style.display === 'none') return;
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 6) {
        rows.push([
          cells[0].querySelector('strong')?.textContent || '',
          cells[1].textContent.trim(),
          cells[2].textContent.trim(),
          cells[3].textContent.trim(),
          cells[4].textContent.trim(),
          cells[5].textContent.trim()
        ]);
      }
    });
    exportToCSV('avisens_tareas_' + new Date().toISOString().slice(0, 10) + '.csv', headers, rows);
  };

  // =================================================================
  //  TAB 2: OPERADORES
  // =================================================================

  // ===== GESTIÓN DE GALPONES =====
  window.abrirGestionGalpones = function(opKey) {
    gestionandoOperador = opKey;
    const op = operadores[opKey];
    document.getElementById('galpon-modal-nombre').textContent = op.nombre;

    const container = document.getElementById('galpon-checkbox-container');
    container.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
      const checked = op.galpones.includes(i) ? 'checked' : '';
      container.innerHTML += `
        <div class="galpon-checkbox-item">
          <input type="checkbox" id="gc-${opKey}-${i}" value="${i}" ${checked}>
          <div>
            <label for="gc-${opKey}-${i}">Galpón ${i}</label>
            <div class="galpon-detail">15,000 aves · Día ${10 + i * 7}</div>
          </div>
        </div>
      `;
    }
    openModal('modal-gestion-galpones');
  };

  window.guardarAsignacionGalpones = function() {
    if (!gestionandoOperador) return;
    const op = operadores[gestionandoOperador];
    const nuevoGalpones = [];

    for (let i = 1; i <= 4; i++) {
      const cb = document.getElementById(`gc-${gestionandoOperador}-${i}`);
      if (cb && cb.checked) nuevoGalpones.push(i);
    }

    if (nuevoGalpones.length === 0) {
      showToast('warning', 'Sin galpones', 'Debes asignar al menos un galpón al operador.');
      return;
    }

    op.galpones = nuevoGalpones;

    // Actualizar chips en la tarjeta
    const chipsContainer = document.getElementById(`chips-${gestionandoOperador}`);
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      for (let i = 1; i <= 4; i++) {
        const assigned = nuevoGalpones.includes(i);
        chipsContainer.innerHTML += `
          <span class="galpon-chip ${assigned ? 'assigned' : 'unassigned'}">
            <i class="fa-solid ${assigned ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> Galpón ${i}
          </span>
        `;
      }
    }

    closeModal('modal-gestion-galpones');
    showToast('success', 'Galpones actualizados', `${op.nombre} ahora tiene asignados: Galpón ${nuevoGalpones.join(', ')}.`);
    gestionandoOperador = null;
  };

  // ===== VER PERFIL OPERADOR (Modal completo) =====
  window.verPerfilOperador = function(opKey) {
    const op = operadores[opKey];
    const galpones = op.galpones.map(g => `Galpón ${g}`).join(', ') || 'Ninguno';
    const turnoLabel = op.turno === 'dia' ? 'Día (6:00–14:00)' : op.turno === 'tarde' ? 'Tarde (14:00–22:00)' : 'Noche (22:00–6:00)';
    const isOnline = op.turno !== 'noche';

    // Obtener tareas del operador
    const tareasRows = document.querySelectorAll(`#tbody-tareas tr[data-operador="${opKey}"]`);
    let tareasCompletadas = 0, tareasPendientes = 0, tareasProgreso = 0;
    const tareasRecientes = [];
    tareasRows.forEach(r => {
      const est = r.getAttribute('data-estado');
      if (est === 'completada') tareasCompletadas++;
      else if (est === 'pendiente') tareasPendientes++;
      else if (est === 'en-progreso') tareasProgreso++;
      if (tareasRecientes.length < 5) {
        tareasRecientes.push({
          titulo: r.querySelector('strong')?.textContent || '—',
          estado: est,
          galpon: r.querySelectorAll('td')[2]?.textContent.trim() || '—'
        });
      }
    });

    // Obtener consumos del operador
    const consumoRows = document.querySelectorAll(`#tbody-consumos tr[data-consumo-operador="${opKey}"]`);
    const consumosRecientes = [];
    consumoRows.forEach(r => {
      if (consumosRecientes.length < 5) {
        const cells = r.querySelectorAll('td');
        consumosRecientes.push({
          fecha: cells[0]?.textContent.trim() || '—',
          galpon: cells[2]?.textContent.trim() || '—',
          producto: cells[3]?.textContent.trim() || '—',
          cantidad: cells[4]?.textContent.trim() || '—'
        });
      }
    });

    // Calendario sanitario por galpón
    const sanitarioData = {
      carlos: [
        { galpon: 'Galpón 1', evento: 'Vacuna Newcastle', fecha: '2026-04-08', estado: 'completado', proximo: '2026-04-22' },
        { galpon: 'Galpón 2', evento: 'Vacuna Gumboro', fecha: '2026-04-05', estado: 'completado', proximo: '2026-04-19' },
        { galpon: 'Galpón 1', evento: 'Desinfección General', fecha: '2026-04-12', estado: 'completado', proximo: '2026-04-19' },
      ],
      andrea: [
        { galpon: 'Galpón 3', evento: 'Vacuna Newcastle', fecha: '2026-04-12', estado: 'en-progreso', proximo: '2026-04-26' },
        { galpon: 'Galpón 4', evento: 'Desinfección Bebederos', fecha: '2026-04-12', estado: 'completado', proximo: '2026-04-15' },
        { galpon: 'Galpón 3', evento: 'Control de bioseguridad', fecha: '2026-04-10', estado: 'completado', proximo: '2026-04-17' },
      ],
      jorge: [
        { galpon: 'Galpón 1-4', evento: 'Ronda sanitaria nocturna', fecha: '2026-04-11', estado: 'completado', proximo: '2026-04-12' },
        { galpon: 'Galpón 2', evento: 'Cambio de camas (bioseguridad)', fecha: '2026-04-10', estado: 'completado', proximo: '2026-05-01' },
      ]
    };

    const sanData = sanitarioData[opKey] || [];

    const estadoBadge = (est) => {
      if (est === 'completada' || est === 'completado') return '<span class="badge optimal-badge" style="font-size:0.7rem;"><i class="fa-solid fa-check"></i> Hecho</span>';
      if (est === 'en-progreso') return '<span class="badge info-badge" style="font-size:0.7rem;"><i class="fa-solid fa-spinner"></i> En curso</span>';
      return '<span class="badge warning-badge" style="font-size:0.7rem;"><i class="fa-solid fa-hourglass-half"></i> Pendiente</span>';
    };

    const body = document.getElementById('perfil-operador-body');
    body.innerHTML = `
      <!-- Header del perfil -->
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div class="operator-avatar-lg" style="background:${op.color}; width:56px; height:56px; font-size:1.4rem;">
          ${op.letra}
          <span class="operator-status ${isOnline ? 'online' : 'offline'}"></span>
        </div>
        <div style="flex:1;">
          <h4 style="margin:0; color:var(--text-primary); font-size:1.1rem;">${op.nombre}</h4>
          <div style="font-size:0.8rem; color:var(--text-muted); display:flex; gap:1rem; margin-top:0.2rem;">
            <span><i class="fa-solid fa-clock"></i> ${turnoLabel}</span>
            <span><i class="fa-solid fa-warehouse"></i> ${galpones}</span>
          </div>
        </div>
      </div>

      <!-- Stats rápidos -->
      <div class="operator-stats-row" style="margin-bottom:1.25rem;">
        <div class="operator-stat-item">
          <span class="stat-num" style="color:var(--status-optimal);">${tareasCompletadas}</span>
          <span class="stat-lbl">Completadas</span>
        </div>
        <div class="operator-stat-item">
          <span class="stat-num" style="color:var(--status-info);">${tareasProgreso}</span>
          <span class="stat-lbl">En Progreso</span>
        </div>
        <div class="operator-stat-item">
          <span class="stat-num" style="color:var(--status-warning);">${tareasPendientes}</span>
          <span class="stat-lbl">Pendientes</span>
        </div>
      </div>

      <!-- Tareas recientes -->
      <div style="margin-bottom:1.25rem;">
        <h5 style="color:var(--text-secondary); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem;">
          <i class="fa-solid fa-list-check"></i> Tareas Recientes
        </h5>
        ${tareasRecientes.length > 0 ? `
          <div class="table-container">
            <table class="data-table">
              <tbody>
                ${tareasRecientes.map(t => `
                  <tr>
                    <td style="font-size:0.82rem;">${t.titulo}</td>
                    <td class="text-xs text-muted">${t.galpon}</td>
                    <td>${estadoBadge(t.estado)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-xs text-muted">Sin tareas registradas.</p>'}
      </div>

      <!-- Consumos recientes -->
      <div style="margin-bottom:1.25rem;">
        <h5 style="color:var(--text-secondary); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem;">
          <i class="fa-solid fa-wheat-awn"></i> Consumos Recientes
        </h5>
        ${consumosRecientes.length > 0 ? `
          <div class="table-container">
            <table class="data-table">
              <tbody>
                ${consumosRecientes.map(c => `
                  <tr>
                    <td class="text-xs">${c.fecha}</td>
                    <td class="text-xs">${c.galpon}</td>
                    <td style="font-size:0.82rem;">${c.producto}</td>
                    <td style="font-weight:600; font-size:0.82rem;">${c.cantidad}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-xs text-muted">Sin consumos registrados.</p>'}
      </div>

      <!-- Control Sanitario -->
      <div>
        <h5 style="color:var(--text-secondary); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem;">
          <i class="fa-solid fa-shield-virus"></i> Control Sanitario / Vacunación
        </h5>
        ${sanData.length > 0 ? `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Galpón</th>
                  <th>Evento</th>
                  <th>Último</th>
                  <th>Estado</th>
                  <th>Próximo</th>
                </tr>
              </thead>
              <tbody>
                ${sanData.map(s => `
                  <tr>
                    <td class="text-xs">${s.galpon}</td>
                    <td style="font-size:0.82rem;">${s.evento}</td>
                    <td class="text-xs">${s.fecha}</td>
                    <td>${estadoBadge(s.estado)}</td>
                    <td class="text-xs" style="color:var(--status-info);">${s.proximo}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="text-xs text-muted">Sin registros sanitarios.</p>'}
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('modal-perfil-operador')">Cerrar</button>
        <button class="btn-primary" onclick="closeModal('modal-perfil-operador'); abrirGestionGalpones('${opKey}');">
          <i class="fa-solid fa-warehouse"></i> Gestionar Galpones
        </button>
      </div>
    `;
    openModal('modal-perfil-operador');
  };

  // ===== NUEVO OPERADOR =====
  window.guardarNuevoOperador = function(e) {
    e.preventDefault();

    const nombre = document.getElementById('op-nombre').value.trim();
    const turno = document.getElementById('op-turno').value;
    const color = document.getElementById('op-color').value;

    if (!nombre) {
      showToast('error', 'Nombre requerido', 'Ingresa el nombre del operador.');
      return;
    }

    const galpones = [];
    for (let i = 1; i <= 4; i++) {
      const cb = document.getElementById(`new-op-g${i}`);
      if (cb && cb.checked) galpones.push(i);
    }

    const key = nombre.toLowerCase().replace(/\s+/g, '_').substring(0, 10) + '_' + Date.now();
    const letra = nombre.charAt(0).toUpperCase();
    const turnoLabel = turno === 'dia' ? 'Turno Día (6:00–14:00)' : turno === 'tarde' ? 'Turno Tarde (14:00–22:00)' : 'Turno Noche (22:00–6:00)';
    const gradient = `linear-gradient(135deg, ${color}, ${color}dd)`;

    operadores[key] = { nombre, nombreCorto: nombre.split(' ')[0] + ' ' + (nombre.split(' ')[1] || '').charAt(0) + '.', color: gradient, letra, galpones, turno };

    // Agregar tarjeta al grid
    const grid = document.getElementById('operadores-grid');
    const card = document.createElement('div');
    card.className = 'operator-card-expanded';
    card.setAttribute('data-operator', key);
    card.style.animation = 'fadeIn 0.5s ease forwards';

    let chipsHtml = '';
    for (let i = 1; i <= 4; i++) {
      const assigned = galpones.includes(i);
      chipsHtml += `<span class="galpon-chip ${assigned ? 'assigned' : 'unassigned'}"><i class="fa-solid ${assigned ? 'fa-check-circle' : 'fa-circle-xmark'}"></i> Galpón ${i}</span>`;
    }

    card.innerHTML = `
      <div class="operator-card-top">
        <div class="operator-avatar-lg" style="background: ${gradient};">
          ${letra}
          <span class="operator-status online"></span>
        </div>
        <div class="operator-detail">
          <h4>${nombre} <span class="perf-badge good"><i class="fa-solid fa-thumbs-up"></i> Nuevo</span></h4>
          <div class="operator-meta">
            <span><i class="fa-solid fa-clock"></i> ${turnoLabel}</span>
            <span><i class="fa-solid fa-circle" style="color:var(--status-optimal); font-size:0.5rem;"></i> En línea</span>
          </div>
        </div>
        <div class="operator-actions-top">
          <button class="icon-btn edit" title="Gestionar galpones" onclick="abrirGestionGalpones('${key}')"><i class="fa-solid fa-warehouse"></i></button>
          <button class="icon-btn view" title="Ver perfil" onclick="verPerfilOperador('${key}')"><i class="fa-solid fa-eye"></i></button>
        </div>
      </div>
      <div class="galpon-assignment">
        <div class="galpon-assignment-label">Galpones Asignados</div>
        <div class="galpon-chips" id="chips-${key}">${chipsHtml}</div>
      </div>
      <div class="operator-stats-row">
        <div class="operator-stat-item">
          <span class="stat-num" style="color:var(--status-optimal);">0</span>
          <span class="stat-lbl">Completadas</span>
        </div>
        <div class="operator-stat-item">
          <span class="stat-num" style="color:var(--status-warning);">0</span>
          <span class="stat-lbl">Pendientes</span>
        </div>
        <div class="operator-stat-item">
          <span class="stat-num">0 h</span>
          <span class="stat-lbl">Horas Mes</span>
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Agregar a dropdowns de tareas y consumos
    const tareasDropdown = document.getElementById('tarea-operador');
    const consumoDropdown = document.getElementById('consumo-operador');
    const filterDropdown = document.getElementById('filter-operador');
    const filterConsumoDropdown = document.getElementById('filter-consumo-operador');

    const newOption = (val, text) => { const o = document.createElement('option'); o.value = val; o.textContent = text; return o; };
    if (tareasDropdown) tareasDropdown.appendChild(newOption(key, `${nombre} (${galpones.map(g => `Galpón ${g}`).join(', ') || 'Sin galpón'})`));
    if (consumoDropdown) consumoDropdown.appendChild(newOption(key, nombre));
    if (filterDropdown) filterDropdown.appendChild(newOption(key, nombre));
    if (filterConsumoDropdown) filterConsumoDropdown.appendChild(newOption(key, nombre));

    closeModal('modal-nuevo-operador');
    document.getElementById('form-nuevo-operador').reset();
    showToast('success', 'Operador agregado', `${nombre} ha sido registrado exitosamente.`);
  };

  // =================================================================
  //  TAB 3: CONSUMOS
  // =================================================================

  // ===== REGISTRAR CONSUMO =====
  window.guardarConsumo = function(e) {
    e.preventDefault();

    const operadorKey = document.getElementById('consumo-operador').value;
    const galpon = document.getElementById('consumo-galpon').value;
    const productoSelect = document.getElementById('consumo-producto');
    const producto = productoSelect.value;
    const tipo = productoSelect.selectedOptions[0]?.dataset.tipo || 'otro';
    const cantidad = document.getElementById('consumo-cantidad').value;
    const unidad = document.getElementById('consumo-unidad').value;
    const notas = document.getElementById('consumo-notas').value.trim();

    if (!operadorKey || !galpon || !producto || !cantidad) {
      showToast('error', 'Campos requeridos', 'Complete todos los campos obligatorios.');
      return;
    }

    const op = operadores[operadorKey];
    if (!op) {
      showToast('error', 'Error', 'Operador no encontrado.');
      return;
    }

    // Determinar badge por tipo
    let badgeClass, badgeIcon;
    switch (tipo) {
      case 'alimento': badgeClass = 'warning-badge'; badgeIcon = 'fa-wheat-awn'; break;
      case 'medicina': badgeClass = 'info-badge'; badgeIcon = 'fa-syringe'; break;
      case 'desinfectante': badgeClass = 'optimal-badge'; badgeIcon = 'fa-spray-can-sparkles'; break;
      case 'viruta': badgeClass = 'neutral-badge'; badgeIcon = 'fa-cubes-stacked'; break;
      default: badgeClass = 'neutral-badge'; badgeIcon = 'fa-box'; break;
    }

    const now = new Date();
    const timestamp = formatTimestamp(now);

    const tbody = document.getElementById('tbody-consumos');
    const fila = document.createElement('tr');
    fila.setAttribute('data-consumo-operador', operadorKey);
    fila.setAttribute('data-consumo-galpon', galpon);
    fila.setAttribute('data-consumo-tipo', tipo);
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td class="text-xs">${timestamp}</td>
      <td>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <div class="mini-avatar" style="background:${op.color};">${op.letra}</div>
          ${op.nombreCorto || op.nombre}
        </div>
      </td>
      <td>${galpon}</td>
      <td><span class="badge ${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${producto}</span></td>
      <td><strong>${cantidad} ${unidad}</strong></td>
      <td class="text-xs text-muted">${notas || '—'}</td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);

    // Actualizar contador de registros
    const totalReg = document.getElementById('total-registros-hoy');
    totalReg.textContent = parseInt(totalReg.textContent) + 1;

    closeModal('modal-nuevo-consumo');
    document.getElementById('form-nuevo-consumo').reset();
    showToast('success', 'Consumo registrado', `${cantidad} ${unidad} de ${producto} — ${op.nombre} en ${galpon}.`);
  };

  // ===== FILTROS DE CONSUMOS =====
  window.aplicarFiltrosConsumo = function() {
    const filtroOp = document.getElementById('filter-consumo-operador').value;
    const filtroGalpon = document.getElementById('filter-consumo-galpon').value;
    const filtroProducto = document.getElementById('filter-consumo-producto').value;

    const rows = document.querySelectorAll('#tbody-consumos tr');
    rows.forEach(row => {
      const matchOp = filtroOp === 'all' || row.getAttribute('data-consumo-operador') === filtroOp;
      const matchGalpon = filtroGalpon === 'all' || row.getAttribute('data-consumo-galpon') === filtroGalpon;
      const matchProducto = filtroProducto === 'all' || row.getAttribute('data-consumo-tipo') === filtroProducto;

      row.style.display = (matchOp && matchGalpon && matchProducto) ? '' : 'none';
    });
  };

  window.limpiarFiltrosConsumo = function() {
    document.getElementById('filter-consumo-operador').value = 'all';
    document.getElementById('filter-consumo-galpon').value = 'all';
    document.getElementById('filter-consumo-producto').value = 'all';
    aplicarFiltrosConsumo();
    showToast('info', 'Filtros limpiados', 'Mostrando todos los registros de consumo.');
  };

  // ===== EXPORTAR CONSUMOS CSV =====
  window.exportarConsumosCSV = function() {
    const headers = ['Fecha', 'Operador', 'Galpón', 'Producto', 'Cantidad', 'Notas'];
    const rows = [];
    document.querySelectorAll('#tbody-consumos tr').forEach(tr => {
      if (tr.style.display === 'none') return;
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 6) {
        rows.push([
          cells[0].textContent.trim(),
          cells[1].textContent.trim(),
          cells[2].textContent.trim(),
          cells[3].textContent.trim(),
          cells[4].textContent.trim(),
          cells[5].textContent.trim()
        ]);
      }
    });
    exportToCSV('avisens_consumos_' + new Date().toISOString().slice(0, 10) + '.csv', headers, rows);
  };

});
