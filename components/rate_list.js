function getChangesAlert(room) {
  let visiblityStyle = state[room.id].is_rate_set ? "":"display: none";

  return `<div class="bui-alert bui-u-bleed@small bui-alert--success" role="status" id="changes-saved"style="${visiblityStyle}">
  <span class="bui-alert__icon"><svg  data-width="24" data-icon-name="checkmark_selected" data-name="1x" viewBox="0 0 128 128" role="presentation"><path d="M56.62,93.54a4,4,0,0,1-2.83-1.18L28.4,67a4,4,0,1,1,5.65-5.65L56.18,83.45l33-44a4,4,0,0,1,6.4,4.8L59.82,91.94a4.06,4.06,0,0,1-2.92,1.59ZM128,64a64,64,0,1,0-64,64A64.07,64.07,0,0,0,128,64Zm-8,0A56,56,0,1,1,64,8,56.06,56.06,0,0,1,120,64Z"></path></svg></span>
  <div class="bui-alert__description">
    <p class="bui-alert__text">Changes are successfully saved.</p>
  </div>
</div>`;
}


function getRoomHeader(room) {
  return `${getChangesAlert(room)}
<div class="bui-title bui-title--display-one room-header">
    <span class="bui-title__text">${room.name}</span>
    <span class="bui-title__subtitle">Maximum children occupancy: ${room.max_occ}</span>
    <span class="bui-title__subtitle">Create and manage your preferred children pricing setup for each of the rate plans</span>
</div>
  `
}

function getPreview(roomId, rateId) {
  let previewId = `rule-preview-${roomId}-${rateId}`;
  return `
      <div id=${previewId}>
       ${getRulesPreview(roomId, rateId)}
      </div>
  `
}

function getRateSetupView(isSetup) {
  if (!isSetup) {
    return `<p class="bui-title__subtitle">No pricing setup</p>`;
  } else {
    return `<p class="bui-title__subtitle bui-f-color-constructive bui-f-font-featured">Pricing setup active</p>`
  }
}

function getRateList(roomId) {
  let room = state[roomId];
  if (roomId>=1) {
    if (room.rates) {
    return `
      <ul class="bui-list bui-list--text bui-list--icon bui-list--divided rate-list">
        ${Object.keys(room.rates).map((key, i) => `
          <li class="bui-list__item room-list__item" data-room-id="${roomId}" data-rate-id="${key}">
              <div class="bui-list__body">
                  <div class="bui-list__description room-list__item__text ${room.max_occ === 0 ? `bui-f-color-grayscale`: ``}">
                      <span class="bui-list__description-title">
                          ${room.rates[key].name}
                      </span>
                      <span class="bui-list__description-subtitle ${room.max_occ === 0 ? `bui-f-color-grayscale` : (room.rates[key].is_rate_set > 0 ?`room-list__item__subtitle bui-f-color-constructive`: `room-list__item__subtitle`)}">
                          ${room.max_occ > 0 ? (room.rates[key].is_rate_set > 0 ? "Set-up active": `No children rates set-up`) : `Not ready for children pricing`}
                      </span>
                  </div>
                  <span><svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" height="20" width="20" focusable="false" fill="#6B6B6B" class="bk-icon -material-ic_chevron_right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></span>
              </div>
          </li>
        `).join('')}
      </ul>
    `
    }
  }
}
