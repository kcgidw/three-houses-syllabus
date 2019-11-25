import * as Data from './data';

export function createRoster(allUnits, loadedRoster) {
	let res = allUnits
		.filter((uData) => (findUnitPlan(allUnits, uData.name)))
		.map((uData) => {
			let loadedUnitPlan = loadedRoster ? findUnitPlan(loadedRoster, uData.name) : undefined;
			return createUnitPlan(uData, loadedUnitPlan);
		});
	return res;
}
export function filterByActive(roster, active = true) {
	return roster.filter((uPlan) => {
		return uPlan.active === active;
	});
}
export function findUnitPlan(roster, name) {
	let res = roster.find((uPlan) => (uPlan.name == name));
	return res;
}
export function findActiveUnitPlan(roster, name) {
	return roster.find((uPlan) => (uPlan.name == name && uPlan.active));
}
export function sortByActive(roster) {
	return [... roster].sort((a, b) => {
		// sort by active
		if(a.active && !b.active) {
			return -1;
		}
		if(!a.active && b.active) {
			return 1;
		}
		return 0;
	}, (a, b) => {
		// sort by ID
		let aData = Data.findUnitData(a);
		let bData = Data.findUnitData(b);
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
	let uDatas = Data.filterByHouse(house);
	let res = uDatas.map((uData) => {
		return findUnitPlan(roster, uData.name);
	});
	return res;
}
export function createUnitPlan(unitData, loadedUnitPlan={}) {
	return Object.assign({}, {
		name: unitData.name,
		active: unitData.name === 'Byleth',
		classes: {},
		skillLevels: {},
		learned: {},
	}, loadedUnitPlan);
}
export function setUnitPlanActive(roster, unitPlan, val) {
	// toggles value if no val provided
	let newState = {
		active: val === undefined ? !unitPlan.active : val,
	};
	return updateUnitPlan(roster, unitPlan, newState);
}
export function toggleHouseActive(roster, house) {
	let targetVal = false;
	let unitPlans = filterByHouse(roster, house);
	for(let uPlan of unitPlans) {
		if(!uPlan.active) {
			targetVal = true;
			break;
		}
	}
	unitPlans.forEach((uPlan) => {
		roster = setUnitPlanActive(roster, uPlan, targetVal);
	});
	return roster;
}
export function toggleClass(roster, unitPlan, className) {
	let res = Object.assign({}, unitPlan);
	if(res.classes[className]) {
		delete res.classes[className];
	} else {
		res.classes[className] = true;
	}
	return updateUnitPlan(roster, unitPlan, res);
}
export function toggleLearn(roster, unitPlan, abilityName) {
	let res = Object.assign({}, unitPlan);
	if (res.learned[abilityName]) {
		delete res.learned[abilityName];
	} else {
		res.learned[abilityName] = true;
	}
	return updateUnitPlan(roster, unitPlan, res);
}
export function hasPinnedClass(unitPlan, className) {
	return unitPlan.classes[className] !== undefined;
}
export function hasLearnedAbility(unitPlan, abilityName) {
	return unitPlan.learned[abilityName] !== undefined;
}
export function getAbilityRequirements(unitPlan, abilityName) {
	if (!unitPlan.learned[abilityName]) {
		return undefined;
	}
	let uData = Data.findUnitData(unitPlan.name);
	let learnables = uData.allLearnables;
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
export function updateUnitPlan(roster, unitPlan, newState) {
	return roster.map((uPlan) => {
		if(uPlan.name == unitPlan.name) { // don't match by obj reference!
			return Object.assign({}, uPlan, newState);
		}
		return Object.assign({}, uPlan);
	});
}
export function getActiveSupports(roster, unitData) {
	return unitData.supports.filter((uName) => {
		return findActiveUnitPlan(roster, uName);
	});
}
export function filterClasses(unitPlan, filter = {pinned: false, unpinned: true, tiers: {}, applicableOnly: true}) {
	let unitData = Data.findUnitData(unitPlan.name, {});
	return Data.STATIC.classes.filter((classData) => {
		if(filter.applicableOnly && !Data.isClassApplicable(classData, unitData)) {
			return false;
		}
		if(filter.pinned && !filter.unpinned) {
			if(!unitPlan.classes[classData.name]) {
				return false;
			}
		} else if(filter.unpinned && !filter.pinned) {
			if(unitPlan.classes[classData.name]) {
				return false;
			}
		}
		if(!filter.tiers[classData.tier] && classData.tier !== 'event') {
			return false;
		}
		return true;
	});
}