# ecomplus-sdk-js
JS library for E-Com Plus storefront with methods to access public resources from
[Store API](https://ecomstore.docs.apiary.io),
[Graphs API](https://ecomgraphs.docs.apiary.io) and
[Search API](https://ecomsearch.docs.apiary.io).

__This library implements only GET requests to public resources, so there aren't authentication.__

You can include minified script from URL:

[https://ecom.nyc3.digitaloceanspaces.com/plus/js/sdk.min.js](https://ecom.nyc3.digitaloceanspaces.com/plus/js/sdk.min.js)

`<script src="https://ecom.nyc3.digitaloceanspaces.com/plus/js/sdk.min.js"></script>`

Or install [npm package](https://www.npmjs.com/package/ecomplus-sdk-js):

`npm install --save ecomplus-sdk-js`

# Getting Started
The library declares an object called `EcomIo`,
with methods (object properties) to read public resources from the APIs.

All the methods are functions with _callback_ argument,
it's the function that you should pass to treat the request response.

## Initialize
`init(StoreId, Logger)`

Before you call the other methods you need to initialize the library with the store ID.

The `Logger` argument is not required, but you can pass a _Console_ object,
with properties _log_ and _error_, if you want to save output on file.

#### Arguments
| Name    | Type             |
| :---:   | :---:            |
| StoreId | Number           |
| Logger  | `Console` object |

#### Example
```javascript
EcomIo.init(100)
```

## Methods
### getProduct(id, callback)
It is a method to get a Product by your id

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Example
```javascript
    EcomIo.getProduct('123a5432109876543210cdef', callback)
```
#### Return
Example of return object:

```javascript
    {
      "_id": "123a5432109876543210cdef",
      "store_id": 100,
      "sku": "s-MP_2B4",
      "name": "Mens Pique Polo Shirt",
      "keywords": [
        "tshirt",
        "t-shirt",
        "man"
      ],
      "price": 42.9,
      "base_price": 60,
      "quantity": 100,
      "dimensions": {
        "width": {
          "value": 10,
          "unit": "cm"
        },
        "height": {
          "value": 8,
          "unit": "cm"
        },
        "length": {
          "value": 8,
          "unit": "cm"
        }
      },
      "weight": {
        "value": 400,
        "unit": "g"
      },
      "brands": [
        {
          "_id": "a10000000000000000000001",
          "name": "Shirts Example",
          "slug": "shirts-example",
          "logo": {
            "url": "https://mycdn.com/shirts-example.jpg",
            "size": "100x50"
          }
        }
      ],
      "categories": [
        {
          "_id": "f10000000000000000000001",
          "name": "Polo Shirts",
          "slug": "polo"
        }
      ]
    }
 ```

### getProductBySku(sku, callback)
Similar to `getProduct` but here you pass the product sku instead of id

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| sku | String |
| callback | Function |

#### Example
```javascript
    EcomIo.getProductBySku('COD1', callback)
```
#### Return
The return is the same of `getProduct`

### getOrder(id, callback)
It is a method to get Order by your id

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Example
``` javascript
EcomIo.getOrder('fe1000000000000000000005', callback)
```

#### Return
Example of return object:
``` javascript
    {
      "_id": "fe1000000000000000000005",
      "created_at": "2017-11-19T13:10:00Z",
      "store_id": 100,
      "checkout_link": "https://www.sampleshop.com.br/checkout?_id=fe1000000000000000000005",
      "status_link": "https://www.sampleshop.com.br/order/status?_id=fe1000000000000000000005",
      "utm": {
        "campaign": "adwords_example"
      },
      "source_name": "Web",
      "channel_id": "www.sampleshop.com.br",
      "channel_type": "ecommerce",
      "number": 1105,
      "status": "open",
      "opened_at": "2017-11-19T13:10:00Z",
      "seller_status": "pending",
      "financial_status": {
        "updated_at": "2017-11-19T13:10:00Z",
        "current": "pending"
      },
      "currency_id": "BRL",
      "currency_symbol": "R$",
      "amount": {
        "total": 48.05,
        "subtotal": 42.9,
        "freight": 5.15,
        "discount": 0
      },
      "payment_method_label": "PayPal",
      "shipping_method_label": "PAC",
      "items": [
        {
          "_id": "3120000000000000000000a1",
          "product_id": "123a5432109876543210cdef",
          "sku": "s-MP_2B4",
          "name": "Mens Pique Polo Shirt",
          "quantity": 1,
          "price": 42.9
        }
      ],
      "notes": "Sample order notes by customer"
    }
```
### getBrands(filter, callback)
It is a method to get all store Brands. The filter argument is not required but, you can pass some filter to API:

|  Filter  | Type | usage |
| :---:  | :---:|  :---|
| offset | number | Max number of objects to return |
| limit | number | First entry to return |
| sort | string | Rules to order resultant objects |
| fields | string | Object properties to return |

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| filter | String |
| callback | Function |

#### Example
With no filter:
```javascript
EcomIo.getBrands(callback)
```
With limit filter:
```javascript
EcomIo.getBrands('limit=3', callback)
```
#### Return
Example of return object:
```javascript
{
  "meta": {
    "limit": 1000,
    "offset": 0,
    "sort": [],
    "fields": [
      "_id",
      "name",
      "slug",
      "logo"
    ],
    "query": {}
  },
  "result": [
    {
      "_id": "a10000000000000000001110",
      "name": "Brand 0",
      "slug": "brand-zero",
      "logo": {
        "url": "https://mycdn.com/brand-0-logo.jpg",
        "size": "90x70",
        "alt": "Brand Zero"
      }
    },
  ]
}
```
### searchProduts(term, sort, filter, callback)
For this method you use [Elastic Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html) to search products. So, everything that is valid for Elastic is valid here

|  Name  | Type | Usage |
| :---:  | :---:| :--- |
| term | String | It is the term that you search, can be the name of the product or the keywords of that product |
| sort | Number or Object | You can sort the products by sales, price or views |
| filter | Object | It is a object to filter the products |

#### Sort

|  Number  | Name | Usage |
| :---:  | :---:| :--- |
| 1 | sales | You will sort by sales, the products that sells more will appear first than the others |
| 2 | price | You will sort by price, the products with lowest price will appear first than the others |
| 3 | price | You will sort by price, the products with highest price will appear first than the others |

**By default the sort is views, the products with more views will appear first than the others**

If you dont want to sort by views, sales or prices, you can pass a sort object **but you have to follow the Elastic documentation**

#### Filter
Example of filter object:

```javascript
filter = {
  'specifications' : {
    'color': [ 'blue', 'red' ]
  },
  'brands' : {
    'name': [ 'brandName' ]
  }
}
```

So the model of the filter object is:

```javascript
filter = {
  'gridName' : {
    'property': [ 'values' ]
  }
}
```
