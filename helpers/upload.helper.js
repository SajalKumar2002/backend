
exports.nameExtractor = (file) => {
    const { originalname } = file;
    const modelName = originalname.substring(0, originalname.indexOf("."))
    return modelName
}

exports.arrayDivider = (array, chunks) => {
    let result = []
    array.forEach(element => {
        result.push(element.dataValues);
    });
    return result.slice(0, chunks);
}