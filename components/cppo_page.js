// only block id="child-supplement-pricing-block" is properly built
// rest of elements is just a copy-paste from page for testing purposes, to mock up the UI, but has no JS associated

function showChildPricingForm(roomId,rateId) {
  state[roomId].rates[rateId].isEditing = true;
  document.getElementById('child-supplement-pricing-block__form').innerHTML = renderChildPricingForm(roomId, rateId);
  $('.radio-inline-price').hide(); // hack: we are reusing same form than FCR, but not showing per_child radio buttons
  // attachChildPricingFormEvents();
  updateActionButtons();
}

function renderChildPricingForm(roomId,rateId) {
  const room = editState[roomId];
  const rate = room.rates[rateId];

  return `
    <p>How do you want to set your property-wide rates?</p>
    <div class="children-rate-pricing-age-band bui-spacer">
      ${renderPriceInputs(0, room, rate)}
    </div>
    <div class="children-rate-pricing-age-band bui-spacer">
      ${renderPriceInputs(1, room, rate)}
    </div>
    <div class="children-rate-pricing-age-band bui-spacer">
      ${renderPriceInputs(2, room, rate)}
    </div>
    ${getPreview(roomId, rateId)}
  `;
}

function deleteDefaultPricing() {
  console.log('removed');
}

function saveChildPricingForm() {
  const rateId = 9;
  const roomId = 9;

  state[roomId].rates[rateId].isEditing = false;
  showDefaultRatesSavedSuccessMessage();
  updateAllRoomRatesPricing(); // when setting up default pricing, all room rates will get that pricing
  document.getElementById('child-supplement-pricing-block__form').innerHTML = renderChildPricingFormSummary();
  document.getElementById('cppo__navigation-bar').innerHTML = renderNavigationBar();
  document.getElementById('cppo__children-rates-overview-sentence').innerText = 'You have property-wide children rates set.';
  updateActionButtons();

  window.scrollTo({
    top: 0,
    // behavior: 'smooth',
  });
}

function renderChildPricingFormSummary() {
  const rateId = 9;
  const roomId = 9;

  let message = '';

  if (hasPropertyWidePricing()) {
    message = `<div class="bui-spacer"><p><strong>Your property-wide rates:</strong></p>${getPreview(roomId, rateId)}</div>`;
  } else if (hasModifiedRoomRatePricing()) {
    message = `<div><p><strong>Your property-wide rates:</strong></p><p>Since you do not have setup property-wide rates yet, any room types and rest plans without custom rates will price children as an adult.</p></div>`;
  }

  return `
    ${message}
    ${getPropertyWideActionButtons()}
    ${getLinkToFCR()}
  `
}

function getPropertyWideActionButtons() {
  const rateId = 9;
  const roomId = 9;

  return `
    <button type="button" class="bui-button bui-button--secondary" onclick="showChildPricingForm(${roomId},${rateId})">${hasPropertyWidePricing() ? 'Edit' : 'Create property-wide rates'}</button>
    ${hasPropertyWidePricing() ? `<button type="button" class="bui-button bui-button--secondary cppo__delete-button" onclick="deleteDefaultPricing">Delete</button>` : ''}
  `
}

function getLinkToFCR() {
  let message = `<p><a id="navigate-to-FCR" href="#" class="bui-link bui-link--primary cppo__link-to-fcr" onclick="renderFCRPage(); return false;">Manage custom rates per specific room type, rate plan, and date</a></p>`;

  if (hasModifiedRoomRatePricing()) {
    message = `<p><strong>Your custom rates:</strong></p><p>You have customized some rates based on specific room type, rate plan or date to be different than your property-wide rates, <a id="navigate-to-FCR" href="#" class="bui-link bui-link--primary" onclick="renderFCRPage(); return false;">you can manage them here.</a></p>`;
  } else if (hasPropertyWidePricing()) {
    message = `<p><strong>Your custom rates:</strong></p><p>You don't have any customised yet. <a id="navigate-to-FCR" href="#" class="bui-link bui-link--primary cppo__link-to-fcr" onclick="renderFCRPage(); return false;">Manage custom rates per specific room type, rate plan, and date</a></p>`;
  }


  return message;
}

function loadCPPOPage() {
  detachtFCRPageEvents();
  renderCPPOPage();
  attachCPPOPageEvents()
}

function renderFCRPage() {
  detachCPPOPageEvents();
  loadFCRPage();
}

function renderCPPOPage() {
  document.getElementById("main-content").innerHTML = getCPPOPage();
  document.getElementById('cppo__navigation-bar').innerHTML = renderNavigationBar();
}

