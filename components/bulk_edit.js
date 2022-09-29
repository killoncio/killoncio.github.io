function startPerDateBulk() {
	isPerDateBulkOpen = true;
	startBulk();
}

function startBulk(isPerDateBulk) {
  modalInstance = window.BUI.createInstance('Modal', null, {
    id: "bulk-edit",
    'onAfterClose': onBulkModalClose,
  });
  modalInstance.open();
  attachBulkModalEvents();
  renderBulkNextStep(attachBulkModalEvents);
}

function attachBulkModalEvents() {
  $('body')
  	.on('click', '.bulk-edit__room-input', updateBulkRoomsSelected)
  	.on('click', '.bulk-edit__rate-input', updateBulkRatesSelected)
  	.on('click', '#bulk-edit__continue', renderBulkNextStep)
  	.on('click', '.bulk-edit__all-input', toggleAllRoomRatesToBulkSelection);
}

function detachBulkModalEvents() {
  $('body')
  	.off('click', '.bulk-edit__room-input', updateBulkRoomsSelected)
  	.off('click', '.bulk-edit__rate-input', updateBulkRatesSelected)
  	.off('click', '#bulk-edit__continue', renderBulkNextStep)
  	.off('click', '.bulk-edit__all-input', toggleAllRoomRatesToBulkSelection);
}

function renderBulkNextStep() {
	bulkCurrentStep += 1;

	if (bulkCurrentStep < 4) {
		renderBulkStep(bulkCurrentStep);
	} else {
		applyBulkToRoomRatesSelected();
		state = editState;
		modalInstance.close();
		isBulkUpdateSaveSuccess = true;
		isPricingSaveSuccess = false;
		isExceptionSaveSuccess = false;
		isPerDateBulkOpen = false;
		loadFCRPage();
	}
}

function onBulkModalClose() {
	bulkCurrentStep = 0;
	bulkAllRoomRatesSelected = 0;
	setBulkFlagInAllRoomRates(false);
	detachBulkModalEvents();
}

function setBulkFlagInAllRoomRates(isSelected) {
	Object.values(editState).forEach(roomObject => {
		roomObject.isSelectedToApplyBulk = isSelected;

	    let rates = Object.values(roomObject.rates);
	    rates.forEach( rateObject => {
	      rateObject.isSelectedToApplyBulk = isSelected;
	    });
	});
}

function applyBulkToRoomRatesSelected() {
  const currentRate = editState[currentRoomId].rates[currentRateId];
  const pricingToDuplicate = isPerDateBulkOpen ? _.cloneDeep(currentRate.exceptions[currentExceptionIndex]) : _.cloneDeep(currentRate.prices);

  if (isPerDateBulkOpen) {
		Object.values(editState).forEach(roomObject => {
			// if the room has been selected, all rates with pricing setup will get current exception pricing
			if (roomObject.isSelectedToApplyBulk) {
				Object.values(roomObject.rates)
		    		.filter(rateObject => rateObject.is_rate_set) // only rate with pricing will get exception pricing copied into it
		    		.forEach(rateObject => {
			    		if (!rateObject.exceptions) {
			    			rateObject.exceptions = [];
			    		}
	    				rateObject.exceptions.push(pricingToDuplicate); // this will just push exception in array, will not solve overlapping with existing ones
	    			});
			} else if ( hasAnyRateSelectedToApplyBulk(roomObject) ) { // if any specific rate has been selected, only that will get current pricing
				Object.values(roomObject.rates)
					.filter(rateObject => rateObject.isSelectedToApplyBulk && rateObject.is_rate_set)
					.forEach(rateObject => {
			    		if (!rateObject.exceptions) {
			    			rateObject.exceptions = [];
			    		}
						rateObject.exceptions.push(pricingToDuplicate);
					});
			}
		});
  } else {
		Object.values(editState).forEach(roomObject => {
			// if the room has been selected, all rates will get current pricing
			if (roomObject.isSelectedToApplyBulk) {
				roomObject.is_rate_set = true;
			    Object.values(roomObject.rates).forEach( rateObject => {
			      rateObject.is_rate_set = true;
			      rateObject.prices = pricingToDuplicate;
			    });
			} else if ( hasAnyRateSelectedToApplyBulk(roomObject) ) { // if any specific rate has been selected, only that will get current pricing
				roomObject.is_rate_set = true;
				Object.values(roomObject.rates)
					.filter(rateObject => rateObject.isSelectedToApplyBulk)
					.forEach(rateObject => {
						rateObject.is_rate_set = true;
						rateObject.prices = pricingToDuplicate;
					});
			}
		});
	}
}

