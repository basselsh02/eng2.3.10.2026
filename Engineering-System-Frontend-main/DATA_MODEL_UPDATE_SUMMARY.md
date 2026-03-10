# Data Model Update Summary

## Overview
Updated all frontend components to properly handle the new project data model with the following structure:

### Project Model Fields
- **Basic Information:**
  - `_id` - MongoDB ID
  - `projectCode` - Unique project code
  - `projectName` - Project name
  - `financialYear` - Financial year (e.g., 2025/2026)
  - `projectType` - Type of project

- **Responsibility & Organization:**
  - `responsibleBranch` - Responsible branch
  - `responsibleEmployee` - Responsible employee
  - `ownerEntity` - Entity owner
  - `company` - Associated company

- **Financial Information:**
  - `estimatedCost` - Estimated project cost
  - `costPercentage` - Cost percentage
  - `treasuryCode` - Treasury code
  - `contractingMethod` - Method of contracting

- **Dates:**
  - `issueDate` - Issue date
  - `siteExitDate` - Site exit date
  - `actualStartDate` - Actual start date
  - `actualEndDate` - Actual end date
  - `openingDate` - Opening date
  - `publicationDate` - Publication date

- **Other Fields:**
  - `mainProject` - Main/parent project reference

- **Array Fields:**
  - `conditions[]` - Array of project conditions
    - `order`, `value`, `desc`, `serial`, `name`, `code`, `_id`
  - `workItems[]` - Array of work items
    - `total`, `value`, `quantity`, `unit`, `code`, `desc`, `serial`, `_id`
  - `candidateCompanies[]` - Array of candidate company names (strings)
  - `registeredCompanies[]` - Array of registered companies
    - `recordNameNumber`, `recordNumber`, `companyName`, `_id`
  - `committeeMembers[]` - Array of committee members
    - `name`, `position`, `approved`, `paymentMethod`, `approvalModel`

---

## Files Updated

### 1. **ProjectsList.jsx**
**Location:** `Engineering-System-Frontend-main/src/components/pages/Project/ProjectsList.jsx`

**Changes:**
- Updated table headers to display correct fields from the model
- Changed from `projectNumber` to `projectCode`
- Changed from `branchCode` + `branchName` to `responsibleBranch` and `financialYear`
- Added proper number formatting for `estimatedCost` using `.toLocaleString('ar-EG')`
- Updated SearchInput to search by `projectName`

**Table Columns:**
| Column | Data Field |
|--------|-----------|
| كود المشروع | `projectCode` |
| اسم المشروع | `projectName` |
| السنة المالية | `financialYear` |
| تكلفة المشروع | `estimatedCost` (formatted) |
| الفرع المسئول | `responsibleBranch` |

---

### 2. **ProjectFullDetails.jsx**
**Location:** `Engineering-System-Frontend-main/src/components/pages/Project/ProjectFullDetails.jsx`

**Changes:**
- Completely restructured the project information display section
- Added all new fields from the data model
- Organized fields into logical groups:
  - Basic Information (Code, Name, Year, Type)
  - Responsibility (Branch, Employee, Entity, Company)
  - Financial Information (Cost, Percentage, Treasury Code)
  - Dates (Issue, Site Exit, Start, End, Opening, Publication)
- Added proper date formatting using `.toLocaleDateString('ar-EG')`
- Added proper number formatting using `.toLocaleString('ar-EG')`

**New Fields Displayed:**
- `projectCode`, `financialYear`, `projectType`
- `contractingMethod`, `ownerEntity`, `responsibleBranch`, `responsibleEmployee`
- `costPercentage`, `treasuryCode`
- `issueDate`, `siteExitDate`, `actualStartDate`, `actualEndDate`
- `openingDate`, `publicationDate`
- `mainProject`

---

### 3. **CreateFinancialProcedureForm.jsx**
**Location:** `Engineering-System-Frontend-main/src/components/pages/FinancialProcedures/CreateFinancialProcedureForm.jsx`

**Changes:**
- Fixed project data fetching to handle paginated response: `projectsData?.data?.docs || projectsData?.data`
- Changed form field name from `project` to `projectId` for consistency
- Updated error handling references to use `projectId`
- Form already has proper structure with three procedure types:
  - Offers (العروض المالية)
  - Proposal (المقترح المالي)
  - Resolution (البت المالي)

---

### 4. **CreateFinancialStatusForm.jsx**
**Location:** `Engineering-System-Frontend-main/src/components/pages/FinancialStatus/CreateFinancialStatusForm.jsx`

