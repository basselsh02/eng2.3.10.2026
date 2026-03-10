import express from "express";
import * as publicationMemoController from "../controllers/publicationMemo.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(publicationMemoController.createPublicationMemo)
    .get(publicationMemoController.getAllPublicationMemos);

router.route("/:id")
    .get(publicationMemoController.getPublicationMemoById)
    .patch(publicationMemoController.updatePublicationMemo)
    .delete(publicationMemoController.deletePublicationMemo);

export default router;
