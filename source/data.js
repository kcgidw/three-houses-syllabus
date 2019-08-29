function loadData(cb) {
	$.getJSON('data.json', (data) => {
		cb(data);
	});
}

export {loadData};