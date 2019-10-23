import * as Data from './data';

export function createRoster(allChars, loadedRoster) {
	let res = allChars
		.filter((c) => (findCharPlan(allChars, c.name)))
		.map((c) => {
			let loadedCharPlan = loadedRoster ? findCharPlan(loadedRoster, c.name) : undefined;
			return createCharacterPlan(c, loadedCharPlan);
		});
	return res;
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
export function sortByActive(roster) {
	return [... roster].sort((a, b) => {
		// sort by active CPs
		if(a.active && !b.active) {
			return -1;
		}
		if(!a.active && b.active) {
			return 1;
		}
		return 0;
	}, (a, b) => {
		// sort by ID
		let aData = Data.findCharData(a);
		let bData = Data.findCharData(b);
		if(aData.id < bData.id) {
			return -1;
		}
		if(aData.id > bData.id) {
			return 1;
		}
		return 0;
	});
}
export function filterByHouse(roster, house) {
	let cds = Data.filterByHouse(house);
	let res = cds.map((cd) => {
		return findCharPlan(roster, cd.name);
	});
	return res;
}
export function createCharacterPlan(charData, loadedCharPlan={}) {
	return Object.assign({}, {
		name: charData.name,
		active: charData.name === 'Byleth',
		classes: {},
		skillLevels: {},
		learned: {},
	}, loadedCharPlan);
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
export function toggleClass(roster, charPlan, className) {
	let res = Object.assign({}, charPlan);
	if(res.classes[className]) {
		delete res.classes[className];
	} else {
		res.classes[className] = true;
	}
	return updateCharPlan(roster, charPlan, res);
}
export function toggleLearn(roster, charPlan, abilityName) {
	let res = Object.assign({}, charPlan);
	if (res.learned[abilityName]) {
		delete res.learned[abilityName];
	} else {
		res.learned[abilityName] = true;
	}
	return updateCharPlan(roster, charPlan, res);
}
export function hasPinnedClass(charPlan, className) {
	return charPlan.classes[className] !== undefined;
}
export function hasLearnedAbility(charPlan, abilityName) {
	return charPlan.learned[abilityName] !== undefined;
}
export function getAbilityRequirements(charPlan, abilityName) {
	if (!charPlan.learned[abilityName]) {
		return undefined;
	}
	let cd = Data.findCharData(charPlan.name);
	let learnables = cd.allLearnables;
	for(let skillCat in learnables) {
		for(let grade in learnables[skillCat]) {
			if(learnables[skillCat][grade]) {
				let res = learnables[skillCat][grade].find((x) => (x.name === abilityName));
				if(res) {
					return {
						skillCat: skillCat,
						grade: grade,
					};
				}
			}
		}
	}
	console.error(`Can't find requirements for ability ${abilityName}`);
	return undefined;
}
export function updateCharPlan(roster, charPlan, newState) {
	return roster.map((cp) => {
		if(cp.name == charPlan.name) { // don't match by obj reference!
			return Object.assign({}, cp, newState);
		}
		return Object.assign({}, cp);
	});
}