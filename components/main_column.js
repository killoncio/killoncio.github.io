function getPreview(roomId, rateId, isPerDateBlock) {
  let previewId = `rule-preview-${roomId}-${rateId}`;
  return `
      <div id=${previewId}>
       ${getRulesPreview(roomId, rateId, isPerDateBlock)}
      </div>
  `
}

function getLastAvailableRoomRateText() {
  const date = new Date();

  // most modern version of dateFns in cdn I could get did not have single method to get desired format
  return `Last available room rate (${dateFns.format(date, 'MMM')} ${dateFns.format(date, 'D')} ${dateFns.format(date, 'YYYY')}): EUR 84`;
}

function getOccupancyText(roomId) {
  const maxOccupancy = state[roomId].max_occ;
  const maxChildren = state[roomId].occupancy && state[roomId].occupancy.maxChildren;
  const maxAdults = state[roomId].occupancy && state[roomId].occupancy.maxAdults;

  if (maxChildren) {
    return `Occupancy: ${maxAdults} adults max, ${maxChildren} child max, ${maxOccupancy} guests max`;
  }

  return `Occupancy: ${maxOccupancy} adults max`;
}

function getActionButtons(roomId, rateId, isEditMode) {
  if (isEditMode) {
    return `
      <div class="bui-group bui-group--inline preview-btn-container form-group__inline">
        <button class="bui-button bui-button--primary btn-save" type="button" data-rate=${rateId} data-room=${roomId} ${ areAllAgePricesSet(roomId, rateId) ? '' : "disabled"}>
          <span class="bui-button__text" data-rate=${rateId} data-room=${roomId}>Save Changes</span>
        </button>
      </div>
    `
  }

  return `
      <div role="group" class="bui-card__actions bui-group bui-group--inline">
        <button class="bui-button bui-button--secondary children-rate-pricing-preview__edit-button" type="button" data-rate=${rateId} data-room=${roomId}>
          <span class="bui-button__text" >Edit</span>
        </button>
        <button class="bui-button bui-button--secondary children-rate-pricing-preview__duplicate-button" type="button" data-rate=${rateId} data-room=${roomId}>
          <span class="bui-button__text">Duplicate</span>
        </button>
        <button class="bui-button bui-button--secondary children-rate-pricing-preview__delete-button" type="button" data-rate=${rateId} data-room=${roomId}>
          <span class="bui-button__text">Delete</span>
        </button>
      </div>
  `
}

function showSuccessMessage(roomName, rateName, isExceptionSaved) {
  let successText;

  if (isPricingSaveSuccess) {
    successText = `Changes to ${roomName} - ${rateName} saved.`
  } else if (isExceptionSaveSuccess) {
    successText = "Date-specific exception successfully saved.";
  } else if (isBulkUpdateSaveSuccess) {
    successText = `You have successfully duplicated children rates for ${roomName} - ${rateName}  to the selected individual room-rate plans.`;
  }


  if (isPricingSaveSuccess || isExceptionSaveSuccess || isBulkUpdateSaveSuccess) {
    return `
      <div class="bui-spacer--large">
        <div role="status" class="bui-alert bui-alert--success">
          <span role="presentation" class="icon--hint bui-alert__icon">
            <svg data-test-id="default-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path d="M56.62 93.54a4 4 0 0 1-2.83-1.18L28.4 67a4 4 0 1 1 5.65-5.65l22.13 22.1 33-44a4 4 0 1 1 6.4 4.8L59.82 91.94a4.06 4.06 0 0 1-2.92 1.59zM128 64c0-35.346-28.654-64-64-64C28.654 0 0 28.654 0 64c0 35.346 28.654 64 64 64 35.33-.039 63.961-28.67 64-64zm-8 0c0 30.928-25.072 56-56 56S8 94.928 8 64 33.072 8 64 8c30.914.033 55.967 25.086 56 56z"></path></svg>
          </span>
          <div class="bui-alert__description">
            <p class="bui-alert__text">
              ${successText}
            </p>
          </div>
        </div>
      </div>
    `
  }

  return '';
}

