const HourRange = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const WeekdayRange = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
const MonthRange = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateRange = [];
let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (var i = 0; i < 12; ++i) {
	var nonTrivialIndex = Math.floor(months[i]/2);
	for (var j = 0; j < months[i]; ++j) {
		if (j === nonTrivialIndex)
			DateRange.push(MonthRange[i]);
		else
			DateRange.push('');
	}
}

export const COMPARATORS = {
	'lt': (cell, test) => cell < test,
	'gt': (cell, test) => cell > test
};

export const LABEL_DICT = {
	Hour: HourRange,
	Weekday:  WeekdayRange,
	Month: MonthRange,
	Date: DateRange
};

export const TIME_GETTERS = {
	Minute: date => date.getMinutes(),
	Hour: date => date.getHours(),
	Weekday: date => date.getDay(),
	Month: date => date.getMonth(),
	Date: date => {
		let start = new Date(date.getFullYear(), 0, 0);
		let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
		let oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	}
}