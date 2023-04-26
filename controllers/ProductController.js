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
            console.log('req head: ' + JSON.stringify(req.head))
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

    deleteOneProduct = async (req, res) => {
        //console.log('order delete req.params.id: ' + req.params.orderid)

        try {
            const productId = req.params.productid;

            let result = this.theProductManager.deleteProductOfId(req.params.productid);
            console.log("reuslt: " + result)
            if (result) {
                return apiResponse.successResponseWithData(res, "Product delete Success.")
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    deleteManyProductsOrderId = async (req, res) => {
        //console.log('order delete req.params.id: ' + req.params.orderid)

        try {
            const orderId = req.params.orderid;

            let result = this.theProductManager.deleteProductOfOrderId(req.params.orderid);
            console.log("reuslt: " + result)
            if (result) {
                return apiResponse.successResponseWithData(res, "Products delete Success.")
            }


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // async (req, res) => {
    //         try {
    //             //k wNote.findById(req.params.id, function (err, foundNote) {
    //             const foundOrder = await this.OrderManager.getOrderById(req.user, req.params.id);
    //             if (foundOrder === null) {
    //                 return apiResponse.notFoundResponse(res, "Order not exists with this id");
    //             } else {
    //                 //delete note.
    //                 const removedOrder = await this.OrderManager.removeOrder(req.user, req.params.id);
    //                 if (!removedOrder) {
    //                     return apiResponse.errorResponse(res, 'Could not delete the order');
    //                 } else {
    //                     return apiResponse.successResponse(res, "order delete Success.");
    //                 }

    //             }

    //         } catch (err) {
    //             //throw error in json response with status 500. 
    //             return apiResponse.errorResponse(res, err);
    //         }
    //     }


}

export default ProductController;