function updateBulkRoomsSelected() {
	const roomIsChecked = this.checked;
	const roomId = this.dataset.roomId;
	editState[roomId].isSelectedToApplyBulk = roomIsChecked;
	Object.values(editState[roomId].rates).forEach( rateObject => rateObject.isSelectedToApplyBulk = roomIsChecked );

	renderBulkStep(2);
}

function updateBulkRatesSelected() {
	const rateIsChecked = this.checked;
	const roomId = this.dataset.roomId;
	const rateId = this.dataset.rateId;

	editState[roomId].rates[rateId].isSelectedToApplyBulk = rateIsChecked;

	renderBulkStep(2);
}

function toggleAllRoomRatesToBulkSelection() {
	const isChecked = this.checked;
	bulkAllRoomRatesSelected = isChecked;

	setBulkFlagInAllRoomRates(isChecked);

	renderBulkStep(2);
}

function renderBulkStep(stepNumber) {
	document.getElementById('bulk__room-rate-summary').innerHTML = getBulkStepUI(stepNumber);
	document.getElementById('bulk-edit__continue').innerHTML = getContinueButton(stepNumber);
}

function getContinueButton(stepNumber) {
	return `
	    <button class="bui-button bui-button--primary" type="button" ${stepNumber === 2 && !getListOfRoomRatesToBulkUpdate().length ? "disabled" : ""}>
	      <span class="bui-button__text">${stepNumber === 3 ? 'Apply changes' : 'Continue'}</span>
	    </button>
	`;
}

function getBulkStepUI(stepNumber) {
	const isPerDateBlock = isPerDateBulkOpen;

	if (stepNumber === 2) {
		return getListOfRoomRates();
	}

	if (stepNumber === 3) {
		return `
			${isPerDateBulkOpen ? `<span>By clicking apply, you will apply this pricing exception for the selected dates to the following room-rates:</span>` : `<span>By clicking apply, you will apply this children rate:</span>`}
			<div class="bui-spacer--medium">
				${getRulesPreview(currentRoomId, currentRateId)}
			</div>
			<hr class="bui-divider" data-v-4bf1b72e="">
			<p>To the following room-rates:</p>
			${renderRoomRatesToBulkUpdate()}
			<hr class="bui-divider" data-v-4bf1b72e="">
			<div role="status" class="bui-alert bui-alert--info">
				<span role="presentation" class="icon--hint bui-alert__icon">
					<svg data-test-id="default-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.25 15.75h-.75a.75.75 0 0 1-.75-.75v-3.75a1.5 1.5 0 0 0-1.5-1.5h-.75a.75.75 0 0 0 0 1.5h.75V15a2.25 2.25 0 0 0 2.25 2.25h.75a.75.75 0 0 0 0-1.5zM11.625 6a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg>
				</span>
				<div class="bui-alert__description">
					<span class="bui-alert__title">Before you apply changes:</span>
					<ul class="bulk-edit-modal__info-list">
						<li>Regardless of any existing restrictions, prices or policies, all of your selected properties will switch to this children rate.</li>
						<li>If you’re using percentage rates, this change will result in different prices based on the room rate of the respective rate plan.</li>
						<li>If you change your mind or want to undo your action later, simply duplicate your rates again.</li>
					</ul>
				</div>
			</div>
		`
	}

	return `
		${isPerDateBulkOpen ? `<p>You are going to duplicate the pricing for the selected date range:</p>` : ''}
		${getRulesPreview(currentRoomId, currentRateId, isPerDateBlock)}
	`
}

