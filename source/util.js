function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function getGrowthClassName(val) {
	if(val <= 30) {
		return 'bad';
	}
	if(val >= 50) {
		return 'good';
	}
	return '';
}

export {capitalize, getGrowthClassName};