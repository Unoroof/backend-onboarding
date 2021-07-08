module.exports = (instance) => {
	const attributes = [
		"name",
		"countryCode",
	];
	const result = {}; 
	for (const attribute of attributes) {
		result[attribute] = instance[attribute];
	}
	return result;
}
