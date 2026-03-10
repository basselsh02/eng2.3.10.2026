export const buildFilters = (search, page = 1, limit = 10, searchableFields = []) => {
    // Handle pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const pagination = {
        page: pageNum,
        limit: limitNum,
        skip
    };

    // Handle search filters
    const filters = {};

    if (search && searchableFields.length > 0) {
        const searchRegex = new RegExp(search, "i");
        filters.$or = searchableFields.map(field => ({
            [field]: searchRegex
        }));
    }

    return { filters, pagination };
};
