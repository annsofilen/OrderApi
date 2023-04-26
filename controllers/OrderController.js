import { check, body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse.js";
import MongooseOrderManager from '../managers/MongooseOrderManager.js'
import OrderModel from '../models/OrderModel.js';
import MongooseProductManager from "../managers/MongooseProductManager.js";


class OrdersApiController {
    constructor() {
        this.OrderManager = new MongooseOrderManager();
        this.theProductManager = new MongooseProductManager();
    }

    /**
 * Converts to POJO
 */
    includeData(data) {
        // Here we can choose what data to include
        return {
            id: data.id,
            createdAt: data.createdAt,
        }
    }

    /**
    * Order List.
    * 
    * //returns {Object}
    */
    listEverything = async (req, res) => {
        try {
            const allOrders = await this.OrderManager.fetchAllOrders();
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


    createOrder = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                //Save order.
                const createdOrder = await this.OrderManager.addOrder(req.body);
                if (!createdOrder) {
                    return apiResponse.errorResponse(res, 'Could not create order');
                } else {
                    let orderData = this.includeData(createdOrder);
                    return apiResponse.successResponseWithData(res, "Order add Success.", orderData);
                };
            }
        } catch (error) {

        }
    }

    deleteOrder = async (req, res) => {
        //console.log('order delete req.params.id: ' + req.params.orderid)

        try {
            const orderId = req.params.orderid;
            console.log(orderId + ' in delete in controller order ' + req.params.orderid);
            let result = this.OrderManager.deleteOrder(req.params.orderid);
            let result2 = this.theProductManager.deleteProductOfOrderId(req.params.orderid)
            return apiResponse.successResponseWithData(res, "Order delete Success.")

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });

        }
    }




    // /**
    // * Order Create.
    // * 
    // * param {string}      title 
    // * param {string}      body
    //  * 
    // * returns {Object}
    // */
    // create = [
    //     // a list of callbacks
    //     //check("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
    //     //check("body", "Body may be empty.").trim(),
    //     //body("*").escape(),
    //     async (req, res) => {
    //         try {
    //             const errors = validationResult(req);
    //             if (!errors.isEmpty()) {
    //                 return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
    //             } else {
    //                 //Save note.
    //                 const createdOrder = await this.OrderManager.addOrder(req.user, req.body.orderTotal);
    //                 if (!createdOrder) {
    //                     return apiResponse.errorResponse(res, 'Could not create order');
    //                 } else {
    //                     let orderData = this.includeData(createdOrder);
    //                     return apiResponse.successResponseWithData(res, "Order add Success.", orderData);
    //                 };
    //             }
    //         } catch (err) {
    //             //throw error in json response with status 500. 
    //             return apiResponse.errorResponse(res, err);
    //         }
    //     }
    // ]


    // /**
    //  * Note Delete.
    //  * 
    //  * param {string}      id
    //  * 
    //  * returns {Object}
    //  */
    // delete = [
    //     async (req, res) => {
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
    // ]

    // update = [
    //     async (req, res) => {
    //         try {
    //             //k wNote.findById(req.params.id, function (err, foundNote) {
    //             const foundOrder = await this.OrderManager.getOrderById(req.user, req.params.id);
    //             if (foundOrder === null) {
    //                 return apiResponse.notFoundResponse(res, "Order not exists with this id");
    //             } else {
    //                 //update note.
    //                 let newOrder = {
    //                     id: req.params.id,
    //                     orderTotal: req.params.orderTotal,
    //                 }
    //                 const updatedOrder = await this.OrderManager.updateOrder(req.user, newOrder);
    //                 if (!updatedOrder) {
    //                     return apiResponse.errorResponse(res, 'Could not update the order');
    //                 } else {
    //                     return apiResponse.successResponse(res, "order update Success.");
    //                 }

    //             }

    //         } catch (err) {
    //             //throw error in json response with status 500. 
    //             return apiResponse.errorResponse(res, err);
    //         }
    //     }

    // ]
}

export default OrdersApiController;