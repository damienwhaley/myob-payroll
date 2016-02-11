/*global describe:false, it:false, before:false*/

'use strict';

var fixtures = require('../fixtures/fixture.js');
var taxRateSelector = require('../../lib/tax_rate_selector.js');
var should = require('should');
var _ = require('lodash');

describe('Tax Rate Selector', function () {

	describe('doesDateFallInTaxRate', function () {

		var taxRateFixture = {};

		before(function (done) {
			taxRateFixture = fixtures.generateTaxRateFixture({
				start: '2010-07-01',
				end: '2011-06-30'
			});
			done();
		});

		it('should fall inside for valid date', function (done) {
			var dateToCheckFixture = new Date('2010-09-06');
			var result = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result.should.be.ok();
			done();
		});

		it('should fall outside for invalid date', function (done) {
			var dateToCheckFixture = new Date('2016-09-06');
			var result = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result.should.not.be.ok();
			done();
		});

		it('should fall outside for null date', function (done) {
			var result = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, null);
			result.should.not.be.ok();
			done();
		});

		it('should fall outside for missing date', function (done) {
			var result = taxRateSelector.doesDateFallInTaxRate(taxRateFixture);
			result.should.not.be.ok();
			done();
		});

		it('should fall outside for missing start date in tax rate', function (done) {
			var badTaxRateFixture = _.clone(taxRateFixture, true);
			badTaxRateFixture.start = null;
			var dateToCheckFixture = new Date('2016-09-06');

			var result1 = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result1.should.not.be.ok();

			delete badTaxRateFixture.start;

			var result2 = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result2.should.not.be.ok();
			done();
		});

		it('should fall outside for missing end date in tax rate', function (done) {
			var badTaxRateFixture = _.clone(taxRateFixture, true);
			badTaxRateFixture.end = null;
			var dateToCheckFixture = new Date('2016-09-06');

			var result1 = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result1.should.not.be.ok();

			delete badTaxRateFixture.end;
			var result2 = taxRateSelector.doesDateFallInTaxRate(taxRateFixture, dateToCheckFixture);
			result2.should.not.be.ok();
			done();
		});

		it('should fall outside for null tax rate', function (done) {
			var dateToCheckFixture = new Date('2016-09-06');
			var result = taxRateSelector.doesDateFallInTaxRate(null, dateToCheckFixture);
			result.should.not.be.ok();
			done();
		});

		it('should fall outside for empty tax rate', function (done) {
			var dateToCheckFixture = new Date('2016-09-06');
			var result = taxRateSelector.doesDateFallInTaxRate({}, dateToCheckFixture);
			result.should.not.be.ok();
			done();
		});
	});

	describe('fetchTaxRates', function () {

		it('should fetch one tax rate for a single month', function (done) {
			var startDateFixture = new Date('2015-09-01');
			var endDateFixture = new Date('2015-09-30');

			var result = taxRateSelector.fetchTaxRates(startDateFixture, endDateFixture);

			result.should.be.an.Array;
			(result.length).should.equal(1);
			done();
		});

		it('should fetch two tax rates for the range being over multiple tax years', function (done) {
			var startDateFixture = new Date('2014-01-01');
			var endDateFixture = new Date('2014-12-31');

			var result = taxRateSelector.fetchTaxRates(startDateFixture, endDateFixture);

			result.should.be.an.Array;
			(result.length).should.equal(2);
			done();
		});

		it('should not fetch tax rates for missing start date', function (done) {
			var endDateFixture = new Date('2014-12-31');

			var result = taxRateSelector.fetchTaxRates(null, endDateFixture);

			result.should.be.an.Array;
			(result.length).should.equal(0);
			done();
		});

		it('should fetch one tax rate for a missing end date (assumes a single month)', function (done) {
			var startDateFixture = new Date('2014-09-01');

			var result1 = taxRateSelector.fetchTaxRates(startDateFixture, null);

			result1.should.be.an.Array;
			(result1.length).should.equal(1);

			var result2 = taxRateSelector.fetchTaxRates(startDateFixture);

			result1.should.be.an.Array;
			(result1.length).should.equal(1);

			done();
		});
	});

	describe('fetchTaxBracket', function () {

		var taxRateFixture = {};

		before(function (done) {
			taxRateFixture = fixtures.generateTaxRateFixture({
				start: '2010-07-01',
				end: '2011-06-30'
			});
			done();
		});

		it('should fetch the lowest bracket for zero income', function (done) {
			var incomeFixture = 0.0;

			var result = taxRateSelector.fetchTaxBracket(taxRateFixture, incomeFixture);

			result.should.be.an.Object;
			(result.rates).should.be.an.Object;
			(result.rates.min).should.equal(0.0);
			(result.rates.max).should.equal(18200.0);
			(result.levies).should.be.an.Array;
			(result.levies.length).should.equal(1);
			done();
		});

		it('should not fetch a bracket for negative income', function (done) {
			var incomeFixture = -1000.0;

			var result = taxRateSelector.fetchTaxBracket(taxRateFixture, incomeFixture);

			result.should.be.an.Object;
			(result.rates).should.be.an.Object;
			(result.rates).should.deepEqual({});
			(result.levies).should.be.an.Array;
			(result.levies.length).should.equal(0);
			done();
		});

		it('should not fetch a bracket for missing income', function (done) {
			var result1 = taxRateSelector.fetchTaxBracket(taxRateFixture, null);

			result1.should.be.an.Object;
			(result1.rates).should.be.an.Object;
			(result1.rates).should.deepEqual({});
			(result1.levies).should.be.an.Array;
			(result1.levies.length).should.equal(0);

			var result2 = taxRateSelector.fetchTaxBracket(taxRateFixture, null);

			result2.should.be.an.Object;
			(result2.rates).should.be.an.Object;
			(result2.rates).should.deepEqual({});
			(result2.levies).should.be.an.Array;
			(result2.levies.length).should.equal(0);

			done();
		});

		it('should fetch the highest bracket for CEO income', function (done) {
			var incomeFixture = 10000000.0;

			var result = taxRateSelector.fetchTaxBracket(taxRateFixture, incomeFixture);

			result.should.be.an.Object;
			(result.rates).should.be.an.Object;
			(result.rates.min).should.equal(180001.0);
			(result.rates.max === null).should.be.ok();
			(result.levies).should.be.an.Array;
			(result.levies.length).should.equal(2);
			done();
		});

		it('should aways round down to fetch the lower bracket if close (rounds down like income tax statements)', function (done) {
			var incomeFixture = 37000.99;

			var result = taxRateSelector.fetchTaxBracket(taxRateFixture, incomeFixture);

			result.should.be.an.Object;
			(result.rates).should.be.an.Object;
			(result.rates.min).should.equal(18201.0);
			(result.rates.max).should.equal(37000.0);
			(result.levies).should.be.an.Array;
			(result.levies.length).should.equal(1);
			done();
		});
	});
});
