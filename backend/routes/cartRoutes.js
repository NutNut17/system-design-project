import express from 'express';
import { addCartController, getCartController, checkCartController ,removeItemFromCart, getCartsController} from '../controllers/cartController.js'; // 使用默認匯入

const router = express.Router();

router.post('/addcart',  addCartController);
router.post('/getcart', getCartController);
router.post('/checkcart', checkCartController);
router.post('/removecart',removeItemFromCart);
router.get('/carts', getCartsController);

export default router;