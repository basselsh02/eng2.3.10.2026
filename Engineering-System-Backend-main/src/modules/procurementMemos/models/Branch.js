import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Branch code is required"],
            trim: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Branch name is required"],
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);