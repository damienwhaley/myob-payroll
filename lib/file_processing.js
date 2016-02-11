'use strict';

var csv = require('csv');
var dateHelper = require('./date_helper.js');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var payrollProcessing = require('./payroll_processing.js');

/**
 * startProcessing - This starts off the file processing
 * @param input - String containing the path to the input file
 * @param output - String containing the path to the output file
 * @done Callback function - which has the form done(err, result) and result is a Boolean
 *                           where true means the process has finished successfully
 */
function startProcessing (input, output, done) {
	if (!input) {
		if (typeof done === 'function') {
			done(new Error('Input was not provided'));
		}
		return;
	}
	if (!output) {
		if (typeof done === 'function') {
			done(new Error('Output was not provided'));
		}
		return;
	}

	async.series([
		function step1 (next) {
			checkCanReadFile(input, function (err, result) {
				if (err) {
					next(new Error('Input could not be found'), result);
				} else {
					next(null, result);
				}
			});
		},
		function step2 (next) {
			checkCanWriteFile(output, function (err, result) {
				if (err) {
					next(new Error('Output could not be found'), result);
				} else {
					next(null, result);
				}
			});
		},
		function step3 (next) {
			readFileContents(input, function (err1, fileContents) {
				if (err1) {
					next(new Error('Input could not be read'), false);
				} else {
					csv.parse(fileContents, function (err1, inputCsv) {

						var outputCsv = [];

						_.each(inputCsv, function (value) {
							outputCsv.push(payrollProcessing.processRow(value));
						});

						csv.stringify(outputCsv, function (err, newFileContents) {
							if (err) {
								next(err, false);
								return;
							}
							writeFileContents (output, newFileContents, function (err) {
								next(err, (err ? false: true));
							});
						});
					});
				}
			});
		}], function (err, result) {
			if (err) {
				if (typeof done === 'function') {
					done(err, result);
				}
				return;
			}
			if (typeof done === 'function') {
				done(null, result);
			}
		});
}

/**
 * checkCanReadFile - This checks to see if the input file can be read to
 * @param pathToFile - String containing the path to the file
 * @param done - Callback function which takes the form done(err, result) where result is a boolean
 *               with true meaning that the file should be able to be read
 */
function checkCanReadFile (pathToFile, done) {
	if (!pathToFile) {
		if (typeof done === 'function') {
			done(new Error('File path was not provided'), false);
		}
		return;
	}

	fs.stat(path.resolve(pathToFile), function (err, stats) {
		if (err) {
			if (typeof done === 'function') {
				done(err, false);
			}
			return;
		}

		if (!stats.isFile()) {
			if (typeof done === 'function') {
				done(new Error('File path could not be found'), false);
			}
			return;
		} else {
			if (typeof done === 'function') {
				done(null, true);
				return;
			}
		}
	});
}

/**
 * checkCanWriteFile - This checks to see if the output file can be written to
 * @param pathToFile - String containing the path to the file
 * @param done - Callback function which takes the form done(err, result) where result is a boolean
 *               with true meaning that the file should be able to be written to
 */
function checkCanWriteFile (pathToFile, done) {
	if (!pathToFile) {
		if (typeof done === 'function') {
			done(new Error('File path was not provided'), false);
		}
		return;
	}

	fs.stat(path.dirname(path.resolve(pathToFile)), function (err, stats) {
		if (err) {
			if (typeof done === 'function') {
				done(err, false);
			}
			return;
		}

		if (!stats.isDirectory()) {
			if (typeof done === 'function') {
				done(new Error('Directory for file path could not be found'), false);
			}
			return;
		} else {
			if (typeof done === 'function') {
				done(null, true);
				return;
			}
		}
	});
}

/**
 * readFileContents - reads the content from a file
 * @param pathToFile - Sting containing the path to the file
 * @param done - Callback function which has the form done(err, data)
 */
function readFileContents (pathToFile, done) {
	if (!pathToFile) {
		if (typeof done === 'function') {
			done(new Error('Path to file was not provdided'), '');
		}
		return;
	}

	fs.readFile(path.resolve(pathToFile), 'utf8', function(err, data) {
		if (err) {
			if (typeof done === 'function') {
				done(err, '');
			}
			return;
		}
		if (typeof done === 'function') {
			done(null, data);
		}
	});
}

/**
 * writeFileContents - writes the content to a file
 * @param pathToFile - Sting containing the path to the file
 * @param done - Callback function which has the form done(err)
 */
function writeFileContents (pathToFile, data, done) {
	if (!pathToFile) {
		if (typeof done === 'function') {
			done(new Error('Path to file was not provdided'), '');
		}
		return;
	}

	fs.writeFile(path.resolve(pathToFile), data, 'utf8', function(err) {
		if (err) {
			if (typeof done === 'function') {
				done(err);
			}
			return;
		}
		if (typeof done === 'function') {
			done(null);
		}
	});
}

module.exports = {
	checkCanReadFile: checkCanReadFile,
	checkCanWriteFile: checkCanWriteFile,
	startProcessing: startProcessing,
	readFileContents: readFileContents,
	writeFileContents: writeFileContents
};
