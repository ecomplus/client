# ecomplus-sdk-js
JS SDK for E-Com Plus with methods to access public resources from [store API](https://ecomstore.docs.apiary.io)

# Getting Started
The ecomplus-sdk-js has a object called EcomIo with all methods that you can use to access the store API. All the methods of the object has a argument called callback, it is a function that you pass to treat the response of the method

## Methods
### init(StoreId, Logger)
Before you access the other methods from SDK you need to initialize the object with StoreId. The Logger argument is not required but, you can pass a object with properties 'log' and 'error'

#### Arguments
|   Name  | Type |
| :---:  | :---:|
| StoreId | String or Number |

#### Example
    EcomIo.init(100)

### getProduct(id, callback)
It is a method to get a Product by your id

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |    

#### Return 
Example of return object:

    {
      "_id": "123a5432109876543210cdef",
      "created_at": "2017-12-01T01:00:30Z",
      "store_id": 100,
      "sku": "s-MP_2B4",
      "commodity_type": "physical",
      "name": "Mens Pique Polo Shirt",
      "slug": "mens-pique-polo-shirt",
      "available": true,
      "visible": true,
      "ad_relevance": 0,
      "short_description": "Red, 100% cotton, large men’s t-shirt",
      "body_html": "<p>Red, 100% cotton, large men’s t-shirt.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>",
      "body_text": "Red, 100% cotton, large men’s t-shirt.\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "meta_title": "Mens Pique Polo Shirt - My Shirt Shop",
      "meta_description": "Mens Pique Polo Shirt, Red, 100% cotton, large men’s t-shirt",
      "keywords": [
        "tshirt",
        "t-shirt",
        "man"
      ],
      "price": 42.9,
      "price_effective_date": {
        "end": "2018-12-01T10:00:00Z"
      },
      "base_price": 60,
      "currency_id": "BRL",
      "currency_symbol": "R$",
      "quantity": 100,
      "manage_stock": true,
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
      "condition": "new",
      "adult": false,
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
      ],
      "specifications": {
        "age_group": {
          "text": "Adult",
          "value": "adult"
        },
        "gender": {
          "text": "Male",
          "value": "male"
        },
        "size": {
          "text": "Large",
          "value": "large"
        },
        "size_type": {
          "text": "Regular",
          "value": "regular"
        },
        "size_system": {
          "text": "BR",
          "value": "BR"
        },
        "material": {
          "text": "Cotton",
          "value": "cotton"
        },
        "colors": [
          {
            "text": "Pique",
            "rgb": "#ff5b00"
          }
        ]
      },
      "auto_fill_related_products": true,
      "gtin": [
        "12345678901234"
      ],
      "mpn": [
        "T1230"
      ]
    }

#### Example
    EcomIo.getProduct('123a5432109876543210cdef', callback)
    
### getProductBySku(sku, callback)
Similar to `getProduct` but here you pass the product sku instead of id

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| sku | String |
| callback | Function |

#### Return 
The return is the same of `getProduct`

#### Example
    EcomIo.getProductBySku('COD1', callback)

### getOrder(id, callback)
It is a method to get Order by your id

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Return 
Example of return object:

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

#### Example
    EcomIo.getOrder('fe1000000000000000000005', callback)
    
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

#### Return 
Example of return object:

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
        {
          "_id": "a10000000000000000001111",
          "name": "Brand 1",
          "slug": "brand-one",
          "logo": {
            "url": "https://mycdn.com/brand-1-logo.jpg",
            "size": "70x70",
            "alt": "Brand One"
          }
        },
        {
          "_id": "a10000000000000000001112",
          "name": "Brand 2",
          "slug": "brand-two"
        },
        {
          "_id": "a10000000000000000001113",
          "name": "Brand 3",
          "slug": "brand-three"
        },
        {
          "_id": "a10000000000000000001114",
          "name": "Brand 4",
          "slug": "brand-four",
          "logo": {
            "url": "https://mycdn.com/brand-4-logo.jpg",
            "size": "70x70"
          }
        },
        {
          "_id": "a10000000000000000001115",
          "name": "Brand 5",
          "slug": "brand-five",
          "logo": {
            "url": "https://mycdn.com/brand-5-logo.jpg",
            "size": "70x70"
          }
        },
        {
          "_id": "a10000000000000000001116",
          "name": "Brand 6",
          "slug": "brand-six",
          "logo": {
            "url": "https://mycdn.com/brand-6-logo.jpg",
            "size": "70x70",
            "alt": "Brand Six"
          }
        },
        {
          "_id": "a10000000000000000000001",
          "name": "Shirts Example",
          "slug": "shirts-example",
          "logo": {
            "url": "https://mycdn.com/shirts-example.jpg",
            "size": "100x50"
          }
        }
      ]
    }

#### Example
With no filter:
    
    EcomIo.getBrands(callback)
With limit filter:    

    EcomIo.getBrands('limit=3', callback)

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
| 3 | price |  You will sort by price, the products with highest price will appear first than the others|

**By default the sort is views, the products with more views will appear first than the others**

If you dont want to sort by views, sales or prices, you can pass a sort object **but you have to follow the Elastic documentation**

#### Filter
Example of filter object:
    
      
      filter = {
        'specifications' : {
          'color': ['blue', 'red']
        },
        'brands' : {
          'name': ['brandName']
        }
      }
   
So the model of the filter object is: 
    
    filter = {
        'gridName' : {
            'property': ['values']
         }
    }

