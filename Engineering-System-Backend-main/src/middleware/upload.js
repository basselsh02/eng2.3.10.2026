import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads")),
    filename: (req, file, cb) => {
        console.log(file.originalname);
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
        file.relativePath = `uploads/${uniqueName}`;
    },
});

/**
 * File filter for PDF-only uploads
 * Used for extract advances documents: extractDocument, materialsCertificate, initialReceiptCommitteeRequest, executionCertificate
 */
const pdfFileFilter = (req, file, cb) => {
    const allowedMimes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error(`يجب أن يكون الملف PDF. تم رفع: ${file.originalname}`), false);
    }
};

/**
 * File filter for consultant documents (PDF, DOC, DOCX)
 */
const consultantFileFilter = (req, file, cb) => {
    if (file.fieldname === 'consultantPdf') {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const allowedExtensions = ['.pdf', '.doc', '.docx'];

        const fileExt = path.extname(file.originalname).toLowerCase();

        if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error(`يجب أن يكون الملف PDF أو Word. تم رفع: ${file.originalname}`), false);
        }
    } else {
        // For other files, use PDF filter
        pdfFileFilter(req, file, cb);
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export const uploadWithPdfFilter = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: pdfFileFilter,
});

export const uploadWithConsultantFilter = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: consultantFileFilter,
});
