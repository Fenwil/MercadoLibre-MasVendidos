// Check if active view mode is List or Gallery mode

chrome.runtime.sendMessage('getState', function(state) {
  console.log(state)
  if (state) {
    sortItems()
  }
})

function sortItems() {
  let soldQuantitySelector = ''
  let locationSelector = ''
  let listSelector = ''
  let itemHeight = ''
  const viewMode = document.querySelector('.ico')
  const viewModeActive = viewMode.className.includes('list selected') ? 'list' : 'gallery'

  if (viewModeActive === 'gallery') {
    soldQuantitySelector = '.sold-quantity'
    locationSelector = '.info-shipping'
    listSelector = '.gallery-large'
    itemHeight = 90
  } else if (viewModeActive === 'list') {
    soldQuantitySelector = '.extra-info-sold'
    locationSelector = '.extra-info-location'
    listSelector = '.list-view'
    itemHeight = 60
  }

  // Add a li element "0 vendidos" to those products that didn't sell nothing yet
  const rowItems = [...document.querySelectorAll('.results-item')]
  rowItems.forEach(row => {
    const info = row.querySelector(soldQuantitySelector)
    if (!info) {
      row
        .querySelector(locationSelector)
        .insertAdjacentHTML('beforebegin', `<li class="${soldQuantitySelector.replace('.', '')}">0 vendidos</li>`)
    }
  })

  // Sort all the quantity of sold products descendly
  const rowItemsUpdated = [...document.querySelectorAll('.results-item')]
  const rowItemsSorted = rowItemsUpdated.sort((a, b) => {
    const valueA = a.querySelector(soldQuantitySelector).innerText.replace(/\D/g, '')
    const valueB = b.querySelector(soldQuantitySelector).innerText.replace(/\D/g, '')
    return valueA - valueB
  })

  // Clean all items inside the list
  const listView = document.querySelector(listSelector)
  listView.innerHTML = null

  // Insert all the items sorted descendly
  rowItemsSorted.forEach(row => listView.insertAdjacentElement('afterbegin', row))
}
