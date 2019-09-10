export function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

export function appraiseBaseGrowthRate(val) {
	if(val <= 30) {
		return 'bad';
	}
	if(val >= 50) {
		return 'good';
	}
	return '';
}
export function appraiseGrowthRateModifier(val) {
	if(val < 0) {
		return 'bad';
	}
	if(val > 0) {
		return 'good';
	}
	return '';
}