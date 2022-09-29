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

function getRateSetupText(roomId) {
  const rates = state[roomId].rates;
  const ratesCount = Object.keys(rates).length;
  //todo: use hasRatePriceSetup getter
  const setupRates = Object.keys(rates).filter(rateId => rates[rateId].is_rate_set).length;

  if (setupRates) {
    return `
      <p class="bui-title__subtitle bui-f-color-constructive bui-f-font-featured">
        ${setupRates} of ${ratesCount} set-ups active
      </p>
    `;
  }

  return "Ready for children rates";
}

function getRoomList(activeRoomId) {
  const roomList = Object.keys(state);
  roomList.pop(); // last element in the list (with key equal to 9) holds property-wide pricing, which we don't want to render here

  return  `
    <ul aria-label="Hotels information - Accordion controls" class="bui-accordion bui-u-bleed@small" data-bui-component="Accordion">
     ${roomList.map((roomId) => `
      <li class="bui-accordion__row">
        <button class="bui-accordion__row-inner" data-bui-ref="accordion-button" aria-controls="content-0" aria-expanded="false" type="button">
          <div class="bui-accordion__row-header bui-title--heading">
            <div class="bui-title__text">${state[roomId].name}</div>
            ${getRateSetupText(roomId)}
          </div>
          <span role="presentation" class="bui-accordion__icon-container">
            <svg class="bui-accordion__icon" data-width="24" data-icon-name="arrow_nav_down" viewBox="0 0 24 24"><path d="M18 9.45a.74.74 0 0 1-.22.53l-5 5a1.08 1.08 0 0 1-.78.32 1.1 1.1 0 0 1-.78-.32l-5-5a.75.75 0 0 1 0-1.06.74.74 0 0 1 1.06 0L12 13.64l4.72-4.72a.74.74 0 0 1 1.06 0 .73.73 0 0 1 .22.53zm-5.72 4.47zm-.57 0z"></path></svg>
          </span>
        </button>
        <div id="content-0" class="bui-accordion__content" role="region">
        <hr class="bui-divider bui-divider--light" />
        </br>
        <div></div>
         ${getRateList(roomId)}
        </div>
      </li>
     `).join('')}
    </ul>
  `
}
