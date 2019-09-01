let STATIC = {
	characters: undefined,
	stats: undefined,
	classes: undefined,
};

function loadData(cb) {
	$.getJSON('data.json', (data) => {
		STATIC = data;
		console.log(data);
		STATIC.stats = ['hp','str','mag','dex','spd','lck','def','res','cha'];
		cb(data);
	});
}

function findCharData(name) {
	return STATIC.characters.find((i) => {
		return i.name == name;
	});
}

export {loadData, STATIC, findCharData};