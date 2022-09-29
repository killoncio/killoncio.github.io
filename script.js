document.addEventListener("DOMContentLoaded", () => {
  loadCPPOPage();
});

function loadFCRPage() {
  document.getElementById("main-content").innerHTML = getMainPage();
  document.getElementById("modal-age").innerHTML = getAgeSetup();
  renderMainColumn();
  attachSideColumnEvents();
  renderSideColumn(currentRoomId);
  // attachAgePreviewShow(); We are removing ageband form from FCR
  setAges = getDefaultSetAge();
  agesRange = getDefaultAgesRange();
  window.BUI.initComponents();

}

function renderMainColumn() {
  document.getElementById("right-content").innerHTML = getMainColumn(currentRoomId, currentRateId);
  attachFormEvents();
  $( "#exception-date-from" ).datepicker({
    onSelect: updateDateException,
  });
  $( "#exception-date-to" ).datepicker({
    onSelect: updateDateException,
  });
}

function renderSideColumn(roomId) {
  document.getElementById("room-list").innerHTML = getRoomList(
      roomId);
  window.BUI.initComponents();
}

function updatePreview(roomId, rateId) {
  let previewId = `rule-preview-${roomId}-${rateId}`;
  document.getElementById(previewId).innerHTML = getRulesPreview(roomId,
      rateId);
  attachSaveForm();
  attachPreviewBasePriceChange();
}

function attachFormEvents() {
  attachEditPrice();
  attachPriceChange();
  attachStayChange();
  attachSaveForm();
  attachPriceOrderRadio();
  $('.children-rate-pricing-preview__edit-button').on('click', showForm);
  $('.children-rate-pricing-preview__duplicate-button').on('click', startBulk);
  $('.children-rate-pricing-exceptions__add-new-button').on('click', onClickAddNewExceptionButton);
  $('.children-rate-pricing-exceptions__action-button--edit').on('click', editException);
  $('.children-rate-pricing-exceptions__action-button--remove').on('click', onClickRemoveExceptionButton);
  $('.children-rate-pricing-exceptions__action-button--pause').on('click', pauseException);
  $('.children-rate-pricing-exceptions__action-button--duplicate').on('click', startExceptionBulk);
  // $('.children-rate-pricing-exceptions-form__inputs').on('change', 'input', updateDateException);
  // $('.children-rate-pricing-exceptions__action-button--download').on('click', downloadExceptions)
}


function attachEditPrice() {
  $('.form-price-type').on('change', changePriceTypeEventListener);
}

function attachPriceChange() {
  $('.form-price').on('change', changePriceEventListener);
}

function attachStayChange() {
  $('.form-stay-type').on('change', changeStayEventListener);
}

function attachSaveForm() {
  $('.btn-save').on('click', saveFormEventListener);
}

function attachPriceOrderRadio() {
  $('.form__price-per-child-radio-button').on('click', priceOrderRadioListener);
}

function attachPreviewBasePriceChange() {
  $('#input-base-price').on('change', changeBasePriceChange);
}

function attachAgeSetupChange() {
  $('.age-select').on('change', ageChangeListener);
}

function attachSaveAge() {
  $('#btn-save-age').on('click', btnSaveAgeClickListener);
  $('#btn-close-age').on('click', closeAgeModal);
}

function attachSideColumnEvents() {
  $('#room-list').on('click', '.room-list__item', onClickRate);
  $('#room-list').on('click', '.bui-accordion__row', renderMainColumn);
}

function attachAgePreviewShow() {
  $('#age-preview-banner__change').on('click', showAgeSetupListener);
}

function detachtFCRPageEvents() {
  $('.form-price').off('change', changePriceEventListener);
  $('.form-stay-type').off('change', changeStayEventListener);
  $('.btn-save').off('click', saveFormEventListener);;
  $('.form__price-per-child-radio-button').off('click', priceOrderRadioListener);
  $('.form-price-type').off('change', changePriceTypeEventListener);
  $('.children-rate-pricing-preview__edit-button').off('click', showForm);
  $('.children-rate-pricing-preview__duplicate-button').off('click', startBulk);
  $('.children-rate-pricing-exceptions__add-new-button').off('click', onClickAddNewExceptionButton);
  $('.children-rate-pricing-exceptions__action-button--edit').off('click', editException);
  $('.children-rate-pricing-exceptions__action-button--remove').off('click', onClickRemoveExceptionButton);
  $('.children-rate-pricing-exceptions__action-button--pause').off('click', pauseException);
  $('.children-rate-pricing-exceptions__action-button--duplicate').off('click', startExceptionBulk);
  $('#input-base-price').off('change', changeBasePriceChange);
  $('.age-select').off('change', ageChangeListener);
  $('#btn-save-age').off('click', btnSaveAgeClickListener);
  $('#btn-close-age').off('click', closeAgeModal);
  $('#room-list').off('click', '.room-list__item', onClickRate);
  $('#room-list').off('click', '.bui-accordion__row', renderMainColumn);
  $('#age-preview-banner__change').off('click', showAgeSetupListener);
}

