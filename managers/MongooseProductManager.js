import chalk from 'chalk';
import Product from '../models/ProductModel.js';
import mongoose from 'mongoose';

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
        console.log('productmanager newProduct orderid: ' + (newProduct.orderId))
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



    async deleteProductsOfOrderId(id) {

        try {


            // On a query we can use lean to get a plain javascript object
            // Use mongoose criteria for id and belongsTo user
            //pick user.id
            //console.log('id of order to delete: ' + id)
            const foundProducts = await this.productModel.find({ orderId: id });

            if (foundProducts.length > 0) {
                console.log('products count: ' + foundProducts.length);
                let result = await this.productModel.deleteMany({ orderId: id });
                if (result.deletedCount > 0) {
                    console.log("Delete count: " + result.deletedCount + JSON.stringify(result))
                }
                if (result.deletedCount === 0) {
                    console.log("Delete count ZERO: " + result.deletedCount + JSON.stringify(result))
                }
                console.log("Products deleted successfully" + JSON.stringify(result))
                return result
            } else {
                console.log("No products found ")
                return false
            }

        }
        catch (error) {
            console.log(error)
        }

    }

    async deleteProductOfId(id) {
        try {


            const foundProducts = await this.productModel.find({ _id: id });
            console.log('found: ' + foundProducts)

            if (foundProducts.length > 0) {
                console.log('Product count: ' + foundProducts.length);
                let result = await this.productModel.deleteMany({ _id: id });
                if (result.deletedCount > 0) {
                    console.log('product count: ' + foundProducts.length);
                    console.log("Delete count: " + result.deletedCount + JSON.stringify(result))
                }
                if (result.deletedCount === 0) {
                    console.log("Delete count ZERO: " + result.deletedCount + JSON.stringify(result))
                }
                console.log("Products deleted successfully" + JSON.stringify(result))
                return result
            } else {
                console.log("No products found ")
                return false
            }
        }
        catch (error) {
            console.log(error)
        }

    }


    async updateProductOfId(productId, newInfo) {
        try {
            const product = await Product.findById(productId).lean().exec();
            if (!product) {
                console.log(`No product found with the given ID: ${productId}`);
                return null;
            }
            console.log(`Product found: ${JSON.stringify(product)}`);
            const result = await this.productModel.updateOne({ _id: productId }, { $set: { name: newInfo.name, pride: newInfo.price, brand: newInfo.brand, description: newInfo.description } }).exec();
            console.log(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default MongooseProductManager;