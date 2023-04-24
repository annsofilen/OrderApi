import { check, body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse.js";
import MongooseOrderManager from '../managers/MongooseOrderManager.js'
import MongooseProductManager from '../managers/MongooseProductManager.js'


class ProductController {
    constructor() {
        //this.theOrderManager = new MongooseOrderManager();
        this.theProductManager = new MongooseProductManager();
    }

    /**
 * Converts to POJO
 */
    includeData(data) {
        // Here we can choose what data to include
        return {
            orderId: data.orderId,
            name: data.name,
            brand: data.brand,
            price: data.price,
            description: data.description,
            createdAt: data.createdAt
        }
    }

    /**
    * Order List.
    * 
    * //returns {Object}
    */
    listAllProducts = async (req, res) => {
        try {
            const allOrders = await this.theProductManager.getProductOfOrderId(req.params.id);
            if (allOrders.length > 0) {
                const orders = allOrders.map(document => this.includeData(document));
                console.log("list everything")
                return apiResponse.successResponseWithData(res, "Operation success", orders);
            } else {
                return apiResponse.successResponseWithData(res, "Operation success", []);
            }
            //});
        } catch (err) {
            //throw error in json response with status 500. 
            return apiResponse.errorResponse(res, err);
        }
    }

}

export default ProductController;