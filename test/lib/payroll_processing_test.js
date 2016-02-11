/*global describe:false, it:false, before:false*/

'use strict';

var fixtures = require('../fixtures/fixture.js');
var payrollProcessing = require('../../lib/payroll_processing.js');
var should = require('should');
var util = require('util');

describe('Payroll processing', function () {

	describe('processRow', function () {

		it('should process a row from the example given', function (done) {

			var inputRowFixture = fixtures.generateInputRowFixture();

			var result = payrollProcessing.processRow(inputRowFixture);

			result.should.be.an.Array;
			(result.length).should.equal(6);
			result[0].should.equal(util.format('%s %s', inputRowFixture[0], inputRowFixture[1]));
			result[1].should.equal(inputRowFixture[4]);
			result[2].should.equal(5004);
			result[3].should.equal(922);
			result[4].should.equal(4082);
			result[5].should.equal(450);
			done();
		});

		it('should not process a row with bad input', function (done) {

			var inputRowFixture = ['not', 'right', 'format'];

			var result = payrollProcessing.processRow(inputRowFixture);

			result.should.be.an.Array;
			(result.length).should.equal(0);
			done();
		});
	});

});
