import ProductSqliteModel from '../models/productSqliteModel.js'; // 引入 ProductSqlite 模型
import CartSqliteModel from '../models/cartSqliteModel.js'; // 引入 Cart 模型
import * as purchase from '../services/purchaseService.js';

// 直接購買
export const purchaseController = async (req, res) => {
    const data = req.body;
    try {
        const result = await purchase.purchaseService(data);
        if (result.status) {
            return res.sendStatus(201);
        }
        return res.status(400).json({ error: ` Server can't purchase Product: ${result.message}` });
    }
    catch (error) {
        console.log(error);
    }
}


// 購買下訂單
export const cartPurchaseController = async (req, res) => {
    try {
        const cartItems = await CartSqliteModel.findAll({ where: { user_id: userId } });

        // 檢查庫存
        for (let item of cartItems) {
            const product = await ProductSqliteModel.findByPk(item.item_id);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Item ${product ? product.name : ''} is out of stock` });
            }
        }

        // 更新庫存和清空購物車
        for (let item of cartItems) {
            const product = await ProductSqliteModel.findByPk(item.item_id);
            await product.update({ quantity: product.quantity - item.quantity });
        }

        await Cart.destroy({ where: { user_id: userId } });
        res.json({ message: 'Purchase completed' });
    } catch (error) {
        console.error("Error processing purchase:", error);
        res.status(500).json({ message: 'Error processing purchase' });
    }
}