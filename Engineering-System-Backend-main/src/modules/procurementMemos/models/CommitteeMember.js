import mongoose from "mongoose";

const committeeMemberSchema = new mongoose.Schema(
    {
        memoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Memo",
            required: [true, "Memo reference is required"],
        },
        name: {
            type: String,
            required: [true, "Member name is required"],
            trim: true,
        },
        rank: {
            type: String,
            trim: true,
            default: "",
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommitteeRole",
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        hasSigned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CommitteeMember", committeeMemberSchema);