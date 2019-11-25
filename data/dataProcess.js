const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const yaml = require('js-yaml');
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
	processCsvFile('units.csv', function(parsed, cb) {
		DATA.units = parsed.map((unit, idx) => {
			let res = {
				name: unit.name,
				id: idx,
				house: unit.house,
				sex: unit.sex,
				growths: {},
				recruit: false,
				personalAbility: unit.personalAbility,
				crests: [],
			};
			Object.keys(unit).forEach((k) => {
				if (k.includes('growths_')) {
					res.growths[k.replace('growths_', '')] = unit[k];
				} else if (k.includes('recruit_') && unit[k]) {
					res.recruit = res.recruit || {};
					res.recruit[k.replace('recruit_', '')] = unit[k];
				}
			});
			if(unit['buddingTalent']) {
				res.buddingTalent = {
					skill: unit['buddingTalentSkill'],
					learn: unit['buddingTalent'],
				};
			}
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
				tags: row.tags ? row.tags.replace(/, /g,',').split(',') : [],
			};
			Object.keys(row).forEach((k) => {
				let val = row[k];
				if(val !== '') {
					if (k.includes('growths_')) {
						if(isNaN(val)) throw new Error('bad val ' + val);
						res.growths[k.replace('growths_', '')] = val;
					} else if (k.includes('cert_')) {
						res.certification[k.replace('cert_', '')] = val;
					}
				}
			});
			return res;
		});
		cb();
	}),
	processCsvFile('supports.csv', function(parsed, cb) {
		parsed.forEach((i) => {
			let obj = DATA.units.find((cur) => {
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
	processCsvFile('skillLevels.csv', function(parsed, cb) {
		parsed.forEach((row) => {
			let obj = DATA.units.find((cur) => {
				return cur.name.trim() == row.unit.trim();
			});
			if(obj) {
				obj.skillLevels = {};
				Object.keys(row).forEach((col) => {
					let val = row[col];
					if(col !== 'unit' && val) {
						obj.skillLevels[col] = val;
					}
				});
			}
		});
		cb();
	}),
	processCsvFile('skillBonus.csv', function(parsed, cb) {
		parsed.forEach((row) => {
			let obj = DATA.classes.find((cur) => {
				return cur.name.trim() == row.className.trim();
			});
			if(obj) {
				obj.skillBonus = {};
				Object.keys(row).forEach((col) => {
					let val = row[col];
					if(col !== 'className' && val) {
						obj.skillBonus[col] = val;
					}
				});
			}
		});
		cb();
	}),
	function(cb) {
		const filename = 'learnable.yaml';
		console.log('Begin parsing ' + filename);
		const data = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, filename), 'utf-8'));
		Object.keys(data).forEach((unitName) => {
			const unit = DATA.units.find((uData) => (uData.name == unitName));
			let abilities = data[unitName].abilities;
			let combatArts = data[unitName]['combat arts'];
			let spells = data[unitName].spells;
			for(let skillCat of Object.keys(abilities)) {
				for(let grade in abilities[skillCat]) {
					validateAbilityExists(abilities[skillCat][grade], DATA.abilities);
				}
			}
			if(unit) {
				unit.learnable = data[unitName];
			} else if(unitName === 'UNIVERSAL') {
				DATA.units.push({
					name: unitName,
					learnable: data[unitName]
				});
			}
		});
		cb();
	},
], finish);

function finish() {
	fs.writeFile(path.resolve(__dirname, '..', 'src', 'data.json'), JSON.stringify(DATA), (err) => {
		if (err) {
			throw err;
		}
		console.log('File saved');
	});
}

function validateAbilityExists(abilityName, abilities) {
	let found = abilities.find((a) => (a.name == abilityName));
	if(!found) {
		throw `Bad ability ${abilityName}`;
	}
}