function renderRoomRatesToBulkUpdate() {
	return getListOfRoomRatesToBulkUpdate().map( roomRateObject => `
		<p><strong>${roomRateObject.roomName}</strong> - ${roomRateObject.rates.join(', ')}</p>
	`).join('');
}

function getListOfRatesToBulkUpdate(rates) {
	if (isPerDateBulkOpen) {
		return Object.values(rates)
			.filter( rateObject => rateObject.isSelectedToApplyBulk && rateObject.is_rate_set )
			.map( rateObject => rateObject.name );
	} else {
		return Object.values(rates)
			.filter( rateObject => rateObject.isSelectedToApplyBulk )
			.map( rateObject => rateObject.name );
	}
}

function getListOfRoomRatesToBulkUpdate() {
	const list = editedRoomsData()
		.filter(roomObject => {
			if ( hasAnyRateSelectedToApplyBulk(roomObject) ) {
				return true;
			}

			return false;
		})
		.map(roomObject => {
			return {
				roomName: roomObject.name,
				rates: getListOfRatesToBulkUpdate(roomObject.rates)
			};
		});

	return list;
}

// better to rename has selectedRatesToApplyBulk, which will perform a filter. Then, to know if has any rate selected, selectedRatesToApplyBulk().length
function hasAnyRateSelectedToApplyBulk(roomObject) {
	return Object.values(roomObject.rates).some(rateObject => rateObject.isSelectedToApplyBulk);
}

function getRatesToApplyBulk(roomObject) {
	if (isPerDateBulkOpen) {
		// per-date pricing cannot be applied to room-rate without pricing
		return Object.values(roomObject.rates).filter( rateObject => rateObject.is_rate_set);
	}

	return Object.values(roomObject.rates);
}

function getListOfRoomRates() {
	const roomsToApplyBulk = isPerDateBulkOpen ? editedRoomsData().filter( roomObject => roomObject.is_rate_set) : editedRoomsData();

	return `
		<div class="bui-form__group bui-spacer--large">
			<label class="bui-checkbox">
				<input autocomplete="off" type="checkbox" class="bui-checkbox__input bulk-edit__all-input" ${bulkAllRoomRatesSelected ? 'checked' : ''}>
				<span class="bui-checkbox__label">Select all rooms and rates plans</span>
			</label>
		</div>
		<hr class="bui-divider bui-spacer--large">
		<div role="group" class="bui-group">
			${roomsToApplyBulk.map(roomObject => `
				<div class="bui-form__group">
					<label class="bui-checkbox">
						<input autocomplete="off" type="checkbox" class="bui-checkbox__input bulk-edit__room-input" data-room-id="${roomObject.id}" ${roomObject.isSelectedToApplyBulk ? 'checked' : ''}>
						<span class="bui-checkbox__label">${roomObject.name}</span>
					</label>
				</div>
				${getRatesToApplyBulk(roomObject).map(rateObject => `
					<div class="bui-form__group bulk-edit__rate-name">
						<label class="bui-checkbox">
							<input autocomplete="off" type="checkbox" class="bui-checkbox__input bulk-edit__rate-input" data-room-id="${roomObject.id}" data-rate-id="${rateObject.id}" ${rateObject.isSelectedToApplyBulk || (roomObject.id == currentRoomId && rateObject.id == currentRateId) ? 'checked' : ''} ${roomObject.id == currentRoomId && rateObject.id == currentRateId ? 'disabled' : ''}>
							<span class="bui-checkbox__label">${rateObject.name}</span>
						</label>
					</div>
				`).join('')}
			`).join('')}
		</div>
	`
}