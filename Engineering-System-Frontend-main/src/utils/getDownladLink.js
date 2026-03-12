const getFileUrl = (filePath) => {
    const fileName = filePath.split("/").pop();
    const url = `http://localhost:6001/api/files/download/${fileName}`;
    return url;
};

export default getFileUrl;
