const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const _ = require('lodash');

const characters = path.resolve(__dirname, 'characters.csv');
const classes = path.resolve(__dirname, 'classes.csv');
const supports = path.resolve(__dirname, 'supports.csv');

const DATA = {};

async.series([
	function(cb) {
		fs.readFile(characters, function(err, fileData) {
			if (err) throw err;
			parse(fileData, { columns: true, trim: true }, function(err, parsed) {
				if (err) throw err;
				console.log('Parsed characters.csv');
				DATA.characters = parsed.map((char, idx) => {
					let res = {
						name: char.name,
						id: idx,
						growths: {},
					};
					Object.keys(char).forEach((k) => {
						if(k.indexOf('growths_') !== -1) {
							res.growths[k.replace('growths_', '')] = char[k];
						}
					});
					return res;
				});
				cb();
			});
		});
	},
	function(cb) {
		fs.readFile(classes, function(err, fileData) {
			if (err) throw err;
			parse(fileData, { columns: true, trim: true }, function(err, parsed) {
				if (err) throw err;
				console.log('Parsed classes.csv');
				DATA.classes = parsed;
				cb();
			});
		});
	},
	function(cb) {
		fs.readFile(supports, function(err, fileData) {
			if (err) throw err;
			parse(fileData, { columns: false, trim: true }, function(err, parsed) {
				if (err) throw err;
				console.log('Parsed supports.csv');
				parsed.forEach((i) => {
					let name = i[0].toLowerCase().trim();
					let obj = DATA.characters.find((cur) => {
						return cur.name.toLowerCase().trim() == name;
					});
					if(obj) {
						let supportsStr = i[1].replace(/ /g, '');
						let supports = supportsStr.split(",");
						obj.supports = supports;
					}
				});
				cb();
			});
		});
	}
], finish);

function finish() {
	fs.writeFile(path.resolve(__dirname, '..', 'public', 'data.json'), JSON.stringify(DATA), (err) => {
		if (err) {
			throw err;
		}
		console.log('File saved');
	});
}