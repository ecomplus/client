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

## Callback
All the methods are functions with _callback_ argument,
it's the function that you should pass to treat the request response.
`callback` function must have two arguments:

| Name  | Type             | Description |
| :---: | :---:            | :---: |
| err   | Null or Object   | [Error Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) |
| body  | Object           | Response body object (JSON parsed) |

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
The object returned from almost all methods is the response body of Store API endpoints,
so if you want to see more examples, you should access the
[API documentation](https://ecomstore.docs.apiary.io/#).

### getProduct(callback, id)
It is a method to get a product by the ID.

#### Arguments
|  Name    | Type     |
| :---:    | :---:    |
| callback | Function |
| id       | String   |

#### Example
```javascript
EcomIo.getProduct(callback, '123a5432109876543210cdef')
```
#### Return
Example of returned body object:

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

### getProductBySku(callback, sku)
Similar to `getProduct` but here you pass the product SKU instead of ID.

#### Arguments
|  Name    | Type     |
| :---:    | :---:    |
| callback | Function |
| sku      | String   |

#### Example
```javascript
EcomIo.getProductBySku(callback, 'COD1')
```

#### Return
Different from the [store API](https://ecomstore.docs.apiary.io/#),
in that case the return is the same of `getProduct`.

### getOrder(callback, id)
It is a method to get order by the ID.

#### Arguments
|  Name    | Type     |
| :---:    | :---:    |
| callback | Function |
| id       | String   |

#### Example
``` javascript
EcomIo.getOrder(callback, 'fe1000000000000000000005')
```

### getBrands(callback, filter)
It is a method to list store brands.
The filter argument is a URL query string,
it is not required but you can use for filtering and pagination purposes.

| Filter  | Type   | Usage |
| :---:   | :---:  | :---: |
| offset  | number | Max number of objects to return |
| limit   | number | First entry to return |
| sort    | string | Rules to order resultant objects |
| fields  | string | Object properties to return |

#### Arguments
|  Name    | Type     |
| :---:    | :---:    |
| callback | Function |
| filter   | String   |

#### Example
With no filter:
```javascript
EcomIo.getBrands(callback)
```
With limit filter:
```javascript
EcomIo.getBrands(callback, 'limit=40')
```

### getCategories(callback, filter)
Similar to `getBrands` but here the returned body is the list of store categories.

#### Arguments
| Name     | Type     |
| :---:    | :---:    |
| callback | Function |
| filter   | String   |

#### Example
With no filter:
```javascript
EcomIo.getCategories(callback)
```
With limit and offset:
```javascript
EcomIo.getCategories(callback, 'limit=20&offset=10')
```

### searchProduts(callback, term, sort, filter)
This method calls [E-Com Plus Search API](https://ecomsearch.docs.apiary.io/#),
that proxy pass all requests to Elasticsearch
[Search APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html)
with _XGET_ method (read only). Responses are the same as returned from _Eslasticsearch REST API_,
so you can read their documentation to get more info and examples.

You must follow
[Request Body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
specifications.

[Type mapping reference](https://ecomsearch.docs.apiary.io/#reference/items).

#### Arguments
|  Name    | Type             | Description |
| :---:    | :---:            | :---:       |
| callback | Function         | [Callback function](#callback) |
| term     | String           | It is the term that you are searching for |
| sort     | Number or Object | Sort products, default for views |
| filter   | Object           | It is a object to filter results |

#### Example
Search by term only:
```javascript
EcomIo.searchProduts(callback, 'tshirt')
```
Order by sales:
```javascript
EcomIo.searchProduts(callback, 'tshirt', 1)
```
Custom order:
```javascript
EcomIo.searchProduts(callback, 'tshirt', {
  'base_price': 'desc'
})
```
Custom order and filter:
```javascript
EcomIo.searchProduts(callback, 'tshirt', {
  'base_price': 'desc'
}, 'specifications' : {
  'color': [ 'blue', 'red' ]
})
```

#### Term
We use a
[multi match query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
because we will query in two fields, the name and the keywords of each product.

#### Sort
The sort argument is based on
[sort](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html)
from Elasticsearch documentation.

The order that the resultant products will be sort is:

1. The available products;
2. Search score;
3. The products with more ad relevance;
4. Sort object.

##### Sort Object
To make your work easier, we have created three default sort options, by views, price and sales:

| Number | Name  | Usage |
| :---:  | :---: | :---: |
| 0      | views | Sort by views, products with more views will appear first |
| 1      | sales | Sort by sales, products that sells more will appear first |
| 2      | price | Sort by price ascending, products with lowest price will appear first |
| 3      | price | Sort by price descending, products with highest price will appear first |

If `sort` argument is undefined or null, default is to sort by views.

If you don't want to sort by views, sales or prices,
you can pass a sort object **but you have to follow the Elasticsearch documentation**.

#### Example of sort object
```javascript
sort = {
  'sales' : 'desc'
}
```

#### Filter
The filter argument is based on
[post filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-post-filter.html)
from Elasticsearch documentation.

First we use a filter that shows only visible products.
Second, we use the filter argument that you pass, if defined.
So if you want to filter by brands, categories or any other property, you have to pass a filter object.

#### Example of filter object
```javascript
filter = {
  'specifications' : {
    'color': [ 'blue', 'red' ]
  },
  'brands' : {
    'name': [ 'Sample Shirt Inc' ]
  }
}
```

### getRecommendedProduct(callback, id)
Returns up to 12 recommended products, selecting the products that was more
times bought together with the reference product.
You should use it to do something like "who bought it, bought too".

#### Arguments
| Name     | Type     |
| :---:    | :---:    |
| callback | Function |
| id       | String   |

#### Example
```javascript
EcomIo.getRecommendedProduct(callback, 'a00000000000000000000000')
```

### getRelatedProduct(callback, id)
Returns up to 12 related products, selecting the products that have more categories
in common with the reference product.
You should use it to do something like "you can also be interested by".

#### Arguments
| Name     | Type     |
| :---:    | :---:    |
| callback | Function |
| id       | String   |

#### Example
```javascript
EcomIo.getRelatedProduct(callback, 'a00000000000000000000000')
```
