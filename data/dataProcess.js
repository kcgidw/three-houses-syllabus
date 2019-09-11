const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const _ = require('lodash');

const DATA = {};

function processCsvFile(filename, fn, cb) {
	return function(cb) {
		fs.readFile(path.resolve(__dirname, filename), function(err, fileData) {
			if (err) throw err;
			console.log('Begin parsing ' + filename);
			parse(fileData, { columns: true, trim: true }, function(err, parsed) {
				if (err) throw err;
				fn(parsed, cb);
			});
		});
	};
}

async.series([
	processCsvFile('characters.csv', function(parsed, cb) {
		DATA.characters = parsed.map((char, idx) => {
			let res = {
				name: char.name,
				id: idx,
				house: char.house,
				growths: {},
			};
			Object.keys(char).forEach((k) => {
				if (k.indexOf('growths_') !== -1) {
					res.growths[k.replace('growths_', '')] = char[k];
				}
			});
			return res;
		});
		cb();
	}),
	processCsvFile('abilities.csv', function(parsed, cb) {
		DATA.abilities = parsed.map((row, idx) => {
			delete row.origin;
			row.id = idx;
			return row;
		});
		cb();
	}),
	processCsvFile('classes.csv', function(parsed, cb) {
		DATA.classes = parsed.map((row, idx) => {
			let res = {
				id: idx,
				name: row.name,
				growths: {},
				certification: {},
				masteredAbility: row.mastered_ability,
				tier: row.tier,
				tags: row.tags ? row.tags.replace(/ /g,'').split(',') : [],
			// equippedAbilities: [],
			};
			Object.keys(row).forEach((k) => {
				let val = row[k];
				if(val !== '') {
					if (k.indexOf('growths_') !== -1) {
						if(isNaN(val)) throw new Error('bad val ' + val);
						res.growths[k.replace('growths_', '')] = val;
					} else if (k.indexOf('cert_') !== -1) {
						res.certification[k.replace('cert_', '')] = val;
					} else if (k.indexOf('equip_ability') !== -1) {
					// validate that ability exists
					// if(!DATA.abilities.find((i) => (i.name.trim() == val.trim()))) {
					// 	throw new Error(`Can't find ability ` + val);
					// }
					// res.equippedAbilities.push(val);
					}
				}
			});
			return res;
		});
		cb();
	}),
	processCsvFile('supports.csv', function(parsed, cb) {
		parsed.forEach((i) => {
			let obj = DATA.characters.find((cur) => {
				return cur.name.trim() == i.name.trim();
			});
			if (obj) {
				let supportsStr = i.supports.replace(/ /g, '');
				let supports = supportsStr.split(",");
				obj.supports = supports;
			}
		});
		cb();
	}),
], finish);

function finish() {
	fs.writeFile(path.resolve(__dirname, '..', 'public', 'data.json'), JSON.stringify(DATA), (err) => {
		if (err) {
			throw err;
		}
		console.log('File saved');
	});
}