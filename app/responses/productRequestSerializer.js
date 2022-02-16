module.exports = (instance) => {
    const attributes = [
        "uuid",
        "product_name",
        "status",
        "createdAt",
        "updatedAt",
    ];
    const result = {};
    for (const attribute of attributes) {
        result[attribute] = instance[attribute];
    }

    return result;
};
