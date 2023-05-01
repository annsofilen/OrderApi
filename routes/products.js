import express from 'express';
import Authenticator from '../middlewares/auth/MongooseJwtApiAuthenticator.js'
import productController from '../controllers/ProductController.js'


const theProductController = new productController();

// we need a router to chain them
const router = express.Router();


router.get("/:orderid", Authenticator.authenticateApi, theProductController.listAllProducts)
router.post("/", Authenticator.authenticateApi, theProductController.createProduct);
router.delete("/:productid", Authenticator.authenticateApi, theProductController.deleteOneProduct)
router.put("/:productid", Authenticator.authenticateApi, theProductController.updateProduct)

//router.delete("/:orderid", theProductController.deleteManyProductsOrderId) //will never be used


//router.get("/", theOrdersApiController.list)
//router.get("/", Authenticator.authenticateApi, theOrderController.listEverything)
//router.post("/", Authenticator.authenticateApi, theOrderController.create);
//router.delete("/:id", Authenticator.authenticateApi, orderController.delete);
//router.put("/:id", Authenticator.authenticateApi, orderController.update);


// more later
export default router;