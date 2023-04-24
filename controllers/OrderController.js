import { check, body, validationResult } from "express-validator";
import apiResponse from "../helpers/apiResponse.js";
import MongooseOrderManager from '../managers/MongooseOrderManager.js'


class OrdersApiController {
    constructor() {
        this.OrderManager = new MongooseOrderManager();
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

    // list2 = async (req, res) => {
    //     try {
    //         const allOrders = await this.OrderManager.fetchOrders(req.user);
    //         if (allOrders.length > 0) {
    //             const orders = allOrders//.map(document => this.includeData(document));
    //             return apiResponse.successResponseWithData(res, "Operation success", orders);
    //         } else {
    //             return apiResponse.successResponseWithData(res, "Operation success", []);
    //         }
    //         //});
    //     } catch (err) {
    //         //throw error in json response with status 500. 
    //         return apiResponse.errorResponse(res, err);
    //     }
    // }


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