function showAgeSetupListener(e) {
  openAgeModal()
}

function openModal() {
  const modalInstance = window.BUI.createInstance('Modal', null, {
    id: "modal-default",
  });
  modalInstance.open();
}

let modalInstance;

function openAgeModal() {
  modalInstance = window.BUI.createInstance('Modal', null, {
    id: "modal-age",
  });
  setAges = getDefaultSetAge();
  agesRange = getDefaultAgesRange();
  modalInstance.open();
  document.getElementById("age-setup__container").innerHTML = ageSetupContent();
  attachAgeSetupChange();
  attachSaveAge();
}

function closeAgeModal() {
  modalInstance.close();
  attachAgePreviewShow();
  setAges = getDefaultSetAge();
  agesRange = getDefaultAgesRange();
}

function copySetAgesToAgeGroup() {
  for (let age in setAges) {
    ageGroups[age - 1].from_age = setAges[age].min;
    ageGroups[age - 1].to_age = setAges[age].max;
  }
}

function changePriceTypeEventListener(e) {
  let target = e.target;
  //Based on value modify elements
  let rateId = target.dataset.rate;
  let roomId = target.dataset.room;
  let ageId = target.dataset.age;
  let order = target.dataset.order;
  let formId = `rule-form-${roomId}-${rateId}`;
  let priceType = target.value;

  const perDateForm = $(target).closest('.children-rate-per-date-form');

  if (perDateForm.length) {
    const index = perDateForm.data('exception-index');
    const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
    // todo: reuse this for the else block
    const key = 'price_type';

    setPriceToException({
      priceData,
      order,
      key,
      value: priceType,
    });
  } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].price_type = priceType;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.price_type = priceType;
    } else {
      editState[roomId].rates[rateId].prices[ageId].price_type = priceType;
    }
  }

  renderMainColumn();
  updatePreview(roomId, rateId);
}

function changePriceEventListener(e) {
  let target = e.target;
  let rateId = target.dataset.rate;
  let roomId = target.dataset.room;
  let ageId = target.dataset.age;
  let order = target.dataset.order;
  let price = target.value;
  const perDateForm = $(target).closest('.children-rate-per-date-form');

  if (perDateForm.length) {
    const index = perDateForm.data('exception-index');
    const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
    const key = 'price';

    setPriceToException({
      priceData,
      order,
      key,
      value: price,
    });
  } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].price = price;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.price = price;
    } else {
      editState[roomId].rates[rateId].prices[ageId].price = price;
    }
  }

  renderMainColumn();
  updatePreview(roomId, rateId);
}

function changeStayEventListener(e) {
  let target = e.target;
  let rateId = target.dataset.rate;
  let roomId = target.dataset.room;
  let ageId = target.dataset.age;
  let order = target.dataset.order;
  let stayType = target.value;
  const perDateForm = $(target).closest('.children-rate-per-date-form');

  if (perDateForm.length) {
    const index = perDateForm.data('exception-index');
    const priceData = editState[roomId].rates[rateId].exceptions[index].prices[ageId];
    const key = 'stay_type';

    setPriceToException({
      priceData,
      order,
      key,
      value: stayType,
    });

  } else {
    if (order != null && order > 0) {
      editState[roomId].rates[rateId].prices[ageId].order_price[order].stay_type = stayType;
    } else if (order == -1) {
      editState[roomId].rates[rateId].prices[ageId].extra_child.stay_type = stayType;
    } else {
      editState[roomId].rates[rateId].prices[ageId].stay_type = stayType;
    }
  }

  renderMainColumn();
  updatePreview(roomId, rateId);
}

