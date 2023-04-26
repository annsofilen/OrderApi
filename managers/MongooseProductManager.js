import chalk from 'chalk';
import Product from '../models/ProductModel.js';

class MongooseProductManager {
    constructor() {
        // For note manager, so that we remember the class used 
        this.productModel = Product;
    }

    async initialize(app = null) {
        // No Initialization required in this class
        // return stats if somebody whants to check
        return true;
    }

    async getProductOfOrderId(id) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id
        console.log('id: ' + id)
        const foundOrders = await this.productModel.find({ orderId: id });

        if (foundOrders) {
            console.log(chalk.green.inverse('Found orders ' + foundOrders));
            // Convert to POJO
            return foundOrders//.toObject();
        } else {
            console.log(chalk.red.inverse(`Note not found with id =${id} !`))
        }

        return null;
    }

    async getProductOfId(id) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id
        console.log('id: ' + id)
        const foundProduct = await this.productModel.find({ id: id });
        console.log('found product: ' + foundProduct)

        if (foundProduct) {
            console.log(chalk.green.inverse('Found product with id: ' + id + foundProduct));
            // Convert to POJO
            return foundProduct.toObject();
        } else {
            console.log(chalk.red.inverse(`Product not found with id =${id} !`))
        }

        return null;
    }


    async addProduct(newProduct) {
        //console.log(JSON.stringify(req.body))
        console.log('productmanager newProduct: ' + JSON.stringify(newProduct))
        const addedProductDocument = await this.productModel.create(newProduct);
        console.log(addedProductDocument)
        if (addedProductDocument) {
            console.log(chalk.green.inverse('New product added in manager!'));
            // Convert from Mongoose to plain object
            const savedProduct = addedProductDocument.toObject();
            console.log('saved product: ' + savedProduct)
            return savedProduct;
        } else
            console.log(chalk.red.inverse('Error in db creating the new product!'))
    }



    async deleteProductOfOrderId(id) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id
        //console.log('id of order to delete: ' + id)
        const foundProducts = await this.productModel.find({ orderId: id });
        console.log('product count: ' + foundProducts.length);
        const result = await this.productModel.deleteMany({ orderId: id });
        if (foundProducts.length > 0) {
            if (result.deletedCount > 0) {
                console.log("Products deleted successfully")
                return true
            } else {
                console.log("Product not found ")
                return false
            }
        } else {
            console.log('no products pof orderid found')
            return false
        }


    }

    async deleteProductOfId(productId) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id

        const result = await this.productModel.deleteOne({ id: productId });

        if (result.deletedCount > 1) {
            console.log("Product deleted successfully")
            return true
        } else {
            console.log("Product not found successfully")
            return false
        }
    }
}

export default MongooseProductManager;