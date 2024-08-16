
exports.nameExtractor = (file) => {
    const { originalname } = file;
    const modelName = originalname.substring(0, originalname.indexOf("."))
    return modelName
}

exports.arrayDivider = (array, chunks) => {
    const result = array.slice(0, chunks)
    return result;
}