function attachCPPOPageEvents() {
  $('body')
    .on('change', '.form-price-type', onCPPOeditPriceType)
    .on('change', '.form-price', onCPPOeditPrice)
    .on('change', '.form-stay-type', onCPPOeditStayType);
}

function detachCPPOPageEvents() {
  $('body')
    .off('change', '.form-price-type', onCPPOeditPriceType)
    .off('change', '.form-price', onCPPOeditPrice)
    .off('change', '.form-stay-type', onCPPOeditStayType);
}

function onCPPOeditPriceType(e) {
  const target = e.target;
  // let rateId = target.dataset.rate;
  // let roomId = target.dataset.room;
  const rateId = 9;
  const roomId = 9;
  const ageId = target.dataset.age;
  const order = target.dataset.order;
  const formId = `rule-form-${roomId}-${rateId}`;
  const priceType = target.value;

  // const perDateForm = $(target).closest('.children-rate-per-date-form');

  // if (perDateForm.length) {
  //   const index = perDateForm.data('exception-index');
  //   const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
  //   // todo: reuse this for the else block
  //   const key = 'price_type';

  //   setPriceToException({
  //     priceData,
  //     order,
  //     key,
  //     value: priceType,
  //   });
  // } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].price_type = priceType;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.price_type = priceType;
    } else {
      editState[roomId].rates[rateId].prices[ageId].price_type = priceType;
    }
  // }

  showChildPricingForm(rateId, roomId);
  updateActionButtons();
}

function onCPPOeditPrice(e) {
  const target = e.target;
  // let rateId = target.dataset.rate;
  // let roomId = target.dataset.room;
  const rateId = 9;
  const roomId = 9;
  const ageId = target.dataset.age;
  const order = target.dataset.order;
  const price = target.value;
  // const perDateForm = $(target).closest('.children-rate-per-date-form');

  // if (perDateForm.length) {
  //   const index = perDateForm.data('exception-index');
  //   const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
  //   const key = 'price';

  //   setPriceToException({
  //     priceData,
  //     order,
  //     key,
  //     value: price,
  //   });
  // } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].price = price;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.price = price;
    } else {
      editState[roomId].rates[rateId].prices[ageId].price = price;
    }
  // }

  showChildPricingForm(rateId, roomId);
  updateActionButtons();
}

function onCPPOeditStayType(e) {
  const target = e.target;
  // let rateId = target.dataset.rate;
  // let roomId = target.dataset.room;
  const rateId = 9;
  const roomId = 9;
  const ageId = target.dataset.age;
  const order = target.dataset.order;
  const stayType = target.value;
  // const perDateForm = $(target).closest('.children-rate-per-date-form');

  // if (perDateForm.length) {
  //   const index = perDateForm.data('exception-index');
  //   const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
  //   const key = 'stay_type';

  //   setPriceToException({
  //     priceData,
  //     order,
  //     key,
  //     value: stayType,
  //   });

  // } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].stay_type = stayType;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.stay_type = stayType;
    } else {
      editState[roomId].rates[rateId].prices[ageId].stay_type = stayType;
    }
  // }

  showChildPricingForm(rateId, roomId);
  updateActionButtons();
}

function showDefaultRatesSavedSuccessMessage() {
  document.getElementById('default-rates__feedback-message').classList.remove('hide');
}

function updateAllRoomRatesPricing() {
  const rateId = 9;
  const roomId = 9;

  const prices = state[roomId].rates[rateId].prices;

  Object.values(state).forEach(roomObject => {
    roomObject.is_rate_set = true;
    let rates = Object.values(roomObject.rates);
    rates.forEach( rateObject => {
      rateObject.is_rate_set = true;
      rateObject.prices = _.cloneDeep(prices);
    });
  });
}

