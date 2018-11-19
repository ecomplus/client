# ecomplus-sdk-js

[![npm version](https://img.shields.io/npm/v/ecomplus-sdk.svg)](https://www.npmjs.org/ecomplus-sdk)
[![license mit](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JS library for E-Com Plus storefront with methods to access public resources from
[Store API](https://ecomstore.docs.apiary.io),
[Graphs API](https://ecomgraphs.docs.apiary.io) and
[Search API](https://ecomsearch.docs.apiary.io).

__This library implements only GET requests to public resources, so there aren't authentication.__

Include minified script via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ecomplus-sdk@1/dist/sdk.min.js"></script>
```

Or install [npm package](https://www.npmjs.com/package/ecomplus-sdk):

`npm install --save ecomplus-sdk`

# Summary

1. [Getting Started](#getting-started)
    * [Callback](#callback)
    * [Initialize](#initialize)
2. [Methods](#methods)
    * [Get Store](#get-store)
    * [Get Product](#get-product)
    * [Get Product By Sku](#get-product-by-sku)
    * [Get Order](#get-order)
    * [Get Cart](#get-cart)
    * [Get Customer](#get-customer)
    * [Get Application](#get-application)
    * [Get Brand](#get-brand)
    * [Find Brand By Slug](#find-brand-by-slug)
    * [List Brands](#list-brands)
    * [Get Category](#get-category)
    * [Find Category By Slug](#find-category-by-slug)
    * [List Categories](#list-categories)
    * [Get Collections](#get-collections)
    * [Find Collection By Slug](#find-collection-by-slug)
    * [List Collections](#list-collections)
    * [Search Products](#search-products)
        - [Term](#term)
        - [Sort](#sort)
        - [Specs](#specs)
        - [IDs](#ids)
        - [Brands](#brands)
        - [Categories](#categories)
        - [Prices](#prices)
        - [Custom DSL](#custom-dsl)
    * [List Recommended Products](#list-recommended-products)
    * [List Related Products](#list-related-products)
    * [Map By Slug](#map-by-slug)
    * [Map By Window URI](#map-by-window-uri)
    * [Get Any By ID](#get-any-by-id)
    * [Modules](#modules)
        - [Calculate Shipping](#calculate-shipping)
        - [List Payments](#list-payments)
        - [Create Transaction](#create-transaction)

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
`init(callback, StoreId, StoreObjectId, Logger)`

Before you call the other methods you need to initialize the library.

In client JS (browser) `StoreId` is not required,
if undefined, it will be set in function of site domain name.

You have to define `StoreId`,
and should also define `StoreObjectId`,
if using SDK on backend with Node.js, or if you are embedding
the store in another external site, such as a blog, not in the storefront.

The `Logger` argument is not required, but you can pass a
[Console object](https://developer.mozilla.org/docs/Web/API/Console),
with properties `log` and `error`, if you want to save output on file.

| Arguments     | Type             | Required |
| :---:         | :---:            | :---: |
| callback      | Function         | :heavy_check_mark: |
| StoreId       | Number           | |
| StoreObjectId | String           | |
| Logger        | `Console` object | |

```javascript
// storefront on browser
EcomIo.init(callback)
```

```javascript
// Node.js or not storefront site
EcomIo.init(callback, 100, '5a674f224e0dcec2c3353d9d')
```

# Methods
The object returned from almost all methods is the response body of Store API endpoints,
so if you want to see more examples, you should access the
[API documentation](https://ecomstore.docs.apiary.io/#).

## Get Store
`getStore(callback, id)`

[API reference](https://ecomstore.docs.apiary.io/#reference/stores/specific-store/read-store)

> Method to read a store object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | |

The `id` is not required only if
[`StoreObjectId`](#initialize) is set, then this method
will get the object of current store.

`StoreObjectId` will be set automaticly
if SDK is running on storefront with browser.

```javascript
// get current store object
// uses saved StoreObjectId
EcomIo.getStore(callback)
```

```javascript
// specific store by object id
EcomIo.getStore(callback, '5a674f224e0dcec2c3353d9d')
```

## Get Product
`getProduct(callback, id)`

[API reference](https://ecomstore.docs.apiary.io/#reference/products/specific-product/read-product)

> Method to read a product object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getProduct(callback, '123a5432109876543210cdef')
```

Example of returned `body`:

```javascript
{
  '_id': '123a5432109876543210cdef',
  'store_id': 100,
  'sku': 's-MP_2B4',
  'name': 'Mens Pique Polo Shirt',
  'keywords': [
    'tshirt',
    't-shirt',
    'man'
  ],
  'price': 42.9,
  'base_price': 60,
  'quantity': 100,
  // ...
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

[API reference](https://ecomstore.docs.apiary.io/#reference/orders/specific-order/read-order)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/carts/specific-cart/read-cart)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/customers/specific-customer/read-customer)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/applications/specific-application/read-application)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/brands/specific-brand/read-brand)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/brands/all-brands/find-brands)

> Method to find and read a brand by the slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.findBrandBySlug(callback, 'brand-four')
```

## List Brands
`listBrands(callback, offset, limit, sort, fields, customQuery)`

[API reference](https://ecomstore.docs.apiary.io/#reference/brands/all-brands/pagination-and-ordering)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/categories/specific-category/read-category)

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

[API reference](https://ecomstore.docs.apiary.io/#reference/categories/all-categories/find-categories)

> Method to find and read a category by the slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.findCategoryBySlug(callback, 'category-four')
```

## List Categories
`listCategories(callback, offset, limit, sort, fields, customQuery)`

[API reference](https://ecomstore.docs.apiary.io/#reference/categories/all-categories/pagination-and-ordering)

> Similar to [`listBrands`](#list-brands),
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

[API reference](https://ecomstore.docs.apiary.io/#reference/collections/specific-collection/read-collection)

> Method to read a collection object by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getCollection(callback, 'f10000000000000000000001')
```

## Find Collection By Slug
`findCollectionBySlug(callback, slug)`

[API reference](https://ecomstore.docs.apiary.io/#reference/collections/all-collections/find-collections)

> Method to find and read a collection by the slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.findCollectionBySlug(callback, 'special-collection')
```

## List Collections
`listCollections(callback, offset, limit, sort, fields, customQuery)`

[API reference](https://ecomstore.docs.apiary.io/#reference/collections/all-collections/pagination-and-ordering)

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

## Search Products
`searchProducts(callback, term, from, size, sort, specs, ids, brands, categories, prices, customDsl)`

[API reference](https://ecomsearch.docs.apiary.io/#reference/items/items-search/complex-search)

This method calls [E-Com Plus Search API](https://ecomsearch.docs.apiary.io/#),
that proxy pass all requests to Elasticsearch
[Search APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html)
with `XGET` HTTP verb (read only). Responses are the same as returned from _Elasticsearch REST API_,
so you can read their documentation to get more info and examples.

You must follow
[Request Body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
specifications and this
[type mapping](https://ecomsearch.docs.apiary.io/#reference/items) reference.

| Arguments  | Type     | Required           | Default | Description |
| :---:      | :---:    | :---:              | :---:   | :---: |
| callback   | Function | :heavy_check_mark: |         | [Callback function](#callback) |
| term       | String   |                    |         | Term that you are searching for |
| from       | number   |                    | 0       | Results offset number |
| size       | number   |                    | 24      | Maximum number of results |
| sort       | number   |                    | 0       | Results ordering, default is by views |
| specs      | Object   |                    |         | Filter results by item specifications |
| ids        | Array    |                    |         | Filter results by product IDs |
| brands     | Array    |                    |         | Filter results by brands |
| categories | Array    |                    |         | Filter results by categories |
| prices     | Object   |                    |         | Filter results by prices `min` and `max` |
| customDsl  | Object   |                    |         | Custom search request body |

```javascript
// list trending items
EcomIo.searchProducts(callback)
```

### Term
We use a
[multi match query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
to search specified `term` in two fields,
the `name` and `keywords` of each product.

```javascript
// search product by term
EcomIo.searchProducts(callback, 'tshirt')
```

### Sort
The `sort` argument is based on
[sort](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html)
from Elasticsearch documentation.

The order that the resultant products will be sort is:

1. The available products;
2. Search score;
3. The products with more ad relevance;
4. Sort option.

Default enumered `sort` options:

| Number | Field | Usage |
| :---:  | :---: | :---: |
| 0      | views | Sort by popularity, products with more page views will appear first |
| 1      | sales | Sort by sales, products that sells more will appear first |
| 2      | price | Sort by price ascending, products with lowest price will appear first |
| 3      | price | Sort by price descending, products with highest price will appear first |

If `sort` argument is undefined or null, default is to sort by `views`.

### Specs
The `specs` argument should be an
object with specifications properties that we use to filter the search.
The key is the specifications name and the value is an array
with the specifications values.

```javascript
// sample specs object
let specs = {
  'color': [ 'blue', 'red' ],
  'size': [ 'G' ]
}
```

### IDs
The `ids` argument should be an array of products IDs to filter the search.
If used, only the products of specified object ID(s) will be returned.

```javascript
// sample ids array
let ids = [
  '1234567890abcdef01291510',
  '1234567890abcdef01291511',
  '1234567890abcdef01291512'
]
```

### Brands
The `brands` argument should be an array of brands IDs to filter the search.
If used, only products of specified brand(s) will be returned.

```javascript
// sample brands array
let brands = [
  'a10000000000000000001110',
  'a10000000000000000001111'
]
```

### Categories
The `categories` argument should be an array of categories IDs to filter the search.
If used, only products of specified categorie(s) will be returned.

```javascript
// sample categories array
let categories = [
  'b10000000000000000001110',
  'b10000000000000000001111'
]
```

### Prices
The prices argument should be an object to filter search by price range.
You can pass the minimum and the maximum prices.

It's based on
[Range query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
from Elasticsearch documentation.

```javascript
// sample prices object
let prices = {
  'min': 10,
  'max': 100
}
```

### Custom DSL
The `customDsl` is an object that you can pass
to run your own Elasticsearch
[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html).

It must be a valid
[Request Body Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html).

## List Recommended Products
`listRecommendedProducts(callback, id)`

[API reference](https://ecomgraphs.docs.apiary.io/#reference/products/recommended/list-recommended-items)

> Method to get a list of products to recommend together with one reference product.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

Returns up to 12 recommended products, selecting the products that was more
times bought together with the reference product.
You should use it to do something like "who bought it, bought too".

```javascript
EcomIo.listRecommendedProducts(callback, 'a00000000000000000000000')
```

## List Related Products
`listRelatedProducts(callback, id)`

[API reference](https://ecomgraphs.docs.apiary.io/#reference/products/related/list-related-items)

> Method to get a list of products similar to one reference product.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

Returns up to 12 related products, selecting the products that have more categories
in common with the reference product.
You should use it to do something like "you can also be interested by".

```javascript
EcomIo.listRelatedProducts(callback, 'a00000000000000000000000')
```

## Map By Slug
`mapBySlug(callback, slug)`

> Method to discouver the respective resource and ID by the page slug.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| slug      | String   | :heavy_check_mark: |

```javascript
EcomIo.mapBySlug(callback, 'product-sample-slug')
```

Example of returned `body`:

```javascript
{
  'resource': 'products',
  '_id': '123a5432109876543210cdef'
}
```

## Map By Window URI
`mapByWindowUri(callback)`

> Does the same as [`mapBySlug`](#map-by-slug), but sets slug automaticlly
from `window.location`.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |

**This method is available client side only (JS on browser)**

```javascript
EcomIo.mapByWindowUri(callback)
```

## Get Any By ID
`getById(callback, resource, id)`

> Wildcard method to read any public resource
object from [Store API](https://ecomstore.docs.apiary.io/) by the ID.

| Arguments | Type     | Required |
| :---:     | :---:    | :---: |
| callback  | Function | :heavy_check_mark: |
| resource  | String   | :heavy_check_mark: |
| id        | String   | :heavy_check_mark: |

```javascript
EcomIo.getById(callback, 'products', '123a5432109876543210cdef')
```

## Modules
Working with Modules API

> TODO documentation

### Calculate Shipping
`calculateShipping(callback, body)`

> TODO documentation

### List Payments
`listPayments(callback, body)`

> TODO documentation

### Create Transaction
`createTransaction(callback, body)`

> TODO documentation
