import express from 'express';
import Authenticator from '../middlewares/auth/MongooseJwtApiAuthenticator.js'
import orderController from '../controllers/OrderController.js'
const theOrderController = new orderController();

// we need a router to chain them
const router = express.Router();


router.get("/", Authenticator.authenticateApi, theOrderController.listUsersOrders)
router.post("/", Authenticator.authenticateApi, theOrderController.createOrder);
router.delete("/:orderid", Authenticator.authenticateApi, theOrderController.deleteOrder);

//router.get("/", theOrdersApiController.list)
//router.get("/", Authenticator.authenticateApi, theOrderController.listEverything)
//router.post("/", Authenticator.authenticateApi, theOrderController.create);
//router.delete("/:id", Authenticator.authenticateApi, orderController.delete);
//router.put("/:id", Authenticator.authenticateApi, orderController.update);


// more later
export default router;