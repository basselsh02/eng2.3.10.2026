import mongoose from "mongoose";

const committeeRoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role name is required"],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CommitteeRole", committeeRoleSchema);