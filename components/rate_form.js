function getPriceOrderHeader(childOrder) {
  switch (childOrder.toString()) {
    case "0":
      return `Price`;
    case "1":
      return `Price for first child`;
    case "2":
      return `Price for second child`;
    case "3":
      return `Price for 3rd child`;
    case "-1":
      return `Price for every extra child`;
    default:
      return `Price for ${childOrder}th child`;
  }
}

function getSelectInputOption(isSelected, value, text) {
  if (isSelected) {
    return `<option value=${value} selected>${text}</option>`;
  } else {
    return `<option value=${value}>${text}</option>`;
  }
}

function getPriceInput(priceType, visibilityStyle, room, rate, priceId, ageId, order, priceData) {
  const price = order == 0 ? priceData.price
      : order == -1 ? priceData.extra_child.price: priceData.order_price[order].price;

  if (priceType.toString() == "1") {
    return ` <div class="bui-form__group form-group">
        <div class="bui-input__group bui-text-input__group bui-text-input__group--prepend" style="${visibilityStyle}">
          <div class="bui-input__addon">EUR</div>
          <input type="number" min="0" id=${priceId} class="bui-form__control form-price" value=${price} data-rate=${rate.id} data-room=${room.id} data-age=${ageId} data-order=${order} placeholder="Price"/>
        </div>
      </div>`;
  } else {
    return `
      <div class="bui-form__group">
        <div class="bui-input__group bui-text-input__group bui-text-input__group--append" style="${visibilityStyle}">
          <input max="100" type="number" id=${priceId} class="bui-form__control form-price percentage_input" value=${price} data-rate=${rate.id} data-room=${room.id} data-age=${ageId} data-order=${order} placeholder="Price" />
          <div class="bui-input__addon">% of room rate</div>
        </div>
      </div>
    `;
  }
}

