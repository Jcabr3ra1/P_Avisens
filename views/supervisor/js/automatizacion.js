document.addEventListener('DOMContentLoaded', () => {

  const masterToggle = document.getElementById('master-toggle-input');
  const masterCard = document.getElementById('master-card');
  const controlCards = document.querySelectorAll('.control-card');
  const modeManual = document.getElementById('mode-manual');
  const modeAuto = document.getElementById('mode-auto');
  const masterDesc = document.getElementById('master-desc');

  // ===== TABS =====
  window.cambiarTabAuto = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
  };

  // ===== MODO AUTO / MANUAL =====
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

  // ===== SLIDERS =====
  document.querySelectorAll('.equip-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      const display = e.target.closest('.control-body').querySelector('.slider-value');
      const unit = e.target.dataset.unit || '%';
      display.textContent = `${val}${unit}`;
    });
  });

  // ===== EQUIP TOGGLES =====
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

  // ===== DISPENSAR ALIMENTO =====
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

  // ===== LOG DE ACTIVIDAD =====
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
      <span class="log-user">${mode === 'auto' ? 'Sistema' : 'María López'}</span>
    `;
    log.insertBefore(entry, log.firstChild);
  }

  // ===== CAMBIAR GALPÓN =====
  window.cambiarGalponAuto = function() {
    const galpon = document.getElementById('auto-galpon').value;
    const data = {
      '1': { temp: '32°C', hum: '65%', status: 'Óptimo', statusClass: 'optimal' },
      '2': { temp: '29°C', hum: '62%', status: 'Advertencia', statusClass: 'warning' },
      '3': { temp: '35°C', hum: '72%', status: 'Crítico', statusClass: 'critical' },
      '4': { temp: '31°C', hum: '64%', status: 'Óptimo', statusClass: 'optimal' }
    };
    const d = data[galpon];
    document.getElementById('gm-temp').textContent = d.temp;
    document.getElementById('gm-hum').textContent = d.hum;

    const statusBadge = document.getElementById('auto-galpon-status');
    statusBadge.textContent = d.status;
    statusBadge.className = `badge ${d.statusClass}-badge`;

    showToast('info', 'Galpón cambiado', `Mostrando controles para Galpón ${galpon}.`);
  };

  // ===== GUARDAR REGLA =====
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
        <div class="rule-meta"><span>Creada ahora</span><span>Activa</span><span>María López</span></div>
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

  // ===== EXPORTAR LOG =====
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