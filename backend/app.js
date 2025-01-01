import express from 'express';
// import https from 'https';
import cors from 'cors';

// import { connectMongoDB } from './config/dbMongo.js';
import { connectSqlite, sequelize } from './config/dbSqlite.js';

import UserSqliteModel from './models/userSqliteModel.js';
import CardSqliteModel from './models/cardSqliteModel.js';
import ProductSqliteModel from './models/productSqliteModel.js';
import CartSqliteModel from './models/cartSqliteModel.js';
import PurchaseSqliteModel from './models/purchaseSqliteModel.js';

import establishRelations from './models/relation.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';

const app = express();
await connectSqlite();

const syncModels = async () => {
    try {
        // await UserSqliteModel.sync({ alter: true });
        // await CardSqliteModel.sync({ alter: true });
        // await ProductSqliteModel.sync({ alter: true });
        // await CartSqliteModel.sync({ alter: true });
        // await PurchaseSqliteModel.sync({ alter: true });

        // await sequelize.sync({ force: true });
        // await UserSqliteModel.update({ admin: true }, { where: { id: 1 } });
        
        // Create entry
        // const user = await UserSqliteModel.create({
            //     uname:'root',
            //     email:'howwilson11@gmail.com',
            //     password:'root',
            //     address:{district:'Changhua', city:'Changhua City', address: 'No. 1, Jinde-Road'},
            //     admin: true
            //   });
            // console.log(user);

        console.log('Database & tables created!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

await syncModels();
establishRelations();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/img", express.static('img')); // Host static image folder

// Routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', settingRoutes);
app.use('/api', imageRoutes);
app.use('/api', cartRoutes);
app.use('/api', purchaseRoutes);
await sequelize.sync({ force: false });

export default app;