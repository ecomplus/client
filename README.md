# ecomplus-sdk-js
JS library for E-Com Plus storefront with methods to access public resources from
[Store API](https://ecomstore.docs.apiary.io),
[Graphs API](https://ecomgraphs.docs.apiary.io) and
[Search API](https://ecomsearch.docs.apiary.io).

__This library implements only GET requests to public resources, so there aren't authentication.__

You can include minified script
[together with Axios](https://github.com/axios/axios):

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://ecom.nyc3.digitaloceanspaces.com/plus/js/sdk.min.js"></script>
```

Or install [npm package](https://www.npmjs.com/package/ecomplus-storefront):

`npm install --save ecomplus-storefront`

# Getting Started
The library declares an object called `EcomIo`,
with methods (object properties) to read public resources from the APIs.

## Callback
All the methods are functions with _callback_ as his first argument,
it's the function that you should pass to treat the request response.
`callback` function must have two arguments:

| Arguments | Type                   | Required |
| :---:     | :---:                  | :---: |
| err       | `Error` object or null | :heavy_check_mark: |
| body      | Object or null         | :heavy_check_mark: |

If the method runs correctly,
`err` will be null, otherwise, it will be an
[Error object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error).

The response object from the APIs is
parsed and returned in `body`, it's null if no
JSON response can be captured.

## Initialize
`init(StoreId, Logger)`

Before you call the other methods you need to initialize the library with the store ID.

The `Logger` argument is not required, but you can pass a
[Console object](https://developer.mozilla.org/docs/Web/API/Console),
with properties `log` and `error`, if you want to save output on file.

| Arguments | Type             | Required |
| :---:     | :---:            | :---: |
| StoreId   | Number           | :heavy_check_mark: |
| Logger    | `Console` object | |

```javascript
EcomIo.init(100)
```

# Methods
The object returned from almost all methods is the response body of Store API endpoints,
so if you want to see more examples, you should access the
[API documentation](https://ecomstore.docs.apiary.io/#).

## Get Product
`getProduct(callback, id)`

> Method to read a product object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getProduct(callback, '123a5432109876543210cdef')
```

Example of returned `body`:

```json
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
  ...
}
 ```

## Get Product By Sku
`getProductBySku(callback, sku)`

> Similar to [`getProduct`](#get-product), with the same return,
but here you pass the product SKU instead of ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| sku       | String   | :heavy_check_mark: |

```javascript
EcomIo.getProductBySku(callback, 'COD1')
```

## Get Order
`getOrder(callback, id)`

> Method to read an order object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getOrder(callback, 'fe1000000000000000000005')
```

## Get Cart
`getCart(callback, id)`

> Method to read a cart object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getCart(callback, '2ca000000000000000000003')
```

## Get Customer
`getCustomer(callback, id)`

> Method to read a customer object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getCustomer(callback, '3c1000000000000000000003')
```

## Get Application
`getApplication(callback, id)`

> Method to read an application object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getApplication(callback, '42aa00000000000000000111')
```

## Get Brand
`getBrand(callback, id)`

> Method to read a brand object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getBrand(callback, 'a10000000000000000000001')
```

## Find Brand By Slug
`findBrandBySlug(callback, slug)`

> Method to find and read a brand by the slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.getBrandBySlug(callback, 'brand-four')
```

## List Brands
`listBrands(callback, offset, limit, sort, fields, customQuery)`

> Method to list the store brands.

| Arguments   | Type     | Required |
| :---:       | :---:    | :---: |
| callback    | Function | :heavy_check_mark: |
| offset      | Number   | |
| limit       | Number   | |
| sort        | Number   | |
| fields      | Array    | |
| customQuery | String   | |

Offset, limit, sort and fields are
[URL parameters](https://ecomstore.docs.apiary.io/#introduction/overview/url-params) (metadata)
for pagination and ordering,
you can use customQuery to query by particular object properties.
Default enumered `sort` options:

| Number | Usage |
| :---:  | :---: |
| 1      | Sort by name ascending |
| 2      | Sort by name descending |
| 3      | Sort by creation date ascending |
| 4      | Sort by creation date descending |
| 5      | Sort by popularity descending |

```javascript
EcomIo.listBrands(callback)
```

```javascript
EcomIo.listBrands(callback, 0, 1000, 1, ['name'])
```

```javascript
EcomIo.listBrands(callback, null, null, null, null, 'limit=2&offset=4')
```

## Get Category
`getCategory(callback, id)`

> Method to read a category object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getCategory(callback, 'f10000000000000000000001')
```

## Find Category By Slug
`findCategoryBySlug(callback, slug)`

> Method to find and read a category by the slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.getCategoryBySlug(callback, 'category-four')
```

## List Categories
`listCategories(callback, offset, limit, sort, fields, customQuery)`

> Similar to [`listBrands`](#get-brand-by-slug),
but listing store categories.

| Arguments   | Type     | Required |
| :---:       | :---:    | :---: |
| callback    | Function | :heavy_check_mark: |
| offset      | Number   | |
| limit       | Number   | |
| sort        | Number   | |
| fields      | Array    | |
| customQuery | String   | |

```javascript
EcomIo.listCategories(callback)
```
```javascript
EcomIo.listCategories(callback, 0, 1000, 1, ['name'])
```
```javascript
EcomIo.listCategories(callback, null, null, null, null, 'limit=2&offset=4')
```

## Get Collections
`getCollection(callback, id)`

> Method to read a collection object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getCollection(callback, 'f10000000000000000000001')
```

## Find Collection
`findCollectionBySlug(callback, slug)`

> Method to find and read a collection by the slug.

#### Arguments
| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.getCollectionBySlug(callback, 'special-collection')
```

## List Collections
`listCollections(callback, offset, limit, sort, fields, customQuery)`

> Similar to [`listBrands`](#list-brands),
but listing store collections.

| Arguments   | Type     | Required |
| :---:       | :---:    | :---: |
| callback    | Function | :heavy_check_mark: |
| offset      | Number   | |
| limit       | Number   | |
| sort        | Number   | |
| fields      | Array    | |
| customQuery | String   | |

```javascript
EcomIo.listCollections(callback)
```
```javascript
EcomIo.listCollections(callback, 0, 1000, 1, ['name'])
```
```javascript
EcomIo.listCollections(callback, null, null, null, null, 'limit=2&offset=4')
```

### searchProduts(callback, term, from, size, sort, specs, brands, categories, prices, customDsl)
This method calls [E-Com Plus Search API](https://ecomsearch.docs.apiary.io/#),
that proxy pass all requests to Elasticsearch
[Search APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html)
with _XGET_ method (read only). Responses are the same as returned from _Elasticsearch REST API_,
so you can read their documentation to get more info and examples.

You must follow
[Request Body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
specifications.

[Type mapping reference](https://ecomsearch.docs.apiary.io/#reference/items).

**The term is the only argument that is required but, if you send the customDsl you dont dont need to send the term.**

#### Arguments
|  Name        | Type             | Description | Required |
| :---:        | :---:            | :---: | :---: |
| callback     | Function         | [Callback function](#callback) | Required |
| term         | String           | It is the term that you are searching for | Required |
| from         | number           | It is like the offset from [URL parameters](https://ecomstore.docs.apiary.io/#introduction/overview/url-params)  | Not Required  |
| size         | number           | It is like the limit from [URL parameters](https://ecomstore.docs.apiary.io/#introduction/overview/url-params)   | Not Required  |
| sort         | number           | Sort products, default for views                                                                                 | Not Required  |
| specs        | Object           | It is an object to filter results by specifications  | Not Required  |
| brands       | Object           | It is an array of brands to filter results by brands | Not Required  |
| categories   | Object           | It is an array of categories to filter results by categories | Not Required  |
|  prices      | Object           | It is an object to filter results by prices | Not Required  |
|  customDsl   | Object           | It is an object, to create your own request body search | Not Required  |

#### Example
Search by term only:
```javascript
EcomIo.searchProduts(callback, 'tshirt')
```
#### Term
We use a
[multi match query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
because we will query in two fields, the name and the keywords of each product.

#### From and Size
The from and size parameters are for pagination the results. The from is like the offset in [URL parameters](https://ecomstore.docs.apiary.io/#introduction/overview/url-params) and the size is like the limit. If you dont pass any argument for the size, the limit to return is default to 24. It is based on [From/Size](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html) from Elasticsearch documentation.

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
We have created three default sort options, by views, price and sales:

| Number | Name  | Usage |
| :---:  | :---: | :---: |
| 1      | sales | Sort by sales, products that sells more will appear first |
| 2      | price | Sort by price ascending, products with lowest price will appear first |
| 3      | price | Sort by price descending, products with highest price will appear first |

If `sort` argument is undefined or null, default is to sort by views.

#### Specs
The specs is a object with specifications properties that we use to filter the search. The key is the specifications name and the value is an array with the specifications values.

#### Example of specs object
```javascript
specs = {
  'color': ['blue', 'red'],
  'size': ['G']
}
```

#### Brands
The brands parameter is an array that we use to filter the search. So if you want to filter by Brands you can pass an array of brands.

```javascript
brands = ['brand1', 'brand2']
```

#### Categories
It is very similar to brands argument, categories parameter is an array of categories that we use to filter the search.

```javascript
categories = ['category1', 'category2']
```

#### Prices
The prices argument is a object that we use to filter the search too. You can limit the search by pass the minimum and the maximum prices. It is based on
[Range query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
from Elasticsearch documentation.

#### Example of prices object
```javascript
prices = {
  'min': 10,
  'max': 100
}
```
#### CustomDsl
The customDsl it is a object that you can pass to do your own request body search to Elasticsearch. So if you want to search by something else that we are not using, you can create a body based on [Request body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html) and do it. **But remember must be a valid body from Request body search from Elasticsearch documentation.**

### getRecommendedProducts(callback, id)
Returns up to 12 recommended products, selecting the products that was more
times bought together with the reference product.
You should use it to do something like "who bought it, bought too".

#### Arguments
| Name     | Type     | Required |
| :---:    | :---:    | :---:    |
| callback | Function | Required |
| id       | String   | Required |

#### Example
```javascript
EcomIo.getRecommendedProducts(callback, 'a00000000000000000000000')
```

### getRelatedProducts(callback, id)
Returns up to 12 related products, selecting the products that have more categories
in common with the reference product.
You should use it to do something like "you can also be interested by".

#### Arguments
| Name     | Type     |  Required |
| :---:    | :---:    |  :---:    |
| callback | Function |  Required |
| id       | String   |  Required |

#### Example
```javascript
EcomIo.getRelatedProducts(callback, 'a00000000000000000000000')
```
