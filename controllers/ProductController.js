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
            const allProducts = await this.theProductManager.getProductOfOrderId(req.params.orderid);
            if (allProducts) {
                const orders = allProducts.map(document => this.includeData(document));
                console.log("list everything!!")
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


    createProduct = async (req, res) => {
        try {
            console.log('req: ' + req);
            

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                //Save product.
                const createdProduct = await this.theProductManager.addProduct(req.body);
                console.log('createdProduct: ' + createdProduct);
                if (!createdProduct) {
                    return apiResponse.errorResponse(res, 'Could not create product');
                } else {
                    let productData = this.includeData(createdProduct);
                    console.log(productData + ' productData')
                    return apiResponse.successResponseWithData(res, "product add Success.", productData);
                };
            }
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }


}

export default ProductController;