//Assuming ageId is the index of the ageGroups const in constant.js
function priceInputsGroup(ageId, room, rate, order, price) {
  const priceTypeId = "price-type-" + ageId + "-" + rate.id + "-" + room.id + "-" + order;
  const priceId = "price-" + ageId + "-" + rate.id + "-" + room.id + "-" + order;
  const stayTypeId = "stay-type-" + ageId + "-" + rate.id + "-" + room.id + "-" + order;
  const priceType = order == 0
      ? price.price_type.toString()
      : order == -1 ? price.extra_child.price_type.toString(): price.order_price[order].price_type.toString();
  const stayType = order == 0
      ? price.stay_type.toString()
      : order == -1 ? price.extra_child.stay_type.toString() : price.order_price[order].stay_type.toString();
  const visibilityStyle = priceType == "-1" || priceType == "0" || priceType == "3" ? "visibility: hidden" : "visibility: visible";

  return `
    <label class="bui-form__label">${getPriceOrderHeader(order)}</label>
    <div class="bui-group bui-group--inline form-group__inline">
      <div class="bui-form__group form-group">
        <div class="bui-input-select">
          <select id=${priceTypeId} class="bui-form__control form-price-type" data-rate=${rate.id} data-room=${room.id} data-age=${ageId} data-order=${order}>
          <option value="-1" disabled selected>--Select--</option>
            ${getSelectInputOption(priceType == "0", 0, "Free")}
            ${getSelectInputOption(priceType == "1", 1, "Fixed")}
            ${getSelectInputOption(priceType == "2", 2, "Percentage")}
            ${getSelectInputOption(priceType == "3", 3, "Full adult price")}
          </select>
          <svg class="bui-input-select__icon" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.11519 11.3933C5.00642 11.3938 4.89862 11.3729 4.79794 11.3317C4.69727 11.2905 4.60572 11.2299 4.52853 11.1533L1.11519 7.73993C1.06607 7.69415 1.02667 7.63895 0.99934 7.57762C0.972012 7.51629 0.957317 7.45008 0.956133 7.38294C0.954948 7.31581 0.967298 7.24912 0.992445 7.18686C1.01759 7.1246 1.05502 7.06805 1.1025 7.02057C1.14998 6.97309 1.20654 6.93566 1.2688 6.91051C1.33105 6.88537 1.39774 6.87302 1.46488 6.8742C1.53201 6.87539 1.59822 6.89008 1.65955 6.91741C1.72089 6.94474 1.77609 6.98414 1.82186 7.03326L5.11519 10.3266L8.40853 7.03326C8.50331 6.94494 8.62867 6.89686 8.75821 6.89915C8.88774 6.90143 9.01133 6.95391 9.10294 7.04552C9.19455 7.13712 9.24702 7.26071 9.24931 7.39025C9.2516 7.51978 9.20351 7.64515 9.11519 7.73993L5.70186 11.1533C5.62467 11.2299 5.53312 11.2905 5.43244 11.3317C5.33177 11.3729 5.22396 11.3938 5.11519 11.3933V11.3933ZM9.11519 5.0866C9.20883 4.99285 9.26142 4.86576 9.26142 4.73326C9.26142 4.60076 9.20883 4.47368 9.11519 4.37993L5.70186 0.973262C5.62502 0.89586 5.53362 0.834429 5.43294 0.792507C5.33225 0.750586 5.22426 0.729004 5.11519 0.729004C5.00613 0.729004 4.89814 0.750586 4.79745 0.792507C4.69676 0.834429 4.60537 0.89586 4.52853 0.973262L1.11519 4.37993C1.02156 4.47368 0.968967 4.60076 0.968967 4.73326C0.968967 4.86576 1.02156 4.99285 1.11519 5.0866C1.16116 5.13377 1.2161 5.17126 1.27679 5.19686C1.33747 5.22245 1.40266 5.23564 1.46853 5.23564C1.53439 5.23564 1.59958 5.22245 1.66027 5.19686C1.72095 5.17126 1.7759 5.13377 1.82186 5.0866L5.11519 1.79993L8.40853 5.0866C8.45446 5.13364 8.50945 5.1709 8.57018 5.1961C8.63091 5.22131 8.69611 5.23395 8.76186 5.23326C8.82755 5.23357 8.89265 5.22076 8.95332 5.19557C9.014 5.17039 9.06903 5.13334 9.11519 5.0866V5.0866Z" fill="#494949"/>
          </svg>
        </div>
      </div>
      ${getPriceInput(priceType, visibilityStyle, room, rate, priceId, ageId, order, price)}
      <div class="bui-form__group form-group">
        <div class="bui-input-select"  style="${visibilityStyle}">
            <select id=${stayTypeId} class="bui-form__control form-stay-type" data-rate=${rate.id} data-room=${room.id} data-age=${ageId} data-order=${order}>
              ${getSelectInputOption(stayType == "0", 0, "per child, per night")}
              ${getSelectInputOption(stayType == "1", 1, "per child, per stay")}
            </select>
            <svg class="bui-input-select__icon" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.11519 11.3933C5.00642 11.3938 4.89862 11.3729 4.79794 11.3317C4.69727 11.2905 4.60572 11.2299 4.52853 11.1533L1.11519 7.73993C1.06607 7.69415 1.02667 7.63895 0.99934 7.57762C0.972012 7.51629 0.957317 7.45008 0.956133 7.38294C0.954948 7.31581 0.967298 7.24912 0.992445 7.18686C1.01759 7.1246 1.05502 7.06805 1.1025 7.02057C1.14998 6.97309 1.20654 6.93566 1.2688 6.91051C1.33105 6.88537 1.39774 6.87302 1.46488 6.8742C1.53201 6.87539 1.59822 6.89008 1.65955 6.91741C1.72089 6.94474 1.77609 6.98414 1.82186 7.03326L5.11519 10.3266L8.40853 7.03326C8.50331 6.94494 8.62867 6.89686 8.75821 6.89915C8.88774 6.90143 9.01133 6.95391 9.10294 7.04552C9.19455 7.13712 9.24702 7.26071 9.24931 7.39025C9.2516 7.51978 9.20351 7.64515 9.11519 7.73993L5.70186 11.1533C5.62467 11.2299 5.53312 11.2905 5.43244 11.3317C5.33177 11.3729 5.22396 11.3938 5.11519 11.3933V11.3933ZM9.11519 5.0866C9.20883 4.99285 9.26142 4.86576 9.26142 4.73326C9.26142 4.60076 9.20883 4.47368 9.11519 4.37993L5.70186 0.973262C5.62502 0.89586 5.53362 0.834429 5.43294 0.792507C5.33225 0.750586 5.22426 0.729004 5.11519 0.729004C5.00613 0.729004 4.89814 0.750586 4.79745 0.792507C4.69676 0.834429 4.60537 0.89586 4.52853 0.973262L1.11519 4.37993C1.02156 4.47368 0.968967 4.60076 0.968967 4.73326C0.968967 4.86576 1.02156 4.99285 1.11519 5.0866C1.16116 5.13377 1.2161 5.17126 1.27679 5.19686C1.33747 5.22245 1.40266 5.23564 1.46853 5.23564C1.53439 5.23564 1.59958 5.22245 1.66027 5.19686C1.72095 5.17126 1.7759 5.13377 1.82186 5.0866L5.11519 1.79993L8.40853 5.0866C8.45446 5.13364 8.50945 5.1709 8.57018 5.1961C8.63091 5.22131 8.69611 5.23395 8.76186 5.23326C8.82755 5.23357 8.89265 5.22076 8.95332 5.19557C9.014 5.17039 9.06903 5.13334 9.11519 5.0866V5.0866Z" fill="#494949"/>
            </svg>
        </div>
      </div>
    </div>
    <p class='${priceType == "2" ? "children-rate-price-selector__disclaimer" : "children-rate-price-selector__disclaimer  hide"}'>The percentage guests are charged will be based on the base occupancy</p>

  `
}

function getCheckedAttribute(isChecked) {
  if (isChecked) {
    return 'checked'
  } else {
    return '';
  }
}

