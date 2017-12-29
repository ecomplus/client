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
The return of _callback_ is two arguments:
1. Error
2. Object

The error is a message describing the erro and the object is the response of your request.

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
The return is the same object from [store API](https://ecomstore.docs.apiary.io). So if you want to see more examples, you should access the documentation from store API.

### getProduct(id, callback)
It is a method to get a Product by the product ID.

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
Similar to `getProduct` but here you pass the product SKU instead of ID.

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
Different from the [store API](https://ecomstore.docs.apiary.io), in that case the return is the same of `getProduct`.

### getOrder(id, callback)
It is a method to get Order by the order ID.

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Example
``` javascript
EcomIo.getOrder('fe1000000000000000000005', callback)
```
### getBrands(filter, callback)
It is a method to get all store Brands. The filter argument is a URL parameters, it is not required but you can use for filtering and pagination purposes.

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

### getCategories(filter, callback)
Similar to `getBrands` but here the return is all the store Categories.

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| filter | String |
| callback | Function |

#### Example
With no filter:
```javascript
EcomIo.getCategories(callback)
```
With limit filter:
```javascript
EcomIo.getCategories('limit=3', callback)
```

### searchProduts(term, sort, filter, callback)
This method calls [E-Com Plus Search API](https://ecomsearch.docs.apiary.io/#),
that proxy pass all requests to Elasticsearch
[Search APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html)
with _XGET_ method (read only).

You must follow
[Request Body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
specifications.

Responses are the same as returned from _Eslasticsearch REST API_,
so you can read their documentation to get more info and examples.

#### Example
```javascript
'query': {
  'multi_match': {
    'query': term,
    'fields': ['name', 'keywords']
  },
  'sort': [
    { 'available': true },
    '_score',
    { 'ad_relevance': 'desc' },
    sort
  ],
  'bool': { // condition, only visible products
    'filter': [
      {'term': { 'visible': true }},
      filterObject
    ]
  }
}
```

#### Arguments
|  Name  | Type | Usage |
| :---:  | :---:| :--- |
| term | String | It is the term that you search, can be the name of the product or the keywords of that product |
| sort | Number or Object | You can sort the products by sales, price or views |
| filter | Object | It is a object to filter the products |

#### Term
We use a [multi match query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) because we will query in two fields, the name and the keywords of the product.

#### Sort
The sort argument is based on [sort](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html) from Elasticsearch documentation.

```javascript
'query': {
  'sort': [
    { 'available': true },
    '_score',
    { 'ad_relevance': 'desc' },
    sort
  ]
}
```
The order that the products will be sort is:

1. The products that is available;
2. The products with more score;
3. The products with more ad relevance;
4. Sort object.

#### Sort Object
The sort object is based on the sort argument that you pass. To make your work easier, we have created three examples that are more used for users, sort by views, prices and sales.

|  Number  | Name | Usage |
| :---:  | :---:| :--- |
| 1 | sales | You will sort by sales, the products that sells more will appear first than the others |
| 2 | price | You will sort by price, the products with lowest price will appear first than the others |
| 3 | price | You will sort by price, the products with highest price will appear first than the others |


**By default the sort is views, the products with more views will appear first than the others**

If you don't want to sort by views, sales or prices, you can pass a sort object **but you have to follow the Elasticsearch documentation**

#### Example of sort object
```javascript
sort = {
  'sales' : 'desc'
}
```

#### Model of sort object
```javascript
sort = {
  'property' : 'value'
}
```

#### Filter
The filter argument is based on [post filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-post-filter.html) from Elasticsearch documentation.

```javascript
'query': {
  'bool': { // condition, only visible products
    'filter': [
      {'term': { 'visible': true }},
      filterObject
    ]
  }
}
```
First we use a filter that shows only visible products. Second, we use the filter argument that you pass but, is not required. So if you want to filter by brands, categories or any other property, you have to pass a filter object.

#### Example of filter object
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

#### Model of filter object
```javascript
filter = {
  'gridName' : {
    'property': [ 'values' ]
  }
}
```

### getRecommendedProduct(id, callback)
Returns up to 12 recommended products, selecting the products that was more times bought together with the reference product

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Example
```javascript
EcomIo.getRecommendedProduct('a00000000000000000000000', callback)
```

### getRelatedProduct(id, callback)
Returns up to 12 related products, selecting the products that have more categories in common with the reference product

#### Arguments
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Example
```javascript
EcomIo.getRelatedProduct('a00000000000000000000000', callback)
```
