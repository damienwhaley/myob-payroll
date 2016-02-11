'use strict';

var fileProcessing = require('./lib/file_processing.js');
var yargs = require('yargs').argv;
var util = require('util');

var input = yargs.input;
var output = yargs.output;

console.log('');
console.log('------');
console.log('MYOB Employee monthly payslip coding exercise, by Damien Whaley <damien@damienwhaley.com>');
console.log('------');
console.log('');

/**
 * usage - prints usage instructions
 */
function usage() {
	console.error('Please use the program correctly');
	console.error('')
	console.error('usage: node index.js --input=/path/to/file --output=/path/to/file');
	console.error('');
}

if (!input || !output) {
	usage();
	process.exit();
}

fileProcessing.startProcessing(input, output, function (err, result) {
	if (!err) {
		console.log(util.format('All done! The output can be found in: %s', output));
		console.log('');
	} else {
		console.error('There was a problem running the processing', err);
		console.log('');
	}
});
