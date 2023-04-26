import express from 'express';
//import Authenticator from '../middlewares/auth/MongooseJwtApiAuthenticator.js'
import productController from '../controllers/ProductController.js'


const theProductController = new productController();

// we need a router to chain them
const router = express.Router();


router.get("/:orderid", theProductController.listAllProducts)
router.post("/", theProductController.createProduct);
//router.delete("/:productid", theProductController.deleteOneProduct)
router.delete("/:orderid", theProductController.deleteManyProductsOrderId)


//router.get("/", theOrdersApiController.list)
//router.get("/", Authenticator.authenticateApi, theOrderController.listEverything)
//router.post("/", Authenticator.authenticateApi, theOrderController.create);
//router.delete("/:id", Authenticator.authenticateApi, orderController.delete);
//router.put("/:id", Authenticator.authenticateApi, orderController.update);


// more later
export default router;