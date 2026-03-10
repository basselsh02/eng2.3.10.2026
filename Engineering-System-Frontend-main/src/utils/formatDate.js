const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const formatted = date.toLocaleDateString("en-GB");
    return formatted;
};

export default formatDate;