**Changes:**
- Fixed project data fetching to handle paginated response: `projectsData?.data?.docs || projectsData?.data`
- Changed form field name from `project` to `projectId` for consistency
- **Completely restructured form fields** to match project model:
  - Basic Information: `projectCode`, `projectName`, `financialYear`, `projectType`
  - Responsibility: `responsibleBranch`, `responsibleEmployee`, `ownerEntity`, `company`
  - Dates: `actualStartDate`, `actualEndDate`, `issueDate`, `siteExitDate`
  - Financial: `estimatedCost`, `costPercentage`, `treasuryCode`, `contractingMethod`
  - Additional: `openingDate`, `publicationDate`, `mainProject`

---

### 5. **CreateProcedureForm.jsx**
**Location:** `Engineering-System-Frontend-main/src/components/pages/Procedures/CreateProcedureForm.jsx`

**Changes:**
- Fixed project data fetching to handle paginated response: `projectsData?.data?.docs || projectsData?.data`
- Changed form field name from `project` to `projectId` for consistency
- Updated error handling references to use `projectId`
- Form maintains three procedure types:
  - Company Offers (عروض الشركات)
  - Technical Resolution (البت التقني)
  - Financial Proposal (المقترح المالي)

---

### 6. **Table Components (No Changes Required)**

#### FinancialProcedures.jsx
- Already correctly accessing project data through relationships
- Table displays: `procedure.project?.projectCode`, `procedure.project?.projectName`, `procedure.project?.financialYear`

#### FinancialStatus.jsx
- Already correctly structured
- Table displays project-related fields properly
- Uses correct field mappings: `financialYear`, `projectType`, `projectNumber`, `estimatedAmount`

#### Procedures.jsx
- Already correctly accessing project data
- Table displays: `procedure.project?.projectCode`, `procedure.project?.projectName`, `procedure.project?.financialYear`

---

## Key Improvements

1. **Consistent Field Naming:**
   - All forms now use `projectId` for project selection
   - Proper handling of paginated API responses with fallback: `?.docs || []`

2. **Data Formatting:**
   - Numbers formatted with Arabic locale: `.toLocaleString('ar-EG')`
   - Dates formatted with Arabic locale: `.toLocaleDateString('ar-EG')`

3. **Field Organization:**
   - Project details organized by logical sections
   - Financial forms updated to capture all relevant project data
   - Better user experience with grouped related fields

4. **Array Field Support:**
   - Model supports conditions, workItems, candidateCompanies, registeredCompanies, and committeeMembers
   - Structure prepared for future UI enhancements to display these nested arrays

5. **Error Handling:**
   - Proper fallback handling for optional fields
   - Display "-" or "غير محدد" (not specified) for missing values

---

## API Data Structure Compatibility

All updated components now properly handle the following response formats:

### Single Project Response
```json
{
  "data": {
    "_id": "...",
    "projectCode": "...",
    "projectName": "...",
    "financialYear": "2025/2026",
    "projectType": "...",
    "contractingMethod": "...",
    "issueDate": "2025-01-01T00:00:00Z",
    "responsibleBranch": "...",
    "estimatedCost": 50000,
    "costPercentage": 75.5,
    // ... other fields
  }
}
```

### Paginated Projects Response
```json
{
  "data": {
    "docs": [
      { /* project 1 */ },
      { /* project 2 */ }
    ],
    "totalPages": 5,
    "totalDocs": 45
  }
}
```

---

## Testing Recommendations

1. **ProjectsList Page:**
   - Verify correct columns are displayed
   - Test number formatting for costs
   - Test search functionality

2. **ProjectFullDetails Page:**
   - Verify all project details display correctly
   - Test date formatting
   - Test number formatting
   - Verify optional fields show "-" when empty

3. **Create Forms:**
   - Test project selection dropdown
   - Test form field validation
   - Verify form submission with new field structure
   - Test form closes on success

4. **Table Views:**
   - Verify all procedure and status tables display project relationships correctly
   - Test pagination
   - Test delete operations

---

## Future Enhancements

Potential UI improvements for array fields:
- **Conditions Tab:** Display and manage project conditions
- **Work Items Tab:** Display and manage work items
- **Companies Tab:** Display candidate and registered companies
- **Committee Tab:** Display and manage committee members

These would require additional components but the data structure is already in place.

---

## Notes

- All Arabic localization maintained throughout
- RTL (Right-to-Left) layout support maintained
- Responsive design maintained across all updates
- Permission checks (Can component) maintained
- Error handling and loading states maintained
