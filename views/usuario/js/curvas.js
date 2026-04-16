document.addEventListener('DOMContentLoaded', () => {

  // Set fecha por defecto a hoy
  const fechaInput = document.getElementById('pesaje-fecha');
  if (fechaInput) {
    fechaInput.value = new Date().toISOString().slice(0, 10);
    fechaInput.max = new Date().toISOString().slice(0, 10); // No permite fechas futuras
  }

  // ===== GUARDAR PESAJE =====
  window.guardarPesaje = function(e) {
    e.preventDefault();

    const galpon = document.getElementById('pesaje-galpon').value;
    const fecha = document.getElementById('pesaje-fecha').value;
    const peso = parseFloat(document.getElementById('pesaje-peso').value);
    const muestra = parseInt(document.getElementById('pesaje-muestra').value);
    const mortalidad = parseInt(document.getElementById('pesaje-mortalidad').value) || 0;
    const notas = document.getElementById('pesaje-notas').value.trim();

    // Validaciones
    if (peso < 0.1 || peso > 5.0) {
      showToast('error', 'Peso inválido', 'El peso debe estar entre 0.1 y 5.0 kg.');
      return;
    }
    if (muestra < 10) {
      showToast('error', 'Muestra insuficiente', 'La muestra debe ser de al menos 10 pollos.');
      return;
    }
    if (muestra < 30) {
      showToast('warning', 'Muestra baja', 'Se recomienda un mínimo de 30 aves para mayor confiabilidad.');
    }

    // Verificar si el peso está muy fuera de rango (alerta visual)
    if (peso < 0.5 || peso > 4.0) {
      showConfirm(
        'Peso fuera de rango',
        `El peso ${peso} kg parece inusual. ¿Deseas guardar de todos modos?`,
        () => insertarPesaje(galpon, fecha, peso, muestra, mortalidad, notas),
        null
      );
      return;
    }

    insertarPesaje(galpon, fecha, peso, muestra, mortalidad, notas);
  };

  function insertarPesaje(galpon, fecha, peso, muestra, mortalidad, notas) {
    // Calcular edad (mock)
    const edad = Math.floor((new Date(fecha) - new Date('2026-02-10')) / (1000 * 60 * 60 * 24));

    // Determinar estado
    let estado = 'En rango';
    let badgeClass = 'optimal-badge';
    if (peso < 1.5 && edad > 21) {
      estado = 'Bajo peso';
      badgeClass = 'warning-badge';
    } else if (peso > 3.0 && edad < 35) {
      estado = 'Acelerado';
      badgeClass = 'warning-badge';
    }

    const tbody = document.getElementById('tbody-pesajes');
    const fila = document.createElement('tr');
    fila.style.animation = 'fadeIn 0.5s ease forwards';
    fila.innerHTML = `
      <td>${fecha}</td>
      <td>${edad} días</td>
      <td><strong>${peso.toFixed(2)} kg</strong></td>
      <td>${muestra} aves</td>
      <td>${mortalidad}</td>
      <td class="truncate" style="max-width:150px;" title="${notas || 'Sin notas'}">${notas || '—'}</td>
      <td class="text-muted text-xs">Juan Martínez</td>
      <td><span class="badge ${badgeClass}">${estado}</span></td>
    `;
    tbody.insertBefore(fila, tbody.firstChild);

    closeModal('modal-nuevo-pesaje');
    document.getElementById('form-pesaje').reset();
    document.getElementById('pesaje-fecha').value = new Date().toISOString().slice(0, 10);

    showToast('success', 'Registro guardado', `Pesaje de ${peso.toFixed(2)} kg registrado para Galpón ${galpon}.`);
  }

  // ===== EXPORTAR CSV =====
  window.exportarCurvasCSV = function() {
    const headers = ['Fecha','Edad','Peso Promedio','Muestra','Mortalidad','Notas','Registrado por','Estado'];
    const rows = [];
    document.querySelectorAll('#tbody-pesajes tr').forEach(tr => {
      const cells = tr.querySelectorAll('td');
      rows.push(Array.from(cells).map(c => c.textContent.trim()));
    });
    exportToCSV('avisens_curvas_' + new Date().toISOString().slice(0,10) + '.csv', headers, rows);
  };

});
