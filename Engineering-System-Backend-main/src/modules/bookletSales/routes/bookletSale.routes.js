import express from "express";
import * as bookletSaleController from "../controllers/bookletSale.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(bookletSaleController.createBookletSale)
    .get(bookletSaleController.getAllBookletSales);

router.route("/:id")
    .get(bookletSaleController.getBookletSaleById)
    .patch(bookletSaleController.updateBookletSale)
    .delete(bookletSaleController.deleteBookletSale);

export default router;
