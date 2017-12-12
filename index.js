var storeID

// GET STORE ID
(function StoreId (storeId) {
  storeID = storeId
}())

const isNodeJS = false
// Verify if the script is Node JS
if (typeof module !== 'undefined' && module.exports) {
  isNodeJS = true
}

// Function to run function by endpoint and method
function runMethod (endpoint, method) {
  if (isNodeJS === true) {
    request({
      method: method,
      url: 'https://api.e-com.plus/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': storeID
      }
    }, function (error, res, body) {
      if (error) {
        console.log('Error:', error)
      } else {
        return res.body
      }
    })
  } else {
    let ajax = new XMLHttpRequest()
    let url = 'https://api.e-com.plus/v1' + endpoint
    ajax.open(method, url, true)
    ajax.send()
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) {
        let data = ajax.responseText
        return JSON.parse(data)
      }
    }
  }
}

// Function to get ID product by sku
function getProductBySku (sku) {
  let endpoint = '/products.json?sku=' + sku
  let method = 'GET'
  let response = runMethod(endpoint, method).done(function () {
    for (let i = 0; i < response.result; i++) {
      getProduct(response.result[i]._id)
    }
  })
}

// Function to get Product by ID product
function getProduct (id) {
  let endpoint = '/products/' + id + '.json'
  let method = 'GET'
  runMethod(endpoint, method)
}
