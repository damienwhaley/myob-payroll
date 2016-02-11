/*global describe:false, it:false, before:false*/

'use strict';

var fixtures = require('../fixtures/fixture.js');
var taxRateCalculator = require('../../lib/tax_rate_calculator.js');
var should = require('should');
var _ = require('lodash');

describe('Tax Rate Calculator', function () {

	describe('calculateGrossIncome', function () {

		it('Should calculate the income amount for a proper date range (one month)', function (done) {
			var annualIncomeFixture = 100000;
			var startDateFixture = new Date('2016-09-01');
			var endDateFixture = new Date('2016-09-30');

			var result = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, annualIncomeFixture);
			result.should.equal(8333);
			done();
		});

		it('Should calculate the income amount for a proper date range (two months)', function (done) {
			var annualIncomeFixture = 100000;
			var startDateFixture = new Date('2016-09-01');
			var endDateFixture = new Date('2016-10-31');

			var result = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, annualIncomeFixture);
			result.should.equal(16667);
			done();
		});

		it('Should calculate the income amount for a proper date range (using example provided)', function (done) {
			var annualIncomeFixture = 60050;
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, annualIncomeFixture);
			result.should.equal(5004);
			done();
		});

		it('Should not calculate the income amount for a missing start date', function (done) {
			var annualIncomeFixture = 100000;
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateGrossIncome(null, endDateFixture, annualIncomeFixture);
			result.should.equal(0);
			done();
		});

		it('Should calculate the income amount when missing end date (assume 1 month)', function (done) {
			var annualIncomeFixture = 100000;
			var startDateFixture = new Date('2016-09-01');

			var result = taxRateCalculator.calculateGrossIncome(startDateFixture, null, annualIncomeFixture);
			result.should.equal(8333);
			done();
		});

		it('Should not calculate the income amount for a missing or invalid income', function (done) {
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result1 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture);
			result1.should.equal(0);

			var result2 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, null);
			result2.should.equal(0);

			var result3 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, 'I haz the moneyz');
			result3.should.equal(0);

			var result4 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, -400);
			result3.should.equal(0);

			var result5 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, -200.0);
			result5.should.equal(0);

			var result6 = taxRateCalculator.calculateGrossIncome(startDateFixture, endDateFixture, 0);
			result6.should.equal(0);

			done();
		});
	});

	describe('calculateIncomeTax', function () {

		it('should calculate the correct income tax based on the example', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 37001.0,
				"max": 80000.0,
				"tax_fixed": 3572.0,
				"tax_excess": 0.325,
				"tax_excess_over": 37000.0
			});
			taxRateFixture.levies = [];

			var annualIncomeFixture = 60050;
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, startDateFixture, endDateFixture, annualIncomeFixture, false);

			result.should.equal(922);
			done();


		});

		it('should calculate the correct income tax without medicare', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 80001.0,
				"max": 180000.0,
				"tax_fixed": 17547.0,
				"tax_excess": 0.45,
				"tax_excess_over": 80000.0
			});

			var annualIncomeFixture = 100000.0;
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, startDateFixture, endDateFixture, annualIncomeFixture, false);

			result.should.equal(2212);
			done();
		});

		it('should calculate the correct income tax with medicare', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 80001.0,
				"max": 180000.0,
				"tax_fixed": 17547.0,
				"tax_excess": 0.45,
				"tax_excess_over": 80000.0
			});

			var annualIncomeFixture = 100000.0;
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, startDateFixture, endDateFixture, annualIncomeFixture, true);

			result.should.equal(2379);
			done();
		});

		it('should not calculate the correct income with missing start date', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 80001.0,
				"max": 180000.0,
				"tax_fixed": 17547.0,
				"tax_excess": 0.45,
				"tax_excess_over": 80000.0
			});

			var annualIncomeFixture = 100000.0;
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, null, endDateFixture, annualIncomeFixture, true);

			result.should.equal(0);
			done();
		});

		it('should not calculate the correct income tax incorrect annual salary', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 80001.0,
				"max": 180000.0,
				"tax_fixed": 17547.0,
				"tax_excess": 0.45,
				"tax_excess_over": 80000.0
			});

			var annualIncomeFixture = 0;
			var startDateFixture = new Date('2016-03-01');
			var endDateFixture = new Date('2016-03-31');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, startDateFixture, endDateFixture, annualIncomeFixture, true);

			result.should.equal(0);
			done();
		});

		it('should calculate the correct income tax without end date (assume 1 month)', function (done) {

			var taxRateFixture = fixtures.generateFoundTaxRateFixture({
				"min": 80001.0,
				"max": 180000.0,
				"tax_fixed": 17547.0,
				"tax_excess": 0.45,
				"tax_excess_over": 80000.0
			});

			var annualIncomeFixture = 100000.0;
			var startDateFixture = new Date('2016-03-01');

			var result = taxRateCalculator.calculateIncomeTax(taxRateFixture, startDateFixture, null, annualIncomeFixture, false);

			result.should.equal(2212);
			done();
		});
	});

	describe('calculateSuper', function () {

		it('should calculate the correct super based on the example provided', function (done) {

			var superRateFixture = 9.0;
			var incomeAmountFixture = 5004.0;

			var result = taxRateCalculator.calculateSuper(superRateFixture, incomeAmountFixture);

			result.should.equal(450);
			done();
		});

		it('should calculate the correct super for other amounts (wouldn\'t this be nice)', function (done) {

			var superRateFixture = 17.0;
			var incomeAmountFixture = 8333.0;

			var result = taxRateCalculator.calculateSuper(superRateFixture, incomeAmountFixture);

			result.should.equal(1417);
			done();
		});

		it('should not calculate the correct super if incorrect super value passed in', function (done) {

			var incomeAmountFixture = 10000.0;

			var result1 = taxRateCalculator.calculateSuper(null, incomeAmountFixture);
			result1.should.equal(0);

			var result2 = taxRateCalculator.calculateSuper(0.0, incomeAmountFixture);
			result2.should.equal(0);

			var result3 = taxRateCalculator.calculateSuper(-10.0, incomeAmountFixture);
			result3.should.equal(0);

			var result3 = taxRateCalculator.calculateSuper(50.1, incomeAmountFixture);
			result3.should.equal(0);

			done();
		});


	});
});
