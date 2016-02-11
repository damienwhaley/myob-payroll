'use strict';

var taxRateCalculator = require('./tax_rate_calculator.js');
var taxRateSelector = require('./tax_rate_selector.js');
var dateHelper = require('./date_helper.js');
var util = require('util');

/**
 * processRow - this processes a single row and produces an output row
 * @param row - An array of strings from the CSV
 * @return Array - an array of columns representing the output for the row
 */
function processRow (row) {
	var outputRow = [];

	if (!row || row.length < 5) {
		// Fast fail
		return outputRow;
	}
	//David,Rudd,60050,9%,01 March – 31 March

	outputRow.push(util.format('%s %s', row[0].trim(), row[1].trim()));
	outputRow.push(row[4].trim());

	var dateRange = row[4].split('-');

	var startDate = dateHelper.specialisedParseDate(dateRange[0].trim());
	var endDate = dateHelper.specialisedParseDate(dateRange[1].trim());
	var annualIncome = parseFloat(row[2]);
	var superRate = parseFloat(row[3].replace('%', ''));

	var taxRates = taxRateSelector.fetchTaxRates(startDate, endDate);

	var grossIncome = taxRateCalculator.calculateGrossIncome(startDate, endDate, annualIncome);
	outputRow.push(grossIncome);

	// For a single month this will work fine, but when the period spans over two tax years you would need
	// to get the tax brackets for each year.
	var foundTaxRate = taxRateSelector.fetchTaxBracket(taxRates[0], annualIncome);

	// Being nice here assuming everyone has private health insurance
	var incomeTax = taxRateCalculator.calculateIncomeTax(foundTaxRate, startDate, endDate, annualIncome, false);
	outputRow.push(incomeTax);
	outputRow.push(grossIncome - incomeTax);

	var superAmount = taxRateCalculator.calculateSuper (superRate, grossIncome);
	outputRow.push(superAmount);

	return outputRow;
}

module.exports = {
	processRow: processRow
};
