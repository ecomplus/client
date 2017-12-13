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
    const options = {
      hostname: 'https://api.e-com.plus/v1' + endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': storeID
      }
    }

    const req = http.request(options, function (res) {
      res.on('data', function (body) {
        return body
      })
      req.on('error', function (error) {
        console.error('problem with request:' + error.message)
      })
      req.end()
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
