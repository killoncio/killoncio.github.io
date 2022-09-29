function getChildrenPolicyViewContent(){
  return `
    <div class="bui-banner__content">
      <h1 class="bui-banner__title">
        <span>Children age groups</span>
      </h1>
      <p class="bui-banner__text">
        <span>You have currently defined 3 children age groups for your entire property:</span>
      </p>
      <ul>
        <li class="children-rate-age__content">${ageGroups[0].from_age}-${ageGroups[0].to_age} years</li>
        <li class="children-rate-age__content">${ageGroups[1].from_age}-${ageGroups[1].to_age} years</li>
        <li class="children-rate-age__content">${ageGroups[2].from_age}-${ageGroups[2].to_age} years</li>
      </ul>
      <button class="bui-button bui-button--secondary" type="button" id="age-preview-banner__change">
        <span class="bui-button__text">Change age groups</span>
      </button>
    </div>
  `;

}
function getChildrenPolicyView() {
    // we are moving ageband form from FCR to CPPO. I'll not implement yet it in CCPO.
    return '';

    return `
     <div id="age-preview-banner" class="bui-banner age-preview-banner">
        ${getChildrenPolicyViewContent()}
<!--        <button id="age-preview__close"type="button" class="bui-banner__close js-age-preview-banner__close-button"><svg role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path d="M69.66,64l33.17-33.17a4,4,0,0,0-5.66-5.66L64,58.34,30.83,25.17a4,4,0,1,0-5.66,5.66L58.34,64,25.17,97.17a4,4,0,1,0,5.66,5.66L64,69.66l33.17,33.17a4,4,0,0,0,5.66-5.66Z"></path></svg></button>-->
      </div>
    `
}

function getMainPage() {
  return ` 
    <div class="bui-page-header bui-spacer">
      <div class="bui-page-header__breadcrumbs">
        <div role="navigation" class="bui-breadcrumb bui-breadcrumb--back">
          <div class="bui-breadcrumb__item"><svg role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="bui-breadcrumb__icon">
            <path d="M14.55 18a.74.74 0 0 1-.53-.22l-5-5A1.08 1.08 0 0 1 8.7 12a1.1 1.1 0 0 1 .3-.78l5-5a.75.75 0 0 1 1.06 0 .74.74 0 0 1 0 1.06L10.36 12l4.72 4.72a.74.74 0 0 1 0 1.06.73.73 0 0 1-.53.22zm-4.47-5.72zm0-.57z"></path></svg> 
            <div class="bui-breadcrumb__text">
              <a href="#" onclick="loadCPPOPage();" class="bui-link bui-link--secondary">
                Return to Children policies, rates and occupancy</span>
               </a>
             </div>
          </div>
        </div>
      </div>
      <h1 class="bui-page-header__title">Manage children rates by room type, rate plan and date</h1>
    </div>

    <div id="page" class="bui-grid">
      <div id="left-menu" class="bui-grid__column-full bui-grid__column-4@medium">
        <div id="room-list"></div>
        <div id="policy-banner"></div>
        ${getChildrenPolicyView()}
      </div>
      <div id="right-content" class="bui-grid__column-full bui-grid__column-8@medium">
      </div>
    </div>
  `;
}