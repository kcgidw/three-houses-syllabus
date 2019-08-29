const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');

const characters = path.resolve(__dirname, 'characters.csv');
const classes = path.resolve(__dirname, 'classes.csv');

const datasets = ['characters', 'classes'];

const DATA = {};

async.parallel([
	function(cb) {
		fs.readFile(characters, function(err, fileData) {
			if (err) {
				throw err;
			}
			parse(fileData, { columns: true, trim: true }, function(err, parsed) {
				if (err) {
					throw err;
				} else {
					console.log('Parsed characters.csv');
					DATA.characters = parsed;

				}
			});
		});
	},
	function(cb) {
		fs.readFile(classes, function(err, fileData) {
			if (err) {
				throw err;
			}
			parse(fileData, { columns: true, trim: true }, function(err, parsed) {
				if (err) {
					throw err;
				} else {
					console.log('Parsed classes.csv');
					DATA.characters = parsed;

					fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(DATA), (err) => {
						if (err) {
							throw err;
						}
						console.log('File saved');
					});
				}
			});
		});
	}
], finish);

function finish() {
	fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(DATA), (err) => {
		if (err) {
			throw err;
		}
		console.log('File saved');
	});
}