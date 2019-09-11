export let STATIC = {
	characters: undefined,
	stats: undefined,
	classes: undefined,
};

export function loadData(cb) {
	$.getJSON('data.json', (data) => {
		STATIC = data;
		console.log(data);
		STATIC.stats = ['hp', 'str', 'mag', 'dex', 'spd', 'lck', 'def', 'res', 'cha'];
		STATIC.skillLevels = ['sword', 'lance', 'axe', 'bow', 'brawling', 'reason', 'faith', 'authority', 'heavyArmor', 'riding', 'flying'];
		cb(data);
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
export function filterByHouse(house) {
	return STATIC.characters.filter((cd) => {
		if(house === 'seiros') {
			return ['kos', 'cos'].indexOf(cd.house) > -1;
		}
		return cd.house == house;
	});
}
