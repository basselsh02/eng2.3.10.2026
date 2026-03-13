import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const officeTaskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    office: {
      type: String,
      enum: [
        "مكتب الصيانة",
        "مكتب العقود",
        "مكتب الحسابات",
        "مكتب المشتريات",
        "مكتب التوريدات",
        "مكتب الميزانية",
        "مكتب النشر",
      ],
      required: true,
    },
    arrivedAt: { type: Date, default: Date.now },
    assignedAt: { type: Date, default: null },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    exitDate: { type: Date, default: null },
    notes: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

officeTaskSchema.plugin(mongoosePaginate);

export default mongoose.model("OfficeTask", officeTaskSchema);
