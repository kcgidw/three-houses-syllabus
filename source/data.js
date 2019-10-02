export let STATIC = {
	characters: undefined,
	universal: undefined,
	stats: undefined,
	classes: undefined,
	skillCategories: undefined,
	grades: undefined,
};

export function loadData(cb) {
	$.getJSON('data.json', (data) => {
		console.log('Data retrieved.');

		STATIC = data;
		STATIC.stats = ['hp', 'str', 'mag', 'dex', 'spd', 'lck', 'def', 'res', 'cha'];
		STATIC.skillCategories = ['sword', 'lance', 'axe', 'bow', 'brawling', 'reason', 'faith', 'authority', 'heavyArmor', 'riding', 'flying'];
		STATIC.grades = ['E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+'];

		STATIC.universal = findCharData('UNIVERSAL');
		STATIC.characters = STATIC.characters.filter((cd) => (cd.name !== 'UNIVERSAL'));
		STATIC.characters.forEach((cd) => {
			buildAllLearnables(cd);
		});

		console.log(STATIC);
		cb(data);
	});
}

const LEARNABLE_TYPE = {
	'ABILITY': 'ABILITY',
	'COMBAT_ART': 'COMBAT_ART',
};
function buildAllLearnables(charData) {
	charData.allLearnables = {};
	[charData.learnable, STATIC.universal.learnable].forEach((source) => {
		[source.abilities, source['combat arts']].forEach((subsource) => {
			if(subsource) {
				let type = subsource === source.abilities ? LEARNABLE_TYPE.ABILITY : LEARNABLE_TYPE.COMBAT_ART;
				for(let skill in subsource) {
					charData.allLearnables[skill] = charData.allLearnables[skill] || {};
					for(let grade in subsource[skill]) {
						let toPush = {
							name: subsource[skill][grade],
							type: type,
						};
						if(charData.allLearnables[skill][grade]) { // ability already exists
							console.log(`Learnable already exists ${charData.name} ${skill} ${grade}`);
							charData.allLearnables[skill][grade].push(toPush);
						} else {
							charData.allLearnables[skill][grade] = [toPush];
						}
					}
				}
			}
		});
	});
}

export function findCharData(name) {
	return STATIC.characters.find((i) => {
		return i.name == name;
	});
}
export function findClass(name) {
	return STATIC.classes.find((c) => {
		return c.name == name;
	});
}
export function findAbility(name) {
	let res = STATIC.abilities.find((x) => {
		return x.name == name;
	});
	if(!res) {
		console.warn(`Can't find ability ` + name);
	}
	return res;
}
export function findCombatArt(name) {
	// TODO
	return {
		name,
		desc: '',
	};
}
export function filterByHouse(house) {
	return STATIC.characters.filter((cd) => {
		if(house === 'seiros') {
			return ['kos', 'cos'].indexOf(cd.house) > -1;
		}
		return cd.house == house;
	});
}
