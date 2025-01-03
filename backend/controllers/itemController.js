import ProductSqlite from '../models/productSqliteModel.js'; // 引入 ProductSqlite 模型
import Cart from '../models/cart.js'; // 引入 Cart 模型

const itemController = {
    // 獲取所有商品的重點資料
    getItems: async (req, res) => {
        try {
            const products = await ProductSqlite.findAll({
                attributes: ['id', 'name', 'price', 'description', 'quantity', 'ratingScore', 'ratingCount'] // 查詢特定欄位
            });
            res.json(products); // 回傳商品列表
        } catch (error) {
            console.error("Error fetching items:", error);
            res.status(500).json({ message: 'Error fetching items' });
        }
    },

    // 根據商品 ID 獲取商品詳細資料
    getItem: async (req, res) => {
        const productId = req.params.id; // 取得 URL 中的商品 ID
        try {
            const product = await ProductSqlite.findByPk(productId); // 根據主鍵（ID）查詢商品
            if (product) {
                res.json(product); // 若找到，回傳商品資料
            } else {
                res.status(404).json({ message: 'Item not found' }); // 若無商品，回傳 404 錯誤
            }
        } catch (error) {
            console.error("Error fetching item:", error);
            res.status(500).json({ message: 'Error fetching item' });
        }
    },

    // 添加商品到購物車
    addCart: async (req, res) => {
        const userId = req.user.id; // 從中介軟體中取得使用者 ID
        const { itemId, quantity } = req.body; // 從請求中取得商品 ID 和數量

        try {
            await Cart.create({ user_id: userId, item_id: itemId, quantity });
            res.status(201).json({ message: 'Item added to cart' });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ message: 'Error adding item to cart' });
        }
    },

    // 獲取使用者的購物車資料
    getCart: async (req, res) => {
        const userId = 1; // 暂时硬编码为 1，用于测试

        try {
            const cartItems = await Cart.findAll({
                where: { user_id: userId },
                include: [{ model: ProductSqlite, attributes: ['name', 'price', 'description'] }] // 包含商品資訊
            });
            res.json(cartItems);
        } catch (error) {
            console.error("Error fetching cart:", error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    },

    // 檢查購物車中的商品庫存
    checkCart: async (req, res) => {
        const { itemId, quantity } = req.body;

        try {
            const product = await ProductSqlite.findByPk(itemId); // 查詢商品
            if (product && product.quantity >= quantity) {
                res.json({ available: true });
            } else {
                res.json({ available: false });
            }
        } catch (error) {
            console.error("Error checking item availability:", error);
            res.status(500).json({ message: 'Error checking item availability' });
        }
    },

    // 購買下訂單
    purchase: async (req, res) => {
        const userId = req.user.id; // 取得使用者 ID

        try {
            const cartItems = await Cart.findAll({ where: { user_id: userId } });

            // 檢查庫存
            for (let item of cartItems) {
                const product = await ProductSqlite.findByPk(item.item_id);
                if (!product || product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Item ${product ? product.name : ''} is out of stock` });
                }
            }

            // 更新庫存和清空購物車
            for (let item of cartItems) {
                const product = await ProductSqlite.findByPk(item.item_id);
                await product.update({ quantity: product.quantity - item.quantity });
            }

            await Cart.destroy({ where: { user_id: userId } });
            res.json({ message: 'Purchase completed' });
        } catch (error) {
            console.error("Error processing purchase:", error);
            res.status(500).json({ message: 'Error processing purchase' });
        }
    },
};

export default itemController; // 匯出整個控制器對象