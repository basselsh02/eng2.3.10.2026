import mongoose from "mongoose";
import FieldPermission from "../modules/fieldPermissions/models/fieldPermission.model.js";
import User from "../modules/User/models/user.model.js";
import Project from "../modules/project/models/project.model.js";
import Office from "../modules/office/models/office.model.js";
import Procedure from "../modules/procedures/models/procedure.model.js";
import FinancialProcedure from "../modules/financialProcedures/models/financialProcedure.model.js";
import FinancialStatus from "../modules/financialStatus/models/financialStatus.model.js";
import BillOfQuantities from "../modules/billOfQuantities/models/billOfQuantities.model.js";
import OrganizationalUnit from "../modules/organizationalUnit/models/organizationalUnit.model.js";
import FinancialFlow from "../modules/financialFlow/models/financialFlow.model.js";
import FinancialTransaction from "../modules/financialTransaction/models/financialTransaction.model.js";
import logger from "../utils/logger.js";

// Define all roles in the system
const ROLES = ["SUPER_ADMIN", "مكتب", "مدير", "رئيس فرع", "مدير الادارة"];

// Define permission types
const PERMISSION_TYPES = ["READ", "WRITE", "UPDATE"];

// Map of models to introspect
const MODELS_MAP = {
    User: User,
    Project: Project,
    Office: Office,
    Procedure: Procedure,
    FinancialProcedure: FinancialProcedure,
    FinancialStatus: FinancialStatus,
    BillOfQuantities: BillOfQuantities,
    OrganizationalUnit: OrganizationalUnit,
    FinancialFlow: FinancialFlow,
    FinancialTransaction: FinancialTransaction,
};

// Fields to exclude from permissions (system fields)
const EXCLUDED_FIELDS = [
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "password", // Handle password separately with special rules
];

/**
 * Extract all field names from a Mongoose schema
 * @param {mongoose.Schema} schema - The Mongoose schema to introspect
 * @returns {string[]} - Array of field names
 */
function extractFieldNames(schema) {
    const fields = [];
    
    // Get all paths from schema
    schema.eachPath((pathname, schematype) => {
        // Skip excluded fields
        if (EXCLUDED_FIELDS.includes(pathname)) {
            return;
        }

        // For nested fields (like arrays of subdocuments), extract the base field name
        const baseField = pathname.split('.')[0];
        
        // Avoid duplicates
        if (!fields.includes(baseField)) {
            fields.push(baseField);
        }
    });

    return fields;
}

/**
 * Seed field permissions for all models
 */
export async function seedFieldPermissions() {
    try {
        logger.info("Starting field permissions seeding...");

        let totalCreated = 0;
        let totalSkipped = 0;

        // Iterate through each model
        for (const [modelName, Model] of Object.entries(MODELS_MAP)) {
            logger.info(`Processing model: ${modelName}`);

            // Extract field names from the model schema
            const fieldNames = extractFieldNames(Model.schema);
            logger.info(`  Found ${fieldNames.length} fields in ${modelName}`);

            // Create permissions for each field × role × permission type
            for (const fieldName of fieldNames) {
                for (const role of ROLES) {
                    for (const permissionType of PERMISSION_TYPES) {
                        try {
                            // Check if permission already exists
                            const existingPermission = await FieldPermission.findOne({
                                resource: modelName,
                                fieldName,
                                permissionType,
                                role,
                            });

                            if (existingPermission) {
                                totalSkipped++;
                                continue;
                            }

                            // Create new permission (default: allowed = true)
                            await FieldPermission.create({
                                resource: modelName,
                                fieldName,
                                permissionType,
                                role,
                                allowed: true,
                                description: `${permissionType} permission for ${fieldName} in ${modelName}`,
                            });

                            totalCreated++;
                        } catch (error) {
                            // Handle unique constraint errors (duplicate records)
                            if (error.code === 11000) {
                                totalSkipped++;
                            } else {
                                logger.error(
                                    `Error creating permission for ${modelName}.${fieldName} (${role}, ${permissionType}):`,
                                    error.message
                                );
                            }
                        }
                    }
                }
            }
        }

        logger.info(`
Field Permissions Seeding Complete:
  - Total Created: ${totalCreated}
  - Total Skipped: ${totalSkipped}
  - Total Processed: ${totalCreated + totalSkipped}
        `);

        return {
            created: totalCreated,
            skipped: totalSkipped,
            total: totalCreated + totalSkipped,
        };
    } catch (error) {
        logger.error("Error seeding field permissions:", error.message || error);
        throw error;
    }
}

/**
 * Resync field permissions when models change
 * This should be run when new fields are added to models
 */
export async function resyncFieldPermissions() {
    try {
        logger.info("Resyncing field permissions with current models...");

        const stats = await seedFieldPermissions();

        // Find orphaned permissions (permissions for fields that no longer exist)
        const allPermissions = await FieldPermission.find({});
        let orphanedCount = 0;

        for (const permission of allPermissions) {
            const Model = MODELS_MAP[permission.resource];
            
            if (!Model) {
                logger.warn(`Model ${permission.resource} no longer exists`);
                continue;
            }

            const fieldNames = extractFieldNames(Model.schema);
            
            if (!fieldNames.includes(permission.fieldName)) {
                logger.warn(
                    `Field ${permission.fieldName} no longer exists in ${permission.resource}`
                );
                orphanedCount++;
                // Optionally delete orphaned permissions
                // await FieldPermission.deleteOne({ _id: permission._id });
            }
        }

        logger.info(`
Resync Complete:
  - New permissions created: ${stats.created}
  - Orphaned permissions found: ${orphanedCount}
        `);

        return {
            ...stats,
            orphaned: orphanedCount,
        };
    } catch (error) {
        logger.error("Error resyncing field permissions:", error.message || error);
        throw error;
    }
}

/**
 * Get all resources and their fields
 */
export async function getAllResourcesAndFields() {
    const resources = [];

    for (const [modelName, Model] of Object.entries(MODELS_MAP)) {
        const fieldNames = extractFieldNames(Model.schema);
        
        resources.push({
            resource: modelName,
            fields: fieldNames,
            fieldCount: fieldNames.length,
        });
    }

    return resources;
}

// Export for CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    // This script is being run directly
    import("../config/database.js").then(async ({ default: connectDB }) => {
        await connectDB();
        await seedFieldPermissions();
        process.exit(0);
    });
}
