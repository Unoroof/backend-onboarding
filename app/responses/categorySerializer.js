module.exports = (instance) => {
    const attributes = ["uuid", "name", "data", "metadata"];
    const result = {};
    for (const attribute of attributes) {
        result[attribute] = instance[attribute];
    }
    return result;
};
