import mongoose from "mongoose";

const billOfQuantitiesSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    itemNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizationalUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

billOfQuantitiesSchema.index({ project: 1 });
billOfQuantitiesSchema.index({ organizationalUnit: 1 });
billOfQuantitiesSchema.index({ createdAt: -1 });

export default mongoose.model("BillOfQuantities", billOfQuantitiesSchema);