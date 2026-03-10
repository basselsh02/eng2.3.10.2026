import api from "./axiosInstance";

export const getSuggestions = async ({
    model,
    type = "column",
    column,
    search = "",
    limit = 10,
    page = 1,
}) => {
    const params = {
        model,
        type,
        q: search,
        limit,
        page,
    };

    if (type === "column" && column) {
        params.column = column;
    }

    const res = await api.get("suggestions/", { params });
    return res.data;
};
