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
		[source.abilities, source['combat arts'], source.spells].forEach((subsource) => {
			if(subsource) {
				let type;
				switch(subsource) {
					case source.abilities:
						type = LEARNABLE_TYPE.ABILITY;
						break;
					case source['combat arts']:
						type = LEARNABLE_TYPE.COMBAT_ART;
						break;
					case source.spells:
						type = LEARNABLE_TYPE.SPELL;
						break;
					default:
						throw `Bad subsource ${subsource}`;
				}
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
		if(relatedSkills.includes(skillCat)) {
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

export function isClassApplicable(classData, unitData) {
	if(classData.tags.includes('male') && !unitData.sex.includes('m')) {
		return false;
	} else if(classData.tags.includes('female') && !unitData.sex.includes('f')) {
		return false;
	}
	if(classData.tags.includes('houseLeader') && !['Edelgard', 'Dimitri', 'Claude'].includes(unitData.name)) {
		return false;
	}
	for (let n of ['Edelgard', 'Dimitri', 'Claude', 'Byleth']) {
		if(classData.tags.includes(n) && unitData.name !== n) {
			return false;
		}
	}
	return true;
}
export function classHasStrength(classData, unitData) {
	// TODO
	return true;
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
			return ['kos', 'cos'].includes(uData.house);
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
	if(!learnable) {
		type = LEARNABLE_TYPE.SPELL;
	}
	return type;
}