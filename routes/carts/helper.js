module.exports = {
  // merging product and items
  // Ex: product = { id: 1, title: ..., price: },
  // items = { '1', totalPrice: ..., totalQuantity: ... }
  generateArray
}

function generateArray(products, items) {
  const arr = [];
  for(let id in items) {
    arr.push( Object.assign({}, products[id], items[id]) );
  }

  return arr;
}
