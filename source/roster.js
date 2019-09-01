function createRoster(allChars) {
	return allChars.map((c) => {
		return createCharacterPlan(c);
	});
}
function createCharacterPlan(charData) {
	return {
		active: true,
		name: charData.name,
		classes: {},
		skillLevels: {},
	};
}
function setActive(charPlan, val) {
	let res = Object.assign({}, charPlan);
	charPlan.active = val;
	return res;
}
function addClass(charPlan, className) {
	let res = Object.assign({}, charPlan);
	res.classes[className] = 1;
	return res;
}
function removeClass(charPlan, className) {
	let res = Object.assign({}, charPlan);
	delete res.classes[className];
	return res;
}

export {
	createRoster, createCharacterPlan, setActive, addClass, removeClass
};