function renderPriceInputs(ageId, room, rate, perDatePrices) {
  const currentRate = editState[room.id].rates[rate.id];
  const price = perDatePrices ? perDatePrices[ageId] : currentRate.prices[ageId];
  const value = price.order_select;

  // to select whether to apply price to all children or different to each child
  let perChildrenPriceModeInput = `
    <div class="bui-f-font-strong">${ageGroups[ageId].from_age} - ${ageGroups[ageId].to_age} years old</div>
      <div class="radio-inline-price bui-group" role="radiogroup">
        <div class="bui-form__group">
          <label class="bui-radio">
              <input class="bui-radio__input form__price-per-child-radio-button" type="radio" name="radio-inline-${ageId}-${room.id}-${rate.id}" data-rate=${rate.id} data-room=${room.id} data-age=${ageId} value="0" ${getCheckedAttribute(!value)} />
              <span class="bui-radio__label">All children in this age group are priced the same</span>
          </label>
        </div>
        <div class="bui-form__group">
          <label class="bui-radio">
              <input class="bui-radio__input form__price-per-child-radio-button" type="radio" name="radio-inline-${ageId}-${room.id}-${rate.id}" data-rate=${rate.id} data-room=${room.id} data-age=${ageId} value="1" ${getCheckedAttribute(value)} />
              <span class="bui-radio__label">Children in this age group are priced differently</span>
          </label>
        </div>
    </div>`;

  // if selected 'same price for all children' we only show one price input
  // if not, we show a price input for each 1st, 2nd and extra children
  let uiPriceForAllOrders = perChildrenPriceModeInput;
  let divider = `<hr class="bui-divider bui-divider--light" />`;
  if (value) { // if NOT selected 'same price for all children'
    let orders = price.order_price;
    for (let orderNumber in orders) {
      uiPriceForAllOrders += priceInputsGroup(ageId, room, rate, orderNumber, price); // input for 1st and 2nd child
    }
    uiPriceForAllOrders += priceInputsGroup(ageId, room, rate, -1, price) // input for extra child
  } else {
    uiPriceForAllOrders += priceInputsGroup(ageId, room, rate, 0, price); // just one input
  }
  uiPriceForAllOrders += divider;
  return uiPriceForAllOrders;
}

function getRateForm(roomId, rateId, isEditMode) {
  let room = editState[roomId];
  let rate = room.rates[rateId];
  let formId = `rule-form-${roomId}-${rateId}`;

  if (isEditMode) {
    return `
      <div class="accordion-content" id=${formId}>
      <div class="accordion-content__header bui-title--heading">
          <aside class="bui-banner bui-banner--small bui-banner--hint form-banner" data-bui-component="Banner">
            <div class="bui-banner__content">
              <svg class="banner__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 15C11.25 15.5967 11.487 16.1691 11.909 16.591C12.3309 17.013 12.9033 17.25 13.5 17.25H14.25C14.6642 17.25 15 16.9142 15 16.5C15 16.0858 14.6642 15.75 14.25 15.75H13.5C13.3011 15.75 13.1102 15.671 12.9696 15.5304C12.829 15.3898 12.75 15.1989 12.75 15V11.25C12.75 10.8521 12.5919 10.4705 12.3104 10.1892C12.0295 9.90809 11.6479 9.75 11.25 9.75H10.5C10.0858 9.75 9.75 10.0858 9.75 10.5C9.75 10.9142 10.0858 11.25 10.5 11.25H11.25V15Z" fill="#333333"/>
                <path d="M11.625 6C11.4024 6 11.1847 6.06603 10.9997 6.18983C10.8151 6.31305 10.6709 6.48874 10.5857 6.69432C10.5005 6.9006 10.4782 7.12662 10.5217 7.34478C10.5651 7.56277 10.6721 7.76304 10.8293 7.92029C10.987 8.0779 11.1874 8.18499 11.4055 8.22838C11.6238 8.27178 11.8501 8.24951 12.0557 8.1643C12.2611 8.07919 12.4368 7.935 12.5604 7.74997C12.684 7.56498 12.75 7.34749 12.75 7.125C12.75 6.82667 12.6315 6.54056 12.4206 6.32959C12.2093 6.11846 11.9233 6 11.625 6Z" fill="#333333"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37259 24 0 18.6274 0 12C0 5.37259 5.37259 0 12 0C18.6274 0 24 5.37259 24 12ZM1.5 12C1.5 17.799 6.20101 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12Z" fill="#333333"/>
              </svg>
              <p class="bui-banner__text rate-banner-text">
                  This pricing setup will only be applied to guests booking the <b>${room.name}</b> with the <b>${rate.name}</b> rate plan.
              </p>
            </div>
          </aside>
      </div>
      <div class="children-rate-pricing-age-band bui-spacer">
        ${renderPriceInputs(0, room, rate)}
      </div>
      <div class="children-rate-pricing-age-band bui-spacer">
        ${renderPriceInputs(1, room, rate)}
      </div>
      <div class="children-rate-pricing-age-band bui-spacer">
        ${renderPriceInputs(2, room, rate)}
      </div>
      </div>
    `;
  }

  return '';
}