import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "اسم المكتب/الكتيبة مطلوب"],
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: [true, "رمز المكتب/الكتيبة مطلوب"],
        unique: true,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        enum: {
            values: ["مكتب", "كتيبة"],
            message: "نوع المكتب يجب أن يكون إما 'مكتب' أو 'كتيبة'"
        },
        default: "مكتب"
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    organizationalUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    permissions: [{
        action: {
            type: String,
            required: true,
            trim: true,
        },
        scope: {
            type: String,
            enum: ["OWN_UNIT", "CUSTOM_UNITS", "OWN_UNIT_AND_CHILDREN", "ALL"],
            required: true
        },
        units: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrganizationalUnit"
        }]
    }]
}, { timestamps: true });

// Indexes for better performance
officeSchema.index({ name: 1 });
officeSchema.index({ code: 1 });
officeSchema.index({ type: 1 });
officeSchema.index({ managerId: 1 });
officeSchema.index({ isActive: 1 });

export default mongoose.model("Office", officeSchema);
