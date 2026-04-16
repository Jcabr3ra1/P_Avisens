/* =======================================================
   AVISENS – Inventario (JS Completo)
   3 Tabs: Stock | Requisiciones | Historial Movimientos
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

  // ===== DATOS =====
  const operadores = {
    carlos: { nombre: 'Carlos Pérez', corto: 'Carlos P.', color: 'linear-gradient(135deg,#3b82f6,#2563eb)', letra: 'C' },
    andrea: { nombre: 'Andrea Gómez', corto: 'Andrea G.', color: 'linear-gradient(135deg,#a855f7,#7c3aed)', letra: 'A' },
    jorge:  { nombre: 'Jorge Ramírez', corto: 'Jorge R.', color: 'linear-gradient(135deg,#f97316,#ea580c)', letra: 'J' },
    supervisor: { nombre: 'Juan Martínez', corto: 'Juan M. (Admin)', color: 'linear-gradient(135deg,#10b981,#059669)', letra: 'M' }
  };

  const historialData = {
    'Alimento Iniciación (40kg)': [
      { fecha: '2026-04-12 07:15', tipo: 'Salida', cantidad: '-3 bultos', operador: 'carlos', galpon: 'Galpón 1', motivo: 'Alimentación diaria' },
      { fecha: '2026-04-11 07:00', tipo: 'Salida', cantidad: '-3 bultos', operador: 'carlos', galpon: 'Galpón 1', motivo: 'Alimentación diaria' },
      { fecha: '2026-04-10 14:00', tipo: 'Ingreso', cantidad: '+50 bultos', operador: 'supervisor', galpon: '—', motivo: 'Compra mensual Purina' },
      { fecha: '2026-04-05 07:30', tipo: 'Salida', cantidad: '-4 bultos', operador: 'carlos', galpon: 'Galpón 1', motivo: 'Alimentación diaria' },
    ],
    'Vacuna Gumboro': [
      { fecha: '2026-04-08 09:00', tipo: 'Salida', cantidad: '-3 frascos', operador: 'andrea', galpon: 'Galpón 3', motivo: 'Vacunación programada' },
      { fecha: '2026-04-01 10:00', tipo: 'Ingreso', cantidad: '+5 frascos', operador: 'supervisor', galpon: '—', motivo: 'Compra veterinaria' },
    ],
    'Alimento Engorde (40kg)': [
      { fecha: '2026-04-12 08:00', tipo: 'Salida', cantidad: '-4 bultos', operador: 'andrea', galpon: 'Galpón 3', motivo: 'Alimentación diaria' },
      { fecha: '2026-04-11 08:00', tipo: 'Salida', cantidad: '-4 bultos', operador: 'andrea', galpon: 'Galpón 3', motivo: 'Alimentación diaria' },
    ]
  };

  // ===== TABS =====
  window.cambiarTabInv = function(tabId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
  };

  // =================================================================
  //  TAB 1: STOCK — FILTROS
  // =================================================================

  window.aplicarFiltrosInventario = function() {
    const cat = document.getElementById('filter-inv-cat').value;
    const estado = document.getElementById('filter-inv-estado').value;
    const busqueda = (document.getElementById('search-inv').value || '').toLowerCase().trim();

    const rows = document.querySelectorAll('#tabla-inventario-body tr');
    let visible = 0;

    rows.forEach(row => {
      const matchCat = cat === 'all' || row.getAttribute('data-cat') === cat;
      const matchEstado = estado === 'all' || row.getAttribute('data-estado') === estado;
      const texto = row.textContent.toLowerCase();
      const matchBusqueda = !busqueda || texto.includes(busqueda);

      if (matchCat && matchEstado && matchBusqueda) {
        row.style.display = '';
        visible++;
      } else {
        row.style.display = 'none';
      }
    });

    const info = document.getElementById('inv-pagination-info');
    if (info) info.textContent = `Mostrando ${visible} de ${rows.length} productos`;
  };

  window.limpiarFiltrosInventario = function() {
    document.getElementById('filter-inv-cat').value = 'all';
    document.getElementById('filter-inv-estado').value = 'all';
    document.getElementById('search-inv').value = '';
    aplicarFiltrosInventario();
    showToast('info', 'Filtros limpiados', 'Mostrando todos los productos.');
  };

  // =================================================================
  //  TAB 1: STOCK — NUEVO PRODUCTO
  // =================================================================

  window.submitNuevoProducto = function(e) {
    e.preventDefault();

    const nombre = document.getElementById('np-nombre').value.trim();
    const categoria = document.getElementById('np-categoria').value;
    const cantidad = document.getElementById('np-cantidad').value;
    const unidad = document.getElementById('np-unidad').value;
    const minimo = document.getElementById('np-minimo').value;
    const ubicacion = document.getElementById('np-ubicacion').value;
    const lote = document.getElementById('np-lote').value.trim();

    const catKey = categoria === 'Alimento' ? 'alimento' : categoria === 'Medicamento' ? 'medicamento' : 'suministros';
    const icons = { 'Alimento': 'fa-wheat-awn', 'Medicamento': 'fa-syringe', 'Suministros': 'fa-cubes-stacked' };

    const tbody = document.getElementById('tabla-inventario-body');
    const fila = document.createElement('tr');
    fila.setAttribute('data-cat', catKey);
    fila.setAttribute('data-estado', 'suficiente');
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td><strong>${nombre}</strong><br><span class="text-xs text-muted">${lote || '—'}</span></td>
      <td><i class="fa-solid ${icons[categoria] || 'fa-box'}" style="color:var(--status-optimal);"></i> ${categoria}</td>
      <td class="stock-ok"><strong>${cantidad} ${unidad}</strong></td>
      <td class="text-muted">${minimo} ${unidad}</td>
      <td class="text-muted">${ubicacion}</td>
      <td><span class="badge info-badge"><i class="fa-solid fa-star"></i> Nuevo</span></td>
      <td class="text-xs text-muted">Ahora</td>
      <td class="action-buttons">
        <button class="icon-btn resolve" title="Agregar Stock" onclick="abrirModalIngreso('${nombre}', '${categoria}', '${unidad}')"><i class="fa-solid fa-plus-circle"></i></button>
        <button class="icon-btn delete" title="Retirar / Asignar" onclick="abrirModalConsumo('${nombre}', '${cantidad} ${unidad}', '${categoria}')"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
        <button class="icon-btn view" title="Historial" onclick="verHistorial('${nombre}')"><i class="fa-solid fa-clock-rotate-left"></i></button>
      </td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);

    // Registrar movimiento
    agregarMovimiento('ingreso', nombre, `+${cantidad} ${unidad}`, 'supervisor', '—', 'Registro inicial de producto');

    closeModal('modal-nuevo-producto');
    document.getElementById('form-nuevo-producto').reset();
    aplicarFiltrosInventario();
    showToast('success', 'Producto registrado', `${nombre} agregado al inventario con ${cantidad} ${unidad}.`);
  };

  // =================================================================
  //  TAB 1: STOCK — AGREGAR STOCK (INGRESO)
  // =================================================================

  window.abrirModalIngreso = function(nombre, categoria, unidad) {
    document.getElementById('form-ingreso').reset();
    document.getElementById('ing-nombre').value = nombre;
    document.getElementById('ing-categoria').value = categoria;
    document.getElementById('ing-unidad').value = unidad || 'unidades';
    openModal('modal-ingreso');
  };

  window.submitIngreso = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('ing-nombre').value;
    const cantidad = document.getElementById('ing-cantidad').value;
    const unidad = document.getElementById('ing-unidad').value;
    const notas = document.getElementById('ing-notas').value.trim();

    // Registrar en historial
    agregarMovimiento('ingreso', nombre, `+${cantidad} ${unidad}`, 'supervisor', '—', notas || 'Ingreso de stock');

    closeModal('modal-ingreso');
    showToast('success', 'Ingreso registrado', `+${cantidad} ${unidad} de ${nombre} agregados al inventario.`);
  };

  // =================================================================
  //  TAB 1: STOCK — RETIRAR Y ASIGNAR A OPERADOR
  // =================================================================

  window.abrirModalConsumo = function(nombre, stockActual, categoria) {
    document.getElementById('form-consumir').reset();
    document.getElementById('cons-producto-nombre').value = nombre;
    document.getElementById('cons-producto-stock').value = stockActual;

    // Extraer unidad del stock text
    const parts = stockActual.split(' ');
    const unidad = parts.length > 1 ? parts.slice(1).join(' ') : 'unidades';
    document.getElementById('cons-unidad').value = unidad;

    openModal('modal-consumir');
  };

  window.submitConsumo = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('cons-producto-nombre').value;
    const stockText = document.getElementById('cons-producto-stock').value;
    const cantidad = parseInt(document.getElementById('cons-cantidad').value);
    const unidad = document.getElementById('cons-unidad').value;
    const operadorKey = document.getElementById('cons-operador').value;
    const galpon = document.getElementById('cons-galpon').value;
    const motivo = document.getElementById('cons-motivo').value;
    const notas = document.getElementById('cons-notas').value.trim();

    // Validar stock
    const stockNum = parseInt(stockText);
    if (!isNaN(stockNum) && cantidad > stockNum) {
      showToast('error', 'Cantidad excedida', `No puedes retirar ${cantidad}. Stock disponible: ${stockText}.`);
      return;
    }

    const op = operadores[operadorKey];

    // Registrar en historial de movimientos
    agregarMovimiento('salida', nombre, `-${cantidad} ${unidad}`, operadorKey, galpon, `${motivo}${notas ? '. ' + notas : ''}`);

    closeModal('modal-consumir');
    showToast('warning', 'Salida registrada', `${cantidad} ${unidad} de ${nombre} asignados a ${op.nombre} → ${galpon}. Motivo: ${motivo}.`);
  };

  // =================================================================
  //  TAB 1: STOCK — HISTORIAL POR PRODUCTO
  // =================================================================

  window.verHistorial = function(producto) {
    const movements = historialData[producto] || [
      { fecha: '—', tipo: 'Info', cantidad: '—', operador: 'supervisor', galpon: '—', motivo: 'Sin movimientos registrados aún' }
    ];

    const body = document.getElementById('historial-body');
    body.innerHTML = `
      <p style="font-weight:600; color:var(--text-primary); margin-bottom:1rem; font-size:1rem;">${producto}</p>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Operador</th>
              <th>Galpón</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            ${movements.map(m => {
              const op = operadores[m.operador] || { corto: m.operador, color: 'gray', letra: '?' };
              return `
              <tr>
                <td class="text-xs">${m.fecha}</td>
                <td><span class="badge ${m.tipo === 'Ingreso' ? 'optimal-badge' : 'warning-badge'}">${m.tipo}</span></td>
                <td style="font-weight:600; color: ${m.tipo === 'Ingreso' ? 'var(--status-optimal)' : 'var(--status-warning)'};">${m.cantidad}</td>
                <td>
                  <div style="display:flex; align-items:center; gap:0.4rem;">
                    <div class="mini-avatar" style="background:${op.color};">${op.letra}</div>
                    ${op.corto}
                  </div>
                </td>
                <td class="text-muted text-xs">${m.galpon}</td>
                <td class="text-muted text-xs">${m.motivo}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal('modal-historial')">Cerrar</button>
      </div>
    `;
    openModal('modal-historial');
  };

  // =================================================================
  //  TAB 2: REQUISICIONES
  // =================================================================

  window.submitRequisicion = function(e) {
    e.preventDefault();

    const producto = document.getElementById('req-producto').value;
    const cantidad = document.getElementById('req-cantidad').value;
    const unidad = document.getElementById('req-unidad').value;
    const urgencia = document.getElementById('req-urgencia').value;
    const motivo = document.getElementById('req-motivo').value.trim();

    if (!producto || !cantidad || !motivo) {
      showToast('error', 'Campos requeridos', 'Complete todos los campos obligatorios.');
      return;
    }

    const urgBadge = urgencia === 'urgente' ? 'critical-badge' : urgencia === 'normal' ? 'warning-badge' : 'optimal-badge';
    const urgIcon = urgencia === 'urgente' ? 'fa-arrow-up' : urgencia === 'normal' ? 'fa-minus' : 'fa-arrow-down';
    const urgLabel = urgencia.charAt(0).toUpperCase() + urgencia.slice(1);
    const today = new Date().toISOString().slice(0, 10);

    const tbody = document.getElementById('tbody-requisiciones');
    const fila = document.createElement('tr');
    fila.setAttribute('data-req-estado', 'pendiente');
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td><strong>${producto}</strong><br><span class="text-xs text-muted">Solicitado por: Juan Martínez (Supervisor)</span></td>
      <td><strong>${cantidad} ${unidad}</strong></td>
      <td><span class="badge ${urgBadge}"><i class="fa-solid ${urgIcon}"></i> ${urgLabel}</span></td>
      <td class="text-xs text-muted">${motivo}</td>
      <td class="text-xs text-muted">${today}</td>
      <td><span class="badge warning-badge"><i class="fa-solid fa-hourglass-half"></i> Pendiente</span></td>
      <td class="action-buttons">
        <button class="icon-btn resolve" title="Marcar recibida" onclick="completarRequisicion(this)"><i class="fa-solid fa-check"></i></button>
        <button class="icon-btn delete" title="Cancelar" onclick="cancelarRequisicion(this)"><i class="fa-solid fa-xmark"></i></button>
      </td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);

    // Actualizar contador
    const counter = document.getElementById('summary-requisiciones');
    const current = parseInt(counter.textContent) || 0;
    counter.textContent = `${current + 1} pendientes`;

    closeModal('modal-nueva-requisicion');
    document.getElementById('form-nueva-requisicion').reset();
    showToast('success', 'Requisición enviada', `Solicitud de ${cantidad} ${unidad} de ${producto} registrada.`);
  };

  window.completarRequisicion = function(btn) {
    const row = btn.closest('tr');
    if (!row) return;
    const producto = row.querySelector('strong').textContent;

    showConfirm(
      'Marcar como Recibida',
      `¿Confirmar que se recibió la requisición de "${producto}"?`,
      () => {
        row.setAttribute('data-req-estado', 'recibida');
        row.style.opacity = '0.6';
        const cells = row.querySelectorAll('td');
        const today = new Date().toISOString().slice(0, 10);
        cells[5].innerHTML = '<span class="badge optimal-badge"><i class="fa-solid fa-circle-check"></i> Recibida</span>';
        cells[6].innerHTML = `<span class="text-xs text-muted">✅ ${today}</span>`;

        const counter = document.getElementById('summary-requisiciones');
        const current = parseInt(counter.textContent) || 0;
        if (current > 0) counter.textContent = `${current - 1} pendientes`;

        showToast('success', 'Requisición completada', `"${producto}" marcada como recibida.`);
      }
    );
  };

  window.cancelarRequisicion = function(btn) {
    const row = btn.closest('tr');
    if (!row) return;
    const producto = row.querySelector('strong').textContent;

    showConfirm(
      'Cancelar Requisición',
      `¿Cancelar la requisición de "${producto}"?`,
      () => {
        row.style.animation = 'fadeIn 0.3s ease reverse forwards';
        setTimeout(() => {
          row.remove();
          const counter = document.getElementById('summary-requisiciones');
          const current = parseInt(counter.textContent) || 0;
          if (current > 0) counter.textContent = `${current - 1} pendientes`;
          showToast('warning', 'Requisición cancelada', `Solicitud de "${producto}" eliminada.`);
        }, 300);
      }
    );
  };

  // =================================================================
  //  TAB 3: HISTORIAL DE MOVIMIENTOS
  // =================================================================

  // Helper: agregar un movimiento al tab de movimientos
  function agregarMovimiento(tipo, producto, cantidad, operadorKey, galpon, motivo) {
    const op = operadores[operadorKey] || operadores.supervisor;
    const now = new Date();
    const timestamp = formatTimestamp(now);
    const tipoLabel = tipo === 'ingreso' ? 'Ingreso' : 'Salida';
    const tipoBadge = tipo === 'ingreso' ? 'optimal-badge' : 'warning-badge';
    const tipoIcon = tipo === 'ingreso' ? 'fa-arrow-down' : 'fa-arrow-up';
    const colorCant = tipo === 'ingreso' ? 'var(--status-optimal)' : 'var(--status-warning)';

    const tbody = document.getElementById('tbody-movimientos');
    if (!tbody) return;

    const fila = document.createElement('tr');
    fila.setAttribute('data-mov-tipo', tipo);
    fila.setAttribute('data-mov-operador', operadorKey);
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td class="text-xs">${timestamp}</td>
      <td><span class="badge ${tipoBadge}"><i class="fa-solid ${tipoIcon}"></i> ${tipoLabel}</span></td>
      <td><strong>${producto}</strong></td>
      <td style="color:${colorCant}; font-weight:600;">${cantidad}</td>
      <td>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <div class="mini-avatar" style="background:${op.color};">${op.letra}</div>
          ${op.corto}
        </div>
      </td>
      <td>${galpon}</td>
      <td class="text-xs text-muted">${motivo}</td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);
  }

  window.aplicarFiltrosMovimientos = function() {
    const tipo = document.getElementById('filter-mov-tipo').value;
    const operador = document.getElementById('filter-mov-operador').value;

    document.querySelectorAll('#tbody-movimientos tr').forEach(row => {
      const matchTipo = tipo === 'all' || row.getAttribute('data-mov-tipo') === tipo;
      const matchOp = operador === 'all' || row.getAttribute('data-mov-operador') === operador;
      row.style.display = (matchTipo && matchOp) ? '' : 'none';
    });
  };

  window.limpiarFiltrosMovimientos = function() {
    document.getElementById('filter-mov-tipo').value = 'all';
    document.getElementById('filter-mov-operador').value = 'all';
    aplicarFiltrosMovimientos();
    showToast('info', 'Filtros limpiados', 'Mostrando todos los movimientos.');
  };

  // =================================================================
  //  EXPORTAR
  // =================================================================

  window.exportarInventarioCSV = function() {
    const headers = ['Producto','Categoría','Stock','Mínimo','Ubicación','Estado','Actualizado'];
    const rows = [];
    document.querySelectorAll('#tabla-inventario-body tr').forEach(tr => {
      if (tr.style.display === 'none') return;
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 7) {
        rows.push(Array.from(cells).slice(0, 7).map(c => c.textContent.trim()));
      }
    });
    exportToCSV('avisens_inventario_' + new Date().toISOString().slice(0, 10) + '.csv', headers, rows);
  };

  window.exportarMovimientosCSV = function() {
    const headers = ['Fecha','Tipo','Producto','Cantidad','Operador','Galpón','Motivo'];
    const rows = [];
    document.querySelectorAll('#tbody-movimientos tr').forEach(tr => {
      if (tr.style.display === 'none') return;
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 7) {
        rows.push(Array.from(cells).map(c => c.textContent.trim()));
      }
    });
    exportToCSV('avisens_movimientos_' + new Date().toISOString().slice(0, 10) + '.csv', headers, rows);
  };

});