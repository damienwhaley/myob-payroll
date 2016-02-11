/*global describe:false, it:false, before:false*/

'use strict';

var fileProcessing = require('../../lib/file_processing.js');
var should = require('should');
var path = require('path');

describe('File processing', function () {

	describe('checkCanReadFile', function () {

		it('can find a file to read', function (done) {
			var filePathFixture = './test/fixtures/input_fixture.csv';

			fileProcessing.checkCanReadFile(filePathFixture, function (err, result) {
				(err === null).should.be.ok();
				result.should.be.ok();
				done();
			});
		});

		it('can not find a file to read', function (done) {
			var filePathFixture = '/a/path/to/a/file/which/does/not/exist/i/hope.txt';

			fileProcessing.checkCanReadFile(filePathFixture, function (err, result) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				result.should.not.be.ok();
				done();
			});
		});

		it('can not find a file to read with no input', function (done) {
			fileProcessing.checkCanReadFile(null, function (err, result) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				result.should.not.be.ok();
				done();
			});
		});
	});

	describe('checkCanWriteFile', function () {

		it('can find a file to write', function (done) {
			var filePathFixture = '/tmp/myob_test_output.csv';

			fileProcessing.checkCanWriteFile(filePathFixture, function (err, result) {
				(err === null).should.be.ok();
				result.should.be.ok();
				done();
			});
		});

		it('can not find a file to write to', function (done) {
			var filePathFixture = '/a/path/to/a/file/which/does/not/exist/i/hope.txt';

			fileProcessing.checkCanWriteFile(filePathFixture, function (err, result) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				result.should.not.be.ok();
				done();
			});
		});

		it('can not find a file to write to with no input', function (done) {
			fileProcessing.checkCanWriteFile(null, function (err, result) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				result.should.not.be.ok();
				done();
			});
		});
	});

	describe('readFileContents', function () {

		it('can find a file to read', function (done) {
			var filePathFixture = './test/fixtures/example_file.txt';

			fileProcessing.readFileContents(filePathFixture, function (err, data) {
				(err === null).should.be.ok();
				data.should.equal('FILE_CONTENTS');
				done();
			});
		});

		it('can not find a file to read with no input', function (done) {
			fileProcessing.readFileContents(null, function (err, data) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				data.should.equal('');
				done();
			});
		});
	});

	describe('writeFileContents', function () {

		it('can find a file to write', function (done) {
			var fileOutputPathFixture = './output/test_output.csv';
			var dataFixture = 'Damien,was,here';

			fileProcessing.writeFileContents(fileOutputPathFixture, dataFixture, function (err, data) {
				(err === null).should.be.ok();
				done();
			});
		});

		it('can not find a file to read with no input', function (done) {
			fileProcessing.readFileContents(null, function (err) {
				(err === null).should.not.be.ok();
				err.should.be.an.Error;
				done();
			});
		});
	});

	describe('startProcessing', function () {

		it('can process a file into output', function (done) {

			var fileInputPathFixture = './test/fixtures/input_fixture.csv';
			var fileOutputPathFixture = './output/test_output.csv';

			fileProcessing.startProcessing(fileInputPathFixture, fileOutputPathFixture, function (err, result) {

				(err === null).should.be.ok();
				result.should.be.an.Array;
				result[0].should.be.ok();
				result[1].should.be.ok();
				result[2].should.be.ok();
				done();
			});
		});

		it('can not process a file with no input', function (done) {

			var fileOutputPathFixture = './output/test_output.csv';

			fileProcessing.startProcessing(null, fileOutputPathFixture, function (err, result) {
				err.should.be.an.Error;
				done();
			});
		});

		it('can not process a file with no output', function (done) {

			var fileInputPathFixture = './test/fixtures/input_fixture.csv';

			fileProcessing.startProcessing(fileInputPathFixture, null, function (err, result) {
				err.should.be.an.Error;
				done();
			});
		});

	});
});