function priceOrderRadioListener(e) {
  if (e.target.name.startsWith("radio-inline")) {
    let value = e.target.value;
    let rateId = e.target.dataset.rate;
    let roomId = e.target.dataset.room;
    let ageId = e.target.dataset.age;
    e.target.checked = true;
    const perDateForm = $(e.target).closest('.children-rate-per-date-form');

    if (perDateForm.length) {
      const index = perDateForm.data('exception-index');

      setException({
        roomId,
        rateId,
        ageId,
        index,
        key: 'order_select',
        value: value == 0 ? false : true,
      });

      //todo: why also modifies state?
    } else {
      if (value == 0) {
        state[roomId].rates[rateId].prices[ageId].order_select = false;
        editState[roomId].rates[rateId].prices[ageId].order_select = false;
      } else {
        state[roomId].rates[rateId].prices[ageId].order_select = true;
        editState[roomId].rates[rateId].prices[ageId].order_select = true;
      }
    }

    let formId = `rule-form-${roomId}-${rateId}`;
    renderMainColumn();
    updatePreview(roomId, rateId);
  }
}

function changeBasePriceChange(e) {
  let value = e.target.value;
  let roomId = e.target.dataset.room;
  let rateId = e.target.dataset.rate;
  basePrice = value;
  let previewId = `rule-preview-${roomId}-${rateId}`;
  document.getElementById(previewId).innerHTML = getRulesPreview(roomId,
      rateId);
  attachSaveForm();
}

function areAllAgePricesSet(roomId, rateId) {
  const isEditMode = state[roomId].rates[rateId].isEditing;

  if (!isEditMode) {
    return true;
  }

  let hasAllAgesSet = true;
  let rate = editState[roomId].rates[rateId];
  Object.keys(rate.prices).forEach((ageId) => {
    let ageGroup = rate.prices[ageId];
    if (ageGroup.order_select) {
      Object.keys(ageGroup.order_price).forEach((order) => {
        let orderPrice = ageGroup.order_price[order];
        if (orderPrice.price_type.toString() == "-1" && ageGroup.extra_child.price_type == "-1") {
          hasAllAgesSet = false;
        }
      });
    } else {
      if (ageGroup.price_type.toString() == "-1") {
        hasAllAgesSet = false;
      }
    }
  });
  return hasAllAgesSet;
}

function onClickRate(e) {
  e.stopPropagation();
  setCurrentRoomId(this.dataset.roomId);
  setCurrentRateId(this.dataset.rateId);

  // document.querySelectorAll('#room-list .bui-is-active .bui-title__text').classList.remove('.active');


  if (!state[currentRoomId].rates[currentRateId].is_rate_set) {
    state[currentRoomId].rates[currentRateId].isEditing = true;
  }

  isPricingSaveSuccess = false;
  isExceptionSaveSuccess = false;
  isBulkUpdateSaveSuccess = false;
  renderMainColumn();
}

function saveFormEventListener(e) {
  let btn = e.target;
  let roomId = btn.dataset.room;
  let rateId = btn.dataset.rate;
  const perDateForm = $(e.target).closest('.children-rate-per-date-form');

  if (perDateForm.length) { //todo: check if this is necessary or not
    editState[roomId].is_exception_set = true;
    editState[roomId].rates[rateId].is_exception_set = true;
    isExceptionSaveSuccess = true;
  } else {
    editState[roomId].is_rate_set = true;
    editState[roomId].rates[rateId].is_rate_set = true;
    isPricingSaveSuccess = true;
  }

  state = editState;
  state[roomId].rates[rateId].isEditingException = false;
  setIsEditingViewMode(roomId, rateId, false);
  //TODO also set childrenAndAllRooms;
  loadFCRPage();
}

function ageChangeListener(e) {
  let ageGroup = e.target.dataset.age;
  let mode = e.target.dataset.mode; //0 is from, 1 is to
  let value = e.target.value;

  if (value != undefined && value != null && value.length > 0) {
    value = parseInt(e.target.value);

    if (mode == 0) {
      setAges[ageGroup].min = value;
      setAges[ageGroup].is_min_set = true
      agesRange[ageGroup][1].min = value;
    } else {
      setAges[ageGroup].max = value;
      setAges[ageGroup].is_max_set = true
      agesRange[ageGroup][0].max = value;
      if ((parseInt(ageGroup) + 1) <= 3) {
        agesRange[parseInt(ageGroup) + 1][0].min = value;
        agesRange[parseInt(ageGroup) + 1][1].min = value;
      }
      if ((parseInt(ageGroup) + 2) <= 3) {
        agesRange[parseInt(ageGroup) + 2][0].min = value;
        agesRange[parseInt(ageGroup) + 2][1].min = value;
      }
    }
  }
  document.getElementById("age-setup__container").innerHTML = ageSetupContent();
  attachAgeSetupChange();
  attachSaveAge();
}

