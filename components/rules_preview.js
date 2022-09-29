function getRulesPreview(roomId, rateId, isPerDateBlock) {
  // this function is called for per date exceptions preview in edit mode (not read mode) if isPerDateBlock is true, and for price preview both read/edit mode if isPerDateBlock is false
  const isEditMode = state[roomId].rates[rateId].isEditing;
  const currentRate = editState[roomId].rates[rateId];
  const prices = isPerDateBlock ? currentRate.exceptions[currentExceptionIndex].prices : currentRate.prices;

  if(areAllAgePricesSet(roomId, rateId)) {
    return `
      <div class="children-rate-pricing-preview">
        <div class="children-rate-pricing-preview__header">
          <span>
            ${isEditMode ? 'Preview your pricing set-up' : ''}
          </span>
        </div>
        <div class="children-rate-pricing-preview__info">
          <div class="bui-grid">
            ${ageGroups.map( (ageBand, ageBandIndex) => `
              <div class="bui-grid__column-4">
                <p class="children-rate-pricing-preview__age-band">
                  <span>${ageBand.from_age} – ${ageBand.to_age} years old</span>
                </p>
                ${rulePreview(ageBandIndex, prices[ageBandIndex], !isEditMode && !isPerDateBlock)}
              </div>
            `).join('')}
          </div>
        </div>
        <span class="children-rate-pricing-preview__disclaimer">
          <span>
            The last available room rate is used to calculate percentage-based prices. This preview doesn't include taxes, fees, or applied discounts.
          </span>
        </span>
      </div>
    `;
  } else {
    return `
      <div class="children-rate-pricing-preview">
        <div class="children-rate-pricing-preview__header">
          <p>
            Preview your pricing set-up
          </p>
        </div>
        <div class="bui-banner bui-banner--small bui-banner--hint">
          <span class="bui-banner__icon">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false" class="bk-icon -streamline-info_sign"><path d="M14.25 15.75h-.75a.75.75 0 0 1-.75-.75v-3.75a1.5 1.5 0 0 0-1.5-1.5h-.75a.75.75 0 0 0 0 1.5h.75V15a2.25 2.25 0 0 0 2.25 2.25h.75a.75.75 0 0 0 0-1.5zM11.625 6a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25.75.75 0 0 0 0 1.5.375.375 0 1 1 0-.75.375.375 0 0 1 0 .75.75.75 0 0 0 0-1.5zM22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm1.5 0c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"></path></svg>
          </span>
          <div class="bui-banner__content">
            <p class="bui-banner__text">
              Finish setting rates for all age groups to see your preview
            </p>
          </div>
          <button type="button" data-test-id="close" class="bui-banner__close">
            <svg role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 12l6.26-6.26a.73.73 0 0 0-1-1L12 11 5.74 4.71a.73.73 0 1 0-1 1L11 12l-6.29 6.26a.73.73 0 0 0 .52 1.24.73.73 0 0 0 .51-.21L12 13l6.26 6.26a.74.74 0 0 0 1 0 .74.74 0 0 0 0-1z"></path></svg>
          </button>
        </div>
      </div>
    `
  }
}
