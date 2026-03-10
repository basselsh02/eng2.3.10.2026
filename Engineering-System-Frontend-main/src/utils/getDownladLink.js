const getFileUrl = (filePath) => {
    const fileName = filePath.split("/").pop();
    const url = `http://localhost:10000/api/files/download/${fileName}`;
    return url;
};

export default getFileUrl;