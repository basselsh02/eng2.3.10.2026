import mongoose from "mongoose";

const organizationalUnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
        default: null,
    },
    path: {
        type: String,
        index: true,
    },
    level: {
        type: Number,
        default: 0,
    },
    childrenCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

organizationalUnitSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("parent")) {
        if (this.parent) {
            const parentUnit = await this.constructor.findById(this.parent);
            if (parentUnit) {
                this.level = parentUnit.level + 1;
                this.path = `${parentUnit.path}/${this._id}`;
                parentUnit.childrenCount = await this.constructor.countDocuments({ parent: this.parent });
                await parentUnit.save();
            }
        } else {
            this.level = 0;
            this.path = this._id.toString();
        }
    }
    next();
});

export default mongoose.model("OrganizationalUnit", organizationalUnitSchema);