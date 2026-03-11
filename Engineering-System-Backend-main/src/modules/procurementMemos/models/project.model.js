import mongoose from "mongoose";

// NOTE: This is a lightweight project reference model used only by the
// procurementMemos module. It stores the fields needed for the memo forms
// (project code, name, total cost, branch). It does NOT replace the main
// project model at src/modules/project/models/project.model.js.
const procurementProjectSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Project code is required"],
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        totalCost: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ProcurementProject", procurementProjectSchema);