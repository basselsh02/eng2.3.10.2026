import mongoose from "mongoose";

const maintenanceReportSchema = new mongoose.Schema(
  {
    projectNumber: {
      type: String,
      required: [true, "رقم المشروع مطلوب"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    projectName: {
      type: String,
      required: [true, "بيان المشروع مطلوب"],
      trim: true,
    },
    disbursedAmount: {
      type: Number,
      required: [true, "المبلغ المنصرف مطلوب"],
      min: [0, "المبلغ المنصرف يجب أن يكون رقمًا موجبًا"],
    },
    fromDate: {
      type: Date,
      required: [true, "تاريخ البداية مطلوب"],
    },
    toDate: {
      type: Date,
      required: [true, "تاريخ النهاية مطلوب"],
      validate: {
        validator(value) {
          return !this.fromDate || value >= this.fromDate;
        },
        message: "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية",
      },
    },
    projectLocations: {
      type: String,
      trim: true,
      default: "",
    },
    isStopped: {
      type: Boolean,
      default: false,
    },
    stoppedNote: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator(value) {
          if (this.isStopped) {
            return Boolean(value?.trim());
          }
          return true;
        },
        message: "سبب الإيقاف مطلوب عند تفعيل حالة متوقف",
      },
    },
    hallReceiptDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceReport", maintenanceReportSchema);
