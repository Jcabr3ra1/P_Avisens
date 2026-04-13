document.addEventListener('DOMContentLoaded', () => {

  // ===== CONFIGURACIÓN DE SENSOR (UMBRALES) =====
  const defaults = {
    'Temperatura': { optMin:28, optMax:32, warnMin:24, warnMax:34, critMin:20, critMax:36 },
    'Humedad':     { optMin:50, optMax:70, warnMin:40, warnMax:80, critMin:30, critMax:85 },
    'CO₂':         { optMin:0,  optMax:1000, warnMin:0, warnMax:3000, critMin:0, critMax:5000 },
    'Amoníaco':    { optMin:0,  optMax:10, warnMin:0, warnMax:20, critMin:0, critMax:25 }
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

  // ===== FILTROS =====
  window.aplicarFiltrosSensores = function() {
    const galpon = document.getElementById('filter-galpon').value;
    const param = document.getElementById('filter-param').value;

    const rows = document.querySelectorAll('#tbody-sensores tr');
    let visible = 0;

    rows.forEach(row => {
      const matchGalpon = galpon === 'all' || row.getAttribute('data-galpon') === galpon;
      const matchParam = param === 'all' || row.getAttribute('data-tipo') === param;

      if (matchGalpon && matchParam) {
        row.style.display = '';
        visible++;
      } else {
        row.style.display = 'none';
      }
    });

    const info = document.querySelector('.pagination-info');
    if (info) info.textContent = `Mostrando ${visible} de ${rows.length} sensores`;
  };

  window.limpiarFiltrosSensores = function() {
    document.getElementById('filter-galpon').value = 'all';
    document.getElementById('filter-param').value = 'all';
    document.getElementById('filter-periodo').value = '24h';
    aplicarFiltrosSensores();
    showToast('info', 'Filtros limpiados', 'Se muestran todos los sensores.');
  };

  // ===== EXPORTAR CSV =====
  window.exportarSensoresCSV = function() {
    const headers = ['ID Sensor','Galpón','Tipo','Valor','Estado','Timestamp'];
    const rows = [
      ['S001','Galpón 3','Temperatura','35.2°C','Crítico','2026-03-17 10:45:32'],
      ['S002','Galpón 3','Amoníaco','22 ppm','Crítico','2026-03-17 10:44:18'],
      ['S003','Galpón 3','CO₂','1150 ppm','Advertencia','2026-03-17 10:43:55'],
      ['S004','Galpón 3','Humedad','72%','Óptimo','2026-03-17 10:43:12'],
      ['S005','Galpón 1','Temperatura','32°C','Óptimo','2026-03-17 10:42:08'],
      ['S006','Galpón 2','CO₂','920 ppm','Advertencia','2026-03-17 10:41:44'],
    ];
    exportToCSV('avisens_sensores_' + new Date().toISOString().slice(0,10) + '.csv', headers, rows);
  };

});
