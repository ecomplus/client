# ecomplus-sdk.js
JS SDK for E-Com Plus with methods to access public resources from store API

# Getting Started
The ecomplus-sdk.js has a function called EcomIo with all methods that you can use to access the store API

## Methods
### init(StoreId, Logger)
Before you access the other methods from SDK you need to initialize the function with StoreId. The Logger argument is not required but, you can pass a object with properties 'log' and 'error'

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
| sku | String or Number |
| callback | Function |

#### Return 
A object with product properties such as id, name, price

#### Example
    EcomIo.getProductBySku('COD1', callback)
