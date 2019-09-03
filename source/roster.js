import * as Data from './data';

export function createRoster(allChars) {
	return allChars.map((c) => {
		return createCharacterPlan(c);
	});
}
export function filterByActive(roster, active = true) {
	return roster.filter((cp) => {
		return cp.active === active;
	});
}
export function findCharPlan(roster, name) {
	let res = roster.find((cp) => (cp.name == name));
	return res;
}
export function findActiveCharPlan(roster, name) {
	return roster.find((cp) => (cp.name == name && cp.active));
}
export function filterByHouse(roster, house) {
	let cds = Data.filterByHouse(house);
	let res = cds.map((cd) => {
		return findCharPlan(roster, cd.name);
	});
	return res;
}
export function createCharacterPlan(charData) {
	return {
		name: charData.name,
		// house: charData.house,
		// growths: charData.growths,
		// supports: charData.supports,
		active: charData.name === 'Byleth',
		classes: {},
		skillLevels: {},
	};
}
export function setCharPlanActive(roster, charPlan, val) {
	// toggles value if no val provided
	let newState = {
		active: val === undefined ? !charPlan.active : val,
	};
	return updateCharPlan(roster, charPlan, newState);
}
export function toggleHouseActive(roster, house) {
	let targetVal = false;
	let charPlans = filterByHouse(roster, house);
	for(let cp of charPlans) {
		if(!cp.active) {
			targetVal = true;
			break;
		}
	}
	charPlans.forEach((cp) => {
		roster = setCharPlanActive(roster, cp, targetVal);
	});
	return roster;
}
// export function addClass(roster, charPlan, className) {
// 	let res = Object.assign({}, charPlan);
// 	res.classes[className] = 1;
// 	return res;
// }
// export function removeClass(roster, charPlan, className) {
// 	let res = Object.assign({}, charPlan);
// 	delete res.classes[className];
// 	return res;
// }
export function updateCharPlan(roster, charPlan, newState) {
	return roster.map((cp) => {
		if(cp.name == charPlan.name) { // don't match by obj reference!
			return Object.assign({}, cp, newState);
		}
		return Object.assign({}, cp);
	});
}