function renderNavigationBar() {
  return `
    <ol class="bui-nav-progress bui-nav-progress--horizontal" data-v-4bf1b72e=""><div style="display: contents;">
      <li class="bui-nav-progress__item bui-nav-progress__item--active">
        <span class="bui-nav-progress__indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="41" height="32" viewBox="0 0 41 32" class="bui-nav-progress__icon"><path d="M34.7 0l5.9 5.8L14.3 32 0 17.8 5.9 12l8.4 8.3L34.7 0z" class="bui-f-fill-white"></path></svg>
        </span> <strong class="bui-nav-progress__title">
          Set children policies
          </strong> <!----> <span data-test-id="progress-step" class="bui-nav-progress__step">
            Step 1 of 3
          </span>
      </li> 
      <li role="presentation" data-test-id="progress-divider" class="bui-nav-progress__divider"></li></div> <div style="display: contents;">
      <li class="bui-nav-progress__item bui-nav-progress__item--active' : 'bui-nav-progress__item--disabled' }">
        <span class="bui-nav-progress__indicator">
          ${hasChildrenRateSetup() ? '<svg xmlns="http://www.w3.org/2000/svg" width="41" height="32" viewBox="0 0 41 32" class="bui-nav-progress__icon"><path d="M34.7 0l5.9 5.8L14.3 32 0 17.8 5.9 12l8.4 8.3L34.7 0z" class="bui-f-fill-white"></path></svg>' : 2}
        </span> <strong class="bui-nav-progress__title">
          Set children rates
          </strong> <!----> <span data-test-id="progress-step" class="bui-nav-progress__step">
            Step 2 of 3
          </span></li> 
      <li role="presentation" data-test-id="progress-divider" class="bui-nav-progress__divider"></li></div> <div style="display: contents;">
      <li class="bui-nav-progress__item ${hasChildrenRateSetup() ? 'bui-nav-progress__item--active' : 'bui-nav-progress__item--disabled'}"><span class="bui-nav-progress__indicator">
              3
            </span> <strong class="bui-nav-progress__title">
          Set children occupancy
          </strong> <!----> <span data-test-id="progress-step" class="bui-nav-progress__step">
            Step 3 of 3
          </span></li> <!----></div>
    </ol>
  `;
}

function showOptionBForm() {
  $('.cppo__children-rates-block-optionB-form').removeClass('hide');
}

function hideOptionBForm() {
  $('.cppo__children-rates-block-optionB-form').addClass('hide');
}

function renderChildrenRatesBlock() {
  const roomId = 9;
  const rateId = 9;
  const room = editState[roomId];
  const rate = room.rates[rateId];
  const isPropertyWidePricingSet = state[roomId].rates[rateId].is_rate_set;
  const isOptionB = window.location.hash === '#option';

  if (isOptionB) {
    state[roomId].rates[rateId].isEditing = true;

    return `
      <div id="child-supplement-pricing-block" class="bui-card bui-spacer">
        <div class="bui-card__content">
          <header class="bui-card__header">
            <h1 class="bui-card__title">
              Children rates
            </h1>
          </header>
          <p><strong>What is your children rates strategy?</strong></p>
          <div role="group" class="bui-group">
            <div class="bui-form__group"><label class="bui-radio">
              <input id="attribute_1'" autocomplete="off" type="radio" name="attribute" class="bui-radio__input" value="false" onclick="showOptionBForm()"> 
              <span class="bui-radio__label">
                  Property-wide rates
              </span>
              </label>
              <p class="cppo__children-rates-block-options">A default rate automatically applied to all new and existing room types and rate plans</p>
            </div> 
            <div class="bui-form__group"><label class="bui-radio">
              <input id="attribute_1" autocomplete="off" type="radio" name="attribute" class="bui-radio__input" value="0" onclick="hideOptionBForm()"> <span class="bui-radio__label">
                  Custom rates
                </span></label>
              <p class="cppo__children-rates-block-options">Special rates for particular room types, rate plans or dates</p>
            </div> 
            <div class="bui-form__group"><label class="bui-radio">
              <input id="attribute_2" autocomplete="off" type="radio" name="attribute" class="bui-radio__input" value="5" onclick="hideOptionBForm()"> <span class="bui-radio__label">
                  Both property-wide rates and custom rates
                </span></label>
              <p class="cppo__children-rates-block-options">A default rate for all new and existing rooms as well as custom rates for specific room types, rate plans or date</p>
            </div> 
          </div>
          <div class="cppo__children-rates-block-optionB-form hide">
            <hr class="bui-divider cppo__children-rates-block-optionB-form-divider" data-v-4bf1b72e=""> 
            <div class="children-rate-pricing-age-band bui-spacer">
              ${renderPriceInputs(0, room, rate)}
            </div>
            <div class="children-rate-pricing-age-band bui-spacer">
              ${renderPriceInputs(1, room, rate)}
            </div>
            <div class="children-rate-pricing-age-band bui-spacer">
              ${renderPriceInputs(2, room, rate)}
            </div>
            ${getPreview(roomId, rateId)}
          </div>
          </div>
      </div>
    `;    
  }


  return `
    <div id="child-supplement-pricing-block" class="bui-card bui-spacer">
      <div class="bui-card__content">
        <header class="bui-card__header">
          <h1 class="bui-card__title">
            Children rates
          </h1>
        </header>
        <p>Create a property-wide rate (automatically applied to all new and existing room types and rate plans) and custom rates for specific room types, rate plans or dates.</p>
        <div id="child-supplement-pricing-block__form">
          ${renderChildPricingFormSummary()} 
        </div>
      </div>
    </div>
  `;
}

