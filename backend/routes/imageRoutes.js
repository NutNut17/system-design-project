import express from 'express';
import { getImagesController, uploadImageController, deleteImagesController } from '../controllers/imageController.js';
import { upload } from '../middleware/uploadImage.js';

const router = express.Router();

router.get("/images/:id", getImagesController);
router.post("/images", upload.single("image"), uploadImageController);
router.delete('/images/:id', deleteImagesController);

export default router;
