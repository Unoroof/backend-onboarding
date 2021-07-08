module.exports = (instance) => {
	const attributes = [
		"isoCode",
		"name",
		"phoneCode",
	];
	const result = {}; 
	for (const attribute of attributes) {
		result[attribute] = instance[attribute];
	}
	return result;
}
