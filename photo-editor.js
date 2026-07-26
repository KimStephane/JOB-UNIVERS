/* ==========================================================
   Job Univers — Outil de recadrage de photo (façon LinkedIn)
   Réutilisable pour photo de profil (cercle) et couverture (bannière).
   Ajout : <script src="photo-editor.js"></script>
   Usage : window.openCropModal(file, shape, outW, outH, callback)
     - file      : fichier image sélectionné (input type="file")
     - shape     : 'circle' ou 'rect'
     - outW/outH : dimensions de sortie en pixels
     - callback  : fonction appelée avec le résultat (dataURL base64)
   ========================================================== */
(function () {

  const style = document.createElement('style');
  style.textContent = `
    #ju-crop-overlay{
      position:fixed; inset:0; background:rgba(15,27,45,0.85); z-index:9999;
      display:flex; align-items:center; justify-content:center; padding:20px;
    }
    #ju-crop-box{
      background:#fff; border-radius:16px; padding:20px; max-width:420px; width:100%;
      font-family:'Sora', 'Inter', sans-serif;
    }
    #ju-crop-box h3{font-size:1rem; margin-bottom:14px; color:#0F1B2D; font-weight:700;}
    #ju-crop-stage{
      position:relative; width:100%; aspect-ratio:1/1; background:#111; border-radius:10px;
      overflow:hidden; touch-action:none; cursor:grab; margin-bottom:16px;
    }
    #ju-crop-stage.rect{aspect-ratio:3/1;}
    #ju-crop-img{
      position:absolute; top:0; left:0; transform-origin:0 0; user-select:none; pointer-events:none;
      max-width:none;
    }
    #ju-crop-mask{
      position:absolute; inset:0; pointer-events:none;
      box-shadow:0 0 0 2000px rgba(0,0,0,0.55);
    }
    #ju-crop-mask.circle{border-radius:50%; margin:8%;}
    #ju-crop-mask.rect{margin:0;}
    #ju-crop-zoom{width:100%; margin-bottom:16px; accent-color:#0F1B2D;}
    #ju-crop-actions{display:flex; gap:10px;}
    .ju-crop-btn{
      flex:1; padding:12px; border-radius:9px; font-family:'Sora',sans-serif; font-weight:700;
      font-size:0.88rem; border:none; cursor:pointer;
    }
    .ju-crop-save{background:#0F1B2D; color:#fff;}
    .ju-crop-cancel{background:#F1EFEA; color:#1A1F26;}
  `;
  document.head.appendChild(style);

  window.openCropModal = function (file, shape, outW, outH, callback) {
    const reader = new FileReader();
    reader.onload = () => buildModal(reader.result, shape, outW, outH, callback);
    reader.readAsDataURL(file);
  };

  function buildModal(srcDataUrl, shape, outW, outH, callback) {
    const overlay = document.createElement('div');
    overlay.id = 'ju-crop-overlay';
    overlay.innerHTML = `
      <div id="ju-crop-box">
        <h3>${shape === 'circle' ? 'Ajuster la photo de profil' : 'Ajuster la photo de couverture'}</h3>
        <div id="ju-crop-stage" class="${shape === 'rect' ? 'rect' : ''}">
          <img id="ju-crop-img" src="${srcDataUrl}">
          <div id="ju-crop-mask" class="${shape}"></div>
        </div>
        <input type="range" id="ju-crop-zoom" min="100" max="300" value="100">
        <div id="ju-crop-actions">
          <button type="button" class="ju-crop-btn ju-crop-cancel" id="ju-crop-cancel">Annuler</button>
          <button type="button" class="ju-crop-btn ju-crop-save" id="ju-crop-save">Enregistrer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const stage = overlay.querySelector('#ju-crop-stage');
    const img = overlay.querySelector('#ju-crop-img');
    const zoomSlider = overlay.querySelector('#ju-crop-zoom');

    let scale = 1, posX = 0, posY = 0;
    let dragging = false, startX = 0, startY = 0, startPosX = 0, startPosY = 0;
    let naturalW = 0, naturalH = 0;

    img.onload = () => {
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
      const stageRect = stage.getBoundingClientRect();
      const coverScale = Math.max(stageRect.width / naturalW, stageRect.height / naturalH);
      scale = coverScale;
      posX = (stageRect.width - naturalW * scale) / 2;
      posY = (stageRect.height - naturalH * scale) / 2;
      applyTransform();
    };

    function applyTransform() {
      img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    function clampPosition() {
      const stageRect = stage.getBoundingClientRect();
      const w = naturalW * scale, h = naturalH * scale;
      const minX = Math.min(0, stageRect.width - w);
      const minY = Math.min(0, stageRect.height - h);
      posX = Math.max(minX, Math.min(0, posX));
      posY = Math.max(minY, Math.min(0, posY));
    }

    stage.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startPosX = posX; startPosY = posY;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = 'grabbing';
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      posX = startPosX + (e.clientX - startX);
      posY = startPosY + (e.clientY - startY);
      clampPosition();
      applyTransform();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
      stage.addEventListener(evt, () => { dragging = false; stage.style.cursor = 'grab'; });
    });

    zoomSlider.addEventListener('input', () => {
      const stageRect = stage.getBoundingClientRect();
      const baseScale = Math.max(stageRect.width / naturalW, stageRect.height / naturalH);
      const centerX = stageRect.width / 2, centerY = stageRect.height / 2;
      const imgCenterX = (centerX - posX) / scale;
      const imgCenterY = (centerY - posY) / scale;

      scale = baseScale * (zoomSlider.value / 100);

      posX = centerX - imgCenterX * scale;
      posY = centerY - imgCenterY * scale;
      clampPosition();
      applyTransform();
    });

    overlay.querySelector('#ju-crop-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#ju-crop-save').addEventListener('click', () => {
      const stageRect = stage.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');

      const scaleFactorX = outW / stageRect.width;
      const scaleFactorY = outH / stageRect.height;

      ctx.drawImage(
        img,
        0, 0, naturalW, naturalH,
        posX * scaleFactorX, posY * scaleFactorY,
        naturalW * scale * scaleFactorX, naturalH * scale * scaleFactorY
      );

      const result = canvas.toDataURL('image/jpeg', 0.9);
      overlay.remove();
      callback(result);
    });
  }

})();

