//mode = 0 for from_age, mode = 1 for to_age
function getAgeOptions(ageGroup, mode) {
  let setAge = -1;
  if (mode == 0 && setAges[ageGroup].is_min_set) {
    setAge = setAges[ageGroup].min;
  } else if (mode == 1 && setAges[ageGroup].is_max_set) {
    setAge = setAges[ageGroup].max;
  } else if (mode == 0) {
    setAge = ageGroups[ageGroup - 1].from_age;
  } else if (mode == 1) {
    setAge = ageGroups[ageGroup -1].to_age;
  }
  let allOptions = ``;
  if (setAge > -1) {
    allOptions += `<option value disabled>--select--</option>`;
  } else {
    allOptions = `<option value disabled selected>--select--</option>`;
  }
  let ageRange = agesRange[ageGroup][mode];
  for (let i = ageRange.min; i <= ageRange.max; i++) {
    if (i == setAge) {
      allOptions += `
    <option value=${i} selected>${i}</option>
    `;
    } else {
      allOptions += `
    <option value=${i}>${i}</option>
    `;
    }
  }
  ;
  return allOptions;
}

function getAgeGroupUi(ageGroup) {
  let selectFromId = `age-select-${ageGroup}-0`;
  let selectToId = `age-select-${ageGroup}-1`;
  return `
  <div class="age-setup__age-group">
  <br>
   <label class="bui-f-font-strong">Age group ${ageGroup}</label>
    <div class="bui-group bui-group--inline form-group__inline">
    <span class="bui-f-font-caption age-label">From</span>
     <div class="bui-input-select">
        <select id=${selectFromId} class="bui-form__control age-select" data-age=${ageGroup} data-mode=0 >
            ${getAgeOptions(ageGroup, 0)}
        </select>
        <svg class="bui-input-select__icon" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.11519 11.3933C5.00642 11.3938 4.89862 11.3729 4.79794 11.3317C4.69727 11.2905 4.60572 11.2299 4.52853 11.1533L1.11519 7.73993C1.06607 7.69415 1.02667 7.63895 0.99934 7.57762C0.972012 7.51629 0.957317 7.45008 0.956133 7.38294C0.954948 7.31581 0.967298 7.24912 0.992445 7.18686C1.01759 7.1246 1.05502 7.06805 1.1025 7.02057C1.14998 6.97309 1.20654 6.93566 1.2688 6.91051C1.33105 6.88537 1.39774 6.87302 1.46488 6.8742C1.53201 6.87539 1.59822 6.89008 1.65955 6.91741C1.72089 6.94474 1.77609 6.98414 1.82186 7.03326L5.11519 10.3266L8.40853 7.03326C8.50331 6.94494 8.62867 6.89686 8.75821 6.89915C8.88774 6.90143 9.01133 6.95391 9.10294 7.04552C9.19455 7.13712 9.24702 7.26071 9.24931 7.39025C9.2516 7.51978 9.20351 7.64515 9.11519 7.73993L5.70186 11.1533C5.62467 11.2299 5.53312 11.2905 5.43244 11.3317C5.33177 11.3729 5.22396 11.3938 5.11519 11.3933V11.3933ZM9.11519 5.0866C9.20883 4.99285 9.26142 4.86576 9.26142 4.73326C9.26142 4.60076 9.20883 4.47368 9.11519 4.37993L5.70186 0.973262C5.62502 0.89586 5.53362 0.834429 5.43294 0.792507C5.33225 0.750586 5.22426 0.729004 5.11519 0.729004C5.00613 0.729004 4.89814 0.750586 4.79745 0.792507C4.69676 0.834429 4.60537 0.89586 4.52853 0.973262L1.11519 4.37993C1.02156 4.47368 0.968967 4.60076 0.968967 4.73326C0.968967 4.86576 1.02156 4.99285 1.11519 5.0866C1.16116 5.13377 1.2161 5.17126 1.27679 5.19686C1.33747 5.22245 1.40266 5.23564 1.46853 5.23564C1.53439 5.23564 1.59958 5.22245 1.66027 5.19686C1.72095 5.17126 1.7759 5.13377 1.82186 5.0866L5.11519 1.79993L8.40853 5.0866C8.45446 5.13364 8.50945 5.1709 8.57018 5.1961C8.63091 5.22131 8.69611 5.23395 8.76186 5.23326C8.82755 5.23357 8.89265 5.22076 8.95332 5.19557C9.014 5.17039 9.06903 5.13334 9.11519 5.0866V5.0866Z" fill="#494949"/>
        </svg>
    </div>
    <span class="bui-f-font-caption age-label">upto and including</span>
    <div class="bui-input-select">
        <select id=${selectToId} class="bui-form__control age-select" data-age=${ageGroup} data-mode=1 >
           ${getAgeOptions(ageGroup, 1)}
        </select>
        <svg class="bui-input-select__icon" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.11519 11.3933C5.00642 11.3938 4.89862 11.3729 4.79794 11.3317C4.69727 11.2905 4.60572 11.2299 4.52853 11.1533L1.11519 7.73993C1.06607 7.69415 1.02667 7.63895 0.99934 7.57762C0.972012 7.51629 0.957317 7.45008 0.956133 7.38294C0.954948 7.31581 0.967298 7.24912 0.992445 7.18686C1.01759 7.1246 1.05502 7.06805 1.1025 7.02057C1.14998 6.97309 1.20654 6.93566 1.2688 6.91051C1.33105 6.88537 1.39774 6.87302 1.46488 6.8742C1.53201 6.87539 1.59822 6.89008 1.65955 6.91741C1.72089 6.94474 1.77609 6.98414 1.82186 7.03326L5.11519 10.3266L8.40853 7.03326C8.50331 6.94494 8.62867 6.89686 8.75821 6.89915C8.88774 6.90143 9.01133 6.95391 9.10294 7.04552C9.19455 7.13712 9.24702 7.26071 9.24931 7.39025C9.2516 7.51978 9.20351 7.64515 9.11519 7.73993L5.70186 11.1533C5.62467 11.2299 5.53312 11.2905 5.43244 11.3317C5.33177 11.3729 5.22396 11.3938 5.11519 11.3933V11.3933ZM9.11519 5.0866C9.20883 4.99285 9.26142 4.86576 9.26142 4.73326C9.26142 4.60076 9.20883 4.47368 9.11519 4.37993L5.70186 0.973262C5.62502 0.89586 5.53362 0.834429 5.43294 0.792507C5.33225 0.750586 5.22426 0.729004 5.11519 0.729004C5.00613 0.729004 4.89814 0.750586 4.79745 0.792507C4.69676 0.834429 4.60537 0.89586 4.52853 0.973262L1.11519 4.37993C1.02156 4.47368 0.968967 4.60076 0.968967 4.73326C0.968967 4.86576 1.02156 4.99285 1.11519 5.0866C1.16116 5.13377 1.2161 5.17126 1.27679 5.19686C1.33747 5.22245 1.40266 5.23564 1.46853 5.23564C1.53439 5.23564 1.59958 5.22245 1.66027 5.19686C1.72095 5.17126 1.7759 5.13377 1.82186 5.0866L5.11519 1.79993L8.40853 5.0866C8.45446 5.13364 8.50945 5.1709 8.57018 5.1961C8.63091 5.22131 8.69611 5.23395 8.76186 5.23326C8.82755 5.23357 8.89265 5.22076 8.95332 5.19557C9.014 5.17039 9.06903 5.13334 9.11519 5.0866V5.0866Z" fill="#494949"/>
        </svg>
    </div>
    </div>
  </div>
  `;
}

