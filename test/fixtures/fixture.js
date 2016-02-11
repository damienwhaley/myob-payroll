'use strict';

function generateTaxRateFixture (options) {
	options = options || {};

	var taxRateFixture = {
		start: options.start || '2015-07-01',
		end: options.end || '2016-06-30',
		rates: [
			{
				min: 0.0,
				max: 18200.0,
				tax_fixed: 0.0,
				tax_excess: 0.0,
				tax_excess_over: 0.0
			},
			{
				min: 18201.0,
				max: 37000.0,
				tax_fixed: 0.0,
				tax_excess: 0.19,
				tax_excess_over: 18200.0
			},
			{
				min: 37001.0,
				max: 80000.0,
				tax_fixed: 3572.0,
				tax_excess: 0.325,
				tax_excess_over: 37000.0
			},
			{
				min: 80001.0,
				max: 180000.0,
				tax_fixed: 17547.0,
				tax_excess: 0.45,
				tax_excess_over: 80000.0
			},
			{
				min: 180001.0,
				max: null,
				tax_fixed: 54547.0,
				tax_excess: 0.37,
				tax_excess_over: 180000.0
			}
		],
		levies: [
			{
				name: 'Medicare levy',
				levy_percent: 2.0,
				min_income: 0
			},
			{
				name: 'Temporary Budget Repair Levy',
				levy_percent: 2.0,
				min_income: 180001.0
			}
		]
	};
	return taxRateFixture;
}

function generateFoundTaxRateFixture (options) {
	options = options || {};

	var foundTaxRateFixture = {
		start: options.start || '2015-07-01',
		end: options.end || '2016-06-30',
		rates: {
			min: options.min || 37001.0,
			max: options.max || 80000.0,
			tax_fixed: options.tax_fixed || 3572.0,
			tax_excess: options.tax_excess || 0.325,
			tax_excess_over: options.tax_excess_over || 37000.0
		},
		levies: [
			{
				name: 'Medicare levy',
				levy_percent: 2.0,
				min_income: 0
			}
		]
	};

	if (foundTaxRateFixture.rates.min >= 180001.0) {
		foundTaxRateFixture.levies.push({
			name: 'Temporary Budget Repair Levy',
			levy_percent: 2.0,
			min_income: 180001.0
		});
	}
	return foundTaxRateFixture;
}

function generateInputRowFixture (options) {
	options = options || {};

	return [ 'David', 'Rudd', '60050', '9%', '01 March - 31 March' ];
}

module.exports = {
	generateTaxRateFixture: generateTaxRateFixture,
	generateFoundTaxRateFixture: generateFoundTaxRateFixture,
	generateInputRowFixture: generateInputRowFixture
};
