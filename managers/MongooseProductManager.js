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
        const foundOrders = await this.productModel.find({ orderId: id });

        if (foundOrders) {
            console.log(chalk.green.inverse('Found orders ' + foundOrders));
            // Convert to POJO
            return foundOrders.toObject();
        } else {
            console.log(chalk.red.inverse(`Note not found with id =${id} !`))
        }

        return null;
    }
}

export default MongooseProductManager;