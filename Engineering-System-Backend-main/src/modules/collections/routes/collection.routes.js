import express from "express";
import * as collectionController from "../controllers/collection.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(collectionController.createCollection)
    .get(collectionController.getAllCollections);

router.route("/:id")
    .get(collectionController.getCollectionById)
    .patch(collectionController.updateCollection)
    .delete(collectionController.deleteCollection);

export default router;
