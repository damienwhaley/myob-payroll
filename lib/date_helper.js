'use strict';

var moment = require('moment');
var util = require('util');

/**
 * isDateValid - determines whether the date is valid or not
 * @param dateToCheck - Date object or string to check
 * @return Boolean - where true means that the date is valid
 */
function isDateValid (dateToCheck) {
	if (!dateToCheck) {
		// Fail fast
		return false;
	}

	var momentDate = moment(dateToCheck);
	return momentDate.isValid();
}

/**
 * calculateNumberOfMonths - calculates the effective number of months between dates
 * @param startDate - Date object containing the start of the date range
 * @param endDate - Date object containing the end of the date range
 * @return Integer - containing the number of months
 */
function calculateNumberOfMonths (startDate, endDate) {
	if (!isDateValid(startDate)) {
		// Fast fail
		return 0;
	}

	if (!isDateValid(endDate)) {
		endDate = startDate;
	}

	var checkStartDate = moment(startDate);
	var checkEndDate = moment(endDate);

	var numberOfMonths = checkEndDate.diff(checkStartDate, 'months');
	numberOfMonths++; // always add 1 as start to end of month = 0 months difference

	return numberOfMonths;
}

/**
 * isRangeValid - determines whether a date range is valid
 * @param startDate - Date object containing the start of the date range
 * @param endDate - Date object containing the end of the date range
 * @return Boolean - where true means that the date range is valid
 */
function isRangeValid (startDate, endDate) {
	if (!isDateValid(startDate)) {
		return false;
	}
	if (!isDateValid(endDate)) {
		endDate = startDate;
	}

	var checkStartDate = moment(startDate);
	var checkEndDate = moment(endDate);

	var numberOfDays = checkEndDate.diff(checkStartDate, 'days');

	if (numberOfDays < 0) {
		return false;
	} else {
		return true;
	}
}

/**
 * getMonthsInYear - returns the number of months in a year
 * @return Float - containing the number of years
 */
function getMonthsInYear() {
	return moment.months().length * 1.0;
}

/**
 * specialisedParseDate - This takes the special string as in the examples and converts it to a date object
 * @param dateString - String containing the date part
 * @return Date object - containing the date assuming this year or null if it is not valid
 */
function specialisedParseDate(dateString) {
	if (!dateString) {
		return null;
	}

	var regexp = /^[0-3]?[0-9] (January|February|March|April|May|June|July|August|September|October|November|December)$/;

	if (regexp.test(dateString)) {
		var currentYear = new Date().getFullYear();
		var dayString = '';
		var monthString = '';
		var dateParts = dateString.split(' ');
		if (dateParts[0].length === 1) {
			dayString = '0' + dateParts[0];
		} else {
			dayString = dateParts[0].toString();
		}

		switch(dateParts[1]) {
			case 'January':
				monthString = '01';
				break;
			case 'February':
				monthString = '02';
				break;
			case 'March':
				monthString = '03';
				break;
			case 'April':
				monthString = '04';
				break;
			case 'May':
				monthString = '05';
				break;
			case 'June':
				monthString = '06';
				break;
			case 'July':
				monthString = '07';
				break;
			case 'August':
				monthString = '08';
				break;
			case 'September':
				monthString = '09';
				break;
			case 'October':
				monthString = '10';
				break;
			case 'November':
				monthString = '11';
				break;
			case 'December':
				monthString = '12'
				break;
		}

		var momentDate = moment(new Date(util.format('%s-%s-%s', currentYear, monthString, dayString)));
		if (momentDate.isValid()) {
			return momentDate.toDate();
		}
	}

	return null;
}

module.exports = {
	isDateValid: isDateValid,
	calculateNumberOfMonths: calculateNumberOfMonths,
	isRangeValid: isRangeValid,
	getMonthsInYear: getMonthsInYear,
	specialisedParseDate: specialisedParseDate
};
