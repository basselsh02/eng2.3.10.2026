import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "express-async-errors"; // Must be after express

import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";

import authRouter from "./src/modules/User/routes/auth.routes.js";

import userRouter from "./src/modules/User/routes/user.routes.js";
import profileRouter from "./src/modules/User/routes/profile.routes.js";
import filesRouter from "./src/modules/files/routes/files.routes.js";
import organizationalUnitRouter from "./src/modules/organizationalUnit/routes/organizationalUnit.route.js";
import financialFlowRoutes from "./src/modules/financialFlow/routes/financialFlow.route.js";
import financialTransactionRoutes from "./src/modules/financialTransaction/routes/financialTransaction.route.js";
import projectRouter from "./src/modules/project/routes/project.route.js";
import billOfQuantitiesRouter from "./src/modules/billOfQuantities/routes/billOfQuantities.routes.js";
import procedureRouter from "./src/modules/procedures/routes/procedure.route.js";
import financialProcedureRouter from "./src/modules/financialProcedures/routes/financialProcedure.route.js";
import financialStatusRouter from "./src/modules/financialStatus/routes/financialStatus.route.js";
import officeRouter from "./src/modules/office/routes/office.routes.js";
import workflowRouter from "./src/modules/workflow/routes/workflow.routes.js";
import fieldPermissionRouter from "./src/modules/fieldPermissions/routes/fieldPermission.routes.js";
import projectDataRouter from "./src/modules/projectData/routes/projectData.routes.js";
import projectPublicationRouter from "./src/modules/projectPublication/routes/projectPublication.routes.js";
import collectionRouter from "./src/modules/collections/routes/collection.routes.js";
import bookletSaleRouter from "./src/modules/bookletSales/routes/bookletSale.routes.js";
import publicationMemoRouter from "./src/modules/publicationMemos/routes/publicationMemo.routes.js";
import maintenanceReportRouter from "./src/modules/maintenanceReports/routes/maintenanceReport.routes.js";
import auditLogRouter from "./src/modules/auditLog/routes/auditLog.routes.js";
import workflowActivityRouter from "./src/modules/workflow/routes/workflowActivity.routes.js";
import contractBudgetStatementRouter from "./src/modules/budgetOffice/routes/contractBudgetStatement.route.js";
import financialDeductionRouter from "./src/modules/budgetOffice/routes/financialDeduction.route.js";
import guaranteeLetterRouter from "./src/modules/guaranteeLetters/routes/guaranteeLetter.routes.js";
import claimRouter from "./src/modules/claims/routes/claim.routes.js";
import officeTaskRouter from "./src/modules/officeTasks/routes/officeTask.routes.js";
import logger from "./src/utils/logger.js";
import { protect } from "./src/middleware/auth.middleware.js";
import { attachSessionId, auditLogger, trackSessionActivity } from "./src/middleware/auditLogger.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidateEnvFiles = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "..", ".env"),
];

for (const envPath of candidateEnvFiles) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Session tracking middleware (before protect)
app.use(attachSessionId);


// Connect DB
(async () => {
    await connectDB();
})();


app.get("/", (req, res) => {
    res.send("API working");
});

// Serve uploads
app.use("/uploads", express.static("uploads"));
app.use('/avatars', express.static('public/avatars'));

// Routes
app.use("/api/files", filesRouter);
app.use("/api/auth", authRouter);

// Protected routes with audit logging
app.use("/api/users", protect, trackSessionActivity, auditLogger, userRouter);
app.use("/api/profile", protect, trackSessionActivity, auditLogger, profileRouter);
app.use("/api/units", protect, trackSessionActivity, auditLogger, organizationalUnitRouter);
app.use("/api/projects", protect, trackSessionActivity, auditLogger, projectRouter);
app.use("/api/procedures", protect, trackSessionActivity, auditLogger, procedureRouter);
app.use("/api/financial-procedures", protect, trackSessionActivity, auditLogger, financialProcedureRouter);
app.use("/api/financial-status", protect, trackSessionActivity, auditLogger, financialStatusRouter);
app.use("/api/financial-flows", protect, trackSessionActivity, auditLogger, financialFlowRoutes);
app.use("/api/financial-transactions", protect, trackSessionActivity, auditLogger, financialTransactionRoutes);
app.use("/api/bill-of-quantities", protect, trackSessionActivity, auditLogger, billOfQuantitiesRouter);
app.use("/api/offices", protect, trackSessionActivity, auditLogger, officeRouter);
app.use("/api/workflows", protect, trackSessionActivity, auditLogger, workflowRouter);
app.use("/api/field-permissions", protect, trackSessionActivity, auditLogger, fieldPermissionRouter);
app.use("/api/project-data", protect, trackSessionActivity, auditLogger, projectDataRouter);
app.use("/api/project-publications", protect, trackSessionActivity, auditLogger, projectPublicationRouter);
app.use("/api/collections", protect, trackSessionActivity, auditLogger, collectionRouter);
app.use("/api/booklet-sales", protect, trackSessionActivity, auditLogger, bookletSaleRouter);
app.use("/api/publication-memos", protect, trackSessionActivity, auditLogger, publicationMemoRouter);
app.use("/api/maintenance-reports", protect, trackSessionActivity, auditLogger, maintenanceReportRouter);
app.use("/api/audit-logs", protect, auditLogRouter);
app.use("/api/workflow-activity", protect, workflowActivityRouter);
app.use("/api/contract-budget-statements", protect, trackSessionActivity, auditLogger, contractBudgetStatementRouter);
app.use("/api/financial-deductions", protect, trackSessionActivity, auditLogger, financialDeductionRouter);
app.use("/api/guarantee-letters", protect, trackSessionActivity, auditLogger, guaranteeLetterRouter);
app.use("/api/claims", protect, trackSessionActivity, auditLogger, claimRouter);
app.use("/api/office-tasks", protect, officeTaskRouter);

app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
