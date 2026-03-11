import mongoose from "mongoose";

const committeeTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Committee type name is required"],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CommitteeType", committeeTypeSchema);