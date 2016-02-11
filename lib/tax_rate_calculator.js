'use strict';

var moment = require('moment');
var dateHelper = require('./date_helper.js');
var _ = require('lodash');

/*
$37,001 - $80,000       $3,572 plus 32.5c for each $1 over $37,000

Employee annual salary is 60,050, super rate is 9%, how much will this employee be paid for the month of March ?
•       pay period = Month of March (01 March to 31 March)
•       gross income = 60,050 / 12 = 5,004.16666667 (round down) = 5,004
•       income tax = (3,572 + (60,050 - 37,000) x 0.325) / 12  = 921.9375 (round up) = 922
•       net income = 5,004 - 922 = 4,082
•       super = 5,004 x 9% = 450.36 (round down) = 450
*/

/**
 * calculateGrossIncome - calculates the gross income as a portion of the anual income
 * @param startDate - Date object containing the start of the date range to check
 * @param endDate - Date object containing the end of the date range to check
 * @param annualGrossIncome - Float containing the annual gross income
 * @return Integer - containing the portion of the annual salary rounded down
 */
function calculateGrossIncome (startDate, endDate, annualGrossIncome) {
	if (!dateHelper.isDateValid(startDate)) {
		// Fast fail
		return 0;
	}

	if (!dateHelper.isDateValid(endDate)) {
		endDate = startDate;
	}

	if (!dateHelper.isRangeValid(startDate, endDate)) {
		// Fast fail
		return 0;
	}

	if (typeof annualGrossIncome === 'undefined' ||
		annualGrossIncome === null ||
		isNaN(annualGrossIncome)) {
		// Fast fail
		return 0;
	}

	annualGrossIncome *= 1; // Cast to float

	if (annualGrossIncome <= 0.0) {
		// Fast fail
		return 0;
	}

	var numberOfMonths = dateHelper.calculateNumberOfMonths(startDate, endDate);

	if (numberOfMonths < 1) {
		// Fast fail and no div by zero
		return 0;
	}

	numberOfMonths *= 1; // Cast to float

	var grossIncome = (annualGrossIncome / dateHelper.getMonthsInYear()) * numberOfMonths;

	return Math.round(grossIncome);
}

/**
 * calculateIncomeTax - calculates the income tax as a portion of the anual income
 * @param taxRate - Object containing the single tax rate information
 * @param startDate - Date object containing the start of the date range to check
 * @param endDate - Date object containing the end of the date range to check
 * @param annualGrossIncome - Float containing the annual gross income
 * @param includeMedicareLevy - Boolean where true means to include the medicare levy
 * @return Integer - containing the portion of the income tax rounded down
 */
function calculateIncomeTax(taxRate, startDate, endDate, annualGrossIncome, includeMedicareLevy) {
	if (!dateHelper.isDateValid(startDate)) {
		// Fast fail
		return 0;
	}

	if (!dateHelper.isDateValid(endDate)) {
		endDate = startDate;
	}

	if (!dateHelper.isRangeValid(startDate, endDate)) {
		// Fast fail
		return 0;
	}

	if (typeof annualGrossIncome === 'undefined' ||
		annualGrossIncome === null ||
		isNaN(annualGrossIncome)) {
		// Fast fail
		return 0;
	}

	annualGrossIncome *= 1; // Cast to float

	if (annualGrossIncome <= 0.0) {
		// Fast fail
		return 0;
	}

	var numberOfMonths = dateHelper.calculateNumberOfMonths(startDate, endDate);

	if (numberOfMonths < 1) {
		// Fast fail and no div by zero
		return 0;
	}

	var taxFixed = (taxRate.rates.tax_fixed || 0.0) * 1.0;
	var taxExcess = (taxRate.rates.tax_excess || 0.0) * 1.0;
	var taxExcessOver = (taxRate.rates.tax_excess_over || 0.0) * 1.0;

	var incomeTax = ((taxFixed + ((annualGrossIncome - taxExcessOver) * taxExcess)) / dateHelper.getMonthsInYear()) * numberOfMonths;

	var additionalTax = 0.0;
	includeMedicareLevy = includeMedicareLevy || false;

	_.each(taxRate.levies, function (value) {
		if (value.name.toLowerCase() === 'medicare levy' &&
			includeMedicareLevy === true) {
			additionalTax += ((value.levy_percent / 100.0) * annualGrossIncome);
		}
		else if (value.name.toLowerCase() !== 'medicare levy') {
			additionalTax += ((value.levy_percent / 100.0) * annualGrossIncome);
		}
	});

	if (additionalTax > 0.0) {
		additionalTax = (additionalTax / dateHelper.getMonthsInYear()) * numberOfMonths;
	}

	return Math.round(incomeTax + additionalTax);
}

/**
 * calculateSuper - This caculates the super amount payable based on a portion of the gross income
 * @param superRate - Float containing the rate for the super as a percentage
 * @param incomeAmount - Float containing the income amount
 * @return - Integer containing the super amount rounded to the nearest whole dollar
 */
function calculateSuper (superRate, incomeAmount) {
	if (typeof superRate === 'undefined' ||
		superRate === null ||
		isNaN(superRate)) {
		// Fast fail
		return 0;
	}

	if (typeof incomeAmount === 'undefined' ||
		incomeAmount === null ||
		isNaN(incomeAmount)) {
		return 0;
	}

	// Cast as floats
	incomeAmount = incomeAmount * 1.0;
	superRate = superRate * 1.0;

	if (superRate < 0.0 || superRate > 50.0) {
		// This is our super rate allowed range
		return 0;
	}

	if (incomeAmount <= 0.0) {
		return 0;
	}

	return Math.round((superRate / 100.0) * incomeAmount);
}

module.exports = {
	calculateGrossIncome: calculateGrossIncome,
	calculateIncomeTax: calculateIncomeTax,
	calculateSuper: calculateSuper
};
