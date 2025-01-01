

import User from './userSqliteModel.js';
import Card from './cardSqliteModel.js';
import Product from './productSqliteModel.js';
import Cart from './cartSqliteModel.js';
import Purchase from './purchaseSqliteModel.js';

const establishRelations = () => {
    // // Wallet Relationship (User and Card - Many-to-Many)
    // User.belongsToMany(Card, { through: 'Wallet', foreignKey: 'user_id' });
    // Card.belongsToMany(User, { through: 'Wallet', foreignKey: 'card_id' });

    // // Cart Relationship (User and Product - Many-to-Many)
    // User.belongsToMany(Product, { through: Cart, foreignKey: 'user_id' });
    // Product.belongsToMany(User, { through: Cart, foreignKey: 'item_id' });

    // // Purchase Model (Explicit Table)
    // Purchase.belongsTo(User, { foreignKey: 'user_id' });
    // Purchase.belongsTo(Product, { foreignKey: 'item_id' });
    // Purchase.belongsTo(Card, { foreignKey: 'card_id' });

    // User and Cart Relationship (Many-to-Many through Cart)
    User.belongsToMany(Product, { through: Cart, foreignKey: 'user_id', otherKey: 'item_id' });
    Product.belongsToMany(User, { through: Cart, foreignKey: 'item_id', otherKey: 'user_id' });

    // Purchase Relationship (Explicit Table)
    Purchase.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Purchase, { foreignKey: 'user_id' });

    Purchase.belongsTo(Product, { foreignKey: 'item_id' });
    Product.hasMany(Purchase, { foreignKey: 'item_id' });

    // Cart Relationship
    Cart.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Cart, { foreignKey: 'user_id' });

    Cart.belongsTo(Product, { foreignKey: 'item_id' });
    Product.hasMany(Cart, { foreignKey: 'item_id' });


    console.log('Relations established');
};

export default establishRelations;
