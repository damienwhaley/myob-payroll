'use strict';

var moment = require('moment');
var _ = require('lodash');
var dateHelper = require('./date_helper.js');

// In lieu of a database we'll use a flat file
var taxRateData = require('../data/tax_rates.json');

/**
 * fetchTaxRates - fetches the tax rates applicable to the date range requested
 * @param startDate - Date object containing the start of the date range to check
 * @param endDate - Date object containing the end of the date range to check
 * @return - Array of tax rate year objects
 */
function fetchTaxRates (startDate, endDate) {
	if (!dateHelper.isDateValid(startDate)) {
		return [];
	}
	if (!dateHelper.isDateValid(endDate)) {
		endDate = startDate;
	}

	var taxRates = [];

	_.each(taxRateData, function (value) {
		if (doesDateFallInTaxRate(value, startDate) ||
			doesDateFallInTaxRate(value, endDate)) {
			taxRates.push(_.clone(value, true));
		}
	});

	return _.uniq(taxRates);
}

/**
 * doesDateFallInTaxRate - checks if a given date falls in a tax rate year
 * @param taxRate - Object containing the tax rate information
 * @param dateToCheck - Date object containing the date to check
 * @return - Boolean where true means that the date falls in the tax rate year
 */
function doesDateFallInTaxRate (taxRate, dateToCheck) {
	taxRate = taxRate || {};

	if (!dateToCheck) {
		// Fail fast
		return false;
	}

	if (!dateHelper.isDateValid(taxRate.start) || !dateHelper.isDateValid(taxRate.end)) {
		// Fail fast
		return false;
	}

	var checkStartDate = moment(taxRate.start);
	var checkEndDate = moment(taxRate.end);

	if (moment(dateToCheck).isBetween(checkStartDate, checkEndDate, 'day')) {
		return true;
	} else {
		return false;
	}
}

/**
 * fetchTaxBracket - Fetches the appropriate bracket and levies. This always rounds down for the income.
 * @param taxRate - Object containing the tax rate information
 * @param taxableIncome - Float containing the taxable income
 * @return - Object comainting the single rate and any applicable levies
 */
function fetchTaxBracket(taxRate, taxableIncome) {
	taxRate = taxRate || {};

	var result = {
		rates: {},
		levies: []
	};

	if (typeof taxableIncome === 'undefined' ||
		taxableIncome === null ||
		isNaN(taxableIncome)) {
		// Fail fast
		return result;
	}

	if ((!taxRate.rates || taxRate.rates.length === 0) &&
		(!taxRate.levies || taxRate.levies === 0)) {
		// Fast fail
		return result;
	}

	taxableIncome *= 1.0; // cast to float
	var foundRate = false;

	_.each(taxRate.rates, function (value) {
		if (Math.floor(taxableIncome) >= value.min &&
			(Math.floor(taxableIncome) <= value.max || value.max === null) &&
			!foundRate) {
			result.rates = _.clone(value, true);
			foundRate = true;
		}
	});

	_.each(taxRate.levies, function (value) {
		if (Math.floor(taxableIncome) >= value.min_income) {
			result.levies.push(_.clone(value, true));
		}
	});

	return result;
}

module.exports = {
	fetchTaxRates: fetchTaxRates,
	doesDateFallInTaxRate: doesDateFallInTaxRate,
	fetchTaxBracket: fetchTaxBracket
};
