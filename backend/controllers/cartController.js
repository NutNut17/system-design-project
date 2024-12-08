import ProductSqliteModel from '../models/ProductSqliteModel.js'; // 引入 ProductSqliteModel 模型
import CartSqliteModel from '../models/CartSqliteModel.js'; // 引入 Cart 模型


// 添加商品到購物車
export const addCartController = async (req, res) => {
    const userId = req.user.id; // 從中介軟體中取得使用者 ID
    const { itemId, quantity } = req.body; // 從請求中取得商品 ID 和數量

    try {
        await CartSqliteModel.create({ user_id: userId, item_id: itemId, quantity });
        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
}

// 獲取使用者的購物車資料
export const getCartController = async (req, res) => {
    const userId = req.user.id; // 確定使用者 ID

    try {
        const cartItems = await CartSqliteModel.findAll({
            where: { user_id: userId },
            include: [{ model: ProductSqliteModel, attributes: ['name', 'price', 'description'] }] // 包含商品資訊
        });
        res.json(cartItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
}

// 檢查購物車中的商品庫存
export const checkCartController = async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        const product = await ProductSqliteModel.findByPk(itemId); // 查詢商品
        if (product && product.quantity >= quantity) {
            res.json({ available: true });
        } else {
            res.json({ available: false });
        }
    } catch (error) {
        console.error("Error checking item availability:", error);
        res.status(500).json({ message: 'Error checking item availability' });
    }
}

// 購買下訂單
export const purchaseController = async (req, res) => {
    const userId = req.user.id; // 取得使用者 ID

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