function updateActionButtons() {
  document.getElementById('cppo__action-buttons').innerHTML = renderActionButtons();
}

function renderActionButtons() {
  const roomId = 9;
  const rateId = 9;
  const isPropertyWidePricingSet = state[roomId].rates[rateId].is_rate_set;
  const isEditingState = state[roomId].rates[rateId].isEditing;

  return `
    <div class="bui-spacer--larger">
      <div role="group" class="bui-group bui-group--inline">
        <button type="button" class="bui-button bui-button--primary" onclick="saveChildPricingForm()" ${isEditingState && areAllAgePricesSet(9,9) ? '' : 'disabled'}>
          <span class="bui-button__text">
            Save
          </span>
        </button>
        <a href="#" class="bui-button bui-button--secondary"><!----> <span class="bui-button__text"><span>Cancel </span></span></a>
      </div>
    </div>
  `;
}


function getCPPOPage() {
  const roomId = 9;
  const rateId = 9;
  const isPropertyWidePricingSet = state[roomId].rates[rateId].is_rate_set;

  return `
    <div id="default-rates__feedback-message" class="bui-spacer--large hide" style="margin-top: 20px;">
      <div role="status" class="bui-alert bui-alert--success">
        <span role="presentation" class="icon--hint bui-alert__icon">
          <svg data-test-id="default-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path d="M56.62 93.54a4 4 0 0 1-2.83-1.18L28.4 67a4 4 0 1 1 5.65-5.65l22.13 22.1 33-44a4 4 0 1 1 6.4 4.8L59.82 91.94a4.06 4.06 0 0 1-2.92 1.59zM128 64c0-35.346-28.654-64-64-64C28.654 0 0 28.654 0 64c0 35.346 28.654 64 64 64 35.33-.039 63.961-28.67 64-64zm-8 0c0 30.928-25.072 56-56 56S8 94.928 8 64 33.072 8 64 8c30.914.033 55.967 25.086 56 56z"></path></svg>
        </span>
        <div class="bui-alert__description">
          <p class="bui-alert__text">
            Changes to your property-wide children rates are succcessful.
          </p>
        </div>
      </div>
    </div>

    <div class="bui-page-header bui-spacer--larger">
      <h1 class="bui-page-header__title">
        Children policies, rates and occupancy
       </h1>
      <p>Increase family bookings by setting up children policies, rates, and pricing occupancy.</p>
    </div>
    <div id="cppo__navigation-bar"></div>
    <div class="bui-card bui-spacer">
      <div class="bui-card__content">
        <h2>Policies</h2>
        <h3>Overview</h3>
        <ul class="cppo__policies-overview bui-spacer">
          <li>Children are allowed</li>
          <li>There is no minimum age</li>
          <li>You have defined 3 age groups:</li>
          <ul class="cppo__policies-overview">
            <li>0-2 years old</li>
            <li>3-12 years old</li>
            <li>13-17 years old</li>
          </ul>
        </ul>
        <button type="button" class="bui-button bui-button--secondary">Edit</button>
      </div>
    </div>

    ${renderChildrenRatesBlock()}

    <div id="pricing-occupancy-block" class="bui-card bui-spacer">
      <div class="bui-card__content"><header class="bui-card__header"><h1 class="bui-card__title"><span>Occupancy and children rate distribution</span></h1></header> <div><!----> <div role="group" class="pricing-occupancy-question bui-group" style="color: #bdbdbd;"><span>Do all children in the reservation pay the children rate? </span> <div name="price-all-children-as-children" data-test-id="price-all-children-as-children-yes" class="bui-form__group"><label class="bui-radio"><input id="price-all-children-as-children-yes" autocomplete="off" type="radio" name="price-all-children-as-children" data-test-id="price-all-children-as-children-yes" value="true" class="bui-radio__input" disabled checked="checked"> <span class="bui-radio__label"><span>Yes, all children pay the children rate</span></span></label> <!----></div> <div name="price-all-children-as-children" data-test-id="price-all-children-as-children-no" class="bui-form__group"><label class="bui-radio"><input id="price-all-children-as-children-no" autocomplete="off" type="radio" name="price-all-children-as-children" data-test-id="price-all-children-as-children-no" class="bui-radio__input" value="false" disabled> <span class="bui-radio__label"><span>No, some children pay the adult rate</span></span></label> <!----></div></div> <p><span>How many people can stay in these rooms?</span></p> 

      <div class="pricing-occupancy-table__wrapper"><table class="bui-table"><thead class="bui-table__head"><tr class="bui-table__row"><th class="bui-table__cell bui-table__cell--head"><span>Room name</span></th> <th class="bui-table__cell bui-table__cell--head"><div class="pricing-occupancy-table__tooltip">
  Max total guests
  <svg viewBox="0 0 24 24" focusable="false" fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" slot="icon" class="bk-icon -streamline-question_mark_circle"><path d="M9.75 9a2.25 2.25 0 1 1 3 2.122 2.25 2.25 0 0 0-1.5 2.122v1.006a.75.75 0 0 0 1.5 0v-1.006c0-.318.2-.602.5-.708A3.75 3.75 0 1 0 8.25 9a.75.75 0 1 0 1.5 0zM12 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg> </div></th> <th class="bui-table__cell bui-table__cell--head"><div class="pricing-occupancy-table__tooltip">
  Max adults
  <svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true" fill="currentColor" role="presentation" slot="icon" class="bk-icon -streamline-question_mark_circle"><path d="M9.75 9a2.25 2.25 0 1 1 3 2.122 2.25 2.25 0 0 0-1.5 2.122v1.006a.75.75 0 0 0 1.5 0v-1.006c0-.318.2-.602.5-.708A3.75 3.75 0 1 0 8.25 9a.75.75 0 1 0 1.5 0zM12 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg> </div></th> <th class="bui-table__cell bui-table__cell--head"><div class="pricing-occupancy-table__tooltip">
  Max children
  <svg aria-hidden="true" height="16" width="16" role="presentation" fill="currentColor" focusable="false" viewBox="0 0 24 24" slot="icon" class="bk-icon -streamline-question_mark_circle"><path d="M9.75 9a2.25 2.25 0 1 1 3 2.122 2.25 2.25 0 0 0-1.5 2.122v1.006a.75.75 0 0 0 1.5 0v-1.006c0-.318.2-.602.5-.708A3.75 3.75 0 1 0 8.25 9a.75.75 0 1 0 1.5 0zM12 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg> </div></th> <th class="bui-table__cell bui-table__cell--head"><div class="pricing-occupancy-table__tooltip pricing-occupancy-table__tooltip--disabled">
  Max that pay children rate
  <svg focusable="false" viewBox="0 0 24 24" role="presentation" fill="currentColor" aria-hidden="true" width="16" height="16" slot="icon" class="bk-icon -streamline-question_mark_circle"><path d="M9.75 9a2.25 2.25 0 1 1 3 2.122 2.25 2.25 0 0 0-1.5 2.122v1.006a.75.75 0 0 0 1.5 0v-1.006c0-.318.2-.602.5-.708A3.75 3.75 0 1 0 8.25 9a.75.75 0 1 0 1.5 0zM12 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg> </div></th></tr></thead> <tbody class="bui-table__body"><tr data-test-id="pricing-table-row" class="bui-table__row"><th scope="row" class="bui-table__cell bui-table__cell--row-head"><a href="/hotel/hoteladmin/extranet_ng/manage/rooms.html?hotel_id=2074766&amp;ses=bc0bba80c8e7c0518f2faf95aa02a1f3&amp;lang=xu#edit-207476601-occupancy" class="bui-link bui-link--primary">
      Single Room
    </a></th> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxOccupancy" style="display:none;"></label> <div class="bui-input-select"><select id="maxOccupancy" class="bui-form__control"><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option value="4">
        4
      </option><option value="5">
        5
      </option><option value="6">
        6
      </option><option value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option value="10">
        10
      </option><option selected="selected" value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td data-test-id="max-adults-table-cell" class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxAdults" style="display:none;"></label> <div class="bui-input-select"><select id="maxAdults" class="bui-form__control"><option value="1">
          1
        </option><option value="2">
          2
        </option><option value="3">
          3
        </option><option value="4">
          4
        </option><option value="5">
          5
        </option><option value="6">
          6
        </option><option value="7">
          7
        </option><option value="8">
          8
        </option><option value="9">
          9
        </option><option value="10">
          10
        </option><option selected="selected" value="11">
          11
        </option><option value="12">
          12
        </option><option value="13">
          13
        </option><option value="14">
          14
        </option><option value="15">
          15
        </option><option value="16">
          16
        </option><option value="17">
          17
        </option><option value="18">
          18
        </option><option value="19">
          19
        </option><option value="20">
          20
        </option><option value="21">
          21
        </option><option value="22">
          22
        </option><option value="23">
          23
        </option><option value="24">
          24
        </option><option value="25">
          25
        </option><option value="26">
          26
        </option><option value="27">
          27
        </option><option value="28">
          28
        </option><option value="29">
          29
        </option><option value="30">
          30
        </option><option value="31">
          31
        </option><option value="32">
          32
        </option><option value="33">
          33
        </option><option value="34">
          34
        </option><option value="35">
          35
        </option><option value="36">
          36
        </option><option value="37">
          37
        </option><option value="38">
          38
        </option><option value="39">
          39
        </option><option value="40">
          40
        </option><option value="41">
          41
        </option><option value="42">
          42
        </option><option value="43">
          43
        </option><option value="44">
          44
        </option><option value="45">
          45
        </option><option value="46">
          46
        </option><option value="47">
          47
        </option><option value="48">
          48
        </option><option value="49">
          49
        </option><option value="50">
          50
        </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxChildrenPhysical" style="display:none;"></label> <div class="bui-input-select"><select id="maxChildrenPhysical" class="bui-form__control"><option value="0">
        0
      </option><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option value="4">
        4
      </option><option value="5">
        5
      </option><option value="6">
        6
      </option><option value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option selected="selected" value="10">
        10
      </option><option value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="bui-stepper pricing-occupancy-table-row__stepper"><div class="bui-stepper__title-wrapper"><label for="childrenPricedAsChildren" class="bui-stepper__title"></label> <!----></div> <div class="bui-stepper__wrapper"><input id="childrenPricedAsChildren" disabled="disabled" autocomplete="off" step="1" type="range" value="0" class="bui-stepper__input"> <button type="button" disabled="disabled" data-test-id="subtract-button" aria-hidden="true" class="bui-stepper__subtract-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      -
    </span></button> <span data-test-id="display" aria-hidden="true" class="bui-stepper__display"><span>0 children</span></span> <button type="button" disabled="disabled" data-test-id="add-button" aria-hidden="true" class="bui-stepper__add-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      +
    </span></button></div></div></td></tr><tr data-test-id="pricing-table-row" class="bui-table__row"><th scope="row" class="bui-table__cell bui-table__cell--row-head"><a href="/hotel/hoteladmin/extranet_ng/manage/rooms.html?hotel_id=2074766&amp;ses=bc0bba80c8e7c0518f2faf95aa02a1f3&amp;lang=xu#edit-207476602-occupancy" class="bui-link bui-link--primary">
      Junior Suite
    </a></th> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxOccupancy" style="display:none;"></label> <div class="bui-input-select"><select id="maxOccupancy" class="bui-form__control"><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option value="4">
        4
      </option><option selected="selected" value="5">
        5
      </option><option value="6">
        6
      </option><option value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option value="10">
        10
      </option><option value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td data-test-id="max-adults-table-cell" class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxAdults" style="display:none;"></label> <div class="bui-input-select"><select id="maxAdults" class="bui-form__control"><option value="1">
          1
        </option><option value="2">
          2
        </option><option value="3">
          3
        </option><option value="4">
          4
        </option><option selected="selected" value="5">
          5
        </option><option value="6">
          6
        </option><option value="7">
          7
        </option><option value="8">
          8
        </option><option value="9">
          9
        </option><option value="10">
          10
        </option><option value="11">
          11
        </option><option value="12">
          12
        </option><option value="13">
          13
        </option><option value="14">
          14
        </option><option value="15">
          15
        </option><option value="16">
          16
        </option><option value="17">
          17
        </option><option value="18">
          18
        </option><option value="19">
          19
        </option><option value="20">
          20
        </option><option value="21">
          21
        </option><option value="22">
          22
        </option><option value="23">
          23
        </option><option value="24">
          24
        </option><option value="25">
          25
        </option><option value="26">
          26
        </option><option value="27">
          27
        </option><option value="28">
          28
        </option><option value="29">
          29
        </option><option value="30">
          30
        </option><option value="31">
          31
        </option><option value="32">
          32
        </option><option value="33">
          33
        </option><option value="34">
          34
        </option><option value="35">
          35
        </option><option value="36">
          36
        </option><option value="37">
          37
        </option><option value="38">
          38
        </option><option value="39">
          39
        </option><option value="40">
          40
        </option><option value="41">
          41
        </option><option value="42">
          42
        </option><option value="43">
          43
        </option><option value="44">
          44
        </option><option value="45">
          45
        </option><option value="46">
          46
        </option><option value="47">
          47
        </option><option value="48">
          48
        </option><option value="49">
          49
        </option><option value="50">
          50
        </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxChildrenPhysical" style="display:none;"></label> <div class="bui-input-select"><select id="maxChildrenPhysical" class="bui-form__control"><option value="0">
        0
      </option><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option selected="selected" value="4">
        4
      </option><option value="5">
        5
      </option><option value="6">
        6
      </option><option value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option value="10">
        10
      </option><option value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="bui-stepper pricing-occupancy-table-row__stepper"><div class="bui-stepper__title-wrapper"><label for="childrenPricedAsChildren" class="bui-stepper__title"></label> <!----></div> <div class="bui-stepper__wrapper"><input id="childrenPricedAsChildren" disabled="disabled" autocomplete="off" step="1" type="range" value="0" class="bui-stepper__input"> <button type="button" disabled="disabled" data-test-id="subtract-button" aria-hidden="true" class="bui-stepper__subtract-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      -
    </span></button> <span data-test-id="display" aria-hidden="true" class="bui-stepper__display"><span>0 children</span></span> <button type="button" disabled="disabled" data-test-id="add-button" aria-hidden="true" class="bui-stepper__add-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      +
    </span></button></div></div></td></tr><tr data-test-id="pricing-table-row" class="bui-table__row"><th scope="row" class="bui-table__cell bui-table__cell--row-head"><a href="/hotel/hoteladmin/extranet_ng/manage/rooms.html?hotel_id=2074766&amp;ses=bc0bba80c8e7c0518f2faf95aa02a1f3&amp;lang=xu#edit-207476603-occupancy" class="bui-link bui-link--primary">
      Deluxe Suite
    </a></th> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxOccupancy" style="display:none;"></label> <div class="bui-input-select"><select id="maxOccupancy" class="bui-form__control"><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option value="4">
        4
      </option><option value="5">
        5
      </option><option value="6">
        6
      </option><option selected="selected" value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option value="10">
        10
      </option><option value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td data-test-id="max-adults-table-cell" class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxAdults" style="display:none;"></label> <div class="bui-input-select"><select id="maxAdults" class="bui-form__control"><option value="1">
          1
        </option><option value="2">
          2
        </option><option value="3">
          3
        </option><option value="4">
          4
        </option><option value="5">
          5
        </option><option value="6">
          6
        </option><option selected="selected" value="7">
          7
        </option><option value="8">
          8
        </option><option value="9">
          9
        </option><option value="10">
          10
        </option><option value="11">
          11
        </option><option value="12">
          12
        </option><option value="13">
          13
        </option><option value="14">
          14
        </option><option value="15">
          15
        </option><option value="16">
          16
        </option><option value="17">
          17
        </option><option value="18">
          18
        </option><option value="19">
          19
        </option><option value="20">
          20
        </option><option value="21">
          21
        </option><option value="22">
          22
        </option><option value="23">
          23
        </option><option value="24">
          24
        </option><option value="25">
          25
        </option><option value="26">
          26
        </option><option value="27">
          27
        </option><option value="28">
          28
        </option><option value="29">
          29
        </option><option value="30">
          30
        </option><option value="31">
          31
        </option><option value="32">
          32
        </option><option value="33">
          33
        </option><option value="34">
          34
        </option><option value="35">
          35
        </option><option value="36">
          36
        </option><option value="37">
          37
        </option><option value="38">
          38
        </option><option value="39">
          39
        </option><option value="40">
          40
        </option><option value="41">
          41
        </option><option value="42">
          42
        </option><option value="43">
          43
        </option><option value="44">
          44
        </option><option value="45">
          45
        </option><option value="46">
          46
        </option><option value="47">
          47
        </option><option value="48">
          48
        </option><option value="49">
          49
        </option><option value="50">
          50
        </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="child-policies-input--narrow bui-form__group"><label for="maxChildrenPhysical" style="display:none;"></label> <div class="bui-input-select"><select id="maxChildrenPhysical" class="bui-form__control"><option value="0">
        0
      </option><option value="1">
        1
      </option><option value="2">
        2
      </option><option value="3">
        3
      </option><option value="4">
        4
      </option><option value="5">
        5
      </option><option selected="selected" value="6">
        6
      </option><option value="7">
        7
      </option><option value="8">
        8
      </option><option value="9">
        9
      </option><option value="10">
        10
      </option><option value="11">
        11
      </option><option value="12">
        12
      </option><option value="13">
        13
      </option><option value="14">
        14
      </option><option value="15">
        15
      </option><option value="16">
        16
      </option><option value="17">
        17
      </option><option value="18">
        18
      </option><option value="19">
        19
      </option><option value="20">
        20
      </option><option value="21">
        21
      </option><option value="22">
        22
      </option><option value="23">
        23
      </option><option value="24">
        24
      </option><option value="25">
        25
      </option><option value="26">
        26
      </option><option value="27">
        27
      </option><option value="28">
        28
      </option><option value="29">
        29
      </option><option value="30">
        30
      </option><option value="31">
        31
      </option><option value="32">
        32
      </option><option value="33">
        33
      </option><option value="34">
        34
      </option><option value="35">
        35
      </option><option value="36">
        36
      </option><option value="37">
        37
      </option><option value="38">
        38
      </option><option value="39">
        39
      </option><option value="40">
        40
      </option><option value="41">
        41
      </option><option value="42">
        42
      </option><option value="43">
        43
      </option><option value="44">
        44
      </option><option value="45">
        45
      </option><option value="46">
        46
      </option><option value="47">
        47
      </option><option value="48">
        48
      </option><option value="49">
        49
      </option><option value="50">
        50
      </option></select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></td> <td class="bui-table__cell"><div class="bui-stepper pricing-occupancy-table-row__stepper"><div class="bui-stepper__title-wrapper"><label for="childrenPricedAsChildren" class="bui-stepper__title"></label> <!----></div> <div class="bui-stepper__wrapper"><input id="childrenPricedAsChildren" disabled="disabled" autocomplete="off" step="1" type="range" value="0" class="bui-stepper__input"> <button type="button" disabled="disabled" data-test-id="subtract-button" aria-hidden="true" class="bui-stepper__subtract-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      -
    </span></button> <span data-test-id="display" aria-hidden="true" class="bui-stepper__display"><span>0 children</span></span> <button type="button" disabled="disabled" data-test-id="add-button" aria-hidden="true" class="bui-stepper__add-button bui-button bui-button--secondary"><!----> <span class="bui-button__text">
      +
    </span></button></div></div></td></tr>
    </tbody></table>
    </div>
    </div>
    </div>
    </div>

    <div class="bui-card bui-spacer"> <div class="bui-card__content"><header class="bui-card__header"><h1 class="bui-card__title"><span>Preview of your policies</span></h1></header> <h3><span>Property-wide</span></h3> <div class="child-policies-preview">
      <p class="child-policies-preview__title"><strong>Children</strong></p> 
      <div class="policy-group-preview"><div class="bui-spacer--large"><!----> <ul class="policy-group-preview__list bui-list bui-list--unordered"><li class="bui-list__item"><div>
      Children of all ages are allowed.
      </div></li></ul></div></div> <!----></div> 
      <div class="child-policies-preview bui-spacer">
        <p class="child-policies-preview__title"><strong>Children rates</strong></p>
        <ul class="bui-list bui-list--unordered">
          <li class="bui-list__item" id="cppo__children-rates-overview-sentence">${isPropertyWidePricingSet ? 'You have property-wide children rates set.' : 'You have no child rates set' }</li>
         </ul>
      </div> 
      <div editable="true" class="child-policies-preview__room">
        <hr class="bui-divider">
        <h3><span>Room-specific</span></h3>
        <div class="bui-container"><div class="bui-grid"><div class="bui-grid__column-4"><div class="child-policies-preview"><div data-test-id="room-occupancy-with-children-pricing-preview-select" class="bui-form__group"><label for="roomPreview"><span>Select a room to see the settings</span></label> <div class="bui-input-select"><select id="roomPreview" data-test-id="room-occupancy-with-children-pricing-preview-select" class="bui-form__control"> <option selected="selected" value="4840204">
                  Single Room
                </option><option value="4840205">
                  Junior Suite
                </option><option value="4840206">
                  Deluxe Suite
                </option>
              </select> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="bui-input-select__icon"><path d="M12 20.09a1.24 1.24 0 0 1-.88-.36L6 14.61a.75.75 0 1 1 1.06-1.06L12 18.49l4.94-4.94A.75.75 0 0 1 18 14.61l-5.12 5.12a1.24 1.24 0 0 1-.88.36zm6-9.46a.75.75 0 0 0 0-1.06l-5.12-5.11a1.24 1.24 0 0 0-1.754-.006l-.006.006L6 9.57a.75.75 0 0 0 0 1.06.74.74 0 0 0 1.06 0L12 5.7l4.94 4.93a.73.73 0 0 0 .53.22c.2 0 .39-.078.53-.22z"></path></svg></div> <!----></div></div></div> <div class="bui-grid__column-8"><p><strong>Occupancy and children rate settings for Single Room</strong></p> <p data-test-id="room-occupancy-with-children-pricing-preview">
              This room can fit 1 guest. No children are allowed.
            </p>
           </div>
          </div>
      <p class="child-policies-caption child-policies-preview-disclaimer">Disclaimer: The exact wording of your policies might be displayed differently to potential guests.</p>

        </div>

      </div> 
        </div>
    </div>

    <div id="cppo__action-buttons">
      ${renderActionButtons()}
    </div>
  `;
}