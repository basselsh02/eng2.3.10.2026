export default function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || "Server Error";
    let errors = null;

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        status = 400;
        message = "Validation failed";
        errors = {};
        for (let field in err.errors) {
            errors[field] = err.errors[field].message;
        }
    }

    // Mongoose Cast Error (invalid ObjectId)
    else if (err.name === 'CastError') {
        status = 400;
        message = "Invalid data format";
    }

    // Duplicate Key Error
    else if (err.code === 11000) {
        status = 409;
        message = "Duplicate entry found";
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // JWT Errors
    else if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = "Invalid token";
    }

    else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = "Token expired";
    }

    console.error('Error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });

    res.status(status).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
