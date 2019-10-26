import { LEARNABLE_TYPE } from "./enum";
import DATA_JSON from '../data.json';

export let STATIC = {
	units: undefined,
	universal: undefined,
	stats: undefined,
	classes: undefined,
	skillCategories: undefined,
	grades: undefined,
};

STATIC = {
	...DATA_JSON,
	stats: ['hp', 'str', 'mag', 'dex', 'spd', 'lck', 'def', 'res', 'cha'],
	skillCategories: ['sword', 'lance', 'axe', 'bow', 'brawling', 'reason', 'faith', 'authority', 'heavyArmor', 'riding', 'flying'],
	grades: ['BT', 'E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+'],
	classTiers: ['beginner', 'intermediate', 'advanced', 'master', 'event', 'starter'],
};
STATIC.universal = STATIC.units.find((uData) => (uData.name === 'UNIVERSAL')),
STATIC.units = STATIC.units.filter((uData) => (uData.name !== 'UNIVERSAL')),
STATIC.unitsMap = listToMap(STATIC.units, 'name');
STATIC.classesMap = listToMap(STATIC.classes, 'name');
STATIC.abilitiesMap = listToMap(STATIC.abilities, 'name');
STATIC.units.forEach((uData) => {
	buildAllLearnables(uData);
});
STATIC.classes.forEach((cd) => {
	buildRelatedSkills(cd);
});

console.log(STATIC);

function buildAllLearnables(unitData) {
	unitData.allLearnables = {};

	if(unitData.buddingTalent) {
		const type = determineLearnableType(unitData.buddingTalent);
		const unitDataLearnableField = type === LEARNABLE_TYPE.ABILITY ? 'abilities' : 'combat arts';
		if(!unitData.learnable[unitDataLearnableField]) {
			unitData.learnable[unitDataLearnableField] = {};
		}
		if(!unitData.learnable[unitDataLearnableField][unitData.buddingTalent.skill]) {
			unitData.learnable[unitDataLearnableField][unitData.buddingTalent.skill] = {};
		}
		unitData.learnable[unitDataLearnableField][unitData.buddingTalent.skill].BT = unitData.buddingTalent.learn;
	}

	[unitData.learnable, STATIC.universal.learnable].forEach((source) => {
		[source.abilities, source['combat arts']].forEach((subsource) => {
			if(subsource) {
				let type = subsource === source.abilities ? LEARNABLE_TYPE.ABILITY : LEARNABLE_TYPE.COMBAT_ART;
				for(let skill in subsource) {
					unitData.allLearnables[skill] = unitData.allLearnables[skill] || {};
					for(let grade in subsource[skill]) {
						let toPush = {
							name: subsource[skill][grade],
							type: type,
						};
						if(unitData.allLearnables[skill][grade]) { // ability already exists
							console.log(`Learnable already exists ${unitData.name} ${skill} ${grade}`);
							unitData.allLearnables[skill][grade].push(toPush);
						} else {
							unitData.allLearnables[skill][grade] = [toPush];
						}
					}
				}
			}
		});
	});
}
function buildRelatedSkills(classData) {
	let skills = Object.assign({}, classData.certification, classData.skillBonus);
	let relatedSkills = Object.keys(skills);
	classData.relatedSkills = [];
	for(let skillCat of STATIC.skillCategories) {
		if(relatedSkills.indexOf(skillCat) !== -1) {
			classData.relatedSkills.push(skillCat);
		}
	}
}
function listToMap(list, keyField) {
	const res = {};
	list.forEach((li) => {
		res[li[keyField]] = li;
	});
	return res;
}
export function findUnitData(name) {
	return STATIC.unitsMap[name];
}
export function findClass(name) {
	return STATIC.classesMap[name];
}

function isClassApplicable(classData, unitData) {
	if(classData.tags.indexOf('male') > -1 && unitData.sex.indexOf('m') === -1) {
		return false;
	} else if(classData.tags.indexOf('female') > -1 && unitData.sex.indexOf('f') === -1) {
		return false;
	}
	if(classData.tags.indexOf('houseLeader') > -1 && ['Edelgard', 'Dimitri', 'Claude'].indexOf(unitData.name) === -1) {
		return false;
	}
	for (let n of ['Edelgard', 'Dimitri', 'Claude', 'Byleth']) {
		if(classData.tags.indexOf(n) > -1 && unitData.name !== n) {
			return false;
		}
	}
	return true;
}
function classHasStrength(classData, unitData) {
	// TODO
	return true;
}
export function filterClasses(unitPlan, filter = {pinned: false, unpinned: true, tiers: {}, applicableOnly: true, strengthsOnly: true}) {
	let unitData = findUnitData(unitPlan.name, {});
	return STATIC.classes.filter((classData) => {
		if(filter.applicableOnly && !isClassApplicable(classData, unitData)) {
			return false;
		}
		if(filter.strengthsOnly && !classHasStrength(classData, unitData)) {
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
export function findAbility(name) {
	return STATIC.abilitiesMap[name];
}
export function findCombatArt(name) {
	// TODO
	return {
		name,
		desc: '',
	};
}
export function filterByHouse(house) {
	return STATIC.units.filter((uData) => {
		if(house === 'seiros') {
			return ['kos', 'cos'].indexOf(uData.house) > -1;
		}
		return uData.house == house;
	});
}
export function determineLearnableType(learnableName) {
	let learnable = findAbility(learnableName);
	let type = LEARNABLE_TYPE.ABILITY;
	if(!learnable) {
		learnable = findCombatArt(learnableName);
		type = LEARNABLE_TYPE.COMBAT_ART;
	}
	return type;
}