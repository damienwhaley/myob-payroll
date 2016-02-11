/*global describe:false, it:false, before:false*/

'use strict';

var dateHelper = require('../../lib/date_helper.js');
var should = require('should');

describe('Date Helper', function () {

	describe('isDateValid', function () {

		it('should pass with a valid date', function (done) {
			var dateFixture1 = new Date();
			var dateFixture2 = '2016-09-06';

			var result1 = dateHelper.isDateValid(dateFixture1);
			result1.should.be.ok();

			var result2 = dateHelper.isDateValid(dateFixture2);
			result2.should.be.ok();

			done();
		});

		it('should not pass with an invalid date', function (done) {
			var dateFixture = '2016-09-40';

			var result1 = dateHelper.isDateValid(null);
			result1.should.not.be.ok();

			var result2 = dateHelper.isDateValid();
			result2.should.not.be.ok();

			var result3 = dateHelper.isDateValid(dateFixture);
			result2.should.not.be.ok();

			done();
		});
	});

	describe('calculateNumberOfMonths', function () {

		it('should calculate the correct number of months (where dates in same month)', function (done) {
			var startDateFixture = new Date('2016-09-01');
			var endDateFixture = new Date('2016-09-30');

			var result = dateHelper.calculateNumberOfMonths(startDateFixture, endDateFixture);

			result.should.equal(1);
			done();
		});

		it('should calculate the correct number of months (where dates in same year)', function (done) {
			var startDateFixture = new Date('2016-01-01');
			var endDateFixture = new Date('2016-12-31');

			var result = dateHelper.calculateNumberOfMonths(startDateFixture, endDateFixture);

			result.should.equal(12);
			done();
		});

		it('should calculate the correct number of months (where dates roll into next year)', function (done) {
			var startDateFixture = new Date('2016-12-31');
			var endDateFixture = new Date('2017-01-31');

			var result = dateHelper.calculateNumberOfMonths(startDateFixture, endDateFixture);

			result.should.equal(2);
			done();
		});

		it('should calculate the correct number of months with no end date (assumes same month)', function (done) {
			var startDateFixture = new Date('2016-12-31');

			var result1 = dateHelper.calculateNumberOfMonths(startDateFixture, null);

			result1.should.equal(1);

			var result2 = dateHelper.calculateNumberOfMonths(startDateFixture);

			result2.should.equal(1);
			done();
		});

		it('should not calculate the correct number of months with no start date', function (done) {
			var endDateFixture = new Date('2017-01-31');

			var result = dateHelper.calculateNumberOfMonths(null, endDateFixture);

			result.should.equal(0);
			done();
		});
	});

	describe('isRangeValid', function () {

		it('should pass with valid date range', function (done) {
			var startDateFixture = new Date('2016-12-31');
			var endDateFixture = new Date('2017-01-31');

			var result = dateHelper.isRangeValid(startDateFixture, endDateFixture);

			result.should.be.ok();
			done();
		});

		it('should pass with a missing end date', function (done) {
			var startDateFixture = new Date('2016-12-31');

			var result1 = dateHelper.isRangeValid(startDateFixture, null);
			result1.should.be.ok();

			var result2 = dateHelper.isRangeValid(startDateFixture);
			result2.should.be.ok();

			done();
		});

		it('should not pass with a missing end date', function (done) {
			var endDateFixture = new Date('2016-12-31');

			var result = dateHelper.isRangeValid(null, endDateFixture);
			result.should.not.be.ok();

			done();
		});

		it('should not pass with a start date after the end date', function (done) {
			var endDateFixture = new Date('2017-12-31');
			var endDateFixture = new Date('2016-12-31');

			var result = dateHelper.isRangeValid(null, endDateFixture);
			result.should.not.be.ok();

			done();
		});
	});

	describe('getMonthsInYear', function () {

		it('should return 12', function (done) {
			var result = dateHelper.getMonthsInYear();

			result.should.equal(12.0);
			done();
		});

	});

	describe('specialisedParseDate', function () {

		it('should correctly parse the date', function (done) {
			// Cherry picking random dates, should add more to make sure I have it 100% covered
			var dateStringFixture1 = '16 September';
			var dateStringFixture2 = '01 March';
			var dateStringFixture3 = '7 November';

			var result1 = dateHelper.specialisedParseDate(dateStringFixture1);

			result1.should.be.a.Date;
			result1.getFullYear().should.equal(new Date().getFullYear());
			result1.getMonth().should.equal(8); // Javascript zero based date numbers
			result1.getDate().should.equal(16);

			var result2 = dateHelper.specialisedParseDate(dateStringFixture2);

			result2.should.be.a.Date;
			result2.getFullYear().should.equal(new Date().getFullYear());
			result2.getMonth().should.equal(2); // Javascript zero based date numbers
			result2.getDate().should.equal(1);

			var result3 = dateHelper.specialisedParseDate(dateStringFixture3);

			result3.should.be.a.Date;
			result3.getFullYear().should.equal(new Date().getFullYear());
			result3.getMonth().should.equal(10); // Javascript zero based date numbers
			result3.getDate().should.equal(7);

			done();
		});

		it('should not correctly parse date for invalid input', function (done) {

			var dateStringFixture = '11/12';

			var result1 = dateHelper.specialisedParseDate(dateStringFixture);
			(result1 === null).should.be.ok();

			var result2 = dateHelper.specialisedParseDate(null);
			(result2 === null).should.be.ok();

			var result3 = dateHelper.specialisedParseDate();
			(result3 === null).should.be.ok();

			var result4 = dateHelper.specialisedParseDate(new Date());
			(result4 === null).should.be.ok();

			done();
		});
	});
});
