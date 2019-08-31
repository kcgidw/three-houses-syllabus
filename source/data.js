let DATA = {
	characters: undefined,
	stats: undefined,
	classes: undefined,
};

function loadData(cb) {
	$.getJSON('data.json', (data) => {
		DATA = data;
		console.log(data);
		DATA.stats = ['hp','str','mag','dex','spd','lck','def','res','cha'];
		cb(data);
	});
}

export {loadData, DATA};