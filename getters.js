function hasRatePriceSetup(roomId, rateId) {
  const rates = state[roomId].rates;
  return Object.keys(rates).filter(rateId => rates[rateId].is_rate_set).length;
}

function isAnyRoomRateSetup() {
  return roomsData().some(roomObject => roomObject.is_rate_set);
}

function hasPropertyWidePricing() {
	return state[9].is_rate_set;
}

function roomsData() {
	return Object.values(state).filter(roomObject => roomObject.id !== 9); // I've stored property-wide pricing in roomObject with id 9, I don't need it
}

function editedRoomsData() {
	return Object.values(editState).filter(roomObject => roomObject.id !== 9); // I've stored property-wide pricing in roomObject with id 9, I don't need it
}

function hasChildrenRateSetup() {
	return isAnyRoomRateSetup() || hasPropertyWidePricing();
}

function hasModifiedRoomRatePricing() {
	if (!isAnyRoomRateSetup()) {
		return false;
	}

	if (!hasPropertyWidePricing()) {
		return true;
	}

	const propertyWidePricing = state[9].rates[9].prices;

	const roomsWithRatePricingDifferentFromPropertyWide = roomsData().filter(roomObject => {
		const ratesData = Object.values(roomObject.rates);
		return ratesData.some(rateObject => !_.isEqual(rateObject.prices, propertyWidePricing));
	});

	return roomsWithRatePricingDifferentFromPropertyWide.length > 0;
	// this will not work in some scenarios when changing back room rate pricing from different to equal to property-wide, but should be good for testing script
	// for example, when changing back from 50eur fixed price to free price
}



