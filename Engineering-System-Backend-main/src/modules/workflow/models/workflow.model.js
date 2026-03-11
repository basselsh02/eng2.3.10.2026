import mongoose from "mongoose";

const workflowStageSchema = new mongoose.Schema({
    office: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: [true, "المكتب/الكتيبة مطلوب لكل مرحلة"]
    },
    stageNumber: {
        type: Number,
        required: [true, "رقم المرحلة مطلوب"]
    },
    stageState: {
        type: String,
        enum: {
            values: ["waiting", "active", "fulfilled", "returned"],
            message: "حالة المرحلة يجب أن تكون: في الانتظار، نشط، مكتمل، أو مرجع"
        },
        default: "waiting"
    },
    numberOfReturns: {
        type: Number,
        default: 0,
        min: 0
    },
    notes: {
        type: String,
        trim: true,
        default: null
    },
    lastStateChangeAt: {
        type: Date,
        default: null
    },
    assignmentMode: {
        type: String,
        enum: {
            values: ["manager_assigns", "all_employees", "manager_only"],
            message: "نمط التعيين يجب أن يكون: تعيين المدير، جميع الموظفين، أو المدير فقط"
        },
        default: "manager_assigns"
    },
    rememberAssignee: {
        type: Boolean,
        default: false
    }
});

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "اسم سير العمل مطلوب"],
        trim: true
    },
    processId: {
        type: String,
        required: [true, "معرف العملية مطلوب"],
        unique: true,
        trim: true
    },
    processType: {
        type: String,
        required: [true, "نوع العملية مطلوب"],
        trim: true
    },
    stages: {
        type: [workflowStageSchema],
        required: [true, "يجب أن تحتوي سير العمل على مرحلة واحدة على الأقل"],
        validate: {
            validator: function (stages) {
                if (stages.length === 0) return false;
                
                // Check for duplicate stage numbers
                const stageNumbers = stages.map(s => s.stageNumber);
                const uniqueNumbers = new Set(stageNumbers);
                return stageNumbers.length === uniqueNumbers.size;
            },
            message: "لا يمكن أن تكون هناك مراحل بنفس الرقم"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    metadata: {
        totalStages: {
            type: Number,
            default: 0
        },
        completedStages: {
            type: Number,
            default: 0
        },
        currentStage: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true });

// Pre-save hook to update metadata
workflowSchema.pre("save", function (next) {
    if (this.stages && this.stages.length > 0) {
        this.metadata.totalStages = this.stages.length;
        this.metadata.completedStages = this.stages.filter(s => s.stageState === "fulfilled").length;
        
        // Find the lowest waiting stage or first active stage
        const firstWaiting = this.stages.find(s => s.stageState === "waiting");
        const firstActive = this.stages.find(s => s.stageState === "active");
        this.metadata.currentStage = firstActive ? firstActive.stageNumber : (firstWaiting ? firstWaiting.stageNumber : this.stages[0].stageNumber);
    }
    next();
});

// Indexes for better performance
workflowSchema.index({ processType: 1 });
workflowSchema.index({ createdBy: 1 });
workflowSchema.index({ isActive: 1 });
workflowSchema.index({ "stages.office": 1 });
workflowSchema.index({ "stages.stageState": 1 });
workflowSchema.index({ createdAt: -1 });

export default mongoose.model("Workflow", workflowSchema);