function renderDateInputs() {
  const fromDate = editState[currentRoomId].rates[currentRateId].exceptions[currentExceptionIndex].date.from;
  const toDate = editState[currentRoomId].rates[currentRateId].exceptions[currentExceptionIndex].date.to;

  return `
    <div class="bui-group bui-group--inline form-group__inline children-rate-pricing-exceptions-form__inputs">
      <div class="bui-form__group">
        <label for="exception-date-from">From</label>
        <input id="exception-date-from" aria-describedby="exception-date-from" autocomplete="off" class="bui-form__control" data-range="from" value="${fromDate}"">
      </div>
      <div class="bui-form__group">
        <label for="exception-date-to">Up and including</label>
        <input id="exception-date-to" aria-describedby="exception-date-to" autocomplete="off" class="bui-form__control" data-range="to" value="${toDate}"">
      </div>
    </div>
  `
}

function renderPerDateBlock(roomId, rateId, isEditMode) {
  const isAnyPerDateExceptionSaved = state[roomId].rates[rateId].exceptions && state[roomId].rates[rateId].exceptions.length > 0;

  if (isEditMode) {
    const room = editState[roomId];
    const rate = room.rates[rateId];
    const exceptionIndex = currentExceptionIndex;
    const prices = rate.exceptions[exceptionIndex].prices;
    const date = rate.exceptions[exceptionIndex].date;
    const isAnyRatePriceSaved = editState.prices

    return `
      <div class="bui-card children-rate-per-date-form" data-exception-index=${exceptionIndex}>
        <div class="bui-card__content">
          <header class="bui-card__header children-rate-pricing-form__title">
            <h1 class="bui-card__title">
              <span>Set different rates for specific dates</span>
            </h1>
          </header>
          <p class="bui-f-font-strong"> 1. For the following dates (only supported in Chrome!</p>
            ${renderDateInputs()}
          <p class="bui-f-font-strong"> 2. Use the following children rate setup:</p>
          <div class="children-rate-pricing-age-band bui-spacer">
            ${renderPriceInputs(0, room, rate, prices)}
          </div>
          <div class="children-rate-pricing-age-band bui-spacer">
            ${renderPriceInputs(1, room, rate, prices)}
          </div>
          <div class="children-rate-pricing-age-band bui-spacer">
            ${renderPriceInputs(2, room, rate, prices)}
          </div>
          <p class="bui-f-font-strong">Preview your date-specific exception</p>
          <p class="bui-f-font-strong">For the following date(s):</p>
          <p class="children-rate-pricing-form__selected-dates">${date.from} - ${date.to}</p>
          ${getPreview(roomId, rateId, true)}
          ${getActionButtons(roomId, rateId, isEditMode)}
        </div>
      </div>
    `;
  } else if (isAnyPerDateExceptionSaved) {
    return renderPerDateExceptionsSaved(roomId, rateId);
  } else if (!hasRatePriceSetup(roomId, rateId)) {
    return renderSaveFirstPriceCard();
  }

  return `
    <div class="bui-card">
      <div class="bui-card__content">
        <header class="bui-card__header children-rate-pricing-form__title">
          <h1 class="bui-card__title">
            <span>Set different rates for specific dates</span>
          </h1>
        </header>
        You do not currently have any date-specific exceptions created for this children rate setup.
        <div class="bui-group preview-btn-container">
          <button class="bui-button bui-button--secondary children-rate-pricing-exceptions__add-new-button" type="button" data-rate=${rateId} data-room=${roomId}>
            <span class="bui-button__text" >Create new exception</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPerDateExceptionsSaved(roomId, rateId) {
  const exceptions = state[roomId].rates[rateId].exceptions;

  return `
    <div class="bui-card">
      <div class="bui-card__content">
        <header class="bui-card__header children-rate-pricing-form__title">
          <h1 class="bui-card__title">
            <span>Set different rates for specific dates</span>
            <span>
            <button type="button" class="bui-button bui-button--tertiary bui-u-pull-end children-rate-pricing-exceptions__action-button--download">
              <span class="bui-button__icon">
                <svg width="16" focusable="false" role="presentation" viewBox="0 0 24 24" aria-hidden="true" height="16" class="icon-gap bk-icon -material-ic_file_download"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>
              </span>
              <span class="bui-button__text">
                Download prices for all dates
              </span>
            </button>
          </h1>
        </header>
        <div class="bui-spacer">
          ${getExceptionsTable(roomId, rateId, exceptions)}
          <p class="children-rate-pricing-preview__disclaimer">
            The following list only displays age group prices that differ from the default children rate.
          </p>
        </div>
        <button class="bui-button bui-button--secondary children-rate-pricing-exceptions__add-new-button" type="button" data-rate=${rateId} data-room=${roomId}>
          <span class="bui-button__text" data-rate=${rateId} data-room=${roomId}>Create new exception</span>
        </button>
      </div>
    </div>
  `;
}

function getExceptionsTable(roomId, rateId, exceptions) {
  const ratePrices = state[roomId].rates[rateId].prices;
  const showPercentage = true;

  return `
    <table class="bui-table children-rate-pricing-exceptions-preview-table">
      <thead class="bui-table__head">
        <tr class="bui-table__row">
          <th class="bui-table__cell bui-table__cell--head">
              Date range
          </th>
          <th class="bui-table__cell bui-table__cell--head">
            Age group
          </th>
          <th class="bui-table__cell bui-table__cell--head" colspan="3">
            Price
          </th>
        </tr>
      </thead>
      <tbody class="bui-table__body">
        ${exceptions.map( (exception, index) =>
          `
            ${ageGroups.map( (ageBand, ageBandIndex) =>
              `
                <tr class="bui-table__row" data-rate=${rateId} data-room=${roomId} data-exception-index="${index}">
                  ${maybeGetDateCel(exception, ageBandIndex)}
                  <td class="bui-table__cell children-rate-pricing-exceptions-preview-table__age-band-cel" data-heading="Age band">
                      <span>${ageBand.from_age} - ${ageBand.to_age} years
                  </td>
                  <td class="bui-table__cell" data-heading="${ageBandIndex}">
                    ${arePricesDifferent(exception.prices[ageBandIndex], ratePrices[ageBandIndex]) ? rulePreview(ageBandIndex, exception.prices[ageBandIndex], showPercentage) : '-'}
                  </td>
                  ${maybeGetActionCels(ageBandIndex)}
                </tr>
              `
            ).join('')}
          `
        ).join('')}
      </tbody>
    </table>
  `
}

function arePricesDifferent(exceptionPrices, ratePrices) {
  if (exceptionPrices.order_select !== ratePrices.order_select) {
    // if one has selected 'same price for all children' and the other not
    return true;
  } else if ( exceptionPrices.order_select ) {
    // if none has selected 'same price for all children', if any of price & price_type for each child is different
    return !_.isEqual(exceptionPrices.order_price, ratePrices.order_price) || !_.isEqual(exceptionPrices.extra_child, ratePrices.extra_child);
  } else {
    // if both has selected 'same price for all children', if either price or price type is different
    return (exceptionPrices.price !== ratePrices.price) || (exceptionPrices.price_type !== ratePrices.price_type);
  }
}

function maybeGetDateCel(exception, index) {
  if (index === 0) {
    return `
      <td class="bui-table__cell children-rate-pricing-exceptions-preview-table__date-cel" rowspan="3" scope="row">
        <p class="bui-f-font-strong">${exception.date.from} -</p>
        <p class="bui-f-font-strong">${exception.date.to}</p>
      </td>
    `
  }

  return '';
}

function maybeGetActionCels(index) {
  if (index === 0) {
    return `
      <td class="bui-table__cell children-rate-pricing-exceptions-preview-table__action-cel" rowspan="3" data-heading="Edit">
        <button type="button" class="bui-button bui-button--tertiary children-rate-pricing-exceptions__action-button children-rate-pricing-exceptions__action-button--edit">
          <span class="bui-button__text">Edit</span>
        </button>
      </td>
      <td class="bui-table__cell children-rate-pricing-exceptions-preview-table__action-cel" rowspan="3" data-heading="Edit">
        <button type="button" class="bui-button bui-button--tertiary children-rate-pricing-exceptions__action-button children-rate-pricing-exceptions__action-button--duplicate">
          <span class="bui-button__text">Duplicate</span>
        </button>
      </td>
      <td class="bui-table__cell children-rate-pricing-exceptions-preview-table__action-cel" rowspan="3" data-heading="Remove">
        <button type="button" class="bui-button bui-button--tertiary children-rate-pricing-exceptions__action-button children-rate-pricing-exceptions__action-button--remove">
          <span class="bui-button__text bui-f-color-destructive">Remove</span>
        </button>
      </td>
    `
  }

  return '';
}

function renderSaveFirstPriceCard() {
  return `
    <div class="bui-card">
      <div class="bui-card__content">
        <header class="bui-card__header children-rate-pricing-form__title">
          <h1 class="bui-card__title">
            <span>Set different rates for specific dates</span>
          </h1>
        </header>
        <div class="bui-banner bui-banner--small bui-banner--hint">
          <span class="bui-banner__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14.25 15.75h-.75a.75.75 0 0 1-.75-.75v-3.75a1.5 1.5 0 0 0-1.5-1.5h-.75a.75.75 0 0 0 0 1.5h.75V15a2.25 2.25 0 0 0 2.25 2.25h.75a.75.75 0 0 0 0-1.5zM11.625 6a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg>
          </span>
          <div class="bui-banner__content">
            <p class="bui-banner__text">After you set up and save your default children rate setup, you can create exceptions for specific dates.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMainColumn(roomId, rateId) {
  if (roomId && rateId) {
    const isRateActive = state[roomId].rates[rateId].is_rate_set;
    const isEditMode = state[roomId].rates[rateId].isEditing;
    const isEditExceptionMode = state[roomId].rates[rateId].isEditingException;
    const roomName = state[roomId].name;
    const rateName = state[roomId].rates[rateId].name;

    return `
      ${showSuccessMessage(roomName, rateName)}

      <p class="children-rate-pricing-header__title">
        ${roomName} - ${rateName}
      </p>
      <span class="children-rate-pricing-header__occupancy">
        ${getOccupancyText(roomId)}
      </span>
      <span class="children-rate-pricing-header__price">
        ${getLastAvailableRoomRateText()}
      </span>
      <span class="children-rate-pricing-header__info">
        Prices only apply to children staying in existing beds. You can update your occupancy on the Children policies and occupancy page
      </span>
      <div class="bui-spacer">
        <div class="bui-card">
          <div class="bui-card__content">
            <header class="bui-card__header">
              <h1 class="bui-card__title">
                <span>Children rate setup</span>
                <span class="${isRateActive ? 'children-rate-pricing-form--active' : 'children-rate-pricing-form--inactive'}">
                  ${isRateActive ? 'Active' : 'Not active'}
                </span>
              </h1>
            </header>
            ${getRateForm(roomId, rateId, isEditMode)}
            ${getPreview(roomId, rateId)}
            ${getActionButtons(roomId, rateId, isEditMode)}
          </div>
        </div>
      </div>
      ${renderPerDateBlock(roomId, rateId, isEditExceptionMode)}
    `;
  }

  return `
    <div class="children-rate-price-landing">
      <img src="images/select-room.svg">
      <div class="children-rate-price-landing__label">
        <span>
          Select a room and rate plan to get started
        </span>
      </div>
    </div>
  `;
}
