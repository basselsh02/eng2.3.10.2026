import mongoose from "mongoose";

const workflowTaskOfficeLogSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: [true, "معرف المهمة مطلوب"],
        index: true
    },
    workflowStepId: {
        type: String,
        required: [true, "معرف خطوة سير العمل مطلوب"]
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: [true, "معرف المكتب مطلوب"],
        index: true
    },
    status: {
        type: String,
        enum: ["at_manager", "at_employee", "returned_to_previous", "forwarded"],
        default: "at_manager",
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    arrivedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    assignedToEmployeeAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    returnedAt: {
        type: Date,
        default: null
    },
    wasReturned: {
        type: Boolean,
        default: false
    },
    totalTimeInOffice: {
        type: Number, // in seconds
        default: 0
    },
    timeAtManager: {
        type: Number, // in seconds
        default: 0
    },
    timeAtEmployee: {
        type: Number, // in seconds
        default: 0
    },
    visitCount: {
        type: Number,
        default: 1,
        min: 1
    },
    notes: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Indexes for efficient queries
workflowTaskOfficeLogSchema.index({ taskId: 1, officeId: 1 });
workflowTaskOfficeLogSchema.index({ taskId: 1, arrivedAt: -1 });
workflowTaskOfficeLogSchema.index({ officeId: 1, status: 1, arrivedAt: -1 });
workflowTaskOfficeLogSchema.index({ managerId: 1 });
workflowTaskOfficeLogSchema.index({ employeeId: 1 });

// Pre-save hook to calculate time durations
workflowTaskOfficeLogSchema.pre("save", function (next) {
    // Calculate timeAtManager if assignedToEmployeeAt is set
    if (this.assignedToEmployeeAt && this.arrivedAt) {
        const managerTime = Math.floor((new Date(this.assignedToEmployeeAt) - new Date(this.arrivedAt)) / 1000);
        this.timeAtManager = managerTime > 0 ? managerTime : 0;
    }

    // Calculate timeAtEmployee if completedAt is set
    if (this.completedAt && this.assignedToEmployeeAt) {
        const employeeTime = Math.floor((new Date(this.completedAt) - new Date(this.assignedToEmployeeAt)) / 1000);
        this.timeAtEmployee = employeeTime > 0 ? employeeTime : 0;
    }

    // Calculate totalTimeInOffice
    if (this.completedAt && this.arrivedAt) {
        const totalTime = Math.floor((new Date(this.completedAt) - new Date(this.arrivedAt)) / 1000);
        this.totalTimeInOffice = totalTime > 0 ? totalTime : 0;
    } else if (this.returnedAt && this.arrivedAt) {
        const totalTime = Math.floor((new Date(this.returnedAt) - new Date(this.arrivedAt)) / 1000);
        this.totalTimeInOffice = totalTime > 0 ? totalTime : 0;
    }

    next();
});

export default mongoose.model("WorkflowTaskOfficeLog", workflowTaskOfficeLogSchema);
