import { z } from "zod";
import { AppError } from "../utils/AppError.js";

const companySchema = z.object({
    companyCode: z.string().min(1),
    commercialRegister: z.string().min(1),
    securityApprovalNumber: z.string().min(1),
    securityApprovalDate: z.preprocess(
        (val) => val instanceof Date ? val : new Date(val),
        z.date()
    ),
    fiscalYear: z.string().min(1),
    companyName: z.string().min(1),
    companyCategory: z.string().min(1),
    companyBrand: z.string().optional(),
    companyActivity: z.string().min(1),
    ownerName: z.string().min(1),
    ownerNID: z.string().min(1),
    representativeName: z.string().optional(),
    address: z.string().min(1),
    phones: z.array(z.string()).min(1),
    fax: z.string().optional(),
    email: z.string().email(),
    legalForm: z.string().min(1),
    securityFileNumber: z.string().optional(),
});

export const validateCompany = (req, res, next) => {
    try {
        companySchema.parse(req.body);
        next();
    } catch (err) {
        next(new AppError(err.errors.map(e => e.message).join(", "), 400));
    }
};

const billOfQuantitiesSchema = z.object({
    project: z.string().min(1, "Project is required"),
    itemNumber: z.string().min(1, "Item number is required"),
    description: z.string().min(1, "Description is required"),
    unit: z.string().min(1, "Unit is required"),
    quantity: z.number().positive("Quantity must be a positive number"),
    unitPrice: z.number().positive("Unit price must be a positive number"),
    totalPrice: z.number().positive("Total price must be a positive number"),
});

export const validateBillOfQuantities = () => (req, res, next) => {
    try {
        billOfQuantitiesSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.errors.map((err) => err.message).join(", "),
        });
    }
};

export const validate = (req, res, next) => {
    // This is a placeholder for a more complex validation function if needed.
    // For now, it just passes the request to the next middleware.
    next();
};