function showForm() {
  const button = $(this);
  const rateId = button.data('rate');
  const roomId = button.data('room');

  setIsEditingViewMode(roomId, rateId, true);

  renderMainColumn();
}

function onClickAddNewExceptionButton() {
  const button = $(this);
  const rateId = button.data('rate');
  const roomId = button.data('room');

  setNewException({roomId, rateId});

  setIsEditingExceptionView(roomId, rateId, true);

  renderMainColumn();
}


function btnSaveAgeClickListener(e) {
  copySetAgesToAgeGroup();
  closeAgeModal();
  loadFCRPage();
  setAges = getDefaultSetAge();
  agesRange = getDefaultAgesRange()

}

function editException(e) {
  const {exceptionIndex, room, rate} = $(e.target).closest('tr').data();

  setIsEditingExceptionView(room, rate, true);
  setCurrentExceptionIndex(exceptionIndex);

  renderMainColumn();
}

function startExceptionBulk(e) {
  const {exceptionIndex, room, rate} = $(e.target).closest('tr').data();

  setCurrentRoomId(room);
  setCurrentRateId(rate);
  setCurrentExceptionIndex(exceptionIndex);

  startPerDateBulk();
}


function onClickRemoveExceptionButton(e) {
  const {exceptionIndex, room, rate} = $(e.target).closest('tr').data();

  const modalInstance = window.BUI.createInstance('Modal', null, {
    id: "exceptions-remove-confirmation",
  });
  modalInstance.open();

 $('#exceptions-remove-confirmation__confirm').on('click', function() {
    removeException({exceptionIndex, room, rate});
  });
}

function removeException(data) {
  const {exceptionIndex, room, rate} = data;

  // todo: show modal to confirm before removing
  state[room].rates[rate].exceptions.splice(exceptionIndex);

  renderMainColumn();
}

function pauseException(e) {
  console.log(e);
}

function updateDateException(e) {
  const selectedFromDate = $( "#exception-date-from" ).datepicker( "getDate" );
  const selectedToDate = $( "#exception-date-to" ).datepicker( "getDate" );

  const date = {
    from: formatDate(selectedFromDate),
    to: formatDate(selectedToDate),
  };

  setDateException(date);

  document.querySelector('.children-rate-pricing-form__selected-dates').innerHTML = `${date.from} - ${date.to}`;
}

function formatDate(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// function downloadExceptions() {
//   const modalInstance = window.BUI.createInstance('Modal', null, {
//     id: "exceptions-downloaded-confirmation-modal",
//   });
//   modalInstance.open();
// }

function setCurrentRoomId(roomId) {
  currentRoomId = roomId;
}

function setCurrentRateId(rateId) {
  currentRateId = rateId;
}

function setCurrentExceptionIndex(exceptionIndex) {
  currentExceptionIndex = exceptionIndex;
}

function setIsEditingViewMode(roomId, rateId, isEditing) {
  state[roomId].rates[rateId].isEditing = isEditing;
}

function setIsEditingExceptionView(roomId, rateId, isEditing) {
  state[roomId].rates[rateId].isEditingException = isEditing;
}

// todo: should not be needed to pass roomId & rateId, use current instead
function setException({roomId, rateId, ageId, index, key, value}) {
  editState[roomId].rates[rateId].exceptions[index].prices[ageId][key] = value;
}

function setPriceToException({ priceData, order, key, value}) {
  if (order != null && order > 0) {
    // priceType input related to specific child (1st, 2nd)
    priceData.order_price[order][key] = value;
  } else if (order == -1) {
    // priceType input related to extra child
    priceData.extra_child[key] = value;
  } else {
    // priceType input related to all children
    priceData[key] = value;
  }
}

function setDateException(date) {
  editState[currentRoomId].rates[currentRateId].exceptions[currentExceptionIndex].date = date;
}

function setNewException({roomId, rateId}) {
  // new exception will render as saved rate by default
  const rate = editState[roomId].rates[rateId];

  const currentDate = new Date();


  if (rate.exceptions) {

    rate.exceptions[rate.exceptions.length] = {
      date:{
        from: formatDate(currentDate),
        to: formatDate(currentDate),
      },
      prices: _.cloneDeep(rate.prices),
    };
  } else {
    rate.exceptions = [{
      date:{
        from: formatDate(currentDate),
        to: formatDate(currentDate),
      },
      prices: _.cloneDeep(rate.prices),
    }];
  }

  setCurrentExceptionIndex(rate.exceptions.length - 1);
}