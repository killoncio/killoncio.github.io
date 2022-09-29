function getChildrenOrderText(order) {
  switch (order.toString()) {
    case "1":
      return `1st child`;
    case "2":
      return `2nd child`;
    case "3":
      return `Every extra child`;
    default:
      return `${order}th child`;
  }
}

function getPrice(priceSettings, showPercentage) {
  switch (priceSettings.price_type.toString()) {
    case "0":
      return 'Free';
      break;
    case "1":
      return `${currency} ${priceSettings.price}`;
      break;
    case "2":
      return showPercentage ? `${priceSettings.price} %` : `${currency} ${priceSettings.price * (basePrice
          / 100)}`;
    default:
      return 'adult price';
  }
}

function getPerChildrenPreview(ageBandPrices, showPercentage) {
  let result = `<ul>`;
  const pricesByChild = ageBandPrices.order_price;

  result += Object.keys(pricesByChild).map(childOrder => `
          <li> ${getChildrenOrderText(childOrder)} child: ${getPrice(pricesByChild[childOrder], showPercentage)}</li>
  `).join('');

  if (ageBandPrices.extra_child.price_type != -1) {
    result += `<li> Each extra child: ${getPrice(ageBandPrices.extra_child, showPercentage)}</li>`;
  }

  result += `</ul>`;

  return result;
}

function rulePreview(ageId, ageBandPrices, showPercentage) {
  if (ageBandPrices.order_select) {
    return getPerChildrenPreview(ageBandPrices, showPercentage);
  }

  return `<p>${getPrice(ageBandPrices, showPercentage)}</p>`;
}