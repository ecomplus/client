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
    
### getProductBySku(sku, callback)
It is a method to get a Product by your sku

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| sku | String |
| callback | Function |

#### Return 
A object with product properties such as id and name. You can see the complete object on [store API - products](https://ecomstore.docs.apiary.io/#reference/products/specific-product/read-product)

#### Example
    EcomIo.getProductBySku('COD1', callback)

### getProduct(id, callback)
Similar to `getProductBySku` but here you pass the product id instead of sku

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Return 
The return is the same of `getProductBySku`

#### Example
    EcomIo.getProductBySku('123a5432109876543210cdef', callback)
    

### getOrder(id, callback)
It is a method to get Order by your id

#### Arguments 
|  Name  | Type |
| :---:  | :---:|
| id | String |
| callback | Function |

#### Return 
The return is a object with order properties such as items and amount. You can see the complete object on [store API - orders](https://ecomstore.docs.apiary.io/#reference/orders/new-order/read-order)

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
The return is a object with all store brands. You can see the complete object on [store API - brands](https://ecomstore.docs.apiary.io/#reference/brands/all-brands/list-all-store-brands)

#### Example
With no filter:
    
    EcomIo.getBrands(callback)
With limit filter:    

    EcomIo.getBrands('limit=3', callback)

### searchProduts(term, sort, filter, callback)
It is a method to search products. For this method all the arguments are important. 

|  Name  | Type | Usage |
| :---:  | :---:| :--- |
| term | String | It is the term that you search, can be the name of the product or the keywords of that product |
| sort | Number | You can sort the products by sales, price or views |
| filter | Object | It is a object to filter the products |

#### Sort

|  Number  | Name | Usage |
| :---:  | :---:| :--- |
| 1 | sales | You will sort by sales, the products that sells more will appear first than the others |
| 2 | price | You will sort by price, the products with lowest price will appear first than the others |
| 3 | price |  You will sort by price, the products with highest price will appear first than the others|

**By default the sort is views, the products with more views will appear first than the others**

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
   
