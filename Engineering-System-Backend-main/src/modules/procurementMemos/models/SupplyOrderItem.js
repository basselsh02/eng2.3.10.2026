import mongoose from "mongoose";

const supplyOrderItemSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SupplyOrder",
            required: [true, "Supply order reference is required"],
        },
        itemNumber: {
            type: Number,
            required: [true, "Item number is required"],
        },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            default: null,
        },
        quantity: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 0 },
        // total computed: quantity × unitPrice — NOT stored
    },
    { timestamps: true }
);

export default mongoose.model("SupplyOrderItem", supplyOrderItemSchema);