function hasAnyAgeBandChanged() {
  return Object.keys(setAges).some(ageBand => setAges[ageBand].is_min_set || setAges[ageBand].is_max_set);
}

function getAgeGroupPreview(ageGroup) {
  if( setAges[ageGroup].is_min_set || setAges[ageGroup].is_max_set ){
    return `
      <p class="bui-card__text children-rate-age-preview__content">
        <div>Any rates set for children between ${ageGroups[ageGroup - 1].from_age} and ${ageGroups[ageGroup - 1].to_age} will now apply to ${setAges[ageGroup].min} – ${setAges[ageGroup].max}</div></p>
      </p>
    `;
  }

  return '';
}

function getAgePreview() {
  if (hasAnyAgeBandChanged()) {
    return `
      <div aria-label="A11y description for card" class="bui-u-bleed@small">
        <div>
          <header class="bui-card__header bui-title--heading">
            <h3 class="bui-title__text">Preview changes</h3>
          </header>
        </div>
      </div>
      <div class="children-rate-age-preview__card bui-card">
        <div class="bui-card__content">
          ${getAgeGroupPreview(1)}
          ${getAgeGroupPreview(2)}
          ${getAgeGroupPreview(3)}
        </div>
      </div>
    `;
  } else {
    return ``;
  }
}

function ageSetupContent() {
  return `
    <header data-test-id="header" class="bui-modal__header">
      <h1 class="bui-modal__title">Manage your age groups</h1>
      <p class="bui-modal__paragraph">Your children age groups apply to your entire property and determine how you set child rates. You must create at least 1 age group to begin setting flexible child rates, with a maximum of 3 age groups.</p>
    </header>
    <div class="bui-modal__body">
      ${getAgeGroupUi(1)}
      ${getAgeGroupUi(2)}
      ${getAgeGroupUi(3)}
      ${getAgePreview()}
    </div>
    <div class="bui-modal__footer">
      <div class="bui-group bui-group--inline preview-btn-container">
        <button id="btn-save-age" class="bui-button bui-button--primary btn-save" type="button" ${hasAnyAgeBandChanged() ? '' : 'disabled'}>
          <span class="bui-button__text">Save Changes</span>
        </button>
        <button id="btn-close-age" class="bui-button bui-button--secondary btn-cancel" type="button" data-bui-ref="modal-close">
          <span class="bui-button__text">Cancel</span>
        </button>
      </div>
    </div>
  `;
}

function getAgeSetup() {
  return `
    <div id="age-setup__container">
      ${ageSetupContent()}
    </div>
  `;
}