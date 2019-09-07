export let STATIC = {
	characters: undefined,
	stats: undefined,
	classes: undefined,
};

export function loadData(cb) {
	$.getJSON('data.json', (data) => {
		STATIC = data;
		console.log(data);
		STATIC.stats = ['hp','str','mag','dex','spd','lck','def','res','cha'];
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
export function filterByHouse(house) {
	return STATIC.characters.filter((cd) => {
		return cd.house == house;
	});
}
